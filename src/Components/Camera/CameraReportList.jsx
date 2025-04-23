import React, { useEffect, useState } from "react";
import { fetchStorageInfo } from "../Services/CameraReport.jsx";
import CategoryChart from './CategoryChart'; // Import the chart component

const CameraReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [selectedSiteId, setSelectedSiteId] = useState(""); // State for selected site ID
  const [sites, setSites] = useState([]); // State for available sites

  // Fetch camera reports by siteId from the backend
  const fetchCameraReportsBySite = async (siteId) => {
    try {
      const response = await fetch(`http://localhost:8080/camera-reports?siteId=${siteId}`);
      const data = await response.json();
      console.log("Fetched camera reports:", data);  // Log the full camera report data
      return data; // Ensure you return the complete response object
    } catch (error) {
      console.error("Error fetching camera reports by site:", error);
      throw error;
    }
  };

  // Fetch site data from the server
  const fetchSites = async () => {
    try {
      const response = await fetch("http://localhost:8080/siteMasterData");
      const data = await response.json();
      console.log("Fetched sites data:", data); // Log the data
      setSites(data._embedded?.siteMasterDatas || []); // Set the state with the correct data
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  useEffect(() => {
    // Fetch reports when the site changes
    fetchCameraReportsBySite(selectedSiteId)
      .then((data) => {
        const reports = data._embedded?.cameraReports || [];
        setReports(reports);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch reports:", error);
        setLoading(false);
      });

    // Fetch storage information
    fetchStorageInfo().then(setStorageInfo);

    // Fetch available sites
    fetchSites();
  }, [selectedSiteId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selected category
  };

  const handleSiteIdChange = (event) => {
    setSelectedSiteId(event.target.value); // Update selected site ID
  };

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

  const filteredReports = reports.filter((report) => {
    const matchesSearchQuery = report.cameraId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? getCategory(report.recordingDays) === selectedCategory
      : true;
    const matchesSiteId = selectedSiteId
      ? report.site && report.site.siteId === selectedSiteId
      : true;
    return matchesSearchQuery && matchesCategory && matchesSiteId;
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
        <select
          value={selectedSiteId}
          onChange={handleSiteIdChange}
          className="p-2 border rounded"
        >
          <option value="">All Sites</option>
          {Array.isArray(sites) && sites.length > 0 ? (
            sites.map((site) => (
              <option key={site.siteId} value={site.siteId}>
                {site.siteId}
              </option>
            ))
          ) : (
            <option>No sites available</option>
          )}
        </select>
      </div>

      <table className="w-full table-auto border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Camera ID</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">End Date</th>
            <th className="p-2 border">Recording Days</th>
            <th className="p-2 border">Storage Used (GB)</th>
            <th className="p-2 border">Total Space (GB)</th>
            <th className="p-2 border">Used Space (GB)</th>
            <th className="p-2 border">Free Space (GB)</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Site ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.cameraId}>
              <td className="p-2 border">{report.cameraId}</td>
              <td className="p-2 border">{report.startDate}</td>
              <td className="p-2 border">{report.endDate}</td>
              <td className="p-2 border">{report.recordingDays}</td>
              <td className="p-2 border">{report.storageUsedGB.toFixed(2)}</td>
              <td className="p-2 border">{report.totalSpaceGB ? report.totalSpaceGB.toFixed(2) : "N/A"}</td>
              <td className="p-2 border">{report.usedSpaceGB ? report.usedSpaceGB.toFixed(2) : "N/A"}</td>
              <td className="p-2 border">{report.freeSpaceGB ? report.freeSpaceGB.toFixed(2) : "N/A"}</td>
              <td className="p-2 border">{getCategory(report.recordingDays)}</td>
              <td className="p-2 border">{report.site?.siteId || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CameraReportList;
