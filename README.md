# AEGIS — Smart Disaster & Climate Response Platform

> **AEGIS** is a production-quality, cyber-tactical climate intelligence and emergency response platform built to visualize and manage compound natural disasters, with primary operational depth in **Tropical Cyclones** and **Hydrological Floods**.

---

## 🌟 Key Features

### 🌀 Cyclone Tracking & Atmospheric Dynamics
- **Real-Time Vortex Simulation**: Over 1,000 active wind streamlines simulating cyclonic inflow acceleration into the storm eyewall (up to 265 km/h).
- **Interactive Storm Suite**: Pre-configured with *Super Cyclone AMRITA* (Category 5, 912 hPa), *Hurricane ZEPHYR* (Category 4), and *Typhoon MARAS* (Category 4).
- **Surge Overtopping Profiler**: Models astronomical king tides and storm surge wave crests (+5.8m).
- **Forecast Trajectory Cone**: Interactive timeline scrubber traversing past track (-36h), current eyewall (NOW), landfall (+6h), and inland dissipation.

### 🌊 Flood & Hydrological Deluge Engine
- **Interactive Water Level Slider (+0.0m to +6.0m)**: Dynamically simulates flood inundation, recalculating submerged surface area ($km^2$), displaced population, and cut-off bridges.
- **River Gauge Mesh Network**: Live river telemetry for Padma, Jamuna, Hooghly, and Meghna stations with stage alerts.
- **Dam & Reservoir Early Warning**: Tracks storage capacity, gate openings, and discharge rates.
- **Drainage Surcharge & Embankment Leaks**: Real-time alerts for culvert backflow and levee structural piping.

### 🛡️ Citizen Risk Assessment & Action Navigator ("Am I Safe?")
- **Location Risk Profiler**: Instant risk assessment for Kolkata, New Orleans, Dhaka, Miami, Tampa, Manila, and Chennai.
- **Composite Risk Score (0–100)**: Multi-vector breakdown across Flood Inundation, Cyclone Wind Gusts, Storm Surge Ingress, Power Grid Failure, and Drainage Choke.
- **Personalized 72-Hour Survival Kit**: Interactive checklist with live readiness percentage.
- **Designated Multipurpose Shelters**: Real-time capacity, occupancy, and elevation.
- **Offline Civil Defense Survival Pass**: Generates a printable/downloadable evacuation pass with emergency QR code.

### 🚨 Emergency Response Dispatch & SOS Queue
- **Live Distress Beacon Queue**: Prioritized feed of citizen distress calls with severity ratings, water depths, and trapped counts.
- **SOS Report Form**: Allows citizens to submit emergency reports with hazard classification, trapped counts, medical needs, and simulated photo evidence.
- **Tactical Asset Deployment**: Dispatch air rescue helicopters, amphibious zodiac boats, high-water trucks, and medical triage teams.

### 🧪 "What-If" Disaster Simulation Sandbox
- Custom compounding parameters: Cyclone Intensity (Cat 1–5), 24h Rainfall (50–600mm), Storm Surge Peak, Astronomical Tide, Levee Integrity, and Drainage Pump Status.
- Real-time recalculation of compound flood crests, displaced populations, projected economic damage ($ Billions), submerged hospitals, and shelter bed deficits.

### 📡 CAP 1.2 Protocol & Siren Studio
- OASIS Common Alerting Protocol (CAP 1.2) XML and JSON alert generator.
- Multi-lingual emergency translation preview (English, Bengali, Hindi, Spanish, Tagalog, French).
- Authentic **Emergency Audio Siren** utilizing Web Audio API dual-frequency oscillators (853 Hz + 960 Hz) and emergency screen strobing.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+) or any standard modern web browser.
- **Zero external dependencies required** — pure HTML5, CSS3, Canvas2D, and Web Audio API.

### Running Locally

```bash
# Clone the repository
git clone https://github.com/sawantrachit9-ai/aegis-platform.git
cd aegis-platform

# Start the built-in HTTP server
node server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## ⌨️ Keyboard Shortcuts

| Key | Description |
|:---:|:---|
| `1` | Operational War Room |
| `2` | Cyclone Command |
| `3` | Flood Command |
| `4` | Citizen Safety Navigator |
| `5` | Emergency Dispatch Queue |
| `6` | Simulation Sandbox |
| `7` | CAP Alert Broadcast |
| `M` | Master Audio Toggle (Mute/Unmute) |
| `F` | Reset & Recenter Geospatial Canvas |

---

## 📄 License
MIT License. Built for civil defense, humanitarian relief, and disaster preparedness.
