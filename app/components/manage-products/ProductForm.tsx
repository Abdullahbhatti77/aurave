// ProductForm.tsx
"use client";

import React, { useEffect, useState } from "react";
// Adjust the import path for Product type to match your project layout
import { Product } from "./types";
// Adjust UploadImage import path as needed
import UploadImage from "./UploadImage";

interface Props {
  initial?: Product | null;
  onCancel?: () => void;
  onSubmit: (payload: Product) => Promise<void> | void;
  submitLabel?: string;
}

const blankProduct = (): Product => ({
  // id is optional in many APIs; keep it out of the blank template
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
});

function normalize(p?: Product | null): Product {
  if (!p) return blankProduct();
  return {
    ...blankProduct(),
    ...p,
    // ensure arrays exist
    benefits: Array.isArray(p.benefits) ? p.benefits : [],
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    // coerce numeric fields
    price: Number(p.price ?? 0),
    originalPrice: Number(p.originalPrice ?? 0),
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.reviewCount ?? 0),
    savings: Number((p.originalPrice ?? 0) - (p.price ?? 0)),
    featured: Boolean(p.featured),
  };
}

export default function ProductForm({
  initial = null,
  onCancel,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [form, setForm] = useState<Product>(() => normalize(initial));
  const [benefitValue, setBenefitValue] = useState("");
  const [ingredientValue, setIngredientValue] = useState("");
  const [loading, setLoading] = useState(false);

  // When initial prop changes (open edit form), normalize and load into local state
  useEffect(() => {
    setForm(normalize(initial));
  }, [initial]);

  // Recalculate savings whenever price/originalPrice change
  useEffect(() => {
    setForm((prev) => {
      const newSavings =
        Number(prev.originalPrice ?? 0) - Number(prev.price ?? 0);
      // only update if changed to avoid extra renders
      if (prev.savings === newSavings) return prev;
      return { ...prev, savings: newSavings };
    });
  }, [form.price, form.originalPrice]);

  // Upload image callback used by UploadImage component
  const handleUpload = (url: string) => {
    setForm((prev) => ({ ...prev, image: url }));
  };

  // Benefits
  const addBenefit = () => {
    const v = benefitValue.trim();
    if (!v) return;
    const current = form.benefits ?? [];
    if (!current.includes(v)) {
      setForm((prev) => ({ ...prev, benefits: [...current, v] }));
    }
    setBenefitValue("");
  };

  const removeBenefit = (b: string) => {
    const current = form.benefits ?? [];
    setForm((prev) => ({ ...prev, benefits: current.filter((x) => x !== b) }));
  };

  // Ingredients
  const addIngredient = () => {
    const v = ingredientValue.trim();
    if (!v) return;
    const current = form.ingredients ?? [];
    if (!current.includes(v)) {
      setForm((prev) => ({ ...prev, ingredients: [...current, v] }));
    }
    setIngredientValue("");
  };

  const removeIngredient = (i: string) => {
    const current = form.ingredients ?? [];
    setForm((prev) => ({
      ...prev,
      ingredients: current.filter((x) => x !== i),
    }));
  };

  const handleSubmit = async () => {
    // basic validation
    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }
    setLoading(true);
    try {
      // ensure numeric fields are numbers and arrays are arrays
      const payload: Product = {
        ...form,
        price: Number(form.price ?? 0),
        originalPrice: Number(form.originalPrice ?? 0),
        savings: Number((form.originalPrice ?? 0) - (form.price ?? 0)),
        rating: Number(form.rating ?? 0),
        reviewCount: Number(form.reviewCount ?? 0),
        benefits: Array.isArray(form.benefits) ? form.benefits : [],
        ingredients: Array.isArray(form.ingredients) ? form.ingredients : [],
      };
      await onSubmit(payload);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submit failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 border rounded-md shadow-sm mb-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded-md"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full rounded-md"
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Price
          </label>
          <input
            type="number"
            min={0}
            value={form.originalPrice}
            onChange={(e) =>
              setForm({ ...form, originalPrice: Number(e.target.value) })
            }
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Savings
          </label>
          <input
            readOnly
            value={Number(form.savings ?? form.originalPrice - form.price) || 0}
            className="border p-2 w-full bg-gray-100 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <UploadImage onUpload={handleUpload} initialUrl={form.image} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating (0-5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review Count
          </label>
          <input
            type="number"
            min={0}
            value={form.reviewCount}
            onChange={(e) =>
              setForm({ ...form, reviewCount: Number(e.target.value) })
            }
            className="border p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 w-full rounded-md"
            placeholder="Enter category"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Benefits
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(form.benefits ?? []).map((b) => (
            <span
              key={b}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded inline-flex items-center"
            >
              <span className="mr-2">{b}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeBenefit(b)}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={benefitValue}
            onChange={(e) => setBenefitValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addBenefit();
              }
            }}
            placeholder="Type a benefit and press Enter"
            className="border p-2 w-full rounded-md"
          />
          <button
            type="button"
            onClick={addBenefit}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingredients
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(form.ingredients ?? []).map((i) => (
            <span
              key={i}
              className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded inline-flex items-center"
            >
              <span className="mr-2">{i}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeIngredient(i)}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={ingredientValue}
            onChange={(e) => setIngredientValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addIngredient();
              }
            }}
            placeholder="Type an ingredient and press Enter"
            className="border p-2 w-full rounded-md"
          />
          <button
            type="button"
            onClick={addIngredient}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          How to Use
        </label>
        <input
          value={form.howToUse}
          onChange={(e) => setForm({ ...form, howToUse: e.target.value })}
          className="border p-2 w-full rounded-md"
          placeholder="Enter how to use"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-5 w-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Featured Product
          </span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 underline">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
