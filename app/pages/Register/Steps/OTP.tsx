import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import { type RegisterContextType, useRegister } from "../Register";
import { pb } from "@/pb/pb";
import { useQueryParam } from "@/hooks/useQueryParam";
import useApp from "antd/es/app/useApp";

const { Title, Text } = Typography;

const OTP = () => {
  const { payload, setStep, setPayload, setisEdit } = useRegister() as RegisterContextType;
  const { user } = useUser();
  const t = useTranslation();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { message } = useApp();

  // Format phone number for display
  const formatDisplayPhone = (phone: string) => {
    if (!phone) {
      return user?.phoneNumber || "";
    }
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.match(/^[0-9]?$/)) {
      // Allow only single digit or empty
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // If input is filled and not the last one, move to next
      if (value && index < 3) {
        setActiveIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle key down for navigation and backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace is pressed, go to previous field
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();

        // Clear the previous field
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP digit click
  const handleOtpDigitClick = (index: number) => {
    setActiveIndex(index);
    inputRefs.current[index]?.focus();
  };

  const handleEditPhone = async () => {
    // Reset OTP state
    setOtp(["", "", "", ""]);
    setActiveIndex(0);
    setTimeLeft(60);
    setCanResend(false);
    
    // Clear the registration OTP ID from sessionStorage
    sessionStorage.removeItem("registration_otp_id");
    
    // Reset the isEdit state to prevent update mode and force create mode
    setisEdit({ bool: false, id: "" });
    
    // Clear the phone number from payload but keep other data
    setPayload((p) => ({ ...p, phone: "", otp: "" }));
    
    // Log out the current user to reset authentication state
    try {
      pb.authStore.clear();
    } catch (error) {
      console.log("Auth clear error:", error);
    }
    
    // Go back to phone number step
    setStep(1);
  };

  // Handle continue button
  const handleContinue = async () => {
    // Get OTP ID from payload first, then fallback to sessionStorage
    const otpId = payload.otp || sessionStorage.getItem("registration_otp_id") || "";

    if (otp.join("").length === 4) {
      await pb
        .collection("users")
        .authWithOTP(otpId || "", otp.join(""))
        .then(() => {
          // Clear the OTP ID from sessionStorage after successful verification
          sessionStorage.removeItem("registration_otp_id");
          setStep(3);
        })
        .catch((err) => {
          console.error(err);
          message.error(err.message || "Failed to verify OTP");
        });
    }
  };

  // Handle resend code
  const { chat_id } = useQueryParam();
  const handleResend = async () => {
    if (canResend) {
      setTimeLeft(60); // Reset timer
      setCanResend(false);
      try {
        const req = await pb.collection("users").requestOTP(chat_id + "@gmail.com");
        // Update both payload and sessionStorage with new OTP ID
        setPayload((p) => ({ ...p, otp: req.otpId }));
        sessionStorage.setItem("registration_otp_id", req.otpId);
      } catch (error) {
        console.error("Error resending OTP:", error);
        message.error("Failed to resend OTP");
      }
    }
  };

  // Focus the active input on mount and when activeIndex changes
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

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

  return (
    <motion.div
      className="min-h-screen w-full bg-white flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center p-6">
        <button
          onClick={() => setStep((p) => p - 1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-gray-800" />
        </button>
        <Title level={5} className="m-0 ml-4">
          {t({
            uz: "Telefon raqamini tasdiqlash",
            ru: "Подтверждение номера телефона",
            en: "Verify phone number",
          })}
        </Title>
      </motion.div>

      <div className="flex-1 flex flex-col items-center px-6">
        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-6 w-full">
          <Title level={2} className="mb-2">
            {t({
              uz: "Tasdiqlash kodini kiriting",
              ru: "Введите код подтверждения",
              en: "Enter verification code",
            })}
          </Title>
          <Text className="text-gray-600 text-lg">
            <span className="flex items-center justify-center gap-2 flex-wrap">
              <span>{formatDisplayPhone(payload.phone || "")}</span>
              <button
                onClick={handleEditPhone}
                className="inline-flex items-center gap-1 text-green-500 hover:text-green-600 font-medium cursor-pointer disabled:opacity-50"
              >
                <Edit2 className="h-4 w-4" />
                {t({
                  uz: "O'zgartirish",
                  ru: "Изменить",
                  en: "Edit",
                })}
              </button>
            </span>
            <span className="block mt-1">
              {t({
                uz: "telefon raqamingizga yuborilgan smsdagi 4 raqamli kodni kiriting",
                ru: "введите 4-значный код из SMS, отправленного на ваш номер телефона",
                en: "enter the 4-digit code sent in the SMS to your phone number",
              })}
            </span>
          </Text>
        </motion.div>

        {/* OTP Input */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-4 mb-8"
        >
          {otp.map((digit, index) => (
            <div
              key={index}
              onClick={() => handleOtpDigitClick(index)}
              className={`w-16 h-16 flex items-center justify-center rounded-full border-2 text-2xl font-bold cursor-pointer transition-all ${
                index === activeIndex
                  ? "border-green-500"
                  : digit
                  ? "border-gray-300 bg-white"
                  : "border-gray-200"
              }`}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                autoFocus
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full h-full text-center bg-transparent border-none outline-none text-2xl font-bold"
                style={{ caretColor: "transparent" }}
              />
            </div>
          ))}
        </motion.div>

        {/* Timer */}
        <motion.div variants={itemVariants} className="mb-6">
          <Text className="text-gray-400 text-lg">{formatTime(timeLeft)}</Text>
        </motion.div>

        {/* Resend Code */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`text-${
              canResend ? "green" : "gray"
            }-500 font-medium cursor-pointer`}
          >
            {t({
              uz: "Kodni qayta yuborish",
              ru: "Отправить код повторно",
              en: "Resend code",
            })}
          </button>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="p-4 bg-white border-t border-gray-100 sticky bottom-0"
      >
        <Button
          type="primary"
          onClick={handleContinue}
          disabled={otp.join("").length !== 4}
          className={`w-full h-14 rounded-full text-lg font-medium flex items-center justify-center ${
            otp.join("").length === 4
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
          size="large"
        >
          <span>
            {t({
              uz: "Davom etish",
              ru: "Продолжить",
              en: "Continue",
            })}
          </span>
          <span className="ml-2">→</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default OTP;
