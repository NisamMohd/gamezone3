import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  Key,
  Clock,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

function Settings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'profile' | 'address'

  // Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch current user details & saved address from server
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setFetching(true);
        const { data: serverUser } = await api.get(`/users/${user.id}`);

        setProfileData({
          name: serverUser.name || user.name || "",
          email: serverUser.email || user.email || "",
        });

        if (serverUser.address) {
          setAddressData({
            name: serverUser.address.name || serverUser.name || "",
            phone: serverUser.address.phone || "",
            address: serverUser.address.address || serverUser.address.street || "",
            city: serverUser.address.city || "",
            state: serverUser.address.state || "",
            zip: serverUser.address.zip || serverUser.address.postalCode || "",
            country: serverUser.address.country || "India",
          });
          setHasSavedAddress(true);
        } else {
          setAddressData((prev) => ({
            ...prev,
            name: serverUser.name || user.name || "",
          }));
          setHasSavedAddress(false);
        }
      } catch (err) {
        console.error("Failed to load user settings:", err);
        setProfileData({
          name: user.name || "",
          email: user.email || "",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!profileData.name.trim()) errs.name = "Name cannot be empty";
    if (!profileData.email.trim()) errs.email = "Email cannot be empty";

    if (addressData.phone && addressData.phone.trim().length < 10) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (addressData.zip && addressData.zip.trim().length < 4) {
      errs.zip = "Enter a valid postal code";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Validation Error", "Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      const updatePayload = {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        address: addressData,
      };

      const { data: updatedServerUser } = await api.patch(
        `/users/${user.id}`,
        updatePayload
      );

      // Update AuthContext & localStorage
      if (updateUser) {
        updateUser(updatedServerUser);
      }

      setHasSavedAddress(Boolean(addressData.address.trim()));
      toast.success(
        "Profile & Address Updated",
        "Your operative dossier and shipping coordinates have been saved."
      );
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error("Update Failed", err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Verified Member";

  return (
    <div className="pt-28 min-h-screen bg-black grid-bg px-4 pb-24 font-body text-gray-200">
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
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
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

      {/* AMBIENT LIGHTING */}
      <div
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00E5FF, transparent 70%)" }}
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF3D8A, transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* TOP TITLE */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="font-tech text-xs tracking-[0.25em] text-cyan-400 uppercase">
              OPERATIVE CONTROL TERMINAL
            </p>
          </div>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-white uppercase tracking-wide">
            Account & Address Settings
          </h1>
        </div>

        {fetching ? (
          <div className="clip-panel p-16 text-center">
            <p className="font-tech text-sm text-cyan-400 tracking-widest animate-pulse uppercase">
              Loading Operative Profile & Coordinates…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSaveAll} className="space-y-8">
            {/* 1. OPERATIVE PROFILE CARD */}
            <div className="clip-panel relative p-6 sm:p-8">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)] shrink-0">
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className="font-display font-700 text-2xl text-white tracking-wide">
                      {profileData.name || user?.name}
                    </h2>
                    <p className="font-tech text-xs text-gray-400">{profileData.email || user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-tech text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded">
                    <ShieldCheck size={13} className="text-cyan-400" />
                    ROLE: {user?.role ? user.role.toUpperCase() : "USER"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                    <Clock size={13} />
                    JOINED: {formattedJoinDate}
                  </span>
                </div>
              </div>

              {/* PERSONAL INFO FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-tech text-xs text-cyan-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <User size={13} /> Operative Full Name *
                  </label>
                  <input
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Your Full Name"
                    className={`hud-input ${errors.name ? "hud-input-error" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-tech text-xs text-cyan-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} /> Registered Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="operative@domain.com"
                    className={`hud-input ${errors.email ? "hud-input-error" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-pink-400 font-tech mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. SHIPPING & DELIVERY ADDRESS SECTION */}
            <div className="clip-panel relative p-6 sm:p-8">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />

              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  <h2 className="font-display font-700 text-2xl tracking-wide text-white uppercase">
                    Delivery Coordinates & Address
                  </h2>
                </div>

                {hasSavedAddress && (
                  <span className="inline-flex items-center gap-1 text-xs font-tech text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                    <CheckCircle2 size={13} /> Active Address Saved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* RECIPIENT NAME */}
                <div>
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5">
                    Recipient / Contact Name
                  </label>
                  <input
                    name="name"
                    value={addressData.name}
                    onChange={handleAddressChange}
                    placeholder="Recipient Full Name"
                    className="hud-input"
                  />
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-cyan-400" /> Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={addressData.phone}
                    onChange={handleAddressChange}
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
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5">
                    Street Address, Flat / Building / Floor
                  </label>
                  <input
                    name="address"
                    value={addressData.address}
                    onChange={handleAddressChange}
                    placeholder="e.g. #404 Matrix Tower, Neon District"
                    className="hud-input"
                  />
                </div>

                {/* CITY */}
                <div>
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5">
                    City
                  </label>
                  <input
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Bangalore"
                    className="hud-input"
                  />
                </div>

                {/* STATE */}
                <div>
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5">
                    State / Province
                  </label>
                  <input
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    placeholder="e.g. Karnataka"
                    className="hud-input"
                  />
                </div>

                {/* PIN / POSTAL CODE */}
                <div>
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5">
                    PIN / Postal Code
                  </label>
                  <input
                    name="zip"
                    value={addressData.zip}
                    onChange={handleAddressChange}
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
                  <label className="block font-tech text-xs text-gray-400 uppercase mb-1.5">
                    Country
                  </label>
                  <input
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    placeholder="India"
                    className="hud-input bg-white/[0.02]"
                  />
                </div>
              </div>
            </div>

            {/* SAVE BUTTON TERMINAL */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="font-tech text-xs text-gray-500">
                All changes are synced in real time to the server database.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="
                  clip-btn
                  px-10
                  py-3.5
                  bg-[#00E5FF]
                  text-black
                  font-display
                  font-bold
                  text-base
                  tracking-wider
                  uppercase
                  flex
                  items-center
                  gap-2
                  hover:bg-white
                  transition
                  cursor-pointer
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                    SAVING CHANGES…
                  </span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Settings;
