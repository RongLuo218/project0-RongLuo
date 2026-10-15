// Headphone story and inspection interactions

const cardTitle = document.getElementById("card-title");
const cardFact = document.getElementById("card-fact");
const cardSource = document.getElementById("card-source");
const askButton = document.getElementById("ask-button");
const modelOutput = document.getElementById("model-output");
const startStoryButton = document.getElementById("start-story");
const stopStoryButton = document.getElementById("stop-story");
const restartStoryButton = document.getElementById("restart-story");
const stepBackButton = document.getElementById("step-back");
const stageCaption = document.getElementById("stage-caption");
const storyScenes = document.querySelectorAll(".story-scene");
const dragHeadphones = document.getElementById("drag-headphones");
const dropZone = document.getElementById("drop-zone");
const openInspectionButton = document.getElementById("open-inspection");
const toRepairTableButton = document.getElementById("to-repair-table");
const noHelpButton = document.getElementById("no-help");
const voteResult = document.getElementById("vote-result");
const inspectionWrap = document.getElementById("inspection-wrap");
const showRepairExamplesButton = document.getElementById("show-repair-examples");
const goToVoteButton = document.getElementById("go-to-vote");
const inspectionParts = [
  document.getElementById("top-cushion"),
  document.getElementById("right-cushion"),
  document.getElementById("left-cushion"),
  document.getElementById("left-earcup"),
  document.getElementById("battery"),
  document.getElementById("circuit-board"),
  document.getElementById("right-earcup")
];
const cushionParts = inspectionParts.filter((part) =>
  ["top-cushion", "right-cushion", "left-cushion"].includes(part.id)
);
const inspectionFactIds = new Set([
  "cushions",
  "battery",
  "circuit-board",
  "noise-cancellation"
]);
const viewedInspectionFacts = new Set();
const partMasks = new Map();

const facts = window.HEADPHONE_FACTS || [];
let currentFact = null;
let hasStarted = false;
let isPaused = false;
let timer = null;
let timerStartedAt = 0;
let timerRemaining = 0;
let timerCallback = null;
let repairVotes = 0;
let replaceVotes = 0;

const captions = {
  intro: "Press start to watch her headphones fail.",
  takeoff: "The sound cuts out, and the routine breaks.",
  "headphones-alone": "Help her check what happened?",
  bench: "Now the object is ready to inspect."
};

const scenesWithBack = ["headphones-alone", "no-help-result", "drag-lab", "inspection", "bench", "vote-scene"];

function showScene(id) {
  document.body.dataset.scene = id;
  const isTvScene = ["intro", "takeoff", "headphones-alone", "no-help-result"].includes(id);
  document.body.classList.toggle("workbench-mode", !isTvScene);
  document.body.classList.toggle("disassembly-done", id === "inspection");
  storyScenes.forEach((scene) => {
    scene.classList.toggle("active", scene.id === id);
  });
  stageCaption.textContent = captions[id] || "";
  if (stepBackButton) {
    stepBackButton.hidden = !scenesWithBack.includes(id);
  }
  restartAnimations(document.getElementById(id));
}

function restartAnimations(scene) {
  if (!scene) return;
  scene.querySelectorAll(".intro-wide, .takeoff-animation").forEach((el) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  });
}

function clearStoryTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function scheduleNext(ms, callback) {
  clearStoryTimer();
  timerRemaining = ms;
  timerCallback = callback;
  timerStartedAt = performance.now();
  timer = setTimeout(() => {
    timer = null;
    callback();
  }, ms);
}

function pauseStory() {
  if (!hasStarted || isPaused) return;
  isPaused = true;
  document.body.classList.remove("story-playing");
  document.body.classList.add("story-paused");
  if (timer) {
    timerRemaining = Math.max(0, timerRemaining - (performance.now() - timerStartedAt));
    clearStoryTimer();
  }
}

