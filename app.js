(function () {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Mobile Navigation Drawer
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('is-open', !open);
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('is-open');
      });
    });
  }

  // 2. Hero Rotating Word Slot
  const cycleEl = document.getElementById('heroCycleWord');
  const cycleWords = ['Smart Shaving.', 'NFC 3-in-1.', 'AI Morning.'];
  let cycleIdx = 0;
  if (cycleEl && !prefersReducedMotion) {
    window.setInterval(function () {
      if (document.hidden) return;
      cycleEl.classList.add('is-swapping');
      window.setTimeout(function () {
        cycleIdx = (cycleIdx + 1) % cycleWords.length;
        cycleEl.textContent = cycleWords[cycleIdx];
        cycleEl.classList.remove('is-swapping');
      }, 220);
    }, 3800);
  }

  // 3. Hero Scene Switcher (01 Studio Film / 02 Vanity Dock / 03 Color Screen / 04 Blade Detail)
  const sceneLayers = document.querySelectorAll('[data-hero-layer]');
  const sceneTabs = document.querySelectorAll('[data-hero-scene]');
  const heroVideo = document.getElementById('heroSceneFilm');
  sceneTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-hero-scene');
      sceneTabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      sceneLayers.forEach(function (layer) {
        layer.classList.toggle('is-active', layer.getAttribute('data-hero-layer') === target);
      });
      if (heroVideo) {
        if (target === 'film' && !prefersReducedMotion) {
          heroVideo.play().catch(function () {});
        } else {
          heroVideo.pause();
        }
      }
    });
  });

  // 4. ToC 3-in-1 Interactive Attachment Stage
  const attachmentData = {
    rotary: {
      img: './assets/s1-head-rotary.png',
      alt: 'SUKOVA S1 3D Rotary Beard Shaving Head',
      badge: 'Included · Pre-Installed',
      title: '3D Rotary Beard Shaver',
      desc: 'Triple floating rings adapt smoothly across cheekbones and jawline. Embedded NFC automatically dials in 2,800–3,200 RPM across Gentle, Standard, and Turbo gears while logging blade wear.',
      speedText: '2,800–3,200 RPM · Smooth Face Comfort',
      barWidth: '64%'
    },
    nose: {
      img: './assets/s1-head-nose.png',
      alt: 'SUKOVA S1 Shielded Nose and Ear Trimmer Head',
      badge: 'Included · Quick-Swap NFC',
      title: 'Nose & Ear Trimmer Head',
      desc: 'Snap in the vertical dome and S1 immediately boosts speed to 4,500–5,000 RPM for effortless, pinch-free trimming around delicate nasal and ear contours.',
      speedText: '4,500–5,000 RPM · High-Speed Micro Cut',
      barWidth: '92%'
    },
    sideburn: {
      img: './assets/s1-head-sideburn.png',
      alt: 'SUKOVA S1 Precision Sideburn and Beard Detailer Head',
      badge: 'Included · Quick-Swap NFC',
      title: 'Sideburn & Edge Detailer',
      desc: 'Wide precision dual-tooth stainless blade calibrated via NFC to 4,500–5,000 RPM for razor-sharp sideburns, clean necklines, and mustache symmetry.',
      speedText: '4,500–5,000 RPM · Crisp Line Control',
      barWidth: '94%'
    }
  };

  const stageImg = document.getElementById('stageHeadImg');
  const stageBadge = document.getElementById('stageHeadBadge');
  const stageTitle = document.getElementById('stageHeadTitle');
  const stageDesc = document.getElementById('stageHeadDesc');
  const stageSpeedText = document.getElementById('stageSpeedText');
  const stageSpeedFill = document.getElementById('stageSpeedFill');

  document.querySelectorAll('[data-attach]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.getAttribute('data-attach');
      const item = attachmentData[key];
      if (!item) return;
      document.querySelectorAll('[data-attach]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (stageImg) { stageImg.src = item.img; stageImg.alt = item.alt; }
      if (stageBadge) stageBadge.textContent = item.badge;
      if (stageTitle) stageTitle.textContent = item.title;
      if (stageDesc) stageDesc.textContent = item.desc;
      if (stageSpeedText) stageSpeedText.textContent = item.speedText;
      if (stageSpeedFill) stageSpeedFill.style.width = item.barWidth;
    });
  });

  // 5. Gallery Interactive Before / After Macro Slider
  const compareStage = document.getElementById('macroCompareStage');
  if (compareStage) {
    let dragging = false;
    let currentPct = 52;
    function setSplit(pct) {
      currentPct = Math.max(8, Math.min(92, pct));
      compareStage.style.setProperty('--split', currentPct.toFixed(1) + '%');
      compareStage.setAttribute('aria-valuenow', String(Math.round(currentPct)));
    }
    function updateFromClientX(clientX) {
      const rect = compareStage.getBoundingClientRect();
      if (!rect.width) return;
      setSplit(((clientX - rect.left) / rect.width) * 100);
    }
    compareStage.addEventListener('pointerdown', function (e) {
      dragging = true;
      compareStage.setPointerCapture && compareStage.setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    });
    compareStage.addEventListener('pointermove', function (e) {
      if (dragging) updateFromClientX(e.clientX);
    });
    compareStage.addEventListener('pointerup', function () { dragging = false; });
    compareStage.addEventListener('pointercancel', function () { dragging = false; });
    compareStage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setSplit(currentPct - 6); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setSplit(currentPct + 6); }
    });
  }

  // 6. Consumer Bento Card 2 Voice Scene Speech Bubbles
  const voiceDialogs = {
    weather: {
      ask: 'You: "Hey SUKOVA, what\'s the weather today?"',
      reply: 'S1: "Good morning — 22°C & sunny today. Beard head ready at 3,000 RPM."'
    },
    news: {
      ask: 'You: "Hey SUKOVA, play morning news brief."',
      reply: 'S1: "Playing today\'s 60-second morning headlines over 2.4GHz Wi-Fi."'
    },
    music: {
      ask: 'You: "Hey SUKOVA, play built-in music."',
      reply: 'S1: "Streaming built-in morning audio right from your handle — phone stays dry."'
    }
  };
  const askEl = document.getElementById('voiceAskText');
  const replyEl = document.getElementById('voiceReplyText');
  document.querySelectorAll('[data-voice-scene]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.getAttribute('data-voice-scene');
      const d = voiceDialogs[key];
      if (!d) return;
      document.querySelectorAll('[data-voice-scene]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (askEl) askEl.textContent = d.ask;
      if (replyEl) replyEl.textContent = d.reply;
    });
  });

  // 7. Consumer Comparison & Specs Console Tabs
  const consoleTabs = document.querySelectorAll('[data-console-tab]');
  const consolePanels = document.querySelectorAll('[data-console-panel]');
  consoleTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-console-tab');
      consoleTabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      consolePanels.forEach(function (p) {
        p.hidden = p.getAttribute('data-console-panel') !== target;
      });
    });
  });

  // 8. FAQ Accordions
  document.querySelectorAll('.faq-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const open = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const sign = btn.querySelector('.faq-sign');
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
      if (sign) sign.textContent = open ? '+' : '−';
    });
  });

  // 9. Early Access Waitlist Form
  const waitlistForm = document.getElementById('waitlistForm');
  const waitlistEmail = document.getElementById('waitlistEmail');
  const waitlistStatus = document.getElementById('waitlistStatus');
  if (waitlistForm && waitlistEmail && waitlistStatus) {
    waitlistForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = (waitlistEmail.value || '').trim();
      if (!val || val.indexOf('@') === -1 || val.indexOf('.') === -1) {
        waitlistStatus.textContent = 'Please enter a valid email address.';
        waitlistEmail.focus();
        return;
      }
      waitlistStatus.textContent = 'Confirmed: "' + val + '" is queued for SUKOVA S1 January launch early access.';
      waitlistEmail.value = '';
    });
  }
})();
