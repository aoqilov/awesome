/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, MapPin } from "lucide-react";
import BootsBig from "@/assets/boots/bootsBig";
import BootsMin from "@/assets/boots/bootsMin";
import StarFullSvg from "@/assets/svg/StarFullSvg";
import { useNavigate } from "react-router-dom";
import { Carousel } from "antd";
import { usePocketBaseFile } from "@/pb/usePbMethods";
import { useQueryParam } from "@/hooks/useQueryParam";
import useNumberFormat from "@/hooks/useNumberFormat ";

const CardSeach = ({ stadium }: { stadium: any }) => {
  const { chat_id } = useQueryParam();
  const formatMoney = useNumberFormat();
  const { getFileUrl } = usePocketBaseFile();
  const navigate = useNavigate();
  return (
    <div className="#search__card min-h-[283px] bg-white mt-5 p-2 rounded-4xl shadow-lg">
      {/* card imagebox */}
      <div className="card-imagebox relative h-[188px] w-full rounded-3xl overflow-hidden">
        <Carousel autoplay infinite>
          {stadium.images?.map((image: any, index: any) => (
            <div key={index}>
              <img
                loading="lazy"
                className="rounded-xl w-full h-full object-cover"
                src={getFileUrl(stadium.collectionId, stadium.id, image)}
                alt={`Image ${index}`}
              />
            </div>
          ))}
        </Carousel>
        <span
          className="absolute w-7 h-7   z-10 top-6 right-4 rounded-[6px] flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: "rgba(255, 82, 71, 1)" }}
        >
          <Heart size={20} color="white" />
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
        {/*card info-name */}
        <div className="flex items-center justify-between ">
          <div className="left flex items-center justify-start gap-2">
            <h4 className="leading-6 text-[16px] font-medium">
              {stadium.name}
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
              className="text-[16px] font-medium"
              style={{ color: "rgb(66, 186, 61)" }}
            >
              {formatMoney(stadium.price)}
            </span>{" "}
            UZS
          </div>
        </div>
        {/* card location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <div>
              <MapPin />
            </div>{" "}
            <div className="text-[14px] leading-5 text-gray-600">
              <p>{stadium.address}</p>
              <p>{stadium.expand?.city?.expand?.region?.expand?.name.eng}</p>
            </div>
          </div>
          <div className="boots flex items-center justify-center gap-2">
            <BootsBig width={30} height={14} />
            <BootsMin width={30} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSeach;
