import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderList } from "../redux/thunks/fetchordersThunk";

function OrderDetails() {
  const { items, status, error } = useSelector((state) => state.orderList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderList());
  }, [dispatch]);

  if (status === "loading")
    return (
      <div className="py-20 flex items-center justify-center w-full">
        <span className="text-[#00E5FF] font-mono tracking-[0.3em] uppercase animate-pulse text-sm">
          loading orders...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="py-16 flex items-center justify-center w-full">
        <div className="clip-panel border border-[#FF3D8A]/50 bg-[#FF3D8A]/10 px-6 py-4 max-w-md text-center">
          <span className="text-[#FF3D8A] font-mono text-sm">{error}</span>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-[1200px] mx-auto text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-16 sm:top-20 z-20 bg-black/95 backdrop-blur-sm py-3 border-b border-white/10 mb-4">
        <div>
          <p className="font-tech text-[11px] tracking-[0.2em] text-cyan-400 mb-0.5">
            ADMIN CONSOLE
          </p>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Order Details
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-body">
            Total Orders: {items.length}
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="flex flex-col gap-4 w-full max-h-none lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto pr-0 lg:pr-2">
        {items.map((item, idx) => (
          <div
            key={item.id || item.userId || idx}
            className="clip-panel relative border border-white/10 bg-white/[0.03] p-4 sm:p-5 rounded-lg"
          >
            {/* ORDER TOP INFO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 mb-4 gap-2">
              <div>
                <span className="font-semibold tracking-wide text-white text-base">
                  {item.shippingAddress?.name || "Customer"}
                </span>
                {item.shippingAddress?.city && (
                  <span className="text-xs text-gray-400 font-mono block">
                    {item.shippingAddress.city}
                    {item.shippingAddress.state ? `, ${item.shippingAddress.state}` : ""}
                  </span>
                )}
              </div>
              <div className="flex sm:flex-col sm:items-end justify-between text-xs font-mono text-white/50 gap-1">
                <span>User #{item.userId}</span>
                {item.createdAt && (
                  <span className="text-slate-400">Date: {item.createdAt}</span>
                )}
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="flex flex-col gap-2.5">
              {item.items?.map((product, pIdx) => (
                <div
                  key={product.productId || pIdx}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 bg-black/40 border border-white/5 p-3 sm:px-4 sm:py-2.5 justify-between rounded"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-contain bg-white/5 rounded border border-white/10 shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1 text-xs font-mono">
                      <span className="text-white/40">#ID: {product.productId}</span>
                      <span className="text-sm text-white/90 truncate font-body" title={product.title}>
                        {product.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 shrink-0 gap-1">
                    <span className="font-mono text-[#00E5FF] text-sm font-semibold">
                      ₹{product.price}
                    </span>
                    <span className="font-mono text-xs text-[#FF3D8A]">
                      Qty: {product.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;
