/**
 * REVIEWWO QR — Enterprise Interactive JavaScript Engine
 * Powers the interactive phone review simulator, standee visualizer,
 * SEO audit scanner, ROI & conversion calculator, pricing switcher,
 * Beehiiv-style product showcase tabs, mobile navigation, and FAQs.
 * 100% Original Code — Calibrated for Maximum Conversion.
 */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initBeehiivShowcase();
  initSimulator();
  initStandeeCustomizer();
  initSeoScanner();
  initPricingToggle();
  initRoiCalculator();
  initFaqAccordion();
  initSmoothScroll();

  // URL Param Scroll Helper (for deep links)
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTarget = urlParams.get('scroll');
  if (scrollTarget) {
    const el = document.getElementById(scrollTarget);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

/* ----------------------------------------------------
   1. MOBILE NAVIGATION
   ---------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle') || document.getElementById('mobile-nav-toggle');
  const menu = document.querySelector('.mobile-menu') || document.getElementById('mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay') || document.getElementById('mobile-overlay');

  if (!toggle || !menu) return;

  function toggleMenu() {
    const isOpen = menu.classList.contains('active');
    if (isOpen) {
      menu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  toggle.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', toggleMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ----------------------------------------------------
   2. INTERACTIVE PHONE REVIEW FUNNEL SIMULATOR
   ---------------------------------------------------- */
const SIMULATOR_DATA = {
  en: {
    businessName: "Copper Chimney Bistro",
    category: "Modern Dining & Bar",
    tags: [
      "Signature Cocktails",
      "Woodfired Pizza",
      "Attentive Staff",
      "Vibrant Ambiance",
      "Quick Billing",
      "Outdoor Seating"
    ],
    drafts: [
      "Had an amazing dinner at Copper Chimney Bistro! The Signature Cocktails were exceptionally crafted and the Woodfired Pizza had the perfect crust. The staff was attentive and welcoming throughout. Definitely coming back with friends! 🌟",
      "Outstanding dining experience! The vibrant ambiance sets the mood right away. Quick billing and very polite service. Don't miss their woodfired pizza when you visit. Truly 5-star service in every way.",
      "One of the best dining spots in town! Everything from the attentive staff to the cozy outdoor seating made our evening memorable. Delicious cocktails and top-notch hospitality. Highly recommend!"
    ]
  },
  hi: {
    businessName: "Copper Chimney Bistro",
    category: "Modern Dining & Bar",
    tags: [
      "Shaandar Khana",
      "Badhiya Cocktails",
      "Cozy Ambiance",
      "Fast Service",
      "Polite Staff",
      "Best Pizza"
    ],
    drafts: [
      "Copper Chimney Bistro me khana bohot hi lajawab tha! Badhiya cocktails aur mast woodfired pizza. Staff ka behavior bohot polite aur caring tha. Family aur dosto ke saath aane ke liye best jagah hai! ⭐⭐⭐⭐⭐",
      "Superb experience! Cozy ambiance aur fast service ne dil jeet liya. Khana ekdum fresh aur tasty tha. Highly recommended for everyone in the area!",
      "Ekdum 5-star experience! Staff bohot attentive tha aur signature drinks ek number the. Ab har weekend yahi aane ka plan hai. Must visit spot!"
    ]
  }
};

let simState = {
  lang: 'en',
  rating: 5,
  selectedTags: new Set(["Signature Cocktails", "Woodfired Pizza"]),
  activeStep: 1
};

function initSimulator() {
  const container = document.getElementById('phone-simulator');
  if (!container) return;

  renderSimulatorStep(container, simState.activeStep);

  document.querySelectorAll('.sim-step-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const step = parseInt(this.dataset.step, 10);
      setSimulatorStep(step);
    });
  });

  document.querySelectorAll('.sim-lang-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.sim-lang-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      simState.lang = this.dataset.lang;
      renderSimulatorStep(container, simState.activeStep);
    });
  });
}

function setSimulatorStep(step) {
  simState.activeStep = step;
  const container = document.getElementById('phone-simulator');
  if (container) renderSimulatorStep(container, step);

  document.querySelectorAll('.sim-step-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.step, 10) === step);
  });
}

