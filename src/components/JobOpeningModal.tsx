import { useState } from "react";
import { X } from "lucide-react";
import { createJob } from "../api/jobApi";
import type { Job } from "../api/jobApi";

type JobWithStatus = Job & {
  status: "active" | "inactive" | "draft";
  createdAt?: string;
};

type ProfileRequirement = "mandatory" | "optional" | "off";

type ProfileRequirements = {
  fullName: ProfileRequirement;
  photoProfile: ProfileRequirement;
  gender: ProfileRequirement;
  domicile: ProfileRequirement;
  email: ProfileRequirement;
  phone: ProfileRequirement;
  linkedin: ProfileRequirement;
  dateOfBirth: ProfileRequirement;
};

type JobOpeningModalProps = {
  onClose: () => void;
  onJobCreated: (job: JobWithStatus) => void;
};

export default function JobOpeningModal({
  onClose,
  onJobCreated,
}: JobOpeningModalProps) {
  const [formData, setFormData] = useState({
    jobName: "",
    jobType: "Full-time",
    jobDescription: "",
    numCandidates: 1,
    minSalary: "",
    maxSalary: "",
  });

  const [profileRequirements, setProfileRequirements] =
    useState<ProfileRequirements>({
      fullName: "mandatory",
      photoProfile: "mandatory",
      gender: "mandatory",
      domicile: "optional",
      email: "mandatory",
      phone: "mandatory",
      linkedin: "mandatory",
      dateOfBirth: "off",
    });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileRequirementChange = (
    field: keyof ProfileRequirements,
    value: ProfileRequirement
  ) => {
    setProfileRequirements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createJobObject = (): JobWithStatus => {
    // Determine status based on whether all required fields are filled
    const hasMinSalary = formData.minSalary.trim() !== "";
    const hasMaxSalary = formData.maxSalary.trim() !== "";
    const status =
      hasMinSalary && hasMaxSalary && formData.numCandidates > 0
        ? ("active" as const)
        : ("draft" as const);

    return {
      title: formData.jobName,
      type: formData.jobType,
      description: formData.jobDescription
        .split("\n")
        .filter((line) => line.trim()),
      salary: formData.minSalary && formData.maxSalary
        ? `Rp${parseInt(formData.minSalary).toLocaleString("id-ID")} - Rp${parseInt(formData.maxSalary).toLocaleString("id-ID")}`
        : "",
      company: "Rakamin",
      location: "Jakarta",
      logo: "/src/assets/rakamin-logo.png",
      status,
      createdAt: new Date().toISOString().split("T")[0],
    } as JobWithStatus;
  };

  const handlePublishJob = async () => {
    // Validate required fields
    if (!formData.jobName.trim()) {
      alert("Job Name is required");
      return;
    }
    if (!formData.jobDescription.trim()) {
      alert("Job Description is required");
      return;
    }

    try {
      const newJob = createJobObject();
      // Save to database
      const savedJob = await createJob(newJob);
      onJobCreated(savedJob as JobWithStatus);
    } catch (err) {
      console.error("Failed to publish job:", err);
      alert("Failed to publish job. Please try again.");
    }
  };

  const handleSaveAsDraft = async () => {
    // Validate at least job name
    if (!formData.jobName.trim()) {
      alert("Job Name is required");
      return;
    }

    try {
      const newJob = createJobObject();
      // Force status to draft
      newJob.status = "draft";
      // Save to database
      const savedJob = await createJob(newJob);
      onJobCreated(savedJob as JobWithStatus);
    } catch (err) {
      console.error("Failed to save draft:", err);
      alert("Failed to save draft. Please try again.");
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-4 pb-4 px-4 sm:pt-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl relative mt-4">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Job Opening</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Job Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Job Name*
              </label>
              <input
                type="text"
                name="jobName"
                value={formData.jobName}
                onChange={handleInputChange}
                placeholder="Front End Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Job Type*
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Job Description*
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="• Develop, test, and maintain responsive, high-performance web applications.&#10;• Collaborate with UI/UX designers to translate wireframes into code."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Number of Candidates */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Number of Candidate Needed*
              </label>
              <input
                type="number"
                name="numCandidates"
                value={formData.numCandidates}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Job Salary
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Minimum Estimated Salary
                  </label>
                  <input
                    type="text"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleInputChange}
                    placeholder="Rp 7.000.000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Maximum Estimated Salary
                  </label>
                  <input
                    type="text"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleInputChange}
                    placeholder="Rp 8.000.000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Minimum Profile Information Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                Minimum Profile Information Required
              </label>

              <div className="space-y-3">
                {[
                  { key: "fullName", label: "Full name" },
                  { key: "photoProfile", label: "Photo Profile" },
                  { key: "gender", label: "Gender" },
                  { key: "domicile", label: "Domicile" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone number" },
                  { key: "linkedin", label: "Linkedin link" },
                  { key: "dateOfBirth", label: "Date of birth" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">{label}</label>
                    <div className="flex gap-2">
                      {["mandatory", "optional", "off"].map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            handleProfileRequirementChange(
                              key as keyof ProfileRequirements,
                              option as ProfileRequirement
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            profileRequirements[key as keyof ProfileRequirements] ===
                            option
                              ? option === "mandatory"
                                ? "bg-teal-100 text-teal-700 border-2 border-teal-600"
                                : option === "optional"
                                ? "bg-teal-100 text-teal-700 border-2 border-teal-600"
                                : "bg-gray-200 text-gray-700 border-2 border-gray-600"
                              : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAsDraft}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Save as Draft
            </button>
            <button
              onClick={handlePublishJob}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition font-semibold"
            >
              Publish Job
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
