import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Plus,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { TRIPS } from "../data";

const MY_LISTINGS = TRIPS.slice(0, 4);

const BOOKINGS = [
  {
    id: "OYS-I1A8X2",
    trip: "PADI Open Water Course",
    customer: "Khalid bin Faisal",
    email: "khalid.f@email.com",
    phone: "+966 56 777 8899",
    divers: 1,
    total: 1800,
    date: "Jul 20, 2026",
    status: "confirmed",
  },
  {
    id: "OYS-I2B3Y9",
    trip: "Abu Madafi Reef Day Trip",
    customer: "Nora Al-Qahtani",
    email: "nora.q@email.com",
    phone: "+966 54 222 3344",
    divers: 3,
    total: 960,
    date: "Jul 22, 2026",
    status: "pending",
  },
  {
    id: "OYS-I3C7Z0",
    trip: "Advanced Open Water",
    customer: "Sarah Thompson",
    email: "sarah.t@email.com",
    phone: "+966 55 444 5566",
    divers: 2,
    total: 2400,
    date: "Jul 28, 2026",
    status: "confirmed",
  },
];

type PostForm = {
  title: string;
  type: string;
  level: string;
  price: string;
  duration: string;
  depth: string;
  date: string;
  slots: string;
  description: string;
};

export function InstructorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "listings" | "profile"
  >("overview");
  const [showPostModal, setShowPostModal] = useState(false);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [postDone, setPostDone] = useState(false);
  const [form, setForm] = useState<PostForm>({
    title: "",
    type: "trip",
    level: "Open Water",
    price: "",
    duration: "Full Day",
    depth: "",
    date: "",
    slots: "",
    description: "",
  });

  const set =
    (key: keyof PostForm) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const closePostModal = () => {
    setShowPostModal(false);
    setPostDone(false);
  };

  const revenue = bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((sum, booking) => sum + booking.total, 0);
  const pending = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-teal-600">
              Instructor Portal
            </p>
            <h1 className="font-display text-3xl font-bold tracking-wide text-slate-900">
              My Instructor Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Manage your independent trips, courses, bookings, and students.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" /> Add Trip / Course
          </button>
        </div>

        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          {(["overview", "bookings", "listings", "profile"] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {[
                {
                  label: "Monthly Revenue",
                  value: `SAR ${revenue.toLocaleString()}`,
                  icon: <TrendingUp className="h-5 w-5" />,
                  color: "teal",
                },
                {
                  label: "Total Bookings",
                  value: bookings.length,
                  icon: <Users className="h-5 w-5" />,
                  color: "blue",
                },
                {
                  label: "Pending Requests",
                  value: pending,
                  icon: <Clock className="h-5 w-5" />,
                  color: "amber",
                },
                {
                  label: "Rating",
                  value: "4.9 / 5",
                  icon: <Star className="h-5 w-5" />,
                  color: "purple",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                      stat.color === "teal"
                        ? "bg-teal-50 text-teal-600"
                        : stat.color === "blue"
                          ? "bg-blue-50 text-blue-600"
                          : stat.color === "amber"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {stat.icon}
                  </div>
                  <p className="font-display text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                  RECENT BOOKINGS
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className="text-sm text-teal-600 hover:text-teal-800"
                >
                  View all →
                </button>
              </div>
              <BookingsTable
                bookings={bookings.slice(0, 4)}
                onConfirm={(id) =>
                  setBookings((current) =>
                    current.map((booking) =>
                      booking.id === id
                        ? { ...booking, status: "confirmed" }
                        : booking,
                    ),
                  )
                }
              />
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                  MY ACTIVE TRIPS & COURSES
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("listings")}
                  className="text-sm text-teal-600 hover:text-teal-800"
                >
                  Manage →
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MY_LISTINGS.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4"
                  >
                    <div className="h-14 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={trip.img}
                        alt={trip.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-slate-900">
                        {trip.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-400">
                        SAR {trip.price} · {trip.slots} spots · {trip.date}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                          trip.type === "course"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {trip.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-wide text-slate-900">
              ALL BOOKINGS
            </h2>
            <BookingsTable
              bookings={bookings}
              onConfirm={(id) =>
                setBookings((current) =>
                  current.map((booking) =>
                    booking.id === id
                      ? { ...booking, status: "confirmed" }
                      : booking,
                  ),
                )
              }
              onDecline={(id) =>
                setBookings((current) =>
                  current.filter((booking) => booking.id !== id),
                )
              }
            />
          </div>
        )}

        {activeTab === "listings" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                MY TRIPS & COURSES
              </h2>
              <button
                type="button"
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
              >
                <Plus className="h-4 w-4" /> Add Trip / Course
              </button>
            </div>
            <div className="space-y-3">
              {MY_LISTINGS.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4"
                >
                  <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={trip.img}
                      alt={trip.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {trip.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          trip.type === "course"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {trip.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      SAR {trip.price} · {trip.duration} · {trip.depth} ·{" "}
                      {trip.level} · {trip.date}
                    </p>
                    <p className="text-xs text-slate-400">
                      {trip.slots} spots available
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          trip.type === "course"
                            ? `/courses/${trip.id}`
                            : `/trips/${trip.id}`,
                        )
                      }
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">
              INSTRUCTOR PROFILE
            </h2>
            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6">
              {[
                { label: "Display Name", value: "Independent Instructor" },
                { label: "License Number", value: "PADI-OWSI-2026" },
                { label: "Specialty", value: "Open Water, Advanced, Rescue" },
                { label: "City", value: "Jeddah" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {field.label}
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-teal-400 focus:outline-none"
                    defaultValue={field.value}
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-colors focus:border-teal-400 focus:outline-none"
                  defaultValue="Certified independent instructor offering trips and courses directly to divers."
                />
              </div>
              <button
                type="button"
                className="rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePostModal}
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-6 py-4">
              <h3 className="font-display text-xl font-bold tracking-wide text-slate-900">
                Add Instructor Trip / Course
              </h3>
              <button
                type="button"
                onClick={closePostModal}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {postDone ? (
              <div className="space-y-4 p-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-teal-500" />
                <h4 className="font-display text-2xl font-bold tracking-wide text-slate-900">
                  {form.type === "course" ? "Course Posted!" : "Trip Posted!"}
                </h4>
                <p className="text-sm text-slate-400">
                  Your instructor-owned{" "}
                  {form.type === "course" ? "course" : "trip"} is ready for
                  review and bookings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowPostModal(false);
                    setPostDone(false);
                    setActiveTab("listings");
                  }}
                  className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition-colors hover:bg-teal-600"
                >
                  View My Listings
                </button>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Trip / Course Title *
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                    placeholder="e.g. Private Open Water Course"
                    value={form.title}
                    onChange={set("title")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Type
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none"
                      value={form.type}
                      onChange={set("type")}
                    >
                      <option value="trip">Trip</option>
                      <option value="course">Course</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Level
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none"
                      value={form.level}
                      onChange={set("level")}
                    >
                      {["Beginner", "Open Water", "Intermediate", "Advanced"].map(
                        (level) => (
                          <option key={level}>{level}</option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Price (SAR) *
                    </label>
                    <input
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                      placeholder="e.g. 450"
                      value={form.price}
                      onChange={set("price")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Max Spots
                    </label>
                    <input
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                      placeholder="e.g. 4"
                      value={form.slots}
                      onChange={set("slots")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Duration
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-400 focus:outline-none"
                      value={form.duration}
                      onChange={set("duration")}
                    >
                      {["Half Day", "Full Day", "Evening", "Multi-Day"].map(
                        (duration) => (
                          <option key={duration}>{duration}</option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Depth Range
                    </label>
                    <input
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                      placeholder="e.g. 10–25m"
                      value={form.depth}
                      onChange={set("depth")}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-teal-400 focus:outline-none"
                    value={form.date}
                    onChange={set("date")}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                    placeholder="Describe your teaching style, dive site, requirements, and what participants will experience..."
                    value={form.description}
                    onChange={set("description")}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => form.title && form.price && setPostDone(true)}
                  disabled={!form.title || !form.price}
                  className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {form.type === "course" ? "Publish Course" : "Publish Trip"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type BookingRow = (typeof BOOKINGS)[number];

function BookingsTable({
  bookings,
  onConfirm,
  onDecline,
}: {
  bookings: BookingRow[];
  onConfirm: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50">
          <tr>
            {[
              "Booking ID",
              "Trip / Course",
              "Customer",
              "Divers",
              "Total",
              "Date",
              "Status",
              "Action",
            ].map((heading) => (
              <th
                key={heading}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {bookings.map((booking) => (
            <tr key={booking.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs text-teal-600">
                {booking.id}
              </td>
              <td className="max-w-[180px] truncate px-4 py-3 font-medium text-slate-800">
                {booking.trip}
              </td>
              <td className="px-4 py-3 text-slate-600">{booking.customer}</td>
              <td className="px-4 py-3 text-slate-600">{booking.divers}</td>
              <td className="px-4 py-3 font-semibold text-slate-800">
                SAR {booking.total.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-500">{booking.date}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    booking.status === "confirmed"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-amber-100 bg-amber-50 text-amber-700"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {booking.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onConfirm(booking.id)}
                      className="flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Confirm
                    </button>
                    {onDecline && (
                      <button
                        type="button"
                        onClick={() => onDecline(booking.id)}
                        className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
