/**
 * AEGIS Cyclone Tracking & Atmospheric Dynamics Module
 */

class AegisCycloneModule {
  constructor() {
    this.currentCyclone = window.AEGIS_DATA.cyclones[0];
    this.selectedTimeIndex = 3; // 'NOW'
  }

  init() {
    this.renderCycloneSelector();
    this.renderTelemetry();
    this.renderSurgeProfile();
    this.renderTimeline();
    this.bindEvents();
  }

  bindEvents() {
    const stormSelect = document.getElementById('cyclone-storm-select');
    if (stormSelect) {
      stormSelect.addEventListener('change', (e) => {
        const found = window.AEGIS_DATA.cyclones.find(c => c.id === e.target.value);
        if (found) {
          this.currentCyclone = found;
          if (window.mapEngine) {
            window.mapEngine.activeCyclone = found;
            if (found.basin.includes('Gulf')) {
              window.mapEngine.setFocus('gulf');
            } else {
              window.mapEngine.setFocus('bengal');
            }
          }
          this.renderTelemetry();
          this.renderSurgeProfile();
          this.renderTimeline();
          window.aegisAudio.playRadarPing();
        }
      });
    }
  }

  renderCycloneSelector() {
    const select = document.getElementById('cyclone-storm-select');
    if (!select) return;
    select.innerHTML = window.AEGIS_DATA.cyclones.map(c => `
      <option value="${c.id}" ${c.id === this.currentCyclone.id ? 'selected' : ''}>
        ${c.name} [CAT ${c.category}] - ${c.basin}
      </option>
    `).join('');
  }

  renderTelemetry() {
    const c = this.currentCyclone;
    const nameEl = document.getElementById('cyclone-name');
    const badgeEl = document.getElementById('cyclone-cat-badge');
    const pressureEl = document.getElementById('cyclone-pressure');
    const windSpeedEl = document.getElementById('cyclone-winds');
    const gustsEl = document.getElementById('cyclone-gusts');
    const surgeEl = document.getElementById('cyclone-surge');
    const headingEl = document.getElementById('cyclone-heading');
    const etaEl = document.getElementById('cyclone-eta');
    const targetEl = document.getElementById('cyclone-target');
    const popEl = document.getElementById('cyclone-pop');
    const threatBar = document.getElementById('cyclone-intensity-bar');

    if (nameEl) nameEl.textContent = c.name;
    if (badgeEl) {
      badgeEl.textContent = `CATEGORY ${c.category} / ${c.threatLevel}`;
      badgeEl.style.borderColor = c.color;
      badgeEl.style.color = c.color;
    }
    if (pressureEl) pressureEl.textContent = `${c.pressure} hPa`;
    if (windSpeedEl) windSpeedEl.textContent = `${c.maxWindsKmh} km/h (${c.maxWindsKnots} kts)`;
    if (gustsEl) gustsEl.textContent = `${c.gustsKmh} km/h`;
    if (surgeEl) surgeEl.textContent = `+${c.stormSurgePeakMeters}m Peak`;
    if (headingEl) headingEl.textContent = `${c.heading} @ ${c.forwardSpeedKmh} km/h`;
    if (etaEl) etaEl.textContent = c.landfallETA;
    if (targetEl) targetEl.textContent = c.landfallTarget;
    if (popEl) popEl.textContent = c.affectedPopulationEst;

    if (threatBar) {
      const pct = (c.category / 5) * 100;
      threatBar.style.width = `${pct}%`;
      threatBar.style.backgroundColor = c.color;
    }
  }

  renderSurgeProfile() {
    const container = document.getElementById('cyclone-surge-sectors');
    if (!container) return;

    container.innerHTML = this.currentCyclone.coastalSurgeProfile.map(item => `
      <div class="surge-sector-card">
        <div class="flex-between">
          <span class="surge-sector-name">${item.sector}</span>
          <span class="surge-badge ${item.alert.includes('Extreme') || item.alert.includes('Catastrophic') ? 'badge-danger' : 'badge-warning'}">
            ${item.alert}
          </span>
        </div>
        <div class="surge-metrics-grid">
          <div class="surge-metric">
            <span class="metric-label">Surge Wave</span>
            <span class="metric-value highlight-cyan">+${item.surgeM}m</span>
          </div>
          <div class="surge-metric">
            <span class="metric-label">Tidal Crest</span>
            <span class="metric-value">+${item.tidePeakM}m</span>
          </div>
          <div class="surge-metric">
            <span class="metric-label">Total Water Level</span>
            <span class="metric-value highlight-red">+${item.totalCrestM}m MSL</span>
          </div>
        </div>
        <div class="surge-bar-track">
          <div class="surge-bar-fill" style="width: ${Math.min(100, (item.totalCrestM / 10) * 100)}%;"></div>
        </div>
      </div>
    `).join('');
  }

  renderTimeline() {
    const container = document.getElementById('cyclone-timeline-track');
    if (!container) return;

    const track = this.currentCyclone.track;
    container.innerHTML = track.map((pt, idx) => `
      <button class="timeline-step ${idx === this.selectedTimeIndex ? 'active' : ''} ${pt.active ? 'current-step' : ''}" data-idx="${idx}">
        <span class="time-label">${pt.time}</span>
        <span class="cat-label">Cat ${pt.cat}</span>
        <span class="wind-label">${pt.wind} km/h</span>
      </button>
    `).join('');

    container.querySelectorAll('.timeline-step').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.idx);
        this.selectedTimeIndex = idx;
        container.querySelectorAll('.timeline-step').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Play feedback
        window.aegisAudio.playClick();

        // Update forecast preview details
        const pt = track[idx];
        const statusEl = document.getElementById('timeline-stage-info');
        if (statusEl) {
          statusEl.textContent = `TIMELINE FOCUS: ${pt.time} (${pt.stage}) | WINDS: ${pt.wind} km/h | BAROMETER: ${pt.pressure} hPa | LAT/LON: ${pt.lat}°N, ${pt.lon}°E`;
        }
      });
    });
  }
}

window.aegisCyclone = new AegisCycloneModule();
