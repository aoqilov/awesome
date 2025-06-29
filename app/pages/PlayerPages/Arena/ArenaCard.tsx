// components/StadiumCard.tsx
import CalendarSvg from "@/assets/svg/CalendarSvg";
import StadionSvgBlue from "@/assets/svg/StadionSvgBlue";
import { Button, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/translation";
import { useQueryParam } from "@/hooks/useQueryParam";
import { usePocketBaseFile } from "@/pb/usePbMethods";
import useNumberFormat from "@/hooks/useNumberFormat ";
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";
import { FieldsRecord } from "@/types/pocketbaseTypes";

type Props = {
  item: FieldsRecord;
};

const ArenaCard: React.FC<Props> = ({ item }) => {
  //
  const format = useNumberFormat();
  const { getFileUrl } = usePocketBaseFile();
  const { chat_id } = useQueryParam();
  //
  const navigate = useNavigate();
  const t = useTranslation();
  return (
    <div className=" w-full h-[342px] rounded-xl bg-white shadow-md overflow-hidden mb-4">
      <Carousel autoplay infinite>
        {item.images?.map((image, index) => (
          <div key={index}>
            <img
              loading="lazy"
              className="h-[188px] w-full object-cover p-2 rounded-xl"
              src={getFileUrl(item.collectionId, item.id, image)}
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </Carousel>

      <div className="px-4">
        <h3
          className="text-base font-semibold h-[34px] flex items-center justify-center gap-2 rounded-[8px] mt-3 "
          style={{
            background: "rgba(242, 244, 245, 1)",
            color: "rgba(0, 120, 255, 1)",
          }}
        >
          <StadionSvgBlue />
          {item.name}
        </h3>
        <div className="flex items-center justify-between text-gray-500 mt-3">
          <div className="flex items-center gap-2">
            <span>{item.type === "grass" ? <BootsBig /> : <BootsMin />}</span>
            <span className="text-[16px] leading-4 font-medium">
              {item.type}
            </span>
            <span className="text-[16px] leading-4 font-medium ml-3">
              {item.expand.size?.name}
            </span>
          </div>
          <div className="">
            <span className="text-[16px] font-bold text-green-600 mr-2">
              {format(item.price)}
            </span>
            UZS
          </div>
        </div>

        <Button
          type="primary"
          size="small"
          onClick={() =>
            navigate(`/client/arena/${item.id}?chat_id=${chat_id}`)
          }
          style={{
            marginTop: "16px",
            height: "40px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
          icon={<CalendarSvg color="white" width={20} />}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {t({ uz: "Band qilish", en: "Book", ru: "Забронировать" })}
        </Button>
      </div>
    </div>
  );
};

export default ArenaCard;
