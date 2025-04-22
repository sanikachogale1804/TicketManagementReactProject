import React, { useEffect, useState } from "react";
import { fetchCameraReports, fetchStorageInfo } from "../Services/CameraReport.jsx";

const CameraReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    fetchCameraReports()
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch reports:", error);
        setLoading(false);
      });

    fetchStorageInfo().then(setStorageInfo);
  }, []);

  if (loading) return <p>Loading camera reports...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Camera Reports</h2>

      {storageInfo && (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <p><strong>Total Space:</strong> {storageInfo.totalSpaceGB.toFixed(2)} GB</p>
          <p><strong>Used Space:</strong> {storageInfo.usedSpaceGB.toFixed(2)} GB</p>
          <p><strong>Free Space:</strong> {storageInfo.freeSpaceGB.toFixed(2)} GB</p>
        </div>
      )}

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Camera ID</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">End Date</th>
            <th className="p-2 border">Recording Days</th>
            <th className="p-2 border">Storage Used (GB)</th>
            <th className="p-2 border">Date Issue</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="p-2 border">{report.cameraId}</td>
              <td className="p-2 border">{report.startDate}</td>
              <td className="p-2 border">{report.endDate}</td>
              <td className="p-2 border">{report.recordingDays}</td>
              <td className="p-2 border">{report.storageUsedGB.toFixed(2)}</td>
              <td className="p-2 border">{report.dateIssue ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CameraReportList;
