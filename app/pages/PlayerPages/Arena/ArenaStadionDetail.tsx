/* eslint-disable @typescript-eslint/no-explicit-any */
import HeartFullSvg from "@/assets/svg/HeartFullSvg";
import ShareSvg from "@/assets/svg/ShareSvg";
import ForMappingSocialSvg from "@/assets/svg/social/ForMappingSocialSvg";
import StarFullSvg from "@/assets/svg/StarFullSvg";
import YandexMap from "@/components/yandex-map";
import { formatTime } from "@/hooks/useFormatDate";
import Loading from "@/pages/Loading";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import {
  FieldsRecord,
  StadiumFeaturesRecord,
  StadiumsResponse,
} from "@/types/pocketbaseTypes";
import { Carousel, Image } from "antd";
import { Calendar, Heart } from "lucide-react";

// Dummy translation function for demonstration; replace with your actual translation hook or import
const t = (obj: { uz: string; en: string; ru: string }) => obj.uz;

const ArenaStadionDetail = ({ stadiumLocal }: { stadiumLocal: any }) => {
  // FIELDS
  const { list: fields } = usePocketBaseCollection<FieldsRecord>("fields");
  const { data: fieldsData, isLoading: fieldsLoading } = fields({
    filter: `stadium.id = "${stadiumLocal.id}"`,
  });
  //  STADIUMS
  const { list } = usePocketBaseCollection<StadiumsResponse>("stadiums");
  const { data: stadiums, isLoading } = list({
    filter: `id = "${stadiumLocal.id}"`,
    expand: "city.name,features.name",
  });

  const socialLinks = stadiums?.[0]?.socials || {};

  // stadium features
  const { list: featuresList } =
    usePocketBaseCollection<StadiumFeaturesRecord>("stadium_features");
  const { data: features, isLoading: isLoadingFeatures } = featuresList({
    expand: "name",
  });

  const formatData = formatTime; // assign the function, not the result

  const { getFileUrl } = usePocketBaseFile();

  if (isLoading && fieldsLoading && isLoadingFeatures) {
    return <Loading />;
  }
  return (
    <div className="relative">
      {/* fields images */}
      <Carousel autoplay infinite>
        {fieldsData?.flatMap((field: any, fieldIdx: number) =>
          field.images?.map((image: string, imgIdx: number) => {
            const imgUrl = getFileUrl(field.collectionId, field.id, image);

            return (
              <div
                key={`${fieldIdx}-${imgIdx}`}
                className="w-full h-[188px] mt-5 rounded-[12px] overflow-hidden "
              >
                <Image
                  src={imgUrl}
                  alt={`Image ${imgIdx}`}
                  preview={{
                    mask: <span>Ko'rish</span>, // optional mask
                  }}
                  height="100%"
                  width="100%"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            );
          })
        )}
      </Carousel>
      {stadiums?.map((stadium) => (
        <div key={stadium.id}>
          <div className="absolute  top-7 right-2 p-[6px] bg-[#72777A] rounded-[6px]">
            {stadium.isSaved ? (
              <HeartFullSvg />
            ) : (
              <Heart
                width={20}
                height={20}
                color="white"
                className="cursor-pointer"
              />
            )}
          </div>
          {/* stadium details wokringtime + rate*/}
          <div className="flex items-center justify-between mt-3 gap-5">
            <div className="flex  flex-col justify-between mt-3 w-[50%]">
              <p>
                {t({
                  uz: "Ish vaqti",
                  en: "Working hours",
                  ru: "Время работы",
                })}
              </p>
              <span className="flex items-center gap-1 text-gray-500 mt-3 w-full h-10 bg-white rounded-[8px] pl-2">
                <Calendar size={20} /> {formatData(stadium?.worktime_from)} -{" "}
                {formatData(stadium?.worktime_to)}
              </span>
            </div>
            <div className="flex  flex-col justify-between mt-3 w-[50%]">
              <p>
                {t({
                  uz: "Reyting",
                  en: "Rating",
                  ru: "Рейтинг",
                })}
              </p>
              <span className="flex items-center gap-1 text-gray-500 mt-3 w-full h-10 bg-white rounded-[8px] pl-2">
                <StarFullSvg width={20} />
                {stadium.score} | {stadium.ratesCount} ta ovoz
              </span>
            </div>
          </div>
          {/* map detail */}
          <div>
            <div className="flex items-center justify-between mt-5">
              <p className="font-medium text-start mt-5">
                {t({
                  uz: "Manzil",
                  en: "Address",
                  ru: "Адрес",
                })}
              </p>
              <span className="flex items-center gap-1 text-black font-semibold cursor-pointer">
                <ShareSvg width={20} />
                {t({
                  uz: "Ulashish",
                  en: "Share",
                  ru: "Поделиться",
                })}
              </span>
            </div>
            <div className=" w-full bg-yellow-200 mt-5">
              <YandexMap
                className="h-full w-full rounded-[16px]"
                longitude={stadium?.longlat?.lon}
                latitude={stadium?.longlat?.lat}
              />
            </div>
          </div>
          {/* feature qullayliklar */}
          <div className="mt-5">
            <p className="font-medium text-start mt-5">
              {t({
                uz: "Qulayliklar",
                en: "Features",
                ru: "Удобства",
              })}
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2 gap-y-4 text-center text-xs bg-white rounded-[16px] p-3 shadow-md">
              {features?.map((feature) => (
                // feature icon

                <div key={feature.id}>
                  <div className="p-2 py-2 rounded-xl flex flex-col items-center justify-center w-full transition bg-green-100">
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
                  <p className="mt-1 text-[11px] leading-[16px] font-medium text-green-600">
                    {feature.expand?.name?.key}
                  </p>
                </div>
                //
              ))}
            </div>
          </div>
          {/* rules - qoidalar */}
          <div className="mt-5">
            <p className="font-medium text-start mt-5">
              {t({
                uz: "Qoidalar",
                en: "Rules",
                ru: "Правила",
              })}
            </p>
            <div className="p-2 rounded-[20px] bg-white shadow-md my-3">
              <p className="bg-red-500 rounded-[12px] text-white p-2">
                {stadium?.rules}
              </p>
            </div>
          </div>
          {/* comentariy izoh */}
          {/* ------------ hali oylanmadi */}
          {/* <div className="w-full"> */}
          <p className="font-medium text-start mt-5">
            {t({
              uz: "Izohlar",
              en: "Comments",
              ru: "Комментарии",
            })}
          </p>
          {/* box */}
          <div className="mt-3 bg-white rounded-[20px] p-4 shadow-md">
            {/* box - title */}
            <div className="flex justify-between items-center">
              <p className="text-[16px] font-medium text-gray-700 flex items-center gap-1">
                <StarFullSvg width={20} />
                {stadium?.score} | {stadium?.ratesCount} ta ovoz
              </p>
              {/* <span className="text-[14px] text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">
                  <EditSvg width={20} height={20} color="blue" />
                  {t({
                    uz: "Izoh yozish",
                    en: "Write a comment",
                    ru: "Написать комментарий",
                  })}
                </span> */}
            </div>

            {/* commentary cards */}
            <div className="mt-4 overflow-x-auto scroll-hide">
              <div className="flex gap-3 w-max">
                {/* {stadiumsRatesData.map((rate, index) => (
                    <div
                      key={rate.id || index}
                      className="w-[260px] bg-gray-100 rounded-[12px] p-3 flex-shrink-0 shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={stadiumsRatesData.avatar}
                          alt={stadiumsRatesData.user}
                          className="w-6 h-6 rounded-[8px] object-cover"
                        />
                        <span className="font-[400] text-[14px] text-gray-500">
                          {stadiumsRatesData.user}
                        </span>
                      </div>

                      <div className="p-2 rounded-[8px] bg-white">
                        <p className="text-[12px] leading-[120%] font-[300] pb-1 border-b border-gray-200 border-dashed min-h-[50px] text-gray-500">
                          {stadiumsRatesData.text}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                          <span className="flex items-center gap-1">
                            <StarFullSvg width={16} />
                            {stadiumsRatesData.rating || "4.7"}
                          </span>
                          <span>{stadiumsRatesData.date}</span>
                        </div>
                      </div>
                    </div>
                  ))} */}
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* ------------ */}
          {/* social */}
          <div className="mt-5">
            <p className="font-medium text-start mt-5">Qoidalar</p>
            <div className="bg-white p-4 shadow-md rounded-[16px] grid grid-cols-4 gap-4 mt-3">
              {Object.entries(socialLinks).map(([key, value]) =>
                value ? (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      listStyle: "none",
                      color: "#999",
                    }}
                    className="flex flex-col items-center  transition "
                  >
                    <span className="py-2 px-5 bg-gray-100 rounded-[8px]">
                      {ForMappingSocialSvg[key]}
                    </span>
                    <span className="text-sm font-medium">{key}</span>
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ArenaStadionDetail;
