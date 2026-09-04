import React from "react";
import { IndianRupee, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/thunks/cartThunk";
import { toggleWishlist } from "../redux/features/thunks/wishlistThunk";

function Card({ value }) {
  const item = value;

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = Boolean(
    user &&
      wishlistItems.some(
        (w) =>
          String(w.productId) === String(item.id) &&
          String(w.userId) === String(user.id)
      )
  );

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      toast.wishlistRemove("Removed from Wishlist", item.title);
    } else {
      toast.wishlistAdd("Added to Wishlist", item.title);
    }

    dispatch(toggleWishlist({ product: item, userId: user.id }));
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        product: item,
      }),
    );
    toast.cartAdd("Added to Cart", item.title);
  };

  return (
    <div
      className="
        group
        relative
        clip-panel
        bg-[#0B0F17]
        border
        border-white/10
        w-full
        overflow-hidden
        cursor-pointer
        transition
        duration-200
        hover:border-cyan-400/40
        hover:shadow-[0_0_30px_rgba(0,229,255,0.08)]
      "
      onClick={() => navigate(`/products/${item.id}`)}
    >
      <span className="corner corner-tl" />
      <span className="corner corner-br" />

      {/* PRODUCT IMAGE */}
      <div
        className="
          relative
          w-full
          h-52
          bg-white/[0.02]
          border-b
          border-white/5
          flex
          items-center
          justify-center
          overflow-hidden
          p-5
        "
      >
        {item.stock === 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-pink-500/20 border border-pink-500/50 text-pink-400 font-tech text-[10px] tracking-wider uppercase clip-btn backdrop-blur-sm z-10">
            OUT OF STOCK
          </div>
        )}

        <img
          src={item.image}
          alt={item.title}
          className={`
            max-w-full
            max-h-full
            object-contain
            group-hover:scale-105
            transition-transform
            duration-300
            drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]
            ${item.stock === 0 ? "opacity-60 grayscale-[30%]" : ""}
          `}
        />
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="px-4 pb-4 pt-3 font-body">
        {/* TITLE */}
        <h2
          className="
            text-sm
            font-medium
            text-gray-200
            leading-5
            min-h-[40px]
            hover:text-cyan-400
            transition
          "
          title={item.title}
        >
          {item.title.length > 45
            ? `${item.title.slice(0, 45)}...`
            : item.title}
        </h2>

        {/* RATING */}
        <div className="flex items-center mt-2">
          <span
            className="
              bg-emerald-500/15
              text-emerald-400
              border
              border-emerald-500/30
              text-xs
              font-tech
              font-medium
              px-1.5
              py-0.5
            "
          >
            4.3 ★
          </span>

          <span className="text-xs text-gray-500 ml-2 font-tech">
            1,245 ratings
          </span>
        </div>

        {/* PRICE */}
        <div className="flex justify-between">
        <div className="flex items-center mt-3">
          
          <IndianRupee className="w-4 h-4 text-white" strokeWidth={2.5} />

          <span className="font-display font-700 text-xl text-white">
            {item.price}
          </span>

        </div>

          <div>
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`p-3 clip-btn border transition ${
                isWishlisted
                  ? "border-pink-500 text-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(255,61,138,0.25)]"
                  : "border-white/15 text-gray-400 hover:text-pink-400 hover:border-pink-400/50"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              title={isWishlisted ? "In Wishlist (Click to remove)" : "Add to Wishlist"}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* DISCOUNT */}
        <div className="text-xs text-pink-400 font-tech mt-1">
          Extra discount available
        </div>

        {/* ADD TO CART */}
        {item.stock === 0 ? (
          <button
            type="button"
            disabled
            onClick={(e) => e.stopPropagation()}
            className="
              clip-btn
              w-full
              mt-4
              flex
              items-center
              justify-center
              gap-2
              border
              border-white/10
              bg-white/5
              text-gray-500
              cursor-not-allowed
              text-sm
              font-display
              font-600
              tracking-wide
              py-2.5
            "
          >
            <ShoppingCart className="w-4 h-4 opacity-40" />
            Out of Stock
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="
              clip-btn
              w-full
              mt-4
              flex
              items-center
              justify-center
              gap-2
              border
              border-cyan-400/60
              text-cyan-300
              hover:bg-cyan-400/10
              active:scale-[0.98]
              text-sm
              font-display
              font-600
              tracking-wide
              py-2.5
              transition
            "
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;