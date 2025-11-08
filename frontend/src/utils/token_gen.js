const API_URL = import.meta.env.VITE_API_BASE_URL;

async function generateToken() {
  try {
    const refresh_token = localStorage.getItem("userToken");
    const get_token = await fetch(`${API_URL}/api/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh_token }),
    });
    if (get_token.ok) {
      const data = await get_token.json();
      console.log("New access token generated:", data);
      localStorage.setItem("access_token", data.access);
      if (data?.refresh) {
        localStorage.setItem("userToken", data.refresh);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error generating token:", error);
    return false;
  }
}

export default generateToken;
