"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filesList, setFilesList] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const fileName = file.name.replace(/\s+/g, "_");

      const res = await fetch("/api/s3-presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileType: file.type,
        }),
      });

      const { signedUrl } = await res.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      setMessage("✅ File uploaded successfully!");
      // After upload, refresh the list of files
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/s3-list");
      const data = await res.json();
      setFilesList(data.contents.map((file: { Key: string }) => file.Key)); // Assuming 'Key' is the file name
    } catch (err) {
      console.error("❌ Error fetching file list:", err);
    }
  };

  const handleDelete = async (fileKey: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fileKey}?`)) return;

    try {
      // Delete from S3
      const deleteRes = await fetch(`/api/s3-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey }),
      });

      if (!deleteRes.ok) {
        setMessage(`❌ Failed to delete ${fileKey}`);
        return;
      }

      // If S3 delete is successful, remove from the list
      setFilesList((prevFiles) => prevFiles.filter((file) => file !== fileKey));

      setMessage(`✅ ${fileKey} deleted successfully from S3!`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting file: " + err.message);
    }
  };

  // Load the file list on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload to S3</h1>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full"
        disabled={loading}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!file || loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">Files in S3 Bucket</h2>
      {filesList.length === 0 ? (
        <p>No files found in the bucket.</p>
      ) : (
        <ul className="mt-4">
          {filesList.map((file, index) => (
            <li key={index} className="border-b py-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(file)}
                  className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <span>{file}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
