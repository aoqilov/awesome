/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import locationBall from "../assets/svg/svgBall.svg?url";
import locationStadion from "../assets/svg/svgStadion.svg?url";

import {
  YMaps,
  Map,
  ZoomControl,
  Placemark,
  Clusterer,
} from "@pbe/react-yandex-maps";
import { Stadium } from "@/pages/ManagerPages/Stadion/StadionCard";

interface Props {
  stadiums?: Stadium[];
  onMarkerClick?: (stadiumId: string, address: string) => void;
  shouldResetBounds?: boolean;
}

const YANDEX_API_KEY = "5f9adfc9-44b5-4c03-bb42-18102ecc41ab";

const YandexStadiumMap: React.FC<Props> = ({
  stadiums = [],
  onMarkerClick,
  shouldResetBounds = false,
}) => {
  const validStadiums = useMemo(
    () => (Array.isArray(stadiums) ? stadiums : []),
    [stadiums]
  );

  const mapRef = useRef<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const bounds = useMemo(() => {
    if (!validStadiums.length)
      return [
        [41.31, 69.28],
        [41.31, 69.28],
      ];
    return [
      [
        Math.min(...validStadiums.map((s) => s.longlat?.lat || 0)),
        Math.min(...validStadiums.map((s) => s.longlat?.lon || 0)),
      ],
      [
        Math.max(...validStadiums.map((s) => s.longlat?.lat || 0)),
        Math.max(...validStadiums.map((s) => s.longlat?.lon || 0)),
      ],
    ];
  }, [validStadiums]);
  useEffect(() => {
    // ✅ Agar stadium tanlangan bo'lsa (activeId mavjud) va reset talab qilinmagan bo'lsa, map zoom/center o'zgarmasin
    if (
      mapRef.current &&
      validStadiums.length &&
      (!activeId || shouldResetBounds)
    ) {
      mapRef.current.setBounds(bounds, {
        checkZoomRange: true,
        zoomMargin: 40,
      });

      // ✅ Reset bounds bo'lganda activeId ni ham reset qilamiz
      if (shouldResetBounds && activeId) {
        setActiveId(null);
      }
    }
  }, [bounds, validStadiums, activeId, shouldResetBounds]);

  const fetchAddress = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${YANDEX_API_KEY}&geocode=${lon},${lat}`
      );
      const data = await res.json();
      const found =
        data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject
          ?.metaDataProperty?.GeocoderMetaData?.text;

      return found || "Manzil topilmadi";
    } catch (err) {
      console.error("Reverse geocode xatolik:", err);
      return "Xatolik yuz berdi";
    }
  };

  const handleMarkerClick = useCallback(
    async (stadium: Stadium) => {
      const lat = stadium?.longlat?.lat;
      const lon = stadium?.longlat?.lon;
      if (!lat || !lon) return;

      if (mapRef.current) {
        mapRef.current.setCenter([lat - 0.0, lon], 12);
      }

      const address = await fetchAddress(lat, lon);
      setActiveId(stadium.id);
      onMarkerClick?.(stadium.id, address);
    },
    [onMarkerClick]
  );

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const location: [number, number] = [lat, lon];
        
        setUserLocation(location);
        setIsGettingLocation(false);
        
        if (mapRef.current) {
          mapRef.current.setCenter(location, 15);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
        
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  const placemarks = useMemo(() => {
    return validStadiums
      .filter((stadium) => stadium?.longlat?.lat && stadium?.longlat?.lon)
      .map((stadium) => (
        <Placemark
          key={stadium.id}
          geometry={[stadium?.longlat?.lat, stadium?.longlat?.lon]}
          options={{
            iconLayout: "default#image",
            iconImageHref:
              activeId === stadium.id ? locationBall : locationStadion,
            iconImageSize: [50, 50],
            iconImageOffset: [-25, -50],
          }}
          properties={{
            balloonContent: `<strong>${stadium.name}</strong>`,
          }}
          onClick={() => handleMarkerClick(stadium)}
        />
      ));
  }, [validStadiums, activeId, handleMarkerClick]);

  return (
    <YMaps query={{ lang: "ru_RU", apikey: YANDEX_API_KEY }}>
      <div className="h-full w-full relative">
        <Map
          instanceRef={(ref) => (mapRef.current = ref)}
          defaultState={{ center: [41.31, 69.28], zoom: 12 }}
          width="100%"
          height="100vh"
          modules={["control.ZoomControl", "clusterer.addon.balloon"]}
        >
          <ZoomControl
            options={{ size: "large", position: { right: 15, top: 150 } }}
          />
          <Clusterer
            options={{
              preset: "islands#invertedGreenClusterIcons",
              clusterRadius: 50,
              groupByCoordinates: false,
              clusterDisableClickZoom: false,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false,
            }}
          >
            {placemarks}
          </Clusterer>
          
          {/* User location marker */}
          {userLocation && (
            <Placemark
              geometry={userLocation}
              options={{
                iconLayout: "default#image",
                iconImageHref: "data:image/svg+xml;base64," + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="#4285f4" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="#ffffff"/>
                  </svg>
                `),
                iconImageSize: [20, 20],
                iconImageOffset: [-10, -10],
              }}
              properties={{
                balloonContent: "<strong>Your Location</strong>",
              }}
            />
          )}
        </Map>
        
        {/* Show Me Button */}
        <button
          onClick={getUserLocation}
          disabled={isGettingLocation}
          className="absolute bottom-36 right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          title="Show my location"
        >
          {isGettingLocation ? (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-gray-600"
            >
              <path 
                d="M12 8C9.79 8 8 9.79 8 12S9.79 16 12 16 16 14.21 16 12 14.21 8 12 8ZM12 14C10.9 14 10 13.1 10 12S10.9 10 12 10 14 10.9 14 12 13.1 14 12 14Z" 
                fill="currentColor"
              />
              <path 
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 10V8L19 7L20.64 4.64L19.36 3.36L17 5L16 3H14V5.2C14 5.2 14 5.2 14 5.2L14 6C15.1 6 16 6.9 16 8V10H18C19.1 10 20 10.9 20 12S19.1 14 18 14H16V16C16 17.1 15.1 18 14 18H12.8L12 19L11 18H10C8.9 18 8 17.1 8 16V14H6C4.9 14 4 13.1 4 12S4.9 10 6 10H8V8C8 6.9 8.9 6 10 6V5.2L10 5V3H8L7 5L4.64 3.36L3.36 4.64L5 7L3 8V10H5.2C5.2 10 5.2 10 5.2 10H6C6.9 10 6 10.9 6 12S6.9 14 6 14H8V16H10V18H12V16H14V14H16V12C16 10.9 15.1 10 14 10H12Z" 
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>
    </YMaps>
  );
};

export default React.memo(YandexStadiumMap);
