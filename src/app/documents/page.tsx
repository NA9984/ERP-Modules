"use client";

import {
  useEffect,
  useState,
} from "react";

import AppLayout from "../components/layout/AppLayout";

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  data: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [search, setSearch] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  function getUserKey() {
    const user = JSON.parse(
      localStorage.getItem("user") ||
        "{}"
    );

    return `documents_${user.id}`;
  }

  function loadDocuments() {
    const saved =
      localStorage.getItem(
        getUserKey()
      );

    if (saved) {
      setDocuments(
        JSON.parse(saved)
      );
    }
  }

  function saveDocuments(
    docs: DocumentItem[]
  ) {
    localStorage.setItem(
      getUserKey(),
      JSON.stringify(docs)
    );

    setDocuments(docs);
  }

  async function uploadFile(
    file: File
  ) {
    try {
      setUploading(true);

      if (
        file.size >
        2 * 1024 * 1024
      ) {
        alert(
          "Max file size is 2MB"
        );

        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        const newDocument: DocumentItem =
          {
            id:
              Date.now().toString(),

            name: file.name,

            type: file.type,

            size: file.size,

            uploadedAt:
              new Date().toISOString(),

            data:
              reader.result as string,
          };

        const updatedDocs = [
          newDocument,
          ...documents,
        ];

        saveDocuments(
          updatedDocs
        );

        alert(
          "File uploaded successfully"
        );
      };

      reader.readAsDataURL(
        file
      );
    } catch (error) {
      console.error(error);

      alert(
        "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  function deleteFile(
    id: string
  ) {
    const updated =
      documents.filter(
        (x) => x.id !== id
      );

    saveDocuments(updated);
  }

  function downloadFile(
    file: DocumentItem
  ) {
    const a =
      document.createElement(
        "a"
      );

    a.href = file.data;

    a.download = file.name;

    a.click();
  }

  function previewFile(
    file: DocumentItem
  ) {
    window.open(
      file.data,
      "_blank"
    );
  }

  const filteredDocuments =
    documents.filter((doc) =>
      doc.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  function getFileIcon(
    fileName: string
  ) {
    const ext = fileName
      .split(".")
      .pop()
      ?.toLowerCase();

    switch (ext) {
      case "pdf":
        return "📕";

      case "xlsx":
      case "xls":
        return "📗";

      case "doc":
      case "docx":
        return "📘";

      case "png":
      case "jpg":
      case "jpeg":
        return "🖼️";

      default:
        return "📄";
    }
  }

  function formatSize(
    size: number
  ) {
    return (
      (
        size /
        1024 /
        1024
      ).toFixed(2) + " MB"
    );
  }

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* HEADER */}

        <div className="erp-card rounded-3xl border erp-border p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                ● Personal Document
                Center
              </div>

              <h1 className="text-3xl font-black text-gray-900 mt-3">
                Documents
              </h1>

              <p className="text-gray-500 mt-2">
                Secure personal
                file storage for
                each logged in
                user.
              </p>
            </div>

            <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold cursor-pointer transition inline-flex items-center justify-center">
              {uploading
                ? "Uploading..."
                : "Upload File"}

              <input
                hidden
                type="file"
                onChange={(e) => {
                  if (
                    e.target
                      .files?.[0]
                  ) {
                    uploadFile(
                      e.target
                        .files[0]
                    );
                  }
                }}
              />
            </label>
          </div>

          {/* SEARCH */}

          <div className="mt-5">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border erp-border erp-page rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="erp-card rounded-2xl border erp-border p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              Total Files
            </div>

            <div className="text-3xl font-black text-gray-900 mt-2">
              {
                filteredDocuments.length
              }
            </div>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              Storage Used
            </div>

            <div className="text-3xl font-black text-gray-900 mt-2">
              {formatSize(
                filteredDocuments.reduce(
                  (
                    sum,
                    file
                  ) =>
                    sum +
                    file.size,
                  0
                )
              )}
            </div>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              User Private Files
            </div>

            <div className="text-3xl font-black text-gray-900 mt-2">
              🔒
            </div>
          </div>
        </div>

        {/* FILES */}

        {filteredDocuments.length ===
        0 ? (
          <div className="erp-card rounded-3xl border erp-border p-20 text-center shadow-sm">
            <div className="text-7xl">
              📂
            </div>

            <h2 className="text-2xl font-black text-gray-900 mt-5">
              No Documents Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Upload your first
              file to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredDocuments.map(
              (file) => (
                <div
                  key={file.id}
                  className="erp-card border erp-border rounded-3xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-5xl">
                    {getFileIcon(
                      file.name
                    )}
                  </div>

                  <div className="mt-4">
                    <h2 className="font-bold text-gray-900 break-words">
                      {file.name}
                    </h2>

                    <div className="text-sm text-gray-500 mt-2">
                      {formatSize(
                        file.size
                      )}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(
                        file.uploadedAt
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <button
                      onClick={() =>
                        previewFile(
                          file
                        )
                      }
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        downloadFile(
                          file
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Save
                    </button>

                    <button
                      onClick={() =>
                        deleteFile(
                          file.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}