function renderSimulatorStep(container, step) {
  const phoneScreen = container.querySelector('.phone-screen-content');
  if (!phoneScreen) return;

  const data = SIMULATOR_DATA[simState.lang];

  if (step === 1) {
    phoneScreen.innerHTML = `
      <div class="sim-view sim-step-1">
        <div class="sim-scan-header">
          <div class="sim-camera-target">
            <div class="sim-qr-box">
              <div class="sim-qr-corner tl"></div>
              <div class="sim-qr-corner tr"></div>
              <div class="sim-qr-corner bl"></div>
              <div class="sim-qr-corner br"></div>
              <div class="sim-scan-line"></div>
              <img src="assets/img/logo.svg" alt="QR" style="width: 70px; height: 70px; opacity: 0.95; filter: drop-shadow(0 4px 10px rgba(20,184,166,0.3));">
            </div>
            <p class="sim-scan-hint"><i class="fa-solid fa-camera"></i> Camera auto-detects Reviewwo QR</p>
          </div>
        </div>

        <div class="sim-card-popup animate-popup">
          <div class="sim-biz-row">
            <div class="sim-biz-avatar"><i class="fa-solid fa-utensils"></i></div>
            <div>
              <div class="sim-biz-name">${data.businessName}</div>
              <div class="sim-biz-sub">${data.category} • Verified Google Business</div>
            </div>
          </div>
          <button class="btn btn-primary btn-block sim-action-btn" onclick="setSimulatorStep(2)">
            <i class="fa-solid fa-bolt"></i> Tap to Leave Feedback (10s)
          </button>
        </div>
      </div>
    `;
  } else if (step === 2) {
    phoneScreen.innerHTML = `
      <div class="sim-view sim-step-2">
        <div class="sim-top-nav">
          <button class="sim-back-btn" onclick="setSimulatorStep(1)"><i class="fa-solid fa-arrow-left"></i></button>
          <span>Rate Your Visit</span>
          <span style="width:24px"></span>
        </div>

        <div class="sim-body">
          <div class="sim-biz-header-card">
            <div class="sim-biz-avatar"><i class="fa-solid fa-utensils"></i></div>
            <h4>${data.businessName}</h4>
            <p>How was your experience today?</p>
          </div>

          <div class="sim-star-picker">
            ${[1, 2, 3, 4, 5].map(star => `
              <button class="sim-star-btn ${star <= simState.rating ? 'active' : ''}" onclick="selectRating(${star})">
                <i class="fa-solid fa-star"></i>
              </button>
            `).join('')}
          </div>
          <div class="sim-rating-label">${simState.rating === 5 ? 'Exceptional! 5 Stars' : simState.rating === 4 ? 'Great Experience' : 'Needs Improvement'}</div>

          <p class="sim-helper-text">
            ${simState.rating >= 4
              ? '✨ 4 & 5-star ratings route to Google Maps with AI-crafted drafts!'
              : '🛡️ Ratings under 4 stars route to our Private Resolution Shield.'}
          </p>

          <button class="btn btn-primary btn-block" onclick="setSimulatorStep(3)">
            Continue Next <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  } else if (step === 3) {
    if (simState.rating >= 4) {
      phoneScreen.innerHTML = `
        <div class="sim-view sim-step-3-pos">
          <div class="sim-top-nav">
            <button class="sim-back-btn" onclick="setSimulatorStep(2)"><i class="fa-solid fa-arrow-left"></i></button>
            <span>AI Review Assistant</span>
            <span class="sim-badge-pill">24+ Langs</span>
          </div>

          <div class="sim-body">
            <div class="sim-instruction">Tap what made your visit special:</div>
            <div class="sim-tags-cloud">
              ${data.tags.map(t => `
                <button class="sim-chip ${simState.selectedTags.has(t) ? 'active' : ''}" onclick="toggleTag('${t}')">
                  ${t}
                </button>
              `).join('')}
            </div>

            <div class="sim-instruction" style="margin-top: 14px;">Choose an AI-Generated Draft:</div>
            <div class="sim-drafts-list">
              ${data.drafts.map((draft, idx) => `
                <div class="sim-draft-card ${idx === 0 ? 'selected' : ''}" onclick="selectDraft(${idx})">
                  <div class="sim-draft-meta">
                    <span class="sim-draft-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Option ${idx + 1}</span>
                    <span class="sim-draft-stars">★★★★★</span>
                  </div>
                  <div class="sim-draft-text">"${draft}"</div>
                  <button class="sim-copy-pill" onclick="postToGoogle('${encodeURIComponent(draft)}')">
                    <i class="fa-solid fa-copy"></i> 1-Tap Copy & Post to Google
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      phoneScreen.innerHTML = `
        <div class="sim-view sim-step-3-shield">
          <div class="sim-top-nav">
            <button class="sim-back-btn" onclick="setSimulatorStep(2)"><i class="fa-solid fa-arrow-left"></i></button>
            <span>Private Management Shield</span>
            <i class="fa-solid fa-shield-halved" style="color: #14B8A6;"></i>
          </div>

          <div class="sim-body">
            <div class="sim-shield-card">
              <div class="sim-shield-icon"><i class="fa-solid fa-heart-crack"></i></div>
              <h4>We're Sorry We Fell Short</h4>
              <p>Your feedback goes directly to the General Manager's private phone. We will contact you immediately to make this right.</p>

              <textarea class="sim-textarea" placeholder="Tell us what went wrong so we can fix it..."></textarea>
              <input type="text" class="sim-input" placeholder="Your Phone or WhatsApp number">
              <button class="btn btn-primary btn-block" onclick="submitPrivateShield()">
                <i class="fa-solid fa-lock"></i> Submit Privately to Owner
              </button>
              <small class="sim-shield-note"><i class="fa-solid fa-shield"></i> Keeps negative ratings off public Google Maps</small>
            </div>
          </div>
        </div>
      `;
    }
  } else if (step === 4) {
    phoneScreen.innerHTML = `
      <div class="sim-view sim-step-4">
        <div class="sim-gmaps-bar">
          <i class="fa-brands fa-google" style="color: #4285F4; font-size: 18px;"></i>
          <span>Google Maps Verified Review</span>
          <span style="color:#10B981; font-size: 12px; font-weight: 700;">● LIVE</span>
        </div>

        <div class="sim-body">
          <div class="sim-gmaps-card">
            <div class="sim-reviewer-row">
              <div class="sim-reviewer-avatar">RK</div>
              <div>
                <div class="sim-reviewer-name">Rahul Kapoor</div>
                <div class="sim-reviewer-sub">Local Guide • 42 reviews</div>
              </div>
            </div>

            <div class="sim-stars-row">★★★★★ <span class="sim-time">Just now</span></div>
            <div class="sim-posted-text">
              "${data.drafts[0]}"
            </div>
            <div class="sim-post-badge">
              <i class="fa-solid fa-circle-check"></i> Published to Google Maps in 9.2 seconds
            </div>
          </div>

          <div class="sim-autopilot-prompt">
            <div class="sim-ap-icon"><i class="fa-solid fa-robot"></i></div>
            <div class="sim-ap-text">
              <strong>Reviewwo AI Autopilot</strong> is preparing an instant brand-voice reply...
            </div>
          </div>

          <button class="btn btn-primary btn-block" onclick="setSimulatorStep(5)">
            View 24/7 Autopilot Reply <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  } else if (step === 5) {
    phoneScreen.innerHTML = `
      <div class="sim-view sim-step-5">
        <div class="sim-top-nav">
          <button class="sim-back-btn" onclick="setSimulatorStep(4)"><i class="fa-solid fa-arrow-left"></i></button>
          <span>24/7 AI Autopilot Reply</span>
          <span class="sim-badge-pill" style="background:#10B981; color:#fff;">Live on Google</span>
        </div>

        <div class="sim-body">
          <div class="sim-gmaps-card">
            <div class="sim-reviewer-row">
              <div class="sim-reviewer-avatar">RK</div>
              <div>
                <div class="sim-reviewer-name">Rahul Kapoor</div>
                <div class="sim-stars-row">★★★★★ <span class="sim-time">1 min ago</span></div>
              </div>
            </div>
            <div class="sim-posted-text">"${data.drafts[0]}"</div>

            <div class="sim-reply-bubble">
              <div class="sim-reply-author">
                <i class="fa-solid fa-reply"></i>
                <strong>Response from the owner</strong>
                <span class="sim-ap-tag">AI Autopilot</span>
              </div>
              <p>
                "Hi Rahul! Thank you so much for the glowing 5-star review! We're delighted you loved our Signature Cocktails and Woodfired Pizza. Our team takes great pride in warm hospitality. Looking forward to welcoming you back again soon! — Management at ${data.businessName}"
              </p>
            </div>
          </div>

          <div class="sim-success-card">
            <div class="sim-stat-col">
              <div class="sim-stat-val">+1</div>
              <div class="sim-stat-lbl">5-Star Review</div>
            </div>
            <div class="sim-stat-col">
              <div class="sim-stat-val">4.9★</div>
              <div class="sim-stat-lbl">Store Rating</div>
            </div>
            <div class="sim-stat-col">
              <div class="sim-stat-val">100%</div>
              <div class="sim-stat-lbl">Reply Rate</div>
            </div>
          </div>

          <button class="btn btn-primary btn-block" onclick="setSimulatorStep(1)">
            <i class="fa-solid fa-rotate-left"></i> Restart Funnel Walkthrough
          </button>
        </div>
      </div>
    `;
  }
}

window.selectRating = function (val) {
  simState.rating = val;
  setSimulatorStep(2);
};

window.toggleTag = function (tag) {
  if (simState.selectedTags.has(tag)) {
    simState.selectedTags.delete(tag);
  } else {
    simState.selectedTags.add(tag);
  }
  setSimulatorStep(3);
};

window.selectDraft = function (idx) {
  document.querySelectorAll('.sim-draft-card').forEach((card, i) => {
    card.classList.toggle('selected', i === idx);
  });
};

window.postToGoogle = function (encodedDraft) {
  showToast("Review copied! Opening Google Maps review modal...");
  setTimeout(() => {
    setSimulatorStep(4);
  }, 700);
};

window.submitPrivateShield = function () {
  showToast("Protected! Feedback routed privately to manager's dashboard & WhatsApp.");
  setTimeout(() => {
    setSimulatorStep(1);
  }, 1200);
};

/* ----------------------------------------------------
   3. INTERACTIVE STANDEE & FLYER VISUALIZER
   ---------------------------------------------------- */
function initStandeeCustomizer() {
  const customizer = document.getElementById('standee-visualizer');
  if (!customizer) return;

  const colorPickers = customizer.querySelectorAll('.standee-color-swatch');
  const nameInput = customizer.querySelector('#standee-name-input');
  const previewName = customizer.querySelector('.standee-preview-name');
  const standeeCard = customizer.querySelector('.standee-preview-card');
  const templateBtns = customizer.querySelectorAll('.standee-template-btn');

  if (colorPickers) {
    colorPickers.forEach(swatch => {
      swatch.addEventListener('click', function () {
        colorPickers.forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        const color = this.dataset.color;
        if (standeeCard) {
          standeeCard.style.setProperty('--standee-accent', color);
          standeeCard.querySelectorAll('.accent-fill').forEach(el => el.style.fill = color);
          standeeCard.querySelectorAll('.accent-bg').forEach(el => el.style.backgroundColor = color);
          standeeCard.querySelectorAll('.accent-border').forEach(el => el.style.borderColor = color);
        }
      });
    });
  }

  if (nameInput && previewName) {
    nameInput.addEventListener('input', function () {
      previewName.textContent = this.value.trim() || "Your Business Name";
    });
  }

  if (templateBtns) {
    templateBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        templateBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tmpl = this.dataset.template;
        if (standeeCard) {
          standeeCard.dataset.template = tmpl;
        }
      });
    });
  }
}

