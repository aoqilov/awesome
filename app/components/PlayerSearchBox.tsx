/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/PlayerSearchBox.tsx

import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/translation";
import FileterSvg from "@/assets/svg/FileteSvg";
import MapSvg from "@/assets/svg/MapSvg";
import HeartRedSvg from "@/assets/svg/HeartRedSvg";
import BackBtn from "@/components/ui/back-btn";
import HeartFullSvg from "@/assets/svg/HeartFullSvg";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "@/hooks/useQueryParam";

interface Props {
  value: string;
  onChange: (val: string) => void;
  showOnlySaved: boolean;
  onToggleSaved: () => void;
  isFilterActive?: any;
  isMapActive?: boolean;
  showFilterButton?: boolean; // ✅ yangi prop qo‘shildi
}

const SearchHeader: React.FC<Props> = ({
  value,
  onChange,
  showOnlySaved,
  onToggleSaved,
  isFilterActive,
  isMapActive = false,
  showFilterButton = true, // ✅ default holatda filter tugmasi bor
}) => {
  console.log(isFilterActive);
  const { chat_id } = useQueryParam();
  const navigate = useNavigate();
  const t = useTranslation();

  function onFilterClick() {
    localStorage.removeItem("filterData");
    navigate(`/client/filter?chat_id=${chat_id}`);
  }

  function onMapClick() {
    navigate(`/client/map?chat_id=${chat_id}`);
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <BackBtn />
      <div className="flex-1 relative rounded-[14px] border border-gray-300 bg-white h-[40px] flex items-center px-2">
        <Search color="rgba(151, 156, 158, 1)" size={20} className="mr-2" />
        <input
          type="text"
          placeholder={String(
            t({ uz: "Izlash...", en: "Search...", ru: "Поиск..." })
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent outline-none text-sm text-gray-700 pr-6"
        />

        {/* Clear (X) icon, faqat value bo‘lsa ko‘rinadi */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-[135px] text-gray-400 w-5 h-5 rounded-[20px] bg-[#ECFCE5] flex items-center justify-center "
          >
            &times;
          </button>
        )}

        <div className="flex gap-2 ml-2">
          {showFilterButton && (
            <span
              onClick={onFilterClick}
              className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer ${
                isFilterActive && Object.keys(isFilterActive).length > 0
                  ? "bg-[#ECFCE5]"
                  : "bg-gray-100"
              }`}
            >
              <FileterSvg
                width={20}
                height={20}
                color={
                  isFilterActive && Object.keys(isFilterActive).length > 0
                    ? "green"
                    : "gray"
                }
              />
            </span>
          )}

          <span
            onClick={onMapClick}
            className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer ${
              isMapActive ? "bg-[#ECFCE5]" : "bg-gray-100"
            }`}
          >
            <MapSvg
              width={20}
              height={20}
              color={isMapActive ? "green" : "rgba(108,112,114,1)"}
            />
          </span>
          <span
            onClick={onToggleSaved}
            className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center cursor-pointer ${
              showOnlySaved ? "bg-[#ECFCE5]" : "bg-gray-100"
            }`}
          >
            {showOnlySaved ? <HeartRedSvg /> : <HeartFullSvg />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
