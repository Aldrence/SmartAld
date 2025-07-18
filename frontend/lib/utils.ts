import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Utility for conditional Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Utility to fetch uploaded files from backend
export async function getUploadedFiles() {
  const token = localStorage.getItem("token"); // optional: for protected routes

  const res = await fetch("http://localhost:8000/api/uploads", {
    headers: {
      Authorization: `Bearer ${token}`, // comment this line if your endpoint is public
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch uploads");
  }

  return res.json();
}
