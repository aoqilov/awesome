import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import OrderCard from "./CardOrder";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import Loading from "@/pages/Loading";
import locationOrderImage from "@/assets/no-location1.png";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "@/hooks/useQueryParam";
import { DeepOrderType } from "@/types/pocketbaseTypes";

const MainOrder = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();
  const { list: OrderList } = usePocketBaseCollection<DeepOrderType>("orders");
  const localUserData = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: OrderData, isLoading: OrderLoading } = OrderList({
    filter: `user.id = "${localUserData.id}"`,
    expand: "user,field.stadium.city.name,field.stadium.city.region.name",
    sort: "-created",
  });

  console.log("OrderData", OrderData);

  if (OrderLoading) return <Loading />;

  return (
    <div className="">
      {/* header */}
      <div className="flex items-center justify-center mb-3 relative">
        <span className="cursor-pointer absolute left-0">
          <BackBtn />
        </span>
        <h2 className="text-lg font-semibold ">
          {t({ uz: " Buyurtmalar", ru: " заказы", en: " orders" })}
        </h2>
      </div>

      {/* content */}
      {OrderData?.length ? (
        <div className="grid gap-4">
          {OrderData.map((item) => (
            <OrderCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        // No data block
        <div className=" min-h-[75vh] flex flex-col items-center justify-center px-4">
          <img
            src={locationOrderImage}
            alt="no orders"
            className="mb-4 opacity-70 max-w-[200px]"
          />
          <p className="text-sm text-gray-400 mb-10">
            {t({
              uz: "Sizda buyurtma mavjud emas",
              ru: "У вас нет заказов",
              en: "You have no orders",
            })}
          </p>
        </div>
      )}

      {/* Add button */}
      <div className="w-full mt-6">
        <Button
          type="primary"
          onClick={() => navigate(`/client/search?chat_id=${chat_id}`)}
          icon={<PlusOutlined />}
          className="bg-green-500 hover:bg-green-600 w-full rounded-full text-white text-sm"
          style={{ height: "48px", borderRadius: "48px" }}
        >
          {t({ uz: "Buyurtma berish", ru: "Оформить заказ", en: "Make order" })}
        </Button>
      </div>
    </div>
  );
};

export default MainOrder;
