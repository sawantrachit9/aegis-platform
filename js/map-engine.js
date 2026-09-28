/**
 * AEGIS Tactical Geospatial Canvas Visualization Engine
 * Renders vector coastlines, dynamic cyclone vortex particles,
 * real-time water inundation contours, radar sweeps, and telemetry markers.
 */

class AegisMapEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Viewport transform
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Map Center (Default to Bengal Delta / Cyclone Amrita focus)
    this.focusRegion = 'bengal'; // 'bengal', 'gulf', 'global'

    // Layers toggle state
    this.layers = {
      radarSweep: true,
      windParticles: true,
      floodInundation: true,
      stormCone: true,
      isobars: true,
      shelters: true,
      distressSOS: true,
      riverGauges: true
    };

    // Simulation variables
    this.floodWaterLevel = 3.5; // meters above baseline (0.0 to 6.0m)
    this.radarAngle = 0;
    this.activeCyclone = window.AEGIS_DATA.cyclones[0];
    this.selectedIncident = null;
    this.inspectedSector = null;

    // Wind particles
    this.particleCount = 1000;
    this.particles = [];
    this.initParticles();

    // Setup event listeners
    this.setupEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.viewWidth = rect.width;
    this.viewHeight = rect.height;

    // Center initial view if not panned
    if (this.panX === 0 && this.panY === 0) {
      this.panX = this.viewWidth / 2;
      this.panY = this.viewHeight / 2;
    }
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    // Generate particles in a polar distribution around storm center
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 320;
    return {
      angle: angle,
      distance: distance,
      speed: (0.015 + Math.random() * 0.025) * (180 / Math.max(distance, 35)),
      radialInflow: 0.35 + Math.random() * 0.45,
      life: 50 + Math.random() * 120,
      maxLife: 150,
      size: 1 + Math.random() * 1.8
    };
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.panX += dx;
        this.panY += dy;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }

      // Convert screen coords to geographic coordinates
      this.updateCoordHUD(mouseX, mouseY);
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.max(0.4, Math.min(6.0, this.zoom * zoomFactor));

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Zoom towards mouse position
      this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
      this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
      this.zoom = newZoom;
    }, { passive: false });

    // Click to inspect
    this.canvas.addEventListener('click', (e) => {
      if (Math.abs(e.clientX - this.lastMouseX) > 5 || Math.abs(e.clientY - this.lastMouseY) > 5) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.handleMapClick(mouseX, mouseY);
    });

    // Touch support for mobile / tablets
    let initialTouchDistance = null;
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        initialTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.panX += dx;
        this.panY += dy;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2 && initialTouchDistance) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / initialTouchDistance;
        this.zoom = Math.max(0.4, Math.min(6.0, this.zoom * factor));
        initialTouchDistance = dist;
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
      initialTouchDistance = null;
    });
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.panX) / this.zoom,
      y: (sy - this.panY) / this.zoom
    };
  }

  worldToScreen(wx, wy) {
    return {
      x: wx * this.zoom + this.panX,
      y: wy * this.zoom + this.panY
    };
  }

  updateCoordHUD(screenX, screenY) {
    const world = this.screenToWorld(screenX, screenY);
    // Approximate Lat/Lon conversion for tactical view
    const lat = (23.5 - world.y * 0.015).toFixed(3);
    const lon = (86.0 + world.x * 0.015).toFixed(3);

    const hudLatLon = document.getElementById('hud-latlon');
    const hudElevation = document.getElementById('hud-elevation');
    const hudSectorRisk = document.getElementById('hud-sector-risk');

    if (hudLatLon) hudLatLon.textContent = `${Math.abs(lat)}° ${lat >= 0 ? 'N' : 'S'} | ${Math.abs(lon)}° ${lon >= 0 ? 'E' : 'W'}`;

    // Synthetic elevation based on distance from coast / delta center
    const distFromSea = Math.max(0, -world.y + 120);
    const elev = Math.max(0.4, (distFromSea * 0.035) + Math.sin(world.x * 0.02) * 1.5).toFixed(1);
    if (hudElevation) hudElevation.textContent = `${elev}m MSL`;

    if (hudSectorRisk) {
      if (elev < 3.0) {
        hudSectorRisk.textContent = 'HIGH SURGE / DELUGE ZONE';
        hudSectorRisk.className = 'tactical-tag risk-critical';
      } else if (elev < 6.0) {
        hudSectorRisk.textContent = 'MODERATE INUNDATION RISK';
        hudSectorRisk.className = 'tactical-tag risk-warning';
      } else {
        hudSectorRisk.textContent = 'ELEVATED SAFE PROFILE';
        hudSectorRisk.className = 'tactical-tag risk-safe';
      }
    }
  }

  handleMapClick(screenX, screenY) {
    const world = this.screenToWorld(screenX, screenY);
    window.aegisAudio.playClick();

    // Check if clicked near an SOS incident
    const incidents = window.AEGIS_DATA.distressIncidents;
    for (const inc of incidents) {
      const incWorldX = inc.coordinates.x - 500;
      const incWorldY = inc.coordinates.y - 350;
      const dist = Math.hypot(world.x - incWorldX, world.y - incWorldY);
      if (dist < 25 / this.zoom) {
        this.selectIncident(inc);
        return;
      }
    }

    // Otherwise inspect clicked geographic sector
    const lat = (23.5 - world.y * 0.015).toFixed(3);
    const lon = (86.0 + world.x * 0.015).toFixed(3);
    const distFromSea = Math.max(0, -world.y + 120);
    const elev = Math.max(0.4, (distFromSea * 0.035) + Math.sin(world.x * 0.02) * 1.5).toFixed(1);

    this.inspectedSector = {
      lat,
      lon,
      elevation: elev,
      floodDepth: Math.max(0, (this.floodWaterLevel - elev)).toFixed(2),
      windForecast: Math.round(180 - distFromSea * 0.4),
      evacTime: (elev < 3 ? 'Immediate (< 2 hrs)' : 'Standard (4-6 hrs)')
    };

    if (window.onSectorInspected) {
      window.onSectorInspected(this.inspectedSector);
    }
  }

  selectIncident(incident) {
    this.selectedIncident = incident;
    if (window.onIncidentSelected) {
      window.onIncidentSelected(incident);
    }
    window.aegisAudio.playAlertChime();
  }

  setFocus(regionName) {
    this.focusRegion = regionName;
    if (regionName === 'bengal') {
      this.panX = this.viewWidth * 0.45;
      this.panY = this.viewHeight * 0.52;
      this.zoom = 1.35;
      this.activeCyclone = window.AEGIS_DATA.cyclones[0];
    } else if (regionName === 'gulf') {
      this.panX = this.viewWidth * 0.5;
      this.panY = this.viewHeight * 0.5;
      this.zoom = 1.2;
      this.activeCyclone = window.AEGIS_DATA.cyclones[1];
    } else {
      this.panX = this.viewWidth * 0.5;
      this.panY = this.viewHeight * 0.5;
      this.zoom = 0.85;
    }
    window.aegisAudio.playRadarPing();
  }

  setFloodWaterLevel(level) {
    this.floodWaterLevel = parseFloat(level);
  }

  toggleLayer(layerName) {
    if (this.layers.hasOwnProperty(layerName)) {
      this.layers[layerName] = !this.layers[layerName];
      window.aegisAudio.playClick();
      return this.layers[layerName];
    }
    return false;
  }

  animate() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

    // Dark tactical background
    this.ctx.fillStyle = '#060a12';
    this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

    // Apply viewport transformation
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoom, this.zoom);

    // 1. Render Tactical Coordinate Grid
    this.drawTacticalGrid();

    // 2. Render Coastline, Islands, and River Arteries
    this.drawTerrainAndCoastlines();

    // 3. Render Dynamic Flood Inundation Layer
    if (this.layers.floodInundation) {
      this.drawFloodInundation();
    }

    // 4. Render Isobars & Atmospheric Pressure Rings
    if (this.layers.isobars) {
      this.drawIsobars();
    }

    // 5. Render Cyclone Forecast Cone & Trajectory
    if (this.layers.stormCone) {
      this.drawStormTrajectory();
    }

    // 6. Render Wind Field Streamlines & Vortex Particles
    if (this.layers.windParticles) {
      this.drawWindParticles();
    }

    // 7. Render River Monitoring Gauges
    if (this.layers.riverGauges) {
      this.drawRiverGauges();
    }

    // 8. Render Emergency Safe Shelters
    if (this.layers.shelters) {
      this.drawSafeShelters();
    }

    // 9. Render Distress Incidents (SOS Pins)
    if (this.layers.distressSOS) {
      this.drawDistressIncidents();
    }

    // 10. Render Active Cyclone Eye & Eyewall
    this.drawCycloneEye();

    this.ctx.restore();

    // 11. Render Foreground Overlays (Radar Sweep Beam, Reticle & Compass HUD)
    if (this.layers.radarSweep) {
      this.drawRadarSweep();
    }
    this.drawMapHUD();

    this.ctx.restore();

    // Update animations
    this.radarAngle = (this.radarAngle + 0.015) % (Math.PI * 2);
    requestAnimationFrame(this.animate);
  }

  drawTacticalGrid() {
    this.ctx.lineWidth = 1 / this.zoom;
    this.ctx.strokeStyle = 'rgba(24, 48, 80, 0.45)';

    const step = 80;
    const minX = -1200;
    const maxX = 1200;
    const minY = -900;
    const maxY = 900;

    this.ctx.beginPath();
    for (let x = minX; x <= maxX; x += step) {
      this.ctx.moveTo(x, minY);
      this.ctx.lineTo(x, maxY);
    }
    for (let y = minY; y <= maxY; y += step) {
      this.ctx.moveTo(minX, y);
      this.ctx.lineTo(maxX, y);
    }
    this.ctx.stroke();

    // Grid coordinates font
    this.ctx.font = `${10 / this.zoom}px 'JetBrains Mono', monospace`;
    this.ctx.fillStyle = 'rgba(70, 130, 180, 0.4)';
    for (let x = minX; x <= maxX; x += step * 2) {
      this.ctx.fillText(`${(80 + x * 0.02).toFixed(1)}°E`, x + 4, minY + 15);
    }
    for (let y = minY; y <= maxY; y += step * 2) {
      this.ctx.fillText(`${(26 - y * 0.02).toFixed(1)}°N`, minX + 4, y - 4);
    }
  }

  drawTerrainAndCoastlines() {
    // Sea / Bay base fill
    this.ctx.fillStyle = '#081220';
    this.ctx.fillRect(-1200, -900, 2400, 1800);

    // Vector Coastline & Delta Estuaries (Bengal Basin & Sundarbans Geometry)
    this.ctx.beginPath();
    this.ctx.moveTo(-900, -500);
    this.ctx.lineTo(-400, -420);
    this.ctx.quadraticCurveTo(-220, -320, -150, -200);
    this.ctx.quadraticCurveTo(-80, -100, -40, 20); // Odisha Coast
    this.ctx.lineTo(60, 40); // Digha / West Bengal
    this.ctx.bezierCurveTo(120, 0, 180, 80, 240, 60); // Sagar Island & Hooghly mouth
    this.ctx.bezierCurveTo(320, 20, 380, 110, 480, 90); // Sundarbans delta intricate mouth
    this.ctx.bezierCurveTo(560, 70, 640, 120, 720, 140); // Meghna estuary
    this.ctx.bezierCurveTo(800, 160, 890, 80, 1000, 10); // Chittagong coast
    this.ctx.lineTo(1200, -20);
    this.ctx.lineTo(1200, -900);
    this.ctx.lineTo(-900, -900);
    this.ctx.closePath();

    // Landmass styling
    this.ctx.fillStyle = '#0f1b2e';
    this.ctx.fill();
    this.ctx.lineWidth = 2.5 / this.zoom;
    this.ctx.strokeStyle = '#295078';
    this.ctx.stroke();

    // Elevation contours inland
    this.ctx.lineWidth = 1 / this.zoom;
    this.ctx.strokeStyle = 'rgba(45, 90, 135, 0.35)';
    this.ctx.beginPath();
    this.ctx.moveTo(-900, -600);
    this.ctx.bezierCurveTo(-300, -450, 100, -380, 600, -320);
    this.ctx.bezierCurveTo(800, -300, 1000, -400, 1200, -420);
    this.ctx.stroke();

    // Major River Arteries
    this.ctx.lineWidth = 3 / this.zoom;
    this.ctx.strokeStyle = '#1a6b98';

    // Hooghly River
    this.ctx.beginPath();
    this.ctx.moveTo(180, -700);
    this.ctx.quadraticCurveTo(150, -400, 200, -180);
    this.ctx.quadraticCurveTo(230, -50, 210, 60);
    this.ctx.stroke();

    // Padma / Ganges Mainstem
    this.ctx.lineWidth = 4 / this.zoom;
    this.ctx.beginPath();
    this.ctx.moveTo(-200, -850);
    this.ctx.bezierCurveTo(100, -650, 320, -500, 420, -300);
    this.ctx.bezierCurveTo(500, -150, 580, -50, 650, 120);
    this.ctx.stroke();

    // Brahmaputra / Jamuna Confluence
    this.ctx.lineWidth = 3.5 / this.zoom;
    this.ctx.beginPath();
    this.ctx.moveTo(680, -850);
    this.ctx.quadraticCurveTo(620, -550, 520, -280);
    this.ctx.stroke();

    // Delta Mangrove Islands (Sundarbans cluster)
    this.ctx.fillStyle = '#14273d';
    this.ctx.strokeStyle = '#224d77';
    this.ctx.lineWidth = 1.2 / this.zoom;
    const islands = [
      { x: 260, y: 75, r: 18 },
      { x: 310, y: 90, r: 24 },
      { x: 365, y: 82, r: 19 },
      { x: 420, y: 105, r: 28 },
      { x: 490, y: 95, r: 22 },
      { x: 550, y: 115, r: 26 }
    ];
    for (const isl of islands) {
      this.ctx.beginPath();
      this.ctx.ellipse(isl.x, isl.y, isl.r * 1.3, isl.r * 0.7, 0.3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  drawFloodInundation() {
    // Calculate inundation penetration based on floodWaterLevel (0m to 6m)
    const surgeMultiplier = this.floodWaterLevel / 4.0;
    const penetrationY = Math.min(220, 60 * surgeMultiplier);

    this.ctx.save();
    // Glowing animated water wash
    const pulse = Math.sin(Date.now() * 0.002) * 4;

    // Coastal Storm Surge Inundation polygon
    this.ctx.beginPath();
    this.ctx.moveTo(-100, 30);
    this.ctx.bezierCurveTo(100, -penetrationY * 0.8 + pulse, 300, -penetrationY * 1.1 - pulse, 750, -penetrationY * 0.9);
    this.ctx.lineTo(820, 150);
    this.ctx.lineTo(60, 90);
    this.ctx.closePath();

    // Cyan flood gradient
    const floodGrad = this.ctx.createLinearGradient(0, -penetrationY, 0, 120);
    floodGrad.addColorStop(0, 'rgba(0, 229, 255, 0.1)');
    floodGrad.addColorStop(0.5, `rgba(0, 210, 255, ${0.35 + surgeMultiplier * 0.15})`);
    floodGrad.addColorStop(1, `rgba(0, 140, 255, ${0.55 + surgeMultiplier * 0.15})`);

    this.ctx.fillStyle = floodGrad;
    this.ctx.fill();

    // High risk inundation border contour
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = (2 + surgeMultiplier) / this.zoom;
    this.ctx.setLineDash([8 / this.zoom, 4 / this.zoom]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // River corridor flooding (spillover zones along Padma & Hooghly)
    this.ctx.lineWidth = (16 * surgeMultiplier) / this.zoom;
    this.ctx.strokeStyle = `rgba(0, 229, 255, ${0.28 + surgeMultiplier * 0.1})`;
    this.ctx.beginPath();
    this.ctx.moveTo(180, -500);
    this.ctx.quadraticCurveTo(170, -250, 210, 40);
    this.ctx.moveTo(50, -750);
    this.ctx.bezierCurveTo(240, -550, 420, -300, 600, 50);
    this.ctx.stroke();

    // Floating depth badges on key flood sectors
    if (this.floodWaterLevel > 1.2) {
      this.drawDepthBadge(280, 20 - penetrationY * 0.5, `+${(this.floodWaterLevel * 0.95).toFixed(1)}m INUNDATION`);
      this.drawDepthBadge(460, 40 - penetrationY * 0.7, `+${(this.floodWaterLevel * 1.12).toFixed(1)}m SURGE CREST`);
      this.drawDepthBadge(120, -20 - penetrationY * 0.4, `+${(this.floodWaterLevel * 0.7).toFixed(1)}m URBAN SURCHARGE`);
    }

    this.ctx.restore();
  }

  drawDepthBadge(x, y, text) {
    this.ctx.save();
    this.ctx.font = `bold ${10 / this.zoom}px 'JetBrains Mono', monospace`;
    const textWidth = this.ctx.measureText(text).width;
    const pad = 5 / this.zoom;

    this.ctx.fillStyle = 'rgba(2, 20, 36, 0.85)';
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 1 / this.zoom;
    this.ctx.fillRect(x - pad, y - 10 / this.zoom, textWidth + pad * 2, 14 / this.zoom);
    this.ctx.strokeRect(x - pad, y - 10 / this.zoom, textWidth + pad * 2, 14 / this.zoom);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  drawIsobars() {
    const stormX = 140; // Coordinates representing Cyclone Amrita eye
    const stormY = 190;
    const isobars = [
      { r: 45, p: 930 },
      { r: 85, p: 960 },
      { r: 145, p: 980 },
      { r: 220, p: 996 },
      { r: 310, p: 1008 }
    ];

    this.ctx.save();
    this.ctx.lineWidth = 1.2 / this.zoom;

    for (const iso of isobars) {
      this.ctx.strokeStyle = `rgba(255, 140, 0, ${0.25 + (1 - iso.r / 350) * 0.35})`;
      this.ctx.beginPath();
      // Slightly elliptical deformed isobar
      this.ctx.ellipse(stormX, stormY, iso.r * 1.15, iso.r * 0.95, -0.4, 0, Math.PI * 2);
      this.ctx.stroke();

      // Pressure label
      this.ctx.font = `${9 / this.zoom}px 'JetBrains Mono', monospace`;
      this.ctx.fillStyle = 'rgba(255, 180, 50, 0.7)';
      this.ctx.fillText(`${iso.p} hPa`, stormX + iso.r * 1.05, stormY - 5);
    }
    this.ctx.restore();
  }

  drawStormTrajectory() {
    const storm = this.activeCyclone;
    if (!storm) return;

    // Track coordinates in map projection
    const points = [
      { x: -180, y: 440, label: "-36h", stage: "Past" },
      { x: -80,  y: 350, label: "-24h", stage: "Past" },
      { x: 30,   y: 270, label: "-12h", stage: "Past" },
      { x: 140,  y: 190, label: "NOW (Cat 5)", current: true },
      { x: 250,  y: 100, label: "+6h Landfall", forecast: true },
      { x: 370,  y: -20, label: "+18h Inland", forecast: true },
      { x: 490,  y: -140, label: "+36h Dissipate", forecast: true }
    ];

    this.ctx.save();

    // 1. Cone of Uncertainty Area (Future forecast spread)
    this.ctx.beginPath();
    this.ctx.moveTo(points[3].x, points[3].y);
    this.ctx.lineTo(points[4].x - 30, points[4].y + 15);
    this.ctx.lineTo(points[5].x - 70, points[5].y + 35);
    this.ctx.lineTo(points[6].x - 120, points[6].y + 50);
    this.ctx.arc(points[6].x, points[6].y, 130, Math.PI * 0.7, -Math.PI * 0.3, true);
    this.ctx.lineTo(points[5].x + 70, points[5].y - 35);
    this.ctx.lineTo(points[4].x + 30, points[4].y - 15);
    this.ctx.closePath();

    this.ctx.fillStyle = 'rgba(255, 42, 95, 0.12)';
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255, 42, 95, 0.45)';
    this.ctx.lineWidth = 1.5 / this.zoom;
    this.ctx.setLineDash([6 / this.zoom, 4 / this.zoom]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 2. Center Track Trajectory Line
    // Past track
    this.ctx.lineWidth = 2.5 / this.zoom;
    this.ctx.strokeStyle = '#8899aa';
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[1].x, points[1].y);
    this.ctx.lineTo(points[2].x, points[2].y);
    this.ctx.lineTo(points[3].x, points[3].y);
    this.ctx.stroke();

    // Forecast track (Red warning line)
    this.ctx.strokeStyle = '#ff2a5f';
    this.ctx.beginPath();
    this.ctx.moveTo(points[3].x, points[3].y);
    this.ctx.lineTo(points[4].x, points[4].y);
    this.ctx.lineTo(points[5].x, points[5].y);
    this.ctx.lineTo(points[6].x, points[6].y);
    this.ctx.stroke();

    // 3. Track Waypoint nodes
    for (const pt of points) {
      this.ctx.beginPath();
      const radius = pt.current ? 7 / this.zoom : 4.5 / this.zoom;
      this.ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);

      if (pt.current) {
        this.ctx.fillStyle = '#ff2a5f';
        this.ctx.shadowColor = '#ff2a5f';
        this.ctx.shadowBlur = 12;
      } else if (pt.stage === 'Past') {
        this.ctx.fillStyle = '#557799';
        this.ctx.shadowBlur = 0;
      } else {
        this.ctx.fillStyle = '#ff9f1c';
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.5 / this.zoom;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Waypoint text
      this.ctx.font = `${9 / this.zoom}px 'JetBrains Mono', monospace`;
      this.ctx.fillStyle = pt.current ? '#ff2a5f' : '#cbd5e1';
      this.ctx.fillText(pt.label, pt.x + 8 / this.zoom, pt.y + 3 / this.zoom);
    }

    this.ctx.restore();
  }

  drawWindParticles() {
    const stormX = 140;
    const stormY = 190;

    this.ctx.save();
    for (let p of this.particles) {
      // Swirl physics: angular motion + radial inflow towards storm center
      p.angle += p.speed;
      p.distance -= p.radialInflow;
      p.life--;

      // If particle hits eye radius (25px) or runs out of life, regenerate at outer band
      if (p.distance < 25 || p.life <= 0) {
        Object.assign(p, this.createParticle());
      }

      const px = stormX + Math.cos(p.angle) * p.distance;
      const py = stormY + Math.sin(p.angle) * (p.distance * 0.85);

      // Color transitions: Outer (cyan/blue) -> Mid (amber) -> Eyewall (fiery red)
      let color;
      if (p.distance < 60) {
        color = 'rgba(255, 42, 95, 0.85)'; // Eyewall Cat 5
      } else if (p.distance < 140) {
        color = 'rgba(255, 159, 28, 0.75)'; // Gale force
      } else if (p.distance < 220) {
        color = 'rgba(0, 229, 255, 0.65)'; // Tropical storm
      } else {
        color = 'rgba(70, 140, 220, 0.45)'; // Outer circulation
      }

      // Draw particle streamline tail
      const tailX = px - Math.sin(p.angle) * (6 / this.zoom);
      const tailY = py + Math.cos(p.angle) * (5 / this.zoom);

      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = p.size / this.zoom;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawCycloneEye() {
    const stormX = 140;
    const stormY = 190;
    const storm = this.activeCyclone;

    this.ctx.save();
    // Pulsing danger halo
    const pulse = (Math.sin(Date.now() * 0.005) + 1) * 0.5;
    const haloRadius = (32 + pulse * 8) / this.zoom;

    // Eyewall cloud glow
    const grad = this.ctx.createRadialGradient(stormX, stormY, 10 / this.zoom, stormX, stormY, haloRadius * 1.5);
    grad.addColorStop(0, 'rgba(255, 42, 95, 0)');
    grad.addColorStop(0.3, 'rgba(255, 42, 95, 0.6)');
    grad.addColorStop(0.7, 'rgba(255, 140, 0, 0.35)');
    grad.addColorStop(1, 'rgba(255, 42, 95, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(stormX, stormY, haloRadius * 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Eye aperture (calm center)
    this.ctx.fillStyle = '#050811';
    this.ctx.beginPath();
    this.ctx.arc(stormX, stormY, 14 / this.zoom, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#ff2a5f';
    this.ctx.lineWidth = 2 / this.zoom;
    this.ctx.stroke();

    // Rotating spiral rainband arms
    const spin = Date.now() * 0.0015;
    this.ctx.strokeStyle = 'rgba(255, 75, 120, 0.4)';
    this.ctx.lineWidth = 3 / this.zoom;
    for (let i = 0; i < 3; i++) {
      const armAngle = spin + (i * Math.PI * 2) / 3;
      this.ctx.beginPath();
      this.ctx.arc(stormX, stormY, 50 / this.zoom, armAngle, armAngle + 1.2);
      this.ctx.stroke();
    }

    // Telemetry label badge
    this.ctx.font = `bold ${11 / this.zoom}px 'JetBrains Mono', monospace`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`${storm.name.toUpperCase()}`, stormX + 24 / this.zoom, stormY - 14 / this.zoom);

    this.ctx.font = `${9.5 / this.zoom}px 'JetBrains Mono', monospace`;
    this.ctx.fillStyle = '#ff2a5f';
    this.ctx.fillText(`CAT ${storm.category} | ${storm.maxWindsKmh} KM/H | ${storm.pressure} hPa`, stormX + 24 / this.zoom, stormY);

    this.ctx.restore();
  }

  drawRiverGauges() {
    const gauges = [
      { name: "Padma (Goalundo)", x: 280, y: -360, stage: "+10.42m", status: "CRITICAL" },
      { name: "Jamuna (Bahadurabad)", x: 440, y: -480, stage: "+21.30m", status: "RECORD" },
      { name: "Hooghly (Garden Reach)", x: 190, y: -160, stage: "+6.85m", status: "SURGE" },
      { name: "Meghna (Chandpur)", x: 540, y: -90, stage: "+5.40m", status: "MAJOR" }
    ];

    this.ctx.save();
    for (const g of gauges) {
      // Gauge mast icon
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.beginPath();
      this.ctx.arc(g.x, g.y, 4 / this.zoom, 0, Math.PI * 2);
      this.ctx.fill();

      // Flashing gauge pulse
      this.ctx.strokeStyle = g.status === 'CRITICAL' || g.status === 'RECORD' ? 'rgba(255, 42, 95, 0.7)' : 'rgba(0, 229, 255, 0.7)';
      this.ctx.lineWidth = 1 / this.zoom;
      this.ctx.strokeRect(g.x - 2 / this.zoom, g.y - 12 / this.zoom, 4 / this.zoom, 12 / this.zoom);

      // Label
      this.ctx.font = `${9 / this.zoom}px 'JetBrains Mono', monospace`;
      this.ctx.fillStyle = '#89cff0';
      this.ctx.fillText(`${g.name}`, g.x + 8 / this.zoom, g.y - 4 / this.zoom);
      this.ctx.fillStyle = g.status === 'CRITICAL' ? '#ff2a5f' : '#00e5ff';
      this.ctx.fillText(`${g.stage} [${g.status}]`, g.x + 8 / this.zoom, g.y + 8 / this.zoom);
    }
    this.ctx.restore();
  }

  drawSafeShelters() {
    const shelters = [
      { name: "Salt Lake Mega-Shelter", x: 210, y: -180, cap: "74%" },
      { name: "Kakdwip High Haven", x: 180, y: 40, cap: "92%" },
      { name: "Barisal Relief Complex", x: 580, y: 20, cap: "68%" },
      { name: "Kanthi Elevated Center", x: 20, y: 30, cap: "85%" }
    ];

    this.ctx.save();
    for (const s of shelters) {
      // Emerald shelter square
      this.ctx.fillStyle = 'rgba(0, 255, 163, 0.2)';
      this.ctx.strokeStyle = '#00ffa3';
      this.ctx.lineWidth = 1.5 / this.zoom;
      this.ctx.fillRect(s.x - 6 / this.zoom, s.y - 6 / this.zoom, 12 / this.zoom, 12 / this.zoom);
      this.ctx.strokeRect(s.x - 6 / this.zoom, s.y - 6 / this.zoom, 12 / this.zoom, 12 / this.zoom);

      // Cross inside shelter
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y - 3 / this.zoom);
      this.ctx.lineTo(s.x, s.y + 3 / this.zoom);
      this.ctx.moveTo(s.x - 3 / this.zoom, s.y);
      this.ctx.lineTo(s.x + 3 / this.zoom, s.y);
      this.ctx.stroke();

      this.ctx.font = `${8.5 / this.zoom}px 'JetBrains Mono', monospace`;
      this.ctx.fillStyle = '#00ffa3';
      this.ctx.fillText(`${s.name} (${s.cap})`, s.x + 9 / this.zoom, s.y + 3 / this.zoom);
    }
    this.ctx.restore();
  }

  drawDistressIncidents() {
    const incidents = window.AEGIS_DATA.distressIncidents;
    this.ctx.save();

    for (const inc of incidents) {
      const x = inc.coordinates.x - 500;
      const y = inc.coordinates.y - 350;

      // Pulsing SOS marker
      const pulse = (Math.sin(Date.now() * 0.008 + x) + 1) * 0.5;
      const r = (8 + pulse * 6) / this.zoom;

      this.ctx.strokeStyle = inc.urgencyColor;
      this.ctx.lineWidth = 1.5 / this.zoom;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = inc.urgencyColor;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4 / this.zoom, 0, Math.PI * 2);
      this.ctx.fill();

      // SOS badge
      this.ctx.fillStyle = 'rgba(15, 20, 35, 0.9)';
      this.ctx.fillRect(x + 10 / this.zoom, y - 10 / this.zoom, 65 / this.zoom, 16 / this.zoom);
      this.ctx.strokeRect(x + 10 / this.zoom, y - 10 / this.zoom, 65 / this.zoom, 16 / this.zoom);

      this.ctx.font = `bold ${8.5 / this.zoom}px 'JetBrains Mono', monospace`;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(`${inc.id} [${inc.hazard}]`, x + 13 / this.zoom, y + 2 / this.zoom);
    }
    this.ctx.restore();
  }

  drawRadarSweep() {
    // Semi-transparent radar beam sweeping around the screen center or storm center
    const centerScreenX = this.viewWidth * 0.55;
    const centerScreenY = this.viewHeight * 0.55;
    const radius = Math.max(this.viewWidth, this.viewHeight) * 0.75;

    this.ctx.save();
    // Radar sweep pie sector
    const startAngle = this.radarAngle - 0.45;
    const endAngle = this.radarAngle;

    const grad = this.ctx.createRadialGradient(centerScreenX, centerScreenY, 20, centerScreenX, centerScreenY, radius);
    grad.addColorStop(0, 'rgba(0, 255, 163, 0.15)');
    grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');

    this.ctx.beginPath();
    this.ctx.moveTo(centerScreenX, centerScreenY);
    this.ctx.arc(centerScreenX, centerScreenY, radius, startAngle, endAngle);
    this.ctx.closePath();
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Leading scan line
    this.ctx.beginPath();
    this.ctx.moveTo(centerScreenX, centerScreenY);
    this.ctx.lineTo(
      centerScreenX + Math.cos(endAngle) * radius,
      centerScreenY + Math.sin(endAngle) * radius
    );
    this.ctx.strokeStyle = 'rgba(0, 255, 180, 0.6)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawMapHUD() {
    // Tactical screen corner marks & scale bar
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    this.ctx.lineWidth = 1.5;

    const m = 20; // margin
    const l = 18; // corner line length
    const w = this.viewWidth;
    const h = this.viewHeight;

    // Top-left
    this.ctx.beginPath();
    this.ctx.moveTo(m, m + l);
    this.ctx.lineTo(m, m);
    this.ctx.lineTo(m + l, m);
    // Top-right
    this.ctx.moveTo(w - m - l, m);
    this.ctx.lineTo(w - m, m);
    this.ctx.lineTo(w - m, m + l);
    // Bottom-left
    this.ctx.moveTo(m, h - m - l);
    this.ctx.lineTo(m, h - m);
    this.ctx.lineTo(m + l, h - m);
    // Bottom-right
    this.ctx.moveTo(w - m - l, h - m);
    this.ctx.lineTo(w - m, h - m);
    this.ctx.lineTo(w - m, h - m - l);
    this.ctx.stroke();

    // Scale Bar in bottom right
    const scalePx = 100;
    const scaleKm = Math.round((scalePx / (this.zoom * 2.2)));
    this.ctx.fillStyle = 'rgba(7, 14, 25, 0.75)';
    this.ctx.fillRect(w - 180, h - 45, 150, 25);
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.strokeRect(w - 180, h - 45, 150, 25);

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = "10px 'JetBrains Mono', monospace";
    this.ctx.fillText(`TACTICAL SCALE: ${scaleKm} KM`, w - 170, h - 28);

    this.ctx.restore();
  }
}

window.AegisMapEngine = AegisMapEngine;
