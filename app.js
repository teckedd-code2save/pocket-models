const models = [
  {
    id: "gemma4",
    name: "Gemma 4 E2B",
    maker: "Google · 2026",
    size: "E2B / 5.1B stored",
    memory: "8 GB+ target",
    license: "Gemma terms",
    tags: ["multimodal", "mobile-first"],
    filters: ["multimodal"],
    best: "The strongest native Android candidate when image, audio, reasoning, and tool use need to share one runtime.",
    caution: "E2B describes effective compute. Stored parameters and peak runtime memory are larger, so profile downloads, thermals, and KV cache carefully.",
    source: "https://huggingface.co/google/gemma-4-E2B",
    sourceLabel: "Google model card"
  },
  {
    id: "lfm",
    name: "LFM2.5 1.2B",
    maker: "Liquid AI · 2026",
    size: "1.2B",
    memory: "Under 1 GB model runtime*",
    license: "LFM Open License",
    tags: ["fast", "tool use"],
    filters: ["tiny"],
    best: "Fast local assistants and small tool-using agents. Official GGUF support makes llama.cpp a pragmatic Android route.",
    caution: "It is text-first and the license is not Apache/MIT. Validate its tool-call format and your commercial use case.",
    source: "https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct",
    sourceLabel: "Liquid AI model card"
  },
  {
    id: "qwen",
    name: "Qwen3.5 0.8B",
    maker: "Qwen · 2026",
    size: "0.8B",
    memory: "4–6 GB target",
    license: "Apache 2.0",
    tags: ["multilingual", "fine-tune"],
    filters: ["tiny", "permissive"],
    best: "A permissive, compact base for multilingual prototypes and task-specific fine-tuning on constrained phones.",
    caution: "The publisher positions this size for prototyping and task-specific work. Do not expect frontier general reasoning from 0.8B.",
    source: "https://huggingface.co/Qwen/Qwen3.5-0.8B",
    sourceLabel: "Qwen model card"
  },
  {
    id: "smol",
    name: "SmolLM3 3B",
    maker: "Hugging Face · 2025",
    size: "3B",
    memory: "6–8 GB target",
    license: "Apache 2.0",
    tags: ["reasoning", "fully open"],
    filters: ["permissive"],
    best: "A transparent research and product baseline with open training recipes, long context, and dual reasoning modes.",
    caution: "It is larger and less Android-opinionated than LFM or Gemma. Conversion and hardware acceleration need more engineering.",
    source: "https://huggingface.co/HuggingFaceTB/SmolLM3-3B",
    sourceLabel: "Hugging Face model card"
  },
  {
    id: "phi",
    name: "Phi-4 Mini",
    maker: "Microsoft · 2025",
    size: "3.8B",
    memory: "8 GB+ target",
    license: "MIT",
    tags: ["reasoning", "128K context"],
    filters: ["permissive"],
    best: "Useful when reasoning quality and a permissive license matter more than the smallest APK or simplest native integration.",
    caution: "Long advertised context is not a practical mobile default; KV-cache memory and latency rise quickly. Often better as a hybrid/server tier.",
    source: "https://huggingface.co/microsoft/Phi-4-mini-instruct",
    sourceLabel: "Microsoft model card"
  },
  {
    id: "gemma270",
    name: "Gemma 3 270M",
    maker: "Google · 2025",
    size: "270M",
    memory: "Under 300 MB tuned*",
    license: "Gemma terms",
    tags: ["tiny", "specialist"],
    filters: ["tiny"],
    best: "Excellent for a narrow, fine-tuned feature—classification, rewriting, routing, or structured extraction—where tiny wins.",
    caution: "Treat it as a specialist, not a general chat model. Quality depends heavily on a narrow task and good fine-tuning data.",
    source: "https://developers.googleblog.com/en/own-your-ai-fine-tune-gemma-3-270m-for-on-device/",
    sourceLabel: "Google AI Edge guide"
  }
];

