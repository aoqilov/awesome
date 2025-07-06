/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { YMaps, Map, Placemark, ZoomControl } from "@pbe/react-yandex-maps";
import locationStadion from "../assets/svg/svgStadion.svg?url";
import LocationStadion from "@/assets/svg/LocationStadion";

interface YandexMapPickerProps {
  lat: number;
  lon: number;
  onAddress?: (address: string) => void;
}

const YandexMapPicker: React.FC<YandexMapPickerProps> = ({
  lat,
  lon,
  onAddress,
}) => {
  const mapRef = useRef<any>(null);

  // Telegram WebApp ichida ishlayaptimi aniqlash
  const isTelegramWebView = (): boolean => {
    return (
      typeof window !== "undefined" &&
      ((window as any).TelegramWebView ||
        window.location.href.includes("tgWebApp"))
    );
  };

  // Manzil olish
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
        onAddress?.(found);
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
  };

  useEffect(() => {
    getAddress();
  }, [lat, lon]);

  // Marshrut tuzish funksiyasi (brauzerda ishlaydi)
  const navigateToStadium = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://yandex.com/maps/?rtext=${latitude},${longitude}~${lat},${lon}&rtt=auto`;
          window.open(url, "_blank");
        },
        (error) => {
          console.error("Location access denied:", error.message);
          alert("Joylashuvni aniqlab bo‘lmadi.");
        }
      );
    } else {
      alert("Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.");
    }
  };

  // Mobilda Yandex.Navigator ilovasini ochish
  const openYandexNavigatorApp = () => {
    const url = `yandexnavi://build_route_on_map?lat_to=${lat}&lon_to=${lon}`;

    if (isTelegramWebView()) {
      alert(
        "Telegram ichidan Yandex Navigator ilovasini ochib bo‘lmaydi.\n\nIltimos, brauzer orqali sahifani oching yoki bu linkni Telegram chat orqali yuboring:"
      );
      console.log("Yandex Navi deeplink:", url);
    } else {
      window.location.href = url;
    }
  };

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
          position: "relative",
        }}
      >
        <Map
          defaultState={{ center: [lat, lon], zoom: 16 }}
          width="100%"
          height="100%"
          instanceRef={mapRef}
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

        {/* Brauzerda marshrut ochish */}
        <button
          onClick={navigateToStadium}
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            backgroundColor: "white",
            padding: "8px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 0 6px rgba(0,0,0,0.15)",
          }}
          title="Brauzerda marshrutni ochish"
        >
          <LocationStadion />
        </button>

        {/* Yandex Navigator ilovasini ochish */}
        <button
          onClick={openYandexNavigatorApp}
          style={{
            position: "absolute",
            bottom: 5,
            left: 5,
            backgroundColor: "white",
            padding: "8px 85px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 0 6px rgba(0,0,0,0.15)",
          }}
          title="Yandex Navigator ilovasida ochish"
        >
          <span>📍YandexNavi</span>
        </button>
      </div>
    </YMaps>
  );
};

export default YandexMapPicker;
