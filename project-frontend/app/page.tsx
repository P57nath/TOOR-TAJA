import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <main className="text-center p-8">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">Seller Portal</h1>
        <p className="text-xl mb-8 text-gray-600">Manage your shop, products, and orders efficiently.</p>

        <div className="flex flex-wrap justify-center gap-6">
          {/* Navigation Cards */}
          <Link href="/login" className="p-6 w-64 border rounded-xl hover:shadow-lg transition bg-white text-center">
            <h3 className="text-2xl font-bold mb-2">Login</h3>
            <p className="text-sm text-gray-500">Access your existing shop dashboard.</p>
          </Link>

          <Link href="/register" className="p-6 w-64 border rounded-xl hover:shadow-lg transition bg-white text-center">
            <h3 className="text-2xl font-bold mb-2">Register</h3>
            <p className="text-sm text-gray-500">Create a new seller account today.</p>
          </Link>

          {/* Example of linking to a dynamic product page */}
          <Link href="/product/55" className="p-6 w-64 border rounded-xl hover:shadow-lg transition bg-white text-center">
            <h3 className="text-2xl font-bold mb-2">Demo Product</h3>
            <p className="text-sm text-gray-500">Test the dynamic routing for Product ID 55.</p>
          </Link>
        </div>
      </main>

      <footer className="mt-12 text-gray-400">
        © 2025 TOOR-TAJA by Mahir
      </footer>
    </div>
  );
}