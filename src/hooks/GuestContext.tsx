"use client";
import { createContext, useEffect, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

type GuestContextType = {
  guestId: string | null;
};

const GuestContext = createContext<GuestContextType>({ guestId: null });

export const GuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    const sessionToken = Cookies.get("session-token");

    if (!sessionToken) {
      let id = Cookies.get("guest-id");
      if (!id) {
        id = uuidv4();
        Cookies.set("guest-id", id, { expires: 7 });
      }
      setGuestId(id);
    }
  }, []);

  return (
    <GuestContext.Provider value={{ guestId }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => useContext(GuestContext);
