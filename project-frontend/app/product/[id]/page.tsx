// Server Component (Default in App Router)
export default function ProductDetails({ params }: { params: { id: string } }) {
  // In a real app, you would fetch product data using params.id here
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-800 p-4">
          <h1 className="text-white text-xl font-bold">Product Management</h1>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Details</h2>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-lg">
              Currently Editing Product ID: <span className="font-mono font-bold text-red-600">{params.id}</span>
            </p>
          </div>
          
          <div className="mt-6 flex gap-4">
             <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit Product</button>
             <button className="bg-red-500 text-white px-4 py-2 rounded">Delete Product</button>
          </div>
        </div>
      </div>
    </div>
  );
}