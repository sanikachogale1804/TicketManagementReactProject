import React, { useEffect, useState } from "react";
import { fetchCameraReports, fetchStorageInfo } from "../Services/CameraReport.jsx";
import CategoryChart from './CategoryChart'; // Import the chart component

const CameraReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selected category
  };

  // Function to categorize the reports based on recording days
  const getCategory = (recordingDays) => {
    if (recordingDays >= 0 && recordingDays <= 7) {
      return "Category 1 (0-7 days)";
    } else if (recordingDays >= 8 && recordingDays <= 14) {
      return "Category 2 (8-14 days)";
    } else if (recordingDays >= 15 && recordingDays <= 30) {
      return "Category 3 (15-30 days)";
    } else {
      return "Category 4 (30+ days)";
    }
  };

  // Filter reports based on the search query (cameraId) and selected category
  const filteredReports = reports.filter((report) => {
    const matchesSearchQuery = report.cameraId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? getCategory(report.recordingDays) === selectedCategory
      : true;
    return matchesSearchQuery && matchesCategory;
  });

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

      <CategoryChart reports={filteredReports} /> {/* Display the pie chart with filtered reports */}

      {/* Search and Category input fields */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by Camera ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Category 1 (0-7 days)">Category 1 (0-7 days)</option>
          <option value="Category 2 (8-14 days)">Category 2 (8-14 days)</option>
          <option value="Category 3 (15-30 days)">Category 3 (15-30 days)</option>
          <option value="Category 4 (30+ days)">Category 4 (30+ days)</option>
        </select>
      </div>

      <table className="w-full table-auto border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-200">
          <th className="p-2 border">ID</th>
            <th className="p-2 border">Camera ID</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">End Date</th>
            <th className="p-2 border">Recording Days</th>
            <th className="p-2 border">Storage Used (GB)</th>
            {/* <th className="p-2 border">Date Issue</th> */}
            <th className="p-2 border">Total Space (GB)</th>
            <th className="p-2 border">Used Space (GB)</th>
            <th className="p-2 border">Free Space (GB)</th>
            <th className="p-2 border">Category</th> {/* New category column */}
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id}>
               <td className="p-2 border">{report.id}</td> 
              <td className="p-2 border">{report.cameraId}</td>
              <td className="p-2 border">{report.startDate}</td>
              <td className="p-2 border">{report.endDate}</td>
              <td className="p-2 border">{report.recordingDays}</td>
              <td className="p-2 border">{report.storageUsedGB.toFixed(2)}</td>
              {/* <td className="p-2 border">{report.dateIssue ? "Yes" : "No"}</td> */}
              <td className="p-2 border">{report.totalSpaceGB ? report.totalSpaceGB.toFixed(2) : "N/A"}</td>
              <td className="p-2 border">{report.usedSpaceGB ? report.usedSpaceGB.toFixed(2) : "N/A"}</td>
              <td className="p-2 border">{report.freeSpaceGB ? report.freeSpaceGB.toFixed(2) : "N/A"}</td>
              <td className="p-2 border">{getCategory(report.recordingDays)}</td> {/* Category column */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CameraReportList;
