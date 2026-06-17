// ─── NAV & SCROLL ───────────────────────────────────────────────
function toggleMenu() {
  const nav = document.getElementById("mainNav");
  nav.classList.toggle("active");
}

document.querySelectorAll("#mainNav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("active");
  });
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });
reveals.forEach((el) => observer.observe(el));

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.style.background = "rgba(5,8,22,.97)";
    header.style.boxShadow = "0 14px 45px rgba(0,0,0,.45)";
  } else {
    header.style.background = "rgba(5,8,22,.88)";
    header.style.boxShadow = "none";
  }
});


// ─── LIONEL AI CHATBOT ──────────────────────────────────────────

(function () {

  // ── State ──
  const state = {
    step: 0,
    name: "",
    email: "",
    phone: "",
    business: "",
    industry: "",
    needs: [],
    timeline: "",
    revenue: "",
    open: false,
    typing: false,
  };

  // ── Conversation flow ──
  const flow = [
    {
      id: "intro",
      message: () => "Hey there! 👋 I'm Lionel, the LNL Solutions assistant. I'm here to help figure out exactly what your business needs to grow. Mind if I ask you a few quick questions?",
      type: "choice",
      choices: ["Yes, let's do it!", "What can LNL help with?"],
      next: (val) => val === "What can LNL help with?" ? "what_we_do" : "get_name",
    },
    {
      id: "what_we_do",
      message: () => "We build complete growth systems for service businesses — websites, Google SEO, LinkedIn, AI-powered lead follow-up, CRM, and cold outreach. Everything done for you. Want to find out what your business needs?",
      type: "choice",
      choices: ["Yes, let's find out", "Tell me more"],
      next: () => "get_name",
    },
    {
      id: "get_name",
      message: () => "Perfect! First — what's your name?",
      type: "input",
      inputType: "text",
      placeholder: "Your first name",
      next: (val) => { state.name = val; return "get_business"; },
    },
    {
      id: "get_business",
      message: () => `Nice to meet you, ${state.name}! What's your business called?`,
      type: "input",
      inputType: "text",
      placeholder: "Business name",
      next: (val) => { state.business = val; return "get_industry"; },
    },
    {
      id: "get_industry",
      message: () => `Great. What industry is ${state.business} in?`,
      type: "choice",
      choices: [
        "Fitness & Athletics",
        "Home Services",
        "Beauty & Wellness",
        "Restaurants & Hospitality",
        "Loan Officer / Finance",
        "Real Estate",
        "Professional Services",
        "Startup / Small Business",
        "Other",
      ],
      next: (val) => { state.industry = val; return "get_needs"; },
    },
    {
      id: "get_needs",
      message: () => `Got it. What does ${state.business} need most right now? Pick everything that applies — I'll show options one by one.`,
      type: "multi",
      choices: [
        "A better website",
        "More Google visibility",
        "LinkedIn optimization",
        "More leads",
        "Faster lead follow-up",
        "A CRM system",
        "AI automation",
        "Cold email outreach",
        "A full growth system",
      ],
      next: () => "get_revenue",
    },
    {
      id: "get_revenue",
      message: () => `Helpful! What's your approximate monthly revenue right now?`,
      type: "choice",
      choices: ["Under $10k", "$10k–$25k", "$25k–$50k", "$50k–$100k", "$100k+"],
      next: (val) => { state.revenue = val; return "get_timeline"; },
    },
    {
      id: "get_timeline",
      message: () => "How soon are you looking to get started?",
      type: "choice",
      choices: ["Immediately", "Within 30 days", "Within 90 days", "Just exploring"],
      next: (val) => { state.timeline = val; return "get_email"; },
    },
    {
      id: "get_email",
      message: () => `Perfect. I want to get you a free growth audit based on everything you just told me. What's the best email to send it to?`,
      type: "input",
      inputType: "email",
      placeholder: "your@email.com",
      next: (val) => { state.email = val; return "get_phone"; },
    },
    {
      id: "get_phone",
      message: () => "And your phone number? Our team will reach out to schedule a quick call — no spam.",
      type: "input",
      inputType: "tel",
      placeholder: "Phone number",
      next: (val) => { state.phone = val; return "confirm"; },
    },
    {
      id: "confirm",
      message: () => `You're all set, ${state.name}! 🎉 Here's what I have:\n\n📌 Business: ${state.business}\n🏷️ Industry: ${state.industry}\n💡 Needs: ${state.needs.join(", ")}\n📅 Timeline: ${state.timeline}\n\nOur team will review your info and reach out within one business day to schedule your free growth audit call. Sound good?`,
      type: "choice",
      choices: ["Sounds great!", "I have a question"],
      next: (val) => val === "I have a question" ? "question" : "done",
    },
    {
      id: "question",
      message: () => "Of course! You can email us at ktrev@lnlsolutions.cc or head to our contact page and we'll get back to you right away.",
      type: "choice",
      choices: ["Got it, thanks!", "Book a call now"],
      next: (val) => val === "Book a call now" ? "book" : "done",
    },
    {
      id: "book",
      message: () => "You can book a call directly here — pick a time that works for you.",
      type: "link",
      linkText: "📅 Book a 30-min call →",
      linkUrl: "https://calendar.app.google/S94BZUXKDoNqy6rW6",
      next: () => "done",
    },
    {
      id: "done",
      message: () => `Thanks so much, ${state.name}! Talk soon. 🚀`,
      type: "end",
    },
  ];

  function getStep(id) {
    return flow.find((s) => s.id === id) || flow[0];
  }

  // ── Build UI ──
  const style = document.createElement("style");
  style.textContent = `
    #lionel-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #2563EB, #14B8A6);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 24px rgba(37,99,235,.5);
      transition: transform .2s;
      font-size: 26px;
    }
    #lionel-bubble:hover { transform: scale(1.08); }
    #lionel-badge {
      position: absolute; top: -4px; right: -4px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #EF4444; font-size: 10px; font-weight: 900; color: white;
      display: flex; align-items: center; justify-content: center;
    }
    #lionel-window {
      position: fixed; bottom: 92px; right: 24px; z-index: 9998;
      width: 360px; max-width: calc(100vw - 32px);
      background: #0B1020; border: 1px solid rgba(148,163,184,.18);
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,.7);
      display: none; flex-direction: column;
      font-family: 'Inter', sans-serif;
      animation: lionelPop .25s ease;
    }
    @keyframes lionelPop { from { opacity:0; transform: translateY(16px) scale(.97); } to { opacity:1; transform:none; } }
    #lionel-header {
      padding: 16px 20px; display: flex; align-items: center; gap: 12px;
      background: linear-gradient(135deg, rgba(37,99,235,.25), rgba(20,184,166,.15));
      border-bottom: 1px solid rgba(148,163,184,.12);
    }
    .lionel-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #2563EB, #14B8A6);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .lionel-hinfo { flex: 1; }
    .lionel-hname { font-weight: 800; font-size: 15px; color: #F8FAFC; }
    .lionel-hstatus { font-size: 12px; color: #14B8A6; font-weight: 600; }
    #lionel-close {
      background: none; border: none; color: #64748B; font-size: 20px;
      cursor: pointer; padding: 4px; line-height: 1;
    }
    #lionel-close:hover { color: #F8FAFC; }
    #lionel-msgs {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 14px;
      max-height: 360px; min-height: 200px;
      scrollbar-width: thin; scrollbar-color: rgba(148,163,184,.2) transparent;
    }
    .lion-msg { display: flex; gap: 8px; align-items: flex-end; }
    .lion-msg .ava { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#2563EB,#14B8A6); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
    .lion-bubble {
      max-width: 85%; padding: 11px 14px; border-radius: 16px 16px 16px 4px;
      background: rgba(30,41,59,.9); color: #E2E8F0; font-size: 13.5px; line-height: 1.55;
      white-space: pre-wrap;
    }
    .lion-msg.user { flex-direction: row-reverse; }
    .lion-msg.user .lion-bubble { background: linear-gradient(135deg,#2563EB,#14B8A6); color:white; border-radius: 16px 16px 4px 16px; }
    .lion-typing span { display:inline-block; width:6px; height:6px; border-radius:50%; background:#94A3B8; margin:0 2px; animation: lionDot 1.2s infinite; }
    .lion-typing span:nth-child(2) { animation-delay:.2s; }
    .lion-typing span:nth-child(3) { animation-delay:.4s; }
    @keyframes lionDot { 0%,80%,100%{transform:scale(1);opacity:.5} 40%{transform:scale(1.3);opacity:1} }
    #lionel-choices { padding: 0 16px 16px; display:flex; flex-wrap:wrap; gap:8px; }
    .lion-choice {
      padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(148,163,184,.25);
      background: rgba(15,23,42,.8); color: #CBD5E1; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all .15s;
    }
    .lion-choice:hover { background: rgba(37,99,235,.3); border-color: #60A5FA; color: white; }
    .lion-choice.selected { background: rgba(37,99,235,.4); border-color: #60A5FA; color: white; }
    #lionel-input-row {
      padding: 12px 16px; border-top: 1px solid rgba(148,163,184,.1);
      display: none; gap: 8px; align-items: center;
    }
    #lionel-input-row input {
      flex: 1; padding: 10px 14px; border-radius: 999px;
      border: 1px solid rgba(148,163,184,.2); background: rgba(5,8,22,.8);
      color: #F8FAFC; font-size: 13px; outline: none;
    }
    #lionel-input-row input:focus { border-color: #2563EB; }
    #lionel-send {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: linear-gradient(135deg,#2563EB,#14B8A6); color: white;
      font-size: 16px; cursor: pointer; display:flex; align-items:center; justify-content:center;
    }
    #lionel-multi-done { display:none; padding:0 16px 16px; }
    #lionel-multi-done button {
      width:100%; padding:10px; border-radius:999px; border:none;
      background: linear-gradient(135deg,#2563EB,#14B8A6); color:white;
      font-size:13px; font-weight:800; cursor:pointer;
    }
    #lionel-link-btn { display:none; padding:0 16px 16px; }
    #lionel-link-btn a {
      display:block; text-align:center; padding:11px; border-radius:999px;
      background: linear-gradient(135deg,#2563EB,#14B8A6); color:white;
      font-size:13px; font-weight:800;
    }
  `;
  document.head.appendChild(style);

  const bubble = document.createElement("div");
  bubble.id = "lionel-bubble";
  bubble.innerHTML = `🤖<div id="lionel-badge">1</div>`;
  document.body.appendChild(bubble);

  const win = document.createElement("div");
  win.id = "lionel-window";
  win.innerHTML = `
    <div id="lionel-header">
      <div class="lionel-avatar">🤖</div>
      <div class="lionel-hinfo">
        <div class="lionel-hname">Lionel</div>
        <div class="lionel-hstatus">● Online now</div>
      </div>
      <button id="lionel-close">✕</button>
    </div>
    <div id="lionel-msgs"></div>
    <div id="lionel-choices"></div>
    <div id="lionel-multi-done"><button id="lion-done-btn">Done selecting →</button></div>
    <div id="lionel-input-row">
      <input id="lionel-text" type="text" placeholder="Type your answer..." />
      <button id="lionel-send">↑</button>
    </div>
    <div id="lionel-link-btn"></div>
  `;
  document.body.appendChild(win);

  const msgs = document.getElementById("lionel-msgs");
  const choicesEl = document.getElementById("lionel-choices");
  const inputRow = document.getElementById("lionel-input-row");
  const textInput = document.getElementById("lionel-text");
  const sendBtn = document.getElementById("lionel-send");
  const multiDone = document.getElementById("lionel-multi-done");
  const doneBtnEl = document.getElementById("lion-done-btn");
  const linkBtn = document.getElementById("lionel-link-btn");
  const badge = document.getElementById("lionel-badge");

  let currentStep = null;
  let multiSelected = [];

  // ── Toggle ──
  bubble.addEventListener("click", () => {
    state.open = !state.open;
    win.style.display = state.open ? "flex" : "none";
    badge.style.display = "none";
    if (state.open && msgs.children.length === 0) {
      setTimeout(() => runStep("intro"), 400);
    }
  });
  document.getElementById("lionel-close").addEventListener("click", () => {
    state.open = false;
    win.style.display = "none";
  });

  // ── Add message bubble ──
  function addMsg(text, isUser = false) {
    const row = document.createElement("div");
    row.className = "lion-msg" + (isUser ? " user" : "");
    if (!isUser) {
      row.innerHTML = `<div class="ava">🤖</div><div class="lion-bubble">${text}</div>`;
    } else {
      row.innerHTML = `<div class="lion-bubble">${text}</div>`;
    }
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return row;
  }

  // ── Typing indicator ──
  function showTyping() {
    const row = document.createElement("div");
    row.className = "lion-msg";
    row.id = "lion-typing-row";
    row.innerHTML = `<div class="ava">🤖</div><div class="lion-bubble lion-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById("lion-typing-row");
    if (t) t.remove();
  }

  // ── Submit lead data ──
  function submitLead() {
    const formData = new FormData();
    formData.append("form-name", "lionel-lead");
    formData.append("name", state.name);
    formData.append("email", state.email);
    formData.append("phone", state.phone);
    formData.append("business", state.business);
    formData.append("industry", state.industry);
    formData.append("needs", state.needs.join(", "));
    formData.append("revenue", state.revenue);
    formData.append("timeline", state.timeline);
    formData.append("source", "Lionel Chatbot");

    fetch("/", { method: "POST", body: formData }).catch(() => {});
  }

  // ── Run a step ──
  function runStep(id) {
    currentStep = getStep(id);
    clearUI();

    showTyping();
    const delay = Math.min(1000, 400 + currentStep.message().length * 12);

    setTimeout(() => {
      hideTyping();
      addMsg(currentStep.message());

      if (currentStep.type === "choice") {
        renderChoices(currentStep.choices, false);
      } else if (currentStep.type === "multi") {
        multiSelected = [];
        renderChoices(currentStep.choices, true);
        multiDone.style.display = "block";
      } else if (currentStep.type === "input") {
        inputRow.style.display = "flex";
        textInput.type = currentStep.inputType || "text";
        textInput.placeholder = currentStep.placeholder || "Type here...";
        textInput.value = "";
        setTimeout(() => textInput.focus(), 100);
      } else if (currentStep.type === "link") {
        linkBtn.innerHTML = `<a href="${currentStep.linkUrl}" target="_blank">${currentStep.linkText}</a>`;
        linkBtn.style.display = "block";
        setTimeout(() => {
          const nextId = currentStep.next();
          if (nextId !== "done") runStep(nextId);
        }, 1500);
      } else if (currentStep.type === "end") {
        submitLead();
      }
    }, delay);
  }

  function clearUI() {
    choicesEl.innerHTML = "";
    inputRow.style.display = "none";
    multiDone.style.display = "none";
    linkBtn.style.display = "none";
    linkBtn.innerHTML = "";
  }

  function renderChoices(choices, multi) {
    choicesEl.innerHTML = "";
    choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "lion-choice";
      btn.textContent = c;
      btn.addEventListener("click", () => {
        if (multi) {
          btn.classList.toggle("selected");
          if (btn.classList.contains("selected")) {
            multiSelected.push(c);
          } else {
            multiSelected = multiSelected.filter((x) => x !== c);
          }
        } else {
          addMsg(c, true);
          clearUI();
          const nextId = currentStep.next(c);
          setTimeout(() => runStep(nextId), 400);
        }
      });
      choicesEl.appendChild(btn);
    });
  }

  doneBtnEl.addEventListener("click", () => {
    if (multiSelected.length === 0) return;
    state.needs = [...multiSelected];
    addMsg(multiSelected.join(", "), true);
    clearUI();
    const nextId = currentStep.next();
    setTimeout(() => runStep(nextId), 400);
  });

  function handleTextSubmit() {
    const val = textInput.value.trim();
    if (!val) return;
    addMsg(val, true);
    clearUI();
    const nextId = currentStep.next(val);
    setTimeout(() => runStep(nextId), 400);
  }

  sendBtn.addEventListener("click", handleTextSubmit);
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleTextSubmit();
  });

  // ── Auto-open after 8 seconds ──
  setTimeout(() => {
    if (!state.open) {
      badge.style.display = "flex";
    }
  }, 8000);

  // ── Netlify form detection stub ──
  const hiddenForm = document.createElement("form");
  hiddenForm.setAttribute("name", "lionel-lead");
  hiddenForm.setAttribute("data-netlify", "true");
  hiddenForm.style.display = "none";
  hiddenForm.innerHTML = `
    <input name="name"><input name="email"><input name="phone">
    <input name="business"><input name="industry"><input name="needs">
    <input name="revenue"><input name="timeline"><input name="source">
  `;
  document.body.appendChild(hiddenForm);

})();