function resumeStory() {
  if (!hasStarted) {
    startStory();
    return;
  }
  if (!isPaused) return;
  isPaused = false;
  document.body.classList.add("story-playing");
  document.body.classList.remove("story-paused");
  if (timerCallback && timerRemaining > 0) {
    scheduleNext(timerRemaining, timerCallback);
  }
}

function startStory() {
  hasStarted = true;
  isPaused = false;
  document.body.classList.add("story-playing");
  document.body.classList.remove("story-paused");
  showScene("intro");
  scheduleNext(2000, () => {
    showScene("takeoff");
    scheduleNext(4200, () => {
      document.body.classList.remove("story-playing");
      showScene("headphones-alone");
      clearStoryTimer();
    });
  });
}

function restartStory() {
  clearStoryTimer();
  hasStarted = false;
  isPaused = false;
  timerCallback = null;
  timerRemaining = 0;
  document.body.classList.remove("story-playing", "story-paused");
  resetDragItem();
  showScene("intro");
}

function goBackOneStep() {
  const currentScene = document.body.dataset.scene;
  clearStoryTimer();
  document.body.classList.remove("story-playing", "story-paused");

  if (currentScene === "headphones-alone") {
    restartStory();
    return;
  }

  if (currentScene === "no-help-result") {
    showScene("headphones-alone");
    return;
  }

  if (currentScene === "drag-lab") {
    resetDragItem();
    showScene("headphones-alone");
    return;
  }

  if (currentScene === "inspection" || currentScene === "bench") {
    resetDragItem();
    showScene("drag-lab");
    return;
  }

  if (currentScene === "vote-scene") {
    showScene("inspection");
    showFactById("green-is-not-enough");
    goToVoteButton.hidden = false;
  }
}

function showFactById(factId) {
  const fact = facts.find((item) => item.id === factId);
  if (fact) renderFact(fact);
}

function showFactForPart(partId) {
  const fact = facts.find((item) => item.parts.includes(partId));
  if (fact) {
    renderFact(fact);
    if (inspectionFactIds.has(fact.id)) {
      viewedInspectionFacts.add(fact.id);
      showRepairExamplesButton.hidden = viewedInspectionFacts.size !== inspectionFactIds.size;
    }
  }
}

function resetInspectionProgress() {
  viewedInspectionFacts.clear();
  inspectionParts.forEach((part) => part.classList.remove("apart"));
  showRepairExamplesButton.hidden = true;
  goToVoteButton.hidden = true;
}

function enterInspection() {
  resetInspectionProgress();
  showScene("inspection");
  showFactById("market-to-waste");
}

