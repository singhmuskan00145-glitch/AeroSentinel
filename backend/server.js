const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());
// Serve React frontend
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

// ===============================
// BASIC ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "AeroSentinel API is running",
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "operational",
    service: "AeroSentinel Backend",
  });
});

// ===============================
// AIRCRAFT DATA
// ===============================

const aircraftData = [
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

// ===============================
// AIRCRAFT API
// ===============================

app.get("/api/aircraft", (req, res) => {
  res.json(aircraftData);
});

// ===============================
// DASHBOARD SUMMARY
// ===============================

app.get("/api/dashboard-summary", (req, res) => {
  const total = aircraftData.length;

  const ready = aircraftData.filter(
    (aircraft) => aircraft.status === "Ready"
  ).length;

  const maintenance = aircraftData.filter(
    (aircraft) => aircraft.status === "Maintenance"
  ).length;

  const atRisk = aircraftData.filter(
    (aircraft) => aircraft.risk === "High"
  ).length;

  res.json({
    total,
    ready,
    maintenance,
    atRisk,
  });
});

// ===============================
// ALERT DATA
// ===============================

const alertsData = [
  {
    id: 1,
    aircraft: "A-107",
    title: "Engine Vibration Anomaly",
    description:
      "Vibration levels are above the expected operating range.",
    priority: "Critical",
    time: "12 min ago",
  },
  {
    id: 2,
    aircraft: "A-114",
    title: "Hydraulic Pressure Trend",
    description:
      "Hydraulic pressure is showing an abnormal downward trend.",
    priority: "High",
    time: "34 min ago",
  },
  {
    id: 3,
    aircraft: "A-121",
    title: "Temperature Deviation",
    description:
      "Engine temperature is deviating from the normal operating profile.",
    priority: "High",
    time: "1 hr ago",
  },
];

// ===============================
// ALERTS API
// ===============================

app.get("/api/alerts", (req, res) => {
  res.json(alertsData);
});

// ===============================
// MAINTENANCE DATA
// ===============================

const maintenanceData = [
  {
    id: 1,
    aircraft: "A-107",
    title: "Engine Bearing Inspection",
    description:
      "Increasing engine vibration indicates possible bearing degradation.",
    priority: "High Priority",
    window: "Today",
    nextSlot: "14:00",
  },
  {
    id: 2,
    aircraft: "A-114",
    title: "Hydraulic System Inspection",
    description:
      "Pressure trend indicates possible hydraulic system degradation.",
    priority: "Medium Priority",
    window: "Tomorrow",
    nextSlot: "09:30",
  },
];

// ===============================
// MAINTENANCE API
// ===============================

app.get("/api/maintenance", (req, res) => {
  res.json(maintenanceData);
});

// ===============================
// SPARES DATA
// ===============================

const sparesData = [
  {
    id: 1,
    aircraft: "A-107",
    partNumber: "B-221",
    name: "Engine Bearing",
    description: "Engine bearing assembly",
    status: "Available",
    quantity: 2,
  },
  {
    id: 2,
    aircraft: "A-114",
    partNumber: "H-114",
    name: "Hydraulic Seal",
    description: "Hydraulic system seal kit",
    status: "Reorder",
    quantity: 4,
  },
];

// ===============================
// SPARES API
// ===============================

app.get("/api/spares", (req, res) => {
  res.json(sparesData);
});

// ===============================
// SENSOR DATA
// ===============================

const sensorData = {
  aircraft: "A-107",

  sensors: [
    {
      name: "Engine Temperature",
      value: 684,
      unit: "°C",
      status: "Normal",
    },
    {
      name: "Vibration",
      value: 7.8,
      unit: "mm/s",
      status: "Attention",
    },
    {
      name: "Oil Pressure",
      value: 42,
      unit: "psi",
      status: "Normal",
    },
    {
      name: "Engine RPM",
      value: 8420,
      unit: "RPM",
      status: "Normal",
    },
  ],

  vibrationTrend: [
    3.2,
    3.5,
    3.4,
    3.8,
    3.7,
    4.1,
    4.0,
    4.6,
    5.0,
    5.4,
    6.1,
    7.8,
  ],

  vibrationChange: 18.2,

  assessment:
    "Vibration trend is increasing and requires attention. The system has flagged A-107 for predictive inspection.",
};

// ===============================
// SENSOR API
// ===============================

app.get("/api/sensors/A-107", (req, res) => {
  res.json(sensorData);
});

// ===============================
// COMPONENT HEALTH DATA
// ===============================

const componentHealthData = {
  "A-107": {
    aircraft: "A-107",

    components: [
      {
        name: "Engine",
        health: 72,
        status: "Attention",
      },
      {
        name: "Hydraulic",
        health: 86,
        status: "Normal",
      },
      {
        name: "Avionics",
        health: 93,
        status: "Normal",
      },
      {
        name: "Fuel",
        health: 91,
        status: "Normal",
      },
    ],

    recommendation: "Schedule inspection",

    reason:
      "Increasing vibration trend indicates possible engine bearing degradation.",
  },

  "A-108": {
    aircraft: "A-108",

    components: [
      {
        name: "Engine",
        health: 95,
        status: "Normal",
      },
      {
        name: "Hydraulic",
        health: 94,
        status: "Normal",
      },
      {
        name: "Avionics",
        health: 96,
        status: "Normal",
      },
      {
        name: "Fuel",
        health: 92,
        status: "Normal",
      },
    ],

    recommendation: "Continue normal operation",

    reason:
      "All major component health indicators are within the normal operating range.",
  },

  "A-109": {
    aircraft: "A-109",

    components: [
      {
        name: "Engine",
        health: 90,
        status: "Normal",
      },
      {
        name: "Hydraulic",
        health: 88,
        status: "Normal",
      },
      {
        name: "Avionics",
        health: 91,
        status: "Normal",
      },
      {
        name: "Fuel",
        health: 87,
        status: "Normal",
      },
    ],

    recommendation: "Continue monitoring",

    reason:
      "Aircraft condition is stable with no major component showing critical degradation.",
  },

  "A-114": {
    aircraft: "A-114",

    components: [
      {
        name: "Engine",
        health: 76,
        status: "Attention",
      },
      {
        name: "Hydraulic",
        health: 62,
        status: "Attention",
      },
      {
        name: "Avionics",
        health: 89,
        status: "Normal",
      },
      {
        name: "Fuel",
        health: 85,
        status: "Normal",
      },
    ],

    recommendation: "Inspect hydraulic system",

    reason:
      "Hydraulic pressure trend indicates possible degradation in the hydraulic system.",
  },

  "A-121": {
    aircraft: "A-121",

    components: [
      {
        name: "Engine",
        health: 64,
        status: "Attention",
      },
      {
        name: "Hydraulic",
        health: 81,
        status: "Normal",
      },
      {
        name: "Avionics",
        health: 84,
        status: "Normal",
      },
      {
        name: "Fuel",
        health: 78,
        status: "Attention",
      },
    ],

    recommendation: "Perform temperature inspection",

    reason:
      "Engine temperature is deviating from the expected operating profile.",
  },
};

// ===============================
// COMPONENT HEALTH API
// ===============================

app.get("/api/aircraft/:aircraftId/components", (req, res) => {
  const aircraftId = req.params.aircraftId;

  const data = componentHealthData[aircraftId];

  if (!data) {
    return res.status(404).json({
      message: "Component data not found for this aircraft.",
    });
  }

  res.json(data);
});

// ===============================
// PREDICTIVE RISK API
// ===============================
// NOTE:
// This is currently a rule-based baseline.
// It is NOT the final ML model yet.
// Later we will replace this with
// actual Machine Learning prediction.
// ===============================

app.get("/api/prediction/:aircraftId", (req, res) => {
  const aircraftId = req.params.aircraftId;

  const aircraft = aircraftData.find(
    (item) => item.id === aircraftId
  );

  if (!aircraft) {
    return res.status(404).json({
      message: "Aircraft not found",
    });
  }

  let riskScore = 0;

  // Health based score
  if (aircraft.health < 70) {
    riskScore += 40;
  } else if (aircraft.health < 80) {
    riskScore += 25;
  } else if (aircraft.health < 90) {
    riskScore += 10;
  }

  // Risk based score
  if (aircraft.risk === "High") {
    riskScore += 30;
  }

  // RUL based score
  if (aircraft.rul < 60) {
    riskScore += 25;
  } else if (aircraft.rul < 100) {
    riskScore += 15;
  }

  // Maximum score = 100
  riskScore = Math.min(riskScore, 100);

  // Prediction category
  let prediction;

  if (riskScore >= 60) {
    prediction = "High";
  } else if (riskScore >= 30) {
    prediction = "Medium";
  } else {
    prediction = "Low";
  }

  // Recommendation
  let recommendation;

  if (prediction === "High") {
    recommendation =
      "Schedule inspection before the next operational cycle.";
  } else if (prediction === "Medium") {
    recommendation =
      "Continue monitoring and plan preventive inspection.";
  } else {
    recommendation =
      "Aircraft condition is stable. Continue normal monitoring.";
  }

  res.json({
    aircraft: aircraftId,
    riskScore,
    prediction,
    recommendation,
    rul: aircraft.rul,
    health: aircraft.health,
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AeroSentinel backend running on port ${PORT}`);
});