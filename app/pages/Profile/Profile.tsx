import { useEffect, useState } from "react";
import { useLang } from "@/providers/LangProvider";
import { Card, Avatar, Button, Form, Input, DatePicker } from "antd";
import {
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "@/hooks/translation";

import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Copy } from "lucide-react";
import useApp from "antd/es/app/useApp";
import { getImage } from "@/lib/utils";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import {
  UsersRecord,
  CitiesRecord,
  TranslationsRecord,
} from "@/types/pocketbaseTypes";

interface UserProfile {
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  city: string;
  rating: number;
  completedTasks: number;
  pendingTasks: number;
  cancelledTasks: number;
}

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const t = useTranslation();
  const rawLang = useLang().lang as string;
  const lang = (rawLang === "en" ? "eng" : rawLang) as keyof TranslationsRecord;
  const [pocketbase_auth] = useLocalStorage("pocketbase_auth", null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Abrorjon",
    birthDate: "16.04.1997",
    phone: "+998 91 797 74 97",
    address: "Farg'ona viloyati, Bag'dod tumani",
    city: "Toshkent shahri, Chilonzor tumani",
    rating: 4.7,
    completedTasks: 14,
    pendingTasks: 2,
    cancelledTasks: 1,
  });

  const userId = pocketbase_auth?.record?.id;
  const [cityId, setCityId] = useState<string | null>(null);
  const [bornCityId, setBornCityId] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      name: userProfile.name,
      birthDate: dayjs(userProfile.birthDate, "DD.MM.YYYY"),
      phone: userProfile.phone,
      address: userProfile.address,
      city: userProfile.city,
    });
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };
  const { one, update } = usePocketBaseCollection<UsersRecord>("users");
  // const { one: oneRegion } = usePocketBaseCollection<RegionsRecord>("regions");
  const { one: oneCity } = usePocketBaseCollection<CitiesRecord>("cities");

  const { data: userData, refetch } = one(userId || "");
  const { data: userCity } = oneCity(cityId || "", "name");
  const { data: userBornCity } = oneCity(bornCityId || "", "name");

  const { message } = useApp();
  const { mutate } = update();
  useEffect(() => {
    if (userData) {
      setUserProfile((p) => ({
        ...p,
        name: userData.fullname || "",
        birthDate: dayjs(userData.birthDate).format("DD.MM.YYYY"),
        phone: userData.phoneNumber || "",
        address: userData.liveCity || "",
        city: userData.liveCity || "",
        avatar: userData.avatar || "",
      }));

      if (userData.liveCity) {
        setCityId(userData.liveCity);
      }
      if (userData.bornCity) {
        setBornCityId(userData.bornCity);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userCity) {
      setUserProfile((p) => ({
        ...p,
        city: (userCity.expand?.name?.[lang] as string) || "",
      }));
    }
  }, [userCity, lang]);

  useEffect(() => {
    if (userBornCity) {
      setUserProfile((p) => ({
        ...p,
        address: (userBornCity.expand?.name?.[lang] as string) || "",
      }));
    }
  }, [userBornCity, lang]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        fullname: values.name,
        birthDate: dayjs(values.birthDate).format("YYYY-MM-DD"),
      };
      await mutate({
        id: pocketbase_auth?.record?.id || "",
        data: updatedData,
      });
      message.success(
        t({
          uz: "Profil muvaffaqiyatli yangilandi!",
          ru: "Профиль успешно обновлен!",
          en: "Profile updated successfully!",
        })
      );
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(
        t({
          uz: "Profilni yangilashda xatolik yuz berdi!",
          ru: "Произошла ошибка при обновлении профиля!",
          en: "Error updating profile!",
        })
      );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isEditing ? (
        <motion.div
          key="edit"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="max-w-md mx-auto">
            {/* Header */}
            <motion.div
              className="flex text-center relative items-center justify-center mb-6"
              variants={containerVariants}
            >
              <div
                className="absolute top-0 left-0 cursor-pointer"
                onClick={() => setIsEditing(false)}
              >
                <svg
                  width="8"
                  height="24"
                  viewBox="0 0 8 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18L1 12L7 6"
                    stroke="#090A0A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-lg font-medium">Ma'lumotlarni tahrirlash</h1>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              className="flex justify-center mb-8"
              variants={cardVariants}
            >
              <div className="relative">
                <Avatar
                  size={100}
                  src="/lovable-uploads/91a1c7e9-8344-469a-a72e-d48888854bfb.png"
                  icon={<UserOutlined />}
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <EditOutlined className="text-white text-sm" />
                </div>
              </div>
            </motion.div>

            {/* Edit Form */}
            <motion.div variants={containerVariants}>
              <Form form={form} layout="vertical" className="space-y-4">
                <Form.Item
                  label="Ism"
                  name="name"
                  rules={[{ required: true, message: "Ismni kiriting!" }]}
                >
                  <Input size="large" placeholder="Abrorjon" />
                </Form.Item>

                <Form.Item
                  label="Tug'ilgan sana"
                  name="birthDate"
                  rules={[
                    { required: true, message: "Tug'ilgan sanani kiriting!" },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="DD.MM.YYYY"
                    placeholder="16.04.1997"
                  />
                </Form.Item>

                <Form.Item
                  label="Telefon raqami"
                  name="phone"
                  rules={[
                    { required: true, message: "Telefon raqamini kiriting!" },
                  ]}
                >
                  <Input size="large" placeholder="+998 91 797 74 97" />
                </Form.Item>

                <Form.Item
                  label="Tug'ilgan joyi"
                  name="address"
                  rules={[
                    { required: true, message: "Tug'ilgan joyini kiriting!" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Farg'ona viloyati, Bag'dod tumani"
                  />
                </Form.Item>

                <Form.Item
                  label="Yashash manzili"
                  name="city"
                  rules={[
                    { required: true, message: "Yashash manzilini kiriting!" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Toshkent shahri, Chilonzor tumani"
                  />
                </Form.Item>
              </Form>
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="mt-8 space-y-3" variants={containerVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-green-500 hover:bg-green-600 border-green-500 h-12 rounded-lg font-medium"
                  icon={<CalendarOutlined />}
                  onClick={handleSave}
                >
                  Saqlash
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="view"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className=""
        >
          <div className="max-w-md mx-auto">
            {/* Header */}
            <motion.div className="relative mb-6" variants={containerVariants}>
              <h1 className="text-center text-xl">
                {userData?.fullname ||
                  t({
                    uz: "Nomalum Foydalanuvchi",
                    ru: "Неизвестный пользователь",
                    en: "Unknown User",
                  })}
              </h1>
              <div
                className="absolute top-0 right-0 cursor-pointer"
                onClick={handleEdit}
              >
                <EditOutlined />
              </div>
            </motion.div>

            {/* Profile Section */}
            <motion.div className="text-center mb-6" variants={cardVariants}>
              <Avatar
                size={100}
                src={getImage(
                  userData?.collectionName || "",
                  userData?.id || "",
                  userData?.avatar || ""
                )}
                icon={<UserOutlined />}
                className="mb-6"
              />
              <div
                className="text-gray-500 font-light text-[12px] cursor-pointer flex items-center justify-center gap-1"
                title="ID ni nusxalash"
                onClick={() => {
                  navigator.clipboard.writeText(pocketbase_auth?.record?.id);
                  message.success(
                    t({
                      uz: "ID nusxalandi",
                      ru: "ID скопирован",
                      en: "ID copied",
                    })
                  );
                }}
              >
                {" "}
                <Copy size={12} />
                {pocketbase_auth?.record?.id}
              </div>
              {/* <div className="flex items-center justify-center gap-2 mb-2 mt-4">
                <Rate
                  disabled
                  defaultValue={userProfile.rating}
                  className="text-sm"
                />
                <span className="font-medium">{userProfile.rating}</span>
                <span className="text-gray-500">15 ta ovoz</span>
              </div> */}
            </motion.div>

            {/* Stats Cards */}
            {/* <motion.div
              className="grid grid-cols-3 gap-1 mb-6 bg-white rounded-lg p-4 shadow-sm"
              variants={cardVariants}
            >
              <div className="border-r-2 text-center border-dashed">
                <div className="text-green-600 text-sm">Bajarilgan</div>
                <div className="text-sm font-light">
                  {userProfile.completedTasks} marta
                </div>
              </div>
              <div className="border-r-2 border-dashed -ml-1 text-center">
                <div className="text-orange-500 text-sm">Bekor qilingan</div>
                <div className="text-sm font-light">
                  {userProfile.pendingTasks} marta
                </div>
              </div>
              <div className="ml-1 text-center">
                <div className="text-red-500 text-sm">Kelmagan</div>
                <div className="text-sm font-light">
                  {userProfile.cancelledTasks} marta
                </div>
              </div>
            </motion.div> */}

            {/* Profile Information */}
            <motion.div variants={cardVariants}>
              <Card className="border-0 shadow-sm mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">Ism</span>
                    <span className="font-medium">{userProfile.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">Tug'ilgan sana</span>
                    <span className="font-medium">{userProfile.birthDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">Telefon raqami</span>
                    <span className="font-medium">{userProfile.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">Tug'ilgan joyi</span>
                    <span className="font-medium text-right ml-4">
                      {userProfile.address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">Yashash manzili</span>
                    <span className="font-medium text-right ml-4">
                      {userProfile.city}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Action Button */}
            {/* <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="primary"
                size="large"
                className="w-full bg-green-500 hover:bg-green-600 border-green-500 h-12 mt-4 rounded-lg font-medium"
                onClick={handleEdit}
              >
                Baholash →
              </Button>
            </motion.div> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePage;
