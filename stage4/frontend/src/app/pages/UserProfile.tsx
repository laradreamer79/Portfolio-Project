import { useState } from "react";
import { User as UserIcon, Mail, Phone, Camera, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const roleLabels: Record<string, string> = {
  user: "Diver",
  instructor: "Instructor",
  diving_center: "Diving Center",
  admin: "Admin",
};

export function UserProfile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const phoneTouched = phone.length > 0;
  const phoneValid = /^\d{10}$/.test(phone);

  const nameTouched = name.trim().length > 0;
  const nameValid = /^[A-Za-zء-ي\s]*$/.test(name);

  // Letters only (Arabic/English) — blocks numbers and symbols while typing.
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-zء-ي\s]*$/.test(value)) {
      setName(value);
    }
  };

  // Digits only, capped at 10 characters — matches validation used on the booking form.
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!nameValid || name.trim().length === 0) return;
    if (!phoneValid) return;
    setSaveNotice(
      "Saving isn't wired up yet — the backend needs to add support for updating name, phone, and profile photo. Once that's ready, changes here will be saved for real.",
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-teal-600">My account</p>
        <h1 className="font-display text-4xl font-bold text-slate-900 tracking-wide mb-8">PROFILE</h1>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-teal-400" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-slate-900">{user.name}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                <Shield className="w-3 h-3" />
                {roleLabels[user.role] ?? user.role}
              </span>
            </div>
          </div>

          {saveNotice && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {saveNotice}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                className={`w-full border rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors ${nameTouched && !nameValid ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-teal-400"}`}
                value={name}
                onChange={handleNameChange}
              />
            </div>
            {nameTouched && !nameValid && (
              <p className="mt-1.5 text-xs text-red-500">Enter letters only.</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                disabled
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-500 bg-slate-50"
                value={user.email}
                readOnly
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Email can't be changed.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                className={`w-full border rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-colors ${phoneTouched && !phoneValid ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-teal-400"}`}
                placeholder="0500000000"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>
            {phoneTouched && !phoneValid && (
              <p className="mt-1.5 text-xs text-red-500">Enter a valid 10-digit phone number (numbers only).</p>
            )}
          </div>

          <button
            onClick={handleSave}
            className="bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}