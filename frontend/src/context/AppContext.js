import { createContext, useContext, useState } from "react";
import { customers } from "@/data/dataset";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);
  return (
    <AppContext.Provider value={{ selectedCustomerId, setSelectedCustomerId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