const recommendations = {
  gemma: {
    title: "Private multimodal assistant",
    summary: "Keep prompts and media on the phone, with enough headroom for a mobile-first multimodal model.",
    nodes: ["Kotlin + Compose", "LiteRT-LM", "Gemma 4 E2B"],
    why: "Native Android path, multimodal inputs, and strong quality for a phone-class model.",
    caution: "“E2B” is effective compute—not download size. Test thermal behavior and peak memory on real target devices.",
    fit: "Strong fit"
  },
  lfm: {
    title: "Fast local tool runner",
    summary: "Use a compact text model for intent, tool selection, and structured responses without a network round trip.",
    nodes: ["Kotlin + Compose", "llama.cpp JNI", "LFM2.5 1.2B"],
    why: "Designed for edge inference, official GGUF availability, and a useful quality-to-memory ratio for tool-driven flows.",
    caution: "Lock the tool schema and test malformed arguments. The LFM license is open, but not Apache or MIT.",
    fit: "Strong fit"
  },
  qwen: {
    title: "Permissive pocket copilot",
    summary: "Start small, multilingual, and commercially straightforward—then fine-tune for the narrow workflow that matters.",
    nodes: ["Kotlin + Compose", "llama.cpp JNI", "Qwen3.5 0.8B"],
    why: "Apache 2.0, a compact footprint, and a strong basis for task-specific multilingual features.",
    caution: "The 0.8B release is positioned for prototyping and fine-tuning. Keep the task narrow and evaluate your target languages.",
    fit: "Good fit"
  },
  specialist: {
    title: "Tiny specialist feature",
    summary: "On a 4 GB phone, a narrow local model is safer than promising a general assistant that thrashes memory.",
    nodes: ["Kotlin + Compose", "LiteRT-LM", "Gemma 3 270M"],
    why: "A tuned model can stay small, fast, offline, and focused on one product behavior.",
    caution: "Requires task-specific examples and fine-tuning. Add a graceful fallback for requests outside the trained scope.",
    fit: "Practical fit"
  },
  hybrid: {
    title: "Local-first .NET hybrid",
    summary: "Answer simple or sensitive requests locally, then escalate complex work through a backend you can observe and update.",
    nodes: ["Android + local router", "ASP.NET Core API", "Larger remote model"],
    why: "A small local model protects latency and privacy while your .NET gateway handles RAG, policy, caching, and model changes.",
    caution: "Make escalation visible to users. Redact sensitive fields before sending and design for offline degradation.",
    fit: "Best balance"
  },
  hybridMedia: {
    title: "Hybrid multimodal pipeline",
    summary: "Do capture and lightweight preprocessing locally; send only the minimum required media when a stronger model is needed.",
    nodes: ["CameraX / Audio", "ASP.NET Core API", "Remote multimodal model"],
    why: "Works across more mid-range phones and avoids forcing a large multimodal download on every user.",
    caution: "Media is sensitive and expensive. Ask consent, resize or segment locally, encrypt transit, and set retention explicitly.",
    fit: "Safer fit"
  }
};

const memoryValues = [4, 6, 8, 12];
const form = document.querySelector("#stack-form");
const memoryInput = document.querySelector("#memory");
const memoryOutput = document.querySelector("#memory-output");
const rangeStops = [0, 33, 66, 100];

function chooseRecommendation() {
  const data = new FormData(form);
  const deployment = data.get("deployment");
  const capability = data.get("capability");
  const priority = data.get("priority");
  const memory = memoryValues[Number(data.get("memory"))];

  if (deployment === "hybrid") return capability === "text" ? recommendations.hybrid : recommendations.hybridMedia;
  if (capability !== "text") return memory >= 8 ? recommendations.gemma : recommendations.hybridMedia;
  if (memory === 4 && priority !== "tools") return priority === "license" ? recommendations.qwen : recommendations.specialist;
  if (priority === "license") return recommendations.qwen;
  if (priority === "speed" || priority === "tools" || memory <= 6) return recommendations.lfm;
  return recommendations.gemma;
}

function renderRecommendation() {
  const selected = chooseRecommendation();
  document.querySelector("#rec-title").textContent = selected.title;
  document.querySelector("#rec-summary").textContent = selected.summary;
  document.querySelector("#rec-why").textContent = selected.why;
  document.querySelector("#rec-caution").textContent = selected.caution;
  document.querySelector("#fit-badge").lastChild.textContent = ` ${selected.fit}`;
  document.querySelector("#stack-flow").innerHTML = selected.nodes.map((node, index) => {
    const labels = ["APP", "RUNTIME / API", "MODEL"];
    return `${index ? '<span aria-hidden="true">→</span>' : ''}<div class="${index === 2 ? "accent-node" : ""}"><small>${labels[index]}</small><strong>${node}</strong></div>`;
  }).join("");
}

function updateMemory() {
  const index = Number(memoryInput.value);
  const value = memoryValues[index];
  memoryOutput.textContent = `${value}${value === 12 ? "+" : ""} GB`;
  memoryInput.setAttribute("aria-valuetext", `${value}${value === 12 ? " or more" : ""} gigabytes`);
  memoryInput.style.background = `linear-gradient(to right, var(--acid) ${rangeStops[index]}%, #4e4f48 ${rangeStops[index]}%)`;
}

form.addEventListener("input", () => { updateMemory(); renderRecommendation(); });

