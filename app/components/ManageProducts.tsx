// "use client";

// import React, { useState, useEffect } from "react";

// const ManageProducts = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <div className="bg-secondary-accent p-6 rounded-xl shadow-lg">
//       <h1>jlkjlkj</h1>
//     </div>
//   );
// };

// export default ManageProducts;

"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

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
  howToUse: string;
  benefits: string[];
  ingredients: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ManageProducts = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
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
    howToUse: "",
    benefits: [],
    ingredients: [],
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
          benefits: newProduct.benefits.length > 0 ? newProduct.benefits : [],
          ingredients:
            newProduct.ingredients.length > 0 ? newProduct.ingredients : [],
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
          benefits:
            editingProduct.benefits.length > 0 ? editingProduct.benefits : [],
          ingredients:
            editingProduct.ingredients.length > 0
              ? editingProduct.ingredients
              : [],
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
  const addBenefit = () => {
    if (newBenefit.trim()) {
      if (editingProduct) {
        // Update editingProduct if in edit mode
        if (!editingProduct.benefits.includes(newBenefit.trim())) {
          setEditingProduct({
            ...editingProduct,
            benefits: [...editingProduct.benefits, newBenefit.trim()],
          });
        }
      } else {
        // Update newProduct if in add mode
        if (!newProduct.benefits.includes(newBenefit.trim())) {
          setNewProduct({
            ...newProduct,
            benefits: [...newProduct.benefits, newBenefit.trim()],
          });
        }
      }
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    if (editingProduct) {
      // Update editingProduct if in edit mode
      setEditingProduct({
        ...editingProduct,
        benefits: editingProduct.benefits.filter((b) => b !== benefitToRemove),
      });
    } else {
      // Update newProduct if in add mode
      setNewProduct({
        ...newProduct,
        benefits: newProduct.benefits.filter((b) => b !== benefitToRemove),
      });
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      if (editingProduct) {
        // Update editingProduct if in edit mode
        if (!editingProduct.ingredients.includes(newIngredient.trim())) {
          setEditingProduct({
            ...editingProduct,
            ingredients: [...editingProduct.ingredients, newIngredient.trim()],
          });
        }
      } else {
        // Update newProduct if in add mode
        if (!newProduct.ingredients.includes(newIngredient.trim())) {
          setNewProduct({
            ...newProduct,
            ingredients: [...newProduct.ingredients, newIngredient.trim()],
          });
        }
      }
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    if (editingProduct) {
      // Update editingProduct if in edit mode
      setEditingProduct({
        ...editingProduct,
        ingredients: editingProduct.ingredients.filter(
          (i) => i !== ingredientToRemove
        ),
      });
    } else {
      // Update newProduct if in add mode
      setNewProduct({
        ...newProduct,
        ingredients: newProduct.ingredients.filter(
          (i) => i !== ingredientToRemove
        ),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20">
        {/* <Navbar /> */}
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    // <div className="pt-20">
      <main className="bg-[#fcfaf8]">
        <div className="">
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
                        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 cursor-pointer"
                      >
                        {showAddForm ? "Close Form" : "Add New Product"}
                      </button>
                    </div>

                    {showAddForm && (
                      <div className="bg-[#fdf6f0] p-4 border rounded-md shadow-sm mb-6 space-y-4">
                        <div>
                          <label
                            htmlFor="product-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Product Name
                          </label>
                          <input
                            id="product-name"
                            type="text"
                            placeholder="Enter product name"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Description
                          </label>
                          <textarea
                            id="product-description"
                            placeholder="Enter product description"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.description}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price (PKR)
                          </label>
                          <input
                            id="product-price"
                            type="number"
                            min="0"
                            placeholder="Enter price"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                price: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-original-price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Original Price (PKR)
                          </label>
                          <input
                            id="product-original-price"
                            type="number"
                            min="0"
                            placeholder="Enter original price"
                            className="border p-2 w-full rounded-md"
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
                        </div>
                        <div>
                          <label
                            htmlFor="product-savings"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Savings (PKR)
                          </label>
                          <input
                            id="product-savings"
                            type="text"
                            min="0"
                            placeholder="Savings (auto-calculated)"
                            className="border p-2 w-full bg-gray-100 rounded-md"
                            value={newProduct.savings}
                            readOnly
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-image"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Product Image
                          </label>
                          <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadFile(e, false)}
                            className="border p-2 w-full rounded-md"
                          />
                          {newProduct.image && (
                            <img
                              src={newProduct.image}
                              alt="Preview"
                              className="w-24 h-24 object-cover mt-2 rounded"
                            />
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="product-rating"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Rating (0–5)
                          </label>
                          <input
                            id="product-rating"
                            type="number"
                            min="0"
                            max="5"
                            step="1"
                            placeholder="Enter rating (0–5)"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.rating}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 0 && value <= 5) {
                                setNewProduct({ ...newProduct, rating: value });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-review-count"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Review Count
                          </label>
                          <input
                            id="product-review-count"
                            type="number"
                            min="0"
                            placeholder="Enter review count"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.reviewCount}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                reviewCount: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-category"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Category
                          </label>
                          <input
                            id="product-category"
                            type="text"
                            placeholder="Enter category"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.category}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                category: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="add-product-benefits"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Benefits
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {newProduct?.benefits?.map((benefit, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                              >
                                {benefit}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => removeBenefit(benefit)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              id="add-product-benefits"
                              type="text"
                              placeholder="Type a benefit and press Enter or Add"
                              className="border p-2 w-full rounded-md"
                              value={newBenefit}
                              onChange={(e) => setNewBenefit(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addBenefit()
                              }
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-blue-600 text-white rounded"
                              onClick={addBenefit}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="add-product-ingredients"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Ingredients
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {newProduct?.ingredients?.map((ingredient, index) => (
                              <span
                                key={index}
                                className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                              >
                                {ingredient}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => removeIngredient(ingredient)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              id="add-product-ingredients"
                              type="text"
                              placeholder="Type an ingredient and press Enter or Add"
                              className="border p-2 w-full rounded-md"
                              value={newIngredient}
                              onChange={(e) => setNewIngredient(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addIngredient()
                              }
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-green-600 text-white rounded"
                              onClick={addIngredient}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="add-product-how-to-use"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            How to Use
                          </label>
                          <input
                            id="add-product-how-to-use"
                            type="text"
                            placeholder="Enter how to use"
                            className="border p-2 w-full rounded-md"
                            value={newProduct.howToUse}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                howToUse: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
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
                            <span className="text-sm font-medium text-gray-700">
                              Featured Product
                            </span>
                          </label>
                        </div>
                        <button
                          onClick={handleAddProduct}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                          disabled={loadingAction}
                        >
                          {loadingAction ? "Adding..." : "Submit"}
                        </button>
                      </div>
                    )}

                    {editingProduct && (
                      <div className="bg-yellow-50 p-4 border rounded-md shadow-sm mb-6 space-y-4">
                        <div>
                          <label
                            htmlFor="edit-product-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Product Name
                          </label>
                          <input
                            id="edit-product-name"
                            type="text"
                            placeholder="Enter product name"
                            className="border p-2 w-full rounded-md"
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Description
                          </label>
                          <textarea
                            id="edit-product-description"
                            placeholder="Enter product description"
                            className="border p-2 w-full rounded-md"
                            value={editingProduct.description}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price (PKR)
                          </label>
                          <input
                            id="edit-product-price"
                            type="number"
                            min="0"
                            placeholder="Enter price"
                            className="border p-2 w-full rounded-md"
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
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-original-price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Original Price (PKR)
                          </label>
                          <input
                            id="edit-product-original-price"
                            type="number"
                            min="0"
                            placeholder="Enter original price"
                            className="border p-2 w-full rounded-md"
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
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-savings"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Savings (PKR)
                          </label>
                          <input
                            id="edit-product-savings"
                            type="text"
                            min="0"
                            placeholder="Savings (auto-calculated)"
                            className="border p-2 w-full bg-gray-100 rounded-md"
                            value={editingProduct.savings}
                            readOnly
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-image"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Product Image
                          </label>
                          <input
                            id="edit-product-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadFile(e, true)}
                            className="border p-2 w-full rounded-md"
                          />
                          {editingProduct.image && (
                            <img
                              src={editingProduct.image}
                              alt="Preview"
                              className="w-24 h-24 object-cover mt-2 rounded"
                            />
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-rating"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Rating (0–5)
                          </label>
                          <input
                            id="edit-product-rating"
                            type="number"
                            min="0"
                            max="5"
                            step="1"
                            placeholder="Enter rating (0–5)"
                            className="border p-2 w-full rounded-md"
                            value={editingProduct.rating}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 0 && value <= 5) {
                                setEditingProduct({
                                  ...editingProduct,
                                  rating: value,
                                });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-review-count"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Review Count
                          </label>
                          <input
                            id="edit-product-review-count"
                            type="number"
                            min="0"
                            placeholder="Enter review count"
                            className="border p-2 w-full rounded-md"
                            value={editingProduct.reviewCount}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                reviewCount: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-category"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Category
                          </label>
                          <input
                            id="edit-product-category"
                            type="text"
                            placeholder="Enter category"
                            className="border p-2 w-full rounded-md"
                            value={editingProduct.category}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                category: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-benefits"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Benefits
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editingProduct?.benefits?.map((benefit, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                              >
                                {benefit}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => removeBenefit(benefit)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              id="edit-product-benefits"
                              type="text"
                              placeholder="Type a benefit and press Enter or Add"
                              className="border p-2 w-full rounded-md"
                              value={newBenefit}
                              onChange={(e) => setNewBenefit(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addBenefit()
                              }
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-blue-600 text-white rounded"
                              onClick={addBenefit}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-ingredients"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Ingredients
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editingProduct?.ingredients?.map(
                              (ingredient, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {ingredient}
                                  <button
                                    type="button"
                                    className="ml-1 text-red-500 hover:text-red-700"
                                    onClick={() => removeIngredient(ingredient)}
                                  >
                                    ×
                                  </button>
                                </span>
                              )
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              id="edit-product-ingredients"
                              type="text"
                              placeholder="Type an ingredient and press Enter or Add"
                              className="border p-2 w-full rounded-md"
                              value={newIngredient}
                              onChange={(e) => setNewIngredient(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addIngredient()
                              }
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-green-600 text-white rounded"
                              onClick={addIngredient}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="edit-product-how-to-use"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            How to Use
                          </label>
                          <input
                            id="edit-product-how-to-use"
                            type="text"
                            placeholder="Enter how to use"
                            className="border p-2 w-full rounded-md"
                            value={editingProduct.howToUse}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                howToUse: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
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
                            <span className="text-sm font-medium text-gray-700">
                              Featured Product
                            </span>
                          </label>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={handleEditProduct}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                            disabled={loadingAction}
                          >
                            {loadingAction ? "Updating..." : "Save Changes"}
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="text-gray-500 underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        {/* <img
                          src="https://images.unsplash.com/photo-1634323741467-8272d2b6e14f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                          alt="No products found"
                          className="w-48 h-48 object-cover mb-4"
                        /> */}
                        <p className="text-lg font-medium text-gray-600">
                          No products found
                        </p>
                        <p className="text-sm text-gray-500">
                          Add a new product to get started!
                        </p>
                      </div>
                    ) : (
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
                            {products?.map((product) => (
                              <tr key={product.id}>
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">
                                  PKR {product.price}
                                </td>
                                <td className="px-6 py-4">
                                  PKR {product.originalPrice}
                                </td>
                                <td className="px-6 py-4">
                                  PKR {product.savings}
                                </td>
                                <td className="px-6 py-4">
                                  {product.category}
                                </td>
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
                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                    className="text-red-600 hover:text-red-800 cursor-pointer"
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
    // </div>
  );
};

export default ManageProducts;
