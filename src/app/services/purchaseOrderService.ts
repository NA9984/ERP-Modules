import { API_BASE_URL } from "./api";

export const purchaseOrderService = {
  async getAll() {
    const response = await fetch(
      `${API_BASE_URL}/api/app/purchase-order`
    );

    if (!response.ok)
      throw new Error(
        "Failed to load purchase orders"
      );

    return await response.json();
  },

  async getById(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/app/purchase-order/${id}`
    );

    if (!response.ok)
      throw new Error(
        "Failed to load purchase order"
      );

    return await response.json();
  },

  async create(data: any) {
    const response = await fetch(
      `${API_BASE_URL}/api/app/purchase-order`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response;
  },

  async update(
    id: string,
    data: any
  ) {
    const response = await fetch(
      `${API_BASE_URL}/api/app/purchase-order/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response;
  },

  async delete(id: string) {
    return fetch(
      `${API_BASE_URL}/api/app/purchase-order/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};