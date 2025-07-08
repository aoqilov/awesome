import {
  itemVariants,
  type RegisterContextType,
  useRegister,
} from "../Register";
import { useLang } from "@/providers/LangProvider";
import { useTranslation } from "@/hooks/translation";
import { motion } from "framer-motion";
import { Button } from "antd";
import { ChevronRight } from "lucide-react";
import { UsersLanguageOptions } from "@/types/pocketbaseTypes";
import { useLocation } from "react-router-dom";

interface Language {
  code: string;
  name: string;
  value: UsersLanguageOptions;
}

const SelectLang = () => {
  const location = useLocation();
  console.log("Current Location:", location.pathname);
  const { setStep, payload, setPayload } = useRegister() as RegisterContextType;
  const { setLang } = useLang();
  const t = useTranslation();
  const handleNext = () => {
    if (payload.lang) {
      setStep(1);
    }
  };

  const languages: Language[] = [
    {
      code: "uz",
      name: "O'zbekcha",
      value: UsersLanguageOptions.uzbek,
    },
    {
      code: "ru",
      name: "Русский",
      value: UsersLanguageOptions.russian,
    },
    {
      code: "en",
      name: "English",
      value: UsersLanguageOptions.english,
    },
  ];

  return (
    <div className="h-[95vh] w-full bg-white flex flex-col relative">
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 ">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium text-gray-800">
            {t({
              uz: "Tilni tanlash",
              en: "Select a language",
              ru: "Выберите язык",
            })}
          </h1>
        </div>
        <div className="mb-8 mt-20 flex justify-start w-full">
          <svg
            width="138"
            height="118"
            viewBox="0 0 138 118"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M130.161 34.174H81.9476L74.0943 0.0913087H7.84064C3.51702 0.0907045 0 3.60833 0 7.93135V75.9861C0 80.3091 3.51702 83.8267 7.84064 83.8267H56.0518L63.9057 117.909H130.161C134.484 117.909 138.001 114.392 138.001 110.069V42.014C138 37.691 134.484 34.174 130.161 34.174ZM9.06293 74.7632V9.15363H66.882L82.0002 74.7632H9.06293ZM65.3522 83.8261H82.3875L69.6184 102.34L65.3522 83.8261ZM128.937 108.846H76.1407L85.9256 94.6587L87.4107 97.0779C93.3325 93.4419 98.0071 89.1944 101.698 84.8714L113.168 96.5722L117.915 91.9193L105.769 79.5297C110.877 72.0081 113.271 64.9305 114.274 61.1736H122.067V54.5275H105.559V50.567H98.9128V54.5275H86.6374L84.0357 43.2363H128.936V108.846H128.937ZM93.3874 83.8261H93.3892L91.1507 74.1119L97.0048 80.0831C95.803 81.5272 94.4792 82.9621 93.0243 84.3663L93.3935 83.8304L93.3874 83.8261ZM93.3119 66.8223L90.1786 69.894L88.169 61.1736H107.34C106.323 64.4188 104.398 69.355 100.988 74.6526L93.3119 66.8223ZM40.9832 37.4263H63.3831V41.9578C63.3831 54.3088 53.3347 64.3577 40.9832 64.3577C28.6316 64.3577 18.5832 54.3088 18.5832 41.9578C18.5832 29.6069 28.6316 19.5585 40.9832 19.5585C45.9744 19.5585 50.6968 21.1644 54.6398 24.2023L49.1084 31.382C46.7653 29.576 43.9558 28.622 40.9832 28.622C33.6295 28.622 27.6462 34.6048 27.6462 41.9584C27.6462 49.3127 33.6289 55.2954 40.9832 55.2954C46.7466 55.2954 51.6684 51.6195 53.5275 46.4899H40.9832V37.4263Z"
              fill="#E3E5E6"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-medium text-gray-800 mb-8 text-left  w-full">
          {t({
            uz: "Tilni tanlang",
            en: "Select a language",
            ru: "Выберите язык",
          })}
        </h2>
        <div className="w-full max-w-md space-y-6">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setPayload({ ...payload, lang: language.value });
                setLang(language.code);
              }}
              className="w-full flex items-center space-x-4"
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  payload.lang === language.value
                    ? "bg-[#42BA3D]"
                    : "border-2 border-gray-300"
                }`}
              >
                {payload.lang === language.value && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium text-xl text-gray-800">
                {language.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.div variants={itemVariants} className="p-4 ">
        <Button
          type="primary"
          onClick={handleNext}
          disabled={!payload.lang}
          className={`w-full h-14  rounded-full text-lg font-medium flex items-center justify-center absolute bottom-0 left-0 right-0 bg-white ${
            payload.lang
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-200 text-gray-400"
          }`}
          size="large"
        >
          <span>{t({ uz: "Keyingisi", en: "Next", ru: "Далее" })}</span>
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default SelectLang;
