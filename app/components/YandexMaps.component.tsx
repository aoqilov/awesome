import { YMaps, Map, Placemark } from 'react-yandex-maps';

const mapState = {
  center: [41.2995, 69.2401],
  zoom: 13
};

const YandexMapComponent = ({
  onSelect,
  value
}: {
  onSelect: (lat: number, lng: number) => void;
  value?: string;
}) => {
  return (
    <YMaps>
      <Map
        defaultState={mapState}
        width="100%"
        height={'100%'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(event: any) => {
          const coords = event.get('coords');
          if (coords) {
            onSelect(coords[0], coords[1]);
          }
        }}
      >
        {value && (
          <Placemark
            geometry={[
              Number(value.split(',')[0]),
              Number(value.split(',')[1])
            ]}
            options={{
              iconLayout: 'default#image',
              iconImageHref: '/stadium.svg',
              iconImageSize: [32, 32],
              iconImageOffset: [-16, -16]
            }}
          />
        )}
      </Map>
    </YMaps>
  );
};

export default YandexMapComponent;
