import { YMaps, Map, Placemark } from "react-yandex-maps";

import { GeoPoint } from "@/types/pocketbaseTypes";

const mapState = {
  center: [41.2995, 69.2401],
  zoom: 13,
};

const YandexMapComponent = ({
  onSelect,
  value,
}: {
  onSelect?: (lat: number, lng: number) => void;
  value?: GeoPoint;
}) => {
  return (
    <YMaps>
      <Map
        defaultState={mapState}
        width="100%"
        height={"100%"}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(event: any) => {
          const coords = event.get("coords");
          if (coords && onSelect) {
            onSelect(coords[0], coords[1]);
          }
        }}
      >
        {value && (
          <Placemark
            geometry={[Number(value.lon), Number(value.lat)]}
            options={{
              iconLayout: "default#image",
              iconImageHref: "/stadium.svg",
              iconImageSize: [32, 32],
              iconImageOffset: [-16, -16],
            }}
          />
        )}
      </Map>
    </YMaps>
  );
};

export default YandexMapComponent;