/* ----------------------------------------------------
   4. INTERACTIVE LOCAL SEO AUDIT SCANNER
   ---------------------------------------------------- */
function initSeoScanner() {
  const scannerForm = document.getElementById('seo-audit-form');
  const resultsBox = document.getElementById('seo-audit-results');
  if (!scannerForm) return;

  scannerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = scannerForm.querySelector('input[name="business_query"]');
    const query = input && input.value.trim() ? input.value.trim() : "Artisan Cafe & Bakery";

    const submitBtn = scannerForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning Google Maps Pack...';
    }

    if (resultsBox) {
      resultsBox.style.display = 'block';
      resultsBox.innerHTML = `
        <div class="audit-scanning-animation" style="padding: 24px; text-align: center;">
          <p class="audit-status-text" style="color: #0B3D3B; font-weight: 600;"><i class="fa-solid fa-radar fa-spin" style="color: #14B8A6;"></i> Analyzing Profile Completeness, Review Velocity & Local Keywords for "${query}"...</p>
        </div>
      `;
      resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTimeout(() => {
      if (resultsBox) {
        renderAuditResults(resultsBox, query);
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Run Free Local SEO Audit';
      }
    }, 1500);
  });
}

function renderAuditResults(container, businessName) {
  container.innerHTML = `
    <div class="audit-report-card" style="background: #FFFFFF; border: 1.5px solid #99F6E4; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(11, 61, 59, 0.05); margin-top: 20px;">
      <div class="audit-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E6FFFB; padding-bottom: 16px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge" style="background:#E6FFFB; color:#0B3D3B; border:1px solid #99F6E4; font-weight:700;">AUDIT REPORT READY</span>
          <h3 style="margin-top: 6px; font-size: 1.4rem; color:#0B3D3B;">${businessName}</h3>
          <p style="color:#4A706E; font-size: 0.9rem;">Google Business Profile & Local 3-Pack Authority Analysis</p>
        </div>
        <div class="audit-score-circle" style="text-align: center; background: #E6FFFB; border: 2px solid #14B8A6; border-radius: 50%; width: 72px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="score-val" style="font-size: 1.6rem; font-weight: 900; color: #0B3D3B; line-height: 1;">91</div>
          <div class="score-lbl" style="font-size: 9px; font-weight: 700; color: #14B8A6; text-transform: uppercase;">Score</div>
        </div>
      </div>

      <div class="audit-pillars-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px;">
        <div class="pillar-item" style="background: #F8FFFE; border: 1px solid #99F6E4; border-radius: 10px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #4A706E;">Profile Completeness</div>
          <div style="font-size: 1.3rem; font-weight: 900; color: #10B981; margin: 4px 0;">96% (Verified)</div>
          <div style="font-size: 11px; color: #4A706E;">NAP and opening hours set properly</div>
        </div>

        <div class="pillar-item" style="background: #F8FFFE; border: 1px solid #99F6E4; border-radius: 10px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #4A706E;">Review Velocity</div>
          <div style="font-size: 1.3rem; font-weight: 900; color: #F59E0B; margin: 4px 0;">4 reviews / mo</div>
          <div style="font-size: 11px; color: #DC2626;">Top 3 competitors average 28/mo</div>
        </div>

        <div class="pillar-item" style="background: #F8FFFE; border: 1px solid #99F6E4; border-radius: 10px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #4A706E;">Owner Response Rate</div>
          <div style="font-size: 1.3rem; font-weight: 900; color: #DC2626; margin: 4px 0;">32% (Slow)</div>
          <div style="font-size: 11px; color: #DC2626;">Google algorithm rewards 100% reply rate</div>
        </div>
      </div>

      <div class="audit-recommendation-box" style="background: #E6FFFB; border: 1px solid #14B8A6; border-radius: 12px; padding: 18px;">
        <h4 style="margin: 0 0 6px; color: #0B3D3B; font-size: 14px; font-weight: 800;"><i class="fa-solid fa-lightbulb" style="color:#14B8A6;"></i> Reviewwo QR Growth Prescription:</h4>
        <p style="font-size: 13px; color: #234745; margin: 0 0 14px; line-height: 1.5;">
          Deploying Reviewwo QR standees will accelerate review velocity by an estimated <strong>3.5x within 30 days</strong>. Enabling 24/7 Autopilot Reply will immediately bring your response rate to <strong>100%</strong>, qualifying your business for Google Maps Top-3 Local Pack placement.
        </p>
        <div style="display:flex; gap: 10px; flex-wrap: wrap;">
          <a href="pages/register.html?plan=growth" class="btn btn-primary btn-sm">Start 3-Day Free Trial (₹299/mo) &rarr;</a>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Audit report copied to clipboard!')">Copy Audit Summary</button>
        </div>
      </div>
    </div>
  `;
}

