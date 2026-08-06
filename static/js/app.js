/*
 * @license
 * Copyright 2026 Google Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

const NAV_GROUPS = [
  {
    title: 'Home',
    items: [
      { href: 'index.html', label: '🏠 Hub & Overview' },
      { href: 'register.html', label: '🔑 Passkey Manager' },
    ],
  },
  {
    title: 'Recommended Do-s (Chrome Identity)',
    items: [
      { href: 'ecommerce.html', label: '🛍️ E-Commerce' },
      { href: 'actions.html', label: '❤️ Action Buttons' },
      { href: 'passkey-button.html', label: '🔑 Passkey Button' },
      { href: 'reauth.html', label: '🔒 Reauth' },
    ],
  },
  {
    title: 'New Use Cases',
    items: [
      { href: 'community.html', label: '💬 Commenting' },
      { href: 'gated.html', label: '📄 Gated Content' },
      { href: 'switcher.html', label: '🔄 Account Switcher' },
    ],
  },
];

/**
 * Detects the Chrome version from User-Agent string
 */
export function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}

export function toast(message, duration = 3500) {
  let toastEl = document.getElementById('imm-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'imm-toast';
    toastEl.className = 'imm-toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

function generateClientChallenge() {
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  return buffer;
}

export async function initImmediateShowcase(currentPath) {
  // Normalize currentPath to filename
  const cleanPath = currentPath.split('/').pop() || 'index.html';
  renderShowcaseHeader(cleanPath);
  renderDemoPagination(cleanPath);

  let isSupported = false;
  try {
    if (
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential.getClientCapabilities === 'function'
    ) {
      const caps = await window.PublicKeyCredential.getClientCapabilities();
      isSupported = !!caps.immediateGet;
    }
  } catch (e) {
    console.warn('Feature detection error:', e);
  }

  updateHeaderUI(isSupported);
}

function updateHeaderUI(isSupported) {
  const badgeEl = document.getElementById('imm-status-badge');
  const chromeVer = getChromeVersion();

  if (badgeEl) {
    if (isSupported) {
      badgeEl.className = 'imm-badge supported';
      badgeEl.innerHTML = `✅ <strong>Live WebAuthn Supported</strong> (${chromeVer ? 'Chrome ' + chromeVer : 'immediateGet: true'})`;
    } else {
      badgeEl.className = 'imm-badge supported';
      badgeEl.innerHTML = `🌐 <strong>Live WebAuthn API Mode</strong> (${chromeVer ? 'Chrome ' + chromeVer : 'Ready'})`;
    }
  }
}

function renderShowcaseHeader(cleanPath) {
  const navContainer = document.getElementById('imm-showcase-navbar');
  if (!navContainer) return;

  let html = `
    <div class="imm-showcase-header" style="position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.06); background: #ffffff;">
      <div class="imm-header-top">
        <div class="imm-title-group">
          <a href="index.html" style="text-decoration:none;"><h1 style="color:var(--primary); font-size:1.45rem; margin:0;">⚡ Immediate UI Mode Showcase</h1></a>
          <span id="imm-status-badge" class="imm-badge supported">Live WebAuthn Mode</span>
        </div>
        <div class="imm-controls">
          <a href="register.html" class="btn btn-primary" style="padding:7px 18px; font-size:0.85rem;">
            🔑 Passkey Manager
          </a>
        </div>
      </div>
      <div class="imm-nav-groups" style="display:flex; flex-direction:column; gap:10px; margin-top:14px; border-top:1px solid #f1f3f4; padding-top:12px;">
  `;

  for (const group of NAV_GROUPS) {
    html += `
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; min-width:170px;">${group.title}:</span>
        <nav class="imm-nav-pills" style="display:flex; flex-wrap:wrap; gap:8px;">
    `;
    for (const item of group.items) {
      const isActive = cleanPath === item.href || (cleanPath === '' && item.href === 'index.html');
      html += `<a href="${item.href}" class="imm-nav-pill ${isActive ? 'active' : ''}">${item.label}</a>`;
    }
    html += `
        </nav>
      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  navContainer.innerHTML = html;
}

function renderDemoPagination(cleanPath) {
  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const idx = allItems.findIndex(i =>
    cleanPath === i.href || (cleanPath === '' && i.href === 'index.html')
  );
  if (idx === -1) return;

  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;

  const footerEl = document.createElement('div');
  footerEl.className = 'imm-demo-pagination';
  footerEl.style.cssText = 'display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-top:48px; padding-top:24px; border-top:1px solid var(--border-color);';

  footerEl.innerHTML = `
    <div>
      ${prev ? `<a href="${prev.href}" class="btn btn-outline" style="font-size:0.9rem;">&larr; Prev: ${prev.label}</a>` : ''}
    </div>
    <div>
      ${next ? `<a href="${next.href}" class="btn btn-primary" style="font-size:0.9rem;">Next: ${next.label} &rarr;</a>` : ''}
    </div>
  `;

  const container = document.querySelector('.container');
  if (container) {
    container.appendChild(footerEl);
  }
}

/**
 * Creates a real discoverable resident passkey using navigator.credentials.create
 * Supports static GitHub Pages & dynamic backends
 */
export async function createTestPasskey({ username = 'Elisa Beckett', email = 'elisa.beckett@gmail.com' } = {}) {
  try {
    if (!window.PublicKeyCredential || !navigator.credentials?.create) {
      throw new Error('WebAuthn API is not supported in this browser.');
    }

    let challengeBytes = null;
    try {
      const res = await fetch('api/webauthn/register-challenge');
      if (res.ok) {
        const data = await res.json();
        challengeBytes = Uint8Array.from(atob(data.challenge), c => c.charCodeAt(0));
      }
    } catch (e) {}

    if (!challengeBytes) {
      challengeBytes = generateClientChallenge();
    }

    const userIdBuffer = new TextEncoder().encode(email);

    const createOptions = {
      publicKey: {
        challenge: challengeBytes,
        rp: {
          name: 'Immediate UI Mode Demo',
          id: window.location.hostname || 'localhost',
        },
        user: {
          id: userIdBuffer,
          name: email,
          displayName: username,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          residentKey: 'required', // Required for Immediate UI mode discoverable passkeys
          userVerification: 'required',
        },
        timeout: 60000,
      },
    };

    const cred = await navigator.credentials.create(createOptions);
    if (!cred) {
      throw new Error('No credential was returned from authenticator.');
    }

    try {
      await fetch('api/webauthn/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cred.id }),
      });
    } catch (e) {}

    toast(`🎉 Passkey registered successfully for ${email}!`);
    return { success: true, email, username, id: cred.id };
  } catch (error) {
    console.warn('Real WebAuthn passkey creation error:', error);
    toast(`Passkey registration: ${error.message || error.name}`);
    return { success: false, error };
  }
}

/**
 * Generates an Actionable Fallback UI banner when NotAllowedError happens in Live WebAuthn Mode
 */
export function renderNotAllowedFallback({ containerId, scenarioName, error, onRetry }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.style.display = 'block';
  container.style.background = '#f5f5f7';
  container.style.border = '1px solid #111111';
  container.style.color = '#111111';

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px;">
      <div style="max-width:640px;">
        <h4 style="margin:0 0 6px 0; color:#111111; font-size:1.05rem; font-weight:800;">
          💡 Best Practice Fallback: No Passkey Found on this Device
        </h4>
        <p style="margin:0 0 12px 0; font-size:0.92rem; color:#555555; line-height:1.5;">
          <code>uiMode: 'immediate'</code> checked Chrome's native credential store for <code>${window.location.hostname || 'localhost'}</code>. Finding 0 resident keys, it failed fast without opening an intrusive modal. According to Chrome Identity best practices, your app now guides the user to standard Sign-In or Sign-Up:
        </p>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <a href="register.html" class="btn btn-primary" style="font-size:0.85rem; white-space:nowrap; text-align:center;">
          🚀 Go to Sign-In &amp; Sign-Up Page (register.html)
        </a>
        <button id="imm-standard-modal-btn" class="btn btn-outline" style="font-size:0.85rem; white-space:nowrap;">
          🌐 Open Standard Passkey Modal
        </button>
      </div>
    </div>
  `;

  const standardModalBtn = document.getElementById('imm-standard-modal-btn');
  standardModalBtn?.addEventListener('click', async () => {
    standardModalBtn.textContent = '🔄 Opening browser modal...';
    standardModalBtn.disabled = true;
    try {
      let challengeBytes = null;
      try {
        const challengeRes = await fetch('api/webauthn/challenge');
        if (challengeRes.ok) {
          const challengeData = await challengeRes.json();
          challengeBytes = Uint8Array.from(atob(challengeData.challenge), (c) => c.charCodeAt(0));
        }
      } catch (e) {}

      if (!challengeBytes) {
        challengeBytes = generateClientChallenge();
      }

      const cred = await navigator.credentials.get({
        publicKey: {
          challenge: challengeBytes,
          rpId: window.location.hostname || 'localhost',
          userVerification: 'preferred',
          timeout: 60000,
        },
      });
      if (cred) {
        toast('🎉 Standard modal authentication succeeded!');
        if (onRetry) onRetry();
      }
    } catch (err) {
      toast('Modal cancelled or error: ' + err.message);
      standardModalBtn.textContent = '🌐 Open Standard Passkey Modal';
      standardModalBtn.disabled = false;
    }
  });
}

/**
 * Runs Immediate UI Mode authentication in pure Live WebAuthn Mode
 * Supports both GitHub Pages static hosting & dynamic servers
 */
export async function runImmediateAuth(options) {
  try {
    let challengeBytes = null;
    try {
      const challengeRes = await fetch('api/webauthn/challenge');
      if (challengeRes.ok) {
        const challengeData = await challengeRes.json();
        challengeBytes = Uint8Array.from(atob(challengeData.challenge), (c) => c.charCodeAt(0));
      }
    } catch (e) {}

    if (!challengeBytes) {
      challengeBytes = generateClientChallenge();
    }

    const chromeVer = getChromeVersion();
    const publicKeyOptions = {
      challenge: challengeBytes,
      rpId: window.location.hostname || 'localhost',
      userVerification: 'preferred',
      allowCredentials: [],
      timeout: 60000,
    };

    let getOptions = {};

    if (options.reqPasswords === true) {
      getOptions.password = true;
    }
    if (options.reqPasskeys !== false) {
      getOptions.publicKey = publicKeyOptions;
    }

    const shouldTryImmediate = options.useImmediate !== false;
    if (shouldTryImmediate) {
      if (chromeVer !== false && chromeVer <= 144) {
        getOptions.mediation = 'immediate';
        console.log(`[app.js] Chrome ${chromeVer} detected. Using mediation: 'immediate'`);
      } else {
        getOptions.uiMode = 'immediate';
        console.log(`[app.js] ${chromeVer ? 'Chrome ' + chromeVer : 'Non-Chrome'} detected. Using uiMode: 'immediate'`);
      }
    }

    const cred = await navigator.credentials.get(getOptions);

    if (cred) {
      let usernameToStore = 'Elisa Beckett';

      if (cred.response && cred.response.userHandle && typeof TextDecoder !== 'undefined') {
        try {
          const decoded = new TextDecoder().decode(cred.response.userHandle);
          if (decoded) usernameToStore = decoded;
        } catch (e) {
          console.warn('Could not decode userHandle:', e);
        }
      }

      const immUser = {
        username: usernameToStore,
        email: 'elisa.beckett@gmail.com',
        credentialType: cred.type === 'password' ? 'password' : 'passkey',
        provider: cred.type === 'password' ? 'Password Manager' : 'Google Password Manager',
      };
      options.onSignIn(immUser);
      return;
    }
    throw new Error('No credential returned.');
  } catch (error) {
    console.warn('WebAuthn Immediate UI Mode check returned:', error.name, error.message);
    if (error.name === 'NotAllowedError' || error.name === 'AbortError' || error.message?.includes('NotAllowedError')) {
      options.onFallback(error);
    } else {
      toast(error.message || 'WebAuthn request failed.');
      options.onFallback(error);
    }
  }
}
