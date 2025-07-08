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

  // Merged navigation function that tries app first, then falls back to browser
  const navigateToLocation = () => {
    // Always prepare the browser URL as fallback
    const openBrowserNavigation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const browserUrl = `https://yandex.com/maps/?rtext=${latitude},${longitude}~${lat},${lon}&rtt=auto`;
            window.open(browserUrl, "_blank");
          },
          (error) => {
            console.error("Location access denied:", error.message);
            // Use fixed URL without current location if geolocation denied
            const browserUrl = `https://yandex.com/maps/?rtext=~${lat},${lon}&rtt=auto`;
            window.open(browserUrl, "_blank");
            alert("Joylashuvni aniqlab bo'lmadi, manzil xaritada ko'rsatildi.");
          }
        );
      } else {
        // If no geolocation support, show destination on map
        const browserUrl = `https://yandex.com/maps/?pt=${lat},${lon}`;
        window.open(browserUrl, "_blank");
        alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi, manzil xaritada ko'rsatildi.");
      }
    };

    // Yandex Navigator app deeplink
    const appUrl = `yandexnavi://build_route_on_map?lat_to=${lat}&lon_to=${lon}`;

    // In Telegram WebView, use a safer approach
    if (isTelegramWebView()) {
      console.log("Telegram WebView detected, using safer navigation method");
      
      // For Telegram WebView, use an iframe to try to open the app
      // This method prevents the "Failed to launch" error
      try {
        // Create a hidden iframe for app attempt
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);
        
        // Remove iframe after short delay
        setTimeout(() => {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 500);
        
        // Fallback to browser navigation after a short delay
        setTimeout(openBrowserNavigation, 1500);
      } catch (e) {
        // If any error, immediately go to browser navigation
        console.error("Error launching app from Telegram WebView:", e);
        openBrowserNavigation();
      }
    } else {
      // For regular browser, use a more reliable approach
      try {
        // Create a hidden iframe for app attempt
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);
        
        // Remove iframe after short delay
        setTimeout(() => {
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 500);
        
        // Fallback to browser navigation after a short delay
        setTimeout(openBrowserNavigation, 1500);
      } catch (e) {
        // If any error, immediately go to browser navigation
        console.error("Error launching app:", e);
        openBrowserNavigation();
      }
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

        {/* Navigation buttons - unified under one function */}
        <button
          onClick={navigateToLocation}
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
          title="Marshrutni ochish"
        >
          <LocationStadion />
        </button>

        <button
          onClick={navigateToLocation}
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
