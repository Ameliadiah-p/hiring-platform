export type Job = {
  id: number;
  logo: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string[];
  status?: "active" | "inactive" | "draft";
  createdAt?: string;
};

const API_URL = "http://localhost:3001/jobs";

// ✅ Pastikan pakai export function (bukan default)
export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Gagal memuat data jobs");
  return res.json();
}

// Update job status in database
export async function updateJobStatus(
  jobId: number | string,
  status: "active" | "inactive" | "draft"
): Promise<Job> {
  const res = await fetch(`${API_URL}/${jobId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update job status");
  return res.json();
}

// Create a new job in database
export async function createJob(job: Job): Promise<Job> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}
