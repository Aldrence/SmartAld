"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [type, setType] = useState("pdf");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setMessage("");

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (link) formData.append("link", link);
    formData.append("type", type);
    formData.append("description", description);

    const token = localStorage.getItem("token"); // ✅ Get token from localStorage

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token to Authorization header
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Uploaded successfully!");
        setFile(null);
        setLink("");
        setDescription("");
      } else {
        setMessage("❌ Upload failed: " + (data.detail || "Unknown error"));
      }
    } catch (error) {
      setMessage("❌ Upload failed: Network error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Trading Resource</h2>

      <Label>Resource Type</Label>
      <select
        className="w-full mb-4 border rounded p-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="pdf">📄 PDF</option>
        <option value="video">📹 Video</option>
        <option value="image">🖼️ Image</option>
      </select>

      {type === "video" ? (
        <>
          <Label>YouTube / Instagram / Video Link</Label>
          <Input
            type="url"
            placeholder="Paste video link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mb-4"
          />
        </>
      ) : (
        <>
          <Label>Upload File</Label>
          <Input
            type="file"
            accept={type === "pdf" ? ".pdf" : "image/*"}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4"
          />
        </>
      )}

      <Label>Description (what you want the bot to learn)</Label>
      <Textarea
        rows={4}
        placeholder="Describe the content and expected bot behavior..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleUpload} className="w-full">
        Upload & Generate
      </Button>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
