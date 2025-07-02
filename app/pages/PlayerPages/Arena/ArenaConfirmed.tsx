import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import imageConfirm from "../../../assets/confirmcheck.png";
import { motion } from "framer-motion";

import BootsBig from "@/assets/boots/bootsBig";
import { Calendar, Check } from "lucide-react";
import { Button } from "antd";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import Loading from "@/pages/Loading";
import { FieldsRecord } from "@/types/pocketbaseTypes";
import BootsMin from "@/assets/boots/bootsMin";
import { useUzbekDate } from "@/hooks/useUzbekDate";
import useNumberFormat from "@/hooks/useNumberFormat ";
import { pb } from "@/pb/pb";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "@/hooks/useQueryParam";

const ArenaConfirmed = () => {
  const navigate = useNavigate();
  const { chat_id } = useQueryParam();
  const { user } = useUser();
  const t = useTranslation();
  // /////
  const { create } = usePocketBaseCollection("orders");

  const notVerifyOrder = JSON.parse(localStorage.getItem("orderData") || "{}");
  console.log("orderData:", notVerifyOrder);
  const { list: fieldsList } = usePocketBaseCollection<FieldsRecord>("fields");
  const { data: arena, isLoading } = fieldsList({
    expand: "size,stadium",
    filter: `id = "${notVerifyOrder.field}"`, // Assuming fieldId is passed in orderData
  });

  console.log("Arena Data:", arena);

  // const stadiumName = arena?.[0]?.expand?.stadium?.name || "Stadium";
  const FieldName = arena?.[0]?.name || "Field 1";
  const arenaSize = arena?.[0]?.expand?.size?.name || "5x5";
  const date = useUzbekDate(notVerifyOrder.date);
  const formatMoney = useNumberFormat();

  // --------------ORDER POST

  const createMutation = create();
  const payloadOrder = {
    user: user?.id,
    field: notVerifyOrder.field,
    date: notVerifyOrder.date,
    totalTime: notVerifyOrder.totalTime.length,
    totalPrice: notVerifyOrder.totalPrice,
    type: "order",
  };
  // async function batchCreate(dataOrder: any) {
  //   console.log("Creating batch for order:", dataOrder);
  //   const batch = pb.createBatch();
  //   notVerifyOrder.totalTime.forEach((item: any) => {
  //     const i = {
  //       order: dataOrder.id,
  //       time_from: item.clock,
  //       field: notVerifyOrder.field,
  //       date: notVerifyOrder.date,
  //     };
  //     batch.collection("order_items").create(i);
  //   });
  //   await batch.send();
  // }
  async function batchCreate(dataOrder: any) {
    try {
      console.log("Creating batch for order:", dataOrder);

      const batch = pb.createBatch();

      notVerifyOrder.totalTime.forEach((item: any) => {
        const i = {
          order: dataOrder.id,
          time_from: item.clock,
          field: notVerifyOrder.field,
          date: notVerifyOrder.date,
        };
        batch.collection("order_items").create(i);
      });

      await batch.send(); // Asinxron operatsiya – try/catch muhim
      navigate(`/client/home?chat_id=${chat_id}`);
      console.log("Batch creation successful!");
    } catch (error) {
      console.error("❌ Batch creation failed:", error);
      // Istasangiz bu yerda toast yoki modal orqali xabar berishingiz mumkin
    }
  }

  function submitData() {
    console.log("Submitting data:", payloadOrder);
    createMutation.mutate(payloadOrder, {
      onSuccess: async (data: any) => {
        await batchCreate(data);
      },
      onError: (error) => {
        console.error("Error creating order:", error);
      },
    });
  }

  if (isLoading) return <Loading />;
  return (
    <div>
      {/* header */}
      <div className="flex items-center">
        <span className="cursor-pointer flex items-center justify-center ">
          <BackBtn />
        </span>
        <h5 className="text-center w-[90%] text-[18px]">
          {t({ uz: "Band qilish", en: "Booking", ru: "Бронирование" })}
        </h5>
      </div>
      {/* image */}
      <div className="mt-8 h-[270px] w-full  flex items-center justify-center ">
        <img src={imageConfirm} alt={imageConfirm} />
      </div>
      {/* info confirm */}
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className=" mb-3  flex flex-col items-center justify-center bg-white rounded-lg  shadow-md p-4"
        >
          <div className="w-full  ">
            {/* title */}
            <div
              className="w-full rounded-xl text-center text-base font-semibold py-2"
              style={{ background: "rgba(242, 244, 245, 1)" }}
            >
              {/* {stadiumName} */}
            </div>
            {/* arena info */}
            <div className="flex items-center justify-between mt-3 border-b-2 border-dashed border-gray-300">
              <span className="">{FieldName}</span>
              <span className="flex items-center gap-2">
                {arena?.[0]?.type === "grass" ? <BootsBig /> : <BootsMin />}
                {arena?.[0]?.type}
              </span>
              <span className="pb-4">{arenaSize}</span>
            </div>
            {/* arena time */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                {date}
              </div>
              <div>
                <span>{notVerifyOrder?.totalTime?.length}</span>{" "}
                {t({ uz: "soat", en: "hours", ru: "часа" })}
              </div>
            </div>
            {/* arena clocktime */}
            {notVerifyOrder?.totalTime?.map((item: any, index: any) => {
              const start = item.clock.toString().padStart(2, "0");
              const end = (item.clock + 1).toString().padStart(2, "0");

              return (
                <div
                  key={index}
                  className="h-[35px] flex justify-end items-center gap-3 px-3 rounded-[8px] mt-3"
                  style={{ background: "rgba(242, 244, 245, 1)" }}
                >
                  <div>{`${start}:00 - ${end}:00`}</div>
                  <div className="border-l border-gray-200 h-[70%]" />
                  <div>
                    {formatMoney(arena?.[0]?.price ?? 0)}
                    {t({ uz: "uzs", en: "UZS", ru: "сум" })}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className="relative w-full my-3"
            style={{
              borderWidth: "0.5px",
              borderStyle: "dashed",
              borderImage:
                "repeating-linear-gradient(to right, rgba(212, 204, 205, 1) 0, rgba(212, 204, 205, 1) 4px, transparent 4px, transparent 8px) 1",
            }}
          >
            <div className="absolute rounded-r-full w-5 h-5 bg-gradient-to-br from-gray-50 to-gray-100 -mt-2 -left-6.5"></div>
            <div className="absolute rounded-l-full w-5 h-5 bg-gradient-to-br from-gray-50 to-gray-100 -mt-2 -right-6.5"></div>
          </div>

          {/* Bottom Section */}
          <div className="w-full flex items-center justify-between ">
            <div className="w-full text-right">
              {t({ uz: "Jamo tolov", en: "Total payment", ru: "Общая оплата" })}{" "}
              :{" "}
              <span className="text-green-600 font-semibold">
                {formatMoney(notVerifyOrder?.totalPrice)}
              </span>
              {t({ uz: "uzs", en: "UZS", ru: "сум" })}
            </div>
          </div>
        </motion.div>
      </div>
      <Button
        type="primary"
        size="small"
        onClick={() => submitData()}
        style={{
          marginTop: "16px",
          height: "48px",
          borderRadius: "48px",
          fontSize: "16px",
        }}
        icon={<Check color="white" width={20} />}
        iconPosition="end"
        className="w-full bg-green-500 hover:bg-green-600"
      >
        {t({ uz: "Rasmiylashtirish", en: "Confirm", ru: "Подтвердить" })}
      </Button>
    </div>
  );
};

export default ArenaConfirmed;
