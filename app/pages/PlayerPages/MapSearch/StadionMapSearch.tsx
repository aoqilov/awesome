import SearchHeader from "@/components/PlayerSearchBox";
import YandexStadiumMap from "@/components/YandexStadiumMap";
import Loading from "@/pages/Loading";
import { Stadium } from "@/pages/ManagerPages/Stadion/StadionCard";
import { usePocketBaseCollection } from "@/pb/usePbMethods";
import { TranslationsRecord } from "@/types/pocketbaseTypes";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import CardSeach from "../MainSearch/CardSeach";
type ExpandedStadium = Stadium & {
  expand?: {
    city?: {
      expand?: {
        name?: TranslationsRecord;
        region?: {
          expand?: {
            name?: TranslationsRecord;
          };
        };
      };
    };
  };
};

//
const StadionMapSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [shouldResetBounds, setShouldResetBounds] = useState(false);

  console.log(debouncedSearchTerm);
  // fetching
  const filterParts: string[] = [];
  filterParts.push(`status ="verified"`);
  if (debouncedSearchTerm) {
    filterParts.push(`name ~ "${debouncedSearchTerm}"`);
  }

  if (showOnlySaved) {
    filterParts.push(`isSaved = true`);
  }
  const finalFilter =
    filterParts.length > 0 ? filterParts.join(" && ") : undefined;

  const { list } = usePocketBaseCollection("stadiums");
  const { data: stadiumsData, isLoading } = list({
    expand: "city.region,name",
    filter: finalFilter,
  });
  console.log("Stadionlar:", stadiumsData);
  const [stadiumId, setStadiumId] = useState<string | null>(null);

  const { one } = usePocketBaseCollection<ExpandedStadium>("stadiums");
  const { data: stadiumOneData } = one(
    stadiumId as string,
    "city.name,city.region.name,city.region.expand"
  );
  console.log("Tanlangan stadion:", stadiumOneData);

  // ✅ Search o'zgarganda map bounds ni reset qilish
  useEffect(() => {
    setShouldResetBounds(true);
    const timer = setTimeout(() => setShouldResetBounds(false), 100);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, showOnlySaved]);

  const handleMarkerClick = (id: string, address: string) => {
    setStadiumId(id);
    console.log("Manzil:", address);
  };

  if (isLoading) {
    return <Loading />;
  }
  // qolgan stadionlar...
  return (
    <div className="">
      {/* search */}
      <div className="relative z-10">
        <SearchHeader
          value={searchTerm}
          onChange={(val: string) => setSearchTerm(val.toLowerCase())}
          showOnlySaved={showOnlySaved}
          onToggleSaved={() => setShowOnlySaved((prev) => !prev)}
          showFilterButton={false}
          isMapActive={location.pathname.includes("map")}
        />
      </div>{" "}
      <div className="absolute top-16 left-0 w-full  ">
        <YandexStadiumMap
          stadiums={stadiumsData as Stadium[]}
          onMarkerClick={handleMarkerClick}
          shouldResetBounds={shouldResetBounds}
        />
      </div>{" "}
      <AnimatePresence>
        {stadiumOneData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-0 w-full flex justify-center px-4"
          >
            {/* ✅ CardSeach componentini ishlatamiz */}
            <div className="w-full max-w-[410px]">
              <CardSeach stadium={stadiumOneData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StadionMapSearch;
