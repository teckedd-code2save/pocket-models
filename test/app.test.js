import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

// vitest runs from the project root; resolve the page files relative to cwd
// (import.meta.url is virtualized by vitest and is not a file: URL).
const root = process.cwd();
const html = readFileSync(join(root, "index.html"), "utf8");
const appJs = readFileSync(join(root, "app.js"), "utf8");

// jsdom does not implement the <dialog> open/close API; provide minimal
// stubs so the model-detail dialog is driveable in tests.
if (typeof HTMLDialogElement.prototype.showModal !== "function") {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
}
if (typeof HTMLDialogElement.prototype.close !== "function") {
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
}

function loadPage() {
  document.documentElement.innerHTML = html;
  // app.js is a classic script (runs immediately, no module exports);
  // indirect eval executes it in global scope, exactly like a <script> tag.
  (0, eval)(appJs);
}

beforeEach(() => {
  loadPage();
});

const modelRows = () => document.querySelectorAll("#model-list .model-row");
const modelNames = () =>
  [...modelRows()].map((row) => row.querySelector(".model-name strong").textContent);
const form = () => document.querySelector("#stack-form");

function choose(name, value) {
  document.querySelectorAll(`#stack-form [name="${name}"]`).forEach((input) => {
    input.checked = input.value === value;
  });
  form().dispatchEvent(new Event("input", { bubbles: true }));
}

function setSelect(name, value) {
  document.querySelector(`#stack-form [name="${name}"]`).value = value;
  form().dispatchEvent(new Event("input", { bubbles: true }));
}

function setMemory(index) {
  const slider = document.querySelector("#memory");
  slider.value = String(index);
  form().dispatchEvent(new Event("input", { bubbles: true }));
}

const recTitle = () => document.querySelector("#rec-title").textContent;

describe("page shell", () => {
  it("renders the title and hero", () => {
    expect(document.title).toBe("Pocket Models — Android AI stack explorer");
    expect(document.querySelector(".hero h1").textContent).toContain("right model");
  });
});

describe("stack builder", () => {
  it("shows the default recommendation on load", () => {
    expect(recTitle()).toBe("Private multimodal assistant");
    expect(document.querySelector("#memory-output").textContent).toBe("8 GB");
    expect(document.querySelector("#fit-badge").textContent).toContain("Strong fit");
    const nodes = [...document.querySelectorAll("#stack-flow strong")].map((el) => el.textContent);
    expect(nodes).toEqual(["Kotlin + Compose", "LiteRT-LM", "Gemma 4 E2B"]);
  });

  it("recommends the hybrid stack for hybrid text deployment", () => {
    choose("deployment", "hybrid");
    expect(recTitle()).toBe("Local-first .NET hybrid");
  });

  it("recommends a hybrid media pipeline for hybrid audio deployment", () => {
    choose("deployment", "hybrid");
    choose("capability", "audio");
    expect(recTitle()).toBe("Hybrid multimodal pipeline");
  });

  it("recommends the multimodal stack for vision on 8 GB+ phones", () => {
    choose("capability", "vision");
    expect(recTitle()).toBe("Private multimodal assistant");
  });

  it("recommends a hybrid media pipeline for vision on 6 GB phones", () => {
    choose("capability", "vision");
    setMemory(1); // 6 GB
    expect(recTitle()).toBe("Hybrid multimodal pipeline");
  });

  it("picks the specialist model for a tight 4 GB text-only build", () => {
    setMemory(0); // 4 GB
    expect(recTitle()).toBe("Tiny specialist feature");
  });

  it("picks the permissive model when licensing matters most", () => {
    setMemory(0); // 4 GB
    setSelect("priority", "license");
    expect(recTitle()).toBe("Permissive pocket copilot");
  });

  it("picks the fast tool runner for tool calling on 4 GB", () => {
    setMemory(0); // 4 GB
    setSelect("priority", "tools");
    expect(recTitle()).toBe("Fast local tool runner");
  });

  it("picks the multimodal stack for 12 GB text builds", () => {
    setMemory(3); // 12+ GB
    expect(recTitle()).toBe("Private multimodal assistant");
  });

  it("updates the memory readout as the slider moves", () => {
    setMemory(0);
    expect(document.querySelector("#memory-output").textContent).toBe("4 GB");
    expect(document.querySelector("#memory").getAttribute("aria-valuetext")).toBe("4 gigabytes");
    setMemory(3);
    expect(document.querySelector("#memory-output").textContent).toBe("12+ GB");
    expect(document.querySelector("#memory").getAttribute("aria-valuetext")).toBe("12 or more gigabytes");
  });
});

describe("model shortlist", () => {
  it("renders all six models in order", () => {
    expect(modelRows()).toHaveLength(6);
    expect(modelNames()).toEqual([
      "Gemma 4 E2B",
      "LFM2.5 1.2B",
      "Qwen3.5 0.8B",
      "SmolLM3 3B",
      "Phi-4 Mini",
      "Gemma 3 270M",
    ]);
  });

  it("filters by footprint, modality, and license tags", () => {
    document.querySelector('.filter[data-filter="tiny"]').click();
    expect(modelNames()).toEqual(["LFM2.5 1.2B", "Qwen3.5 0.8B", "Gemma 3 270M"]);
    expect(document.querySelector(".filter.active").dataset.filter).toBe("tiny");

    document.querySelector('.filter[data-filter="multimodal"]').click();
    expect(modelNames()).toEqual(["Gemma 4 E2B"]);

    document.querySelector('.filter[data-filter="permissive"]').click();
    expect(modelNames()).toEqual(["Qwen3.5 0.8B", "SmolLM3 3B", "Phi-4 Mini"]);

    document.querySelector('.filter[data-filter="all"]').click();
    expect(modelRows()).toHaveLength(6);
  });

  it("opens a model detail dialog with a source link", () => {
    document.querySelector('.model-open[data-model="gemma4"]').click();
    const dialog = document.querySelector("#model-dialog");
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.querySelector("#dialog-content").textContent).toContain("MODEL 01");
    expect(document.querySelector("#dialog-content").textContent).toContain("Gemma 4 E2B");
    expect(document.querySelector("#dialog-content a.dialog-source").getAttribute("href")).toBe(
      "https://huggingface.co/google/gemma-4-E2B",
    );

    document.querySelector(".dialog-close").click();
    expect(dialog.hasAttribute("open")).toBe(false);
  });
});

describe("architecture patterns", () => {
  it("switches between on-device and hybrid diagrams", () => {
    document.querySelector('.mode-switch button[data-mode="hybrid"]').click();
    expect(document.querySelector("#arch-number").textContent).toBe("02 / ESCALATION PATH");
    expect(document.querySelector("#arch-title").textContent).toBe(
      "A small model routes. A larger model resolves.",
    );
    expect(document.querySelectorAll("#arch-list li")).toHaveLength(3);
    expect(document.querySelector("#arch-diagram").getAttribute("aria-label")).toBe(
      "Hybrid Android and cloud architecture diagram",
    );
  });
});

describe("copy stack", () => {
  it("copies the current stack to the clipboard", async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    const writeText = navigator.clipboard.writeText;

    document.querySelector("#copy-stack").click();
    await vi.advanceTimersByTimeAsync(0);

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain("Kotlin + Compose → LiteRT-LM → Gemma 4 E2B");
    expect(document.querySelector("#copy-status").textContent).toBe("Copied to clipboard.");

    vi.advanceTimersByTime(2500);
    expect(document.querySelector("#copy-status").textContent).toBe("");
    vi.useRealTimers();
  });
});
