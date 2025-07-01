"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  featured?: boolean;
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

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const initialProduct: Omit<Product, "id"> = {
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    savings: 0,
    image: "",
    rating: 0,
    reviewCount: 0,
    category: "",
    featured: false,
  };
  const [newProduct, setNewProduct] =
    useState<Omit<Product, "id">>(initialProduct);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login");
    }
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    setIsDataLoading(true);
    if (activeTab === "products") {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } else if (activeTab === "users") {
      setUsers([
        {
          id: "1",
          name: "Admin User",
          email: "admin@aurave.com",
          role: "admin",
        },
        { id: "2", name: "John Doe", email: "john@example.com", role: "user" },
      ]);
    }
    setIsDataLoading(false);
  };

  const handleUploadFile = async (
    e: ChangeEvent<HTMLInputElement>,
    isEditing: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.secure_url) {
      if (isEditing && editingProduct) {
        setEditingProduct((prev) =>
          prev ? { ...prev, image: data.secure_url } : prev
        );
      } else {
        setNewProduct((prev) => ({ ...prev, image: data.secure_url }));
      }
    } else {
      console.error("Cloudinary upload failed:", data);
    }
  };

  const handleAddProduct = async () => {
    setLoadingAction(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          originalPrice: Number(newProduct.originalPrice),
          savings: Number(newProduct.originalPrice) - Number(newProduct.price),
          rating: Number(newProduct.rating),
          reviewCount: Number(newProduct.reviewCount),
        }),
      });
      setNewProduct(initialProduct);
      setShowAddForm(false);
      loadData();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    setLoadingAction(true);
    try {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingProduct,
          price: Number(editingProduct.price),
          originalPrice: Number(editingProduct.originalPrice),
          savings:
            Number(editingProduct.originalPrice) - Number(editingProduct.price),
          rating: Number(editingProduct.rating),
          reviewCount: Number(editingProduct.reviewCount),
        }),
      });
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>

          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("products")}
                className={`${
                  activeTab === "products"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`${
                  activeTab === "users"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
                {activeTab === "products" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Product Management
                      </h2>
                      <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
                      >
                        {showAddForm ? "Close Form" : "Add New Product"}
                      </button>
                    </div>

                    {showAddForm && (
                      <div className="bg-white p-4 border rounded-md shadow-sm mb-6 space-y-4">
                        <input
                          type="text"
                          placeholder="Product Name"
                          className="border p-2 w-full"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            })
                          }
                        />
                        <textarea
                          placeholder="Description"
                          className="border p-2 w-full"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Price (PKR)"
                          className="border p-2 w-full"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Original Price (PKR)"
                          className="border p-2 w-full"
                          value={newProduct.originalPrice}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              originalPrice: Number(e.target.value),
                              savings:
                                Number(e.target.value) -
                                Number(newProduct.price),
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Savings (PKR)"
                          className="border p-2 w-full bg-gray-100"
                          value={newProduct.savings}
                          readOnly
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadFile(e, false)}
                          className="border p-2 w-full"
                        />
                        {newProduct.image && (
                          <img
                            src={newProduct.image}
                            alt="Preview"
                            className="w-24 h-24 object-cover"
                          />
                        )}
                        <input
                          type="number"
                          placeholder="Rating (0-5)"
                          className="border p-2 w-full"
                          value={newProduct.rating}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              rating: Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Review Count"
                          className="border p-2 w-full"
                          value={newProduct.reviewCount}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              reviewCount: Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          className="border p-2 w-full"
                          value={newProduct.category}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              category: e.target.value,
                            })
                          }
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newProduct.featured}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                featured: e.target.checked,
                              })
                            }
                            className="h-5 w-5"
                          />
                          <span>Featured Product</span>
                        </label>
                        <button
                          onClick={handleAddProduct}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                          disabled={loadingAction}
                        >
                          {loadingAction ? "Adding..." : "Submit"}
                        </button>
                      </div>
                    )}

                    {editingProduct && (
                      <div className="bg-yellow-50 p-4 border rounded-md shadow-sm mb-6 space-y-4">
                        <input
                          type="text"
                          placeholder="Product Name"
                          className="border p-2 w-full"
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                            })
                          }
                        />
                        <textarea
                          placeholder="Description"
                          className="border p-2 w-full"
                          value={editingProduct.description}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              description: e.target.value,
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Price (PKR)"
                          className="border p-2 w-full"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: Number(e.target.value),
                              savings:
                                Number(editingProduct.originalPrice) -
                                Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Original Price (PKR)"
                          className="border p-2 w-full"
                          value={editingProduct.originalPrice}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Number(e.target.value),
                              savings:
                                Number(e.target.value) -
                                Number(editingProduct.price),
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Savings (PKR)"
                          className="border p-2 w-full bg-gray-100"
                          value={editingProduct.savings}
                          readOnly
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadFile(e, true)}
                          className="border p-2 w-full"
                        />
                        {editingProduct.image && (
                          <img
                            src={editingProduct.image}
                            alt="Preview"
                            className="w-24 h-24 object-cover"
                          />
                        )}
                        <input
                          type="number"
                          placeholder="Rating (0-5)"
                          className="border p-2 w-full"
                          value={editingProduct.rating}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              rating: Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Review Count"
                          className="border p-2 w-full"
                          value={editingProduct.reviewCount}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              reviewCount: Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          className="border p-2 w-full"
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value,
                            })
                          }
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editingProduct.featured}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                featured: e.target.checked,
                              })
                            }
                            className="h-5 w-5"
                          />
                          <span>Featured Product</span>
                        </label>
                        <div className="flex gap-4">
                          <button
                            onClick={handleEditProduct}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loadingAction}
                          >
                            {loadingAction ? "Updating..." : "Save Changes"}
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="text-gray-500 underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Orig. Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Savings
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Rating
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Reviews
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Featured
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td className="px-6 py-4">{product.name}</td>
                              <td className="px-6 py-4">PKR {product.price}</td>
                              <td className="px-6 py-4">
                                PKR {product.originalPrice}
                              </td>
                              <td className="px-6 py-4">
                                PKR {product.savings}
                              </td>
                              <td className="px-6 py-4">{product.category}</td>
                              <td className="px-6 py-4">{product.rating}</td>
                              <td className="px-6 py-4">
                                {product.reviewCount}
                              </td>
                              <td className="px-6 py-4">
                                {product.featured ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    Yes
                                  </span>
                                ) : (
                                  "No"
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {product.image && (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                              </td>
                              <td className="px-6 py-4 flex gap-4">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
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
                  </div>
                )}

                {activeTab === "users" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      User Management
                    </h2>
                    <p className="text-sm text-gray-600">
                      Mock users listed here
                    </p>
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
