import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist, removeFromWishList } from "../redux/features/thunks/wishlistThunk";
import { addToCart } from "../redux/features/thunks/cartThunk";
import { IndianRupee, Heart, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Wishlists() {
  const { user } = useAuth();
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
  };

  const handleRemove = (wishlistId) => {
    dispatch(removeFromWishList(wishlistId));
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
      `}</style>

      {/* Grid ambient background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      <div className="relative max-w-[1500px] mx-auto z-10">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-tech text-xs tracking-widest uppercase mb-1">
              <Heart size={14} className="text-pink-500 fill-pink-500" />
              <span>SAVED GEAR // ARMORY</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-wide uppercase">
              My <span className="text-pink-500">Wishlist</span>
            </h1>
          </div>

          {user && items.length > 0 && (
            <div className="font-tech text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 clip-btn">
              SAVED ITEMS: <span className="text-cyan-400 font-bold">{items.length}</span>
            </div>
          )}
        </div>

        {/* NOT LOGGED IN STATE */}
        {!user ? (
          <div className="clip-panel bg-[#0B0F17] border border-cyan-500/20 p-12 text-center max-w-xl mx-auto my-12 relative shadow-[0_0_40px_rgba(0,229,255,0.05)]">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
              <Heart size={28} />
            </div>

            <h2 className="font-display font-bold text-2xl text-white uppercase tracking-wide mb-2">
              Authentication Required
            </h2>
            <p className="font-body text-gray-400 text-sm mb-8">
              Sign in to your account to view and synchronize your saved battle gear across devices.
            </p>

            <Link
              to="/login"
              className="clip-btn inline-flex items-center gap-2 px-8 py-3 bg-[#00E5FF] text-[#05070C] font-tech font-bold text-sm tracking-wider uppercase hover:bg-white transition-colors"
            >
              Sign In Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : loading && items.length === 0 ? (
          /* LOADING STATE */
          <div className="py-24 text-center">
            <p className="text-cyan-400 font-tech text-sm tracking-widest animate-pulse">
              DECRYPTING SAVED ITEMS…
            </p>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <div className="clip-panel bg-[#0B0F17] border border-white/10 p-12 text-center max-w-xl mx-auto my-12 relative">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-6">
              <Heart size={28} />
            </div>

            <h2 className="font-display font-bold text-2xl text-white uppercase tracking-wide mb-2">
              Your Armory is Empty
            </h2>
            <p className="font-body text-gray-400 text-sm mb-8">
              Explore our gear catalog and tap the heart icon on any console, controller, or accessory to save it here.
            </p>

            <Link
              to="/products"
              className="clip-btn inline-flex items-center gap-2 px-8 py-3 bg-[#00E5FF] text-[#05070C] font-tech font-bold text-sm tracking-wider uppercase hover:bg-white transition-colors"
            >
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* WISHLIST GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const productId = item.productId || item.id;
              return (
                <div
                  key={item.id}
                  className="group relative clip-panel bg-[#0B0F17] border border-white/10 overflow-hidden transition-all duration-200 hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(255,61,138,0.1)] flex flex-col justify-between"
                >
                  <span className="corner corner-tl" style={{ borderColor: "#FF3D8A" }} />
                  <span className="corner corner-br" style={{ borderColor: "#FF3D8A" }} />

                  {/* IMAGE CONTAINER */}
                  <div
                    onClick={() => navigate(`/products/${productId}`)}
                    className="relative w-full h-52 bg-white/[0.02] border-b border-white/5 flex items-center justify-center overflow-hidden p-5 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    />

                    {/* DELETE BUTTON BADGE */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md border border-white/10 text-gray-400 hover:text-pink-500 hover:border-pink-500/50 clip-btn transition-colors"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 flex-1 flex flex-col justify-between font-body">
                    <div>
                      {item.category && (
                        <span className="text-[10px] uppercase font-tech tracking-widest text-cyan-400 mb-1 block">
                          {item.category}
                        </span>
                      )}

                      <h2
                        onClick={() => navigate(`/products/${productId}`)}
                        className="text-sm font-medium text-gray-200 leading-5 min-h-[40px] hover:text-cyan-400 transition cursor-pointer"
                        title={item.title}
                      >
                        {item.title.length > 45 ? `${item.title.slice(0, 45)}...` : item.title}
                      </h2>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4 text-white" strokeWidth={2.5} />
                          <span className="font-display font-bold text-xl text-white">
                            {item.price}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-tech">IN STOCK</span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="clip-btn flex-1 flex items-center justify-center gap-2 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/10 active:scale-[0.98] text-xs font-display font-semibold tracking-wide py-2.5 transition"
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-2.5 clip-btn border border-pink-500/40 text-pink-400 hover:bg-pink-500/10 transition"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlists;