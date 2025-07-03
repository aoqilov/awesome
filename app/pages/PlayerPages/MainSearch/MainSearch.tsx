/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CardSeach from "./CardSeach";
import { useTranslation } from "@/hooks/translation";
import { StadiumsRecord } from "@/types/pocketbaseTypes";
import { useEffect, useState } from "react";
import { pb } from "@/pb/pb";
import Loading from "@/pages/Loading";
import { useDebounce } from "use-debounce";
import SearchHeader from "@/components/PlayerSearchBox";

const MainSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const t = useTranslation();

  // 1. localStorage'dan filterData ni useEffect orqali olish
  useEffect(() => {
    const stored = localStorage.getItem("filterData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setFilterData(parsed);
        }
      } catch (e) {
        console.error("FilterData JSON xato:", e);
      }
    }
  }, []);

  // 2. filter string'ni yasash
  const filterParts: string[] = [];

  if (filterData.fieldType === "grass") {
    filterParts.push(`hasGrass = true`);
  } else if (filterData.fieldType === "futsal") {
    filterParts.push("hasFutsal = true");
  }

  if (filterData.region) {
    filterParts.push(`city.region = "${filterData.region}"`);
  }
  if (filterData.city) {
    filterParts.push(`city = "${filterData.city}"`);
  }
  if (filterData.fieldSize) {
    filterParts.push(`fields.size.id ?= "${filterData?.fieldSize}"`); // 9r658xm7v7bpv29 bu yerda filterData.fieldSize ni o'zgartiring
  }
  if (
    Array.isArray(filterData.timeRange) &&
    filterData.timeRange.length === 2
  ) {
    const [from, to] = filterData.timeRange;
    filterParts.push(`worktime_from >=${from} && worktime_to <=${to}`);
    // filterParts.push(`worktime_to >=${to}`);
  }
  if (
    Array.isArray(filterData.priceRange) &&
    filterData.priceRange.length === 2
  ) {
    const [minPrice, maxPrice] = filterData.priceRange;
    filterParts.push(`price >= ${minPrice} && price <= ${maxPrice}`);
  }
  if (Array.isArray(filterData.amenities) && filterData.amenities.length > 0) {
    const amenityFilters = filterData.amenities.map(
      (id: string) => `features.id ?= "${id}"`
    );
    filterParts.push(...amenityFilters);
  }

  const combinedFilter = filterParts.join(" && ");
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["stadiums", debouncedSearchTerm, combinedFilter, showOnlySaved],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const filterQuery = [
        combinedFilter,
        debouncedSearchTerm ? `name ~ "${debouncedSearchTerm}"` : null,
        showOnlySaved ? "isSaved = true" : null,
        // `status ="verified"`,
      ]
        .filter(Boolean)
        .join(" && ");

      const result = await pb
        .collection("stadiums")
        .getList<StadiumsRecord>(pageParam, 5, {
          sort: "-created",
          expand: "city.region.name, field",
          filter: filterQuery,
        });

      return result;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    refetch();
  }, [debouncedSearchTerm, showOnlySaved]);

  return (
    <div className="p-4">
      {/* SEARCH HEADER */}
      <SearchHeader
        value={searchTerm}
        onChange={(val: string) => setSearchTerm(val.toLowerCase())}
        showOnlySaved={showOnlySaved}
        onToggleSaved={() => setShowOnlySaved((prev) => !prev)}
        isFilterActive={location.pathname.includes("filter")}
        isMapActive={location.pathname.includes("map")}
      />

      {/* CLEAR FILTER BUTTON */}
      {Object.keys(filterData).length > 0 && (
        <div
          onClick={() => {
            localStorage.removeItem("filterData");
            setFilterData({}); // sahifani reload qilmasdan filter tozalandi
          }}
          className="flex justify-center"
        >
          <div
            style={{ background: "#00C951" }}
            className="text-white text-center text-[16px] p-1 w-[50%] rounded-[8px] cursor-pointer"
          >
            {t({
              uz: "Filtrlar tozalash",
              en: "Clear filters",
              ru: "Очистить фильтры",
            })}
          </div>
        </div>
      )}

      {/* STADIUM CARDS */}
      <div className="space-y-4 mt-6">
        {isLoading ? (
          <Loading />
        ) : (
          data?.pages.map((page) =>
            page.items.map((stadium) => (
              <CardSeach key={stadium.id} stadium={stadium} />
            ))
          )
        )}
      </div>

      {/* INFINITE SCROLL */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-4">
          {isFetchingNextPage ? <Loading /> : <Loading />}
        </div>
      )}
    </div>
  );
};

export default MainSearch;
