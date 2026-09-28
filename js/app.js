/**
 * AEGIS Master Application Orchestrator
 */

class AegisApp {
  constructor() {
    this.currentView = 'view-war-room';
    this.tickerIndex = 0;
  }

  init() {
    // 1. Initialize Canvas Map Engine
    window.mapEngine = new AegisMapEngine('tactical-map-canvas');

    // 2. Initialize Submodules
    if (window.aegisCyclone) window.aegisCyclone.init();
    if (window.aegisFlood) window.aegisFlood.init();
    if (window.aegisCitizen) window.aegisCitizen.init();
    if (window.aegisDispatch) window.aegisDispatch.init();
    if (window.aegisSandbox) window.aegisSandbox.init();
    if (window.aegisBroadcast) window.aegisBroadcast.init();

    // 3. Navigation & Tab Switching
    this.bindNavigation();

    // 4. Layer Controls
    this.bindLayerControls();

    // 5. Clock & Live Telemetry Ticker
    this.startClock();
    this.startTicker();

    // 6. Audio controls
    this.bindAudioControls();

    // 7. Modals & Drawers
    this.bindModals();

    // 8. Keyboard Shortcuts
    this.bindShortcuts();

    // 9. Map Sector Inspection Hook
    this.bindSectorInspection();
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const viewId = item.dataset.view;
        if (!viewId) return;
        this.switchView(viewId);
      });
    });

    // Quick filter chips on War Room
    const filterChips = document.querySelectorAll('.hazard-filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        window.aegisAudio.playClick();
        if (filter === 'cyclones') {
          if (window.mapEngine) {
            window.mapEngine.layers.floodInundation = false;
            window.mapEngine.layers.stormCone = true;
            window.mapEngine.layers.windParticles = true;
          }
        } else if (filter === 'floods') {
          if (window.mapEngine) {
            window.mapEngine.layers.floodInundation = true;
            window.mapEngine.layers.riverGauges = true;
            window.mapEngine.layers.stormCone = false;
          }
        } else {
          if (window.mapEngine) {
            window.mapEngine.layers.floodInundation = true;
            window.mapEngine.layers.stormCone = true;
            window.mapEngine.layers.windParticles = true;
          }
        }
      });
    });
  }

  switchView(viewId) {
    if (viewId === this.currentView) return;

    window.aegisAudio.playClick();

    // Update nav item active states
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });

    // Update view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === viewId);
    });

    this.currentView = viewId;

    // Trigger canvas resize in case layout changed
    if (window.mapEngine) {
      setTimeout(() => window.mapEngine.resizeCanvas(), 50);
    }
  }

  bindLayerControls() {
    const layerCheckboxes = document.querySelectorAll('.layer-checkbox');
    layerCheckboxes.forEach(box => {
      box.addEventListener('change', (e) => {
        const layer = e.target.dataset.layer;
        if (window.mapEngine) {
          window.mapEngine.layers[layer] = e.target.checked;
          window.aegisAudio.playClick();
        }
      });
    });

    // Map Focus quick buttons
    const btnFocusBengal = document.getElementById('btn-focus-bengal');
    const btnFocusGulf = document.getElementById('btn-focus-gulf');
    const btnResetMap = document.getElementById('btn-reset-map');

    if (btnFocusBengal) {
      btnFocusBengal.addEventListener('click', () => {
        if (window.mapEngine) window.mapEngine.setFocus('bengal');
      });
    }
    if (btnFocusGulf) {
      btnFocusGulf.addEventListener('click', () => {
        if (window.mapEngine) window.mapEngine.setFocus('gulf');
      });
    }
    if (btnResetMap) {
      btnResetMap.addEventListener('click', () => {
        if (window.mapEngine) window.mapEngine.setFocus('global');
      });
    }
  }

  startClock() {
    const clockEl = document.getElementById('top-bar-clock');
    const update = () => {
      const now = new Date();
      const utcStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      if (clockEl) clockEl.textContent = utcStr;
    };
    update();
    setInterval(update, 1000);
  }

  startTicker() {
    const tickerEl = document.getElementById('telemetry-ticker-text');
    if (!tickerEl) return;

    const alerts = window.AEGIS_DATA.liveAlerts;
    const rotate = () => {
      const item = alerts[this.tickerIndex];
      tickerEl.style.opacity = '0';
      setTimeout(() => {
        tickerEl.innerHTML = `<span class="ticker-tag ${item.type === 'EXTREME' ? 'tag-extreme' : 'tag-warn'}">[${item.type}]</span> <span class="ticker-time">${item.time}</span> • ${item.text}`;
        tickerEl.style.opacity = '1';
      }, 300);
      this.tickerIndex = (this.tickerIndex + 1) % alerts.length;
    };
    rotate();
    setInterval(rotate, 6000);
  }

  bindAudioControls() {
    const muteBtn = document.getElementById('btn-toggle-audio');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.aegisAudio.toggleMute();
        muteBtn.classList.toggle('muted', isMuted);
        muteBtn.querySelector('.audio-label').textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: ON';
        if (!isMuted) {
          window.aegisAudio.playRadarPing();
        }
      });
    }
  }

  bindModals() {
    // SOS Modal open
    const openSosBtns = document.querySelectorAll('.trigger-sos-modal');
    const sosModal = document.getElementById('report-sos-modal');
    const closeSosBtn = document.getElementById('close-sos-modal');

    openSosBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.aegisAudio.playClick();
        if (sosModal) sosModal.classList.add('open');
      });
    });

    if (closeSosBtn && sosModal) {
      closeSosBtn.addEventListener('click', () => {
        sosModal.classList.remove('open');
        window.aegisAudio.playClick();
      });
    }

    // Survival Pass Modal close
    const passModal = document.getElementById('survival-pass-modal');
    const closePassBtn = document.getElementById('close-survival-pass');
    const printPassBtn = document.getElementById('btn-print-pass');

    if (closePassBtn && passModal) {
      closePassBtn.addEventListener('click', () => {
        passModal.classList.remove('open');
        window.aegisAudio.playClick();
      });
    }

    if (printPassBtn) {
      printPassBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Close on background click
    [sosModal, passModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('open');
          }
        });
      }
    });
  }

  bindSectorInspection() {
    const drawer = document.getElementById('sector-inspect-drawer');
    const closeDrawer = document.getElementById('close-sector-drawer');

    window.onSectorInspected = (sector) => {
      if (!drawer) return;
      document.getElementById('sector-coords').textContent = `${sector.lat}°N, ${sector.lon}°E`;
      document.getElementById('sector-elev').textContent = `${sector.elevation}m MSL`;
      document.getElementById('sector-flood-depth').textContent = `+${sector.floodDepth}m (Surge risk)`;
      document.getElementById('sector-wind').textContent = `${sector.windForecast} km/h`;
      document.getElementById('sector-evac-time').textContent = sector.evacTime;

      drawer.classList.add('open');
    };

    if (closeDrawer && drawer) {
      closeDrawer.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }
  }

  bindShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      switch (e.key) {
        case '1': this.switchView('view-war-room'); break;
        case '2': this.switchView('view-cyclone'); break;
        case '3': this.switchView('view-flood'); break;
        case '4': this.switchView('view-citizen'); break;
        case '5': this.switchView('view-dispatch'); break;
        case '6': this.switchView('view-sandbox'); break;
        case '7': this.switchView('view-broadcast'); break;
        case 'm':
        case 'M':
          document.getElementById('btn-toggle-audio')?.click();
          break;
        case 'f':
        case 'F':
          document.getElementById('btn-reset-map')?.click();
          break;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.aegisApp = new AegisApp();
  window.aegisApp.init();
});
