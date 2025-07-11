/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Button, Input, DatePicker, Select } from "antd";
import { Camera, ChevronRight, User } from "lucide-react";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import { useQueryParam } from "@/hooks/useQueryParam";
import {
  type RegisterContextType,
  useRegister,
  itemVariants,
} from "../Register";
import { useNavigateWithChatId } from "@/hooks/useNavigate";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import useApp from "antd/es/app/useApp";
import {
  UsersRecord,
  RegionsRecord,
  UsersRoleOptions,
  CitiesRecord,
} from "@/types/pocketbaseTypes";
import { useRef, useEffect } from "react";
import dayjs from "dayjs";

const Profile = () => {
  const { payload, handleChange, stateValidation, setPayload, isEdit } =
    useRegister() as RegisterContextType;
  const { user, fetchUser } = useUser();
  const { chat_id } = useQueryParam();
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useNavigateWithChatId();

  const { update } = usePocketBaseCollection<UsersRecord>("users");
  const { list: listRegions } =
    usePocketBaseCollection<RegionsRecord>("regions");
  const { list: listCities } = usePocketBaseCollection<CitiesRecord>("cities");

  const { data: regions } = listRegions({ expand: "name" });
  const { data: cities } = listCities({
    expand: "name",
  });

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up the preview URL when component unmounts
      if (payload?.avatarPreview) {
        URL.revokeObjectURL(payload.avatarPreview);
      }
    };
  }, [payload?.avatarPreview]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        message.error(
          t({
            uz: "Faqat rasm fayllari qabul qilinadi (JPEG, PNG, GIF, WebP)",
            ru: "Принимаются только файлы изображений (JPEG, PNG, GIF, WebP)",
            en: "Only image files are accepted (JPEG, PNG, GIF, WebP)",
          })
        );
        return;
      }

      if (file.size > maxSize) {
        message.error(
          t({
            uz: "Fayl hajmi 5MB dan kichik bo'lishi kerak",
            ru: "Размер файла должен быть меньше 5МБ",
            en: "File size must be less than 5MB",
          })
        );
        return;
      }

      // Store the actual File object for backend upload
      setPayload((prevPayload) => ({
        ...prevPayload,
        avatar: file, // Store the File object, not the data URL
        avatarPreview: URL.createObjectURL(file), // Create preview URL for display
      }));
    }
  };

  const { mutate, isPending } = update();
  const { message } = useApp();

  const handleContinue = () => {
    const userId = isEdit.id || user?.id;

    // Prepare the data object
    const updateData: any = {
      fullname: [payload?.fullName, payload?.familyName]
        .filter(Boolean)
        .join(" "),
      role: payload?.userType as UsersRoleOptions,
      liveCity: payload?.residencePlace?.district,
      bornCity: payload?.birthPlace?.district,
      language: payload.lang,
      birthDate: payload?.birthDate
        ? dayjs(payload.birthDate, "DD.MM.YYYY").format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      verified: true, // Mark user as verified after profile completion
    };

    // If there's a new avatar file, include it
    if (payload?.avatar instanceof File) {
      updateData.avatar = payload.avatar;
    }

    mutate(
      {
        id: userId || "",
        data: updateData,
      },
      {
        onSuccess: async () => {
          // Clean up the preview URL to prevent memory leaks
          if (payload?.avatarPreview) {
            URL.revokeObjectURL(payload.avatarPreview);
          }

          // Clean up registration-related session storage
          sessionStorage.removeItem("registration_otp_id");
          sessionStorage.removeItem("registration_state");

          // Refresh user data in context to get the updated information
          try {
            await fetchUser(chat_id);

            // Handle successful update
            message.success(
              t({
                uz: "Profil muvaffaqiyatli yangilandi",
                ru: "Профиль успешно обновлен",
                en: "Profile updated successfully",
              })
            );

            // Navigate based on user role
            const userRole = payload?.userType || user?.role;
            if (userRole === "player") {
              navigate("/client/home");
            } else if (userRole === "manager") {
              navigate("/dashboard/home");
            } else {
              // Fallback to dashboard if role is unclear
              navigate("/dashboard/home");
            }
          } catch (fetchError) {
            console.error("Error refreshing user data:", fetchError);
            // Still navigate even if refresh fails
            const userRole = payload?.userType || user?.role;
            if (userRole === "player") {
              navigate("/client/home");
            } else {
              navigate("/dashboard/home");
            }
          }
        },
        onError: (error) => {
          // Handle error
          message.error(
            t({
              uz: "Profilni yangilashda xatolik yuz berdi",
              ru: "Произошла ошибка при обновлении профиля",
              en: "An error occurred while updating the profile",
            }) + `: ${error.message}`
          );
        },
      }
    );
  };

  // Animation variants from the imported itemVariants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Check if user is a player
  const payloadUserType = payload?.userType || user?.role;
  const isPlayer = payloadUserType === "player";

  // Handle extended field changes
  const handleExtendedChange = (field: string, value: any) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      [field]: value,
    }));
  };

  // Handle nested field changes
  const handleNestedChange = (
    parentField: string,
    field: string,
    value: any
  ) => {
    setPayload((prevPayload: any) => ({
      ...prevPayload,
      [parentField]: {
        ...prevPayload[parentField],
        [field]: value,
      },
    }));
  };

  // Determine if form is valid based on user type
  const isFormValid = isPlayer
    ? payload?.fullName?.trim() &&
      payload?.familyName?.trim() &&
      payload?.birthDate &&
      payload?.birthPlace?.region &&
      payload?.birthPlace?.district &&
      payload?.residencePlace?.region &&
      payload?.residencePlace?.district
    : payload?.fullName?.trim();

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex-1 flex flex-col items-center ">
        {/* Avatar */}
        <motion.div
          variants={itemVariants}
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-25 h-25 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={handleAvatarClick}
          >
            {payload?.avatarPreview || payload?.avatar ? (
              <img
                src={
                  payload?.avatarPreview ||
                  payload?.avatar ||
                  "/placeholder.svg"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-15 w-15 text-gray-400" />
            )}
          </div>
          <div
            className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Camera className="h-4 w-4 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </motion.div>

        {/* Name Input */}
        <motion.div variants={itemVariants} className="w-full mb-6 px-4">
          <label className="block text-gray-700 text-lg mb-2">
            {t({
              uz: "Ismingiz:",
              ru: "Ваше имя:",
              en: "Your name:",
            })}
          </label>
          <Input
            size="large"
            value={payload?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder={
              t({
                uz: "Ismingizni kiriting...",
                ru: "Введите ваше имя...",
                en: "Enter your name...",
              }) as string
            }
            className="text-lg rounded-lg"
            status={stateValidation?.fullName ? "error" : ""}
          />
          {stateValidation?.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {t({
                uz: "Ismingizni kiriting",
                ru: "Введите ваше имя",
                en: "Please enter your name",
              })}
            </p>
          )}
        </motion.div>

        {/* Player-specific fields */}
        {isPlayer && (
          <>
            {/* Family Name */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: "Familiyangiz:",
                  ru: "Ваша фамилия:",
                  en: "Your family name:",
                })}
              </label>
              <Input
                size="large"
                value={payload?.familyName || ""}
                onChange={(e) =>
                  handleExtendedChange("familyName", e.target.value)
                }
                placeholder={
                  t({
                    uz: "Familiyangizni kiriting...",
                    ru: "Введите вашу фамилию...",
                    en: "Enter your family name...",
                  }) as string
                }
                className="text-lg rounded-lg"
                status={stateValidation?.familyName ? "error" : ""}
              />
              {stateValidation?.familyName && (
                <p className="text-red-500 text-sm mt-1">
                  {t({
                    uz: "Familiyangizni kiriting",
                    ru: "Введите вашу фамилию",
                    en: "Please enter your family name",
                  })}
                </p>
              )}
            </motion.div>

            {/* Birth Date */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: "Tug'ilgan sanangiz:",
                  ru: "Дата рождения:",
                  en: "Date of birth:",
                })}
              </label>
              <DatePicker
                size="large"
                value={
                  payload?.birthDate
                    ? dayjs(payload.birthDate, "DD.MM.YYYY")
                    : null
                }
                onChange={(date, dateString) => {
                  console.log(date);
                  // dateString = "20.04.2000"

                  handleExtendedChange("birthDate", dateString);
                }}
                placeholder="--.--.----"
                format="DD.MM.YYYY"
                allowClear
                className="w-full text-lg rounded-lg"
                defaultPickerValue={dayjs("01.01.2000", "DD.MM.YYYY")}
                status={stateValidation?.birthDate ? "error" : ""}
              />

              {stateValidation?.birthDate && (
                <p className="text-red-500 text-sm mt-1">
                  {t({
                    uz: "Tug'ilgan sanangizni kiriting",
                    ru: "Введите дату рождения",
                    en: "Please enter your date of birth",
                  })}
                </p>
              )}
            </motion.div>

            {/* Birth Place */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2">
                {t({
                  uz: "Tug'ilgan joyingiz:",
                  ru: "Место рождения:",
                  en: "Place of birth:",
                })}
              </label>
              <div className="space-y-4">
                <Select
                  size="large"
                  value={payload?.birthPlace?.region}
                  onChange={(value) => {
                    handleNestedChange("birthPlace", "region", value);
                  }}
                  placeholder={
                    t({
                      uz: "Viloyat / shahar",
                      ru: "Область / город",
                      en: "Region / city",
                    }) as string
                  }
                  options={
                    regions?.map((region) => ({
                      label: t({
                        uz: region?.expand?.name?.uz || "",
                        ru: region?.expand?.name?.ru || "",
                        en: region?.expand?.name?.eng || "",
                      }),
                      value: region?.id,
                    })) || []
                  }
                  className="w-full text-lg rounded-lg"
                  status={stateValidation?.birthPlace?.region ? "error" : ""}
                />
                <Select
                  size="large"
                  value={payload?.birthPlace?.district}
                  onChange={(value) =>
                    handleNestedChange("birthPlace", "district", value)
                  }
                  style={{ marginTop: "20px" }}
                  placeholder={
                    t({
                      uz: "Tuman / shaharcha",
                      ru: "Район / городок",
                      en: "District / town",
                    }) as string
                  }
                  options={
                    cities
                      ?.filter((el) => el.region == payload?.birthPlace?.region)
                      .map((city) => ({
                        label: t({
                          uz: city?.expand?.name?.uz || "",
                          ru: city?.expand?.name?.ru || "",
                          en: city?.expand?.name?.eng || "",
                        }),
                        value: city?.id,
                      })) || []
                  }
                  className="w-full text-lg rounded-lg"
                  status={stateValidation?.birthPlace?.district ? "error" : ""}
                />
              </div>
            </motion.div>

            {/* Residence Place */}
            <motion.div variants={itemVariants} className="w-full mb-6 px-4">
              <label className="block text-gray-700 text-lg mb-2 mt-1">
                {t({
                  uz: "Yashash manzilingiz:",
                  ru: "Место проживания:",
                  en: "Place of residence:",
                })}
              </label>
              <div className="space-y-4">
                <Select
                  size="large"
                  value={payload?.residencePlace?.region}
                  onChange={(value) =>
                    handleNestedChange("residencePlace", "region", value)
                  }
                  placeholder={
                    t({
                      uz: "Viloyat / shahar",
                      ru: "Область / город",
                      en: "Region / city",
                    }) as string
                  }
                  options={
                    regions?.map((region) => ({
                      label: t({
                        uz: region?.expand?.name?.uz || "",
                        ru: region?.expand?.name?.ru || "",
                        en: region?.expand?.name?.eng || "",
                      }),
                      value: region?.id,
                    })) || []
                  }
                  className="w-full text-lg rounded-lg"
                  status={
                    stateValidation?.residencePlace?.region ? "error" : ""
                  }
                />
                <Select
                  size="large"
                  value={payload?.residencePlace?.district}
                  onChange={(value) =>
                    handleNestedChange("residencePlace", "district", value)
                  }
                  placeholder={
                    t({
                      uz: "Tuman / shaharcha",
                      ru: "Район / городок",
                      en: "District / town",
                    }) as string
                  }
                  className="w-full text-lg rounded-lg mt-1"
                  style={{ marginTop: "20px" }}
                  status={
                    stateValidation?.residencePlace?.district ? "error" : ""
                  }
                  options={
                    cities
                      ?.filter(
                        (el) => el.region == payload?.residencePlace?.region
                      )
                      .map((city) => ({
                        label: t({
                          uz: city?.expand?.name?.uz || "",
                          ru: city?.expand?.name?.ru || "",
                          en: city?.expand?.name?.eng || "",
                        }),
                        value: city?.id,
                      })) || []
                  }
                />
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Continue Button */}
      <motion.div variants={itemVariants} className="p-4 mb-4">
        <Button
          type="primary"
          onClick={handleContinue}
          disabled={!isFormValid}
          loading={isPending}
          className={`w-full h-14 rounded-full text-lg font-medium flex items-center justify-center ${
            isFormValid
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
          size="large"
        >
          <span>
            {t({
              uz: "Kirish",
              ru: "Войти",
              en: "Enter",
            })}
          </span>
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
