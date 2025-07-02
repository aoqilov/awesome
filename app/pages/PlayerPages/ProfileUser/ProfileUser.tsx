/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from "antd";
import EditSvg from "@/assets/svg/EditSvg";
import { useNavigate } from "react-router-dom";
import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import { UsersResponse } from "@/types/pocketbaseTypes";
import Loading from "@/pages/Loading";
import dayjs from "dayjs";
import { useQueryParam } from "@/hooks/useQueryParam";
import { UserOutlined } from "@ant-design/icons";

export default function ProfileUser() {
  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

  const { one } = usePocketBaseCollection<UsersResponse>("users");

  const { data: playerData, isLoading } = one(
    userId,
    "avatar,liveCity.name,bornCity.name"
  );

  const t = useTranslation();
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();

  const fullname = playerData?.fullname || "";
  const [firstName, lastName] = fullname.split(" ");
  const formatted = dayjs(playerData?.birthDate).format("DD.MM.YYYY");
  const bornCityName = playerData?.expand?.bornCity?.expand?.name?.key;
  const liveCityName = playerData?.expand?.liveCity?.expand?.name?.key;
  const { getFileUrl } = usePocketBaseFile();

  if (isLoading) {
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
        <div className="flex flex-col items-center mb-4">
          {playerData?.avatar ? (
            <Avatar
              size={100}
              src={getFileUrl(
                playerData?.collectionId,
                playerData?.id || "",
                playerData?.avatar || ""
              )}
              alt={playerData?.fullname}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Avatar size={100} icon={<UserOutlined />} />
          )}
        </div>

        {/* Ma'lumotlar */}
        <div className="divide-y divide-gray-300 divide-dashed text-sm">
          <div className="flex justify-between py-3">
            <span className="text-gray-500">
              {t({
                uz: "Ism",
                ru: "Имя",
                en: "Name",
              })}
            </span>
            <span className="text-gray-800">{firstName}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-gray-500">
              {t({
                uz: "Familiya",
                ru: "Фамилия",
                en: "Surname",
              })}
            </span>
            <span className="text-gray-800">{lastName}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-gray-500">
              {t({
                uz: "Tug'ilgan sana",
                ru: "Дата рождения",
                en: "Date of Birth",
              })}
            </span>
            <span className="text-gray-800">{formatted}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-gray-500">
              {t({
                uz: "Telefon raqami",
                ru: "Номер телефона",
                en: "Phone Number",
              })}
            </span>
            <span className="text-gray-800">{playerData?.phoneNumber}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-gray-500">
              {t({
                uz: "Tug'ilgan joyi",
                ru: "Место рождения",
                en: "Place of Birth",
              })}
            </span>
            <div className="text-right text-gray-800">{bornCityName}</div>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-gray-500">
              {t({
                uz: "Yashash manzili",
                ru: "Адрес проживания",
                en: "Address",
              })}
            </span>
            <div className="text-right text-gray-800">{liveCityName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
