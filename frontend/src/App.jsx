import { useEffect, useState } from "react";
import "./App.css";


// ======================================================
// FALLBACK AIRCRAFT DATA
// ======================================================

const fallbackAircraftData = [
  {
    id: "A-107",
    type: "Fighter Aircraft",
    health: 78,
    risk: "High",
    rul: 38,
    status: "Attention",
    location: "Hangar 02",
  },
  {
    id: "A-108",
    type: "Fighter Aircraft",
    health: 94,
    risk: "Low",
    rul: 210,
    status: "Ready",
    location: "Flight Line",
  },
  {
    id: "A-109",
    type: "Transport Aircraft",
    health: 89,
    risk: "Low",
    rul: 174,
    status: "Ready",
    location: "Flight Line",
  },
  {
    id: "A-114",
    type: "Fighter Aircraft",
    health: 67,
    risk: "High",
    rul: 72,
    status: "Maintenance",
    location: "Hangar 01",
  },
  {
    id: "A-121",
    type: "Transport Aircraft",
    health: 61,
    risk: "High",
    rul: 51,
    status: "Attention",
    location: "Hangar 03",
  },
];


// ======================================================
// MAIN APP
// ======================================================

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [aircraftData, setAircraftData] = useState([]);

  const [dashboardSummary, setDashboardSummary] = useState({
    totalAircraft: 0,
    readyAircraft: 0,
    maintenanceAircraft: 0,
    atRiskAircraft: 0,
  });

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);


  // ====================================================
  // FETCH AIRCRAFT + DASHBOARD DATA
  // ====================================================

  useEffect(() => {
    Promise.all([
      fetch("/api/aircraft"),
      fetch("/api/dashboard-summary"),
    ])
      .then(async ([aircraftResponse, summaryResponse]) => {
        if (!aircraftResponse.ok || !summaryResponse.ok) {
          throw new Error("Backend response failed");
        }

        const aircraftData =
          await aircraftResponse.json();

        const summaryData =
          await summaryResponse.json();

        return {
          aircraftData,
          summaryData,
        };
      })

      .then(({ aircraftData, summaryData }) => {
        setAircraftData(aircraftData);

        setDashboardSummary(summaryData);

        setLoading(false);
        setApiError(false);
      })

      .catch((error) => {
        console.error(
          "Backend connection failed:",
          error
        );

        setAircraftData(fallbackAircraftData);

        setDashboardSummary({
          totalAircraft:
            fallbackAircraftData.length,

          readyAircraft:
            fallbackAircraftData.filter(
              (aircraft) =>
                aircraft.status === "Ready"
            ).length,

          maintenanceAircraft:
            fallbackAircraftData.filter(
              (aircraft) =>
                aircraft.status === "Maintenance"
            ).length,

          atRiskAircraft:
            fallbackAircraftData.filter(
              (aircraft) =>
                aircraft.risk === "High"
            ).length,
        });

        setLoading(false);
        setApiError(true);
      });
  }, []);


  // ====================================================
  // PAGE ROUTING
  // ====================================================

  const renderPage = () => {
    if (loading) {
      return (
        <div className="page">

          <div className="loading-box">

            <div className="loading-spinner"></div>

            <h2>
              Loading AeroSentinel...
            </h2>

            <p>
              Connecting to aircraft intelligence system.
            </p>

          </div>

        </div>
      );
    }


    switch (activePage) {

      case "dashboard":
        return (
          <DashboardPage
            aircraftData={aircraftData}
            dashboardSummary={dashboardSummary}
            setActivePage={setActivePage}
          />
        );


      case "aircraft":
        return (
          <AircraftPage
            aircraftData={aircraftData}
            setActivePage={setActivePage}
          />
        );


      case "health":
        return <HealthMonitor />;


      case "alerts":
        return <AlertsPage />;


      case "maintenance":
        return <MaintenancePage />;


      case "spares":
        return <SparesPage />;


      default:
        return (
          <DashboardPage
            aircraftData={aircraftData}
            dashboardSummary={dashboardSummary}
            setActivePage={setActivePage}
          />
        );
    }
  };


  // ====================================================
  // APP UI
  // ====================================================

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            AS
          </div>

          <div>

            <h1>
              AeroSentinel
            </h1>

            <span>
              Fleet Intelligence
            </span>

          </div>

        </div>


        <div className="sidebar-section-title">
          OPERATIONS
        </div>


        <nav className="navigation">

          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            <span className="nav-icon">
              ▦
            </span>

            Dashboard
          </button>


          <button
            className={
              activePage === "aircraft"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("aircraft")
            }
          >
            <span className="nav-icon">
              ✈
            </span>

            Aircraft
          </button>


          <button
            className={
              activePage === "health"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("health")
            }
          >
            <span className="nav-icon">
              ◉
            </span>

            Health Monitor
          </button>


          <button
            className={
              activePage === "alerts"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("alerts")
            }
          >
            <span className="nav-icon">
              !
            </span>

            Alerts

            <span className="nav-count">
              3
            </span>
          </button>


          <button
            className={
              activePage === "maintenance"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("maintenance")
            }
          >
            <span className="nav-icon">
              ⚙
            </span>

            Maintenance
          </button>


          <button
            className={
              activePage === "spares"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setActivePage("spares")
            }
          >
            <span className="nav-icon">
              ▣
            </span>

            Spares
          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>

              <strong>
                System Operational
              </strong>

              <small>
                {apiError
                  ? "Demo data active"
                  : "All services connected"}
              </small>

            </div>

          </div>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        <header className="topbar">

          <div>

            <span className="topbar-label">
              AIR FORCE MAINTENANCE COMMAND
            </span>

            <h2>
              {getPageTitle(activePage)}
            </h2>

          </div>


          <div className="topbar-right">

            <div className="live-status">

              <span className="status-dot"></span>

              Live System

            </div>


            <div className="user-profile">

              <div className="user-avatar">
                AS
              </div>

              <div>

                <strong>
                  Maintenance Officer
                </strong>

                <small>
                  Operations
                </small>

              </div>

            </div>

          </div>

        </header>


        {apiError && (
          <div className="api-warning">

            Backend unavailable —
            showing demo aircraft data.

          </div>
        )}


        {renderPage()}

      </main>

    </div>
  );
}


