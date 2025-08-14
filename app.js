// ---- 12-week plan definition ----
const plan = [
  { week: 1, title: "GPU Acceleration for CFD",
    goal: "Run GPU code, profile performance, and compare memory strategies.",
    tags: ["GPU","CUDA","PyTorch"],
    tasks: [
      "Install CUDA 12.x and verify nvcc.",
      "Install PyTorch (GPU) and CuPy; run quick GPU test.",
      "Port 2D Poisson solver: NumPy → Numba/CUDA → CuPy.",
      "Benchmark CPU vs. GPU; compare unified vs. explicit memory.",
      "Write a short performance report."
    ]
  },
  { week: 2, title: "Hybrid RANS–LES / WMLES",
    goal: "Compare RANS vs. DES/WLES for cylinder (Re≈3,900).",
    tags: ["Turbulence","LES","WMLES"],
    tasks: [
      "Review hybrid RANS–LES/WMLES concepts.",
      "Set up cylinder case in Fluent: RANS.",
      "Run DES/WLES; record Cd and Strouhal.",
      "Document grid, time-step, memory, and cost.",
      "Plot drag history and spectra; compare."
    ]
  },
  { week: 3, title: "ML Surrogates + UQ",
    goal: "Build NACA0012 surrogate with uncertainty estimates.",
    tags: ["Surrogates","GP","UQ"],
    tasks: [
      "Generate AoA/Re dataset via XFOIL/Fluent.",
      "Fit polynomial and GP models (with UQ).",
      "Evaluate RMSE and calibration curves.",
      "Optional: Multi-fidelity (XFOIL + Fluent).",
      "Save model and plots."
    ]
  },
  { week: 4, title: "Integrated Case Study",
    goal: "Rapid airfoil exploration with GPU + surrogate.",
    tags: ["Optimization","GPU","BayesOpt"],
    tasks: [
      "Wire surrogate into Bayesian optimization.",
      "Generate 2D L/D map with <5 min runtime.",
      "Spot-check with few high-fidelity runs.",
      "Document results and decisions."
    ]
  },
  { week: 5, title: "Differentiable Programming (JAX)",
    goal: "Compute gradients through a PDE solver.",
    tags: ["JAX","AD","Sensitivities"],
    tasks: [
      "Read JAX quickstart and jax.numpy basics.",
      "Implement 1D heat equation in JAX.",
      "Use jax.grad to get d(max T)/d(boundary).",
      "Validate gradients vs. finite differences."
    ]
  },
  { week: 6, title: "Physics-Informed Neural Networks",
    goal: "Solve Burgers’ with a PINN; compare to numerical.",
    tags: ["PINN","PyTorch/JAX"],
    tasks: [
      "Implement PINN residual/data loss.",
      "Train on Burgers’ equation.",
      "Compare error and walltime to numerical solution.",
      "Save loss curves and fields."
    ]
  },
  { week: 7, title: "Differentiable CFD Mini-Project",
    goal: "Optimize boundary inputs to hit a target flow.",
    tags: ["Optimization","JAX","CFD"],
    tasks: [
      "Choose lid-driven cavity or potential flow.",
      "Define objective (target field match).",
      "Use gradient descent/Adam to optimize inputs.",
      "Visualize convergence."
    ]
  },
  { week: 8, title: "PINN + CFD Data Fusion",
    goal: "Reconstruct high-res flow from low-res data.",
    tags: ["Multi-fidelity","PINN"],
    tasks: [
      "Prepare paired low/high-res datasets.",
      "Train hybrid PINN with multi-term loss.",
      "Quantify improvements (L2/PSNR/SSIM).",
      "Document architecture and results."
    ]
  },
  { week: 9, title: "POD/DMD Basics",
    goal: "Extract modes and reconstruct transient wakes.",
    tags: ["ROM","POD","DMD"],
    tasks: [
      "Assemble snapshot matrix and mean subtraction.",
      "Compute SVD/POD modes and energies.",
      "Reconstruct with k modes; plot errors.",
      "Optional: DMD for temporal dynamics."
    ]
  },
  { week:10, title: "Uncertainty Quantification",
    goal: "Quantify surrogate uncertainty with PCE and MC.",
    tags: ["UQ","PCE","MC"],
    tasks: [
      "Review PCE and Monte Carlo basics.",
      "Fit PCE on surrogate under AoA variability.",
      "Estimate mean/variance and CIs.",
      "Compare PCE vs. MC efficiency."
    ]
  },
  { week:11, title: "Digital Twin Concept",
    goal: "Real-time model update from synthetic sensors.",
    tags: ["Kalman","Bayesian","DT"],
    tasks: [
      "Simulate streaming sensor signals.",
      "Implement Kalman filter or Bayesian update.",
      "Track error and uncertainty reduction.",
      "Record lessons for deployment."
    ]
  },
  { week:12, title: "Capstone Mini-Project",
    goal: "Integrate a full pipeline (choose one).",
    tags: ["Capstone","Integration"],
    tasks: [
      "Select: GPU+ROM+UQ or PINN+Digital Twin.",
      "Assemble reproducible pipeline and data.",
      "Create report and short demo.",
      "Publish code and results."
    ]
  }
];

