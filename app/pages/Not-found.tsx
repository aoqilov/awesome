// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Sahifa topilmadi</p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition"
      >
        Asosiy sahifaga qaytish
      </Link>
    </div>
  );
};

export default NotFound;
