"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return <p>Checking access...</p>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="mt-4 text-gray-600 italic">"Welcome to Toor-Taja Seller Platform"</p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-6 rounded">Manage Products</div>
          <div className="bg-green-100 p-6 rounded">View Orders</div>
        </div>
        <button 
          onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
          className="mt-10 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}