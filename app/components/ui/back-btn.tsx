import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // bu brauzer tarixidagi bitta orqaga qaytadi
  };

  return (
    <button onClick={goBack} className="btn btn-outline cursor-pointer">
      <ChevronLeft size={20} color="black" />
    </button>
  );
};

export default BackBtn;