function renderFact(fact) {
  currentFact = fact;
  cardTitle.textContent = fact.title;
  cardFact.textContent = fact.fact;
  cardSource.innerHTML = `Sources: ${fact.sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a>`)
    .join(" · ")}`;
  cardFact.after(cardSource);
  cardSource.hidden = fact.sourcePlacement === "model";
  modelOutput.textContent = "";
  askButton.hidden = !fact.modelFact;
}

startStoryButton.addEventListener("click", resumeStory);
stopStoryButton.addEventListener("click", pauseStory);
restartStoryButton.addEventListener("click", restartStory);
stepBackButton.addEventListener("click", goBackOneStep);
toRepairTableButton.addEventListener("click", () => {
  clearStoryTimer();
  document.body.classList.remove("story-playing", "story-paused");
  showScene("drag-lab");
});

noHelpButton.addEventListener("click", () => {
  clearStoryTimer();
  document.body.classList.remove("story-playing", "story-paused");
  showScene("no-help-result");
});
openInspectionButton.addEventListener("click", () => {
  enterInspection();
});

// Drag the single headphones to the repair table.
let dragState = null;

function resetDragItem() {
  if (!dragHeadphones) return;
  dragHeadphones.classList.remove("dragging");
  dragHeadphones.style.left = "";
  dragHeadphones.style.top = "";
}

function moveDragItem(clientX, clientY) {
  dragHeadphones.style.left = `${clientX - dragState.offsetX}px`;
  dragHeadphones.style.top = `${clientY - dragState.offsetY}px`;
}

function isOverDropZone(x, y) {
  const rect = dropZone.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

dragHeadphones.addEventListener("pointerdown", (event) => {
  dragHeadphones.setPointerCapture(event.pointerId);
  const rect = dragHeadphones.getBoundingClientRect();
  dragState = {
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
  dragHeadphones.classList.add("dragging");
  moveDragItem(event.clientX, event.clientY);
});

dragHeadphones.addEventListener("pointermove", (event) => {
  if (!dragState) return;
  moveDragItem(event.clientX, event.clientY);
  dropZone.classList.toggle("ready", isOverDropZone(event.clientX, event.clientY));
});

dragHeadphones.addEventListener("pointerup", (event) => {
  if (!dragState) return;
  const dropped = isOverDropZone(event.clientX, event.clientY);
  dragState = null;
  dropZone.classList.remove("ready");
  dragHeadphones.classList.remove("dragging");
  if (dropped) {
    resetDragItem();
    enterInspection();
  } else {
    resetDragItem();
  }
});

// Vote interaction.
document.querySelectorAll(".vote-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.choice === "repair") {
      repairVotes += 1;
      voteResult.textContent = `You chose repair. Repair: ${repairVotes} / Replace: ${replaceVotes}. Extending lifespan means fewer new products need to be made.`;
    } else {
      replaceVotes += 1;
      voteResult.textContent = `You chose replace. Repair: ${repairVotes} / Replace: ${replaceVotes}. Replacing can feel easier, but it usually means another product must be manufactured.`;
    }
  });
});

showRepairExamplesButton.addEventListener("click", () => {
  showFactById("green-is-not-enough");
  showRepairExamplesButton.hidden = true;
  goToVoteButton.hidden = false;
});

goToVoteButton.addEventListener("click", () => {
  showScene("vote-scene");
});

askButton.addEventListener("click", () => {
  if (!currentFact || !currentFact.modelFact) return;
  modelOutput.textContent = currentFact.modelFact;
  if (currentFact.sourcePlacement === "model") {
    modelOutput.after(cardSource);
    cardSource.hidden = false;
  }
});

function getPartMask(part) {
  if (partMasks.has(part)) return partMasks.get(part);
  if (!part.complete || !part.naturalWidth || !part.naturalHeight) return null;

  const canvas = document.createElement("canvas");
  canvas.width = part.naturalWidth;
  canvas.height = part.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(part, 0, 0);
  partMasks.set(part, context);
  return context;
}

function pointHitsPart(part, clientX, clientY) {
  const context = getPartMask(part);
  if (!context) return false;

  const rect = part.getBoundingClientRect();
  const scale = Math.min(rect.width / part.naturalWidth, rect.height / part.naturalHeight);
  const renderedWidth = part.naturalWidth * scale;
  const renderedHeight = part.naturalHeight * scale;
  const x = (clientX - rect.left - (rect.width - renderedWidth) / 2) / scale;
  const y = (clientY - rect.top - (rect.height - renderedHeight) / 2) / scale;

  if (x < 0 || y < 0 || x >= part.naturalWidth || y >= part.naturalHeight) return false;
  return context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data[3] > 24;
}

inspectionWrap.addEventListener("click", (event) => {
  const clickedPart = inspectionParts.find((part) => pointHitsPart(part, event.clientX, event.clientY));
  if (!clickedPart) return;

  if (cushionParts.includes(clickedPart)) {
    const shouldMove = !clickedPart.classList.contains("apart");
    cushionParts.forEach((part) => part.classList.toggle("apart", shouldMove));
    showFactForPart(clickedPart.id);
    return;
  }

  clickedPart.classList.toggle("apart");
  showFactForPart(clickedPart.id);
});

showScene("intro");