// ======================================================
// PAGE TITLE
// ======================================================

function getPageTitle(page) {

  const titles = {
    dashboard: "Fleet Readiness Dashboard",
    aircraft: "Aircraft Fleet",
    health: "Aircraft Health Monitor",
    alerts: "Maintenance Alerts",
    maintenance: "Maintenance Planning",
    spares: "Spare Parts Intelligence",
  };

  return (
    titles[page] ||
    "AeroSentinel"
  );
}


// ======================================================
// DASHBOARD PAGE
// ======================================================

function DashboardPage({
  aircraftData,
  dashboardSummary,
  setActivePage,
}) {
  return (
    <div className="page">

      {/* KPI CARDS */}

      <div className="stats-grid">

        <StatCard
          title="Total Aircraft"
          value={dashboardSummary.totalAircraft}
          subtitle="Fleet monitored"
          icon="✈"
        />


        <StatCard
          title="Ready"
          value={dashboardSummary.readyAircraft}
          subtitle="Available for operations"
          icon="✓"
          type="success"
        />


        <StatCard
          title="Maintenance"
          value={dashboardSummary.maintenanceAircraft}
          subtitle="Currently in maintenance"
          icon="⚙"
          type="warning"
        />


        <StatCard
          title="At Risk"
          value={dashboardSummary.atRiskAircraft}
          subtitle="Require attention"
          icon="!"
          type="danger"
        />

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">

        <section className="panel large-panel">

          <div className="panel-header">

            <div>

              <h3>
                Fleet Health Overview
              </h3>

              <p>
                Current health and readiness of monitored aircraft
              </p>

            </div>


            <button
              className="text-button"
              onClick={() =>
                setActivePage("aircraft")
              }
            >
              View all aircraft →
            </button>

          </div>


          <AircraftTable
            aircraftData={aircraftData}
            setActivePage={setActivePage}
          />

        </section>


        <section className="panel alert-panel">

          <div className="panel-header">

            <div>

              <h3>
                Priority Alerts
              </h3>

              <p>
                Issues requiring immediate attention
              </p>

            </div>


            <button
              className="text-button"
              onClick={() =>
                setActivePage("alerts")
              }
            >
              View all →
            </button>

          </div>


          <div className="alert-list">

            <div className="alert-item critical">

              <div className="alert-icon">
                !
              </div>

              <div>

                <strong>
                  A-107 Engine Vibration
                </strong>

                <p>
                  Critical anomaly detected
                </p>

                <small>
                  12 min ago
                </small>

              </div>

            </div>


            <div className="alert-item warning">

              <div className="alert-icon">
                !
              </div>

              <div>

                <strong>
                  A-114 Hydraulic Pressure
                </strong>

                <p>
                  Abnormal pressure trend
                </p>

                <small>
                  34 min ago
                </small>

              </div>

            </div>


            <div className="alert-item warning">

              <div className="alert-icon">
                !
              </div>

              <div>

                <strong>
                  A-121 Temperature
                </strong>

                <p>
                  Temperature deviation detected
                </p>

                <small>
                  1 hr ago
                </small>

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* BOTTOM GRID */}

      <div className="dashboard-grid bottom-grid">

        <section className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Predictive Maintenance
              </h3>

              <p>
                Upcoming maintenance recommendations
              </p>

            </div>

          </div>


          <div className="maintenance-summary">

            <div className="maintenance-item">

              <div className="maintenance-icon">
                ⚙
              </div>

              <div>

                <strong>
                  A-107
                </strong>

                <span>
                  Engine bearing inspection
                </span>

              </div>

              <div className="maintenance-date">
                Today
              </div>

            </div>


            <div className="maintenance-item">

              <div className="maintenance-icon">
                ⚙
              </div>

              <div>

                <strong>
                  A-114
                </strong>

                <span>
                  Hydraulic system inspection
                </span>

              </div>

              <div className="maintenance-date">
                Tomorrow
              </div>

            </div>

          </div>

        </section>


        <section className="panel readiness-panel">

          <div className="panel-header">

            <div>

              <h3>
                Fleet Readiness
              </h3>

              <p>
                Current operational availability
              </p>

            </div>

          </div>


          <div className="readiness-content">

            <div className="readiness-number">
              {dashboardSummary.totalAircraft > 0
                ? Math.round(
                    (dashboardSummary.readyAircraft /
                      dashboardSummary.totalAircraft) *
                      100
                  )
                : 0}
              %
            </div>


            <div className="readiness-info">

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      dashboardSummary.totalAircraft > 0
                        ? Math.round(
                            (dashboardSummary.readyAircraft /
                              dashboardSummary.totalAircraft) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                ></div>

              </div>


              <span>
                {dashboardSummary.readyAircraft} of{" "}
                {dashboardSummary.totalAircraft} aircraft ready
              </span>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


// ======================================================
// AIRCRAFT PAGE
// ======================================================

function AircraftPage({
  aircraftData,
  setActivePage,
}) {
  const [selectedAircraft, setSelectedAircraft] =
    useState(null);


  if (selectedAircraft) {
    return (
      <AircraftDetail
        aircraft={selectedAircraft}
        onBack={() =>
          setSelectedAircraft(null)
        }
        setActivePage={setActivePage}
      />
    );
  }


  return (
    <div className="page">

      <div className="page-intro">

        <div>

          <h3>
            Aircraft Fleet
          </h3>

          <p>
            Monitor aircraft health, risk level and remaining useful life.
          </p>

        </div>


        <div className="fleet-filter">

          <span>
            All Aircraft
          </span>

          <span className="filter-count">
            {aircraftData.length}
          </span>

        </div>

      </div>


      <div className="aircraft-grid">

        {aircraftData.map((aircraft) => (

          <div
            className="aircraft-card"
            key={aircraft.id}
            onClick={() =>
              setSelectedAircraft(aircraft)
            }
          >

            <div className="aircraft-card-top">

              <div>

                <span className="aircraft-id">
                  {aircraft.id}
                </span>

                <h3>
                  {aircraft.type}
                </h3>

              </div>


              <span
                className={
                  aircraft.risk === "Low"
                    ? "risk-badge low"
                    : "risk-badge high"
                }
              >
                {aircraft.risk} Risk
              </span>

            </div>


            <div className="aircraft-health">

              <div className="health-circle">
                {aircraft.health}%
              </div>


              <div className="health-details">

                <span>
                  Health Score
                </span>

                <strong>
                  {aircraft.status}
                </strong>

                <small>
                  {aircraft.location}
                </small>

              </div>

            </div>


            <div className="aircraft-card-footer">

              <div>

                <span>
                  RUL
                </span>

                <strong>
                  {aircraft.rul} hrs
                </strong>

              </div>


              <span className="view-details">
                View details →
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


// ======================================================
// AIRCRAFT DETAIL PAGE
// ======================================================

function AircraftDetail({
  aircraft,
  onBack,
  setActivePage,
}) {
  const [componentData, setComponentData] =
    useState(null);

  const [predictionData, setPredictionData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    Promise.all([
      fetch(
        `/api/aircraft/${aircraft.id}/components`
      ),

      fetch(
        `/api/prediction/${aircraft.id}`
      ),
    ])

      .then(
        async ([
          componentResponse,
          predictionResponse,
        ]) => {

          if (
            !componentResponse.ok ||
            !predictionResponse.ok
          ) {
            throw new Error(
              "Failed to fetch aircraft intelligence"
            );
          }


          const componentData =
            await componentResponse.json();

          const predictionData =
            await predictionResponse.json();


          return {
            componentData,
            predictionData,
          };
        }
      )

      .then(
        ({
          componentData,
          predictionData,
        }) => {

          setComponentData(
            componentData
          );

          setPredictionData(
            predictionData
          );

          setLoading(false);
        }
      )

      .catch((error) => {

        console.error(
          "Aircraft detail API error:",
          error
        );

        setLoading(false);
      });

  }, [aircraft.id]);


  if (loading) {

    return (
      <div className="page">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Aircraft
        </button>


        <div className="loading-box">

          <div className="loading-spinner"></div>

          <h2>
            Loading Aircraft Health...
          </h2>

          <p>
            Fetching aircraft intelligence.
          </p>

        </div>

      </div>
    );
  }


  if (!componentData) {

    return (
      <div className="page">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Aircraft
        </button>


        <div className="loading-box">

          <h2>
            Aircraft data unavailable
          </h2>

          <p>
            Unable to load aircraft intelligence.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="page">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Aircraft
      </button>


      {/* HEADER */}

      <div className="detail-header">

        <div>

          <span className="aircraft-id">
            {aircraft.id}
          </span>

          <h2>
            {aircraft.type}
          </h2>

          <p>
            Current location:{" "}
            {aircraft.location}
          </p>

        </div>


        <span
          className={
            aircraft.risk === "Low"
              ? "risk-badge low large"
              : "risk-badge high large"
          }
        >
          {aircraft.risk} Risk
        </span>

      </div>


      {/* SUMMARY */}

      <div className="detail-stats">

        <div className="detail-stat">

          <span>
            Health Score
          </span>

          <strong>
            {aircraft.health}%
          </strong>

        </div>


        <div className="detail-stat">

          <span>
            Remaining Useful Life
          </span>

          <strong>
            {aircraft.rul} hrs
          </strong>

        </div>


        <div className="detail-stat">

          <span>
            Current Status
          </span>

          <strong>
            {aircraft.status}
          </strong>

        </div>


        <div className="detail-stat">

          <span>
            Location
          </span>

          <strong>
            {aircraft.location}
          </strong>

        </div>

      </div>


      {/* COMPONENT + PREDICTION */}

      <div className="dashboard-grid">

        <section className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Aircraft Health
              </h3>

              <p>
                Component condition assessment
              </p>

            </div>

          </div>


          <div className="component-list">

            {componentData.components.map(
              (component) => (

                <Component
                  key={component.name}
                  name={component.name}
                  health={component.health}
                  status={component.status}
                />

              )
            )}

          </div>

        </section>


        <section className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Predictive Assessment
              </h3>

              <p>
                Aircraft condition and recommended action
              </p>

            </div>

          </div>


          <div className="recommendation-box">

            <div className="recommendation-icon">
              !
            </div>


            <div>

              <strong>
                {predictionData
                  ? predictionData.prediction
                  : componentData.recommendation.title}
              </strong>


              <p>
                {predictionData
                  ? predictionData.recommendation
                  : componentData.recommendation.description}
              </p>


              {predictionData && (
                <p>
                  Risk score:{" "}
                  <strong>
                    {predictionData.riskScore}/100
                  </strong>
                </p>
              )}


              <button
                className="primary-button"
                onClick={() =>
                  setActivePage(
                    "maintenance"
                  )
                }
              >
                Open Maintenance Plan
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


// ======================================================
// HEALTH MONITOR
// ======================================================

function HealthMonitor() {

  const [sensorData, setSensorData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetch(
      "/api/sensors/A-107"
    )

      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch sensor data"
          );
        }

        return response.json();

      })

      .then((data) => {

        setSensorData(data);
        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Sensor API error:",
          error
        );

        setLoading(false);

      });

  }, []);


  if (loading) {

    return (
      <div className="page">

        <div className="loading-box">

          <div className="loading-spinner"></div>

          <h2>
            Loading Health Monitor...
          </h2>

          <p>
            Fetching live aircraft sensor data.
          </p>

        </div>

      </div>
    );
  }


  if (!sensorData) {

    return (
      <div className="page">

        <div className="loading-box">

          <h2>
            Sensor data unavailable
          </h2>

          <p>
            Unable to connect to the aircraft monitoring service.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="page">

      <div className="page-intro">

        <div>

          <h3>
            Aircraft Health Monitor
          </h3>

          <p>
            Live sensor indicators for aircraft{" "}
            {sensorData.aircraft}
          </p>

        </div>


        <div className="monitor-status">
          ● Monitoring
        </div>

      </div>


      {/* SENSOR CARDS */}

      <div className="sensor-grid">

        {sensorData.sensors.map(
          (sensor) => (

            <SensorCard
              key={sensor.name}
              title={sensor.name}
              value={
                sensor.name ===
                "Engine RPM"
                  ? sensor.value.toLocaleString()
                  : sensor.value
              }
              unit={sensor.unit}
              status={sensor.status}
            />

          )
        )}

      </div>


      {/* VIBRATION CHART */}

      <section className="panel chart-panel">

        <div className="panel-header">

          <div>

            <h3>
              Vibration Trend
            </h3>

            <p>
              {sensorData.aircraft} engine vibration monitoring
            </p>

          </div>


          <span className="trend-up">
            ↑ {sensorData.vibrationChange}%
          </span>

        </div>


        <div className="chart-container">

          <svg
            viewBox="0 0 800 260"
            className="trend-chart"
            preserveAspectRatio="none"
          >

            <line
              x1="0"
              y1="220"
              x2="800"
              y2="220"
              stroke="#dce2e7"
              strokeWidth="1"
            />

            <line
              x1="0"
              y1="160"
              x2="800"
              y2="160"
              stroke="#dce2e7"
              strokeWidth="1"
            />

            <line
              x1="0"
              y1="100"
              x2="800"
              y2="100"
              stroke="#dce2e7"
              strokeWidth="1"
            />


            <polyline
              points={createChartPoints(
                sensorData.vibrationTrend
              )}
              fill="none"
              stroke="#1683a5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

          </svg>

        </div>


        <div className="assessment">

          <div className="assessment-indicator"></div>


          <div>

            <strong>
              Condition Assessment
            </strong>

            <p>
              {sensorData.assessment}
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


// ======================================================
// CHART HELPER
// ======================================================

function createChartPoints(values) {

  const width = 800;
  const height = 220;

  const max = Math.max(...values);
  const min = Math.min(...values);


  return values
    .map((value, index) => {

      const x =
        (index /
          (values.length - 1)) *
        width;


      const normalized =
        (value - min) /
        (max - min || 1);


      const y =
        height -
        normalized * 150;


      return `${x},${y}`;

    })
    .join(" ");
}


// ======================================================
// ALERTS PAGE
// ======================================================

function AlertsPage() {

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetch(
      "/api/alerts"
    )

      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch alerts"
          );
        }

        return response.json();

      })

      .then((data) => {

        setAlerts(data);
        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Alerts API error:",
          error
        );

        setLoading(false);

      });

  }, []);


  if (loading) {

    return (
      <div className="page">

        <div className="loading-box">

          <div className="loading-spinner"></div>

          <h2>
            Loading Alerts...
          </h2>

          <p>
            Fetching aircraft health alerts.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="page">

      <div className="page-intro">

        <div>

          <h3>
            Maintenance Alerts
          </h3>

          <p>
            AI-generated alerts from aircraft health monitoring.
          </p>

        </div>

      </div>


      <div className="alerts-page-list">

        {alerts.map((alert) => (

          <div
            className="panel alert-detail-card"
            key={alert.id}
          >

            <div className="alert-detail-icon">
              !
            </div>


            <div className="alert-detail-content">

              <div className="alert-detail-top">

                <div>

                  <span className="aircraft-id">
                    {alert.aircraft}
                  </span>

                  <h3>
                    {alert.title}
                  </h3>

                </div>


                <span
                  className={
                    alert.priority ===
                    "Critical"
                      ? "priority-badge critical"
                      : "priority-badge high"
                  }
                >
                  {alert.priority}
                </span>

              </div>


              <p>
                {alert.description}
              </p>


              <small>
                {alert.time}
              </small>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


// ======================================================
// MAINTENANCE PAGE
// ======================================================

function MaintenancePage() {

  const [maintenance, setMaintenance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetch(
      "/api/maintenance"
    )

      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch maintenance data"
          );
        }

        return response.json();

      })

      .then((data) => {

        setMaintenance(data);
        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Maintenance API error:",
          error
        );

        setLoading(false);

      });

  }, []);


  if (loading) {

    return (
      <div className="page">

        <div className="loading-box">

          <div className="loading-spinner"></div>

          <h2>
            Loading Maintenance Plan...
          </h2>

          <p>
            Fetching predictive maintenance recommendations.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="page">

      <div className="page-intro">

        <div>

          <h3>
            Maintenance Planning
          </h3>

          <p>
            Predictive maintenance recommendations and scheduling.
          </p>

        </div>

      </div>


      <div className="maintenance-list">

        {maintenance.map((item) => (

          <div
            className="panel maintenance-card"
            key={item.id}
          >

            <div className="maintenance-card-left">

              <div className="maintenance-icon large">
                ⚙
              </div>


              <div>

                <span className="aircraft-id">
                  {item.aircraft}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

              </div>

            </div>


            <div className="maintenance-card-right">

              <span
                className={
                  item.priority ===
                  "High Priority"
                    ? "priority-badge critical"
                    : "priority-badge high"
                }
              >
                {item.priority}
              </span>


              <div>

                <span>
                  Recommended window
                </span>

                <strong>
                  {item.window}
                </strong>

              </div>


              <div>

                <span>
                  Next available slot
                </span>

                <strong>
                  {item.nextSlot}
                </strong>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


// ======================================================
// SPARES PAGE
// ======================================================

function SparesPage() {

  const [spares, setSpares] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetch(
      "/api/spares"
    )

      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Failed to fetch spare parts"
          );
        }

        return response.json();

      })

      .then((data) => {

        setSpares(data);
        setLoading(false);

      })

      .catch((error) => {

        console.error(
          "Spares API error:",
          error
        );

        setLoading(false);

      });

  }, []);


  if (loading) {

    return (
      <div className="page">

        <div className="loading-box">

          <div className="loading-spinner"></div>

          <h2>
            Loading Spare Parts...
          </h2>

          <p>
            Fetching spare-part availability.
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="page">

      <div className="page-intro">

        <div>

          <h3>
            Spare Parts Intelligence
          </h3>

          <p>
            Predicted spare requirements linked with maintenance needs.
          </p>

        </div>

      </div>


      <div className="spares-grid">

        {spares.map((spare) => (

          <div
            className="panel spare-card"
            key={spare.id}
          >

            <div className="spare-header">

              <div className="spare-icon">
                ▣
              </div>


              <span
                className={
                  spare.status ===
                  "Available"
                    ? "spare-status available"
                    : "spare-status reorder"
                }
              >
                {spare.status}
              </span>

            </div>


            <span className="aircraft-id">
              {spare.aircraft}
            </span>


            <h3>
              {spare.name}
            </h3>


            <p>
              {spare.description}
            </p>


            <div className="spare-footer">

              <span>
                Required quantity
              </span>

              <strong>
                {spare.quantity} units
              </strong>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


// ======================================================
// AIRCRAFT TABLE
// ======================================================

function AircraftTable({
  aircraftData,
  setActivePage,
}) {

  return (
    <div className="table-wrapper">

      <table className="aircraft-table">

        <thead>

          <tr>

            <th>
              Aircraft
            </th>

            <th>
              Type
            </th>

            <th>
              Health
            </th>

            <th>
              Risk
            </th>

            <th>
              RUL
            </th>

            <th>
              Status
            </th>

            <th>
              Location
            </th>

          </tr>

        </thead>


        <tbody>

          {aircraftData.map(
            (aircraft) => (

              <tr
                key={aircraft.id}
                onClick={() =>
                  setActivePage(
                    "aircraft"
                  )
                }
              >

                <td>
                  <strong>
                    {aircraft.id}
                  </strong>
                </td>


                <td>
                  {aircraft.type}
                </td>


                <td>

                  <div className="health-cell">

                    <span>
                      {aircraft.health}%
                    </span>


                    <div className="mini-progress">

                      <div
                        style={{
                          width: `${aircraft.health}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                </td>


                <td>

                  <span
                    className={
                      aircraft.risk ===
                      "Low"
                        ? "table-risk low"
                        : "table-risk high"
                    }
                  >
                    {aircraft.risk}
                  </span>

                </td>


                <td>
                  {aircraft.rul} hrs
                </td>


                <td>

                  <span
                    className={
                      aircraft.status ===
                      "Ready"
                        ? "status-badge ready"
                        : aircraft.status ===
                          "Maintenance"
                        ? "status-badge attention"
                        : "status-badge attention"
                    }
                  >
                    {aircraft.status}
                  </span>

                </td>


                <td>
                  {aircraft.location}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}


// ======================================================
// COMPONENT HEALTH
// ======================================================

function Component({
  name,
  health,
  status,
}) {

  return (
    <div className="component-row">

      <div className="component-name">

        <strong>
          {name}
        </strong>

        <span>
          {status}
        </span>

      </div>


      <div className="component-progress">

        <div className="component-bar">

          <div
            style={{
              width: health,
            }}
          ></div>

        </div>


        <strong>
          {health}
        </strong>

      </div>

    </div>
  );
}


// ======================================================
// SENSOR CARD
// ======================================================

function SensorCard({
  title,
  value,
  unit,
  status,
}) {

  return (
    <div className="panel sensor-card">

      <div className="sensor-top">

        <span>
          {title}
        </span>


        <span
          className={
            status === "Normal"
              ? "sensor-status normal"
              : "sensor-status attention"
          }
        >
          {status}
        </span>

      </div>


      <div className="sensor-value">

        <strong>
          {value}
        </strong>

        <span>
          {unit}
        </span>

      </div>

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  subtitle,
  icon,
  type = "",
}) {

  return (
    <div
      className={`stat-card ${type}`}
    >

      <div className="stat-icon">
        {icon}
      </div>


      <div className="stat-content">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {subtitle}
        </small>

      </div>

    </div>
  );
}


// ======================================================
// EXPORT
// ======================================================

export default App;