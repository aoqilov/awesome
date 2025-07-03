import React, { useEffect, useState } from "react";
import { YMaps, Map, Placemark, ZoomControl } from "@pbe/react-yandex-maps";
import locationStadion from "../assets/svg/svgStadion.svg?url";

interface YandexMapMarkerProps {
  lat: number;
  lon: number;
  onAddress?: (address: string) => void;
}

const YandexMapPicker: React.FC<YandexMapMarkerProps> = ({
  lat,
  lon,
  onAddress,
}) => {
  const [address, setAddress] = useState("");

  const getAddress = async () => {
    try {
      const res = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=5f9adfc9-44b5-4c03-bb42-18102ecc41ab&geocode=${lon},${lat}`
      );
      const data = await res.json();
      const found =
        data.response.GeoObjectCollection.featureMember[0]?.GeoObject
          ?.metaDataProperty?.GeocoderMetaData?.text;

      if (found) {
        setAddress(found);
        onAddress?.(found);
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
  };

  useEffect(() => {
    getAddress();
  }, [lat, lon]);

  return (
    <YMaps
      query={{ lang: "ru_RU", apikey: "5f9adfc9-44b5-4c03-bb42-18102ecc41ab" }}
    >
      <div
        style={{
          width: "100%",
          height: "200px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Map
          defaultState={{ center: [lat, lon], zoom: 16 }}
          width="100%"
          height="100%"
        >
          <ZoomControl options={{ position: { right: 10, top: 10 } }} />
          <Placemark
            geometry={[lat, lon]}
            options={{
              iconLayout: "default#image",
              iconImageHref: locationStadion,
              iconImageSize: [40, 40],
              iconImageOffset: [-20, -40],
            }}
          />
        </Map>
      </div>

      <div className="mt-2 text-[12px] text-gray-700">
        <strong>Manzil:</strong> {address || "Yuklanmoqda..."}
      </div>
    </YMaps>
  );
};

export default YandexMapPicker;
