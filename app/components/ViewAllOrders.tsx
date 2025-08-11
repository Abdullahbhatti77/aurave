"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Search, Filter, Download } from "lucide-react";
import { Button } from "./ui/button";
import CustomDialog from "./CustomDialog";
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

const ViewAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
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
    fetchOrders();
  }, []);

  const formatPrice = (price: number) => `PKR ${price.toLocaleString()}.00`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="bg-secondary-accent p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-main-brand mb-4 font-serif">
        All Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-primary/70 border-b border-accent-brand">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer Name</th>
              <th className="py-2 px-3">Total Price</th>
              <th className="py-2 px-3">Created Date</th>
              <th className="py-2 px-3">Customer City</th>
              <th className="py-2 px-3">Product Name(s)</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-accent-brand/50 hover:bg-accent-brand/10"
              >
                <td className="py-3 px-3 font-medium text-main-brand">
                  {order.id}
                </td>
                <td className="py-3 px-3">{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                <td className="py-3 px-3">{formatPrice(order.total)}</td>
                <td className="py-3 px-3">{formatDate(order.createdAt)}</td>
                <td className="py-3 px-3">{order.customer.city}</td>
                <td className="py-3 px-3">
                  {order.items.map((item) => item.name).join(", ")}
                </td>
                <td className="py-3 px-3">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`Order Details - ${selectedOrder?.id || ""}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-main-brand text-lg mb-2">
                Customer Information
              </h3>
              <p>
                <strong>Name:</strong>{" "}
                {`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.customer.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.customer.address},{" "}
                {selectedOrder.customer.city}, {selectedOrder.customer.state},{" "}
                {selectedOrder.customer.zipCode},{" "}
                {selectedOrder.customer.country}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-main-brand text-lg mb-2">
                Order Summary
              </h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-main-brand">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-main-brand text-lg mb-2">
                Order Details
              </h3>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {formatDate(selectedOrder.createdAt)}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {formatDate(selectedOrder.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default ViewAllOrders;
