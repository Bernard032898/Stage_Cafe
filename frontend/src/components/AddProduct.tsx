import React, { useEffect, useState } from "react";
import { createProduct, fetchProducts } from "../services/api";

export default function AddProduct({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const products = await fetchProducts();
        const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category?.name).filter(Boolean)));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    loadCategories();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || Number.isNaN(Number(price))) return alert("Please enter name and valid price");
    setLoading(true);
    try {
      await createProduct({ name, price: Number(price), categoryName: category });
      window.dispatchEvent(new CustomEvent("products.updated"));
      alert("Product created");
      setName(""); setPrice(""); setCategory("");
      onCreated && onCreated();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Add Product</h2>
      <div className="card product-card-form">
        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
          <label>Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Type or choose an existing category"
            list="category-list"
          />
          <datalist id="category-list">
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
