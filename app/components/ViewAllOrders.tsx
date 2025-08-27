"use client";

import React, { useState, useEffect } from "react";
import { Eye, Search } from "lucide-react";
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
  orderId: string;
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

  // Search + Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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

  // Filtered data based on search
  // const filteredOrders = orders.filter((order) => {
  //   const searchLower = searchQuery.toLowerCase();
  //   return (
  //     order.id.toLowerCase().includes(searchLower) ||
  //     `${order.customer.firstName} ${order.customer.lastName}`
  //       .toLowerCase()
  //       .includes(searchLower) ||
  //     order.customer.email.toLowerCase().includes(searchLower) ||
  //     order.customer.city.toLowerCase().includes(searchLower) ||
  //     order.items.some((item) => item.name.toLowerCase().includes(searchLower))
  //   );
  // });

  // Filtered + Sorted data
  const filteredOrders = orders
    .filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        `${order.customer.firstName} ${order.customer.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        order.customer.city.toLowerCase().includes(searchLower) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchLower)
        )
      );
    })
    // ✅ Sort by createdAt (latest first)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-secondary-accent p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-[#d7a7b1] font-serif">
          All Orders
        </h2>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main-brand focus:border-transparent bg-background text-text-primary"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-text-primary">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-text-primary">No orders found.</p>
      ) : (
        <>
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
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-accent-brand/50 hover:bg-accent-brand/10"
                  >
                    <td className="py-3 px-3 font-medium text-main-brand">
                      {order.orderId}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-pink-600 text-white cursor-pointer"
                      : "cursor-pointer"
                  }`}
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
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Order Details Dialog */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`Order Details - ${selectedOrder?.orderId || ""}`}
      >
        {selectedOrder && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#d7a7b1] text-lg mb-2">
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
                <h3 className="font-semibold text-[#d7a7b1] text-lg mb-2">
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
            <div>
              <h3 className="font-semibold text-[#d7a7b1] text-lg mb-2">
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
          </div>
        )}
      </CustomDialog>
    </div>
  );
};

export default ViewAllOrders;
