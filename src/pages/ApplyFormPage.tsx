import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { Upload, ChevronLeft } from "lucide-react";
import avatarImg from "../assets/avatar-profile.svg";
import { submitJobApplication } from "../api/applicationApi";

export default function ApplyFormPage() {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    birth: "",
    gender: "",
    domicile: "",
    phone: "",
    email: "",
    linkedin: "",
    photo: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setForm({ ...form, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackClick = () => {
    // Try to go back in history, if not possible go to jobs page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/jobs");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await submitJobApplication({
        jobId: parseInt(jobId || "0"),
        ...form,
      });

      if (response.success) {
        alert("✅ " + response.message);
        navigate("/success");
      } else {
        alert("❌ " + response.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim aplikasi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 sm:p-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={handleBackClick}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition flex-shrink-0 cursor-pointer"
              title="Back to previous page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
              Apply Front End at Rakamin
            </h2>
          </div>

          <div className="flex flex-col items-end text-sm flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-blue-500 text-xs font-medium">📋</span>
              <span className="text-gray-600 text-xs hidden sm:inline">This field required to fill</span>
            </div>
            <span className="text-red-500 font-medium text-xs">* Required</span>
          </div>
        </div>

        {/* Photo Profile */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-4 text-gray-700">
            Photo Profile
          </label>

          <div className="flex flex-col items-center">
            <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden mb-4 flex items-center justify-center bg-gray-100">
              <img
                src={photoPreview || avatarImg}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-6 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
            >
              <Upload className="w-4 h-4 text-gray-600" />
              Take a Picture
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Full name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Date of birth<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
            value={form.birth}
            onChange={(e) => setForm({ ...form, birth: e.target.value })}
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Pronoun (gender)<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                className="w-4 h-4 cursor-pointer"
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              />
              <span className="text-sm text-gray-700">She/her (Female)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                className="w-4 h-4 cursor-pointer"
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              />
              <span className="text-sm text-gray-700">He/him (Male)</span>
            </label>
          </div>
        </div>

        {/* Domicile */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Domicile<span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition appearance-none bg-white"
            value={form.domicile}
            onChange={(e) => setForm({ ...form, domicile: e.target.value })}
          >
            <option value="">Choose your domicile</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Medan">Medan</option>
            <option value="Yogyakarta">Yogyakarta</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Phone number<span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="flex items-center px-4 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
              <span className="text-sm text-gray-600">🇮🇩 +62</span>
            </div>
            <input
              type="tel"
              placeholder="812345678"
              required
              className="flex-1 border border-gray-300 rounded-r-md px-4 py-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* LinkedIn */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Link LinkedIn<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/username"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
          } text-white font-semibold py-3 rounded-md transition cursor-pointer text-base`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
