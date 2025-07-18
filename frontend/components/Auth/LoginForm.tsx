"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  sub: string;
  email?: string;
  exp?: number;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // If already logged in, redirect
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      router.push("/upload");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:8001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const token = data.access_token;
      stayLoggedIn
        ? localStorage.setItem("token", token)
        : sessionStorage.setItem("token", token);

      router.push("/upload");
    } else {
      setError(data.detail || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login to SmartAldrence</h2>
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
      
      <div className="mt-2 flex items-center space-x-2">
        <input type="checkbox" id="stayLoggedIn" checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} />
        <label htmlFor="stayLoggedIn">Stay logged in</label>
      </div>

      <Button onClick={handleLogin} className="mt-4 w-full">Login</Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
