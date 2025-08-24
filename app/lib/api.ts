export const api = {
  async getProducts() {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },
  async createProduct(payload: any) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
  },
  async updateProduct(id: string, payload: any) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  },
  async deleteProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
  },
};
