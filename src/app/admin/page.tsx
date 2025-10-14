import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Order Management</h2>
            <p className="text-gray-600 mb-4">View and manage customer orders.</p>
            <Link href="/admin/orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
              View Orders
            </Link>
          </div>

          {/* Placeholder for other admin features */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Product Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, or remove products.</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">User Management</h2>
            <p className="text-gray-600 mb-4">Manage user accounts and roles.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
