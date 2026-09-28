/**
 * AEGIS Comprehensive Geospatial, Meteorological & Hydrological Intelligence Data
 */

window.AEGIS_DATA = {
  metadata: {
    systemName: "AEGIS",
    fullTitle: "Smart Disaster & Climate Response Platform",
    classification: "TACTICAL CIVIL DEFENSE / CLIMATE INTELLIGENCE",
    version: "2.4.0-PROD",
    lastSatellitePass: "2026-09-28T12:30:00Z",
    activeSensors: 4892,
    sensorMeshUptime: "99.82%"
  },

  // Active Cyclonic Storms
  cyclones: [
    {
      id: "cyclone-amrita",
      name: "Super Cyclone AMRITA",
      code: "04B-2026",
      category: 5,
      categoryName: "Super Cyclonic Storm / Cat 5",
      basin: "North Indian Ocean (Bay of Bengal)",
      center: { lat: 20.45, lon: 88.62 },
      pressure: 912, // hPa
      maxWindsKmh: 265, // km/h
      maxWindsKnots: 143,
      gustsKmh: 310,
      forwardSpeedKmh: 18,
      heading: "NNE (25°)",
      eyeDiameterKm: 32,
      rmwKm: 42, // Radius of Maximum Wind
      stormSurgePeakMeters: 5.8,
      status: "IMMINENT LANDFALL",
      landfallETA: "6h 20m",
      landfallTarget: "Sundarbans Delta (India / Bangladesh Border)",
      affectedPopulationEst: "18.4 Million",
      threatLevel: "EXTREME",
      color: "#ff2a5f",
      // Trajectory points: past -> present -> forecast
      track: [
        { time: "-36h", lat: 14.8, lon: 85.2, cat: 1, wind: 120, pressure: 984, stage: "Past" },
        { time: "-24h", lat: 16.5, lon: 86.1, cat: 2, wind: 160, pressure: 970, stage: "Past" },
        { time: "-12h", lat: 18.2, lon: 87.3, cat: 4, wind: 215, pressure: 938, stage: "Past" },
        { time: "NOW",  lat: 20.45, lon: 88.62, cat: 5, wind: 265, pressure: 912, stage: "Current", active: true },
        { time: "+6h",  lat: 21.60, lon: 89.15, cat: 5, wind: 250, pressure: 920, stage: "Forecast (Landfall)" },
        { time: "+18h", lat: 23.20, lon: 89.90, cat: 3, wind: 175, pressure: 955, stage: "Forecast (Inland)" },
        { time: "+36h", lat: 25.10, lon: 91.20, cat: 1, wind: 95,  pressure: 988, stage: "Forecast (Dissipating)" }
      ],
      windRadii: {
        kt64: 65,  // km
        kt50: 140, // km
        kt34: 280  // km
      },
      coastalSurgeProfile: [
        { sector: "Digha - Sagar Island", surgeM: 5.6, tidePeakM: 3.8, totalCrestM: 9.4, alert: "Extreme Breach" },
        { sector: "Sundarbans Biosphere", surgeM: 5.8, tidePeakM: 3.5, totalCrestM: 9.3, alert: "Catastrophic Overtopping" },
        { sector: "Haldia Industrial Port", surgeM: 4.2, tidePeakM: 3.9, totalCrestM: 8.1, alert: "Major Inundation" },
        { sector: "Barisal Coastal Embankment", surgeM: 4.8, tidePeakM: 3.1, totalCrestM: 7.9, alert: "Severe Breach" }
      ]
    },
    {
      id: "hurricane-zephyr",
      name: "Hurricane ZEPHYR",
      code: "AL09-2026",
      category: 4,
      categoryName: "Major Hurricane (Cat 4)",
      basin: "Gulf of Mexico",
      center: { lat: 27.20, lon: -85.80 },
      pressure: 938,
      maxWindsKmh: 225,
      maxWindsKnots: 121,
      gustsKmh: 270,
      forwardSpeedKmh: 22,
      heading: "NE (45°)",
      eyeDiameterKm: 38,
      rmwKm: 50,
      stormSurgePeakMeters: 4.5,
      status: "RAPID INTENSIFICATION",
      landfallETA: "14h 45m",
      landfallTarget: "Florida Big Bend / Tampa Bay Outskirts",
      affectedPopulationEst: "6.2 Million",
      threatLevel: "SEVERE",
      color: "#ff8c00",
      track: [
        { time: "-24h", lat: 23.5, lon: -88.9, cat: 2, wind: 155, pressure: 975, stage: "Past" },
        { time: "-12h", lat: 25.4, lon: -87.2, cat: 3, wind: 190, pressure: 955, stage: "Past" },
        { time: "NOW",  lat: 27.20, lon: -85.80, cat: 4, wind: 225, pressure: 938, stage: "Current", active: true },
        { time: "+12h", lat: 29.10, lon: -84.20, cat: 4, wind: 220, pressure: 942, stage: "Forecast (Landfall)" },
        { time: "+24h", lat: 31.00, lon: -82.60, cat: 2, wind: 160, pressure: 972, stage: "Forecast (Inland)" },
        { time: "+48h", lat: 33.50, lon: -79.80, cat: 1, wind: 105, pressure: 990, stage: "Forecast" }
      ],
      windRadii: { kt64: 55, kt50: 120, kt34: 250 },
      coastalSurgeProfile: [
        { sector: "Cedar Key", surgeM: 4.5, tidePeakM: 1.2, totalCrestM: 5.7, alert: "Extreme Surge" },
        { sector: "Tampa Bay Entrance", surgeM: 3.4, tidePeakM: 1.0, totalCrestM: 4.4, alert: "Severe Inundation" },
        { sector: "St. Petersburg Coastal", surgeM: 3.1, tidePeakM: 0.9, totalCrestM: 4.0, alert: "Major Inundation" }
      ]
    },
    {
      id: "typhoon-maras",
      name: "Typhoon MARAS",
      code: "WP16-2026",
      category: 4,
      categoryName: "Super Typhoon (Cat 4)",
      basin: "Western North Pacific",
      center: { lat: 19.80, lon: 122.40 },
      pressure: 932,
      maxWindsKmh: 230,
      maxWindsKnots: 124,
      gustsKmh: 280,
      forwardSpeedKmh: 15,
      heading: "WNW (295°)",
      eyeDiameterKm: 28,
      rmwKm: 36,
      stormSurgePeakMeters: 4.8,
      status: "CROSSING LUZON STRAIT",
      landfallETA: "22h 10m",
      landfallTarget: "Northern Luzon / Southern Taiwan Channel",
      affectedPopulationEst: "8.9 Million",
      threatLevel: "SEVERE",
      color: "#ff3366",
      track: [
        { time: "-24h", lat: 17.5, lon: 126.8, cat: 3, wind: 195, pressure: 950, stage: "Past" },
        { time: "NOW",  lat: 19.80, lon: 122.40, cat: 4, wind: 230, pressure: 932, stage: "Current", active: true },
        { time: "+18h", lat: 21.20, lon: 119.50, cat: 4, wind: 220, pressure: 940, stage: "Forecast" },
        { time: "+36h", lat: 22.80, lon: 116.80, cat: 2, wind: 165, pressure: 968, stage: "Forecast" }
      ],
      windRadii: { kt64: 60, kt50: 130, kt34: 260 },
      coastalSurgeProfile: [
        { sector: "Aparri, Cagayan", surgeM: 4.6, tidePeakM: 1.4, totalCrestM: 6.0, alert: "Extreme Overtopping" },
        { sector: "Batanes Islands", surgeM: 4.9, tidePeakM: 1.1, totalCrestM: 6.0, alert: "Direct Eyewall Strike" }
      ]
    }
  ],

  // Flood & Hydrological Basins
  floodBasins: [
    {
      id: "basin-bengal",
      name: "Lower Ganges & Brahmaputra Delta",
      region: "South Asia (West Bengal & Bangladesh)",
      status: "STAGE 4 - CATASTROPHIC INUNDATION",
      statusClass: "critical",
      currentDischargeM3s: 88400,
      normalDischargeM3s: 42000,
      dangerDischargeM3s: 70000,
      floodLevelAboveNormalM: 3.45,
      soilSaturationPct: 96,
      rainfallAccumulation24hMm: 295,
      affectedDistricts: ["South 24 Parganas", "North 24 Parganas", "Khulna", "Satkhira", "Barisal"],
      keyDam: {
        name: "Farakka Barrage Reservoir",
        storagePct: 98.4,
        inflowM3s: 64200,
        outflowM3s: 63800,
        gatesOpen: "107 of 109 Gates",
        risk: "EMERGENCY DISCHARGE TRIGGERED"
      },
      gauges: [
        { name: "Goalundo Ghat (Padma)", currentM: 10.42, dangerM: 8.65, trend: "Rising (+8cm/hr)", alert: "CRITICAL" },
        { name: "Bahadurabad (Jamuna)", currentM: 21.30, dangerM: 19.50, trend: "Rising (+12cm/hr)", alert: "RECORD" },
        { name: "Garden Reach (Hooghly)", currentM: 6.85, dangerM: 5.20, trend: "High Surge (+18cm/hr)", alert: "SURGE OVERTOP" },
        { name: "Chandpur (Lower Meghna)", currentM: 5.40, dangerM: 4.00, trend: "Rising (+6cm/hr)", alert: "MAJOR" }
      ],
      drainageChokePoints: [
        { name: "Adi Ganga Culvert System", capacityPct: 185, status: "Submerged & Backflowing" },
        { name: "Sundarbans Embankment Sector 12", capacityPct: 220, status: "BREACHED (35m gap)" },
        { name: "Bidyadhari Outfall Sluices", capacityPct: 140, status: "Tidally Locked" }
      ]
    },
    {
      id: "basin-mississippi",
      name: "Mississippi River Delta & Atchafalaya",
      region: "Gulf Coast, USA (Louisiana / Mississippi)",
      status: "STAGE 3 - MAJOR RIVERINE FLOOD",
      statusClass: "warning",
      currentDischargeM3s: 54100,
      normalDischargeM3s: 26000,
      dangerDischargeM3s: 48000,
      floodLevelAboveNormalM: 2.30,
      soilSaturationPct: 89,
      rainfallAccumulation24hMm: 180,
      affectedDistricts: ["Orleans Parish", "Plaquemines Parish", "St. Bernard", "Terrebonne", "Jefferson"],
      keyDam: {
        name: "Old River Control Structure",
        storagePct: 92.1,
        inflowM3s: 38200,
        outflowM3s: 37900,
        gatesOpen: "Spillway Diverting 30%",
        risk: "HIGH DIVERSION VOLUME"
      },
      gauges: [
        { name: "Carrollton Gauge (New Orleans)", currentM: 5.35, dangerM: 5.18, trend: "Rising (+3cm/hr)", alert: "MAJOR" },
        { name: "Baton Rouge Station", currentM: 13.40, dangerM: 12.80, trend: "Cresting", alert: "MAJOR" },
        { name: "Morgan City (Atchafalaya)", currentM: 2.85, dangerM: 2.40, trend: "Rising (+4cm/hr)", alert: "MODERATE" }
      ],
      drainageChokePoints: [
        { name: "London Avenue Canal Pump Station", capacityPct: 92, status: "Pumping at 94% Max Capacity" },
        { name: "Industrial Canal Gate 4", capacityPct: 105, status: "Closed for Storm Surge Defense" },
        { name: "Lake Pontchartrain Outfall", capacityPct: 98, status: "Near Surge Equilibrium" }
      ]
    },
    {
      id: "basin-mekong",
      name: "Lower Mekong Delta Basin",
      region: "Southeast Asia (Vietnam / Cambodia)",
      status: "STAGE 2 - MODERATE TRANSBOUNDARY FLOOD",
      statusClass: "notice",
      currentDischargeM3s: 41200,
      normalDischargeM3s: 23000,
      dangerDischargeM3s: 40000,
      floodLevelAboveNormalM: 1.85,
      soilSaturationPct: 84,
      rainfallAccumulation24hMm: 140,
      affectedDistricts: ["An Giang", "Dong Thap", "Long An", "Can Tho"],
      keyDam: {
        name: "Upper Hydropower Cascade",
        storagePct: 87.5,
        inflowM3s: 24500,
        outflowM3s: 22100,
        gatesOpen: "Regulated Release",
        risk: "MONITORED"
      },
      gauges: [
        { name: "Tan Chau (Mekong Mainstem)", currentM: 4.38, dangerM: 4.20, trend: "Rising (+5cm/hr)", alert: "WARNING" },
        { name: "Chau Doc (Bassac River)", currentM: 3.92, dangerM: 3.80, trend: "Rising (+4cm/hr)", alert: "WARNING" }
      ],
      drainageChokePoints: [
        { name: "Vam Nao Connecting Channel", capacityPct: 110, status: "High Velocity Flow" },
        { name: "Cai Lon - Cai Be Tidal Sluice", capacityPct: 95, status: "Closed Against Salt Surge" }
      ]
    }
  ],

  // Citizen Risk Assessment Cities & Vulnerability Profiles
  cities: [
    {
      id: "kolkata",
      name: "Kolkata & Sundarbans Delta",
      country: "India",
      coords: { lat: 22.5726, lon: 88.3639 },
      baseElevationM: 4.5,
      distanceToCoastKm: 85,
      population: "14.9 Million",
      activeCycloneThreat: "cyclone-amrita",
      activeFloodThreat: "basin-bengal",
      overallRiskScore: 94, // 0-100
      riskBreakdown: {
        floodInundation: 96,
        cycloneWind: 92,
        stormSurge: 88,
        powerGridFailure: 90,
        drainageFailure: 95
      },
      currentConditions: {
        windKmh: 145,
        rainMm24h: 240,
        stormSurgeM: 4.8,
        riverStage: "Above Danger Level (+2.2m)"
      },
      evacuationStatus: "MANDATORY EVACUATION IN LOW SECTORS",
      safeZones: [
        { name: "Salt Lake Stadium Mega-Shelter", capacity: 25000, currentOccupancy: 18400, elevM: 8.2, status: "OPEN" },
        { name: "Rabindra Sarobar High Relief Center", capacity: 8000, currentOccupancy: 6100, elevM: 7.5, status: "OPEN" },
        { name: "Dum Dum Elevated Transit Complex", capacity: 12000, currentOccupancy: 9500, elevM: 9.8, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE (0-2h)", action: "Evacuate Zone A & B (Budge Budge, Diamond Harbour, Basanti) to designated cyclone shelters.", priority: "CRITICAL" },
        { time: "WITHIN 4h", action: "Shut off domestic gas mains and elevate electrical circuit breakers above 2 meters.", priority: "HIGH" },
        { time: "WITHIN 6h", action: "Prepare 5 days potable water (3L/person/day) and store dry rations in waterproof containers.", priority: "HIGH" },
        { time: "LANDFALL", action: "Remain indoors away from glass facades. Do not venture out during the eye lull.", priority: "LIFE-SAFETY" }
      ]
    },
    {
      id: "new-orleans",
      name: "New Orleans & River Parishes",
      country: "United States",
      coords: { lat: 29.9511, lon: -90.0715 },
      baseElevationM: -1.8,
      distanceToCoastKm: 65,
      population: "1.27 Million (Metro)",
      activeCycloneThreat: "hurricane-zephyr",
      activeFloodThreat: "basin-mississippi",
      overallRiskScore: 88,
      riskBreakdown: {
        floodInundation: 92,
        cycloneWind: 85,
        stormSurge: 94,
        powerGridFailure: 86,
        drainageFailure: 89
      },
      currentConditions: {
        windKmh: 110,
        rainMm24h: 175,
        stormSurgeM: 3.8,
        riverStage: "Flood Stage (+17.2 ft)"
      },
      evacuationStatus: "VOLUNTARY / PHASED EVACUATION",
      safeZones: [
        { name: "Caesars Superdome Emergency Haven", capacity: 30000, currentOccupancy: 14200, elevM: 4.5, status: "OPEN" },
        { name: "Kenner Pontchartrain Center", capacity: 7500, currentOccupancy: 5200, elevM: 3.8, status: "OPEN" },
        { name: "Baton Rouge Relocation Hub A", capacity: 18000, currentOccupancy: 11200, elevM: 16.5, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE", action: "Residents outside federal levee system must initiate contraflow evacuation via I-10 West.", priority: "CRITICAL" },
        { time: "WITHIN 3h", action: "Deploy flood barriers and test backflow sump pumps.", priority: "HIGH" },
        { time: "WITHIN 6h", action: "Secure outdoor projectiles and board up north-facing windows.", priority: "HIGH" },
        { time: "LANDFALL", action: "Shelter in interior rooms above ground floor. Monitor NOAA weather radio 162.550 MHz.", priority: "LIFE-SAFETY" }
      ]
    },
    {
      id: "dhaka",
      name: "Dhaka & Meghna Confluence",
      country: "Bangladesh",
      coords: { lat: 23.8103, lon: 90.4125 },
      baseElevationM: 6.0,
      distanceToCoastKm: 160,
      population: "21.5 Million",
      activeCycloneThreat: "cyclone-amrita",
      activeFloodThreat: "basin-bengal",
      overallRiskScore: 91,
      riskBreakdown: {
        floodInundation: 94,
        cycloneWind: 82,
        stormSurge: 74,
        powerGridFailure: 92,
        drainageFailure: 96
      },
      currentConditions: {
        windKmh: 115,
        rainMm24h: 210,
        stormSurgeM: 2.6,
        riverStage: "Buriganga Above Danger (+1.8m)"
      },
      evacuationStatus: "RED ALERT - LOWLAND INUNDATION",
      safeZones: [
        { name: "Mirpur Elevated Complex", capacity: 15000, currentOccupancy: 11000, elevM: 12.0, status: "OPEN" },
        { name: "Uttara Sector 14 Emergency Center", capacity: 9000, currentOccupancy: 6400, elevM: 14.5, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE", action: "Move electrical appliances above 1.5m in Kamrangirchar, Demra, and Keraniganj.", priority: "CRITICAL" },
        { time: "WITHIN 4h", action: "Store water purification chlorine tablets and oral rehydration salts.", priority: "HIGH" },
        { time: "LANDFALL", action: "Avoid wading in urban storm runoff due to high electrocution risk.", priority: "LIFE-SAFETY" }
      ]
    },
    {
      id: "miami",
      name: "Miami Beach & Biscayne Bay",
      country: "United States",
      coords: { lat: 25.7617, lon: -80.1918 },
      baseElevationM: 1.2,
      distanceToCoastKm: 2,
      population: "2.75 Million (Miami-Dade)",
      activeCycloneThreat: "hurricane-zephyr",
      activeFloodThreat: "basin-mississippi",
      overallRiskScore: 82,
      riskBreakdown: {
        floodInundation: 86,
        cycloneWind: 79,
        stormSurge: 88,
        powerGridFailure: 80,
        drainageFailure: 84
      },
      currentConditions: {
        windKmh: 85,
        rainMm24h: 120,
        stormSurgeM: 2.2,
        riverStage: "King Tide Surcharge (+0.9m)"
      },
      evacuationStatus: "ADVISORY EVACUATION BARRIER ISLANDS",
      safeZones: [
        { name: "FIU Arena Evacuation Shelter", capacity: 10000, currentOccupancy: 4200, elevM: 6.2, status: "OPEN" },
        { name: "Coral Gables High Relief Haven", capacity: 6000, currentOccupancy: 2800, elevM: 5.5, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE", action: "Move vehicles from underground parking garages to elevated municipal decks.", priority: "CRITICAL" },
        { time: "WITHIN 6h", action: "Charge auxiliary lithium battery packs; install hurricane shutters.", priority: "HIGH" },
        { time: "SURGE", action: "Never drive through salt water flooding; it accelerates battery thermal runaway.", priority: "LIFE-SAFETY" }
      ]
    },
    {
      id: "tampa",
      name: "Tampa Bay & St. Petersburg",
      country: "United States",
      coords: { lat: 27.9506, lon: -82.4572 },
      baseElevationM: 3.5,
      distanceToCoastKm: 12,
      population: "3.2 Million",
      activeCycloneThreat: "hurricane-zephyr",
      activeFloodThreat: "basin-mississippi",
      overallRiskScore: 89,
      riskBreakdown: {
        floodInundation: 91,
        cycloneWind: 88,
        stormSurge: 95,
        powerGridFailure: 84,
        drainageFailure: 87
      },
      currentConditions: {
        windKmh: 130,
        rainMm24h: 165,
        stormSurgeM: 3.6,
        riverStage: "Hillsborough River Flood Stage"
      },
      evacuationStatus: "MANDATORY ZONE A & B",
      safeZones: [
        { name: "USF Sun Dome Mega-Shelter", capacity: 14000, currentOccupancy: 11200, elevM: 11.2, status: "OPEN" },
        { name: "Middleton High Relief Shelter", capacity: 5000, currentOccupancy: 4100, elevM: 9.0, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE", action: "Evacuate coastal pinellas barrier islands immediately before bridges close at 40kt winds.", priority: "CRITICAL" },
        { time: "WITHIN 4h", action: "Turn off irrigation and tie down all exterior patio furniture.", priority: "HIGH" }
      ]
    },
    {
      id: "chennai",
      name: "Chennai & Adyar-Cooum Basin",
      country: "India",
      coords: { lat: 13.0827, lon: 80.2707 },
      baseElevationM: 6.7,
      distanceToCoastKm: 3,
      population: "10.8 Million",
      activeCycloneThreat: "cyclone-amrita",
      activeFloodThreat: "basin-bengal",
      overallRiskScore: 78,
      riskBreakdown: {
        floodInundation: 84,
        cycloneWind: 76,
        stormSurge: 72,
        powerGridFailure: 77,
        drainageFailure: 82
      },
      currentConditions: {
        windKmh: 75,
        rainMm24h: 160,
        stormSurgeM: 1.8,
        riverStage: "Chembarambakkam Lake at 91%"
      },
      evacuationStatus: "ORANGE ALERT - LOW AREAS",
      safeZones: [
        { name: "Jawaharlal Nehru Indoor Stadium", capacity: 12000, currentOccupancy: 6800, elevM: 9.5, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE", action: "Monitor Chembarambakkam surplus discharge bulletins; relocate ground floor assets.", priority: "HIGH" }
      ]
    },
    {
      id: "manila",
      name: "Metro Manila & Laguna de Bay",
      country: "Philippines",
      coords: { lat: 14.5995, lon: 120.9842 },
      baseElevationM: 5.0,
      distanceToCoastKm: 4,
      population: "14.1 Million",
      activeCycloneThreat: "typhoon-maras",
      activeFloodThreat: "basin-mekong",
      overallRiskScore: 87,
      riskBreakdown: {
        floodInundation: 91,
        cycloneWind: 89,
        stormSurge: 85,
        powerGridFailure: 88,
        drainageFailure: 92
      },
      currentConditions: {
        windKmh: 125,
        rainMm24h: 220,
        stormSurgeM: 2.8,
        riverStage: "Marikina River Alert Level 3"
      },
      evacuationStatus: "FORCE EVACUATION MARIKINA VALLEY",
      safeZones: [
        { name: "Marikina Sports Complex", capacity: 16000, currentOccupancy: 13500, elevM: 18.0, status: "OPEN" }
      ],
      recommendedActions: [
        { time: "IMMEDIATE", action: "Move to 2nd storey or designated barangay evacuation center along Marikina river.", priority: "CRITICAL" }
      ]
    }
  ],

  // Emergency Response Incidents (Distress Beacons)
  distressIncidents: [
    {
      id: "SOS-8492",
      type: "FLOOD_STRANDED",
      hazard: "Flood",
      title: "Family of 6 Trapped on Terraced Roof",
      location: "Kakdwip, South 24 Parganas (Lat: 21.874, Lon: 88.188)",
      elevationM: 1.8,
      waterDepthM: 2.4,
      urgency: "CRITICAL",
      urgencyColor: "#ff2a5f",
      peopleCount: 6,
      medicalNeed: "Elderly diabetic requires insulin, 1 infant",
      timeReported: "14 mins ago",
      assignedUnit: "NDRF Bravo-3 Amphibious",
      status: "DISPATCHED",
      coordinates: { x: 580, y: 340 }
    },
    {
      id: "SOS-8493",
      type: "SURGE_BREACH",
      hazard: "Storm Surge",
      title: "Hospital Ground Floor Flood & Generator Submerged",
      location: "Gosaba Rural Hospital, Sundarbans (Lat: 22.165, Lon: 88.802)",
      elevationM: 2.1,
      waterDepthM: 1.7,
      urgency: "CRITICAL",
      urgencyColor: "#ff2a5f",
      peopleCount: 42,
      medicalNeed: "14 oxygen-dependent patients, battery down to 30%",
      timeReported: "28 mins ago",
      assignedUnit: "Indian Coast Guard Helo CG-802",
      status: "AIRLIFT IN PROGRESS",
      coordinates: { x: 620, y: 310 }
    },
    {
      id: "SOS-8494",
      type: "CYCLONE_COLLAPSE",
      hazard: "Cyclone Wind",
      title: "Tin Roof Collapse & High Tension Wire Down",
      location: "Digha Coastal Road Sector 4 (Lat: 21.626, Lon: 87.509)",
      elevationM: 4.2,
      waterDepthM: 0.6,
      urgency: "HIGH",
      urgencyColor: "#ff8c00",
      peopleCount: 12,
      medicalNeed: "2 lacerations, power line active sparking",
      timeReported: "42 mins ago",
      assignedUnit: "Civil Defense Rescue Unit 14",
      status: "EN ROUTE",
      coordinates: { x: 510, y: 390 }
    },
    {
      id: "SOS-8495",
      type: "LEVEE_LEAK",
      hazard: "Flood / Levee",
      title: "Embankment Piping Leak Detected Near School",
      location: "Hasanabad Embankment Post 19 (Lat: 22.580, Lon: 88.920)",
      elevationM: 2.8,
      waterDepthM: 1.1,
      urgency: "URGENT",
      urgencyColor: "#ffb703",
      peopleCount: 180,
      medicalNeed: "Sandbagging reinforcement crew urgently needed",
      timeReported: "55 mins ago",
      assignedUnit: "Irrigation Rapid Task Force",
      status: "ENGAGED",
      coordinates: { x: 650, y: 270 }
    }
  ],

  // Response Deployable Units
  responseUnits: [
    { id: "UNIT-01", name: "Helicopter Air-Sea Rescue Hawk-1", type: "Helicopter", capacity: 14, speedKmh: 240, status: "READY", base: "Kolkata Airbase" },
    { id: "UNIT-02", name: "Amphibious Zodiac Strike Team B-3", type: "Boat", capacity: 8, speedKmh: 45, status: "DEPLOYED", base: "Diamond Harbour" },
    { id: "UNIT-03", name: "High-Water Tactical Rescue Truck 09", type: "Vehicle", capacity: 18, speedKmh: 65, status: "READY", base: "Barasat Outpost" },
    { id: "UNIT-04", name: "Mobile Critical Care Triage Unit 4", type: "Medical", capacity: 6, speedKmh: 70, status: "READY", base: "Kolkata Medical" },
    { id: "UNIT-05", name: "Industrial Sandbag & Levee Armorer", type: "Engineering", capacity: 30, speedKmh: 50, status: "ENGAGED", base: "Basirhat Depot" }
  ],

  // Live Threat Tickers & Alerts
  liveAlerts: [
    { id: "AL-1", type: "EXTREME", text: "IMD BULLETIN 18: Super Cyclone AMRITA central pressure drops to 912 hPa. Landfall expected within 6.5 hours near Sagar Island.", time: "18:02" },
    { id: "AL-2", type: "CRITICAL", text: "RED WARNING: River Padma cresting at 10.42m (+1.77m above danger level). Farakka barrage discharge increased to 64,200 m³/s.", time: "17:54" },
    { id: "AL-3", type: "WARNING", text: "STORM SURGE: 5.8m surge combined with 3.8m King Tide will produce 9.4m total water height along South 24 Parganas coast.", time: "17:45" },
    { id: "AL-4", type: "NOTICE", text: "EVACUATION UPDATE: 482,000 citizens relocated to 1,240 multipurpose cyclone shelters across West Bengal and Odisha.", time: "17:30" }
  ]
};