document.querySelector("#copy-stack").addEventListener("click", async () => {
  const selected = chooseRecommendation();
  const text = `${selected.title}\n${selected.nodes.join(" → ")}\nWhy: ${selected.why}\nWatch for: ${selected.caution}`;
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector("#copy-status").textContent = "Copied to clipboard.";
  } catch {
    document.querySelector("#copy-status").textContent = "Copy unavailable—select the stack above.";
  }
  setTimeout(() => { document.querySelector("#copy-status").textContent = ""; }, 2500);
});

let activeFilter = "all";
const modelList = document.querySelector("#model-list");
function renderModels() {
  const visible = models.filter(model => activeFilter === "all" || model.filters.includes(activeFilter));
  modelList.innerHTML = visible.length ? visible.map((model) => {
    const rank = String(models.indexOf(model) + 1).padStart(2, "0");
    return `<article class="model-row">
      <span class="model-rank">${rank}</span>
      <div class="model-name"><strong>${model.name}</strong><small>${model.maker}</small></div>
      <div class="metric"><span>Scale</span><strong>${model.size}</strong></div>
      <div class="metric"><span>Practical RAM</span><strong>${model.memory}</strong></div>
      <div class="model-tags">${model.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
      <button class="model-open" type="button" data-model="${model.id}" aria-label="Inspect ${model.name}">↗</button>
    </article>`;
  }).join("") : '<p class="empty-state">No models match this view.</p>';
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    renderModels();
  });
});

const dialog = document.querySelector("#model-dialog");
modelList.addEventListener("click", event => {
  const button = event.target.closest("[data-model]");
  if (!button) return;
  const model = models.find(item => item.id === button.dataset.model);
  document.querySelector("#dialog-content").innerHTML = `
    <span class="dialog-index">MODEL ${String(models.indexOf(model) + 1).padStart(2, "0")}</span>
    <h2 id="dialog-title">${model.name}</h2>
    <p class="dialog-subtitle">${model.maker} · ${model.size} · ${model.license}</p>
    <div class="dialog-grid">
      <div><span>Choose it for</span><p>${model.best}</p></div>
      <div><span>The tradeoff</span><p>${model.caution}</p></div>
    </div>
    <a class="dialog-source" href="${model.source}" target="_blank" rel="noreferrer">Open ${model.sourceLabel} ↗</a>`;
  dialog.showModal();
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

const architecture = {
  device: {
    number: "01 / PRIVATE PATH",
    title: "Everything sensitive stays in the APK boundary.",
    description: "Best for personal notes, lightweight copilots, offline search, and features that must work on unreliable networks.",
    points: ["No per-token API bill", "Predictable offline behavior", "Device fragmentation becomes your problem"],
    diagram: '<div class="arch-node phone-node"><span>Android app</span><small>Compose · Room</small></div><span class="arch-arrow">→</span><div class="arch-node model-node"><span>Local model</span><small>LiteRT-LM / JNI</small></div><div class="privacy-loop">private loop</div>',
    label: "On-device architecture diagram"
  },
  hybrid: {
    number: "02 / ESCALATION PATH",
    title: "A small model routes. A larger model resolves.",
    description: "Best for complex copilots, fresh knowledge, RAG, and phones where a large local download would exclude too many users.",
    points: ["Fast local intent and redaction", "Remote tier can improve without app updates", "Network, cost, consent, and failure modes return"],
    diagram: '<div class="arch-node phone-node"><span>Local router</span><small>Qwen / LFM</small></div><span class="arch-arrow">→</span><div class="arch-node cloud-node"><span>.NET gateway</span><small>Policy · RAG · cache</small></div><span class="arch-arrow">→</span><div class="arch-node model-node"><span>Cloud model</span><small>complex work</small></div>',
    label: "Hybrid Android and cloud architecture diagram"
  }
};

document.querySelectorAll(".mode-switch button").forEach(button => {
  button.addEventListener("click", () => {
    const selected = architecture[button.dataset.mode];
    document.querySelectorAll(".mode-switch button").forEach(item => item.classList.toggle("active", item === button));
    document.querySelector("#arch-number").textContent = selected.number;
    document.querySelector("#arch-title").textContent = selected.title;
    document.querySelector("#arch-description").textContent = selected.description;
    document.querySelector("#arch-list").innerHTML = selected.points.map(point => `<li>${point}</li>`).join("");
    const diagram = document.querySelector("#arch-diagram");
    diagram.innerHTML = selected.diagram;
    diagram.setAttribute("aria-label", selected.label);
  });
});

updateMemory();
renderRecommendation();
renderModels();
