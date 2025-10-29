import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import JobCard from "../components/JobCard";
import JobDetail from "../components/JobDetail";
import { fetchJobs } from "../api/jobApi";
import type { Job } from "../api/jobApi";
import avatarImg from "../assets/avatar.svg"

export default function JobListPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        console.error("Failed to parse user data");
      }
    }

    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        if (data.length > 0) setSelectedJob(data[0].id);
      } catch {
        setError("Gagal memuat data lowongan 😢");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full h-14 border-b border-gray-200 bg-white flex justify-between items-center px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-700"></h1>

        {/* Avatar with Logout Menu */}
        <div className="relative">
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-teal-400 transition cursor-pointer"
            title={user?.name || "User"}
          >
            <img src={avatarImg} alt="User Avatar" className="w-full h-full object-cover" />
          </button>

          {/* Logout Menu Dropdown */}
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setShowLogoutMenu(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 transition text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}

          {/* Click outside to close menu */}
          {showLogoutMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowLogoutMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Content */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486749.png"
            alt="no jobs"
            className="w-32 sm:w-48 mb-6"
          />
          <h2 className="text-gray-700 font-semibold text-base sm:text-lg">
            No job openings available
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please wait for the next batch of openings.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden">
          {/* Sidebar List - Hidden on mobile when job is selected */}
          <div className={`${selectedJob ? "hidden lg:block" : "block"} w-full lg:w-1/3 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto shadow-sm`}>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isActive={selectedJob === job.id}
                onClick={() => setSelectedJob(job.id)}
              />
            ))}
          </div>

          {/* Job Detail - Shows on mobile when selected, always visible on desktop */}
          <div className={`${selectedJob ? "block" : "hidden lg:block"} w-full lg:flex-1`}>
            {selectedJob && (
              <div className="relative">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="lg:hidden mb-4 text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2"
                >
                  ← Back to Jobs
                </button>
                <JobDetail {...jobs.find((j) => j.id === selectedJob)!} />
              </div>
            )}
            {!selectedJob && (
              <div className="hidden lg:flex h-full items-center justify-center text-gray-400">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
