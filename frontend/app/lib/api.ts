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
