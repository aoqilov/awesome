"use client";

import { useEffect, useRef } from "react";

interface YandexMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap({
  latitude,
  longitude,
  zoom = 15,
  className = "w-full h-96",
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const customMarkerSvg = `
    <svg width="31" height="42" viewBox="0 0 31 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_22308_9743)">
<path d="M28.6008 13.3439C28.6008 27.8481 17.6135 38.0011 15.3004 38.0011C12.9873 38.0011 2 27.8481 2 13.3439C2 6.05437 8.03463 0 15.3004 0C22.5661 0 28.6008 6.05437 28.6008 13.3439Z" fill="#42BA3D"/>
</g>
<g filter="url(#filter1_d_22308_9743)">
<ellipse cx="15.2994" cy="13.3416" rx="11.4205" ry="11.4579" fill="white"/>
</g>
<g clipPath="url(#clip0_22308_9743)">
<path d="M15.3008 4.89746C10.6448 4.89746 6.85645 8.6854 6.85645 13.3418C6.85645 17.9982 10.6448 21.7862 15.3008 21.7862C19.9568 21.7862 23.7451 17.9982 23.7451 13.3418C23.7451 8.6854 19.9568 4.89746 15.3008 4.89746ZM21.5406 8.80549H21.1796C21.0238 8.80549 20.8861 8.90606 20.838 9.05394L20.0642 11.4356L18.0401 12.3251L15.66 10.596V8.20913L17.6686 6.7507C17.7947 6.65914 17.8472 6.49698 17.7992 6.34911L17.6847 5.99671C19.249 6.50565 20.591 7.50244 21.5406 8.80549ZM12.9172 5.99636L12.8028 6.34877C12.7547 6.49702 12.8072 6.65876 12.9334 6.75036L14.9416 8.20879V10.5957L12.5614 12.3247L10.537 11.4349L9.76279 9.05321C9.71476 8.90459 9.57665 8.80477 9.42128 8.80477H9.06096C10.0105 7.50244 11.353 6.50565 12.9172 5.99636ZM7.57554 13.3358L7.87803 13.5557C7.94109 13.6011 8.01502 13.6248 8.08931 13.6248C8.16323 13.6248 8.23756 13.6015 8.30059 13.5557L10.2897 12.1104L12.3137 13.0003L13.2321 15.8252L12.0082 17.2825H9.51095C9.3552 17.2825 9.21747 17.3831 9.16944 17.5309L9.05798 17.8736C8.12987 16.5994 7.57516 15.0359 7.57516 13.3418C7.57516 13.3395 7.57554 13.3377 7.57554 13.3358ZM12.9112 20.685L13.2103 20.4666C13.3364 20.3757 13.3893 20.2128 13.3413 20.0654L12.579 17.7209L13.8029 16.2643H16.7986L18.0213 17.7209L17.2594 20.0657C17.2114 20.214 17.2647 20.3757 17.3908 20.4673L17.6899 20.685C16.937 20.9301 16.135 21.0678 15.3011 21.0678C14.4665 21.0678 13.6644 20.9308 12.9112 20.685ZM21.5432 17.8747L21.4317 17.5309C21.3833 17.3827 21.2452 17.2829 21.0898 17.2829L18.5929 17.2832L17.3702 15.8263L18.2878 13.001L20.3126 12.1116L22.3013 13.5558C22.3644 13.6019 22.4383 13.6252 22.5126 13.6252C22.5869 13.6252 22.6613 13.6019 22.724 13.5558L23.0265 13.3362C23.0265 13.3381 23.0268 13.34 23.0268 13.3422C23.0264 15.0359 22.471 16.5994 21.5432 17.8747Z" fill="#42BA3D"/>
</g>
<defs>
<filter id="filter0_d_22308_9743" x="0" y="0" width="30.6008" height="42.0011" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22308_9743"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22308_9743" result="shape"/>
</filter>
<filter id="filter1_d_22308_9743" x="2.87891" y="1.88379" width="24.8411" height="24.9157" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22308_9743"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22308_9743" result="shape"/>
</filter>
<clipPath id="clip0_22308_9743">
<rect width="16.8887" height="16.8887" fill="white" transform="translate(6.85645 4.89746)"/>
</clipPath>
</defs>
</svg>
  `;

  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=5f9adfc9-44b5-4c03-bb42-18102ecc41ab&lang=uz_RU";
      script.onload = () => {
        window.ymaps.ready(initializeMap);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        controls: ["zoomControl", "fullscreenControl"],
      });

      // Создаем кастомную иконку из SVG
      const customIcon = window.ymaps.templateLayoutFactory.createClass(
        `<div style="position: relative;">
          ${customMarkerSvg}
        </div>`,
        {
          getShape: () =>
            new window.ymaps.shape.Rectangle(
              new window.ymaps.geometry.pixel.Rectangle([
                [-15, -42],
                [15, 0],
              ])
            ),
          getOffset: () => [-15, -42],
        }
      );

      // Создаем метку с кастомной иконкой
      const placemark = new window.ymaps.Placemark(
        [latitude, longitude],
        {
          hintContent: "Метка на карте",
          balloonContent: `Координаты: ${latitude}, ${longitude}`,
        },
        {
          iconLayout: customIcon,
          iconShape: {
            type: "Rectangle",
            coordinates: [
              [-15, -42],
              [15, 0],
            ],
          },
        }
      );

      map.geoObjects.add(placemark);
      mapInstanceRef.current = map;
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div ref={mapRef} className={className} style={{ minHeight: "300px" }} />
  );
}
