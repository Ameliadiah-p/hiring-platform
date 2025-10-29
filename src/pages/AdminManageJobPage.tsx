import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import artwork from "../assets/artwork.svg";

type JobApplication = {
  id?: number;
  jobId: number;
  name: string;
  email: string;
  phone: string;
  birth: string;
  domicile: string;
  gender: string;
  linkedin: string;
  photo?: string;
  createdAt?: string;
};

type Job = {
  id: number;
  title: string;
};

export default function AdminManageJobPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job details
    const fetchJob = async () => {
      try {
        const response = await fetch("http://localhost:3001/jobs");
        const jobs = await response.json();
        const selectedJob = jobs.find((j: Job) => j.id === parseInt(jobId || "0"));
        setJob(selectedJob || null);

        // Fetch applications for this job
        const appResponse = await fetch("http://localhost:3001/jobapplications");
        const allApps = await appResponse.json();
        const jobApps = allApps.filter(
          (app: JobApplication) => app.jobId === parseInt(jobId || "0")
        );
        setApplications(jobApps);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

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
      <div className="w-full bg-white border-b border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/admin/jobs")}
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1"
          >
            <span>Job list</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-gray-400">›</span>
          <button className="text-gray-700 font-medium">Manage Candidate</button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{job?.title || "Job"}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={artwork}
              alt="No candidates"
              className="w-48 sm:w-64 mb-6 opacity-80"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600 text-sm">
              Share your job vacancies so that more candidates will apply.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nama Lengkap
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Email Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Phone Numbers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date of Birth
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Domicile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Link LinkedIn
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-teal-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{app.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {app.birth ? new Date(app.birth).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.domicile}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.gender}</td>
                    <td className="px-4 py-3 text-sm">
                      {app.linkedin ? (
                        <a
                          href={app.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 underline truncate"
                        >
                          {app.linkedin.substring(0, 30)}...
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
