"use client";

import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { Button } from "@/components/ui/button";

interface DecodedToken {
  sub: string;
  email?: string;
  exp?: number;
}

export default function ProfileBox() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="p-4 bg-white shadow-md rounded mb-4">
      <p className="font-medium">👤 Logged in as: {user.email || user.sub}</p>
      <Button onClick={logout} className="mt-2">Logout</Button>
    </div>
  );
}
