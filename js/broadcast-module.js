/**
 * AEGIS Early Warning Broadcast & CAP 1.2 Protocol Studio
 */

class AegisBroadcastModule {
  constructor() {
    this.currentLanguage = 'en';
    this.templates = {
      cyclone: {
        en: {
          headline: "MANDATORY EVACUATION: SUPER CYCLONE AMRITA LANDFALL IMMINENT",
          desc: "Super Cyclone AMRITA (Category 5) will make landfall within 6 hours. Destructive winds exceeding 260 km/h and catastrophic storm surge reaching 5.8m are anticipated.",
          instruction: "Evacuate coastal sectors and low-lying delta areas immediately. Relocate to designated elevated cyclone shelters. Do not remain in tin-roof or kutcha houses."
        },
        es: {
          headline: "EVACUACIÓN OBLIGATORIA: INMINENTE IMPACTO DE SUPER CICLÓN AMRITA",
          desc: "El súper ciclón AMRITA (Categoría 5) tocará tierra dentro de 6 horas con vientos destructivos de más de 260 km/h y marejada ciclónica de 5.8 metros.",
          instruction: "Evacúe inmediatamente las zonas costeras y deltas bajos hacia los refugios elevados designados."
        },
        hi: {
          headline: "अनिवार्य निकासी: सुपर चक्रवात 'अमृता' का आसन्न तट से टकराव",
          desc: "सुपर चक्रवात अमृता (श्रेणी 5) 6 घंटों के भीतर 260 किमी/घंटा की विनाशकारी हवाओं और 5.8 मीटर की सुनामी जैसी तूफानी लहरों के साथ तट से टकराएगा।",
          instruction: "तटीय क्षेत्रों और निचले इलाकों को तुरंत खाली करें। निर्दिष्ट बहुउद्देश्यीय चक्रवात आश्रयों में सुरक्षित जाएं।"
        },
        bn: {
          headline: "বাধ্যতামূলক উচ্ছেদ: সুপার সাইক্লোন 'অমৃতা' উপকূলে আঘাত হানছে",
          desc: "সুপার সাইক্লোন অমৃতা (ক্যাটাগরি ৫) আগামী ৬ ঘণ্টার মধ্যে ২৬০ কিমি/ঘণ্টা বিধ্বংসী বাতাস এবং ৫.৮ মিটার জলোচ্ছ্বাস সহ সুন্দরবন উপকূলে আছড়ে পড়বে।",
          instruction: "উপকূলীয় ও বাঁধ সংলগ্ন এলাকা অবিলম্বে খালি করে নিকটস্থ সাইক্লোন শেল্টারে আশ্রয় নিন।"
        },
        tl: {
          headline: "SAPILITANG PAGLIKAS: NAPAPALAPIT ANG SUPER TYPHOON AMRITA",
          desc: "Ang Super Typhoon AMRITA (Kategorya 5) ay magla-landfall sa loob ng 6 na oras na may hanging hihigit sa 260 km/h at 5.8m storm surge.",
          instruction: "Lumikas agad patungo sa pinakamalapit na matataas na evacuation center."
        },
        fr: {
          headline: "ÉVACUATION OBLIGATOIRE: ATTERRISSAGE IMMINENT DU SUPER CYCLONE",
          desc: "Le super cyclone AMRITA (Catégorie 5) touchera terre d'ici 6 heures avec des vents dépassant 260 km/h et une onde de tempête de 5,8 mètres.",
          instruction: "Évacuez immédiatement les secteurs côtiers vers les abris cycloniques désignés."
        }
      },
      flood: {
        en: {
          headline: "CRITICAL FLASH FLOOD & DAM DISCHARGE EMERGENCY",
          desc: "Extreme river discharge exceeding 88,400 m³/s has triggered widespread levee breach alerts across lower delta districts. Water levels rising rapidly.",
          instruction: "Move immediately to 2nd floors or high ground. Do not attempt to drive or walk through flood waters."
        },
        es: {
          headline: "EMERGENCIA CRÍTICA: INUNDACIÓN REPENTINA Y DESCARGA DE PRESA",
          desc: "Descargas extremas provocan desbordamientos fluviales masivos y rotura inminente de diques.",
          instruction: "Trasládese de inmediato a terrenos altos o segundos pisos. No intente cruzar corrientes de agua."
        },
        hi: {
          headline: "आपातकालीन चेतावनी: भयानक बाढ़ और बांध से भारी जल प्रवाह",
          desc: "88,400 घन मीटर प्रति सेकंड के अत्यधिक प्रवाह से नदी तटबंध टूटने की आशंका है। जलस्तर तेजी से बढ़ रहा है।",
          instruction: "तुरंत ऊंचे स्थानों या पक्के भवनों की ऊपरी मंजिल पर जाएं। बहते पानी में वाहन न चलाएं।"
        },
        bn: {
          headline: "জরুরি সতর্কবার্তা: আকস্মিক বন্যা ও ফারাক্কা বাঁধের জল নিষ্কাশন",
          desc: "৮৮,৪০০ কিউমেক তীব্র জলপ্রবাহের কারণে নদীর জল বিপদসীমার অনেক ওপর দিয়ে বইছে। বাঁধ ভেঙে প্লাবনের আশঙ্কা।",
          instruction: "অবিলম্বে উঁচু স্থানে অথবা পাকা দালানের দোতলায় আশ্রয় নিন। বন্যার জলে নামবেন না।"
        },
        tl: {
          headline: "KRITIKAL NA BABALA SA BAHA AT PAGPAPALABAS NG TUBIG SA DAM",
          desc: "Mabilis na pagtaas ng tubig baha dahil sa pag-apaw ng ilog at emergency dam release.",
          instruction: "Umakyat agad sa matataas na lugar o ikalawang palapag. Huwag lulusong sa baha."
        },
        fr: {
          headline: "ALERTE CRITIQUE: CRUE ÉCLAIR ET DÉBORDEMENT MAJEUR",
          desc: "Niveaux d'eau fluviaux critiques et risque imminent de rupture de digues.",
          instruction: "Gagnez immédiatement les étages supérieurs ou les hauteurs. Ne traversez pas les zones inondées."
        }
      }
    };
    this.selectedHazard = 'cyclone';
  }

