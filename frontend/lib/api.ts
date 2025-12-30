import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});


const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// --- Auth ---
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

// --- Listings ---
export async function getListings() {
  const res = await fetch(`${API_URL}/listings`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Fetch listings failed");
  }

  return res.json();
}

// --- Profile ---
export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

/**
 * اضافه کردن توکن به تمام درخواست‌ها
 */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

/* ===================== LISTINGS ===================== */

/**
 * گرفتن جزئیات یک آگهی
 * GET /api/listings/{id}
 */
export async function getListing(id: number | string) {
  const res = await api.get(`/listings/${id}`);
  return res.data;
}

/**
 * ویرایش آگهی
 * PUT /api/listings/{id}
 */
export async function updateListing(
  id: number | string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    status?: string;
    category_id?: number;
  }
) {
  const res = await api.put(`/listings/${id}`, data);
  return res.data;
}

/* ===================== LOANS ===================== */

// گرفتن درخواست‌های کاربر
export async function getMyLoans() {
  const res = await api.get("/my-loans");
  return res.data;
}

// تأیید درخواست
export async function approveLoan(loanId: number | string) {
  const res = await api.post(`/loans/${loanId}/approve`);
  return res.data;
}

// رد درخواست
export async function rejectLoan(loanId: number | string) {
  const res = await api.post(`/loans/${loanId}/reject`);
  return res.data;
}
