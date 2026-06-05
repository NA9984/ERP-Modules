import { API_BASE_URL } from "./api";
import { API_BASE_URL1 } from "./api";
export async function loginUser(
  userNameOrEmailAddress: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL1}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userNameOrEmailAddress,
        password,
        rememberMe: true,
      }),
    }
  );

  const data = await response.json();

  return data;
}