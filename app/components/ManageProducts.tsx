"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Product } from "./manage-products/types";
import { api } from "../lib/api";
import ProductForm from "./manage-products/ProductForm";
import ProductsTable from "./manage-products/ProductsTable";

export default function ManageProducts() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<"products" | "users">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (!isLoading && !isAdmin) router.push("/login");
  }, [isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    try {
      setIsDataLoading(true);
      if (activeTab === "products") {
        const data = await api.getProducts();
        setProducts(data || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Create
  const handleCreate = async (payload: Product) => {
    await api.createProduct(payload);
    setShowAddForm(false);
    await loadData();
  };

  // Update
  const handleUpdate = async (payload: Product) => {
    if (!payload.id) throw new Error("Missing product id");
    await api.updateProduct(payload.id, payload);
    setEditingProduct(null);
    await loadData();
  };

  // Delete
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this product?")) return;
    await api.deleteProduct(id);
    await loadData();
  };

  // Search + pagination
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <main className="pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3 py-1 rounded ${
              activeTab === "products" ? "bg-pink-600 text-white" : "border"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1 rounded ${
              activeTab === "users" ? "bg-pink-600 text-white" : "border"
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {isDataLoading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {activeTab === "products" && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#d7a7b1]">
                  All Products
                </h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    className="border p-2 rounded-md w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      setShowAddForm((s) => !s);
                      setEditingProduct(null);
                    }}
                    className="bg-pink-600 text-white px-4 py-2 rounded"
                  >
                    {showAddForm ? "Close Form" : "Add New Product"}
                  </button>
                </div>
              </div>

              {showAddForm && (
                <ProductForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowAddForm(false)}
                  submitLabel="Add Product"
                />
              )}

              {editingProduct && (
                <ProductForm
                  initial={editingProduct}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingProduct(null)}
                  submitLabel="Save Changes"
                />
              )}

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-lg font-medium text-gray-600">
                    No products found
                  </p>
                  <p className="text-sm text-gray-500">
                    Add a new product to get started!
                  </p>
                </div>
              ) : (
                <ProductsTable
                  products={paginated}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setShowAddForm(false);
                  }}
                  onDelete={(id) => handleDelete(id)}
                />
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1 ? "bg-pink-600 text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === "users" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                User Management
              </h2>
              <p className="text-sm text-gray-600">
                (Mock users area — implement real user APIs if required.)
              </p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
