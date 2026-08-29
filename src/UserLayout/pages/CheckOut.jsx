import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MapPin, CreditCard } from 'lucide-react'

function CheckOut() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  })

  const handleChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 0 ? 49 : 0
  const total = subtotal + shippingFee

  const handlePlaceOrder = () => {
    // dispatch(placeOrder({ items, shipping, total }))
    console.log('Placing order:', { items, shipping, total })
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-[#05070C] text-gray-500 font-inter">
        Your cart is empty.
      </div>
    )
  }

  return (
    <div className="pt-32 min-h-screen bg-[#05070C] grid-bg px-4 pb-16 font-inter text-gray-200">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: shipping + items */}
        <div className="lg:col-span-2 space-y-6">

          {/* Shipping form */}
          <div className="clip-panel relative p-6">
            <span className="corner corner-tl" />
            <span className="corner corner-br" />
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#00E5FF]" />
              <h2 className="font-rajdhani text-lg font-semibold tracking-wide text-white uppercase">
                Shipping Details
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                value={shipping.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="hud-input"
              />
              <input
                name="phone"
                value={shipping.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="hud-input"
              />
              <input
                name="address"
                value={shipping.address}
                onChange={handleChange}
                placeholder="Address"
                className="hud-input sm:col-span-2"
              />
              <input
                name="city"
                value={shipping.city}
                onChange={handleChange}
                placeholder="City"
                className="hud-input"
              />
              <input
                name="zip"
                value={shipping.zip}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="hud-input"
              />
            </div>
          </div>

          {/* Cart items */}
          <div className="clip-panel relative p-6">
            <span className="corner corner-tl" />
            <span className="corner corner-br" />
            <h2 className="font-rajdhani text-lg font-semibold tracking-wide text-white uppercase mb-4">
              Order Items <span className="font-mono text-[#00E5FF] text-base">({items.length})</span>
            </h2>
            <div className="divide-y divide-white/10">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-md border border-white/10 bg-[#0B0F17] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1 text-gray-100">{item.title}</p>
                    <p className="text-gray-500 text-xs font-mono mt-1">QTY: {item.quantity}</p>
                  </div>
                  <p className="font-rajdhani font-semibold text-lg text-[#00E5FF]">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <div className="clip-panel relative p-6 h-fit sticky top-24">
          <span className="corner corner-tl" />
          <span className="corner corner-br" />
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-[#FF3D8A]" />
            <h2 className="font-rajdhani text-lg font-semibold tracking-wide text-white uppercase">
              Order Summary
            </h2>
          </div>

          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-200">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-200">₹{shippingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
              <span className="font-rajdhani text-base uppercase tracking-wide text-gray-300">Total</span>
              <span className="font-rajdhani font-bold text-2xl text-[#00E5FF]">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="clip-btn w-full mt-6 py-3 font-rajdhani font-semibold uppercase tracking-widest text-sm"
          >
            Place Order
          </button>
        </div>
      </div>

      <style>{`
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .clip-panel {
          background: #0B0F17;
          border: 1px solid rgba(0, 229, 255, 0.15);
          clip-path: polygon(
            16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px
          );
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
        .corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 2px solid #FF3D8A;
          border-right: 2px solid #FF3D8A;
        }

        .hud-input {
          background: #05070C;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E5E7EB;
          padding: 0.6rem 0.75rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
        }
        .hud-input::placeholder {
          color: #6B7280;
        }
        .hud-input:focus {
          border-color: #00E5FF;
          box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.4), 0 0 12px rgba(0, 229, 255, 0.15);
        }

        .clip-btn {
          background: linear-gradient(90deg, #00E5FF, #00B8CC);
          color: #05070C;
          border: none;
          cursor: pointer;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: filter 0.2s, box-shadow 0.2s;
        }
        .clip-btn:hover {
          filter: brightness(1.1);
          box-shadow: 0 0 18px rgba(0, 229, 255, 0.4);
        }
      `}</style>
    </div>
  )
}

export default CheckOut