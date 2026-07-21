import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Center, Trip } from "../data";
import { Plus, Star, Users, TrendingUp, CheckCircle, Clock, X, Edit3, Trash2, Eye } from "lucide-react";
import {
  createCourse,
  createTrip,
  deleteCourse,
  deleteTrip,
  getCenters,
  getCourses,
  getTrips,
  updateCenter,
  updateCourse,
  updateTrip,
} from "../features/catalog";
import { useAuth } from "../hooks/useAuth";

type BookingRow = {
  id: string;
  trip: string;
  customer: string;
  email: string;
  phone: string;
  divers: number;
  total: number;
  date: string;
  status: string;
};

type PostForm = { title: string; type: string; level: string; price: string; duration: string; depth: string; date: string; slots: string; description: string };

const EMPTY_FORM: PostForm = {
  title: "",
  type: "trip",
  level: "Open Water",
  price: "",
  duration: "Full Day",
  depth: "",
  date: "",
  slots: "",
  description: "",
};

export function CenterDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "trips" | "profile">("overview");
  const [showPostModal, setShowPostModal] = useState(false);
  const [center, setCenter] = useState<Center | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [listings, setListings] = useState<Trip[]>([]);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [postDone, setPostDone] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [editingListing, setEditingListing] = useState<Trip | null>(null);
  const [centerForm, setCenterForm] = useState({
    name: "",
    city: "",
    phone: "",
    email: "",
    address: "",
    priceRange: "",
    longDescription: "",
  });
  const [centerSaving, setCenterSaving] = useState(false);
  const [centerSaveError, setCenterSaveError] = useState<string | null>(null);
  const [centerSaveSuccess, setCenterSaveSuccess] = useState(false);

  useEffect(() => {
    if (!token || !user) return;

    let active = true;

    getCenters({ status: "all", ownerId: user.id }, token)
      .then((centers) => {
        if (!active) return;
        setCenter(centers[0] ?? null);
      })
      .catch(() => {
        if (active) setCenter(null);
      });

    Promise.all([
      getTrips({ status: "all" }, token),
      getCourses({ status: "all" }, token),
    ])
      .then(([trips, courses]) => {
        if (!active) return;
        setListings([...trips, ...courses]);
      })
      .catch(() => {
        if (active) setListings([]);
      });

    return () => {
      active = false;
    };
  }, [token, user]);

  useEffect(() => {
    if (!center) return;
    setCenterForm({
      name: center.name ?? "",
      city: center.city ?? "",
      phone: center.phone === "Not provided" ? "" : center.phone ?? "",
      email: center.email === "Not provided" ? "" : center.email ?? "",
      address: center.address ?? "",
      priceRange: center.priceRange === "Contact for pricing" ? "" : center.priceRange ?? "",
      longDescription: center.longDescription ?? "",
    });
  }, [center]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setCenterField = (k: keyof typeof centerForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setCenterForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCenterSave = async () => {
    if (!center || !token) {
      setCenterSaveError("You need to sign in again before saving.");
      return;
    }

    setCenterSaving(true);
    setCenterSaveError(null);
    setCenterSaveSuccess(false);

    try {
      const updatedCenter = await updateCenter(
        center.id,
        {
          name: centerForm.name,
          city: centerForm.city,
          address: centerForm.address,
          description: centerForm.longDescription,
          priceRange: centerForm.priceRange,
          contactEmail: centerForm.email,
          contactPhone: centerForm.phone,
        },
        token,
      );

      setCenter(updatedCenter);
      setCenterSaveSuccess(true);
    } catch (err) {
      setCenterSaveError(
        err instanceof Error
          ? err.message
          : "Unable to save changes. Please try again.",
      );
    } finally {
      setCenterSaving(false);
    }
  };

  const listingRoute = (listing: Trip) =>
    listing.type === "course" ? `/courses/${listing.id}` : `/trips/${listing.id}`;

  const durationLabel = (duration: string) => {
    if (duration.includes("4")) return "Half Day";
    if (duration.includes("3")) return "Evening";
    if (duration.includes("24")) return "Multi-Day";
    return "Full Day";
  };

  const openCreateModal = () => {
    setEditingListing(null);
    setForm(EMPTY_FORM);
    setImage(null);
    setPostDone(false);
    setPostError(null);
    setShowPostModal(true);
  };

  const openEditModal = (listing: Trip) => {
    setEditingListing(listing);
    setForm({
      title: listing.title,
      type: listing.type,
      level: listing.level,
      price: String(listing.price),
      duration: durationLabel(listing.duration),
      depth: listing.depth === "Training" || listing.depth === "Varies" ? "" : listing.depth,
      date: listing.rawDate ? listing.rawDate.slice(0, 10) : "",
      slots: listing.slots ? String(listing.slots) : "",
      description: listing.description,
    });
    setImage(null);
    setPostDone(false);
    setPostError(null);
    setShowPostModal(true);
  };

  const closePostModal = () => {
    setShowPostModal(false);
    setPostDone(false);
    setPostError(null);
    setIsPosting(false);
    setImage(null);
    setEditingListing(null);
    setForm(EMPTY_FORM);
  };

  const durationHours = (duration: string) => {
    switch (duration) {
      case "Half Day":
        return 4;
      case "Evening":
        return 3;
      case "Multi-Day":
        return 24;
      case "Full Day":
      default:
        return 8;
    }
  };

  const difficultyLevel = (level: string) => {
    if (level === "Advanced") return "advanced";
    if (level === "Intermediate") return "intermediate";
    return "beginner";
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] ?? null);
  };

  const handlePostSubmit = async () => {
    if (!form.title || !form.price) return;

    if (!editingListing && !image) {
      setPostError("Upload an image before publishing.");
      return;
    }

    if (!token) {
      setPostError("You need to sign in again before posting.");
      return;
    }

    setIsPosting(true);
    setPostError(null);

    try {
      const price = Number(form.price);
      const slots = form.slots ? Number(form.slots) : 8;
      const date = form.date || new Date().toISOString().slice(0, 10);

      if (Number.isNaN(price) || price < 0) {
        throw new Error("Enter a valid price.");
      }

      if (Number.isNaN(slots) || slots <= 0) {
        throw new Error("Enter a valid number of spots.");
      }

      if (editingListing) {
        const updatedListing =
          editingListing.type === "course"
            ? await updateCourse(
                editingListing.id,
                {
                  title: form.title,
                  description: form.description || undefined,
                  level: form.level,
                  price,
                  startDate: date,
                  image,
                },
                token,
              )
            : await updateTrip(
                editingListing.id,
                {
                  title: form.title,
                  description: form.description || undefined,
                  durationHours: durationHours(form.duration),
                  difficultyLevel: difficultyLevel(form.level),
                  pricePerPerson: price,
                  maxCapacity: slots,
                  scheduleDate: date,
                  image,
                },
                token,
              );

        setListings((current) =>
          current.map((listing) =>
            listing.id === editingListing.id && listing.type === editingListing.type
              ? updatedListing
              : listing,
          ),
        );
        closePostModal();
        setActiveTab("trips");
        return;
      }

      const createdListing =
        form.type === "course"
          ? await createCourse(
              {
                title: form.title,
                description: form.description || undefined,
                level: form.level,
                price,
                startDate: date,
                image: image!,
              },
              token,
            )
          : await createTrip(
              {
                title: form.title,
                description: form.description || undefined,
                durationHours: durationHours(form.duration),
                difficultyLevel: difficultyLevel(form.level),
                pricePerPerson: price,
                maxCapacity: slots,
                scheduleDate: date,
                image: image!,
              },
              token,
            );

      setListings((current) => [createdListing, ...current]);
      setForm(EMPTY_FORM);
      setImage(null);
      setPostDone(true);
    } catch (err) {
      setPostError(
        err instanceof Error
          ? err.message
          : "Unable to publish this listing. Please try again.",
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteListing = async (listing: Trip) => {
    if (!token) {
      setPostError("You need to sign in again before deleting.");
      return;
    }

    const confirmed = window.confirm(`Delete "${listing.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setPostError(null);

    try {
      if (listing.type === "course") {
        await deleteCourse(listing.id, token);
      } else {
        await deleteTrip(listing.id, token);
      }

      setListings((current) =>
        current.filter((item) => item.id !== listing.id || item.type !== listing.type),
      );
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to delete this listing. Please try again.",
      );
    }
  };

  const revenue = bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.total, 0);
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-1">Center Portal</p>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-wide">{center?.name ?? "Diving Center Dashboard"}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{center ? `${center.city} · Since ${center.since}` : "Connect your center profile to manage listings"}</p>
          </div>
          <button onClick={openCreateModal} className="bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Post Trip / Course
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {(["overview", "bookings", "trips", "profile"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === t ? "border-teal-500 text-teal-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: "Monthly Revenue", value: `SAR ${revenue.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "teal" },
                { label: "Total Bookings", value: bookings.length, icon: <Users className="w-5 h-5" />, color: "blue" },
                { label: "Pending Requests", value: pending, icon: <Clock className="w-5 h-5" />, color: "amber" },
                { label: "Rating", value: center ? `${center.rating} / 5` : "N/A", icon: <Star className="w-5 h-5" />, color: "purple" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${
                    s.color === "teal" ? "bg-teal-50 text-teal-600" :
                    s.color === "blue" ? "bg-blue-50 text-blue-600" :
                    s.color === "amber" ? "bg-amber-50 text-amber-600" :
                    "bg-purple-50 text-purple-600"
                  }`}>
                    {s.icon}
                  </div>
                  <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent bookings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">RECENT BOOKINGS</h2>
                <button onClick={() => setActiveTab("bookings")} className="text-sm text-teal-600 hover:text-teal-800">View all →</button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Booking ID", "Trip", "Customer", "Divers", "Total", "Date", "Status", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.slice(0, 4).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-teal-600">{b.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">{b.trip}</td>
                        <td className="px-4 py-3 text-slate-600">{b.customer}</td>
                        <td className="px-4 py-3 text-slate-600">{b.divers}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">SAR {b.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-500">{b.date}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {b.status === "pending" && (
                            <button onClick={() => setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, status: "confirmed" } : x))} className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active trips */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">ACTIVE TRIPS</h2>
                <button onClick={() => setActiveTab("trips")} className="text-sm text-teal-600 hover:text-teal-800">Manage →</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.slice(0, 4).map((trip) => (
                  <div key={trip.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-3">
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm truncate">{trip.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">SAR {trip.price} · {trip.slots} spots · {trip.date}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${trip.type === "course" ? "bg-purple-50 text-purple-700" : "bg-teal-50 text-teal-700"}`}>{trip.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide mb-6">ALL BOOKINGS</h2>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Booking ID", "Trip", "Customer", "Contact", "Divers", "Total", "Date", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs text-teal-600">{b.id}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-800 max-w-[160px] truncate">{b.trip}</td>
                      <td className="px-4 py-3.5 text-slate-700">{b.customer}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{b.phone}</td>
                      <td className="px-4 py-3.5 text-slate-600">{b.divers}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">SAR {b.total.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-slate-500">{b.date}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {b.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, status: "confirmed" } : x))} className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-1 rounded-lg hover:bg-teal-100 transition-colors font-medium">Confirm</button>
                            <button onClick={() => setBookings((prev) => prev.filter((x) => x.id !== b.id))} className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors font-medium">Decline</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trips tab */}
        {activeTab === "trips" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">MY TRIPS & COURSES</h2>
              <button onClick={openCreateModal} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-1.5 text-sm">
                <Plus className="w-4 h-4" /> Add Trip / Course
              </button>
            </div>
            <div className="space-y-3">
              {listings.map((trip) => (
                <div key={trip.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-slate-900">{trip.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${trip.type === "course" ? "bg-purple-50 text-purple-700" : "bg-teal-50 text-teal-700"}`}>{trip.type}</span>
                    </div>
                    <p className="text-xs text-slate-400">SAR {trip.price} · {trip.duration} · {trip.depth} · {trip.level} · {trip.date}</p>
                    <p className="text-xs text-slate-400">{trip.slots} spots available</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => navigate(listingRoute(trip))} className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openEditModal(trip)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteListing(trip)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">CENTER PROFILE</h2>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              {centerSaveSuccess && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Profile updated successfully.
                </div>
              )}
              {centerSaveError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {centerSaveError}
                </div>
              )}
              {[
                { label: "Center Name", key: "name" as const },
                { label: "City", key: "city" as const },
                { label: "Phone", key: "phone" as const },
                { label: "Email", key: "email" as const },
                { label: "Address", key: "address" as const },
                { label: "Price Range", key: "priceRange" as const },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">{f.label}</label>
                  <input
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400 transition-colors"
                    value={centerForm[f.key]}
                    onChange={setCenterField(f.key)}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400 transition-colors resize-none"
                  value={centerForm.longDescription}
                  onChange={setCenterField("longDescription")}
                />
              </div>
              <button
                onClick={handleCenterSave}
                disabled={centerSaving || !center}
                className="bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {centerSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Post Trip Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePostModal} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-display text-xl font-bold text-slate-900 tracking-wide">
                {editingListing ? "Edit Trip / Course" : "Post Trip / Course"}
              </h3>
              <button onClick={closePostModal} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            {postDone ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-teal-500 mx-auto" />
                <h4 className="font-display text-2xl font-bold text-slate-900 tracking-wide">
                  {form.type === "course" ? "Course Posted!" : "Trip Posted!"}
                </h4>
                <p className="text-slate-400 text-sm">
                  Your {form.type === "course" ? "course" : "trip"} is live and accepting bookings.
                </p>
                <button onClick={() => { closePostModal(); setActiveTab("trips"); }} className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors">View My Listings</button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Trip Title *</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400" placeholder="e.g. Abu Madafi Reef Morning Dive" value={form.title} onChange={set("title")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Type</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400 bg-white disabled:bg-slate-50 disabled:text-slate-400" value={form.type} onChange={set("type")} disabled={Boolean(editingListing)}>
                      <option value="trip">Trip</option><option value="course">Course</option>
                    </select>
                    {editingListing && (
                      <p className="mt-1 text-xs text-slate-400">Type cannot be changed while editing.</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Level</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400 bg-white" value={form.level} onChange={set("level")}>
                      {["Beginner", "Open Water", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Price (SAR) *</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400" placeholder="e.g. 320" value={form.price} onChange={set("price")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Max Spots</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400" placeholder="e.g. 8" value={form.slots} onChange={set("slots")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Duration</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400 bg-white" value={form.duration} onChange={set("duration")}>
                      {["Half Day", "Full Day", "Evening", "Multi-Day"].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Depth Range</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400" placeholder="e.g. 10–25m" value={form.depth} onChange={set("depth")} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400" value={form.date} onChange={set("date")} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Description</label>
                  <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 resize-none" placeholder="Describe the dive site, conditions, and what participants will experience..." value={form.description} onChange={set("description")} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">
                    Image {editingListing ? "(optional)" : "*"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {image && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Selected: {image.name}
                    </p>
                  )}
                  {!image && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {editingListing
                        ? "Leave empty to keep the current image."
                        : "Required for publishing."}
                    </p>
                  )}
                </div>
                <button onClick={handlePostSubmit} disabled={!form.title || !form.price || (!editingListing && !image) || isPosting} className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {isPosting
                    ? editingListing
                      ? "Saving..."
                      : "Publishing..."
                    : editingListing
                      ? "Save Changes"
                      : form.type === "course"
                        ? "Publish Course"
                        : "Publish Trip"}
                </button>
                {postError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {postError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
