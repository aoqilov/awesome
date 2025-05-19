import { Stadium, StadiumCard } from './StadionCard';
import imageStadim from '@/assets/stadion.png';
// Main component that maps through the data
export default function StadiumList() {
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
      <h1 className="text-sm text-center mt-2 mb-4"> Menign stadionlarim</h1>
      <div className=" grid grid-cols-1 gap-6">
        {stadiumsData.map((stadium) => (
          <StadiumCard key={stadium.id} stadium={stadium} />
        ))}
      </div>
    </div>
  );
}
