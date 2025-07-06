import { Avatar } from "antd";
import EditSvg from "@/assets/svg/EditSvg";
import { useNavigate } from "react-router-dom";
import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import Loading from "@/pages/Loading";
import dayjs from "dayjs";
import { useQueryParam } from "@/hooks/useQueryParam";
import { UserOutlined } from "@ant-design/icons";
import {
  CitiesResponse,
  RegionsResponse,
  TranslationsResponse,
  UsersResponse,
} from "@/types/pocketbaseTypes";
type ExpandedUser = UsersResponse<{
  bornCity: CitiesResponse<{
    region: RegionsResponse<{
      name: TranslationsResponse;
    }>;
    name: TranslationsResponse;
  }>;
  liveCity: CitiesResponse<{
    region: RegionsResponse<{
      name: TranslationsResponse;
    }>;
    name: TranslationsResponse;
  }>;
}>;

export default function ProfileUser() {
  const { user: playerData, isLoading } = useUser();
  const { one } = usePocketBaseCollection<ExpandedUser>("users");
  const { data: userData, isLoading: getLoading } = one(
    playerData?.id,
    "bornCity.name, liveCity.name, bornCity.region.name, liveCity.region.name"
  );
  console.log("userData", userData);

  const t = useTranslation();
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();
  const fullname = userData?.fullname || "";
  const [firstName, lastName] = fullname.split(" ");
  const formatted = dayjs(userData?.birthDate).format("DD.MM.YYYY");
  const bornCityName = userData?.expand?.bornCity?.expand?.name?.key;
  const liveCityName = userData?.expand?.liveCity?.expand?.name?.key;
  const bornRegion =
    userData?.expand?.bornCity?.expand?.region?.expand?.name?.key;
  const liveRegion =
    userData?.expand?.liveCity?.expand?.region?.expand?.name?.key;

  console.log("liveRegion", liveRegion);
  console.log(bornRegion);
  const { getFileUrl } = usePocketBaseFile();
  if (isLoading || getLoading) {
    return <Loading />;
  }
  return (
    <div className="max-w-md mx-auto p-4 bg-RED">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="cursor-pointer ">
          <BackBtn />
        </span>
        <h2 className="text-lg font-semibold">
          {t({ uz: "Profil", en: "Profile", ru: "Профиль" })}
        </h2>
        <span
          className="cursor-pointer"
          onClick={() => navigate(`/client/edit?chat_id=${chat_id}`)}
        >
          <EditSvg className="text-xl " width={20} />
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl ">
        {" "}
        <div className="flex flex-col items-center mb-4">
          {userData?.avatar ? (
            <Avatar
              size={100}
              src={getFileUrl(
                userData?.collectionId,
                userData?.id || "",
                userData?.avatar || ""
              )}
              alt={userData?.fullname}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Avatar size={100} icon={<UserOutlined />} />
          )}
        </div>
        {/* Ma'lumotlar */}
        <div className="divide-y divide-gray-300 divide-dashed text-sm">
          <div className="flex justify-between py-3">
            <span className="text-[##72777A] text-[16px] font-[400] leading-[16px]">
              {t({
                uz: "Ism",
                ru: "Имя",
                en: "Name",
              })}
            </span>
            <span className="text-[#404446] text-[16px] leading-[16px] font-[500]">
              {firstName}
            </span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-[##72777A] text-[16px] font-[400] leading-[16px]">
              {t({
                uz: "Familiya",
                ru: "Фамилия",
                en: "Surname",
              })}
            </span>
            <span className="text-[#404446] text-[16px] leading-[16px] font-[500]">
              {lastName}
            </span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-[##72777A] text-[16px] font-[400] leading-[16px]">
              {t({
                uz: "Tug'ilgan sana",
                ru: "Дата рождения",
                en: "Date of Birth",
              })}
            </span>
            <span className="text-[#404446] text-[16px] leading-[16px] font-[500]">
              {formatted}
            </span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-[##72777A] text-[16px] font-[400] leading-[16px]">
              {t({
                uz: "Telefon raqami",
                ru: "Номер телефона",
                en: "Phone Number",
              })}
            </span>
            <span className="text-[#404446] text-[16px] leading-[16px] font-[500]">
              {userData?.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-[##72777A] text-[16px] font-[400] leading-[16px]">
              {t({
                uz: "Tug'ilgan joyi",
                ru: "Место рождения",
                en: "Place of Birth",
              })}
            </span>
            <div className="text-right text-[#404446] text-[16px] leading-[16px] font-[500]">
              {bornRegion}{" "}
              {t({
                uz: ", viloyati",
                ru: ", область",
                en: ", region",
              })}
              <br />
              {bornCityName}
              {t({
                uz: ", tuman",
                ru: ", район",
                en: ", district",
              })}
            </div>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-[##72777A] text-[16px] font-[400] leading-[16px]">
              {t({
                uz: "Yashash manzili",
                ru: "Адрес проживания",
                en: "Address",
              })}
            </span>
            <div className="text-right text-[#404446] text-[16px] leading-[16px] font-[500]">
              {liveRegion}{" "}
              {t({
                uz: ", viloyati",
                ru: ", область",
                en: ", region",
              })}
              <br />
              {liveCityName}
              {t({
                uz: ", tuman",
                ru: ", район",
                en: ", district",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
