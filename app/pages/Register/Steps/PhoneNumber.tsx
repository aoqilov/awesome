"use client";

import { useEffect, type JSX } from "react";
import { motion } from "framer-motion";
import { Phone, Check, ChevronRight } from "lucide-react";
import { App, Button, Segmented } from "antd";
import { type RegisterContextType, useRegister } from "../Register";
import { useTranslation } from "@/hooks/translation";
import { formatPhoneNumber, unformatPhoneNumber } from "@/lib/utils";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import { pb } from "@/pb/pb";
import { useQueryParam } from "@/hooks/useQueryParam";

type PocketBaseFieldError = {
  code: string;
  message: string;
};

type PocketBaseError = Error & {
  data?: {
    data?: Record<string, PocketBaseFieldError>;
  };
};

function isPocketBaseError(error: unknown): error is PocketBaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: unknown }).data === "object"
  );
}

const PhoneNumber = () => {
  const {
    setStep,
    payload,
    setPayload,
    handleChange,
    stateValidation,
    isEdit,
    setisEdit,
  } = useRegister() as RegisterContextType;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };
  const { message } = App.useApp();
  const { create, update } = usePocketBaseCollection("users");
  const { mutate } = create();
  const { mutate: updateMutate } = update();
  const t = useTranslation();
  const { chat_id } = useQueryParam();

  useEffect(() => {
    // Remove localStorage dependency, just set in context
    setPayload((p) => ({ ...p, userType: "player" }));
  }, [setPayload]);

  const handleNext = () => {
    const data = {
      email: `${chat_id}@gmail.com`,
      password: chat_id,
      passwordConfirm: chat_id,
      phoneNumber: payload.phone,
      role: payload.userType,
    };

    const onSuccess = async () => {
      setStep(2);
      const user = await pb
        .collection("users")
        .authWithPassword(data.email, chat_id);
      const req = await pb.collection("users").requestOTP(data.email);
      setPayload((p) => ({ ...p, otp: req.otpId }));
      // Store OTP ID in sessionStorage to persist across page refreshes during registration
      sessionStorage.setItem("registration_otp_id", req.otpId);
      setisEdit({ bool: true, id: user.record.id });

      message.success(
        t({
          uz: "Tasdiqlash kodi yuborildi",
          ru: "Код подтверждения отправлен", 
          en: "Verification code sent",
        })
      );
    };

    const onError = (error: unknown) => {
      let firstFieldErrorMessage = "";

      if (isPocketBaseError(error)) {
        const fieldErrors = error.data?.data ?? {};
        firstFieldErrorMessage =
          Object.values(fieldErrors)
            .map((field) => field.message)
            .find(Boolean) ?? "";
      }

      message.error(
        firstFieldErrorMessage ||
          t({
            uz: "Xatolik yuz berdi, qayta urinib ko’ring",
            ru: "Произошла ошибка, попробуйте еще раз",
            en: "An error occurred, please try again",
          })
      );
    };

    if (isEdit.bool) {
      const payload = {
        oldPassword: chat_id,
        ...data,
      };
      updateMutate({ id: isEdit.id, data: payload }, { onSuccess, onError });
    } else {
      // Check if user already exists before creating
      pb.collection("users")
        .authWithPassword(data.email, chat_id)
        .then(async (user) => {
          // User exists, update their phone number
          const updatePayload = {
            oldPassword: chat_id,
            ...data,
          };
          updateMutate({ id: user.record.id, data: updatePayload }, { onSuccess, onError });
        })
        .catch(() => {
          // User doesn't exist, create new one
          mutate(data, { onSuccess, onError });
        });
    }
  };

  return (
    <motion.div
      className="h-[97vh] w-full bg-white flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex-1 flex flex-col px-2 py-8">
        {/* Tab Selector */}

        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center justify-center w-full"
        >
          <Segmented<{ label: JSX.Element | string; value: string }>
            options={[
              {
                label: t({
                  uz: "Futbolchi",
                  ru: "Футболист",
                  en: "Footballer",
                }),
                value: "player",
              },
              {
                label: t({
                  uz: "Stadion rahbari",
                  ru: "Директор стадиона",
                  en: "Stadium manager",
                }),
                value: "manager",
              },
            ]}
            size="large"
            onChange={(value) => {
              // Set in context only, no localStorage needed
              setPayload((p) => ({
                ...p,
                userType: value as unknown as string,
              }));
            }}
            className="mx-auto"
          />
        </motion.div>

        {/* Welcome Text */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-gray-800 mb-2"
        >
          {t({
            uz: "Xush kelibsiz!",
            ru: "Добро пожаловать!",
            en: "Welcome!",
          })}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 mb-8"
        >
          {t({
            uz: "Akkauntga kirish",
            ru: "Вход в аккаунт",
            en: "Login to account",
          })}
        </motion.p>

        {/* Phone Input */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div
            className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
              stateValidation.phone
                ? "ring-2 ring-red-500"
                : payload.phone
                ? "ring-2 ring-green-500"
                : "ring-1 ring-gray-200 focus-within:ring-blue-500"
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              required
              type="tel"
              value={
                formatPhoneNumber(payload.phone || "") === "+"
                  ? "+998"
                  : formatPhoneNumber(payload.phone || "")
              }
              name="phoneNumber"
              onChange={(e) => {
                if (e.target.value.length > 19) {
                  return;
                }
                handleChange("phone", unformatPhoneNumber(e.target.value));
              }}
              placeholder={
                t({
                  uz: "Telefon raqami",
                  ru: "Номер телефона",
                  en: "Phone number",
                }) as string
              }
              className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-gray-800"
            />
          </div>
          {stateValidation.phone && (
            <p className="text-red-500 text-sm mt-1">
              {t({
                uz: "To'g'ri telefon raqamini kiriting",
                ru: "Введите правильный номер телефона",
                en: "Please enter a valid phone number",
              })}
            </p>
          )}
          <p className="text-[#6C7072] text-[12px] font-[390]  ">
            {t({
              uz: (
                <>
                  Siz kiritgan telefon raqamingizga sms ko’rinishida 4 raqamdan
                  iborat bo’lgan tasdiqlash kodi yuboriladi.
                </>
              ),
              ru: (
                <>
                  Вам будет отправлен код подтверждения на номер телефона,
                  который вы ввели. Код состоит из 4 цифр.
                </>
              ),
              en: (
                <>
                  A verification code will be sent to the phone number you
                  entered. The code is a 4-digit number.
                </>
              ),
            })}
          </p>
        </motion.div>

        {/* Agreement Checkbox */}
        <motion.div
          variants={itemVariants}
          className="flex items-start space-x-3 mt-4"
        >
          <button
            type="button"
            onClick={() => handleChange("agree", !payload.agree)}
            className={`flex-shrink-0 w-6 h-6 rounded ${
              payload.agree ? "bg-green-500" : "border border-gray-300"
            } flex items-center justify-center mt-0.5 ${
              stateValidation.agree ? "border-red-500" : ""
            }`}
          >
            {payload.agree && <Check className="h-4 w-4 text-white" />}
          </button>
          <p className="text-gray-600 text-[12px]">
            {t({
              uz: "Men ilovanining Maxfiylik siyosati va Ommaviy oferta qoidalariga rozilik bildiraman.",
              ru: "Я согласен с Политикой конфиденциальности и Правилами публичной оферты приложения.",
              en: "I agree to the Privacy Policy and Public Offer Terms of the application.",
            })}
          </p>
        </motion.div>
        {stateValidation.agree && (
          <p className="text-red-500 text-sm mt-1 ml-9">
            {t({
              uz: "Foydalanuvchi shartnomasiga rozilik berishingiz kerak",
              ru: "Вы должны согласиться с пользовательским соглашением",
              en: "You must agree to the user agreement",
            })}
          </p>
        )}
      </div>

      {/* Footer with Next Button */}
      <motion.div variants={itemVariants} className="p-4 mb-4">
        <Button
          type="primary"
          onClick={handleNext}
          disabled={
            !payload.phone ||
            !payload.agree ||
            stateValidation.phone ||
            stateValidation.agree
          }
          className={`w-full h-14 rounded-full text-lg font-medium flex items-center justify-center ${
            payload.phone && payload.agree
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
          size="large"
        >
          <span>{t({ uz: "Keyingisi", en: "Next", ru: "Далее" })}</span>
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PhoneNumber;
