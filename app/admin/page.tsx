'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    setIsDataLoading(true);
    if (activeTab === 'products') {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } else if (activeTab === 'users') {
      setUsers([
        { id: '1', name: 'Admin User', email: 'admin@aurave.com', role: 'admin' },
        { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user' },
      ]);
    }
    setIsDataLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  const handleAddProduct = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      }),
    });
    setNewProduct({ name: '', price: '', stock: '' });
    setShowAddForm(false);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>

          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`${activeTab === 'products' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`${activeTab === 'users' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Users
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {isDataLoading ? (
              <p className="text-gray-600">Loading data...</p>
            ) : (
              <>
                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
                      <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
                      >
                        {showAddForm ? 'Close Form' : 'Add New Product'}
                      </button>
                    </div>

                    {showAddForm && (
                      <div className="bg-white p-4 border rounded-md shadow-sm mb-6 space-y-4">
                        <input
                          type="text"
                          placeholder="Product Name"
                          className="border p-2 w-full"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          className="border p-2 w-full"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          className="border p-2 w-full"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        />
                        <button
                          onClick={handleAddProduct}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4">{product.name}</td>
                            <td className="px-6 py-4">PKR {product.price}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
                    <p className="text-sm text-gray-600">Mock users listed here</p>
                    {/* Future feature: promote/demote users */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
