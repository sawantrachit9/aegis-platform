/**
 * AEGIS Emergency Response & Resource Deployment Dispatcher Module
 */

class AegisDispatchModule {
  constructor() {
    this.selectedIncident = window.AEGIS_DATA.distressIncidents[0];
  }

  init() {
    this.renderIncidentsQueue();
    this.renderSelectedIncident();
    this.renderUnits();
    this.bindEvents();
  }

  bindEvents() {
    // New SOS Report Form
    const sosForm = document.getElementById('report-sos-form');
    if (sosForm) {
      sosForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewSOS(sosForm);
      });
    }

    // Photo file input simulation
    const photoInput = document.getElementById('sos-photo-input');
    const photoPreview = document.getElementById('sos-photo-preview');
    if (photoInput && photoPreview) {
      photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (re) => {
            photoPreview.style.backgroundImage = `url('${re.target.result}')`;
            photoPreview.classList.add('has-image');
            photoPreview.textContent = '';
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }

    // Hook global incident selected event from map click
    window.onIncidentSelected = (inc) => {
      this.selectedIncident = inc;
      this.renderSelectedIncident();
      this.renderIncidentsQueue();
    };
  }

  renderIncidentsQueue() {
    const container = document.getElementById('dispatch-incidents-queue');
    if (!container) return;

    container.innerHTML = window.AEGIS_DATA.distressIncidents.map(inc => {
      const isSelected = this.selectedIncident && this.selectedIncident.id === inc.id;
      return `
        <div class="incident-card ${isSelected ? 'active' : ''}" data-id="${inc.id}">
          <div class="flex-between">
            <span class="incident-id">${inc.id} • ${inc.hazard}</span>
            <span class="urgency-pill ${inc.urgency === 'CRITICAL' ? 'pill-danger' : 'pill-warning'}">${inc.urgency}</span>
          </div>
          <h4 class="incident-title">${inc.title}</h4>
          <p class="incident-location">📍 ${inc.location}</p>
          <div class="incident-meta-row">
            <span>Trapped: <strong>${inc.peopleCount} souls</strong></span>
            <span>Depth: <strong>${inc.waterDepthM}m</strong></span>
            <span class="status-chip ${inc.status === 'DISPATCHED' || inc.status === 'AIRLIFT IN PROGRESS' ? 'status-active' : ''}">${inc.status}</span>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.incident-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const found = window.AEGIS_DATA.distressIncidents.find(i => i.id === id);
        if (found) {
          this.selectedIncident = found;
          this.renderSelectedIncident();
          this.renderIncidentsQueue();
          window.aegisAudio.playClick();
        }
      });
    });
  }

  renderSelectedIncident() {
    const inc = this.selectedIncident;
    const detailBox = document.getElementById('dispatch-detail-box');
    if (!detailBox) return;

    if (!inc) {
      detailBox.innerHTML = `<div class="tactical-empty-state">Select an incident to view tactical details and deploy rescue assets.</div>`;
      return;
    }

    detailBox.innerHTML = `
      <div class="incident-detail-header">
        <div>
          <span class="tactical-tag risk-${inc.urgency === 'CRITICAL' ? 'critical' : 'warning'}">${inc.urgency} DISPATCH</span>
          <h3 class="detail-title">${inc.title}</h3>
          <p class="detail-loc">📍 ${inc.location} (Elev: ${inc.elevationM}m MSL | Water Level: +${inc.waterDepthM}m)</p>
        </div>
        <div class="beacon-badge">BEACON ACTIVE</div>
      </div>

      <div class="detail-info-grid">
        <div class="info-block">
          <span class="label">Endangered Individuals</span>
          <span class="val highlight-red">${inc.peopleCount} Persons</span>
        </div>
        <div class="info-block">
          <span class="label">Medical Emergency</span>
          <span class="val">${inc.medicalNeed}</span>
        </div>
        <div class="info-block">
          <span class="label">Time Since Call</span>
          <span class="val highlight-cyan">${inc.timeReported}</span>
        </div>
        <div class="info-block">
          <span class="label">Assigned Tactical Unit</span>
          <span class="val text-amber">${inc.assignedUnit || 'UNASSIGNED - PENDING'}</span>
        </div>
      </div>

      <div class="dispatch-actions-row">
        <button class="tactical-btn btn-primary" id="btn-deploy-nearest">
          🚁 DEPLOY AIR RESCUE HELO
        </button>
        <button class="tactical-btn btn-secondary" id="btn-deploy-boat">
          🚤 DEPLOY ZODIAC BOAT
        </button>
        <button class="tactical-btn btn-outline" id="btn-resolve-sos">
          ✓ MARK RESOLVED
        </button>
      </div>
    `;

    // Bind action buttons
    const deployHelo = detailBox.querySelector('#btn-deploy-nearest');
    const deployBoat = detailBox.querySelector('#btn-deploy-boat');
    const resolveBtn = detailBox.querySelector('#btn-resolve-sos');

    if (deployHelo) {
      deployHelo.addEventListener('click', () => {
        inc.assignedUnit = "Air Rescue Hawk-1 (ETA 12 mins)";
        inc.status = "AIRLIFT IN PROGRESS";
        window.aegisAudio.playAlertChime();
        this.renderSelectedIncident();
        this.renderIncidentsQueue();
      });
    }

    if (deployBoat) {
      deployBoat.addEventListener('click', () => {
        inc.assignedUnit = "Amphibious Strike Team B-3 (ETA 22 mins)";
        inc.status = "DISPATCHED";
        window.aegisAudio.playAlertChime();
        this.renderSelectedIncident();
        this.renderIncidentsQueue();
      });
    }

    if (resolveBtn) {
      resolveBtn.addEventListener('click', () => {
        inc.status = "EVACUATION COMPLETE";
        inc.urgency = "RESOLVED";
        window.aegisAudio.playClick();
        this.renderSelectedIncident();
        this.renderIncidentsQueue();
      });
    }
  }

  renderUnits() {
    const container = document.getElementById('dispatch-units-list');
    if (!container) return;

    container.innerHTML = window.AEGIS_DATA.responseUnits.map(unit => `
      <div class="unit-card">
        <div class="flex-between">
          <span class="unit-name">${unit.name}</span>
          <span class="unit-status-tag ${unit.status === 'READY' ? 'tag-ready' : 'tag-busy'}">${unit.status}</span>
        </div>
        <div class="unit-meta">
          <span>Type: <strong>${unit.type}</strong></span>
          <span>Max Evac: <strong>${unit.capacity}</strong></span>
          <span>Speed: <strong>${unit.speedKmh} km/h</strong></span>
          <span>Base: <strong>${unit.base}</strong></span>
        </div>
      </div>
    `).join('');
  }

  handleNewSOS(form) {
    const hazard = form.querySelector('#sos-hazard').value;
    const location = form.querySelector('#sos-location').value || 'Unspecified Coastal Sector';
    const count = parseInt(form.querySelector('#sos-people').value) || 4;
    const medical = form.querySelector('#sos-medical').value || 'None reported';
    const urgency = form.querySelector('#sos-urgency').value || 'HIGH';

    const newId = `SOS-${Math.floor(8500 + Math.random() * 900)}`;

    const newIncident = {
      id: newId,
      type: "CITIZEN_DISTRESS",
      hazard: hazard,
      title: `Emergency Distress: ${count} Persons In Peril`,
      location: location,
      elevationM: 2.2,
      waterDepthM: 1.8,
      urgency: urgency,
      urgencyColor: urgency === 'CRITICAL' ? '#ff2a5f' : '#ff8c00',
      peopleCount: count,
      medicalNeed: medical,
      timeReported: "Just now",
      assignedUnit: "DISPATCH QUEUE PENDING",
      status: "NEW BEACON",
      coordinates: { x: 540 + Math.random() * 60, y: 320 + Math.random() * 60 }
    };

    window.AEGIS_DATA.distressIncidents.unshift(newIncident);
    this.selectedIncident = newIncident;

    // Synthesize siren alarm
    window.aegisAudio.playEmergencySiren(2.5);

    this.renderIncidentsQueue();
    this.renderSelectedIncident();

    // Reset form
    form.reset();
    const modal = document.getElementById('report-sos-modal');
    if (modal) modal.classList.remove('open');

    // Notify user
    alert(`[AEGIS BEACON REGISTERED] Emergency SOS Beacon #${newId} transmitted to regional command center.`);
  }
}

window.aegisDispatch = new AegisDispatchModule();
