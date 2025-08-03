"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  userId: string | null;
  userRole: string | null;
  specificId: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuth: (userId: string | null, userRole: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [specificId, setSpecificId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieStr = document.cookie;
    const cookiesArr = cookieStr.split(";");

    const sessionCookie = cookiesArr.find((cookie) =>
      cookie.trim().startsWith("session-token=")
    );

    if (!sessionCookie) {
      setLoading(false);
      return;
    }

    try {
      const jsonStr = decodeURIComponent(sessionCookie.split("=")[1]);
      const parsed = JSON.parse(jsonStr);

      if (parsed.userId && parsed.userRole) {
        setUserId(parsed.userId);
        setUserRole(parsed.userRole);
        setIsAuthenticated(true);

        // fetch specificId (e.g. seller_id or customer_id)
        fetch(`/api/auth/get-specific-id?userRole=${parsed.userRole}&userId=${parsed.userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setSpecificId(data.specificId);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error parsing session cookie:", err);
      setLoading(false);
    }
  }, []);

  const setAuth = (newUserId: string | null, newUserRole: string | null) => {
    setUserId(newUserId);
    setUserRole(newUserRole);
    setIsAuthenticated(!!newUserId);
    console.log("Set Auth called")
  };


  return (
    <AuthContext.Provider
      value={{ userId, userRole, specificId, isAuthenticated, loading, setAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
