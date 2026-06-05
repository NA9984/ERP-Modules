import { API_BASE_URL } from "./api";

export async function getUserByUserName(
  userName: string
) {
  const response = await fetch(
    `${API_BASE_URL}/test-user/user-details-by-user-name?userName=${userName}`
  );

  const data = await response.json();

  return data;
}