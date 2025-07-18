"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }

      setMessage("✅ Registration successful! You can now login.");
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Network error"}`);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input className="mt-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input className="mt-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="mt-4 w-full" onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
