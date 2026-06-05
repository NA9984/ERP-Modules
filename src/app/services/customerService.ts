import { API_BASE_URL } from "./api";

export async function getCustomers() {
  const response = await fetch(
    `${API_BASE_URL}/customer`
  );

  const data = await response.json();

  return data;
}
export async function addCustomer(
  customerData: any
) {
  const response = await fetch(
    `${API_BASE_URL}/customer`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        customerData
      ),
    }
  );

  const data = await response.json();

  return data;
}