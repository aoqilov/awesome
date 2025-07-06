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
  stadiums?: Stadium[]; // stadiums endi optional
  onMarkerClick?: (stadiumId: string, address: string) => void;
  shouldResetBounds?: boolean; // ✅ Map ni reset qilish uchun
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
      <div className="h-full w-full">
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
        </Map>
      </div>
    </YMaps>
  );
};

export default React.memo(YandexStadiumMap);
