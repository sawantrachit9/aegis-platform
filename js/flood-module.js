/**
 * AEGIS Flood Inundation & Hydrological Intelligence Module
 */

class AegisFloodModule {
  constructor() {
    this.currentBasin = window.AEGIS_DATA.floodBasins[0];
    this.waterLevel = 3.5; // meters
  }

  init() {
    this.renderBasinSelector();
    this.renderBasinDetails();
    this.renderGauges();
    this.renderDamMonitor();
    this.renderChokepoints();
    this.bindEvents();
    this.updateInundationMetrics(this.waterLevel);
  }

  bindEvents() {
    // Water level slider
    const slider = document.getElementById('flood-slider');
    const sliderVal = document.getElementById('flood-slider-val');

    if (slider) {
      slider.value = this.waterLevel;
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.waterLevel = val;
        if (sliderVal) sliderVal.textContent = `+${val.toFixed(1)}m`;

        // Update map engine flood contour
        if (window.mapEngine) {
          window.mapEngine.setFloodWaterLevel(val);
        }

        this.updateInundationMetrics(val);
      });
    }

    // Basin selector
    const basinSelect = document.getElementById('flood-basin-select');
    if (basinSelect) {
      basinSelect.addEventListener('change', (e) => {
        const found = window.AEGIS_DATA.floodBasins.find(b => b.id === e.target.value);
        if (found) {
          this.currentBasin = found;
          if (window.mapEngine) {
            if (found.id === 'basin-mississippi') {
              window.mapEngine.setFocus('gulf');
            } else {
              window.mapEngine.setFocus('bengal');
            }
          }
          this.renderBasinDetails();
          this.renderGauges();
          this.renderDamMonitor();
          this.renderChokepoints();
          this.updateInundationMetrics(this.waterLevel);
          window.aegisAudio.playRadarPing();
        }
      });
    }
  }

  renderBasinSelector() {
    const select = document.getElementById('flood-basin-select');
    if (!select) return;
    select.innerHTML = window.AEGIS_DATA.floodBasins.map(b => `
      <option value="${b.id}" ${b.id === this.currentBasin.id ? 'selected' : ''}>
        ${b.name} (${b.region})
      </option>
    `).join('');
  }

  renderBasinDetails() {
    const b = this.currentBasin;
    const nameEl = document.getElementById('basin-name');
    const regionEl = document.getElementById('basin-region');
    const statusEl = document.getElementById('basin-status');
    const dischargeEl = document.getElementById('basin-discharge');
    const soilEl = document.getElementById('basin-soil');
    const rainEl = document.getElementById('basin-rain');

    if (nameEl) nameEl.textContent = b.name;
    if (regionEl) regionEl.textContent = b.region;
    if (statusEl) {
      statusEl.textContent = b.status;
      statusEl.className = `tactical-tag risk-${b.statusClass}`;
    }
    if (dischargeEl) dischargeEl.textContent = `${b.currentDischargeM3s.toLocaleString()} m³/s (Norm: ${b.normalDischargeM3s.toLocaleString()})`;
    if (soilEl) soilEl.textContent = `${b.soilSaturationPct}% Saturation`;
    if (rainEl) rainEl.textContent = `${b.rainfallAccumulation24hMm} mm / 24h`;
  }

  updateInundationMetrics(level) {
    // Dynamic recalculation based on terrain contour slope
    const areaSqKm = Math.round(280 + level * 340 + Math.pow(level, 1.8) * 80);
    const popAffected = Math.round((140000 + level * 520000 + Math.pow(level, 2) * 120000));
    const bridgesCut = Math.min(24, Math.round(2 + level * 3.4));
    const roadsFloodedKm = Math.round(45 + level * 95);

    const areaEl = document.getElementById('metric-flood-area');
    const popEl = document.getElementById('metric-flood-pop');
    const bridgesEl = document.getElementById('metric-flood-bridges');
    const roadsEl = document.getElementById('metric-flood-roads');
    const riskRatingEl = document.getElementById('metric-flood-rating');

    if (areaEl) areaEl.textContent = `${areaSqKm.toLocaleString()} km²`;
    if (popEl) popEl.textContent = popAffected.toLocaleString();
    if (bridgesEl) bridgesEl.textContent = `${bridgesCut} Critical Bridges`;
    if (roadsEl) roadsEl.textContent = `${roadsFloodedKm} km Highways`;

    if (riskRatingEl) {
      if (level < 1.0) {
        riskRatingEl.textContent = 'STAGE 1: ADVISORY RUNOFF';
        riskRatingEl.className = 'tactical-tag risk-safe';
      } else if (level < 2.5) {
        riskRatingEl.textContent = 'STAGE 2: MODERATE RIVER OVERFLOW';
        riskRatingEl.className = 'tactical-tag risk-notice';
      } else if (level < 4.0) {
        riskRatingEl.textContent = 'STAGE 3: MAJOR BASIN INUNDATION';
        riskRatingEl.className = 'tactical-tag risk-warning';
      } else {
        riskRatingEl.textContent = 'STAGE 4: CATASTROPHIC REGIONAL DELUGE';
        riskRatingEl.className = 'tactical-tag risk-critical';
      }
    }
  }

  renderGauges() {
    const container = document.getElementById('flood-gauges-grid');
    if (!container) return;

    container.innerHTML = this.currentBasin.gauges.map(g => `
      <div class="gauge-card">
        <div class="flex-between">
          <span class="gauge-station-name">${g.name}</span>
          <span class="gauge-alert-pill ${g.alert === 'CRITICAL' || g.alert === 'RECORD' ? 'pill-danger' : 'pill-warning'}">
            ${g.alert}
          </span>
        </div>
        <div class="gauge-level-display">
          <div class="current-height highlight-cyan">${g.currentM}m</div>
          <div class="danger-threshold">Danger Mark: ${g.dangerM}m</div>
        </div>
        <div class="gauge-trend-row">
          <span class="trend-icon">▲</span>
          <span class="trend-text">${g.trend}</span>
        </div>
        <div class="gauge-meter-track">
          <div class="gauge-meter-bar" style="width: ${Math.min(100, (g.currentM / (g.dangerM * 1.25)) * 100)}%;"></div>
        </div>
      </div>
    `).join('');
  }

  renderDamMonitor() {
    const dam = this.currentBasin.keyDam;
    const nameEl = document.getElementById('dam-name');
    const storageEl = document.getElementById('dam-storage-pct');
    const flowEl = document.getElementById('dam-flow-rate');
    const gatesEl = document.getElementById('dam-gates');
    const riskEl = document.getElementById('dam-risk-alert');
    const barEl = document.getElementById('dam-storage-bar');

    if (nameEl) nameEl.textContent = dam.name;
    if (storageEl) storageEl.textContent = `${dam.storagePct}% Capacity`;
    if (flowEl) flowEl.textContent = `In: ${dam.inflowM3s.toLocaleString()} m³/s | Out: ${dam.outflowM3s.toLocaleString()} m³/s`;
    if (gatesEl) gatesEl.textContent = dam.gatesOpen;
    if (riskEl) riskEl.textContent = dam.risk;
    if (barEl) {
      barEl.style.width = `${dam.storagePct}%`;
      barEl.style.backgroundColor = dam.storagePct > 95 ? '#ff2a5f' : '#ff9f1c';
    }
  }

  renderChokepoints() {
    const container = document.getElementById('flood-chokepoints-list');
    if (!container) return;

    container.innerHTML = this.currentBasin.drainageChokePoints.map(cp => `
      <div class="chokepoint-item">
        <div class="flex-between">
          <span class="chokepoint-name">${cp.name}</span>
          <span class="chokepoint-cap ${cp.capacityPct > 120 ? 'text-red' : 'text-amber'}">${cp.capacityPct}% Load</span>
        </div>
        <div class="chokepoint-status">${cp.status}</div>
      </div>
    `).join('');
  }
}

window.aegisFlood = new AegisFloodModule();
