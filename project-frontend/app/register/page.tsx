"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    phoneNumber: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Endpoint: POST /seller/register [cite: 15]
      const response = await axios.post("http://localhost:3000/seller/register", formData);
      
      if (response.data.success) {
        alert("Registration Successful!");
        router.push("/login");
      }
    } catch (err: any) {
      // Requirement: Show error message if insertion fails
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Seller Registration</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
        <input className="border p-2 w-full mb-3" placeholder="Username" onChange={(e)=>setFormData({...formData, username: e.target.value})} required />
        <input className="border p-2 w-full mb-3" placeholder="Full Name" onChange={(e)=>setFormData({...formData, fullName: e.target.value})} required />
        <input className="border p-2 w-full mb-3" type="email" placeholder="Email (@gmail.com)" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
        <input className="border p-2 w-full mb-3" type="password" placeholder="Password (Min 6 chars + Uppercase)" onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
        
        <select className="border p-2 w-full mb-3" onChange={(e)=>setFormData({...formData, gender: e.target.value as any})}>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        
        <input className="border p-2 w-full mb-3" placeholder="Phone Number" onChange={(e)=>setFormData({...formData, phoneNumber: e.target.value})} required />
        
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Register Seller</button>
      </form>
    </div>
  );
}