/* ----------------------------------------------------
   5. PRICING MONTHLY / ANNUAL TOGGLE (₹149 / ₹299 / ₹799)
   ---------------------------------------------------- */
function initPricingToggle() {
  const billingToggle = document.getElementById('pricing-billing-toggle') || document.getElementById('billing-toggle');
  if (!billingToggle) return;

  const prices = {
    monthly: {
      starter: "149",
      growth: "299",
      agency: "799",
      period: "/month"
    },
    annual: {
      starter: "119",
      growth: "239",
      agency: "639",
      period: "/month (billed annually)"
    }
  };

  billingToggle.addEventListener('change', function () {
    const isAnnual = this.checked;
    const mode = isAnnual ? 'annual' : 'monthly';

    document.querySelectorAll('.price-starter').forEach(el => el.textContent = prices[mode].starter);
    document.querySelectorAll('.price-growth').forEach(el => el.textContent = prices[mode].growth);
    document.querySelectorAll('.price-agency').forEach(el => el.textContent = prices[mode].agency);
    document.querySelectorAll('.price-period').forEach(el => el.textContent = prices[mode].period);

    document.querySelectorAll('.billing-discount-badge').forEach(badge => {
      badge.style.display = isAnnual ? 'inline-block' : 'none';
    });
  });
}

