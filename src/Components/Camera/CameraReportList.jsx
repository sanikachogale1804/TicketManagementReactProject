import React, { useEffect, useState } from "react";
import StorageChart from './StorageChart';
import '../CSS/CameraReportList.css';
import CategoryStorageChart from "./CategoryStorageChart";
import { addNewSite } from "../Services/CameraReportService";
import axios from "axios";
import logo from '../Image/logo-removebg-preview.png';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CameraReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [sites, setSites] = useState([]);
  const [newSiteId, setNewSiteId] = useState("");
  const [newSiteLiveDate, setNewSiteLiveDate] = useState("");
  const [cameraIdToMap, setCameraIdToMap] = useState("");
  const [siteIdToMap, setSiteIdToMap] = useState("");

  const fetchCameraReportsBySite = async (siteId) => {
    try {
      const response = await fetch(`http://localhost:8080/camera-reports?siteId=${siteId}`);
      const data = await response.json();
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
        setLoading(false);
        alert("Failed to fetch camera reports. Please try again later.");
      }
    };

    fetchAndEnrichReports();
    fetchSites();
  }, [selectedSiteId]);

  const handleAddNewSite = async (event) => {
    event.preventDefault();

    // Ensure newSiteLiveDate is in correct format DD-MM-YYYY
    const [year, month, day] = newSiteLiveDate.split("-");
    const formattedDate = `${day}-${month}-${year}`; // Change format to DD-MM-YYYY

    // Validate date format (optional, but ensures proper input)
    if (!newSiteId || !newSiteLiveDate) {
      alert("Please provide both Site ID and Site Live Date.");
      return;
    }

    const newSite = {
      siteId: newSiteId,
      siteLiveDate: formattedDate, // Ensure it's in DD-MM-YYYY format
    };

    try {
      await addNewSite(newSite);
      setNewSiteId("");
      setNewSiteLiveDate("");
      alert("New site added successfully!");
      fetchSites();
    } catch (error) {
      console.error("Error adding new site:", error);
      alert("Error adding new site.");
    }
  };

  const handleMapCameraToSite = async (cameraId, siteId) => {
    try {
      // Step 1: Find CameraReport by cameraId
      const response = await axios.get(`http://localhost:8080/camera-reports/search/findByCameraId?cameraId=${cameraId}`);
      const cameraReport = response.data;
      const cameraReportUrl = cameraReport._links.self.href;
      const parts = cameraReportUrl.split("/");
      const cameraReportDbId = parts[parts.length - 1];

      console.log("cameraReportDbId = ", cameraReportDbId);

      // Step 2: Find Site by siteId (UVTSADB00102 etc.)
      const siteResponse = await axios.get(`http://localhost:8080/siteMasterData/search/findBySiteId?siteId=${siteId}`);
      const site = siteResponse.data;
      const siteUrl = site._links.self.href;  // This will be something like http://localhost:8080/siteMasterData/1

      console.log("siteUrl = ", siteUrl);

      // Step 3: PUT request
      await axios.put(
        `http://localhost:8080/camera-reports/${cameraReportDbId}/site`,
        siteUrl,   // plain text URL
        {
          headers: {
            "Content-Type": "text/uri-list"
          }
        }
      );

      console.log("Mapping successful!");
    } catch (error) {
      console.error("Mapping failed:", error.response?.data || error.message);
    }
  };

  const getCategory = (recordingDays) => {
    if (recordingDays <= 7) return "Category 1 (0-7 days)";
    if (recordingDays <= 14) return "Category 2 (8-14 days)";
    if (recordingDays <= 30) return "Category 3 (15-30 days)";
    return "Category 4 (30+ days)";
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearchQuery = report.cameraId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? getCategory(report.recordingDays) === selectedCategory : true;
    const matchesSiteId = !selectedSiteId || (report.site && report.site.siteId === selectedSiteId);
    return matchesSearchQuery && matchesCategory && matchesSiteId;
  });

  if (loading) return <p className="text-white">Loading camera reports...</p>;

  // Add inside the component
  const handleExportToExcel = () => {
    const exportData = filteredReports.map((report) => ({
      'Camera ID': report.cameraId,
      'Start Date': report.startDate,
      'End Date': report.endDate,
      'Recording Days': report.recordingDays,
      'Storage Used (GB)': report.storageUsedGB?.toFixed(2),
      'Total Space (GB)': report.totalSpaceGB?.toFixed(2) || "N/A",
      'Used Space (GB)': report.usedSpaceGB?.toFixed(2) || "N/A",
      'Free Space (GB)': report.freeSpaceGB?.toFixed(2) || "N/A",
      'Category': getCategory(report.recordingDays),
      'Site ID': report.site?.siteId || "Not Assigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CameraReports");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "CameraReports.xlsx");
  };


  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <div className="dashboard-header">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <h2 className="dashboard-title">Camera Reports Dashboard</h2>

          <div className="top-right-forms">
            <div className="add-site-form">
              <h4>Add New Site</h4>
              <form onSubmit={handleAddNewSite}>
                <input type="text" placeholder="Enter Site ID" value={newSiteId} onChange={(e) => setNewSiteId(e.target.value)} required />
                <input type="date" value={newSiteLiveDate} onChange={(e) => setNewSiteLiveDate(e.target.value)} required />
                <button type="submit">Add Site</button>
              </form>
            </div>

            <div className="map-camera-form">
              <h4>Map Camera to Site</h4>
              <input type="text" placeholder="Enter Camera ID" value={cameraIdToMap} onChange={(e) => setCameraIdToMap(e.target.value)} />
              <input type="text" placeholder="Enter Site ID" value={siteIdToMap} onChange={(e) => setSiteIdToMap(e.target.value)} />
              <button onClick={() => handleMapCameraToSite(cameraIdToMap, siteIdToMap)}>Map Camera</button>
            </div>
          </div>
        </div>

        <div className="grid-panels">
          <div className="panel-card"><StorageChart reports={filteredReports} /></div>
          <div className="panel-card"><CategoryStorageChart reports={filteredReports} /></div>
        </div>

        <div className="filters">
          <input type="text" placeholder="Search by Camera ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="dropdown">
            <option value="">All Categories</option>
            <option value="Category 1 (0-7 days)">Category 1 (0-7 days)</option>
            <option value="Category 2 (8-14 days)">Category 2 (8-14 days)</option>
            <option value="Category 3 (15-30 days)">Category 3 (15-30 days)</option>
            <option value="Category 4 (30+ days)">Category 4 (30+ days)</option>
          </select>
          <select value={selectedSiteId} onChange={(e) => setSelectedSiteId(e.target.value)} className="dropdown">
            <option value="">All Sites</option>
            {sites.map((site) => (
              <option key={site.siteId} value={site.siteId}>{site.siteId}</option>
            ))}
          </select>
        </div>

        <button className="export-button" onClick={handleExportToExcel}>
          📥 Export to Excel
        </button>


        <div className="panel-card wide">
          <h4>Camera Report Table</h4>
          <table className="report-table">
            <thead>
              <tr>
                <th>Camera ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Storage (GB)</th>
                <th>Total</th>
                <th>Used</th>
                <th>Free</th>
                <th>Category</th>
                <th>Site</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => {
                const uniqueKey = report.cameraId ? `${report.cameraId}-${index}` : `report-${index}`;
                return (
                  <tr key={uniqueKey}>
                    <td>{report.cameraId}</td>
                    <td>{report.startDate}</td>
                    <td>{report.endDate}</td>
                    <td>{report.recordingDays}</td>
                    <td>{report.storageUsedGB.toFixed(2)}</td>
                    <td>{report.totalSpaceGB?.toFixed(2) || "N/A"}</td>
                    <td>{report.usedSpaceGB?.toFixed(2) || "N/A"}</td>
                    <td>{report.freeSpaceGB?.toFixed(2) || "N/A"}</td>
                    <td>{getCategory(report.recordingDays)}</td>
                    <td>{report.site?.siteId || <span className="not-assigned">🔗 Not Assigned</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CameraReportList;
