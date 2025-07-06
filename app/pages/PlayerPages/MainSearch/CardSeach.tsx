/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Carousel, message } from "antd";
import { useState, useEffect } from "react";
import { usePocketBaseCollection, usePocketBaseFile } from "@/pb/usePbMethods";
import { useQueryParam } from "@/hooks/useQueryParam";
import useNumberFormat from "@/hooks/useNumberFormat ";
import StarFullSvg from "@/assets/svg/StarFullSvg";
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/translation";
import { useUser } from "@/contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";

const CardSeach = ({ stadium }: { stadium: any }) => {
  const { chat_id } = useQueryParam();
  const { user: playerData } = useUser();
  const formatMoney = useNumberFormat();
  const { getFileUrl } = usePocketBaseFile();
  const navigate = useNavigate();
  const t = useTranslation();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(stadium.isSaved);
  const [isProcessing, setIsProcessing] = useState(false);

  const { create, remove } = usePocketBaseCollection("user_favorite_stadiums");
  const { patch } = usePocketBaseCollection("stadiums");
  const { mutateAsync: mutatePatch } = patch();
  const { mutateAsync: createFavorite } = create();
  const { mutateAsync: removeFavorite } = remove();

  // ✅ Stadium.isSaved o'zgarganda local state'ni update qilish
  useEffect(() => {
    setSaved(stadium.isSaved);
  }, [stadium.isSaved]);

  const toggleSaved = async (stadium: any) => {
    if (isProcessing) return; // ✅ Prevent double clicks

    setIsProcessing(true);
    const previousSaved = saved;
    const newSaved = !saved;

    // ✅ Optimistic update
    setSaved(newSaved);

    try {
      if (newSaved) {
        // ✅ Adding to favorites
        const favoriteRecord = await createFavorite({
          user: playerData?.id,
          stadium: stadium?.id,
        });

        // ✅ Update stadium with savedId and isSaved
        await mutatePatch({
          id: stadium.id,
          data: {
            isSaved: true,
            savedId: (favoriteRecord as { id: string }).id,
          },
        });
        message.success(
          t({
            uz: "Sevimlilar ro'yxatiga qo'shildi!",
            en: "Added to favorites!",
            ru: "Добавлено в избранное!",
          })
        );
      } else {
        // ✅ Removing from favorites
        if (stadium.savedId) {
          await removeFavorite(stadium.savedId);
        }

        // ✅ Update stadium
        await mutatePatch({
          id: stadium.id,
          data: {
            isSaved: false,
            savedId: null,
          },
        });
        message.success(
          t({
            uz: "Sevimlilar ro'yxatidan olib tashlandi!",
            en: "Removed from favorites!",
            ru: "Удалено из избранного!",
          })
        );
      }

      // ✅ Invalidate and refetch stadium queries
      queryClient.invalidateQueries({
        queryKey: ["stadiums"],
      });
    } catch (error) {
      // ✅ Revert optimistic update on error
      console.error("❌ Favorite toggle error:", error);
      setSaved(previousSaved);
      message.error(
        t({
          uz: "Xatolik yuz berdi!",
          en: "An error occurred!",
          ru: "Произошла ошибка!",
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <motion.div
      initial={{ y: 100, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="#search__card min-h-[283px] bg-white mt-4 p-2 rounded-[20px] shadow-lg">
        {/* card imagebox */}
        <div className="card-imagebox relative h-[188px] w-full  rounded-[20px] overflow-hidden">
          {stadium.images && stadium.images.length > 0 ? (
            <Carousel autoplay infinite className="h-full">
              {stadium.images.map((image: string, index: number) => (
                <div key={index} className="h-[188px] w-full">
                  <img
                    loading="lazy"
                    src={getFileUrl(stadium.collectionId, stadium.id, image)}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 font-medium text-sm">
                No photo
              </span>
            </div>
          )}{" "}
          {/* Heart icon */}
          <span
            onClick={() => toggleSaved(stadium)}
            className={`absolute w-7 h-7 z-10 top-6 right-4 rounded-[6px] flex items-center justify-center cursor-pointer transition-all duration-200 ${
              isProcessing ? "opacity-50 pointer-events-none" : ""
            }`}
            style={{
              backgroundColor: saved ? "#EF4444" : "#737980", // 🔴 red-500 yoki kulrang
            }}
          >
            {" "}
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart color="white" size={16} />
            )}
          </span>
        </div>

        {/* card infobox */}
        <div
          className="card-infobox py-2 mt-3"
          onClick={() => {
            localStorage.setItem("stadium", JSON.stringify(stadium));
            navigate(`/client/arena?chat_id=${chat_id}`);
          }}
        >
          <div className="flex items-center justify-between ">
            <div className="left flex items-center justify-start gap-2">
              <h4 className="leading-6 text-[16px] font-medium  w-[140px] ">
                {stadium.name.charAt(0).toUpperCase() +
                  stadium.name.slice(1).toLowerCase()}
              </h4>
              <div className="flex items-center justify-center gap-1">
                <StarFullSvg
                  width={20}
                  height={20}
                  color="rgba(255, 179, 35, 1)"
                />
                <p
                  className="text-[14px] leading-5"
                  style={{ color: "rgba(108, 112, 114, 1)" }}
                >
                  {stadium.ratesCount}
                </p>
              </div>
            </div>
            <div
              className="right bg-green-400 px-3 py-1 rounded-[6px]"
              style={{
                background: "rgba(236, 252, 229, 1)",
                color: "rgba(151, 156, 158, 1)",
              }}
            >
              <span
                className="text-[16px] font-medium "
                style={{ color: "rgb(66, 186, 61)" }}
              >
                {formatMoney(stadium.price)}
              </span>
              UZS
            </div>
          </div>

          {/* card location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-2">
              <MapPin />
              <div className="text-[14px] leading-5 text-gray-600">
                <p className="text-[14px] leading-4 text-[#404446] font-[600]">
                  {stadium.expand?.city?.expand?.region?.expand?.name?.eng},
                </p>
                <p>{stadium.expand?.city?.expand?.name?.key},</p>
              </div>
            </div>
            <div className="boots flex items-center justify-center gap-2">
              {stadium?.hasGrass && <BootsBig width={30} height={14} />}
              {stadium?.hasFutsal && <BootsMin width={30} height={14} />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardSeach;
