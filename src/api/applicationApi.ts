export type JobApplication = {
  id?: number;
  jobId: number;
  name: string;
  birth: string;
  gender: string;
  domicile: string;
  phone: string;
  email: string;
  linkedin: string;
  photo?: string;
  createdAt?: string;
};

export type ApplicationResponse = {
  success: boolean;
  message: string;
  data?: JobApplication;
};

const API_URL = "http://localhost:3001/jobapplications";

export async function submitJobApplication(data: JobApplication): Promise<ApplicationResponse> {
  try {
    // Validate inputs
    if (!data.name || !data.birth || !data.gender || !data.domicile || !data.phone || !data.email || !data.linkedin || !data.jobId) {
      return { success: false, message: "Semua field harus diisi" };
    }

    // Create application object
    const application: JobApplication = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    // Post to json-server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: "Aplikasi berhasil dikirim",
        data: result,
      };
    } else {
      return { success: false, message: "Gagal mengirim aplikasi" };
    }
  } catch (err) {
    console.error("Application submission error:", err);
    return { success: false, message: "Terjadi kesalahan saat mengirim aplikasi" };
  }
}
