/* eslint-disable @typescript-eslint/no-explicit-any */
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";
import StarFullSvg from "@/assets/svg/StarFullSvg";
import SearchHeader from "@/components/PlayerSearchBox";
import YandexStadiumMap from "@/components/YandexStadiumMap";
import useNumberFormat from "@/hooks/useNumberFormat ";
import { useQueryParam } from "@/hooks/useQueryParam";
import Loading from "@/pages/Loading";
import { Stadium } from "@/pages/ManagerPages/Stadion/StadionCard";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import { Carousel, Image } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

//
const StadionMapSearch = () => {
  const { chat_id } = useQueryParam();
  const navigate = useNavigate();
  const { getFileUrl } = usePocketBaseFile();
  const formatMoney = useNumberFormat();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  console.log(debouncedSearchTerm);
  // fetching
  const filterParts: string[] = [];
  filterParts.push(`status ="verified"`);
  if (debouncedSearchTerm) {
    filterParts.push(`name ~ "${debouncedSearchTerm}"`);
  }

  if (showOnlySaved) {
    filterParts.push(`isSaved = true`);
  }
  const finalFilter =
    filterParts.length > 0 ? filterParts.join(" && ") : undefined;

  const { list } = usePocketBaseCollection("stadiums");
  const { data: stadiumsData, isLoading } = list({
    expand: "city.region,name",
    filter: finalFilter,
  });
  console.log("Stadionlar:", stadiumsData);
  const [stadiumId, setStadiumId] = useState<string | null>(null);

  const { one } = usePocketBaseCollection<Stadium>("stadiums");
  const { data: stadiumOneData, isLoading: stadiumLoading } = one(
    stadiumId as string,
    "city.name,city.region.name,city.region.expand"
  );

  console.log("Tanlangan stadion:", stadiumOneData);

  //
  //
  const handleMarkerClick = (id: string, address: string) => {
    setStadiumId(id);
    console.log("Manzil:", address);
  };
  //
  //
  const { list: fields } = usePocketBaseCollection("fields");
  const { data: fieldsData, isLoading: fieldsLoading } = fields({
    filter: `stadium.id = "${stadiumId}" `,
    expand: "stadium,city.region",
  });
  console.log("Fields data:", fieldsData);

  if (isLoading && fieldsLoading) {
    return <Loading />;
  }
  // qolgan stadionlar...
  return (
    <div className="">
      {/* search */}
      <div className="relative z-10">
        <SearchHeader
          value={searchTerm}
          onChange={(val: string) => setSearchTerm(val.toLowerCase())}
          showOnlySaved={showOnlySaved}
          onToggleSaved={() => setShowOnlySaved((prev) => !prev)}
          isFilterActive={location.pathname.includes("filter")}
          isMapActive={location.pathname.includes("map")}
        />
      </div>
      <div className="absolute top-16 left-0 w-full  ">
        <YandexStadiumMap
          stadiums={stadiumsData as Stadium[]}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      <AnimatePresence>
        {stadiumOneData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: "easeInOut", // silliq kirish/chiqish effekti
            }}
            className="absolute bottom-20 left-0 w-full flex justify-center px-4"
          >
            <div className="w-full max-w-[410px] min-h-[283px] bg-white mt-5 p-2 rounded-4xl shadow-lg">
              {stadiumLoading ? (
                <div className="flex justify-center items-center h-full min-h-[283px]">
                  <Loading />
                </div>
              ) : (
                <>
                  {/* image box */}
                  <div className="card-imagebox relative h-[188px] w-full rounded-3xl overflow-hidden">
                    <Carousel autoplay infinite className="h-[188px]">
                      {fieldsData?.flatMap((field: any, fieldIdx: number) =>
                        field.images?.map((image: string, imgIdx: number) => {
                          const imgUrl = getFileUrl(
                            field.collectionId,
                            field.id,
                            image
                          );
                          return (
                            <div
                              key={`${fieldIdx}-${imgIdx}`}
                              className="w-full h-[188px] rounded-[12px] overflow-hidden"
                            >
                              <Image
                                src={imgUrl}
                                alt={`Image ${imgIdx}`}
                                preview={{ mask: <span>Ko'rish</span> }}
                                height="100%"
                                width="100%"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          );
                        })
                      )}
                    </Carousel>

                    <span
                      className="absolute w-7 h-7 z-10 top-6 right-4 rounded-[6px] flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: "rgba(255, 82, 71, 1)" }}
                    >
                      <Heart size={20} color="white" />
                    </span>
                  </div>

                  {/* info box */}
                  <div
                    className="card-infobox py-2 mt-3"
                    onClick={() => {
                      localStorage.setItem(
                        "stadium",
                        JSON.stringify(stadiumOneData)
                      );
                      navigate(`/client/arena?chat_id=${chat_id}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="left flex items-center justify-start gap-2">
                        <h4 className="leading-6 text-[16px] font-medium">
                          {stadiumOneData.name}
                        </h4>
                        <div className="flex items-center justify-center gap-1">
                          <StarFullSvg
                            width={20}
                            height={20}
                            color="rgba(255, 179, 35, 1)"
                          />
                          <p
                            className="text-[14px] leading-5"
                            style={{ color: "rgba(108, 112, 114, 1)" }}
                          >
                            {stadiumOneData?.ratesCount}
                          </p>
                        </div>
                      </div>
                      <div
                        className="right px-3 py-1 rounded-[6px]"
                        style={{
                          background: "rgba(236, 252, 229, 1)",
                          color: "rgba(151, 156, 158, 1)",
                        }}
                      >
                        <span
                          className="text-[16px] font-medium"
                          style={{ color: "rgb(66, 186, 61)" }}
                        >
                          {formatMoney(stadiumOneData?.price ?? 0)}
                        </span>{" "}
                        UZS
                      </div>
                    </div>

                    {/* location */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center justify-start gap-2">
                        <MapPin />
                        <div className="text-[14px] leading-5 text-gray-600">
                          <p>{stadiumOneData.address}</p>
                          <p>
                            {stadiumOneData.expand?.city?.expand?.name?.key}
                          </p>
                        </div>
                      </div>
                      <div className="boots flex items-center justify-center gap-2">
                        <BootsBig width={30} height={14} />
                        <BootsMin width={30} height={14} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StadionMapSearch;
