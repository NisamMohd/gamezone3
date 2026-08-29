import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../redux/features/thunks/productThunks";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { fetchCarts } from "../redux/features/thunks/cartThunk";
import { fetchWishlist } from "../redux/features/thunks/wishlistThunk";
import { useAuth } from "../context/AuthContext";
import { Filter, X, RotateCcw, SlidersHorizontal, ArrowUpDown, Search } from "lucide-react";

function Products() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";

  const { products, loading, error } = useSelector((state) => state.products);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(80000);
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCarts(user.id));
      dispatch(fetchWishlist(user.id));
    }
  }, [user, dispatch]);

  // Category counts
  const categoryCounts = useMemo(() => {
    if (!products) return { playstation: 0, console: 0, accessories: 0 };
    return {
      playstation: products.filter((p) =>
        (p.category || "").toLowerCase().includes("playstation")
      ).length,
      console: products.filter((p) =>
        (p.category || "").toLowerCase().includes("console")
      ).length,
      accessories: products.filter((p) =>
        (p.category || "").toLowerCase().includes("accessories")
      ).length,
    };
  }, [products]);

  // Stock counts
  const stockCounts = useMemo(() => {
    if (!products) return { inStock: 0, outOfStock: 0 };
    return {
      inStock: products.filter((p) => p.stock > 0).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
    };
  }, [products]);

  // Toggle category
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const isPriceFiltered =
    (minPrice !== "" && Number(minPrice) > 2000) ||
    (maxPrice !== "" && Number(maxPrice) < 80000);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setMinPrice(2000);
    setMaxPrice(80000);
    setInStock(false);
    setOutOfStock(false);
    setMinRating(0);
    setSortBy("relevance");
    setSearchParams({});
  };

  // Active filters count
  const activeFiltersCount =
    selectedCategories.length +
    (inStock ? 1 : 0) +
    (outOfStock ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (isPriceFiltered ? 1 : 0) +
    (searchParam ? 1 : 0);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((item) => {
        // Search Filter from URL
        if (searchParam) {
          const title = (item.title || "").toLowerCase();
          const desc = (item.description || "").toLowerCase();
          const cat = (item.category || "").toLowerCase();
          const query = searchParam.toLowerCase();
          if (!title.includes(query) && !desc.includes(query) && !cat.includes(query)) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategories.length > 0) {
          const itemCat = (item.category || "").toLowerCase();
          const matches = selectedCategories.some((cat) =>
            itemCat.includes(cat.toLowerCase())
          );
          if (!matches) return false;
        }

        // Price Filter (Min / Max Bound)
        const price = Number(item.price) || 0;
        const currentMin = minPrice !== "" ? Number(minPrice) : 0;
        const currentMax = maxPrice !== "" ? Number(maxPrice) : 80000;

        if (price < currentMin || price > currentMax) {
          return false;
        }

        // Stock Filter
        const itemInStock = item.stock !== undefined ? item.stock > 0 : true;
        if (inStock && !outOfStock) {
          if (!itemInStock) return false;
        } else if (!inStock && outOfStock) {
          if (itemInStock) return false;
        }

        // Rating Filter
        if (minRating > 0) {
          const rating = item.rating || 4.3;
          if (rating < minRating) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        }
        if (sortBy === "price-desc") {
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        }
        return 0; // relevance / original
      });
  }, [
    products,
    searchParam,
    selectedCategories,
    minPrice,
    maxPrice,
    inStock,
    outOfStock,
    minRating,
    sortBy,
  ]);

  // Sidebar Filter Component
  const FilterContent = () => (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-cyan-400" />
          <h2 className="font-display font-700 text-lg tracking-wide text-white">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-tech px-1.5 py-0.5 rounded">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] font-tech text-pink-400 hover:text-pink-300 transition"
          >
            <RotateCcw size={12} />
            RESET
          </button>
        )}
      </div>

      {/* CATEGORIES */}
      <div className="px-5 py-5 border-b border-white/10">
        <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4 flex items-center justify-between">
          <span>CATEGORIES</span>
          {selectedCategories.length > 0 && (
            <span className="text-gray-500 font-normal">({selectedCategories.length})</span>
          )}
        </h3>

        <div className="space-y-3 text-sm text-gray-300 font-body">
          <label className="flex items-center justify-between cursor-pointer hover:text-white transition group">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedCategories.includes("playstation")}
                onChange={() => handleCategoryToggle("playstation")}
                className="hud-checkbox"
              />
              <span>PlayStations</span>
            </span>
            <span className="font-tech text-xs text-gray-500 group-hover:text-cyan-400">
              {categoryCounts.playstation}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:text-white transition group">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedCategories.includes("console")}
                onChange={() => handleCategoryToggle("console")}
                className="hud-checkbox"
              />
              <span>Controllers</span>
            </span>
            <span className="font-tech text-xs text-gray-500 group-hover:text-cyan-400">
              {categoryCounts.console}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:text-white transition group">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedCategories.includes("accessories")}
                onChange={() => handleCategoryToggle("accessories")}
                className="hud-checkbox"
              />
              <span>Accessories</span>
            </span>
            <span className="font-tech text-xs text-gray-500 group-hover:text-cyan-400">
              {categoryCounts.accessories}
            </span>
          </label>
        </div>
      </div>

      {/* PRICE FILTER */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400">
            PRICE RANGE
          </h3>
          <span className="font-tech text-xs text-white font-bold">
            Up to ₹{Number(maxPrice || 80000).toLocaleString("en-IN")}
          </span>
        </div>

        <input
          type="range"
          min="2000"
          max="80000"
          step="500"
          value={maxPrice === "" ? 80000 : maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: "#00E5FF" }}
        />

        <div className="flex items-center justify-between text-[10px] font-tech text-gray-500 mt-1 mb-3">
          <span>Min: ₹2,000</span>
          <span>Max: ₹80,000</span>
        </div>

        {/* MIN / MAX CUSTOM INPUTS */}
        <div className="flex gap-2 items-center">
          <div className="relative w-1/2">
            <span className="absolute left-2 top-2 text-xs text-gray-500 font-tech">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setMinPrice(val);
              }}
              className="w-full bg-white/5 border border-white/15 pl-5 pr-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 font-tech outline-none focus:border-cyan-400/60"
            />
          </div>

          <span className="text-gray-500 text-xs font-tech">-</span>

          <div className="relative w-1/2">
            <span className="absolute left-2 top-2 text-xs text-gray-500 font-tech">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setMaxPrice(val);
              }}
              className="w-full bg-white/5 border border-white/15 pl-5 pr-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 font-tech outline-none focus:border-cyan-400/60"
            />
          </div>
        </div>

        {/* QUICK PRESETS */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {[
            { label: "< ₹10k", min: 2000, max: 10000 },
            { label: "₹10k - ₹35k", min: 10000, max: 35000 },
            { label: "₹35k - ₹60k", min: 35000, max: 60000 },
            { label: "> ₹60k", min: 60000, max: 80000 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setMinPrice(preset.min);
                setMaxPrice(preset.max);
              }}
              className={`text-[10px] font-tech px-2 py-1 clip-btn border transition ${
                minPrice === preset.min && maxPrice === preset.max
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* AVAILABILITY / STOCK FILTER */}
      <div className="px-5 py-5 border-b border-white/10">
        <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4">
          AVAILABILITY
        </h3>

        <div className="flex flex-col gap-3 text-sm text-gray-300 font-body">
          <label className="flex items-center justify-between cursor-pointer hover:text-white transition group">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="hud-checkbox"
              />
              <span className="text-emerald-400 font-medium">In Stock</span>
            </span>
            <span className="font-tech text-xs text-emerald-400/70 group-hover:text-emerald-400">
              {stockCounts.inStock}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:text-white transition group">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={outOfStock}
                onChange={(e) => setOutOfStock(e.target.checked)}
                className="hud-checkbox"
              />
              <span className="text-pink-400 font-medium">Out Of Stock</span>
            </span>
            <span className="font-tech text-xs text-pink-400/70 group-hover:text-pink-400">
              {stockCounts.outOfStock}
            </span>
          </label>
        </div>
      </div>

      {/* CUSTOMER RATING */}
      <div className="px-5 py-5">
        <h3 className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-4">
          CUSTOMER RATING
        </h3>

        <div className="space-y-3 text-sm text-gray-300 font-body">
          <label className="flex gap-2.5 items-center cursor-pointer hover:text-white transition">
            <input
              type="checkbox"
              checked={minRating === 4}
              onChange={() => setMinRating(minRating === 4 ? 0 : 4)}
              className="hud-checkbox"
            />
            <span>4★ & above</span>
          </label>

          <label className="flex gap-2.5 items-center cursor-pointer hover:text-white transition">
            <input
              type="checkbox"
              checked={minRating === 3}
              onChange={() => setMinRating(minRating === 3 ? 0 : 3)}
              className="hud-checkbox"
            />
            <span>3★ & above</span>
          </label>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 bg-black overflow-y-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
        }
        .clip-btn {
          clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #00E5FF;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .corner-tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .hud-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.02);
          display: inline-block;
          position: relative;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s ease;
        }
        .hud-checkbox:checked {
          background: #00E5FF;
          border-color: #00E5FF;
        }
        .hud-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 4.5px;
          top: 1.5px;
          width: 4px;
          height: 8px;
          border: solid #05070C;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>

      {/* ambient backdrop */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      <div className="relative max-w-[1500px] mx-auto p-4 pb-20">
        <div className="flex gap-6 items-start">

          {/* DESKTOP FILTER PANEL */}
          <aside className="fixed hidden md:block w-64 shrink-0 clip-panel bg-[#0B0F17] border border-cyan-500/20 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <span className="corner corner-tl" />
            <span className="corner corner-bl" />
            <FilterContent />
          </aside>

          {/* MOBILE FILTER MODAL / DRAWER */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex justify-end">
              <div className="w-80 h-full bg-[#0B0F17] border-l border-cyan-500/30 overflow-y-auto p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                  <span className="font-tech text-xs text-cyan-400">FILTER SETTINGS</span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
                <FilterContent />
                <div className="pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full clip-btn py-3 bg-[#00E5FF] text-black font-display font-bold text-sm tracking-wide uppercase"
                  >
                    Apply Filters ({filteredProducts.length} items)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT PRODUCT SECTION */}
          <main className="md:ml-70 flex-1 min-w-0">

            {/* PRODUCT HEADING + SORTING TOOLBAR */}
            <div className="relative clip-panel bg-[#0B0F17] border border-cyan-500/20 px-5 py-4 mb-4">
              <span className="corner corner-tr" />
              <span className="corner corner-br" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400">
                      GAMEZONE ARSENAL
                    </p>
                    <span className="font-tech text-[10px] text-gray-500">
                      [{filteredProducts.length} / {products?.length || 0} GEAR LOADED]
                    </span>
                  </div>

                  <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
                    Products
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  {/* MOBILE FILTER TOGGLE */}
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="md:hidden flex items-center gap-2 px-3 py-2 bg-white/5 border border-cyan-500/30 text-cyan-300 font-tech text-xs clip-btn"
                  >
                    <Filter size={14} />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-cyan-500 text-black px-1.5 py-0.2 text-[10px] rounded font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* SORT BY DROPDOWN */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline font-tech text-xs text-gray-500 whitespace-nowrap">
                      SORT BY
                    </span>

                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white/5 border border-white/15 px-3 py-2 text-xs sm:text-sm text-gray-200 font-body outline-none focus:border-cyan-400/60 cursor-pointer clip-btn pr-8"
                      >
                        <option value="relevance" className="bg-[#0B0F17]">
                          Featured / Relevance
                        </option>
                        <option value="price-asc" className="bg-[#0B0F17]">
                          Price: Low to High
                        </option>
                        <option value="price-desc" className="bg-[#0B0F17]">
                          Price: High to Low
                        </option>
                      </select>
                      <ArrowUpDown
                        size={13}
                        className="absolute right-2.5 top-3 pointer-events-none text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE FILTER TAGS */}
              {activeFiltersCount > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <span className="font-tech text-[10px] text-gray-500 uppercase mr-1">
                    Active Filters:
                  </span>

                  {searchParam && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-tech text-[11px] clip-btn">
                      <Search size={11} className="text-cyan-400" />
                      <span>"{searchParam}"</span>
                      <button
                        type="button"
                        onClick={() => setSearchParams({})}
                        className="hover:text-pink-400"
                        title="Clear search"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-tech text-[11px] clip-btn"
                    >
                      <span className="capitalize">{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className="hover:text-pink-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {isPriceFiltered && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-tech text-[11px] clip-btn">
                      <span>
                        ₹{Number(minPrice || 2000).toLocaleString("en-IN")} - ₹{Number(maxPrice || 80000).toLocaleString("en-IN")}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMinPrice(2000);
                          setMaxPrice(80000);
                        }}
                        className="hover:text-pink-400"
                        title="Reset price range"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {inStock && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-tech text-[11px] clip-btn">
                      <span>In Stock</span>
                      <button
                        type="button"
                        onClick={() => setInStock(false)}
                        className="hover:text-pink-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {outOfStock && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 font-tech text-[11px] clip-btn">
                      <span>Out Of Stock</span>
                      <button
                        type="button"
                        onClick={() => setOutOfStock(false)}
                        className="hover:text-pink-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-tech text-[11px] clip-btn">
                      <span>{minRating}★ & above</span>
                      <button
                        type="button"
                        onClick={() => setMinRating(0)}
                        className="hover:text-pink-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-tech text-gray-400 hover:text-pink-400 underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* LOADING STATE */}
            {loading && (
              <div className="clip-panel bg-[#0B0F17] border border-cyan-500/20 p-12 text-center">
                <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse">
                  SCANNING ARSENAL INVENTORY…
                </p>
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="clip-panel bg-[#0B0F17] border border-pink-500/30 p-12 text-center">
                <p className="font-tech text-sm text-pink-400">ERROR: {error}</p>
              </div>
            )}

            {/* EMPTY FILTER RESULTS */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="clip-panel bg-[#0B0F17] border border-white/10 p-12 text-center max-w-lg mx-auto my-8 relative">
                <span className="corner corner-tl" />
                <span className="corner corner-tr" />
                <span className="corner corner-bl" />
                <span className="corner corner-br" />

                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                  <SlidersHorizontal size={24} />
                </div>

                <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide mb-2">
                  No Gear Matches Your Criteria
                </h3>
                <p className="font-body text-gray-400 text-sm mb-6">
                  Try adjusting your price range, selected categories, or availability filters to locate matching gear.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="clip-btn inline-flex items-center gap-2 px-6 py-2.5 bg-[#00E5FF] text-black font-tech font-bold text-xs tracking-wider uppercase hover:bg-white transition-colors"
                >
                  <RotateCcw size={14} />
                  Reset All Filters
                </button>
              </div>
            )}

            {/* PRODUCTS GRID */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                  <Card key={item.id} value={item} />
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;