  init() {
    this.renderAlertPreview();
    this.renderCapPayload();
    this.bindEvents();
  }

  bindEvents() {
    const langSelect = document.getElementById('broadcast-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.currentLanguage = e.target.value;
        this.renderAlertPreview();
        this.renderCapPayload();
        window.aegisAudio.playClick();
      });
    }

    const hazardSelect = document.getElementById('broadcast-hazard-type');
    if (hazardSelect) {
      hazardSelect.addEventListener('change', (e) => {
        this.selectedHazard = e.target.value;
        this.renderAlertPreview();
        this.renderCapPayload();
        window.aegisAudio.playClick();
      });
    }

    // Siren alarm button
    const sirenBtn = document.getElementById('btn-sound-siren');
    if (sirenBtn) {
      sirenBtn.addEventListener('click', () => {
        window.aegisAudio.playEmergencySiren(4.5);
        document.body.classList.add('emergency-strobe');
        setTimeout(() => {
          document.body.classList.remove('emergency-strobe');
        }, 4500);
      });
    }

    // Copy CAP XML
    const copyXmlBtn = document.getElementById('btn-copy-cap-xml');
    if (copyXmlBtn) {
      copyXmlBtn.addEventListener('click', () => {
        const payload = this.generateCapXML();
        navigator.clipboard.writeText(payload).then(() => {
          copyXmlBtn.textContent = '✓ CAP XML COPIED';
          setTimeout(() => { copyXmlBtn.textContent = '📋 COPY CAP 1.2 XML'; }, 2000);
        });
      });
    }

    // Copy CAP JSON
    const copyJsonBtn = document.getElementById('btn-copy-cap-json');
    if (copyJsonBtn) {
      copyJsonBtn.addEventListener('click', () => {
        const payload = this.generateCapJSON();
        navigator.clipboard.writeText(payload).then(() => {
          copyJsonBtn.textContent = '✓ CAP JSON COPIED';
          setTimeout(() => { copyJsonBtn.textContent = '📋 COPY CAP 1.2 JSON'; }, 2000);
        });
      });
    }
  }

  renderAlertPreview() {
    const t = this.templates[this.selectedHazard][this.currentLanguage] || this.templates[this.selectedHazard]['en'];
    const titleEl = document.getElementById('broadcast-preview-title');
    const descEl = document.getElementById('broadcast-preview-desc');
    const instrEl = document.getElementById('broadcast-preview-instruction');

    if (titleEl) titleEl.textContent = t.headline;
    if (descEl) descEl.textContent = t.desc;
    if (instrEl) instrEl.textContent = t.instruction;
  }

  generateCapXML() {
    const t = this.templates[this.selectedHazard][this.currentLanguage] || this.templates[this.selectedHazard]['en'];
    const nowIso = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>AEGIS-WARN-${Date.now()}</identifier>
  <sender>civil-defense@aegis.gov</sender>
  <sent>${nowIso}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>${this.selectedHazard === 'cyclone' ? 'Tropical Cyclone' : 'Flash Flood'}</event>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <language>${this.currentLanguage}</language>
    <headline>${t.headline}</headline>
    <description>${t.desc}</description>
    <instruction>${t.instruction}</instruction>
    <area>
      <areaDesc>Bengal Delta Coastal Quadrant Sector A-D</areaDesc>
      <circle>21.85,88.35,150.0</circle>
    </area>
  </info>
</alert>`;
  }

  generateCapJSON() {
    const t = this.templates[this.selectedHazard][this.currentLanguage] || this.templates[this.selectedHazard]['en'];
    const obj = {
      identifier: `AEGIS-WARN-${Date.now()}`,
      sender: "civil-defense@aegis.gov",
      sent: new Date().toISOString(),
      status: "Actual",
      msgType: "Alert",
      scope: "Public",
      info: {
        category: "Met",
        event: this.selectedHazard === 'cyclone' ? 'Tropical Cyclone' : 'Flash Flood',
        urgency: "Immediate",
        severity: "Extreme",
        certainty: "Observed",
        language: this.currentLanguage,
        headline: t.headline,
        description: t.desc,
        instruction: t.instruction,
        area: {
          areaDesc: "Bengal Delta Coastal Quadrant Sector A-D",
          circle: "21.85,88.35,150.0"
        }
      }
    };
    return JSON.stringify(obj, null, 2);
  }

  renderCapPayload() {
    const codeEl = document.getElementById('broadcast-cap-code');
    if (codeEl) {
      codeEl.textContent = this.generateCapXML();
    }
  }
}

window.aegisBroadcast = new AegisBroadcastModule();