/* ----------------------------------------------------
   6. LIVE ROI & CONVERSION CALCULATOR
   ---------------------------------------------------- */
function initRoiCalculator() {
  // Support both calc-slider (new index.html) and roi-visitors-slider
  const slider = document.getElementById('calc-slider') || document.getElementById('roi-visitors-slider');
  const footfallVal = document.getElementById('calc-footfall-val') || document.getElementById('roi-visitors-label');
  const reviewsVal = document.getElementById('calc-reviews-val') || document.getElementById('roi-monthly-reviews');
  const shieldVal = document.getElementById('calc-shield-val');
  const revenueVal = document.getElementById('calc-revenue-val');

  if (!slider) return;

  function update() {
    const footfall = parseInt(slider.value, 10);
    if (footfallVal) {
      footfallVal.textContent = footfall.toLocaleString('en-IN') + (footfallVal.id === 'calc-footfall-val' ? ' customers' : '');
    }

    // 15% conversion to 5-star review via 1-tap QR tap
    const reviews = Math.round(footfall * 0.15);
    // 2% caught by private grievance shield
    const shielded = Math.round(footfall * 0.02);
    // Each verified 5-star review generates ~₹300 in new customer lifetime value
    const revenue = reviews * 300;

    if (reviewsVal) {
      reviewsVal.textContent = reviewsVal.id === 'calc-reviews-val' ? (reviews + ' / mo') : ('+' + reviews);
    }
    if (shieldVal) {
      shieldVal.textContent = shielded + ' / mo';
    }
    if (revenueVal) {
      revenueVal.textContent = '₹' + revenue.toLocaleString('en-IN') + ' / mo';
    }
  }

  slider.addEventListener('input', update);
  update();
}

