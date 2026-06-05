"use client";

import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import ActivityModal from "../components/activity/ActivityModal";

import {
  addActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "../services/activityService";

export default function ActivityPage() {
  const [activities, setActivities] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editData, setEditData] =
    useState<any>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const data =
        await getActivities();

      setActivities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(
    data: any
  ) {
    try {
      if (!data.name) {
        alert(
          "Activity Name Required"
        );

        return;
      }

      setSaving(true);

      if (editData) {
        await updateActivity(
          editData.id,
          data
        );
      } else {
        await addActivity(data);
      }

      setShowModal(false);

      setEditData(null);

      loadActivities();
    } catch (error) {
      console.error(error);

      alert("Save Failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: string
  ) {
    const confirmed = confirm(
      "Delete this activity?"
    );

    if (!confirmed) return;

    try {
      await deleteActivity(id);

      loadActivities();
    } catch (error) {
      console.error(error);

      alert("Delete Failed");
    }
  }

  const filteredActivities =
    activities.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Activity
            </h1>

            <p className="text-gray-500 mt-1">
              Activity Master Data
            </p>
          </div>

          <button
            onClick={() => {
              setEditData(null);

              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            + Add Activity
          </button>
        </div>

        {/* SEARCH */}

        <div className="erp-card p-5 rounded-2xl border shadow-sm">
          <input
            type="text"
            placeholder="Search activity..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full md:w-96 border p-3 rounded-xl"
          />
        </div>

        {/* TABLE */}

        <div className="erp-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-5 space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">
                      Name
                    </th>

                    <th className="text-center p-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredActivities.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center p-10 text-gray-500"
                      >
                        No Activities Found
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-t hover:erp-page"
                        >
                          <td className="p-4">
                            {item.name}
                          </td>

                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditData(
                                    item
                                  );

                                  setShowModal(
                                    true
                                  );
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    item.id
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL */}

        <ActivityModal
          open={showModal}
          onClose={() => {
            setShowModal(false);

            setEditData(null);
          }}
          onSave={handleSave}
          loading={saving}
          editData={editData}
        />
      </div>
    </AppLayout>
  );
}