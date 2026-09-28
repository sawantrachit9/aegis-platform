/**
 * AEGIS Citizen Risk Assessment & Action Navigator Module
 * "Am I Safe?" Personal Disaster Preparedness & Evacuation System
 */

class AegisCitizenModule {
  constructor() {
    this.currentCity = window.AEGIS_DATA.cities[0]; // Kolkata default
    this.survivalKitItems = [
      { id: "kit-water", label: "Potable Water (3L per person per day for 5 days)", checked: true },
      { id: "kit-food", label: "Non-perishable high-calorie food (energy bars, canned goods)", checked: true },
      { id: "kit-radio", label: "Hand-crank or solar emergency NOAA / IMD radio", checked: false },
      { id: "kit-firstaid", label: "Comprehensive trauma & first aid kit with antiseptics", checked: true },
      { id: "kit-torch", label: "Waterproof LED flashlights & chem-light glowsticks", checked: true },
      { id: "kit-powerbank", label: "20,000mAh ruggedized power banks fully charged", checked: false },
      { id: "kit-docs", label: "Airtight waterproof pouch for passports, deeds & cash", checked: true },
      { id: "kit-meds", label: "Critical 14-day prescription medications & insulin supply", checked: false },
      { id: "kit-whistle", label: "High-decibel signaling whistle & mirror for air-sea rescue", checked: false },
      { id: "kit-sanitation", label: "Disinfectant wipes, chlorine purification drops & bags", checked: true }
    ];
  }

  init() {
    this.renderCitySelector();
    this.renderCityProfile();
    this.renderShelters();
    this.renderActions();
    this.renderSurvivalKit();
    this.bindEvents();
  }

