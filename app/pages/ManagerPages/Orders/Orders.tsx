import { Segmented } from "antd";
import { useState } from "react";
import OrderCard from "./OrderCard";

const Orders = () => {
  const [selected, setSelected] = useState("Umumiy");
  return (
    <div>
      <div className="relative">
        <h1 className="text-center text-xl ">Buyurtmalar</h1>
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        <Segmented
          value={selected}
          onChange={(e) => setSelected(e)}
          size="large"
          options={["Umumiy", "Maydonlar"]}
        />
      </div>
      <div className="mt-2">
        {[...Array(10)].map((_, index) => (
          <OrderCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
