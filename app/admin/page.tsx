"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
// import { toast } from "@/components/ui/use-toast";

// Import section components
// import DashboardOverview from "../components/DashboardOverview";
import ViewAllOrders from "../components/ViewAllOrders";
import ManageProducts from "../components/ManageProducts";
import ViewAllCustomers from "../components/CustomerList";
// import CustomerList from "./components/CustomerList";
// import SiteAnalytics from "./components/SiteAnalytics";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    allCustomers: 0,
    monthlyRevenue: 0,
    loading: true,
  });

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setDashboardStats((prev) => ({ ...prev, loading: true }));

      // Fetch orders
      const ordersResponse = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auraveUserToken")}`,
        },
      });

      const orders = ordersResponse.data;

      // Total orders
      const totalOrders = orders.length;

      // Unique customers by email
      const uniqueCustomers = new Set(orders.map((o: any) => o.customer.email));
      const allCustomers = uniqueCustomers.size;

      // Current month revenue
      const now = new Date();
      const monthlyRevenue = orders
        .filter((o: any) => {
          const orderDate = new Date(o.createdAt);
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum: any, o: { total: any }) => sum + o.total, 0);

      setDashboardStats({
        totalOrders,
        allCustomers,
        monthlyRevenue,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setDashboardStats({
        totalOrders: 0,
        allCustomers: 0,
        monthlyRevenue: 0,
        loading: false,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auraveUserToken");
    // toast({
    //   title: "Logged Out",
    //   description: "You have been successfully logged out.",
    //   className: "bg-highlight text-secondary-accent border-0",
    // });
    router.push("/login");
  };

  const formatCurrency = (amount: any) => {
    return `PKR ${amount / 1000}K`;
  };

  const adminStats = [
    {
      title: "Total Orders",
      value: dashboardStats.loading
        ? "..."
        : dashboardStats.totalOrders.toLocaleString(),
      icon: Package,
      color: "text-main-brand",
    },
    {
      title: "Customers",
      value: dashboardStats.loading
        ? "..."
        : dashboardStats.allCustomers.toString(),
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Revenue (Month)",
      value: dashboardStats.loading
        ? "..."
        : formatCurrency(dashboardStats.monthlyRevenue.toPrecision(2)),
      icon: BarChart2,
      color: "text-blue-500",
    },
  ];

  const navigationTabs = [
    // {
    //   id: "overview",
    //   label: "Overview",
    //   icon: Home,
    // },
    {
      id: "orders",
      label: "View All Orders",
      icon: Package,
    },
    {
      id: "products",
      label: "Manage Products",
      icon: Settings,
    },
    {
      id: "customers",
      label: "Customer List",
      icon: Users,
    },
    // {
    //   id: "analytics",
    //   label: "Site Analytics",
    //   icon: BarChart2,
    // },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      // case "overview":
      //   return <DashboardOverview />;
      // case "orders":
      //   return <ViewAllOrders />;
      case "products":
        return <ManageProducts />;
      case "customers":
        return <ViewAllCustomers />;
      // case "analytics":
      //   return <SiteAnalytics />;
      default:
        return <ViewAllOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:pt-32 md:pb-16 md:mx-8 mx-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-[#d7a7b1] font-serif mb-4 sm:mb-0">
          Admin Dashboard
        </h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#fdf6f0] p-6 rounded-xl shadow-lg flex items-center space-x-4"
          >
            <div
              className={`p-3 bg-accent-brand/20 rounded-full ${stat.color}`}
            >
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-text-primary/70">{stat.title}</p>
              <p className="text-2xl font-bold text-[#d7a7b1]">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2 border-b border-accent-brand/20 pb-4">
          {navigationTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#ead7d1] text-black"
                  : "text-text-primary hover:bg-accent-brand/10"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Active Section Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        {renderActiveSection()}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-text-primary/60 mt-12"
      >
        Aurave Admin Panel &copy; {new Date().getFullYear()}. Dynamic data
        loading enabled.
      </motion.p>
    </div>
  );
};

export default AdminDashboard;
