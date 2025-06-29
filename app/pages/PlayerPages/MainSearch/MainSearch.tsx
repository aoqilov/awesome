// import { useInfiniteQuery } from "@tanstack/react-query";
// import { Heart, Search } from "lucide-react";
// import CardSeach from "./CardSeach";
// import FileterSvg from "@/assets/svg/FileteSvg";
// import MapSvg from "@/assets/svg/MapSvg";
// import { useNavigate } from "react-router-dom";
// import BackBtn from "@/components/ui/back-btn";
// import { useTranslation } from "@/hooks/translation";
// import { StadiumsRecord } from "@/types/pocketbaseTypes";
// import { useQueryParam } from "@/hooks/useQueryParam";
// import { useEffect, useState } from "react";
// import { pb } from "@/pb/pb";

// const MainSearch = () => {

//   const { chat_id } = useQueryParam();
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//   const t = useTranslation();

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     refetch,
//   } = useInfiniteQuery({
//     queryKey: ["stadiums", searchTerm],
//     initialPageParam: 1,
//     queryFn: async ({ pageParam = 1 }) => {
//       const result = await pb.collection("stadiums").getList<StadiumsRecord>(
//         pageParam,
//         1, // har safar 1 ta stadium
//         {
//           sort: "-created",
//           expand: "city.region.name",
//           filter: searchTerm ? `name ~ "${searchTerm}"` : "",
//         }
//       );
//       return result;
//     },
//     getNextPageParam: (lastPage) =>
//       lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
//   });

//   // Refetch when search term changes
//   useEffect(() => {
//     refetch();
//   }, [searchTerm]);

//   return (
//     <div className="p-4">
//       {/* SEARCH HEADER */}
//       <div className="flex items-center justify-center gap-2 mb-4">
//         <BackBtn />
//         <div className="flex-1 relative rounded-[14px] border border-gray-300 bg-white h-[40px] flex items-center px-2">
//           <Search color="rgba(151, 156, 158, 1)" size={20} className="mr-2" />
//           <input
//             type="text"
//             placeholder={String(
//               t({
//                 uz: "Izlash...",
//                 en: "Search...",
//                 ru: "Поиск...",
//               })
//             )}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//             className="w-full h-full bg-transparent outline-none text-sm text-gray-700"
//           />
//           <div className="flex gap-2 ml-2">
//             <span
//               onClick={() => navigate(`/client/filter?chat_id=${chat_id}`)}
//               className="w-[32px] h-[32px] rounded-[8px] bg-[#ECFCE5] flex items-center justify-center cursor-pointer"
//             >
//               <FileterSvg width={20} height={20} color="green" />
//             </span>
//             <span className="w-[32px] h-[32px] rounded-[8px] bg-[#ECFCE5] flex items-center justify-center">
//               <MapSvg width={20} height={20} color="rgba(108,112,114,1)" />
//             </span>
//             <span className="w-[32px] h-[32px] rounded-[8px] bg-[#ECFCE5] flex items-center justify-center">
//               <Heart size={20} color="rgba(108,112,114,1)" />
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* STADIUM CARDLAR */}
//       <div className="space-y-4">
//         {isLoading ? (
//           <p>Yuklanmoqda...</p>
//         ) : (
//           data?.pages.map((page) =>
//             page.items.map((stadium) => (
//               <CardSeach key={stadium.id} stadium={stadium} />
//             ))
//           )
//         )}
//       </div>

//       {/* LOAD MORE BUTTON */}
//       {hasNextPage && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={() => fetchNextPage()}
//             disabled={isFetchingNextPage}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//           >
//             {isFetchingNextPage ? "Yuklanmoqda..." : "Ko‘proq ko‘rsatish"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainSearch;

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Heart, Search } from "lucide-react";
import CardSeach from "./CardSeach";
import FileterSvg from "@/assets/svg/FileteSvg";
import MapSvg from "@/assets/svg/MapSvg";
import { useNavigate } from "react-router-dom";
import BackBtn from "@/components/ui/back-btn";
import { useTranslation } from "@/hooks/translation";
import { StadiumsRecord } from "@/types/pocketbaseTypes";
import { useQueryParam } from "@/hooks/useQueryParam";
import { useEffect, useState } from "react";
import { pb } from "@/pb/pb";

const MainSearch = () => {
  const { chat_id } = useQueryParam();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const t = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["stadiums", searchTerm],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const result = await pb
        .collection("stadiums")
        .getList<StadiumsRecord>(pageParam, 10, {
          sort: "-created",
          expand: "city.region.name",
          filter: searchTerm ? `name ~ "${searchTerm}"` : "",
        });
      return result;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  // intersection observer
  const { ref, inView } = useInView();

  // scroll tagiga chiqqanda avtomatik fetch
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  // search change qilinganda queryni qayta ishga tushurish
  useEffect(() => {
    refetch();
  }, [searchTerm]);

  return (
    <div className="p-4">
      {/* SEARCH HEADER */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <BackBtn />
        <div className="flex-1 relative rounded-[14px] border border-gray-300 bg-white h-[40px] flex items-center px-2">
          <Search color="rgba(151, 156, 158, 1)" size={20} className="mr-2" />
          <input
            type="text"
            placeholder={String(
              t({
                uz: "Izlash...",
                en: "Search...",
                ru: "Поиск...",
              })
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="w-full h-full bg-transparent outline-none text-sm text-gray-700"
          />
          <div className="flex gap-2 ml-2">
            <span
              onClick={() => navigate(`/client/filter?chat_id=${chat_id}`)}
              className="w-[32px] h-[32px] rounded-[8px] bg-[#ECFCE5] flex items-center justify-center cursor-pointer"
            >
              <FileterSvg width={20} height={20} color="green" />
            </span>
            <span className="w-[32px] h-[32px] rounded-[8px] bg-[#ECFCE5] flex items-center justify-center">
              <MapSvg width={20} height={20} color="rgba(108,112,114,1)" />
            </span>
            <span className="w-[32px] h-[32px] rounded-[8px] bg-[#ECFCE5] flex items-center justify-center">
              <Heart size={20} color="rgba(108,112,114,1)" />
            </span>
          </div>
        </div>
      </div>

      {/* STADIUM CARDLAR */}
      <div className="space-y-4">
        {isLoading ? (
          <p>Yuklanmoqda...</p>
        ) : (
          data?.pages.map((page) =>
            page.items.map((stadium) => (
              <CardSeach key={stadium.id} stadium={stadium} />
            ))
          )
        )}
      </div>

      {/* INFINITE LOAD OBSERVER */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center mt-4">
          {isFetchingNextPage ? (
            <p>Yuklanmoqda...</p>
          ) : (
            <p className="text-gray-500 text-sm">Ko‘proq yuklash...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MainSearch;
