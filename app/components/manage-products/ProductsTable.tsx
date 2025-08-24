'use client';
import React from 'react';
import { Product } from './types';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id?: string) => void;
}

export default function ProductsTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded shadow-sm">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Orig. Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Savings</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Rating</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Reviews</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Featured</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Image</th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">PKR {product.price}</td>
              <td className="px-6 py-4">PKR {product.originalPrice}</td>
              <td className="px-6 py-4">PKR {product.savings}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">{product.rating}</td>
              <td className="px-6 py-4">{product.reviewCount}</td>
              <td className="px-6 py-4">{product.featured ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Yes</span> : 'No'}</td>
              <td className="px-6 py-4">{product.image && <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />}</td>
              <td className="px-6 py-4 flex gap-4">
                <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800">Edit</button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}