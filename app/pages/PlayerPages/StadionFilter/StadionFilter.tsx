/* eslint-disable @typescript-eslint/no-explicit-any */
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";
import BackBtn from "@/components/ui/back-btn";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Select, TimePicker, Slider } from "antd";
import { useTranslation } from "@/hooks/translation";

const { Option } = Select;
const { RangePicker } = TimePicker;
import { useState } from "react";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import Loading from "@/pages/Loading";
import dayjs from "dayjs";
import useNumberFormat from "@/hooks/useNumberFormat ";
import { useNavigate } from "react-router-dom";
const ICONS = {
  barcha: () => null,
  gazon: (isSelected: string) => (
    <BootsBig {...(isSelected && { color: "white" })} />
  ),
  futzal: (isSelected: string) => (
    <BootsMin {...(isSelected && { color: "white" })} />
  ),
};

const StadionFilter = () => {
  const navigate = useNavigate();
  const formatMoney = useNumberFormat();
  const t = useTranslation();
  const { getFileUrl } = usePocketBaseFile();

  // ---------------------FETCHED DATA
  const { list: stadiumIconsData } =
    usePocketBaseCollection("stadium_features");
  const { list: stadiumRegionsData } = usePocketBaseCollection("regions");
  const { list: stadiumCitysData } = usePocketBaseCollection("cities");
  // const { list: stadiumMainData } = usePocketBaseCollection("stadium");
  const { list: stadiumSizeData } = usePocketBaseCollection("field_sizes");
  // -----------  FOR ICONS
  const { data: stadiumIcons, isLoading: isLoadingStadiumIcon } =
    stadiumIconsData({
      expand: "icon,name",
    });
  const [activeIcons, setActiveIcons] = useState<string[]>([]);
  const toggleIcon = (id: string) => {
    setActiveIcons((prev) =>
      prev.includes(id) ? prev.filter((iconId) => iconId !== id) : [...prev, id]
    );
  };
  // ----------------FOR REGIONS and city--------------------------------------------]
  const { data: stadiumRegions, isLoading: isLoadingRegions } =
    stadiumRegionsData({
      expand: "name",
    });
  console.log(stadiumRegions);
  const [selectRegion, setSelectRegion] = useState<string | null>(null);
  const [selectCity, setSelectCity] = useState<string | null>(null);
  // ------------------ FOR CITYS----------------------------------------------------]
  const { data: stadiumCitys, isLoading: isLoadingCitys } = stadiumCitysData({
    filter: `region.id = "${selectRegion}"`,
    expand: "name,region.name, region.id",
  });

  // ---------------------- FIELD SIZE -------------------------------------------------]
  const [selectFieldSize, setSelectFieldSize] = useState<string | null>(null);
  const { data: stadiumSizes, isLoading: isLoadingFieldSize } = stadiumSizeData(
    {
      expand: "name",
    }
  );
  // ------------------- SELECTED WORK TIME -----------------------------------------]
  const [selectTime, setSelectTime] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null);
  const formattedHours = selectTime?.map((time) => String(time.hour()));
  // price
  const [rangePrice, setRangePrice] = useState<[number, number]>([0, 1000000]);
  const [from, to] = rangePrice;
  console.log(rangePrice);

  console.log(formattedHours);

  //------------------- foor boots type stadion--------------------------------------]
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(
    null
  );

  const renderFieldOption = (
    value: "barcha" | "gazon" | "futzal",
    label: React.ReactNode
  ) => {
    const mapToRealValue = {
      barcha: null,
      gazon: "grass",
      futzal: "futsal",
    } as const;

    const isSelected = selectedFieldType === mapToRealValue[value];

    return (
      <div
        key={value}
        onClick={() => setSelectedFieldType(mapToRealValue[value])}
        className={`flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-xl border transition-all duration-200 
          ${
            isSelected
              ? "bg-green-500 text-white border-green-500"
              : "border-gray-300 text-gray-700"
          }
        `}
      >
        <div
          className={`w-5 h-5 flex items-center justify-center rounded-full border 
            ${
              isSelected
                ? "bg-white text-green-500 border-white"
                : "border-gray-400"
            }
          `}
        >
          {isSelected && <CheckOutlined className="text-xs" />}
        </div>
        {ICONS[value] && ICONS[value](isSelected ? "true" : "")}
        <span className={`${isSelected ? "text-white" : "text-gray-700"}`}>
          {label}
        </span>
      </div>
    );
  };

  const handleSubmit = () => {
    const filterData = {
      fieldType: selectedFieldType,
      region: selectRegion,
      city: selectCity,
      fieldSize: selectFieldSize,
      timeRange: formattedHours,
      priceRange: rangePrice,
      activIcons: activeIcons,
    };
    console.log(filterData);
    try {
      localStorage.setItem("filterData", JSON.stringify(filterData));
      navigate(-1);
    } catch (error) {
      console.error("Error saving filter data:", error);
    }
  };
  if (
    isLoadingStadiumIcon &&
    isLoadingRegions &&
    isLoadingCitys &&
    isLoadingFieldSize
  ) {
    return <Loading />;
  }
  return (
    <div>
      {/* filter header */}
      <div className="flex items-center">
        <span className="cursor-pointer flex items-center justify-center ">
          <BackBtn />
        </span>{" "}
        <h5 className="text-center w-[90%] text-[18px] ">
          {t({ uz: "Filter", en: "Filter", ru: "Фильтр" })}
        </h5>
      </div>
      {/* form section */}
      <div className="w-full  p-4 rounded-2xl   ">
        <div className=" overflow-x-auto scrollbar-hide">
          <p className="font-semibold text-sm mb-2">
            {t({ uz: "Maydon turi", en: "Field type", ru: "Тип поля" })}
          </p>
          <div className="flex items-center gap-2">
            {renderFieldOption(
              "barcha",
              t({ uz: "Barcha", en: "All", ru: "Все" })
            )}
            {renderFieldOption(
              "gazon",
              t({ uz: "Gazon", en: "Grass", ru: "Газон" })
            )}
            {renderFieldOption(
              "futzal",
              t({ uz: "Futsal", en: "Futsal", ru: "Футзал" })
            )}
          </div>
        </div>
        {/*  */}{" "}
        <div className="mt-5 flex flex-col gap-2">
          <p className="font-semibold text-sm">
            {t({
              uz: "Stadion manzili",
              en: "Stadium address",
              ru: "Адрес стадиона",
            })}
          </p>
          <Select
            placeholder={t({
              uz: "Viloyat / shahar",
              en: "Province / city",
              ru: "Область / город",
            })}
            className="w-full"
            value={selectRegion} // bu ixtiyoriy, tanlangan qiymatni ko‘rsatadi
            onChange={(value) => setSelectRegion(value)} // value bu region.id
          >
            {stadiumRegions?.map((region: any) => (
              <Option key={region.id} value={region.id}>
                {region.expand?.name?.key}
              </Option>
            ))}
          </Select>
          <Select
            placeholder={t({
              uz: "Tuman / shaharcha",
              en: "District / town",
              ru: "Район / городок",
            })}
            value={selectCity} // bu ixtiyoriy, tanlangan qiymatni ko‘rsatadi
            onChange={(value) => setSelectCity(value)} // value bu region.id
            className="w-full "
          >
            {stadiumCitys?.map((region: any) => (
              <Option key={region.id} value={region.id}>
                {region.expand?.name?.key}
              </Option>
            ))}
          </Select>
        </div>{" "}
        <div className="flex gap-2 mt-5">
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1">
              {t({
                uz: "Vaqt oralig'i",
                en: "Time range",
                ru: "Временной диапазон",
              })}
            </p>
            <RangePicker
              format="HH" // faqat soat ko‘rsatadi
              className="w-full"
              showNow={false}
              hideDisabledOptions
              placeholder={["00", "00"]}
              allowClear={false}
              showMinute={false} // daqiqani ko‘rsatmaydi (faqat soat)
              showSecond={false} // sekundni ham o‘chiramiz
              onChange={(value) => {
                setSelectTime(value as [dayjs.Dayjs, dayjs.Dayjs]);
              }}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1">
              {t({ uz: "O'lchamlari", en: "Dimensions", ru: "Размеры" })}
            </p>
            <Select
              defaultValue="11x11"
              className="w-full"
              placeholder={t({
                uz: "Maydon o'lchamlari",
                en: "Field size",
                ru: "Размер поля",
              })}
              value={selectFieldSize} // bu ixtiyoriy, tanlangan qiymatni ko‘rsatadi
              onChange={(value) => setSelectFieldSize(value)} // value bu size.expand.name
            >
              {stadiumSizes?.map((size: any) => (
                <Option key={size.id} value={size.id}>
                  {size?.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>{" "}
        <div className="mt-5">
          <p className="font-semibold text-sm mb-2">
            {t({ uz: "Maydon narxi", en: "Field price", ru: "Цена поля" })}
          </p>
          <Slider
            range
            min={0}
            max={1000000}
            step={50000}
            value={rangePrice}
            trackStyle={[{ backgroundColor: "green" }]}
            onChange={(value: any) => {
              setRangePrice(value);
            }}
            tooltip={{
              formatter: (value: any) => formatMoney(value),
            }}
          />

          <div className="flex justify-between text-xs">
            <span>{formatMoney(from)} UZS</span>
            <span>{formatMoney(to)} UZS</span>
          </div>
        </div>
        <div className="mt-5">
          <p className="font-semibold text-sm mb-3">
            {t({ uz: "Qulayliklar", en: "Amenities", ru: "Удобства" })}
          </p>
          <div className="grid grid-cols-4 gap-2 gap-y-4 text-center text-xs bg-white rounded-[16px] p-3 shadow-md">
            {stadiumIcons?.map((feature: any) => {
              const isActive = activeIcons.includes(feature.id);

              return (
                <div key={feature.id}>
                  <button
                    type="button"
                    onClick={() => toggleIcon(feature.id)}
                    className={`p-2 py-2 rounded-xl flex flex-col items-center justify-center w-full transition border ${
                      isActive
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-50 border-gray-200"
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
                  </button>
                  <p
                    className={`mt-1 text-[11px] leading-[16px] font-medium text-center ${
                      isActive ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {feature.expand?.name?.key}
                  </p>
                </div>
              );
            })}
          </div>
        </div>{" "}
        <Button
          type="primary"
          className="w-full bg-green-500 hover:bg-green-600 mt-5 "
          style={{ height: "48px", borderRadius: "48px" }}
          onClick={() => handleSubmit()}
        >
          {t({
            uz: "Filtrni qo'llash",
            en: "Apply filter",
            ru: "Применить фильтр",
          })}
        </Button>
      </div>
    </div>
  );
};

export default StadionFilter;
