import { Button } from 'antd';
import { Stadium, StadiumCard } from './StadionCard';
import imageStadim from '@/assets/stadion.png';
import { useTranslation } from '@/hooks/translation';
import { useNavigate } from 'react-router-dom';
// Main component that maps through the data
export default function StadiumList() {
  const t = useTranslation();
  const navigate = useNavigate();
  // Sample data array
  const stadiumsData: Stadium[] = [
    {
      id: '1',
      name: 'UzStadium',
      rating: 4.7,
      price: '000 000',
      city: 'Toshkent shahri',
      district: 'Shayhontohur tumani',
      images: [imageStadim, imageStadim, imageStadim, imageStadim],
      status: 'approved',
      features: ['football', 'running']
    },
    {
      id: '2',
      name: 'Bunyodkor',
      rating: 4.5,
      price: '150 000',
      city: 'Toshkent shahri',
      district: 'Chilonzor tumani',
      images: [imageStadim, imageStadim, imageStadim],
      status: 'moderating',
      features: ['football', 'tennis']
    },
    {
      id: '3',
      name: 'Pakhtakor',
      rating: 4.9,
      price: '200 000',
      city: 'Toshkent shahri',
      district: 'Yunusobod tumani',
      images: [imageStadim, imageStadim, imageStadim, imageStadim],
      status: 'approved',
      features: ['football', 'basketball']
    },
    {
      id: '4',
      name: 'Lokomotiv',
      rating: 4.3,
      price: '120 000',
      city: 'Toshkent shahri',
      district: "Mirzo Ulug'bek tumani",
      images: [imageStadim, imageStadim],
      status: 'approved',
      features: ['football', 'volleyball']
    }
  ];
  return (
    <div>
      <h1 className="text-xl text-center  mb-4"> Menign stadionlarim</h1>
      <div className=" grid grid-cols-1 gap-6">
        {stadiumsData.map((stadium) => (
          <StadiumCard key={stadium.id} stadium={stadium} />
        ))}
      </div>
      <div className="w-full my-4">
        <Button
          size="large"
          type="primary"
          className="w-full"
          onClick={() => navigate('add-stadium')}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_21491_18263)">
                <path
                  d="M8 10V13C8 13.2833 8.096 13.521 8.288 13.713C8.48 13.905 8.71734 14.0007 9 14C9.28334 14 9.521 13.904 9.713 13.712C9.905 13.52 10.0007 13.2827 10 13V10H13C13.2833 10 13.521 9.904 13.713 9.712C13.905 9.52 14.0007 9.28267 14 9C14 8.71667 13.904 8.479 13.712 8.287C13.52 8.095 13.2827 7.99934 13 8H10V5C10 4.71667 9.904 4.479 9.712 4.287C9.52 4.095 9.28267 3.99934 9 4C8.71667 4 8.479 4.096 8.287 4.288C8.095 4.48 7.99934 4.71734 8 5V8H5C4.71667 8 4.479 8.096 4.287 8.288C4.095 8.48 3.99934 8.71734 4 9C4 9.28334 4.096 9.521 4.288 9.713C4.48 9.905 4.71734 10.0007 5 10H8ZM2 18C1.45 18 0.979002 17.804 0.587002 17.412C0.195002 17.02 -0.000664969 16.5493 1.69779e-06 16V2C1.69779e-06 1.45 0.196002 0.979002 0.588002 0.587002C0.980002 0.195002 1.45067 -0.000664969 2 1.69779e-06H16C16.55 1.69779e-06 17.021 0.196002 17.413 0.588002C17.805 0.980002 18.0007 1.45067 18 2V16C18 16.55 17.804 17.021 17.412 17.413C17.02 17.805 16.5493 18.0007 16 18H2ZM2 16H16V2H2V16Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_21491_18263">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
        >
          {t({
            uz: 'Stadion yaratish',
            ru: 'Создать стадион',
            en: 'Create stadium'
          })}
        </Button>
      </div>
    </div>
  );
}
