"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadForm from "@/components/UploadDashboard/UploadForm";

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <UploadForm />
    </main>
  );
}
