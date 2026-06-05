import { API_BASE_URL } from "./api";

export async function getActivities() {
  const response = await fetch(
    `${API_BASE_URL}/activity`
  );

  return await response.json();
}

export async function addActivity(
  payload: any
) {
  const response = await fetch(
    `${API_BASE_URL}/activity`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  return await response.json();
}

export async function updateActivity(
  id: string,
  payload: any
) {
  const response = await fetch(
    `${API_BASE_URL}/api/activity/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  return await response.json();
}

export async function deleteActivity(
  id: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/activity/${id}`,
    {
      method: "DELETE",
    }
  );

  return await response.json();
}