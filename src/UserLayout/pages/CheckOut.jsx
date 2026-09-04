import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  IndianRupee,
  Package,
  ShoppingBag,
  Building,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../redux/features/thunks/orderThunk";
import { resetOrderStatus } from "../redux/features/orderSlice";
import api from "../../services/api";

function CheckOut() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items);
  const { loading: orderLoading, orderSuccess, currentOrder, error: orderError } = useSelector(
    (state) => state.orders
  );

  // Check if direct buy item was passed from ProductDetails
  const directBuyItem = location.state?.directBuyItem;
  const items = directBuyItem ? [directBuyItem] : cartItems;

  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [isCheckingAddress, setIsCheckingAddress] = useState(true);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Authentication Guard & Address Fetching
  useEffect(() => {
    if (!user) {
      toast.info("Authentication Required", "Please log in to access checkout.");
      navigate("/login");
      return;
    }

    const checkUserAddress = async () => {
      try {
        setIsCheckingAddress(true);
        const { data: userData } = await api.get(`/users/${user.id}`);
        if (userData && userData.address) {
          setShipping({
            name: userData.address.name || userData.name || "",
            phone: userData.address.phone || "",
            address: userData.address.address || userData.address.street || "",
            city: userData.address.city || "",
            state: userData.address.state || "",
            zip: userData.address.zip || userData.address.postalCode || "",
            country: userData.address.country || "India",
          });
          setHasSavedAddress(true);
        } else {
          setShipping((prev) => ({
            ...prev,
            name: user.name || "",
          }));
          setHasSavedAddress(false);
        }
      } catch (err) {
        console.warn("Could not retrieve user address from server:", err);
        setShipping((prev) => ({
          ...prev,
          name: user.name || "",
        }));
      } finally {
        setIsCheckingAddress(false);
      }
    };

    checkUserAddress();

    return () => {
      dispatch(resetOrderStatus());
    };
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shipping.name.trim()) newErrors.name = "Full name is required";
    if (!shipping.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (shipping.phone.trim().length < 10) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!shipping.address.trim()) newErrors.address = "Street address is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.state.trim()) newErrors.state = "State is required";
    if (!shipping.zip.trim()) {
      newErrors.zip = "PIN / Postal code is required";
    } else if (shipping.zip.trim().length < 4) {
      newErrors.zip = "Enter a valid postal code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = 0; // Free Cyber Express Delivery
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error(
        "Incomplete Shipping Details",
        "Please fill in all required shipping address fields before proceeding."
      );
      return;
    }

    try {
      const orderPayload = {
        userId: user.id,
        items,
        shippingAddress: shipping,
        totalAmount: total,
        paymentMethod,
        isDirectBuy: Boolean(directBuyItem),
      };

      const resultAction = await dispatch(createOrder(orderPayload));

      if (createOrder.fulfilled.match(resultAction)) {
        // Update user address in context
        if (updateUser) {
          updateUser({
            ...user,
            address: shipping,
          });
        }
        toast.success(
          "Order Placed Successfully!",
          "Your gaming equipment order has been confirmed and saved to server."
        );
      } else {
        const errorMsg = resultAction.payload || "Could not process order.";
        toast.error("Order Failed", errorMsg);
      }
    } catch (err) {
      toast.error("Order Failed", err.message || "An unexpected error occurred.");
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSuccess && currentOrder) {
    return (
      <div className="pt-28 min-h-screen bg-black relative pb-20 px-4">
        <style>{`
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
        `}</style>

        <div className="fixed inset-0 grid-bg pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="clip-panel bg-[#0B0F17] border border-cyan-500/30 p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(0,229,255,0.12)]">
            <span className="corner corner-tl" />
            <span className="corner corner-tr" />
            <span className="corner corner-bl" />
            <span className="corner corner-br" />

            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              <CheckCircle2 size={42} className="text-cyan-400 animate-pulse" />
            </div>

            <span className="font-tech text-xs tracking-[0.25em] text-cyan-400 uppercase">
              TRANSACTION VERIFIED // STATUS CONFIRMED
            </span>

            <h1 className="font-display font-700 text-3xl sm:text-4xl text-white uppercase tracking-wide mt-2">
              Mission Order Placed!
            </h1>

            <p className="font-body text-gray-400 text-sm mt-3 max-w-md mx-auto">
              Your equipment order has been registered into the database and is preparing for dispatch.
            </p>

            {/* ORDER META BOX */}
            <div className="mt-8 p-4 bg-white/[0.02] border border-white/10 rounded-lg text-left grid sm:grid-cols-3 gap-4">
              <div>
                <span className="font-tech text-[10px] text-gray-500 uppercase block">ORDER ID</span>
                <span className="font-tech text-xs text-cyan-300 font-bold">
                  #{currentOrder.id || "ORD-" + Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>

              <div>
                <span className="font-tech text-[10px] text-gray-500 uppercase block">ESTIMATED DELIVERY</span>
                <span className="font-tech text-xs text-emerald-400">2-4 Business Days</span>
              </div>

              <div>
                <span className="font-tech text-[10px] text-gray-500 uppercase block">TOTAL PAID</span>
                <span className="font-display font-bold text-base text-white">
                  ₹{Number(currentOrder.totalAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* PURCHASED ITEMS LIST */}
            <div className="mt-6 border-t border-white/10 pt-6 text-left">
              <h3 className="font-tech text-xs text-gray-400 uppercase tracking-wider mb-4">
                LOADOUT ITEMS ({currentOrder.items?.length || 0})
              </h3>

              <div className="space-y-3">
                {currentOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 bg-white/[0.01] border border-white/5 rounded"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain bg-black/40 rounded p-1 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 font-tech">
                        Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="font-tech text-sm font-bold text-cyan-400">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SHIPPING DESTINATION */}
            <div className="mt-6 p-4 bg-white/[0.02] border border-white/10 text-left rounded text-xs text-gray-300 font-body">
              <span className="font-tech text-[10px] text-cyan-400 uppercase tracking-wider block mb-1">
                DELIVERING TO:
              </span>
              <p className="font-semibold text-white">{currentOrder.shippingAddress?.name}</p>
              <p className="text-gray-400">
                {currentOrder.shippingAddress?.address}, {currentOrder.shippingAddress?.city},{" "}
                {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.zip}
              </p>
              <p className="text-gray-500 mt-1">Phone: {currentOrder.shippingAddress?.phone}</p>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                to="/products"
                className="clip-btn px-8 py-3 bg-[#00E5FF] text-black font-display font-bold text-sm tracking-wide uppercase hover:bg-white transition"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="clip-btn px-8 py-3 bg-white/5 border border-white/15 text-gray-200 font-tech text-xs tracking-wider uppercase hover:text-white hover:border-cyan-400 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT VIEW
  if (items.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-black flex items-center justify-center text-center px-4">
        <div className="clip-panel bg-[#0B0F17] border border-white/10 p-12 max-w-md w-full relative">
          <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h2 className="font-display font-700 text-2xl text-white tracking-wide uppercase mb-2">
            No Items To Checkout
          </h2>
          <p className="font-body text-gray-400 text-sm mb-6">
            Your loadout is currently empty. Add gear to your cart to begin checkout.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="clip-btn w-full py-3 bg-[#00E5FF] text-black font-display font-bold text-sm tracking-wide uppercase hover:bg-white transition"
          >
            Explore Arsenal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-black grid-bg px-4 pb-20 font-body text-gray-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }

        .clip-panel {
          background: #0B0F17;
          border: 1px solid rgba(0, 229, 255, 0.18);
          clip-path: polygon(
            16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px
          );
        }
        .clip-btn {
          clip-path: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          pointer-events: none;
        }
        .corner-tl {
          top: -1px;
          left: -1px;
          border-top: 2px solid #00E5FF;
          border-left: 2px solid #00E5FF;
        }
        .corner-tr {
          top: -1px;
          right: -1px;
          border-top: 2px solid #00E5FF;
          border-right: 2px solid #00E5FF;
        }
        .corner-bl {
          bottom: -1px;
          left: -1px;
          border-bottom: 2px solid #FF3D8A;
          border-left: 2px solid #FF3D8A;
        }
        .corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 2px solid #FF3D8A;
          border-right: 2px solid #FF3D8A;
        }

        .hud-input {
          background: #05070C;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #E5E7EB;
          padding: 0.65rem 0.85rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          border-radius: 4px;
          width: 100%;
        }
        .hud-input::placeholder {
          color: #6B7280;
        }
        .hud-input:focus {
          border-color: #00E5FF;
          box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.4), 0 0 12px rgba(0, 229, 255, 0.15);
        }
        .hud-input-error {
          border-color: #FF3D8A !important;
          box-shadow: 0 0 0 1px rgba(255, 61, 138, 0.4), 0 0 12px rgba(255, 61, 138, 0.15) !important;
        }
      `}</style>

      {/* AMBIENT BACKDROP */}
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="font-tech text-xs tracking-[0.25em] text-cyan-400 uppercase">
              SECURE CHECKOUT TERMINAL
            </p>
          </div>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-white uppercase tracking-wide">
            Finalize Mission Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT: SHIPPING & ITEMS */}
          <div className="lg:col-span-2 space-y-6">

            {/* SHIPPING ADDRESS FORM */}
            <div className="clip-panel relative p-6">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-display font-700 text-xl tracking-wide text-white uppercase">
                    Delivery Address
                  </h2>
                </div>

                {hasSavedAddress && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-tech text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    <CheckCircle2 size={12} /> Auto-filled from Profile
                  </span>
                )}
              </div>

              {isCheckingAddress ? (
                <div className="py-6 text-center text-cyan-400 font-tech text-xs animate-pulse">
                  CHECKING PROFILE ADDRESS IN DATABASE…
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* FULL NAME */}
                  <div>
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        name="name"
                        value={shipping.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`hud-input ${errors.name ? "hud-input-error" : ""}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* PHONE NUMBER */}
                  <div>
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={shipping.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`hud-input ${errors.phone ? "hud-input-error" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* STREET ADDRESS */}
                  <div className="sm:col-span-2">
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      Street Address & Flat / House No. *
                    </label>
                    <input
                      name="address"
                      value={shipping.address}
                      onChange={handleChange}
                      placeholder="e.g. 42 Cyber Plaza, Neon District"
                      className={`hud-input ${errors.address ? "hud-input-error" : ""}`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.address}
                      </p>
                    )}
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      City *
                    </label>
                    <input
                      name="city"
                      value={shipping.city}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore"
                      className={`hud-input ${errors.city ? "hud-input-error" : ""}`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.city}
                      </p>
                    )}
                  </div>

                  {/* STATE */}
                  <div>
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      State / Province *
                    </label>
                    <input
                      name="state"
                      value={shipping.state}
                      onChange={handleChange}
                      placeholder="e.g. Karnataka"
                      className={`hud-input ${errors.state ? "hud-input-error" : ""}`}
                    />
                    {errors.state && (
                      <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.state}
                      </p>
                    )}
                  </div>

                  {/* PIN CODE */}
                  <div>
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      PIN / Postal Code *
                    </label>
                    <input
                      name="zip"
                      value={shipping.zip}
                      onChange={handleChange}
                      placeholder="e.g. 560001"
                      className={`hud-input ${errors.zip ? "hud-input-error" : ""}`}
                    />
                    {errors.zip && (
                      <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.zip}
                      </p>
                    )}
                  </div>

                  {/* COUNTRY */}
                  <div>
                    <label className="block font-tech text-[11px] text-gray-400 uppercase mb-1">
                      Country
                    </label>
                    <input
                      name="country"
                      value={shipping.country}
                      onChange={handleChange}
                      placeholder="India"
                      className="hud-input bg-white/[0.02]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="clip-panel relative p-6">
              <span className="corner corner-tl" />
              <span className="corner corner-br" />

              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                <CreditCard className="w-5 h-5 text-pink-500" />
                <h2 className="font-display font-700 text-xl tracking-wide text-white uppercase">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "Cash on Delivery",
                    label: "Cash on Delivery (Pay upon arrival)",
                    desc: "Pay in cash or UPI to courier agent upon equipment receipt.",
                  },
                  {
                    id: "UPI / QR Code",
                    label: "Instant UPI / QR Code",
                    desc: "Fast payment via GPay, PhonePe, Paytm, or BHIM.",
                  },
                  {
                    id: "Credit / Debit Card",
                    label: "Credit / Debit Card",
                    desc: "Visa, MasterCard, RuPay with 256-bit encryption.",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition ${
                      paymentMethod === method.id
                        ? "border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 accent-cyan-400"
                    />
                    <div>
                      <p className="font-medium text-sm text-white">{method.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* CART ITEMS REVIEW */}
            <div className="clip-panel relative p-6">
              <span className="corner corner-tl" />
              <span className="corner corner-br" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-display font-700 text-xl tracking-wide text-white uppercase">
                    Order Items ({items.length})
                  </h2>
                </div>
                {directBuyItem && (
                  <span className="text-[10px] font-tech text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded">
                    DIRECT BUY LOADOUT
                  </span>
                )}
              </div>

              <div className="divide-y divide-white/10">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4">
                    <div className="w-16 h-16 rounded border border-white/10 bg-[#05070C] flex items-center justify-center p-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{item.title}</p>
                      <p className="text-gray-400 text-xs font-tech mt-1">
                        Quantity: <span className="text-cyan-400 font-bold">{item.quantity}</span> × ₹
                        {Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-white">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: ORDER SUMMARY PANEL */}
          <div className="lg:sticky lg:top-28">
            <div className="clip-panel relative p-6">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Sparkles className="w-5 h-5 text-[#FF3D8A]" />
                <h2 className="font-display font-700 text-xl tracking-wide text-white uppercase">
                  Summary & Total
                </h2>
              </div>

              <div className="space-y-3 font-tech text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-gray-200">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Cyber Express Shipping</span>
                  <span className="text-emerald-400">FREE</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Payment Gateway Surcharge</span>
                  <span className="text-gray-200">₹0</span>
                </div>

                <div className="border-t border-dashed border-white/15 pt-4 mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-700 text-lg uppercase tracking-wide text-white">
                      Final Total
                    </span>
                    <div className="text-right">
                      <span className="font-display font-bold text-3xl text-cyan-400">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                      <p className="text-[10px] text-gray-500 font-tech">Inclusive of all GST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="
                  clip-btn
                  w-full
                  mt-6
                  py-3.5
                  font-display
                  font-bold
                  uppercase
                  tracking-wider
                  text-black
                  text-base
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  hover:brightness-110
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                style={{
                  background: "linear-gradient(120deg, #00E5FF, #FF3D8A)",
                }}
              >
                {orderLoading ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                    CONFIRMING ORDER…
                  </span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* TRUST BADGES */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-cyan-400 shrink-0" />
                  <span>Real-time Tracking & Courier Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-cyan-400 shrink-0" />
                  <span>7-Day Replacement Policy</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;