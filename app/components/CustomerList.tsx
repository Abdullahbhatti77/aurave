"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ViewAllCustomers = () => {
  const [customers, setCustomers] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // customers per page

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/orders");
        setCustomers(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders.");
        toast({
          title: "Error",
          description: "Failed to load orders.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers locally
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const term = searchTerm.toLowerCase();
      return (
        customer.customer.firstName.toLowerCase().includes(term) ||
        customer.customer.lastName.toLowerCase().includes(term) ||
        customer.customer.email.toLowerCase().includes(term) ||
        customer.customer.phone.toLowerCase().includes(term)
      );
    });
  }, [customers, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-secondary-accent p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-[#d7a7b1] font-serif">
          All Customers
        </h2>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main-brand focus:border-transparent bg-background text-text-primary"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-text-primary">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-primary/70 border-b border-accent-brand">
                  <th className="py-2 px-3">First Name</th>
                  <th className="py-2 px-3">Last Name</th>
                  <th className="py-2 px-3">Phone Number</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Address</th>
                  <th className="py-2 px-3">City</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-accent-brand/50 hover:bg-accent-brand/10 transition-colors"
                    >
                      <td className="py-3 px-3 font-medium text-main-brand">
                        {customer.customer.firstName}
                      </td>
                      <td className="py-3 px-3">
                        {customer.customer.lastName}
                      </td>
                      <td className="py-3 px-3">{customer.customer.phone}</td>
                      <td className="py-3 px-3">{customer.customer.email}</td>
                      <td className="py-3 px-3">{customer.customer.address}</td>
                      <td className="py-3 px-3">{customer.customer.city}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No matching customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1
                      ? "bg-main-brand text-black"
                      : "hover:bg-accent-brand/10"
                  }
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewAllCustomers;
