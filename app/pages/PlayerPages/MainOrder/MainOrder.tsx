import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";

import OrderCard from "./CardOrder";

const MainOrder = () => {
  const t = useTranslation();
  return (
    <div className="">
      {/* header */}
      <div className="flex items-center justify-center mb-3 relative">
        <span className="cursor-pointer absolute left-0">
          <BackBtn />
        </span>
        <h2 className="text-lg font-semibold ">
          {t({
            uz: " Buyurtmalar",
            ru: " заказы",
            en: " orders",
          })}
        </h2>
      </div>
      {/* order-card */}
      <div>
        <OrderCard />

        <OrderCard />
        <OrderCard />
      </div>
      {/* no data */}
      {/* 
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <img
          src={locationOrderImage}
          alt="no orders"
          className=" mb-4 opacity-70"
        />

        {/* Matn */}
      {/* <p className="text-sm text-gray-400 mb-10"> */}
      {/* Sizda buyurtmalar mavjud emas :( */}
      {/* </p> */}
      {/* </div> */}

      {/* Tugma */}
      {/* <div className="w-full ">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-green-500 hover:bg-green-600 w-full rounded-full text-white text-sm"
          style={{ height: "48px", borderRadius: "48px" }}
        >
          Maydon qo‘shish
        </Button>
      </div> */}
    </div>
  );
};

export default MainOrder;