// ---- Persistence helpers ----
const STORAGE_KEY = "cfd_ml_plan_progress_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---- UI rendering ----
const weeksContainer = document.getElementById("weeksContainer");
const overallBar = document.getElementById("overallBar");
const overallPct = document.getElementById("overallPct");

let state = loadState();
// state structure: { [weekNumber]: { checks: [bool...], note: string } }

function render() {
  weeksContainer.innerHTML = "";
  let total = 0, done = 0;

  plan.forEach((w, idx) => {
    const st = state[w.week] || { checks: w.tasks.map(()=>false), note: "" };
    // Ensure length matches
    if (!st.checks || st.checks.length !== w.tasks.length) {
      st.checks = w.tasks.map(()=>false);
    }
    state[w.week] = st;

    // Count
    total += w.tasks.length;
    done += st.checks.filter(Boolean).length;

    const card = document.createElement("div");
    card.className = "card";

    const tags = w.tags.map(t => `<span class="tag">${t}</span>`).join("");

    const doneText = st.checks.every(Boolean) ? `<span class="done">✓ Completed</span>` : "";
    card.innerHTML = `
      <h3>Week ${w.week}: ${w.title} ${doneText}</h3>
      <div class="meta">${w.goal}</div>
      <div class="tags">${tags}</div>
      <ul class="checklist">
        ${w.tasks.map((t,i)=>`
          <li>
            <input type="checkbox" data-week="${w.week}" data-idx="${i}" ${st.checks[i]?"checked":""}/>
            <label>${t}</label>
          </li>`).join("")}
      </ul>
      <div>
        <label for="note-${w.week}">Notes</label>
        <textarea id="note-${w.week}" class="note" placeholder="Observations, links, results...">${st.note||""}</textarea>
      </div>
    `;

    // Wire events
    card.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener("change", (e)=>{
        const week = Number(e.target.getAttribute("data-week"));
        const i = Number(e.target.getAttribute("data-idx"));
        state[week].checks[i] = e.target.checked;
        saveState(state);
        updateOverall();
        render(); // re-render to update Completed badge
      });
    });
    const note = card.querySelector(`#note-${w.week}`);
    note.addEventListener("input", (e)=>{
      state[w.week].note = e.target.value;
      saveState(state);
    });

    weeksContainer.appendChild(card);
  });

  const pct = total ? Math.round((done/total)*100) : 0;
  overallBar.style.width = pct + "%";
  overallPct.textContent = pct + "%";
}

function updateOverall(){
  let total = 0, done = 0;
  plan.forEach(w=>{
    const st = state[w.week] || {};
    const checks = st.checks || [];
    total += w.tasks.length;
    done += checks.filter(Boolean).length;
  });
  const pct = total ? Math.round((done/total)*100) : 0;
  overallBar.style.width = pct + "%";
  overallPct.textContent = pct + "%";
}

document.getElementById("resetBtn").addEventListener("click", ()=>{
  if (confirm("Reset all progress and notes?")) {
    state = {};
    saveState(state);
    render();
  }
});
document.getElementById("exportBtn").addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "cfd_ml_progress.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});
document.getElementById("importBtn").addEventListener("click", ()=>{
  document.getElementById("importFile").click();
});
document.getElementById("importFile").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      state = imported;
      saveState(state);
      render();
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});

render();
