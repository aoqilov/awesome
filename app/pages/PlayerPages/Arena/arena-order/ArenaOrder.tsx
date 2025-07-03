/* eslint-disable @typescript-eslint/no-explicit-any */
import MiniCalendar from "./MiniCalendar5";
import ActiveSelectArena from "./ActiveSelectArena";
import ArenaTime from "./ArenaTimes";
import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import { useQueryParam } from "@/hooks/useQueryParam";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import { FieldsRecord, OrderItemResponse } from "@/types/pocketbaseTypes";
import Loading from "@/pages/Loading";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const ArenaOrder = () => {
  const { chat_id } = useQueryParam(); // Assuming chat_id is passed as a URL parameter
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslation();
  const { user } = useUser();
  //
  const [activeField, setActiveField] = useState<null | any>(null);
  const [currentFieldId, setCurrentFieldId] = useState<string>(id || "");
  const [selectedDate, setSelectedDate] = useState(
    dayjs().startOf("day").format("YYYY-MM-DD")
  );
  const [selectedClock, setSelectedClock] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const getCurrentData = (date: any) => {
    setSelectedDate(date);
  };

  const getSelectedClock = (
    selectedTimes: { clock: number }[],
    price: number
  ) => {
    setSelectedClock(selectedTimes);
    setTotalPrice(price);
  };

  const getActiveField = (field: any) => {
    setActiveField(field);
    // Update the current field ID when active field changes
    if (field?.id) {
      setCurrentFieldId(field.id);
    }
  };
  const { list } = usePocketBaseCollection<OrderItemResponse>("order_items");
  // Filtrlash uchun tanlangan sana formatini olish
  const formatted = dayjs(selectedDate).format("YYYY-MM-DD");

  const { data: orders, isLoading } = list({
    filter: `field.id = "${currentFieldId}" && date ~ "${formatted}"`,
    expand: "field, order",
  });
  const { list: fieldsList } = usePocketBaseCollection<FieldsRecord>("fields");
  const { data: maydonlar, isLoading: isLoadingMaydonlar } = fieldsList({
    filter: `stadium.id = "${
      JSON.parse(localStorage.getItem("stadium") || "{}").id
    }"`,
    expand: "size",
  });

  // Birinchi maydonni default qilib o'rnatish
  useEffect(() => {
    if (maydonlar && maydonlar.length > 0 && !activeField) {
      // URL dan kelgan id ga mos maydonni topish
      const initialField =
        maydonlar.find((field: any) => field.id === id) || maydonlar[0];
      setActiveField(initialField);
      setCurrentFieldId(initialField.id);
    }
  }, [maydonlar, activeField, id]);
  const userId = user?.id;
  // Agar userId bo'lmasa, uni olish
  const payloadOrder = {
    field: currentFieldId,
    user: userId,
    date: formatted,
    totalPrice: totalPrice,
    totalTime: selectedClock,
    type: "order",
  };

  function submitData(obj: any) {
    try {
      localStorage.setItem("orderData", JSON.stringify(obj));
      // Muvaffaqiyatli saqlandi, endi sahifani o'zgartiramiz
      navigate(`/client/arenaconfirmed?chat_id=${chat_id}`);
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    }
  }
  let stadiumName = null;
  try {
    const stadiumRaw = localStorage.getItem("stadium");
    stadiumName = stadiumRaw ? JSON.parse(stadiumRaw)?.name : null;
  } catch (error) {
    console.error("Stadiumni localStorage dan olishda xatolik:", error);
  }

  if (isLoadingMaydonlar && isLoading) return <Loading />;

  return (
    <div className="">
      {/* header */}
      <div className="flex items-center ">
        <span className="cursor-pointer flex items-center justify-center ">
          <BackBtn />
        </span>{" "}
        <h5 className="text-center w-[90%] text-[18px]">{stadiumName}</h5>
      </div>
      {/* calendar */}
      <div className="calendar---field">
        <MiniCalendar getCurrentData={getCurrentData} />
      </div>
      {/* arena active maydoni */}
      <div className="active---arena mt-5">
        <h3 className="text-lg font-semibold ">
          {t({ uz: "Maydonlar", en: "Fields", ru: "Поля" })}
        </h3>
        <ActiveSelectArena
          maydonlar={maydonlar}
          getActiveField={getActiveField}
        />
      </div>
      {/* arena free time */}
      <div className="for---time mt-5">
        <ArenaTime
          activeField={activeField}
          dataOrder={orders}
          selectedDate={selectedDate}
          getSelectedClock={getSelectedClock}
        />
      </div>
      {/* arena order button */}
      <Button
        type="primary"
        size="small"
        onClick={() => {
          submitData(payloadOrder);
        }}
        style={{
          marginTop: "16px",
          height: "48px",
          borderRadius: "48px",
          fontSize: "16px",
        }}
        icon={<ArrowRight color="white" width={20} />}
        iconPosition="end"
        className="w-full bg-green-500 hover:bg-green-600"
      >
        {t({ uz: "Band qilish", en: "Book", ru: "Забронировать" })}
      </Button>
    </div>
  );
};

export default ArenaOrder;
