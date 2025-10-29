import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, Plus, ChevronDown } from "lucide-react";
import avatarImg from "../assets/avatar.svg";
import emptyStateImg from "../assets/empty-state.svg";
import { fetchJobs, updateJobStatus } from "../api/jobApi";
import type { Job } from "../api/jobApi";
import JobOpeningModal from "../components/JobOpeningModal";

type JobWithStatus = Job & {
  status: "active" | "inactive" | "draft";
  createdAt?: string;
};

export default function AdminJobListPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | number | null>(null);

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

    // Load jobs
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        // Preserve status from database or default to active
        const jobsWithStatus = data.map((job: Job) => ({
          ...job,
          status: (job.status || "active") as "active" | "inactive" | "draft",
          createdAt: job.createdAt || new Date().toISOString().split("T")[0],
        }));
        setJobs(jobsWithStatus);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleJobCreated = (newJob: JobWithStatus) => {
    setJobs([...jobs, newJob]);
    setShowModal(false);
    setSuccessMessage("Job vacancy successfully created");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleStatusChange = async (jobId: string | number, newStatus: "active" | "inactive") => {
    try {
      // Update in database
      await updateJobStatus(jobId, newStatus);

      // Update in state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      setSelectedJobId(null);
      setSuccessMessage("Job status updated");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update job status:", err);
      setSuccessMessage("Failed to update job status");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full h-14 border-b border-gray-200 bg-white flex justify-between items-center px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-700">Job List</h1>

        {/* Avatar with Logout Menu */}
        <div className="relative">
          <button
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-teal-400 transition cursor-pointer"
            title={user?.name || "Admin"}
          >
            <img src={avatarImg} alt="Admin Avatar" className="w-full h-full object-cover" />
          </button>

          {/* Logout Menu Dropdown */}
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              </div>
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

          {showLogoutMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowLogoutMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6">
        {/* Search and Create Button Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="w-full lg:flex-1 relative">
            <input
              type="text"
              placeholder="Search by job details"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
          </div>

          {/* Create Job Card */}
          <div className="hidden lg:block w-80 bg-black text-white rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Recruit the best candidates</h3>
            <p className="text-sm text-gray-300 mb-4">
              Create jobs, invite, and hire with ease
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition"
            >
              Create a new job
            </button>
          </div>
        </div>

        {/* Mobile Create Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Create a new job
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-2">
            <span className="text-teal-600 font-semibold">✓</span>
            <span className="text-teal-700">{successMessage}</span>
          </div>
        )}

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={emptyStateImg}
              alt="No jobs"
              className="w-48 sm:w-64 mb-6 opacity-80"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No job openings available
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Create a job opening now and start the candidate process.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Create a new job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition relative"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <button
                        onClick={() => job.status !== "draft" && setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                        disabled={job.status === "draft"}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          job.status === "draft"
                            ? "cursor-not-allowed opacity-60"
                            : "hover:opacity-80 cursor-pointer"
                        }`}
                        style={{
                          backgroundColor:
                            job.status === "active"
                              ? "#dcfce7"
                              : job.status === "inactive"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            job.status === "active"
                              ? "#166534"
                              : job.status === "inactive"
                              ? "#991b1b"
                              : "#92400e",
                        }}
                        title={job.status === "draft" ? "Cannot change draft status" : "Click to change status"}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        {job.status !== "draft" && (
                          <ChevronDown className={`w-3 h-3 transition-transform ${selectedJobId === job.id ? "rotate-180" : ""}`} />
                        )}
                      </button>
                      <span className="text-xs text-gray-500">
                        started on {job.createdAt || new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600">
                      {job.salary || "Rp7.000.000 - Rp8.000.000"}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/manage-job/${job.id}`)}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition"
                  >
                    Manage Job
                  </button>
                </div>

                {/* Status Toggle Dropdown */}
                {selectedJobId === job.id && job.status !== "draft" && (
                  <div className="absolute left-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 z-30 min-w-max">
                    <button
                      onClick={() => {
                        handleStatusChange(job.id, "active");
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition ${
                        job.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Active
                    </button>
                    <div className="border-t border-gray-200" />
                    <button
                      onClick={() => {
                        handleStatusChange(job.id, "inactive");
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition ${
                        job.status === "inactive"
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                )}

                {selectedJobId === job.id && job.status !== "draft" && (
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setSelectedJobId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Opening Modal */}
      {showModal && (
        <JobOpeningModal
          onClose={() => setShowModal(false)}
          onJobCreated={handleJobCreated}
        />
      )}
    </div>
  );
}
