import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/thunks/addProductThunk";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import {
  Package,
  Image,
  Tag,
  IndianRupee,
  Layers,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

function AddProducts() {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "playstation",
    price: "",
    stock: "",
    description: "",
    isDisabled: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const CATEGORY_PRESETS = ["playstation", "xbox", "accessories", "console"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title Required", "Please enter a product title.");
      return;
    }
    if (!formData.price) {
      toast.error("Price Required", "Please enter a valid price.");
      return;
    }

    try {
      await dispatch(addProduct(formData)).unwrap();
      toast.success("Product Added", `${formData.title} added to catalog.`);
      navigate("/admin/productmanagement");
    } catch (err) {
      toast.error("Failed to Add Product", err || "Check server connection.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-white py-4 space-y-5">
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          type="button"
          onClick={() => navigate("/admin/productmanagement")}
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>BACK TO PRODUCT CATALOG</span>
        </button>
        <span className="font-tech text-xs text-cyan-400 uppercase tracking-widest">
          ADMIN CONSOLE // NEW GEAR
        </span>
      </div>

      {/* DUAL-COLUMN LAYOUT: FORM + LIVE PRODUCT CARD PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-7 clip-panel bg-[#0B0F17] border border-cyan-500/30 p-6 sm:p-7 relative shadow-xl shadow-cyan-500/5">
          <div className="corner corner-tl" />
          <div className="corner corner-br" />

          <h2 className="text-xl font-display font-700 tracking-wider uppercase text-cyan-400 mb-6 flex items-center gap-2">
            <Package size={20} />
            <span>Add Catalog Product</span>
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Product Title
              </label>
              <div className="relative">
                <Package size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. DualSense Edge Controller"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="image" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Image URL
              </label>
              <div className="relative">
                <Image size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="image"
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Category with Quick-Picks */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Category
              </label>
              <div className="relative">
                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="e.g. playstation, accessories"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                />
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {CATEGORY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: preset })}
                    className={`px-2 py-0.5 rounded text-[11px] font-tech uppercase border transition cursor-pointer ${
                      formData.category.toLowerCase() === preset
                        ? "border-cyan-400 text-cyan-300 bg-cyan-500/20 font-bold"
                        : "border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                Product Description
              </label>
              <div className="relative">
                <FileText size={16} className="absolute left-3.5 top-3 text-gray-500" />
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Enter detailed gaming specs, key features, and package contents..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition resize-none font-body"
                />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="price" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                  Price (₹)
                </label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="24999"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="stock" className="text-xs uppercase tracking-wider text-gray-400 font-tech">
                  Initial Stock
                </label>
                <div className="relative">
                  <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    placeholder="10"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Toggle Button */}
            <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded mt-1">
              <div>
                <span className="font-tech text-xs uppercase text-gray-300 block">Product Visibility</span>
                <span className="text-[11px] text-gray-500">
                  {formData.isDisabled ? "Hidden from customer storefront" : "Visible in customer catalog"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDisabled: !formData.isDisabled })}
                className={`px-3 py-1.5 rounded font-mono text-xs border flex items-center gap-1.5 transition cursor-pointer ${
                  formData.isDisabled
                    ? "border-purple-500/40 text-purple-300 bg-purple-500/10"
                    : "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                }`}
              >
                {formData.isDisabled ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{formData.isDisabled ? "Hidden" : "Visible"}</span>
              </button>
            </div>

            <button
              type="submit"
              className="mt-3 clip-btn bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-display font-700 py-3 px-6 text-sm tracking-widest uppercase transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={17} />
              <span>Save & Publish Product</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE PRODUCT PREVIEW CARD */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="clip-panel bg-[#0B0F17] border border-cyan-500/30 overflow-hidden relative shadow-xl">
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />

            <div className="p-3 bg-black/60 border-b border-white/10 flex justify-between items-center">
              <span className="text-[10px] font-tech text-cyan-400 uppercase tracking-widest">
                STOREFRONT // LIVE PREVIEW
              </span>
              <span
                className={`text-[10px] font-tech uppercase px-2 py-0.5 rounded border ${
                  formData.isDisabled
                    ? "border-purple-500/30 text-purple-300 bg-purple-500/10"
                    : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                }`}
              >
                {formData.isDisabled ? "Hidden" : "Visible"}
              </span>
            </div>

            {/* Image Preview Box */}
            <div className="h-52 bg-slate-950/80 p-4 flex items-center justify-center border-b border-white/5 relative">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center text-gray-600">
                  <Package size={40} className="mx-auto mb-2 opacity-50" />
                  <span className="font-tech text-xs">Enter image URL to preview</span>
                </div>
              )}

              {formData.category && (
                <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-tech uppercase rounded bg-black/80 border border-cyan-400/40 text-cyan-300">
                  {formData.category}
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-display font-700 text-lg text-white line-clamp-2">
                  {formData.title || "Product Title Preview"}
                </h3>
                {formData.description ? (
                  <p className="text-xs text-gray-400 font-body line-clamp-2 mt-1 leading-relaxed">
                    {formData.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-600 font-body italic mt-1">
                    No description added yet...
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="font-display font-700 text-2xl text-white">
                  ₹{formData.price || "0"}
                </span>
                <span
                  className={`font-tech text-xs px-2.5 py-1 border rounded uppercase ${
                    Number(formData.stock) > 0
                      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                      : "text-pink-400 border-pink-500/30 bg-pink-500/10"
                  }`}
                >
                  {Number(formData.stock) > 0 ? `${formData.stock} in stock` : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProducts;