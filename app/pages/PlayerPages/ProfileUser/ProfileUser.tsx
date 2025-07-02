import { Avatar, Button } from "antd";
import EditSvg from "@/assets/svg/EditSvg";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import { usePocketBaseFile } from "@/pb/usePbMethods";
import Loading from "@/pages/Loading";
import dayjs from "dayjs";

export default function ProfileUser() {
  const { user: playerData, isLoading } = useUser();

  const t = useTranslation();
  const navigate = useNavigate();
  const { getFileUrl } = usePocketBaseFile();

  const fullname = playerData?.fullname || "";
  const [firstName, lastName] = fullname.split(" ");
  const formatted = dayjs(playerData?.birthDate).format("DD.MM.YYYY");
  
  // For now, we'll use the raw city IDs. In a complete implementation,
  // you might want to fetch the expanded city data separately or 
  // modify the UserContext to include expanded data
  const bornCityName = playerData?.bornCity || "N/A";
  const liveCityName = playerData?.liveCity || "N/A";

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
          onClick={() => navigate("/client/edit")}
        >
          <EditSvg className="text-xl " width={20} />
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl ">
        <div className="flex flex-col items-center mb-4">
          <Avatar
            size={72}
            src={getFileUrl(
              playerData?.collectionId,
              playerData?.id || "",
              playerData?.avatar || ""
            )}
            alt={playerData?.fullname}
            style={{ width: 100, height: 100 }}
          />
          {/* <div className="mt-2 text-sm text-gray-600 flex items-center gap-1">
            <StarFullSvg width={20} /> {profileData.yulduz} |
            {profileData.ovozlar}{" "}
            {t({ uz: "ta ovoz", en: "votes", ru: "голосов" })}
          </div> */}
        </div>

        {/* Statuslar */}
        {/* <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm bg-white h-[64px]  rounded shadow-md items-center">
          <div className="border-r border-gray-200 border-dashed">
            <p className="text-[14px] text-green-500 font-medium mb-1">
              {" "}
              {t({
                uz: "bajarilgan",
                ru: "выполнено",
                en: "completed",
              })}
            </p>
            <p>
              <span className="font-bold text-gray-600">14</span>{" "}
              {t({ uz: "marta", en: "times", ru: "раз" })}
            </p>
          </div>{" "}
          <div className="border-r border-gray-200 border-dashed">
            <p className="text-[12px] text-red-500 font-medium mb-1">
              {" "}
              {t({
                uz: "bekor qilingan",
                ru: "отменено",
                en: "canceled",
              })}
            </p>
            <p>
              <span className="font-bold text-gray-600">14</span>{" "}
              {t({ uz: "marta", en: "times", ru: "раз" })}
            </p>
          </div>{" "}
          <div className="">
            <p className="text-[14px] text-orange-500 font-medium mb-1">
              {" "}
              {t({
                uz: "kelmagan",
                ru: "не пришел",
                en: "no show",
              })}
            </p>
            <p>
              <span className="font-bold text-gray-600">14</span>{" "}
              {t({ uz: "marta", en: "times", ru: "раз" })}
            </p>
          </div>
        </div> */}

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

        {/* Baholash tugmasi */}
        <Button
          type="primary"
          block
          className="mt-6 rounded-full bg-green-500 hover:bg-green-600 text-white"
          style={{ height: 48 }}
          icon={<ArrowRight size={20} color="white" />}
          iconPosition="end"
        >
          {t({
            uz: "Baholash",
            ru: "Оценить",
            en: "Rate",
          })}
        </Button>
      </div>
    </div>
  );
}
