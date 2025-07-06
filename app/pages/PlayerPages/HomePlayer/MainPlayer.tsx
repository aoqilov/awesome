/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { Divider } from "antd";
import dayjs from "dayjs";

import { useLang } from "@/providers/LangProvider";
import { useTranslation } from "@/hooks/translation";
import { useQueryParam } from "@/hooks/useQueryParam";
import { usePocketBaseCollection } from "@/pb/usePbMethods";

import { DeepOrderType } from "@/types/pocketbaseTypes";

import Loading from "@/pages/Loading";
import DateTimeWidget from "@/components/date-time-widget";
import OrderCard from "../MainOrder/CardOrder";
import CardSeach from "../MainSearch/CardSeach";
import BatafsilSvg from "@/assets/svg/BatafsilSvg";
import { useUser } from "@/contexts/UserContext";
import { LogoSvg } from "@/assets/svg/LogoSvg";

const MainPlayer = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = useTranslation();
  const { chat_id } = useQueryParam();
  const { user: playerData, isLoading } = useUser();

  const today = dayjs().format("YYYY-MM-DD");
  const userId = playerData?.id;

  const { list: OrderList } = usePocketBaseCollection<DeepOrderType>("orders");
  const { list: StadiumList } = usePocketBaseCollection<any>("stadiums");

  const { data: orderToday, isLoading: isLoadingOrders } = OrderList({
    filter: `date ~ "${today}" && user = "${userId}"`,
    expand:
      " city,user, field.stadium.city.name, field.stadium.city.region.name",
  });
  console.log(orderToday);
  const { data: scoreStadion, isLoading: isLoadingStadiums } = StadiumList({
    filter: "score >= 5",
    expand: "city.region.name",
  });

  if (isLoadingOrders && isLoadingStadiums && isLoading) return <Loading />;

  return (
    <div>
      {/* Main Timer */}
      <div className="w-full flex p-4 mt-5  mb-3 rounded-sm justify-center items-center shadow-sm bg-white">
        <div className="flex items-center justify-center gap-10">
          <LogoSvg />
        </div>
        <Divider type="vertical" />
        <DateTimeWidget lang={lang} />
      </div>

      {/* Faol Buyurtmalar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            {t({
              uz: "Faol Buyurtmalar",
              en: "Active Orders",
              ru: "Активные заказы",
            })}
          </h2>
        </div>

        {orderToday?.length ? (
          orderToday?.map((order) => <OrderCard key={order.id} item={order} />)
        ) : (
          <p className="text-gray-500 p-2 w-full text-center border border-green-700 rounded-lg">
            {t({
              uz: "Bugun buyurtma mavjud emas",
              en: "No orders today",
              ru: "Нет заказов сегодня",
            })}
          </p>
        )}
      </div>

      {/* Eng ko‘p reyting olgan stadionlar */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t({
              uz: "Top stadionlar",
              en: "Popular Stadiums",
              ru: "Популярные стадионы",
            })}
          </h2>
          <button
            onClick={() => navigate(`/client/search?chat_id=${chat_id || ""}`)}
            className="flex items-center gap-2 text-green-600"
          >
            <BatafsilSvg />
            {t({
              uz: "Batafsil",
              en: "View All",
              ru: "Подробнее",
            })}
          </button>
        </div>

        <div className="grid grid-cols-1  gap-4">
          {scoreStadion?.map((stadium) => (
            <CardSeach key={stadium.id} stadium={stadium} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPlayer;
