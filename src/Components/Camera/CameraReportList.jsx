import React, { useEffect, useState } from "react";
import CategoryChart from './CategoryChart';
import '../CSS/CameraReportList.css';

const CameraReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [sites, setSites] = useState([]);

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
        console.error("Failed to fetch or enrich reports:", error);
        setLoading(false);
      }
    };

    fetchAndEnrichReports();
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

  const totalSpace = filteredReports.reduce((sum, r) => sum + (r.totalSpaceGB || 0), 0).toFixed(2);
  const usedSpace = filteredReports.reduce((sum, r) => sum + (r.usedSpaceGB || 0), 0).toFixed(2);
  const freeSpace = filteredReports.reduce((sum, r) => sum + (r.freeSpaceGB || 0), 0).toFixed(2);

  if (loading) return <p className="text-white">Loading camera reports...</p>;

  return (
    <div className="dashboard-layout">
      <nav className="sidebar">
        <h3 className="sidebar-title">TrueNAS</h3>
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li>Accounts</li>
          <li>System</li>
          <li>Tasks</li>
          <li>Storage</li>
          <li>Sharing</li>
          <li>Reporting</li>
          <li>Shell</li>
          <li>Guide</li>
        </ul>
      </nav>

      <main className="main-content">
        <h2 className="dashboard-title">Camera Reports Dashboard</h2>

        <div className="grid-panels">
          {/* <div className="panel-card">
            <h4>Storage Info</h4>
            <ul>
              <li><strong>Total Space:</strong> {totalSpace} GB</li>
              <li><strong>Used Space:</strong> {usedSpace} GB</li>
              <li><strong>Free Space:</strong> {freeSpace} GB</li>
            </ul>
          </div> */}

          <div className="panel-card wide">
            <h4>Camera Report Categories</h4>
            <CategoryChart reports={filteredReports} />
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by Camera ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select value={selectedCategory} onChange={handleCategoryChange} className="dropdown">
            <option value="">All Categories</option>
            <option value="Category 1 (0-7 days)">Category 1 (0-7 days)</option>
            <option value="Category 2 (8-14 days)">Category 2 (8-14 days)</option>
            <option value="Category 3 (15-30 days)">Category 3 (15-30 days)</option>
            <option value="Category 4 (30+ days)">Category 4 (30+ days)</option>
          </select>
          <select value={selectedSiteId} onChange={handleSiteIdChange} className="dropdown">
            <option value="">All Sites</option>
            {sites.map((site) => (
              <option key={site.siteId} value={site.siteId} className="text-black">
                {site.siteId}
              </option>
            ))}
          </select>
        </div>

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
              {filteredReports.map((report) => (
                <tr key={report.cameraId}>
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CameraReportList;
