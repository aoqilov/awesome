import { Carousel, Segmented, Image, Button } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { itemVariants } from "@/pages/Register/Register";
import { FieldCard } from "./FieldCard";
import { useTranslation } from "@/hooks/translation";
import { useNavigateWithChatId } from "@/hooks/useNavigate";
import {
  StadiumsRecord,
  StadiumFeaturesRecord,
  TranslationsRecord,
  StadiumRatesRecord,
  FieldsRecord,
} from "@/types/pocketbaseTypes";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import { useLang } from "@/providers/LangProvider";
import YandexMap from "@/components/yandex-map";

type socials = {
  telegram?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
};

const TranslationText = ({ id }: { id?: string }) => {
  const t = useTranslation();
  const { one } = usePocketBaseCollection<TranslationsRecord>("translations");
  const { data } = one(id || "");
  const rawLang = useLang().lang;
  const lang = (rawLang === "en" ? "eng" : rawLang) as keyof TranslationsRecord;
  return (
    <>
      {data?.[lang] ||
        id ||
        t({ uz: "Noma'lum", en: "Unknown", ru: "Неизвестно" })}
    </>
  );
};

const Rates = ({ id }: { id?: string }) => {
  const t = useTranslation();
  const { list } = usePocketBaseCollection<StadiumRatesRecord>("stadium_rates");
  const { data: rates, isLoading } = list({
    filter: `stadium = '${id}'`,
    expand: "user",
  });
  const { lang } = useLang();

  function formatDate(dateStr: string, lang: "uz" | "ru" | "en"): string {
    const date = new Date(dateStr);

    const monthNames = {
      uz: [
        "yanvar",
        "fevral",
        "mart",
        "aprel",
        "may",
        "iyun",
        "iyul",
        "avgust",
        "sentyabr",
        "oktyabr",
        "noyabr",
        "dekabr",
      ],
      ru: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ],
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };

    const day = date.getDate();
    const month = monthNames[lang][date.getMonth()];
    const year = date.getFullYear();

    if (lang === "uz") {
      return `${day}-${month}, ${year}-yil`;
    } else if (lang === "ru") {
      return `${day} ${month} ${year} г.`;
    } else {
      return `${month} ${day}, ${year}`;
    }
  }
  if (isLoading || !rates) {
    return (
      <div className="text-center">
        {t({ uz: "Yuklanmoqda...", en: "Loading...", ru: "Загрузка..." })}
      </div>
    );
  }

  return (
    <>
      {rates.map((rate, index) => (
        <div
          key={index}
          className="min-w-[250px]  snap-center p-2 rounded-md bg-[#F2F4F5] "
        >
          <div className="flex items-center justify-start  gap-2">
            <div className=" rounded-md bg-gray-300 flex items-center justify-center py-1 px-1 ">
              <User />
            </div>
            <h1 className="text-[12px]">{rate?.expand?.user?.fullname}</h1>
          </div>
          <div className="bg-white p-2 mt-2 rounded-lg">
            <p
              className="text-[12px]"
              dangerouslySetInnerHTML={{ __html: rate.comment || "" }}
            />
            <div className="border-t border-gray-300/50 mt-2 flex items-center justify-between">
              <div className=" mt-1 flex items-center justify-start gap-2">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_3040)">
                    <path
                      d="M5 0L6.545 3.29127L10 3.82229L7.5 6.38275L8.09 10L5 8.29127L1.91 10L2.5 6.38275L0 3.82229L3.455 3.29127L5 0Z"
                      fill="#FFB323"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_3040">
                      <rect width="10" height="10" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h1 className="text-[12px]">{(rate?.score || 0).toFixed(1)}</h1>
              </div>
              {rate?.created && (
                <div className="text-[12px]">
                  {formatDate(rate?.created || "", lang)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const StadionDetail = () => {
  const { navigate } = useNavigateWithChatId();
  const [selected, setSelected] = useState("Umumiy");
  const t = useTranslation();
  const { id } = useParams();
  const { getFileUrl } = usePocketBaseFile();

  const [socials, setSocials] = useState<socials>({});

  const { one } = usePocketBaseCollection<StadiumsRecord>("stadiums");
  const { list: featuresList } =
    usePocketBaseCollection<StadiumFeaturesRecord>("stadium_features");
  const { list: fieldsList } = usePocketBaseCollection<FieldsRecord>("fields");

  const { data: stadium, isLoading } = one(id, "features");

  const { data: features, isLoading: isLoadingFeatures } = featuresList({
    expand: "name",
  });
  const { data: fields, isLoading: isLoadingFields } = fieldsList({
    expand: "size",
  });

  useEffect(() => {
    if (stadium?.socials) {
      setSocials(stadium.socials);
    }

    if (!isLoading && !stadium) {
      navigate("/dashboard/stadium");
    }
  }, [stadium, navigate, isLoading]);

  if (isLoading || isLoadingFeatures) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="">
      <div className="relative">
        {" "}
        <h1 className="text-center text-xl ">
          {stadium?.name ||
            t({ uz: "Yuklanmoqda...", en: "Loading...", ru: "Загрузка..." })}
        </h1>
        <div
          className="absolute top-0 left-0"
          onClick={() => navigate("/dashboard/stadium")}
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
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        {" "}
        <Segmented
          value={selected}
          onChange={(e) => setSelected(e as string)}
          size="large"
          options={[
            t({ uz: "Umumiy", en: "General", ru: "Общий" }),
            t({ uz: "Maydonlar", en: "Fields", ru: "Поля" }),
          ]}
        />
      </div>
      {selected === t({ uz: "Umumiy", en: "General", ru: "Общий" }) ? (
        <>
          <motion.div variants={itemVariants} className="mt-4 w-full p-2 ">
            <Carousel infinite autoplay className="w-full">
              {stadium?.images?.map((image, index) => (
                <div key={index}>
                  <Image
                    className="rounded-xl"
                    src={getFileUrl(stadium.collectionId, stadium.id, image)}
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
            </Carousel>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mt-2"
          >
            {" "}
            <div className="">
              <h1>
                {t({
                  uz: "Ish vaqtlari",
                  en: "Working hours",
                  ru: "Рабочие часы",
                })}
              </h1>
              <div className="flex p-1 justify-start gap-1.5 items-center bg-white rounded-md border px-3 mt-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_21677_12246)">
                    <path
                      d="M14.0405 0.834167V4.54725M5.95968 0.834167V4.54725M0.90918 8.26033H19.091M2.92938 2.45864H17.0708C18.1865 2.45864 19.091 3.28984 19.091 4.31518V17.311C19.091 18.3363 18.1865 19.1675 17.0708 19.1675H2.92938C1.81366 19.1675 0.90918 18.3363 0.90918 17.311V4.31518C0.90918 3.28984 1.81366 2.45864 2.92938 2.45864Z"
                      stroke="#72777A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.18177 13.6369L4.54541 13.6369"
                      stroke="#72777A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15.4547 13.6369H11.8184"
                      stroke="#72777A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_21677_12246">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p>
                  {stadium?.worktime_from}:00 - {stadium?.worktime_to}:00
                </p>
              </div>
            </div>
            <div>
              <h1>{t({ uz: "Reyting", en: "Rating", ru: "Рейтинг" })}</h1>
              <div className="flex p-1 justify-start gap-1 items-center  bg-white rounded-md border px-3 mt-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_3002)">
                    <path
                      d="M8 6.10352e-05L10.472 5.2661L16 6.11573L12 10.2125L12.944 16.0001L8 13.2661L3.056 16.0001L4 10.2125L0 6.11573L5.528 5.2661L8 6.10352e-05Z"
                      fill="#FFB323"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_3002">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p>{stadium?.score || 0}</p>
                <hr className="w-[1px] h-4 border" />{" "}
                <p className="text-[12px]">
                  {stadium?.ratesCount || 0}{" "}
                  {t({ uz: "ta ovoz", en: "votes", ru: "голосов" })}
                </p>
              </div>
            </div>
          </motion.div>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <h1>manzil</h1>
              <div className="flex justify-end items-center gap-2">
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_3118)">
                    <path
                      d="M4.72667 9.057L9.28 11.843M9.27333 4.157L4.72667 6.943M13 3.1C13 4.2598 12.1046 5.2 11 5.2C9.89543 5.2 9 4.2598 9 3.1C9 1.9402 9.89543 1 11 1C12.1046 1 13 1.9402 13 3.1ZM5 8C5 9.1598 4.10457 10.1 3 10.1C1.89543 10.1 1 9.1598 1 8C1 6.8402 1.89543 5.9 3 5.9C4.10457 5.9 5 6.8402 5 8ZM13 12.9C13 14.0598 12.1046 15 11 15C9.89543 15 9 14.0598 9 12.9C9 11.7402 9.89543 10.8 11 10.8C12.1046 10.8 13 11.7402 13 12.9Z"
                      stroke="#0078FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_3118">
                      <rect width="14" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <h1>Ulashish</h1>
              </div>
            </div>
            <div className="rounded-md p-2 bg-white mt-2">
              <YandexMap
                longitude={stadium?.longlat?.lon}
                latitude={stadium?.longlat?.lat}
              />
            </div>
          </div>
          <div className="mt-2">
            <h1>qulayliklar</h1>
            <div className="bg-white p-2 rounded-md grid grid-cols-4 gap-2">
              {features?.map((feature, index: number) => (
                <div key={index}>
                  <div
                    className={`px-4 py-2 flex items-center justify-center rounded-md ${
                      stadium?.expand?.features?.find(
                        (f) => f.id === feature.id
                      )
                        ? "bg-green-500/10"
                        : "bg-[#F2F4F5]"
                    }`}
                  >
                    <img
                      src={getFileUrl(
                        feature.collectionId,
                        feature.id,
                        feature.icon || "default.png"
                      )}
                      alt={feature.name}
                      className="w-6 h-6"
                    />
                  </div>
                  <h1
                    className={`text-[12px] text-center ${
                      stadium?.expand?.features?.find(
                        (f) => f.id === feature.id
                      )
                        ? "text-[#42BA3D]"
                        : "text-[#979C9E]"
                    }`}
                  >
                    <TranslationText id={feature.name} />
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <h1>Qoidalar</h1>
            <div className="mt-2 bg-white rounded-md p-2 flex items-center justify-center">
              <div className="bg-red-400 p-2 rounded-lg w-full">
                <h1 className="text-white">
                  {stadium?.rules || "Hali qoida kiritilmagan"}
                </h1>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h1>Izohlar</h1>
            <div className="mt-2">
              <div className="bg-white rounded-md p-2 overflow-hidden">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-1">
                    {" "}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1_3002)">
                        <path
                          d="M8 6.10352e-05L10.472 5.2661L16 6.11573L12 10.2125L12.944 16.0001L8 13.2661L3.056 16.0001L4 10.2125L0 6.11573L5.528 5.2661L8 6.10352e-05Z"
                          fill="#FFB323"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_3002">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p>{stadium?.score}</p>
                    <hr className="w-[1px] h-4 border" />
                    <p className="text-[12px]">
                      {stadium?.ratesCount}{" "}
                      {t({ uz: "ta ovoz", en: "votes", ru: "голосов" })}
                    </p>
                  </div>
                  <div className="flex text-blue-500 items-center gap-1 justify-end">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1_3021)">
                        <path
                          d="M9.091 2.72742H2.72736C2.24515 2.72742 1.78269 2.91898 1.44171 3.25996C1.10074 3.60093 0.90918 4.06339 0.90918 4.5456V17.2729C0.90918 17.7551 1.10074 18.2175 1.44171 18.5585C1.78269 18.8995 2.24515 19.0911 2.72736 19.0911H15.4546C15.9368 19.0911 16.3993 18.8995 16.7403 18.5585C17.0813 18.2175 17.2728 17.7551 17.2728 17.2729V10.9092M15.9092 1.36379C16.2708 1.00213 16.7614 0.79895 17.2728 0.79895C17.7843 0.79895 18.2748 1.00213 18.6365 1.36379C18.9981 1.72545 19.2013 2.21596 19.2013 2.72742C19.2013 3.23889 18.9981 3.7294 18.6365 4.09106L10.0001 12.7274L6.36373 13.6365L7.27282 10.0001L15.9092 1.36379Z"
                          stroke="#0078FF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_3021">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>{" "}
                    {t({
                      uz: "Izoh yozish",
                      en: "Write a review",
                      ru: "Написать отзыв",
                    })}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-x-auto snap-x  mt-1 snap-mandatory w-[calc(100vw-3rem)] p-1 rounded-lg flex gap-2 snap-2"
                >
                  <Rates id={stadium?.id} />
                </motion.div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h1>
              {t({
                uz: "Ijtimoiy tarmoqlar",
                en: "Social Networks",
                ru: "Социальные сети",
              })}
            </h1>
            <div className="bg-white p-2 rounde-md grid grid-cols-4 gap-2 mt-2">
              {socials?.telegram && (
                <a href={socials.telegram} target="_blank">
                  <div className="bg-[#F2F4F5] flex items-center justify-center py-4 rounded-md ">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_21733_10072)">
                        <path
                          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                          fill="url(#paint0_linear_21733_10072)"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.89368 12.1659C8.38334 10.4724 10.7103 9.356 11.8746 8.81659C15.199 7.27646 15.8897 7.00893 16.34 7.00009C16.439 6.99815 16.6604 7.02549 16.8038 7.15511C16.9249 7.26457 16.9583 7.41242 16.9742 7.5162C16.9902 7.61997 17.01 7.85637 16.9942 8.04108C16.8141 10.1494 16.0346 15.2657 15.638 17.6271C15.4702 18.6263 15.1398 18.9613 14.8199 18.9941C14.1248 19.0653 13.5969 18.4823 12.9236 17.9908C11.8701 17.2215 11.2749 16.7426 10.2522 15.992C9.07035 15.1245 9.8365 14.6477 10.51 13.8685C10.6863 13.6646 13.7492 10.5615 13.8084 10.28C13.8159 10.2448 13.8227 10.1136 13.7527 10.0443C13.6828 9.97498 13.5794 9.99868 13.5049 10.0175C13.3992 10.0442 11.7162 11.2833 8.45566 13.7348C7.97793 14.1002 7.54521 14.2783 7.1575 14.2689C6.7301 14.2586 5.90793 13.9998 5.29673 13.7785C4.54708 13.507 3.95127 13.3635 4.00315 12.9026C4.03017 12.6625 4.32702 12.4169 4.89368 12.1659Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_21733_10072"
                          x1="12"
                          y1="0"
                          x2="12"
                          y2="23.822"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#2AABEE" />
                          <stop offset="1" stopColor="#229ED9" />
                        </linearGradient>
                        <clipPath id="clip0_21733_10072">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h1 className="text-center text-[#72777A]">
                    {t({ uz: "Telegram", en: "Telegram", ru: "Telegram" })}
                  </h1>
                </a>
              )}
              {socials?.instagram && (
                <a href={socials.instagram} target="_blank">
                  <div className="bg-[#F2F4F5] flex items-center justify-center py-4 rounded-md ">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.83784 12C5.83784 8.59671 8.59671 5.83784 12 5.83784C15.4033 5.83784 18.1622 8.59671 18.1622 12C18.1622 15.4033 15.4033 18.1622 12 18.1622C8.59671 18.1622 5.83784 15.4033 5.83784 12ZM12 16C9.79085 16 8 14.2092 8 12C8 9.79085 9.79085 8 12 8C14.2091 8 16 9.79085 16 12C16 14.2092 14.2091 16 12 16Z"
                        fill="url(#paint0_linear_21733_10462)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.83784 12C5.83784 8.59671 8.59671 5.83784 12 5.83784C15.4033 5.83784 18.1622 8.59671 18.1622 12C18.1622 15.4033 15.4033 18.1622 12 18.1622C8.59671 18.1622 5.83784 15.4033 5.83784 12ZM12 16C9.79085 16 8 14.2092 8 12C8 9.79085 9.79085 8 12 8C14.2091 8 16 9.79085 16 12C16 14.2092 14.2091 16 12 16Z"
                        fill="url(#paint1_radial_21733_10462)"
                      />
                      <path
                        d="M18.4056 7.03436C19.2009 7.03436 19.8456 6.38968 19.8456 5.59438C19.8456 4.79909 19.2009 4.15436 18.4056 4.15436C17.6104 4.15436 16.9656 4.79909 16.9656 5.59438C16.9656 6.38968 17.6104 7.03436 18.4056 7.03436Z"
                        fill="url(#paint2_linear_21733_10462)"
                      />
                      <path
                        d="M18.4056 7.03436C19.2009 7.03436 19.8456 6.38968 19.8456 5.59438C19.8456 4.79909 19.2009 4.15436 18.4056 4.15436C17.6104 4.15436 16.9656 4.79909 16.9656 5.59438C16.9656 6.38968 17.6104 7.03436 18.4056 7.03436Z"
                        fill="url(#paint3_radial_21733_10462)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 0C8.741 0 8.33234 0.0138139 7.05242 0.0722133C5.77516 0.13047 4.90283 0.333343 4.13954 0.630008C3.35044 0.936629 2.68123 1.34695 2.01406 2.01406C1.34695 2.68123 0.936629 3.35044 0.630008 4.13954C0.333343 4.90283 0.13047 5.77516 0.0722133 7.05242C0.0138139 8.33234 0 8.741 0 12C0 15.259 0.0138139 15.6677 0.0722133 16.9476C0.13047 18.2248 0.333343 19.0972 0.630008 19.8605C0.936629 20.6496 1.34695 21.3188 2.01406 21.9859C2.68123 22.6531 3.35044 23.0634 4.13954 23.37C4.90283 23.6667 5.77516 23.8695 7.05242 23.9278C8.33234 23.9862 8.741 24 12 24C15.259 24 15.6677 23.9862 16.9476 23.9278C18.2248 23.8695 19.0972 23.6667 19.8605 23.37C20.6496 23.0634 21.3188 22.6531 21.9859 21.9859C22.6531 21.3188 23.0634 20.6496 23.37 19.8605C23.6667 19.0972 23.8695 18.2248 23.9278 16.9476C23.9862 15.6677 24 15.259 24 12C24 8.741 23.9862 8.33234 23.9278 7.05242C23.8695 5.77516 23.6667 4.90283 23.37 4.13954C23.0634 3.35044 22.6531 2.68123 21.9859 2.01406C21.3188 1.34695 20.6496 0.936629 19.8605 0.630008C19.0972 0.333343 18.2248 0.13047 16.9476 0.0722133C15.6677 0.0138139 15.259 0 12 0ZM12 2.16216C15.2041 2.16216 15.5837 2.1744 16.849 2.23213C18.019 2.28548 18.6544 2.48097 19.0773 2.64531C19.6374 2.863 20.0371 3.12303 20.457 3.54297C20.877 3.96287 21.137 4.36261 21.3547 4.92274C21.519 5.34559 21.7145 5.98098 21.7679 7.15097C21.8256 8.41632 21.8378 8.79587 21.8378 12C21.8378 15.2041 21.8256 15.5837 21.7679 16.849C21.7145 18.019 21.519 18.6544 21.3547 19.0773C21.137 19.6374 20.877 20.0371 20.457 20.457C20.0371 20.877 19.6374 21.137 19.0773 21.3547C18.6544 21.519 18.019 21.7145 16.849 21.7679C15.5839 21.8256 15.2044 21.8378 12 21.8378C8.79564 21.8378 8.41618 21.8256 7.15097 21.7679C5.98098 21.7145 5.34559 21.519 4.92275 21.3547C4.36262 21.137 3.96287 20.877 3.54298 20.457C3.12308 20.0371 2.863 19.6374 2.64531 19.0773C2.48098 18.6544 2.28549 18.019 2.23214 16.849C2.1744 15.5837 2.16216 15.2041 2.16216 12C2.16216 8.79587 2.1744 8.41632 2.23214 7.15097C2.28549 5.98098 2.48098 5.34559 2.64531 4.92274C2.863 4.36261 3.12304 3.96287 3.54298 3.54297C3.96287 3.12303 4.36262 2.863 4.92275 2.64531C5.34559 2.48097 5.98098 2.28548 7.15097 2.23213C8.41632 2.1744 8.79587 2.16216 12 2.16216Z"
                        fill="url(#paint4_linear_21733_10462)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 0C8.741 0 8.33234 0.0138139 7.05242 0.0722133C5.77516 0.13047 4.90283 0.333343 4.13954 0.630008C3.35044 0.936629 2.68123 1.34695 2.01406 2.01406C1.34695 2.68123 0.936629 3.35044 0.630008 4.13954C0.333343 4.90283 0.13047 5.77516 0.0722133 7.05242C0.0138139 8.33234 0 8.741 0 12C0 15.259 0.0138139 15.6677 0.0722133 16.9476C0.13047 18.2248 0.333343 19.0972 0.630008 19.8605C0.936629 20.6496 1.34695 21.3188 2.01406 21.9859C2.68123 22.6531 3.35044 23.0634 4.13954 23.37C4.90283 23.6667 5.77516 23.8695 7.05242 23.9278C8.33234 23.9862 8.741 24 12 24C15.259 24 15.6677 23.9862 16.9476 23.9278C18.2248 23.8695 19.0972 23.6667 19.8605 23.37C20.6496 23.0634 21.3188 22.6531 21.9859 21.9859C22.6531 21.3188 23.0634 20.6496 23.37 19.8605C23.6667 19.0972 23.8695 18.2248 23.9278 16.9476C23.9862 15.6677 24 15.259 24 12C24 8.741 23.9862 8.33234 23.9278 7.05242C23.8695 5.77516 23.6667 4.90283 23.37 4.13954C23.0634 3.35044 22.6531 2.68123 21.9859 2.01406C21.3188 1.34695 20.6496 0.936629 19.8605 0.630008C19.0972 0.333343 18.2248 0.13047 16.9476 0.0722133C15.6677 0.0138139 15.259 0 12 0ZM12 2.16216C15.2041 2.16216 15.5837 2.1744 16.849 2.23213C18.019 2.28548 18.6544 2.48097 19.0773 2.64531C19.6374 2.863 20.0371 3.12303 20.457 3.54297C20.877 3.96287 21.137 4.36261 21.3547 4.92274C21.519 5.34559 21.7145 5.98098 21.7679 7.15097C21.8256 8.41632 21.8378 8.79587 21.8378 12C21.8378 15.2041 21.8256 15.5837 21.7679 16.849C21.7145 18.019 21.519 18.6544 21.3547 19.0773C21.137 19.6374 20.877 20.0371 20.457 20.457C20.0371 20.877 19.6374 21.137 19.0773 21.3547C18.6544 21.519 18.019 21.7145 16.849 21.7679C15.5839 21.8256 15.2044 21.8378 12 21.8378C8.79564 21.8378 8.41618 21.8256 7.15097 21.7679C5.98098 21.7145 5.34559 21.519 4.92275 21.3547C4.36262 21.137 3.96287 20.877 3.54298 20.457C3.12308 20.0371 2.863 19.6374 2.64531 19.0773C2.48098 18.6544 2.28549 18.019 2.23214 16.849C2.1744 15.5837 2.16216 15.2041 2.16216 12C2.16216 8.79587 2.1744 8.41632 2.23214 7.15097C2.28549 5.98098 2.48098 5.34559 2.64531 4.92274C2.863 4.36261 3.12304 3.96287 3.54298 3.54297C3.96287 3.12303 4.36262 2.863 4.92275 2.64531C5.34559 2.48097 5.98098 2.28548 7.15097 2.23213C8.41632 2.1744 8.79587 2.16216 12 2.16216Z"
                        fill="url(#paint5_radial_21733_10462)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_21733_10462"
                          x1="1.40032"
                          y1="1.26175"
                          x2="8.96732"
                          y2="30.5318"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#4E60D3" />
                          <stop offset="0.142763" stopColor="#913BAF" />
                          <stop offset="0.761458" stopColor="#D52D88" />
                          <stop offset="1" stopColor="#F26D4F" />
                        </linearGradient>
                        <radialGradient
                          id="paint1_radial_21733_10462"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(7.26584 24) rotate(32.1601) scale(22.4147 16.1312)"
                        >
                          <stop stopColor="#FED276" />
                          <stop
                            offset="0.17024"
                            stopColor="#FDBD61"
                            stopOpacity="0.975006"
                          />
                          <stop offset="0.454081" stopColor="#F6804D" />
                          <stop
                            offset="1"
                            stopColor="#E83D5C"
                            stopOpacity="0.01"
                          />
                        </radialGradient>
                        <linearGradient
                          id="paint2_linear_21733_10462"
                          x1="1.40032"
                          y1="1.26175"
                          x2="8.96732"
                          y2="30.5318"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#4E60D3" />
                          <stop offset="0.142763" stopColor="#913BA3F" />
                          <stop offset="0.761458" stopColor="#D52D88" />
                          <stop offset="1" stopColor="#F26D4F" />
                        </linearGradient>
                        <radialGradient
                          id="paint3_radial_21733_10462"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(7.26584 24) rotate(32.1601) scale(22.4147 16.1312)"
                        >
                          <stop stopColor="#FED276" />
                          <stop
                            offset="0.17024"
                            stopColor="#FDBD61"
                            stopOpacity="0.975006"
                          />
                          <stop offset="0.454081" stopColor="#F6804D" />
                          <stop
                            offset="1"
                            stopColor="#E83D5C"
                            stopOpacity="0.01"
                          />
                        </radialGradient>
                        <linearGradient
                          id="paint4_linear_21733_10462"
                          x1="1.40032"
                          y1="1.26175"
                          x2="8.96732"
                          y2="30.5318"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#4E60D3" />
                          <stop offset="0.142763" stopColor="#913BAF" />
                          <stop offset="0.761458" stopColor="#D52D88" />
                          <stop offset="1" stopColor="#F26D4F" />
                        </linearGradient>
                        <radialGradient
                          id="paint5_radial_21733_10462"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(7.26584 24) rotate(32.1601) scale(22.4147 16.1312)"
                        >
                          <stop stopColor="#FED276" />
                          <stop
                            offset="0.17024"
                            stopColor="#FDBD61"
                            stopOpacity="0.975006"
                          />
                          <stop offset="0.454081" stopColor="#F6804D" />
                          <stop
                            offset="1"
                            stopColor="#E83D5C"
                            stopOpacity="0.01"
                          />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                  <h1 className="text-center text-[#72777A]">
                    {t({ uz: "Instagram", en: "Instagram", ru: "Instagram" })}
                  </h1>
                </a>
              )}
              {socials?.youtube && (
                <a href={socials.youtube} target="_blank">
                  <div className="bg-[#F2F4F5] flex items-center justify-center py-4 rounded-md ">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.4982 6.44323C23.3625 5.92235 23.0951 5.44696 22.7227 5.06464C22.3503 4.68232 21.8861 4.40647 21.3764 4.26472C19.5 3.75 12 3.75 12 3.75C12 3.75 4.5 3.75 2.62364 4.26472C2.11393 4.40647 1.64966 4.68232 1.27729 5.06464C0.904916 5.44696 0.637506 5.92235 0.501818 6.44323C5.96046e-08 8.36577 0 12.375 0 12.375C0 12.375 5.96046e-08 16.3842 0.501818 18.3068C0.637506 18.8277 0.904916 19.303 1.27729 19.6854C1.64966 20.0677 2.11393 20.3435 2.62364 20.4853C4.5 21 12 21 12 21C12 21 19.5 21 21.3764 20.4853C21.8861 20.3435 22.3503 20.0677 22.7227 19.6854C23.0951 19.303 23.3625 18.8277 23.4982 18.3068C24 16.3842 24 12.375 24 12.375C24 12.375 24 8.36577 23.4982 6.44323Z"
                        fill="#FF0302"
                      />
                      <path
                        d="M9.75 15.75V9L15.75 12.375L9.75 15.75Z"
                        fill="#FEFEFE"
                      />
                    </svg>
                  </div>
                  <h1 className="text-center text-[#72777A]">
                    {t({ uz: "Youtube", en: "Youtube", ru: "Youtube" })}
                  </h1>
                </a>
              )}
              {socials?.facebook && (
                <a href={socials.facebook} target="_blank">
                  <div className="bg-[#F2F4F5] flex items-center justify-center py-4 rounded-md ">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_21736_10605)">
                        <path
                          d="M23.9995 12.0441C23.9995 5.39238 18.627 0 11.9998 0C5.37253 0 0 5.39238 0 12.0441C0 17.6923 3.87448 22.4319 9.1011 23.7336V15.7248H6.62675V12.0441H9.1011V10.4581C9.1011 6.35879 10.9495 4.45872 14.9594 4.45872C15.7197 4.45872 17.0315 4.60855 17.5681 4.75789V8.0941C17.2849 8.06423 16.7929 8.0493 16.1819 8.0493C14.2144 8.0493 13.4541 8.79748 13.4541 10.7424V12.0441H17.3737L16.7003 15.7248H13.4541V24C19.3959 23.2798 24 18.202 24 12.0441H23.9995Z"
                          fill="#0866FF"
                        />
                        <path
                          d="M16.4172 15.6917L17.0634 12.0353H13.302V10.7422C13.302 8.81015 14.0316 8.0669 15.9197 8.0669C16.5061 8.0669 16.9782 8.08174 17.25 8.11141V4.7972C16.735 4.64836 15.4761 4.5 14.7465 4.5C10.8984 4.5 9.12453 6.38754 9.12453 10.4598V12.0353H6.75V15.6917H9.12453V23.6478C10.0154 23.8775 10.9472 24 11.9063 24C12.3784 24 12.8441 23.9698 13.3015 23.9124V15.6917H16.4167H16.4172Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_21736_10605">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h1 className="text-center text-[#72777A]">Facebook</h1>
                </a>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4">
          {!isLoadingFields &&
            fields &&
            fields.map((item, index) => <FieldCard key={index} field={item} />)}
          <div className="w-full my-4">
            <Button
              size="large"
              type="primary"
              className="w-full"
              onClick={() => navigate(`/dashboard/stadium/${id}/add-field`)}
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_21491_18263)">
                    <path
                      d="M8 10V13C8 13.2833 8.096 13.521 8.288 13.713C8.48 13.905 8.71734 14.0007 9 14C9.28334 14 9.521 13.904 9.713 13.712C9.905 13.52 10.0007 13.2827 10 13V10H13C13.2833 10 13.521 9.904 13.713 9.712C13.905 9.52 14.0007 9.28267 14 9C14 8.71667 13.904 8.479 13.712 8.287C13.52 8.095 13.2827 7.99934 13 8H10V5C10 4.71667 9.904 4.479 9.712 4.287C9.52 4.095 9.28267 3.99934 9 4C8.71667 4 8.479 4.096 8.287 4.288C8.095 4.48 7.99934 4.71734 8 5V8H5C4.71667 8 4.479 8.096 4.287 8.288C4.095 8.48 3.99934 8.71734 4 9C4 9.28334 4.096 9.521 4.288 9.713C4.48 9.905 4.71734 10.0007 5 10H8ZM2 18C1.45 18 0.979002 17.804 0.587002 17.412C0.195002 17.02 -0.000664969 16.5493 1.69779e-06 16V2C1.69779e-06 1.45 0.196002 0.979002 0.588002 0.587002C0.980002 0.195002 1.45067 -0.000664969 2 1.69779e-06H16C16.55 1.69779e-06 17.021 0.196002 17.413 0.588002C17.805 0.980002 18.0007 1.45067 18 2V16C18 16.55 17.804 17.021 17.412 17.413C17.02 17.805 16.5493 18.0007 16 18H2ZM2 16H16V2H2V16Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_21491_18263">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
            >
              {t({
                uz: "Stadion yaratish",
                ru: "Создать стадион",
                en: "Create stadium",
              })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StadionDetail;
