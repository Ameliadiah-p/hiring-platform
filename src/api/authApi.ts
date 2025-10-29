export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export type RegisterRequest = {
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
};

const API_URL = "http://localhost:3001/users";

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(API_URL);
  const users = await res.json() as Array<{ id: number; email: string; password: string; name: string }>;

  const found = users.find(
    (u) => u.email === data.email && u.password === data.password
  );

  if (found) {
    return {
      success: true,
      message: "Login berhasil",
      token: "mock-token-" + found.id,
      user: { id: found.id, name: found.name, email: found.email },
    };
  } else {
    return { success: false, message: "Email atau password salah" };
  }
}

export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
  // Validate inputs
  if (!data.email || !data.password || !data.passwordConfirmation || !data.name) {
    return { success: false, message: "Semua field harus diisi" };
  }

  if (data.password !== data.passwordConfirmation) {
    return { success: false, message: "Password dan konfirmasi password tidak cocok" };
  }

  if (data.password.length < 6) {
    return { success: false, message: "Password minimal 6 karakter" };
  }

  try {
    // Get existing users
    const res = await fetch(API_URL);
    const users = await res.json() as Array<{ id: number; email: string; password: string; name: string }>;

    // Check if email already exists
    const emailExists = users.some((u) => u.email === data.email);
    if (emailExists) {
      return { success: false, message: "Email sudah terdaftar" };
    }

    // Create new user
    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      email: data.email,
      password: data.password,
      name: data.name,
    };

    // Post new user to json-server
    const createRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (createRes.ok) {
      return { success: true, message: "Pendaftaran berhasil. Silakan login." };
    } else {
      return { success: false, message: "Terjadi kesalahan saat mendaftar" };
    }
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Terjadi kesalahan saat mendaftar" };
  }
}