  bindEvents() {
    const citySelect = document.getElementById('citizen-city-select');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        const found = window.AEGIS_DATA.cities.find(c => c.id === e.target.value);
        if (found) {
          this.currentCity = found;
          this.renderCityProfile();
          this.renderShelters();
          this.renderActions();
          window.aegisAudio.playRadarPing();
        }
      });
    }

    // Search bar filter
    const searchInput = document.getElementById('citizen-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) return;
        const match = window.AEGIS_DATA.cities.find(c => 
          c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
        );
        if (match && match.id !== this.currentCity.id) {
          this.currentCity = match;
          if (citySelect) citySelect.value = match.id;
          this.renderCityProfile();
          this.renderShelters();
          this.renderActions();
        }
      });
    }

    // Pass generator button
    const passBtn = document.getElementById('btn-generate-survival-pass');
    if (passBtn) {
      passBtn.addEventListener('click', () => {
        this.openSurvivalPassModal();
      });
    }
  }

  renderCitySelector() {
    const select = document.getElementById('citizen-city-select');
    if (!select) return;
    select.innerHTML = window.AEGIS_DATA.cities.map(c => `
      <option value="${c.id}" ${c.id === this.currentCity.id ? 'selected' : ''}>
        ${c.name} (${c.country}) - Risk Score: ${c.overallRiskScore}/100
      </option>
    `).join('');
  }

  renderCityProfile() {
    const c = this.currentCity;
    const nameEl = document.getElementById('citizen-profile-name');
    const elevEl = document.getElementById('citizen-profile-elev');
    const coastEl = document.getElementById('citizen-profile-coast');
    const popEl = document.getElementById('citizen-profile-pop');
    const scoreVal = document.getElementById('citizen-overall-score');
    const scoreBadge = document.getElementById('citizen-score-badge');
    const evacStatus = document.getElementById('citizen-evac-status');

    if (nameEl) nameEl.textContent = `${c.name}, ${c.country}`;
    if (elevEl) elevEl.textContent = `${c.baseElevationM}m MSL`;
    if (coastEl) coastEl.textContent = `${c.distanceToCoastKm} km`;
    if (popEl) popEl.textContent = c.population;
    if (scoreVal) scoreVal.textContent = c.overallRiskScore;

    if (scoreBadge) {
      if (c.overallRiskScore >= 85) {
        scoreBadge.textContent = 'EXTREME RISK TIER';
        scoreBadge.className = 'tactical-tag risk-critical';
      } else if (c.overallRiskScore >= 70) {
        scoreBadge.textContent = 'HIGH RISK TIER';
        scoreBadge.className = 'tactical-tag risk-warning';
      } else {
        scoreBadge.textContent = 'MODERATE RISK TIER';
        scoreBadge.className = 'tactical-tag risk-notice';
      }
    }

    if (evacStatus) evacStatus.textContent = c.evacuationStatus;

    // Render Risk Breakdown Bars
    const rb = c.riskBreakdown;
    this.updateBar('bar-flood-risk', 'val-flood-risk', rb.floodInundation);
    this.updateBar('bar-wind-risk', 'val-wind-risk', rb.cycloneWind);
    this.updateBar('bar-surge-risk', 'val-surge-risk', rb.stormSurge);
    this.updateBar('bar-power-risk', 'val-power-risk', rb.powerGridFailure);
    this.updateBar('bar-drain-risk', 'val-drain-risk', rb.drainageFailure);
  }

  updateBar(barId, valId, score) {
    const bar = document.getElementById(barId);
    const val = document.getElementById(valId);
    if (bar) {
      bar.style.width = `${score}%`;
      bar.style.backgroundColor = score > 85 ? '#ff2a5f' : score > 70 ? '#ff9f1c' : '#00e5ff';
    }
    if (val) val.textContent = `${score}/100`;
  }

  renderShelters() {
    const container = document.getElementById('citizen-shelters-list');
    if (!container) return;

    container.innerHTML = this.currentCity.safeZones.map(s => {
      const pct = Math.round((s.currentOccupancy / s.capacity) * 100);
      return `
        <div class="shelter-card">
          <div class="flex-between">
            <span class="shelter-name">${s.name}</span>
            <span class="shelter-status-tag ${pct > 90 ? 'tag-full' : 'tag-open'}">${pct > 90 ? 'CRITICAL CAPACITY' : 'ACCEPTING EVACUEES'}</span>
          </div>
          <div class="shelter-stats-row">
            <span>Elevation: <strong>${s.elevM}m MSL</strong></span>
            <span>Occupancy: <strong>${s.currentOccupancy.toLocaleString()} / ${s.capacity.toLocaleString()}</strong> (${pct}%)</span>
          </div>
          <div class="shelter-capacity-track">
            <div class="shelter-capacity-fill" style="width: ${pct}%; background-color: ${pct > 85 ? '#ff2a5f' : '#00ffa3'};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderActions() {
    const container = document.getElementById('citizen-actions-list');
    if (!container) return;

    container.innerHTML = this.currentCity.recommendedActions.map(act => `
      <div class="action-card ${act.priority === 'CRITICAL' || act.priority === 'LIFE-SAFETY' ? 'border-critical' : 'border-high'}">
        <div class="flex-between">
          <span class="action-time-badge">${act.time}</span>
          <span class="action-priority-badge ${act.priority === 'CRITICAL' || act.priority === 'LIFE-SAFETY' ? 'badge-danger' : 'badge-warning'}">
            ${act.priority}
          </span>
        </div>
        <p class="action-desc">${act.action}</p>
      </div>
    `).join('');
  }

  renderSurvivalKit() {
    const container = document.getElementById('survival-kit-checklist');
    if (!container) return;

    container.innerHTML = this.survivalKitItems.map(item => `
      <label class="kit-item-row">
        <input type="checkbox" class="kit-checkbox" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
        <span class="kit-custom-check"></span>
        <span class="kit-text ${item.checked ? 'text-checked' : ''}">${item.label}</span>
      </label>
    `).join('');

    container.querySelectorAll('.kit-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const item = this.survivalKitItems.find(k => k.id === id);
        if (item) {
          item.checked = e.target.checked;
          window.aegisAudio.playClick();
          this.updateKitProgress();
          const row = e.target.closest('.kit-item-row');
          if (row) {
            const txt = row.querySelector('.kit-text');
            if (txt) txt.classList.toggle('text-checked', item.checked);
          }
        }
      });
    });

    this.updateKitProgress();
  }

  updateKitProgress() {
    const checkedCount = this.survivalKitItems.filter(k => k.checked).length;
    const totalCount = this.survivalKitItems.length;
    const pct = Math.round((checkedCount / totalCount) * 100);

    const scoreEl = document.getElementById('kit-readiness-pct');
    const barEl = document.getElementById('kit-progress-bar');

    if (scoreEl) scoreEl.textContent = `${pct}% PREPARED`;
    if (barEl) {
      barEl.style.width = `${pct}%`;
      barEl.style.backgroundColor = pct >= 80 ? '#00ffa3' : pct >= 50 ? '#ff9f1c' : '#ff2a5f';
    }
  }

  openSurvivalPassModal() {
    const modal = document.getElementById('survival-pass-modal');
    if (!modal) return;

    window.aegisAudio.playClick();

    const passCode = `AEGIS-EVAC-${this.currentCity.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const passCodeEl = document.getElementById('pass-serial-code');
    const passLocationEl = document.getElementById('pass-location');
    const passShelterEl = document.getElementById('pass-primary-shelter');
    const passRiskEl = document.getElementById('pass-risk-level');

    if (passCodeEl) passCodeEl.textContent = passCode;
    if (passLocationEl) passLocationEl.textContent = `${this.currentCity.name}, ${this.currentCity.country}`;
    if (passShelterEl) passShelterEl.textContent = this.currentCity.safeZones[0].name;
    if (passRiskEl) passRiskEl.textContent = `SCORE ${this.currentCity.overallRiskScore}/100 (${this.currentCity.evacuationStatus})`;

    modal.classList.add('open');
  }
}

window.aegisCitizen = new AegisCitizenModule();
