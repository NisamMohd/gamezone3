import React from "react";
import { IndianRupee, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/thunks/cartThunk";

function Card({ value }) {
  const item = value;

  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

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
        <img
          src={item.image}
          alt={item.title}
          className="
            max-w-full
            max-h-full
            object-contain
            group-hover:scale-105
            transition-transform
            duration-300
            drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]
          "
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
        <div className="flex items-center mt-3">
          <IndianRupee className="w-4 h-4 text-white" strokeWidth={2.5} />

          <span className="font-display font-700 text-xl text-white">
            {item.price}
          </span>
        </div>

        {/* DISCOUNT */}
        <div className="text-xs text-pink-400 font-tech mt-1">
          Extra discount available
        </div>

        {/* ADD TO CART */}
        <button
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
      </div>
    </div>
  );
}

export default Card;