"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  loading: boolean;
  editData?: any;
};

export default function ActivityModal({
  open,
  onClose,
  onSave,
  loading,
  editData,
}: Props) {
  const [name, setName] =
    useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    } else {
      setName("");
    }
  }, [editData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="erp-card rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold mb-6">
          {editData
            ? "Update Activity"
            : "Add Activity"}
        </h2>

        <div>
          <input
            type="text"
            placeholder="Activity Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border px-5 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onSave({ name })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl disabled:bg-gray-400"
          >
            {loading
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}