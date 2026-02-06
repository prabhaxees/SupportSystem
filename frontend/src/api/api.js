const API_URL = "http://localhost:5000";

export async function apiRequest(endpoint, method = "GET", body, token) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : undefined
  });

  return res.json();
}
