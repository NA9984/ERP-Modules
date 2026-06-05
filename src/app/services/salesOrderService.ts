import { API_BASE_URL } from "./api";

export async function getSalesOrders(
  pageNumber: number,
  pageSize: number
) {
  const response = await fetch(
    `${API_BASE_URL}/sales-order?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  return await response.json();
}