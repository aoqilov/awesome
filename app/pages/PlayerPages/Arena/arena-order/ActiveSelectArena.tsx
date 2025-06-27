/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

import SetactveCard from "../components/SetactveCard";
import SetDefaultCard from "../components/SetDefaultCard";

import { useParams } from "react-router-dom";

const ActiveSelectArena = ({
  maydonlar,
  getActiveField,
}: {
  maydonlar: any;
  getActiveField?: (field: any) => void;
}) => {
  const { id } = useParams();

  const [activeId, setActiveId] = useState<string>(() => {
    const found = maydonlar?.find((m: any) => m.id === id);
    return found ? found.id : maydonlar?.[0]?.id || "";
  });

  // Call getActiveField when activeId changes
  useEffect(() => {
    if (activeId && maydonlar && getActiveField) {
      const activeField = maydonlar.find((field: any) => field.id === activeId);
      if (activeField) {
        getActiveField(activeField);
      }
    }
  }, [activeId, maydonlar, getActiveField]);

  return (
    <div className="">
      {" "}
      <div className=" flex gap-2 overflow-x-auto w-full bg-white rounded-2xl p-2 shadow-md scrollbar-hide">
        {maydonlar?.map((field: any) => {
          const isActive = field.id === activeId;
          return isActive ? (
            <SetactveCard
              getActiveField={getActiveField}
              key={field.id}
              field={field}
              onClick={() => setActiveId(field.id)}
            />
          ) : (
            <SetDefaultCard
              key={field.id}
              field={field}
              onClick={() => {
                setActiveId(field.id);
                // Immediately call getActiveField when selecting new field
                if (getActiveField) {
                  getActiveField(field);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActiveSelectArena;
