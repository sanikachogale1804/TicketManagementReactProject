import React, { useEffect, useState } from "react";
import { fetchStorageInfo } from "../Services/CameraReport.jsx";
import CategoryChart from './CategoryChart';

const CameraReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [sites, setSites] = useState([]);

  const fetchCameraReportsBySite = async (siteId) => {
    try {
      const response = await fetch(`http://localhost:8080/camera-reports?siteId=${siteId}`);
      const data = await response.json();
      console.log("Fetched camera reports:", data);
      return data;
    } catch (error) {
      console.error("Error fetching camera reports by site:", error);
      throw error;
    }
  };

  const fetchSites = async () => {
    try {
      const response = await fetch("http://localhost:8080/siteMasterData");
      const data = await response.json();
      console.log("Fetched sites data:", data);
      setSites(data._embedded?.siteMasterDatas || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  useEffect(() => {
    const fetchAndEnrichReports = async () => {
      try {
        const data = await fetchCameraReportsBySite(selectedSiteId);
        const reports = data._embedded?.cameraReports || [];

        // Enrich each report with its site data (follow HATEOAS link)
        const enrichedReports = await Promise.all(
          reports.map(async (report) => {
            if (report._links?.site?.href) {
              try {
                const siteRes = await fetch(report._links.site.href);
                const siteData = await siteRes.json();
                return { ...report, site: siteData };
              } catch (error) {
                console.warn("Failed to fetch site for report:", report.cameraId);
                return report;
              }
            }
            return report;
          })
        );

        setReports(enrichedReports);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch or enrich reports:", error);
        setLoading(false);
      }
    };

    fetchAndEnrichReports();
    fetchStorageInfo().then(setStorageInfo);
    fetchSites();
  }, [selectedSiteId]);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
  const handleSiteIdChange = (event) => setSelectedSiteId(event.target.value);

  const getCategory = (recordingDays) => {
    if (recordingDays >= 0 && recordingDays <= 7) return "Category 1 (0-7 days)";
    if (recordingDays >= 8 && recordingDays <= 14) return "Category 2 (8-14 days)";
    if (recordingDays >= 15 && recordingDays <= 30) return "Category 3 (15-30 days)";
    return "Category 4 (30+ days)";
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearchQuery = report.cameraId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? getCategory(report.recordingDays) === selectedCategory : true;
    const matchesSiteId = !selectedSiteId || (report.site && report.site.siteId === selectedSiteId);
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

      <CategoryChart reports={filteredReports} />

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by Camera ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <select value={selectedCategory} onChange={handleCategoryChange} className="p-2 border rounded">
          <option value="">All Categories</option>
          <option value="Category 1 (0-7 days)">Category 1 (0-7 days)</option>
          <option value="Category 2 (8-14 days)">Category 2 (8-14 days)</option>
          <option value="Category 3 (15-30 days)">Category 3 (15-30 days)</option>
          <option value="Category 4 (30+ days)">Category 4 (30+ days)</option>
        </select>
        <select value={selectedSiteId} onChange={handleSiteIdChange} className="p-2 border rounded">
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
              <td className="p-2 border">
                {report.site?.siteId ? (
                  report.site.siteId
                ) : (
                  <span className="text-red-500 font-semibold">🔗 Not Assigned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CameraReportList;
