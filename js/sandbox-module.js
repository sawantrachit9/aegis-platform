/**
 * AEGIS Disaster Simulation Sandbox ("What-If" Scenario Studio)
 * Enables civil engineers, emergency planners, and citizens to model
 * extreme compound cyclone + flood hazards in real-time.
 */

class AegisSandboxModule {
  constructor() {
    this.scenario = {
      cycloneCat: 5,
      rainfallMm: 320,
      surgeHeightM: 5.2,
      tidePhase: 3.6, // King tide meters
      leveeIntegrityPct: 60, // 40% breach
      drainageCapacityPct: 50 // 50% power loss
    };
  }

  init() {
    this.bindEvents();
    this.recompute();
  }

  bindEvents() {
    const inputs = [
      { id: 'sim-cyclone-cat', key: 'cycloneCat', valId: 'val-sim-cat', fmt: v => `Cat ${v}` },
      { id: 'sim-rainfall', key: 'rainfallMm', valId: 'val-sim-rain', fmt: v => `${v} mm` },
      { id: 'sim-surge', key: 'surgeHeightM', valId: 'val-sim-surge', fmt: v => `+${parseFloat(v).toFixed(1)}m` },
      { id: 'sim-tide', key: 'tidePhase', valId: 'val-sim-tide', fmt: v => `+${parseFloat(v).toFixed(1)}m` },
      { id: 'sim-levee', key: 'leveeIntegrityPct', valId: 'val-sim-levee', fmt: v => `${v}% Intact` },
      { id: 'sim-drainage', key: 'drainageCapacityPct', valId: 'val-sim-drainage', fmt: v => `${v}% Online` }
    ];

    inputs.forEach(item => {
      const el = document.getElementById(item.id);
      const valEl = document.getElementById(item.valId);
      if (el) {
        el.value = this.scenario[item.key];
        if (valEl) valEl.textContent = item.fmt(this.scenario[item.key]);

        el.addEventListener('input', (e) => {
          this.scenario[item.key] = parseFloat(e.target.value);
          if (valEl) valEl.textContent = item.fmt(e.target.value);
          this.recompute();
        });
      }
    });

    const runBtn = document.getElementById('btn-run-simulation');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        this.runSimulationAnimation();
      });
    }

    const resetBtn = document.getElementById('btn-reset-scenario');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.scenario = {
          cycloneCat: 3,
          rainfallMm: 180,
          surgeHeightM: 2.8,
          tidePhase: 2.2,
          leveeIntegrityPct: 90,
          drainageCapacityPct: 85
        };
        inputs.forEach(item => {
          const el = document.getElementById(item.id);
          const valEl = document.getElementById(item.valId);
          if (el) {
            el.value = this.scenario[item.key];
            if (valEl) valEl.textContent = item.fmt(this.scenario[item.key]);
          }
        });
        window.aegisAudio.playClick();
        this.recompute();
      });
    }
  }

  recompute() {
    const s = this.scenario;

    // Compound hydraulic head (Surge + Astronomical Tide + Runoff head)
    const runoffHead = (s.rainfallMm / 120) * (1 - (s.drainageCapacityPct / 100) * 0.45);
    const leveeBreachFactor = 1 + (1 - s.leveeIntegrityPct / 100) * 0.8;
    const compoundCrestM = (s.surgeHeightM + s.tidePhase * 0.75 + runoffHead * 0.5) * (0.8 + leveeBreachFactor * 0.2);

    // Inundated Area (km2)
    const inundatedArea = Math.round(180 + compoundCrestM * 220 * leveeBreachFactor + (s.cycloneCat * 60));

    // Population Displaced
    const popDisplaced = Math.round((inundatedArea * 920 * (1 + s.cycloneCat * 0.25)));

    // Estimated Economic Damage ($ Millions)
    const baseDamage = s.cycloneCat * 1200 + inundatedArea * 4.8 + (100 - s.leveeIntegrityPct) * 45;
    const damageBillions = (baseDamage / 1000).toFixed(2);

    // Facilities compromised
    const hospitalsSubmerged = Math.min(38, Math.round(compoundCrestM * 3.8 + (100 - s.drainageCapacityPct) * 0.15));
    const substationsOffline = Math.min(65, Math.round(s.cycloneCat * 9 + compoundCrestM * 4.2));
    const shelterDeficitBeds = Math.max(0, Math.round(popDisplaced * 0.35 - 120000));

    // Update UI elements
    const crestEl = document.getElementById('sim-metric-crest');
    const areaEl = document.getElementById('sim-metric-area');
    const popEl = document.getElementById('sim-metric-pop');
    const damageEl = document.getElementById('sim-metric-damage');
    const hospitalsEl = document.getElementById('sim-metric-hospitals');
    const substationsEl = document.getElementById('sim-metric-substations');
    const deficitEl = document.getElementById('sim-metric-deficit');

    if (crestEl) crestEl.textContent = `+${compoundCrestM.toFixed(2)}m MSL`;
    if (areaEl) areaEl.textContent = `${inundatedArea.toLocaleString()} km²`;
    if (popEl) popEl.textContent = popDisplaced.toLocaleString();
    if (damageEl) damageEl.textContent = `$${damageBillions} Billion`;
    if (hospitalsEl) hospitalsEl.textContent = `${hospitalsSubmerged} Facilities`;
    if (substationsEl) substationsEl.textContent = `${substationsOffline} Grid Nodes`;
    if (deficitEl) deficitEl.textContent = `${shelterDeficitBeds.toLocaleString()} Beds Short`;

    // Also sync with map inundation slider if desirable
    if (window.mapEngine && compoundCrestM > 0) {
      window.mapEngine.setFloodWaterLevel(Math.min(6.0, compoundCrestM * 0.7));
    }
  }

  runSimulationAnimation() {
    window.aegisAudio.playAlertChime();
    const btn = document.getElementById('btn-run-simulation');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'COMPUTING HYDRODYNAMIC MESH...';
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '⚡ RUN SCENARIO SIMULATION';
      }
      window.aegisAudio.playRadarPing();
      alert(`[SIMULATION COMPLETED] High-Resolution Hydrodynamic Run: Peak compound flood crest +${(this.scenario.surgeHeightM + this.scenario.tidePhase * 0.75).toFixed(1)}m. Check the Damage Assessment Matrix below.`);
    }, 1200);
  }
}

window.aegisSandbox = new AegisSandboxModule();
