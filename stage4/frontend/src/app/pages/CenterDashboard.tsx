import { useNavigate } from "react-router-dom";
import { Plus, Star, Users, TrendingUp, CheckCircle, Clock, X, Edit3, Trash2, Eye, ImageUp } from "lucide-react";
import { DIVING_CITIES } from "../data";
import { listingRoute } from "../features/listing-management";
import { useCenterDashboard } from "../features/center-dashboard";
import { useAuth } from "../hooks/useAuth";
import { digitsOnly, todayInputValue } from "../lib/validation";
import { FormFieldError } from "../components/FormFieldError";

export function CenterDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const {
    activeTab,
    bookings,
    bookingsError,
    center,
    clearProfileFieldError,
    closePostModal,
    editingListing,
    form,
    handleDeleteListing,
    handleImageChange,
    handlePostSubmit,
    handleProfileImageChange,
    handleProfileSubmit,
    image,
    isPosting,
    isSavingProfile,
    listings,
    openCreateModal,
    openEditModal,
    pending,
    postDone,
    postError,
    postFieldErrors,
    profileFieldErrors,
    profileError,
    profileImage,
    profileImagePreview,
    profileSuccess,
    revenue,
    setActiveTab,
    selectTrip,
    selectedTripKey,
    ownedCenters,
    setFormField: set,
    showPostModal,
  } = useCenterDashboard({ token, userId: user?.id });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard header */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-teal-600 text-sm font-medium tracking-widest uppercase mb-1">Center Portal</p>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-wide">{center?.name ?? "Diving Center Dashboard"}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{center ? `${center.city} · Since ${center.since}` : "Connect your center profile to manage listings"}</p>
            {ownedCenters.length > 0 && (
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                Select trip
                <select
                  value={selectedTripKey}
                  onChange={(event) => {
                    const [type, id, centerId] = event.target.value.split(":");
                    if (!type || !id || !centerId) return;
                    void selectTrip(
                      Number(centerId),
                      Number(id),
                      type as "trip" | "course",
                    );
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition-colors hover:border-teal-300 focus:border-teal-400 focus:outline-none"
                >
                  <option value="" disabled>Choose a trip or course</option>
                  {listings
                    .filter((listing) =>
                      listing.centerId !== undefined &&
                      listing.centerId !== null &&
                      ownedCenters.some((item) => item.id === listing.centerId),
                    )
                    .map((listing) => (
                      <option
                        key={`${listing.type}:${listing.id}`}
                        value={`${listing.type}:${listing.id}:${listing.centerId}`}
                      >
                        {listing.title}
                      </option>
                    ))}
                </select>
              </label>
            )}
          </div>
          <button onClick={openCreateModal} className="bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Post Trip / Course
          </button>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {(["overview", "bookings", "trips", "profile"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === t ? "border-teal-500 text-teal-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

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
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">RECENT BOOKINGS</h2>
                <button onClick={() => setActiveTab("bookings")} className="text-sm text-teal-600 hover:text-teal-800">View all →</button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                <table className="min-w-[880px] w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Booking ID", "Trip", "Customer", "Divers", "Total", "Date", "Status"].map((h) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active trips */}
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
              <table className="min-w-[1000px] w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Booking ID", "Trip", "Customer", "Contact", "Divers", "Total", "Date", "Status"].map((h) => (
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
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                        {bookingsError ?? "No bookings for this center yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trips tab */}
        {activeTab === "trips" && (
          <div>
            <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">MY TRIPS & COURSES</h2>
              <button onClick={openCreateModal} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-1.5 text-sm">
                <Plus className="w-4 h-4" /> Add Trip / Course
              </button>
            </div>
            <div className="space-y-3">
              {listings.map((trip) => (
                <div key={trip.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-0.5 flex flex-wrap items-center gap-2">
                      <h3 className="break-words font-semibold text-slate-900">{trip.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${trip.type === "course" ? "bg-purple-50 text-purple-700" : "bg-teal-50 text-teal-700"}`}>{trip.type}</span>
                    </div>
                    <p className="text-xs text-slate-400">SAR {trip.price} · {trip.duration} · {trip.depth} · {trip.level} · {trip.date}</p>
                    <p className="text-xs text-slate-400">{trip.slots} spots available</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2 self-end sm:self-auto">
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
            <form key={center?.id ?? "empty"} onSubmit={handleProfileSubmit} noValidate className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              {profileError && (
                <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>
              )}
              {profileSuccess && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileSuccess}</div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Center Image</label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-48">
                    {profileImagePreview || center?.img ? (
                      <img src={profileImagePreview || center?.img} alt={center?.name ?? "Center preview"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                        <ImageUp className="h-7 w-7" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      key={center?.img || "no-center-image"}
                      id="center-profile-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProfileImageChange}
                      aria-invalid={Boolean(profileFieldErrors.image)}
                      aria-describedby={profileFieldErrors.image ? "center-image-error" : undefined}
                      className="sr-only"
                    />
                    <label htmlFor="center-profile-image" className="inline-flex cursor-pointer rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100">
                      Choose Image
                    </label>
                    <p className="text-xs text-slate-400">JPEG, PNG, or WEBP. Maximum size 5 MB.</p>
                    {profileImage && (
                      <p className="text-xs font-medium text-slate-600">Selected: {profileImage.name}</p>
                    )}
                  </div>
                </div>
                <FormFieldError id="center-image-error" message={profileFieldErrors.image} />
              </div>
              <div className="border-t border-slate-100" />
              {([
                { key: "name", label: "Center Name", type: "text", value: center?.name ?? "" },
                { key: "city", label: "City", type: "text", value: center?.city ?? "" },
                { key: "contactPhone", label: "Phone", type: "tel", value: center?.phone === "Not provided" ? "" : center?.phone ?? "" },
                { key: "contactEmail", label: "Email", type: "email", value: center?.email === "Not provided" ? "" : center?.email ?? "" },
                { key: "address", label: "Address", type: "text", value: center?.address === center?.city ? "" : center?.address ?? "" },
                { key: "priceRange", label: "Price Range", type: "text", value: center?.priceRange === "Contact for pricing" ? "" : center?.priceRange ?? "" },
              ] as const).map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">{field.label}</label>
                  {field.key === "city" ? (
                    <select
                      name={field.key}
                      required
                      onChange={() => clearProfileFieldError(field.key)}
                      aria-invalid={Boolean(profileFieldErrors[field.key])}
                      aria-describedby={profileFieldErrors[field.key] ? `center-${field.key}-error` : undefined}
                      className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400 transition-colors"
                      defaultValue={field.value}
                    >
                      <option value="">Choose a city</option>
                      {DIVING_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      inputMode={field.key === "contactPhone" ? "numeric" : undefined}
                      maxLength={field.key === "contactPhone" ? 10 : undefined}
                      name={field.key}
                      required={field.key === "name"}
                      onChange={(event) => {
                        if (field.key === "contactPhone") {
                          event.target.value = digitsOnly(
                            event.target.value,
                            10,
                          );
                        }
                        clearProfileFieldError(field.key);
                      }}
                      aria-invalid={Boolean(profileFieldErrors[field.key])}
                      aria-describedby={profileFieldErrors[field.key] ? `center-${field.key}-error` : undefined}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400 transition-colors"
                      defaultValue={field.value}
                    />
                  )}
                  {profileFieldErrors[field.key] && (
                    <p id={`center-${field.key}-error`} className="mt-1.5 text-xs text-red-600">
                      {profileFieldErrors[field.key]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea name="description" rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400 transition-colors resize-none" defaultValue={center?.description === "Explore diving experiences from this center." ? "" : center?.description ?? ""} />
              </div>
              <button type="submit" disabled={isSavingProfile} className="bg-teal-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors text-sm disabled:cursor-not-allowed disabled:opacity-40">
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
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
                {postError && (
                  <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {postError}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Trip Title *</label>
                  <input aria-invalid={Boolean(postFieldErrors.title)} aria-describedby={postFieldErrors.title ? "listing-title-error" : undefined} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400" placeholder="e.g. Abu Madafi Reef Morning Dive" value={form.title} onChange={set("title")} />
                  <FormFieldError id="listing-title-error" message={postFieldErrors.title} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <input type="text" inputMode="decimal" aria-invalid={Boolean(postFieldErrors.price)} aria-describedby={postFieldErrors.price ? "listing-price-error" : undefined} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400" placeholder="e.g. 320" value={form.price} onChange={set("price")} />
                    <FormFieldError id="listing-price-error" message={postFieldErrors.price} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1.5">Max Spots {form.type === "trip" ? "*" : "(trips only)"}</label>
                    <input type="text" inputMode="numeric" disabled={form.type === "course"} aria-invalid={Boolean(postFieldErrors.slots)} aria-describedby={postFieldErrors.slots ? "listing-slots-error" : undefined} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 disabled:bg-slate-50 disabled:text-slate-400" placeholder="e.g. 8" value={form.slots} onChange={set("slots")} />
                    <FormFieldError id="listing-slots-error" message={postFieldErrors.slots} />
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
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Date *</label>
                  <input type="date" min={todayInputValue()} aria-invalid={Boolean(postFieldErrors.date)} aria-describedby={postFieldErrors.date ? "listing-date-error" : undefined} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-400" value={form.date} onChange={set("date")} />
                  <FormFieldError id="listing-date-error" message={postFieldErrors.date} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">Description *</label>
                  <textarea rows={3} aria-invalid={Boolean(postFieldErrors.description)} aria-describedby={postFieldErrors.description ? "listing-description-error" : undefined} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 resize-none" placeholder="Describe the dive site, conditions, and what participants will experience..." value={form.description} onChange={set("description")} />
                  <FormFieldError id="listing-description-error" message={postFieldErrors.description} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1.5">
                    Image {editingListing ? "(optional)" : "*"}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    aria-invalid={Boolean(postFieldErrors.image)}
                    aria-describedby={postFieldErrors.image ? "listing-image-error" : undefined}
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
                  <FormFieldError id="listing-image-error" message={postFieldErrors.image} />
                </div>
                <button onClick={handlePostSubmit} disabled={isPosting} className="w-full bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
