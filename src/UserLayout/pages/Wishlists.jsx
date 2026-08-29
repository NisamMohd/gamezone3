import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchWishlist,
  removeFromWishList,
  clearWishlistAsync,
} from "../redux/features/thunks/wishlistThunk";
import { addToCart } from "../redux/features/thunks/cartThunk";
import {
  IndianRupee,
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Wishlists() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { items, loading, status } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist(user.id));
    }
  }, [user, dispatch]);

  const handleAddToCart = (item) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (item.stock === 0) {
      toast.error("Out of Stock", "This equipment is currently out of stock.");
      return;
    }

    const product = {
      id: item.productId || item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock !== undefined ? item.stock : 10,
    };

    dispatch(
      addToCart({
        userId: user.id,
        product,
      })
    );
    toast.cartAdd("Added to Cart", item.title);
  };

  const handleMoveAllToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const inStockItems = items.filter((i) => (i.stock !== undefined ? i.stock > 0 : true));
    if (inStockItems.length === 0) {
      toast.info("No In-Stock Items", "None of your saved items are currently in stock.");
      return;
    }

    inStockItems.forEach((item) => {
      dispatch(
        addToCart({
          userId: user.id,
          product: {
            id: item.productId || item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
            stock: item.stock !== undefined ? item.stock : 10,
          },
        })
      );
    });

    toast.success(
      "Moved to Cart",
      `Transferred ${inStockItems.length} saved item(s) to your loadout.`
    );
  };

  const handleRemove = (item) => {
    dispatch(removeFromWishList(item.id));
    toast.wishlistRemove("Removed from Wishlist", item.title);
  };

  const handleClearWishlist = () => {
    if (!user || items.length === 0) return;
    dispatch(clearWishlistAsync(user.id));
    toast.info("Wishlist Cleared", "All saved items have been cleared from your armory.");
  };

  const totalValue = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const themeStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    .font-display { font-family: 'Rajdhani', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .font-tech { font-family: 'JetBrains Mono', monospace; }

    .clip-panel {
      clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%);
    }
    .clip-btn {
      clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
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
  `;

  const Backdrop = () => (
    <>
      <style>{themeStyles}</style>
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #00E5FF, transparent 70%)",
        }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #FF3D8A, transparent 70%)",
        }}
      />
    </>
  );

  // Loading state
  if (status === "loading" && items.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-black flex items-center justify-center relative">
        <Backdrop />
        <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse relative">
          DECRYPTING SAVED ARMORY ITEMS…
        </p>
      </div>
    );
  }

  // Empty wishlist state
  if (!items || items.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-black relative pb-20">
        <Backdrop />
        <div className="relative max-w-[1200px] mx-auto px-4 py-6">
          <div className="relative clip-panel bg-[#0B0F17] border border-white/10 min-h-[420px] flex flex-col items-center justify-center p-8 text-center">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-5">
              <Heart size={32} />
            </div>

            <h2 className="font-display font-700 text-2xl text-white tracking-wide uppercase">
              Your Armory is Empty
            </h2>

            <p className="text-sm text-gray-500 mt-2 font-body max-w-md">
              You haven't saved any battle gear yet. Tap the heart icon on any console, controller, or accessory to save it to your wishlist.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="
                clip-btn
                mt-6
                px-8
                py-3
                font-display
                font-700
                tracking-wider
                text-black
                text-sm
                uppercase
                transition
                hover:brightness-110
                cursor-pointer
              "
              style={{
                background: "linear-gradient(120deg, #00E5FF, #FF3D8A)",
              }}
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-black relative pb-20">
      <Backdrop />

      <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 py-6">
        {/* PAGE HEADER & CLEAR WISHLIST ACTION */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-tech text-[11px] tracking-[0.2em] text-pink-400 mb-1 flex items-center gap-1.5">
              <Heart size={13} className="fill-pink-400" />
              SAVED ARMORY LOADOUT
            </p>
            <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-body">
              {items.length} saved item{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearWishlist}
            className="clip-btn flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/50 font-tech text-xs tracking-wider uppercase transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear Wishlist</span>
          </button>
        </div>

        {/* MAIN WISHLIST LISTING (MATCHING CART LAYOUT) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT: WISHLIST ITEM ROWS */}
          <div className="w-full lg:flex-1 space-y-3">
            {items.map((item) => {
              const isOutOfStock = item.stock === 0;

              return (
                <div
                  key={item.id}
                  className="
                    relative
                    clip-panel
                    bg-[#0B0F17]
                    border
                    border-white/10
                    p-5
                    hover:border-pink-500/30
                    transition
                  "
                >
                  <span className="corner corner-tl" style={{ borderColor: "#FF3D8A" }} />
                  <span className="corner corner-br" style={{ borderColor: "#00E5FF" }} />

                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* PRODUCT IMAGE CONTAINER */}
                    <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded p-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain p-2"
                      />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="flex-1 min-w-0 font-body flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {item.category && (
                            <span className="font-tech text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                          )}

                          {isOutOfStock ? (
                            <span className="font-tech text-[10px] text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded uppercase">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="font-tech text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                              In Stock
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/products/${item.productId || item.id}`}
                          className="text-base sm:text-lg font-medium text-white hover:text-cyan-300 transition line-clamp-1"
                        >
                          {item.title}
                        </Link>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description || "High-performance pro gaming equipment built for competitive play."}
                        </p>
                      </div>

                      {/* PRICE + ACTIONS ROW */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-white/5">
                        {/* PRICE */}
                        <div className="flex items-center">
                          <IndianRupee size={17} className="text-white" strokeWidth={2.5} />
                          <span className="font-display font-700 text-xl text-white">
                            {Number(item.price).toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* BUTTONS: ADD TO CART & REMOVE */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            disabled={isOutOfStock}
                            className="
                              clip-btn
                              flex
                              items-center
                              gap-2
                              px-5
                              py-2
                              font-display
                              font-700
                              text-xs
                              tracking-wider
                              uppercase
                              text-black
                              transition
                              hover:brightness-110
                              cursor-pointer
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                            "
                            style={{
                              background: isOutOfStock
                                ? "#374151"
                                : "linear-gradient(120deg, #00E5FF, #FF3D8A)",
                            }}
                          >
                            <ShoppingCart size={14} />
                            <span>{isOutOfStock ? "Unavailable" : "Move to Cart"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="
                              flex
                              items-center
                              gap-1.5
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-gray-400
                              hover:text-pink-400
                              hover:bg-pink-500/10
                              rounded
                              transition
                            "
                            title="Remove from wishlist"
                          >
                            <Trash2 size={15} />
                            <span className="hidden sm:inline font-tech text-[11px]">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: WISHLIST OVERVIEW PANEL (MATCHING CART SUMMARY) */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-28">
            <div className="relative clip-panel bg-[#0B0F17] border border-white/10 p-6">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <h2 className="font-display font-700 text-lg tracking-wide text-white uppercase">
                  Wishlist Overview
                </h2>
              </div>

              <div className="space-y-3 font-tech text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Saved Items</span>
                  <span className="text-white font-bold">{items.length}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>In Stock</span>
                  <span className="text-emerald-400">
                    {items.filter((i) => (i.stock !== undefined ? i.stock > 0 : true)).length} items
                  </span>
                </div>

                <div className="border-t border-dashed border-white/15 pt-4 mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-700 text-sm uppercase tracking-wide text-white">
                      Estimated Value
                    </span>
                    <div className="text-right">
                      <span className="font-display font-bold text-2xl text-cyan-400">
                        ₹{totalValue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOVE ALL TO CART CTA */}
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="
                  clip-btn
                  w-full
                  mt-6
                  py-3
                  font-display
                  font-bold
                  uppercase
                  tracking-wider
                  text-black
                  text-xs
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  hover:brightness-110
                  cursor-pointer
                "
                style={{
                  background: "linear-gradient(120deg, #00E5FF, #FF3D8A)",
                }}
              >
                <ShoppingCart size={15} />
                <span>Move All to Cart</span>
              </button>

              <Link
                to="/products"
                className="
                  clip-btn
                  w-full
                  mt-3
                  py-2.5
                  bg-white/5
                  border
                  border-white/15
                  text-gray-300
                  hover:text-white
                  hover:border-cyan-400
                  font-tech
                  text-xs
                  tracking-wider
                  uppercase
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                "
              >
                <span>Continue Shopping</span>
                <ArrowRight size={13} />
              </Link>

              {/* TRUST STRIP */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-[11px] text-gray-500 font-body">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                  <span>Items synchronized with your account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlists;