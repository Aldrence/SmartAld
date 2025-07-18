"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b shadow z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">SmartAldrence</h1>
        <div className="space-x-6">
          <Link href="/upload" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
            Upload
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
            Dashboard
          </Link>
          <Link href="/chat" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
            Assistant
          </Link>
        </div>
      </div>
    </nav>
  );
}
