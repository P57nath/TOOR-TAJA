"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Endpoint: POST /seller/login [cite: 14]
      const response = await axios.post("http://localhost:3000/seller/login", credentials);
      
      if (response.data.success) {
        // Backend returns access_token in data 
        localStorage.setItem("token", response.data.data.access_token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-black p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Seller Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input className="border p-2 w-full mb-3" placeholder="Username" onChange={(e)=>setCredentials({...credentials, username: e.target.value})} required />
        <input className="border p-2 w-full mb-3" type="password" placeholder="Password" onChange={(e)=>setCredentials({...credentials, password: e.target.value})} required />
        <button type="submit" className="bg-green-600 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  );
}