/* ----------------------------------------------------
   7. BEEHIIV-STYLE INTERACTIVE PRODUCT SHOWCASE
   ---------------------------------------------------- */
function initBeehiivShowcase() {
  const tabBtns = document.querySelectorAll('.beehiiv-tab-btn');
  const panes = document.querySelectorAll('.beehiiv-pane');
  if (!tabBtns.length || !panes.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetPaneId = this.dataset.pane;
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const target = document.getElementById('pane-' + targetPaneId);
      if (target) {
        target.classList.add('active');
      }
    });
  });

  // AI Review Drafter Tone Toggle
  const drafterToggles = document.querySelectorAll('.showcase-tone-btn');
  const drafterCards = document.querySelectorAll('.showcase-review-card');
  if (drafterToggles.length) {
    drafterToggles.forEach(btn => {
      btn.addEventListener('click', function () {
        drafterToggles.forEach(b => {
          b.classList.remove('active');
          b.style.background = '#FFFFFF';
          b.style.color = '#0B3D3B';
        });
        this.classList.add('active');
        this.style.background = '#14B8A6';
        this.style.color = '#FFFFFF';

        const tone = this.dataset.tone;
        if (tone === 'hinglish') {
          if (drafterCards[0]) drafterCards[0].querySelector('p').textContent = '"Café Verona ka Truffle Pasta aur Cold Brew sach me out of this world hai! Staff bahut polite hai aur ambiance ekdum 10/10. Definitely coming back soon!"';
          if (drafterCards[1]) drafterCards[1].querySelector('p').textContent = '"Weekend dinner ke liye best place. Pizza crust crispy tha aur service ultra fast thi. Loved the vibe!"';
        } else {
          if (drafterCards[0]) drafterCards[0].querySelector('p').textContent = '"Outstanding experience at Café Verona! The Truffle Pasta was cooked to perfection and the iced brew was crisp and refreshing. Staff was remarkably attentive."';
          if (drafterCards[1]) drafterCards[1].querySelector('p').textContent = '"Easily the best dining ambiance in town. Exceptional hospitality, delicious wood-fired pizza, and cozy lighting. 5 stars all the way!"';
        }
        showToast('AI Review drafts updated in ' + tone.toUpperCase());
      });
    });
  }

  // Showcase Private Shield Star Clicker
  const shieldStars = document.querySelectorAll('.showcase-shield-star');
  const shieldAlertBox = document.getElementById('showcase-shield-alert');
  if (shieldStars.length && shieldAlertBox) {
    shieldStars.forEach(star => {
      star.addEventListener('click', function () {
        const rating = parseInt(this.dataset.rating, 10);
        shieldStars.forEach((s, idx) => {
          if (idx < rating) {
            s.style.color = '#F59E0B';
          } else {
            s.style.color = '#CBD5E1';
          }
        });

        if (rating <= 3) {
          shieldAlertBox.innerHTML = `
            <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 10px; padding: 14px; display: flex; align-items: flex-start; gap: 12px; text-align: left;">
              <i class="fa-solid fa-shield-halved" style="color: #D97706; font-size: 20px; margin-top: 2px;"></i>
              <div>
                <strong style="color: #92400E; font-size: 13px; display: block;">Private Shield Triggered (${rating} Stars)</strong>
                <p style="font-size: 12px; color: #78350F; margin: 4px 0 0; line-height: 1.4;">
                  Notice: Public Google review popup was <strong>blocked</strong>. The guest is redirected to a private WhatsApp feedback chat with the general manager. Your public Google rating stays 100% protected at <strong>4.9 ★</strong>!
                </p>
              </div>
            </div>
          `;
          showToast('Private Feedback Shield protected your Google rating!');
        } else {
          shieldAlertBox.innerHTML = `
            <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 10px; padding: 14px; display: flex; align-items: flex-start; gap: 12px; text-align: left;">
              <i class="fa-solid fa-circle-check" style="color: #059669; font-size: 20px; margin-top: 2px;"></i>
              <div>
                <strong style="color: #065F46; font-size: 13px; display: block;">5-Star Verified Experience</strong>
                <p style="font-size: 12px; color: #047857; margin: 4px 0 0; line-height: 1.4;">
                  AI review is copied to customer clipboard. 1-tap direct intent opened Google Maps Write-Review modal. Review goes live in seconds!
                </p>
              </div>
            </div>
          `;
          showToast('1-Tap Google Review intent triggered!');
        }
      });
    });
  }

  // Showcase Autopilot Reply Trigger
  const apTriggerBtn = document.getElementById('showcase-ap-trigger');
  const apReplyOutput = document.getElementById('showcase-ap-output');
  if (apTriggerBtn && apReplyOutput) {
    apTriggerBtn.addEventListener('click', function () {
      this.disabled = true;
      this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating SEO Reply via Gemini 2.0...';
      setTimeout(() => {
        apReplyOutput.style.display = 'block';
        apReplyOutput.innerHTML = `
          <div style="background: #E6FFFB; border: 1px solid #14B8A6; border-radius: 10px; padding: 14px; margin-top: 12px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #0B3D3B; text-transform: uppercase;"><i class="fa-solid fa-robot" style="color: #14B8A6;"></i> Official Owner Reply (Posted 32s ago)</span>
              <span style="font-size: 10px; background: #14B8A6; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Google API Synced</span>
            </div>
            <p style="font-size: 12px; color: #0B3D3B; margin: 0; line-height: 1.4;">
              "Hi Priya! Thank you for reviewing Café Verona. We are thrilled you enjoyed our signature Truffle Mushroom Pasta and felt welcomed by our team. Google ranking keywords automatically included: #bestpastaintown #cafeambiance. See you again soon!"
            </p>
          </div>
        `;
        this.disabled = false;
        this.innerHTML = '<i class="fa-solid fa-bolt"></i> Re-generate Autopilot Response';
        showToast('AI response posted to Google Business Profile!');
      }, 700);
    });
  }
}

/* ----------------------------------------------------
   8. FAQ ACCORDION
   ---------------------------------------------------- */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------
   9. UTILITY: SMOOTH SCROLL & TOAST
   ---------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('reviewwo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'reviewwo-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0B3D3B;
      color: #E6FFFB;
      border: 1px solid #14B8A6;
      box-shadow: 0 10px 30px rgba(11, 61, 59, 0.35);
      padding: 14px 22px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: system-ui, -apple-system, sans-serif;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(20px);
      opacity: 0;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #14B8A6; font-size: 16px;"></i> ${message}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
  }, 3500);
}
window.showToast = showToast;

/* ----------------------------------------------------
   10. SECURITY: INPUT SANITIZATION
   ---------------------------------------------------- */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
window.sanitizeInput = sanitizeInput;
