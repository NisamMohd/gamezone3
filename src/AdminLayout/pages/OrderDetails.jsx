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
      <div className="min-h-screen bg-black flex items-center justify-center pt-32">
        <span className="text-[#00E5FF] font-mono tracking-[0.3em] uppercase animate-pulse">
          loading...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-32">
        <div className="clip-panel border border-[#FF3D8A]/50 bg-[#FF3D8A]/10 px-6 py-4">
          <span className="text-[#FF3D8A] font-mono text-sm">{error}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white  px-6 md:px-10 pb-16">
      <div className="sticky top-25 z-40 bg-black">
        <h1 className="text-3xl font-semibold tracking-[0.15em] uppercase text-[#00E5FF] mb-8">
          Order Details
        </h1>

        <span>Total Orders : {items.length}</span>
      </div>

      <div className="flex flex-col gap-6 w-full max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item.userId}
            className="clip-panel relative border border-white/10 bg-white/[0.03] p-5"
          >
            {/* <span className="corner-tl" />
            <span className="corner-br" /> */}

            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="font-semibold tracking-wide">
                {item.shippingAddress.name}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/40">
                  #{item.userId}
                </span>
                <span className="text-xs font-mono text-white/40">
                  Date : {item.createdAt}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {item.items.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4 bg-black/40 border border-white/5 px-5 py-2 justify-between"
                >
                 <div className="flex gap-3">
                   <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-contain bg-white/5 shrink-0"
                  />
                  <div className="flex flex-col text-xs font-mono text-white/40">
                    <span>#ID : {product.productId}</span>
                    <span className="flex-1 text-sm text-white/80 truncate">
                      {product.title}
                    </span>
                  </div>
                 </div>
                  <div>
                    <span className="font-mono text-[#00E5FF] text-sm">
                      ${product.price}
                    </span>
                    <span className="font-mono text-xs text-[#FF3D8A]">
                      x{product.quantity}
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
