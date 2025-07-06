import LogoWhite from "@/assets/svg/LogoWhite";

interface LogoBannerProps {
  message?: string;
}

const LogoBanner = ({ message = "Yuklanmoqda..." }: LogoBannerProps) => {
  return (
    <div className="h-screen w-full bg-[#42ba3d] flex flex-col items-center justify-center text-white text-center px-4">
      <LogoWhite />
      <p className="mt-6 text-lg font-medium animate-pulse max-w-md">
        {message}
      </p>
    </div>
  );
};

export default LogoBanner;
