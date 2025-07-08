import BackBtn from "@/components/ui/back-btn";
import { useState } from "react";
import ArenaCard from "./ArenaCard";
import { useTranslation } from "@/hooks/translation";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import { FieldsRecord } from "@/types/pocketbaseTypes";
import Loading from "@/pages/Loading";
import ArenaStadionDetail from "./ArenaStadionDetail";

const MoreArena = () => {
  const [active, setActive] = useState<"umumiy" | "maydonlar">("umumiy");
  const t = useTranslation();
  //
  const stadiumLocal = JSON.parse(localStorage.getItem("stadium") || "{}");
  const { list: fieldsList } = usePocketBaseCollection<FieldsRecord>("fields");
  const { data: arena, isLoading } = fieldsList({
    filter: `stadium.id = "${stadiumLocal.id}"`,
    expand: "size",
  });

  if (isLoading) return <Loading />;

  // components/StadiumCarousel.tsx

  // switch arena state

  return (
    <div>
      {/* header */}
      <div className="flex items-center">
        <span className="cursor-pointer flex items-center justify-center ">
          <BackBtn />
        </span>{" "}
        <h5 className="text-center w-[90%] text-[18px]">
          {t({
            uz: "Tanlangan maydonlar",
            en: "Selected fields",
            ru: "Выбранные поля",
          })}
        </h5>
      </div>
      {/* switch arena */}
      <div className="w-full h-12 bg-gray-100 rounded-[16px] p-1 flex items-center mt-3">
        <button
          onClick={() => setActive("umumiy")}
          className={`flex-1 h-full rounded-[12px] text-sm font-medium transition-all duration-200
          ${
            active === "umumiy"
              ? "bg-white text-green-600 shadow"
              : "text-gray-500"
          }`}
        >
          {t({ uz: "Umumiy", en: "General", ru: "Общий" })}
        </button>
        <button
          onClick={() => setActive("maydonlar")}
          className={`flex-1 h-full rounded-[12px] text-sm font-medium transition-all duration-200
          ${
            active === "maydonlar"
              ? "bg-white text-green-600 shadow"
              : "text-gray-500"
          }`}
        >
          {t({ uz: "Maydonlar", en: "Fields", ru: "Поля" })}
        </button>
      </div>
      {/* arena cards */}
      {active === "umumiy" ? (
        <ArenaStadionDetail stadiumLocal={stadiumLocal} />
      ) : (
        <div className="arena----cards my-3">
          {arena &&
            arena.map((item) => <ArenaCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
};

export default MoreArena;
