import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import React, { useState, useRef } from "react";

const ArenaSms = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const t = useTranslation();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // faqat raqam ruxsat
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // focus next
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevIndex = index - 1;
      inputsRef.current[prevIndex]?.focus();
    }
  };

  const handleContinue = () => {
    const fullCode = code.join("");
    console.log("Kiritilgan kod:", fullCode);
    // serverga yuborish yoki tekshirish funksiyasi shu yerda bo‘ladi
  };

  return (
    <div className="w-full mx-auto p-6 rounded-xl space-y-6 text-center">
      {/* header */}
      <div className="flex items-center">
        <span className="cursor-pointer flex items-center justify-center ">
          <BackBtn />
        </span>
        <h5 className="text-center w-[90%] text-[18px]">
          {t({ uz: "usStadium", en: "usStadium", ru: "usStadium" })}
        </h5>
      </div>
      {/* text */}
      <h4 className="text-2xl font-medium">
        {t({
          uz: "Tasdiqlash kodini kiriting",
          en: "Enter verification code",
          ru: "Введите код подтверждения",
        })}
      </h4>
      <p className="text-gray-600">
        <span className="font-medium">+998 90 123 45 67 </span>
        {t({
          uz: "telefon raqamingizga yuborilgan smsdagi 4 raqamli kodni kiriting",
          en: "enter the 4-digit code sent in the SMS to your phone number",
          ru: "введите 4-значный код из SMS, отправленного на ваш номер телефона",
        })}
      </p>
      {/* Inputlar */}
      <div className="flex justify-center gap-3">
        {code.map((val, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-14 h-14 text-center border border-ggreen-400 rounded-full text-lg font-bold"
            value={val}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>
      {/* Taymer */}
      <div className="text-sm text-gray-500 mt-15">05:24</div>
      {/* Davom etish */}
      <button
        onClick={handleContinue}
        className="w-full py-3 rounded-xl bg-green-600 text-white hover:bg-blue-700 transition mt-20"
      >
        {t({ uz: "Davom etish", en: "Continue", ru: "Продолжить" })}
      </button>
      {/* Kod qayta yuborish */}
      <button className="text-sm text-blue-600 hover:underline">
        {t({
          uz: "Kodni qayta yuborish",
          en: "Resend code",
          ru: "Отправить код повторно",
        })}
      </button>
    </div>
  );
};

export default ArenaSms;
