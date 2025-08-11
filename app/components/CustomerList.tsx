"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "./ui/use-toast";

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

  return (
    <div className="bg-secondary-accent p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-main-brand mb-4 font-serif">
        All Customers
      </h2>

      {loading ? (
        <p className="text-center text-text-primary">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
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
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-accent-brand/50 hover:bg-accent-brand/10"
                >
                  <td className="py-3 px-3 font-medium text-main-brand">
                    {customer.customer.firstName}
                  </td>
                  <td className="py-3 px-3">{customer.customer.lastName}</td>
                  <td className="py-3 px-3">{customer.customer.phone}</td>
                  <td className="py-3 px-3">{customer.customer.email}</td>
                  <td className="py-3 px-3">{customer.customer.address}</td>
                  <td className="py-3 px-3">{customer.customer.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewAllCustomers;
