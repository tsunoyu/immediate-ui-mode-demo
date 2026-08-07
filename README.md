# Immediate UI Mode Showcase & Use-Case Suite

[![Live Demo on GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://tsunoyu.github.io/immediate-ui-mode-demo/)

🌐 **Live Demo**: [https://tsunoyu.github.io/immediate-ui-mode-demo/](https://tsunoyu.github.io/immediate-ui-mode-demo/)

A zero-dependency interactive demonstration suite for **Chrome WebAuthn / FedCM Immediate UI Mode** (`uiMode: 'immediate'`). Designed to increase developer awareness, illustrate best-practice integration patterns from Chrome Identity guidelines, and introduce newly discovered high-converting use cases.

---

## 🚀 How to Run Locally

This standalone project uses Node.js standard built-in modules (`http`, `fs`, `path`, `url`) so **no `npm install` or third-party dependencies** are required!

### 1. Clone & Start the Server

```bash
git clone git@github.com:tsunoyu/immediate-ui-mode-demo.git
cd immediate-ui-mode-demo
./run.sh
```

*(Alternatively, run `node server.js` directly).*

### 2. Open in Your Browser

Open **http://localhost:3000** in Google Chrome (Chrome 149+ stable / GA).

---

## 🔬 Testing with Live WebAuthn API

1. **Testing with Chrome DevTools Virtual Authenticator**:
   - Open Chrome DevTools (`F12`) &rarr; **More Tools** &rarr; **WebAuthn**.
   - Check **Enable virtual authenticator environment** and click **New authenticator** (ensure *Supports resident keys* is **YES**).
   - Go to **http://localhost:3000/register.html** and click **Create Passkey**.
   - Jump to any demo page to see Chrome's real native Immediate UI Account Picker in action!

2. **Testing Fail-Fast Fallback**:
   - When no passkeys are saved for `localhost`, `uiMode: "immediate"` fails fast in milliseconds without opening an intrusive QR code dialog.
   - The site seamlessly guides the user to standard Sign-In / Sign-Up or Guest Checkout flows per Chrome Identity best practices.

---

## 📚 Interactive Page Catalog & Test Guide

All 8 demo pages are accessible from the navigation bar:

### Recommended "Do-s" from Chrome Identity Guidelines
1. **🛍️ E-Commerce Checkout & Navbar Sign-in (`/ecommerce.html`)**:
   - Tests sign-in navigation interception and dynamic in-cart checkout with Web Modal fallback for guest purchasing.
2. **❤️ Action Buttons: Like & Bookmark (`/actions.html`)**:
   - In-place authentication for social interactions without navigating away or losing context.
3. **🔑 Sign-in with a Passkey Button (`/passkey-button.html`)**:
   - Dedicated passkey button paired with fallback forms and automatic input focus.
4. **🔒 Step-Up Reauthentication (`/reauth.html`)**:
   - Seamless biometric confirmation before performing sensitive operations (payments, API key reveals).

### New Innovative Use Cases
5. **💬 Inline Community Commenting & Reply (`/community.html`)**:
   - Authenticate readers inline and post comments without losing typed text drafts or scroll positions.
6. **📄 Gated Content & Instant Resource Download (`/gated.html`)**:
   - Returning subscribers unlock whitepapers and research reports in 1 tap without multi-field lead capture forms.
7. **🔄 Quick Multi-Account Switcher (`/switcher.html`)**:
   - Switch workspace profiles dynamically using Immediate UI account lists.
8. **📰 Scroll-Triggered Publisher Paywall (`/publisher.html`)**:
   - Readers scroll into paywalled articles and unlock them in-place with `IntersectionObserver` + 1-Tap passkey, preserving scroll position with zero redirects.
9. **📶 Guaranteed-Account ISP Support & Outage Diagnostics (`/support.html`)**:
   - When home Wi-Fi is down, customers identify in 1 tap to run live optical line diagnostics, check neighborhood node outages, and pre-authenticate chat without searching for account numbers.
10. **🤖 AI Agent Web Delegation & Biometric Gate (`/agent.html`)**:
   - Autonomous travel concierge powered by Chrome Built-in AI (Prompt API / Gemini Nano) and WebMCP tools, gating financial transactions behind a 1-second physical biometric passkey handshake with zero API keys required.

---

## 💻 Developer Code Snippet Reference

Every demo page includes an expandable dark code panel showing:
- The exact `navigator.credentials.get({ uiMode: 'immediate', publicKey: ... })` call.
- Client feature detection using `PublicKeyCredential.getClientCapabilities().then(c => c.immediateGet)`.
- Fail-fast `try...catch (e) { if (e.name === 'NotAllowedError') ... }` error handling for progressive enhancement.

---

## 📄 License
Apache 2.0
