import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IndianRupee,
  Package,
  EyeOff,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  Archive,
  RefreshCw,
  Edit,
} from "lucide-react";
import { fetchProducts } from "../redux/thunks/adminProductsThunk";
import { toggleDisable } from "../redux/thunks/toggleIsDisabledThunk";
import { deleteProduct } from "../redux/thunks/deleteProductThunk";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export default function ProductsManagement() {
  const { items = [], status } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'hidden' | 'outofstock'

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Navigate to Add/Edit Products with product data
  const handleEdit = (item) => {
    navigate("../addproducts", { state: { product: item } });
  };

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => !i.isDisabled).length;
    const hidden = items.filter((i) => i.isDisabled).length;
    const outOfStock = items.filter((i) => Number(i.stock) === 0).length;
    return { total, active, hidden, outOfStock };
  }, [items]);

  // Filtered list
  const filteredProducts = useMemo(() => {
    return items.filter((product) => {
      const matchesSearch =
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(product.id).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = !product.isDisabled;
      if (statusFilter === "hidden") matchesStatus = Boolean(product.isDisabled);
      if (statusFilter === "outofstock") matchesStatus = Number(product.stock) === 0;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchTerm, selectedCategory, statusFilter]);

  const handleToggle = (item) => {
    dispatch(toggleDisable(item))
      .unwrap()
      .then(() =>
        toast.success(
          item.isDisabled ? "Product Visible" : "Product Hidden",
          `${item.title} is now ${item.isDisabled ? "visible" : "hidden"}.`
        )
      )
      .catch((err) => toast.error("Update Failed", err || "Action failed"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => toast.success("Product Deleted"))
      .catch((err) => toast.error("Delete Failed", err || "Action failed"));
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto space-y-5 pb-10">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 sm:top-20 z-20 bg-black/95 backdrop-blur-md py-3 border-b border-white/10">
        <div>
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 uppercase">
            Admin Console // Inventory
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Manage Products
          </h1>
        </div>

        <button
          onClick={() => navigate("../addproducts")}
          className="clip-btn self-start sm:self-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-700 px-4 py-2 text-sm tracking-wider uppercase transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. STATS METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="clip-panel bg-[#0B0F17] border border-cyan-500/30 p-3.5 sm:p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Total Products</span>
            <Package size={18} className="text-cyan-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-white mt-1">
            {metrics.total}
          </div>
        </div>

        <div className="clip-panel bg-[#0B0F17] border border-emerald-500/30 p-3.5 sm:p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Active / Visible</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-emerald-400 mt-1">
            {metrics.active}
          </div>
        </div>

        <div className="clip-panel bg-[#0B0F17] border border-pink-500/30 p-3.5 sm:p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Out of Stock</span>
            <AlertTriangle size={18} className="text-pink-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-pink-400 mt-1">
            {metrics.outOfStock}
          </div>
        </div>

        <div className="clip-panel bg-[#0B0F17] border border-purple-500/30 p-3.5 sm:p-4 relative">
          <div className="flex items-center justify-between">
            <span className="font-tech text-xs text-gray-400 uppercase tracking-wider">Hidden Products</span>
            <Archive size={18} className="text-purple-400" />
          </div>
          <div className="font-display font-700 text-2xl sm:text-3xl text-purple-400 mt-1">
            {metrics.hidden}
          </div>
        </div>
      </div>

      {/* 3. CONTROLS BAR: SEARCH, FILTERS & VIEW TOGGLE */}
      <div className="clip-panel bg-[#0B0F17] border border-white/10 p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or ID..."
              className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 text-xs font-mono rounded pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/50 border border-white/15 text-cyan-300 text-xs font-mono rounded px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white uppercase font-mono">
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/50 border border-white/15 text-cyan-300 text-xs font-mono rounded px-3 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Status</option>
            <option value="active" className="bg-slate-900 text-white">Active Only</option>
            <option value="hidden" className="bg-slate-900 text-white">Hidden Only</option>
            <option value="outofstock" className="bg-slate-900 text-white">Out of Stock</option>
          </select>
        </div>

        {/* View Switcher: Grid vs Table */}
        <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-white/10">
          <span className="font-mono text-xs text-gray-400 mr-1">
            Showing {filteredProducts.length} of {items.length}
          </span>
          <div className="flex bg-black/60 border border-cyan-500/30 rounded p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === "grid" ? "bg-cyan-500/25 text-cyan-300 shadow-[0_0_8px_rgba(0,229,255,0.3)]" : "text-gray-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === "table" ? "bg-cyan-500/25 text-cyan-300 shadow-[0_0_8px_rgba(0,229,255,0.3)]" : "text-gray-400 hover:text-white"
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS VIEW CONTENT */}
      {filteredProducts.length === 0 ? (
        <div className="clip-panel bg-[#0B0F17] border border-white/10 py-16 text-center">
          <Package size={48} className="text-gray-600 mx-auto mb-3" />
          <h3 className="font-display font-700 text-xl text-white">No Matching Products</h3>
          <p className="text-sm text-gray-400 mt-1">Try resetting your search query or filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className={`relative clip-panel bg-[#0B0F17] border transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 ${
                item.isDisabled
                  ? "border-purple-500/30 opacity-70 hover:opacity-100 hover:border-purple-500/60"
                  : "border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.1)]"
              }`}
            >
              {/* Product Image Viewport - Clickable to edit */}
              <div
                onClick={() => handleEdit(item)}
                className="relative h-44 w-full bg-slate-950/80 border-b border-white/5 p-4 flex items-center justify-center overflow-hidden cursor-pointer"
                title="Click to edit product details"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Badge */}
                {item.category && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-tech uppercase tracking-wider rounded bg-black/80 border border-cyan-400/40 text-cyan-300">
                    {item.category}
                  </span>
                )}

                {/* Visibility Badge */}
                {item.isDisabled && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-tech uppercase tracking-wider rounded bg-purple-950/80 border border-purple-400/50 text-purple-300">
                    Hidden
                  </span>
                )}
              </div>

              {/* Info Body - Clickable to edit */}
              <div
                onClick={() => handleEdit(item)}
                className="p-4 flex-1 flex flex-col justify-between cursor-pointer"
                title="Click to edit product details"
              >
                <div>
                  <div className="font-tech text-[10px] text-gray-500 mb-1">ID: #{item.id}</div>
                  <h2 className="text-sm font-medium text-gray-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h2>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center text-white">
                    <IndianRupee size={15} strokeWidth={2.5} />
                    <span className="font-display font-700 text-lg">{item.price}</span>
                  </div>

                  <span
                    className={`font-tech text-[11px] px-2 py-0.5 border rounded uppercase ${
                      Number(item.stock) > 0
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        : "text-pink-400 border-pink-500/30 bg-pink-500/10"
                    }`}
                  >
                    {Number(item.stock) > 0 ? `${item.stock} left` : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-black/40 border-t border-white/5 grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                  className="px-2 py-1.5 rounded text-xs font-tech tracking-wider border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Edit Product"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item);
                  }}
                  className={`px-2 py-1.5 rounded text-xs font-tech tracking-wider border flex items-center justify-center gap-1 transition cursor-pointer ${
                    item.isDisabled
                      ? "border-purple-500/40 text-purple-300 hover:bg-purple-500/20"
                      : "border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  title={item.isDisabled ? "Make product visible" : "Hide product"}
                >
                  {item.isDisabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{item.isDisabled ? "Show" : "Hide"}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="px-2 py-1.5 rounded text-xs font-tech tracking-wider border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="clip-panel bg-[#0B0F17] border border-cyan-500/20 overflow-hidden shadow-xl shadow-cyan-500/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[750px]">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-900/80 text-xs font-tech text-cyan-400 uppercase">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock Status</th>
                  <th className="px-4 py-3">Visibility</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-body">
                {filteredProducts.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleEdit(item)}
                    className="hover:bg-cyan-500/10 transition-colors cursor-pointer group"
                    title="Click to edit product"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-950 rounded border border-white/10 p-1 flex items-center justify-center shrink-0">
                          <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-200 group-hover:text-cyan-300 transition-colors line-clamp-1">{item.title}</p>
                          <p className="font-tech text-[10px] text-gray-500 mt-0.5">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded font-tech text-[10px] uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {item.category || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-display font-700 text-base text-white">
                      ₹{item.price}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-tech text-xs px-2.5 py-1 border rounded uppercase ${
                          Number(item.stock) > 0
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                            : "text-pink-400 border-pink-500/30 bg-pink-500/10"
                        }`}
                      >
                        {Number(item.stock) > 0 ? `${item.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-tech text-[11px] px-2 py-0.5 rounded border uppercase ${
                          item.isDisabled
                            ? "text-purple-400 border-purple-500/30 bg-purple-500/10"
                            : "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                        }`}
                      >
                        {item.isDisabled ? "Hidden" : "Visible"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2.5 py-1 rounded text-xs font-tech border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer flex items-center gap-1"
                          title="Edit Product"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleToggle(item)}
                          className="px-2.5 py-1 rounded text-xs font-tech border border-white/10 text-gray-300 hover:text-cyan-300 hover:border-cyan-400/40 transition cursor-pointer"
                        >
                          {item.isDisabled ? "Show" : "Hide"}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded text-pink-400 border border-pink-500/30 hover:bg-pink-500/20 transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}