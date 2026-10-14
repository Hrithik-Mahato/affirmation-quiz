/* Daily Affirmations: beginner-friendly vanilla JavaScript. */
const QUESTIONS = [
  {
    id: "q1",
    type: "mcq",
    prompt: "When planning your day to prevent overwhelm, what is your approach?",
    affirmation: "Screw the whole life plan. What am I planing what I doing in the next 30 minutes.",
    options: [
      "I must know everything already.",
      "Try to plan out every detail of the next five years",
      "Screw the whole life plan. What am I planing what I doing in the next 30 minutes.",
      "Wait for inspiration to strike before doing anything."
    ]
  },
  {
    id: "q2",
    type: "typed",
    prompt: "How do you respond when you feel an unhelpful craving or urge? Type this affirmation:Yeah, the urge hits hard, but I hit back harder. I am in control.",
    affirmation: "Yeah, the urge hits hard, but I hit back harder. I am in control.",
    options: []
  },
  {
    id: "q3",
    type: "mcq",
    prompt: "How do you treat mealtime and cooking?",
    affirmation: "Practice mindful eating and give full attention to my meals",
    options: [
      "Watch TV or anime while eating to save time.",
      "Scroll through social media while eating.",
      "I give myself time and space to grow.",
      "Practice mindful eating and give full attention to my meals"
    ]
  },
  {
    id: "q4",
    type: "typed",
    prompt: "What is your absolute rule when it comes to porn and toxic distractions? Type this affirmation:I don’t touch that garbage. I keep my mind clean.",
    affirmation: "I don’t touch that garbage. I keep my mind clean.",
    options: []
  },
  {
    id: "q5",
    type: "mcq",
    prompt: "Where does your time and primary focus go each day?",
    affirmation: "My time goes to my grind, period. No time wasted",
    options: [
      "My time goes to my grind, period. No time wasted",
      "Split equally between distractions and work",
      "I need to have every answer before I start.",
      "Whenever I feel like it."
    ]
  },
  {
    id: "q6",
    type: "typed",
    prompt: "What is you reward sytem, when youu acheive something? Type this affirmation:I use boredom strictly as an earned reward.",
    affirmation: "I use boredom strictly as an earned reward.",
    options: []
  },
  {
    id: "q7",
    type: "mcq",
    prompt: "When things get chaotic, what is your mindset shift?",
    affirmation: "Stop stressing about what I can't control. Fix what I can",
    options: [
      "Give up and let the chaos take over",
      "Split equally between distractions and work",
      "I need to have every answer before I start.",
      "Stop stressing about what I can't control. Fix what I can"
    ]
  }
];

const STORAGE_KEY = "dailyAffirmations.progress.v1";
const todayKey = () => new Date().toLocaleDateString("en-CA");
const $ = (id) => document.getElementById(id);

const elements = {
  questionTitle: $("questionTitle"),
  questionPrompt: $("questionPrompt"),
  questionType: $("questionType"),
  questionNumber: $("questionNumber"),
  answerForm: $("answerForm"),
  answerArea: $("answerArea"),
  feedback: $("feedback"),
  checkButton: $("checkButton"),
  nextButton: $("nextButton"),
  progressCount: $("progressCount"),
  progressFill: $("progressFill"),
  progressBar: $("progressBar"),
  streakValue: $("streakValue"),
  sessionScore: $("sessionScore"),
  totalSessions: $("totalSessions"),
  quizCard: document.querySelector(".quiz-card"),
  completeCard: $("completeCard"),
  completionMessage: $("completionMessage"),
  restartButton: $("restartButton"),
  resetButton: $("resetButton"),
  installButton: $("installButton")
};

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    console.warn("Could not read saved progress:", error);
    return {};
  }
}
let progress = loadProgress();

function ensureToday() {
  const today = todayKey();
  if (!progress.days || typeof progress.days !== "object") progress.days = {};
  if (!progress.days[today]) progress.days[today] = { completed: [], correct: 0 };
  if (!Array.isArray(progress.days[today].completed)) progress.days[today].completed = [];
  if (typeof progress.days[today].correct !== "number") progress.days[today].correct = 0;
  return progress.days[today];
}
let todayProgress = ensureToday();
let questionIndex = 0;
let selectedOption = null;
let answerChecked = false;

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Progress could not be saved on this device:", error);
  }
}

function normalizedAnswer(value) {
  // Strict checking: trim outside whitespace, collapse repeated spaces, ignore case.
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function renderQuestion() {
  const question = QUESTIONS[questionIndex];
  selectedOption = null;
  answerChecked = false;
  elements.feedback.className = "feedback hidden";
  elements.feedback.textContent = "";
  elements.checkButton.classList.remove("hidden");
  elements.nextButton.classList.add("hidden");
  elements.checkButton.disabled = false;
  elements.quizCard.classList.remove("hidden");
  elements.completeCard.classList.add("hidden");

  elements.questionTitle.textContent = question.type === "typed"
    ? "Say it in your own moment."
    : "Choose the words you want to remember.";
  elements.questionPrompt.textContent = question.prompt;
  elements.questionType.textContent = question.type === "typed" ? "TYPED ANSWER" : "MULTIPLE CHOICE";
  elements.questionNumber.textContent = `QUESTION ${questionIndex + 1} OF ${QUESTIONS.length}`;
  elements.answerArea.replaceChildren();

  if (question.type === "mcq") {
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      button.setAttribute("aria-pressed", "false");
      const marker = document.createElement("span");
      marker.className = "option-marker";
      marker.textContent = String.fromCharCode(65 + index);
      const label = document.createElement("span");
      label.textContent = option;
      button.append(marker, label);
      button.addEventListener("click", () => {
        if (answerChecked) return;
        selectedOption = option;
        elements.answerArea.querySelectorAll(".answer-option").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
      });
      elements.answerArea.append(button);
    });
  } else {
    const input = document.createElement("textarea");
    input.id = "typedAnswer";
    input.className = "typed-answer";
    input.name = "typedAnswer";
    input.rows = 3;
    input.autocomplete = "off";
    input.placeholder = "Write your affirmation here…";
    input.setAttribute("aria-label", "Type the affirmation");
    elements.answerArea.append(input);
  }
  updateProgress();
}

function showFeedback(isCorrect, expected) {
  elements.feedback.className = `feedback ${isCorrect ? "good" : "try-again"}`;
  elements.feedback.textContent = isCorrect
    ? "Beautifully done. Take a moment to let those words settle."
    : `Not quite yet. The affirmation is: “${expected}”`;
  elements.feedback.classList.remove("hidden");
}

function checkAnswer(event) {
  event.preventDefault();
  if (answerChecked) return;
  const question = QUESTIONS[questionIndex];
  const answer = question.type === "mcq"
    ? selectedOption
    : $("typedAnswer")?.value ?? "";

  if (!answer || !answer.trim()) {
    elements.feedback.className = "feedback try-again";
    elements.feedback.textContent = question.type === "mcq"
      ? "Choose an option first, then check your answer."
      : "Write the affirmation first, then check your answer.";
    elements.feedback.classList.remove("hidden");
    return;
  }

  const isCorrect = question.type === "mcq"
    ? answer === question.affirmation
    : normalizedAnswer(answer) === normalizedAnswer(question.affirmation);

  answerChecked = true;
  if (!todayProgress.completed.includes(question.id)) {
    todayProgress.completed.push(question.id);
    if (isCorrect) todayProgress.correct += 1;
  }
  saveProgress();
  showFeedback(isCorrect, question.affirmation);
  elements.answerArea.querySelectorAll("button, textarea").forEach((control) => {
    control.disabled = true;
  });
  elements.checkButton.classList.add("hidden");
  elements.nextButton.classList.remove("hidden");
  elements.nextButton.textContent = questionIndex === QUESTIONS.length - 1
    ? "See my practice summary →"
    : "Next question →";
  updateProgress();
}

function updateProgress() {
  const completedCount = todayProgress.completed.length;
  elements.progressCount.textContent = `${completedCount} / ${QUESTIONS.length}`;
  elements.progressFill.style.width = `${(completedCount / QUESTIONS.length) * 100}%`;
  elements.progressBar.setAttribute("aria-valuemax", String(QUESTIONS.length));
  elements.progressBar.setAttribute("aria-valuenow", String(completedCount));
  elements.sessionScore.textContent = String(todayProgress.correct);
  elements.streakValue.textContent = String(calculateStreak());
  elements.totalSessions.textContent = String(Object.keys(progress.days || {}).filter((date) => {
    const day = progress.days[date];
    return day && Array.isArray(day.completed) && day.completed.length > 0;
  }).length);
}

function calculateStreak() {
  const activeDays = new Set(Object.keys(progress.days || {}).filter((date) => {
    const day = progress.days[date];
    return day && Array.isArray(day.completed) && day.completed.length > 0;
  }));
  let streak = 0;
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  // A streak can continue if today has not yet been practiced; begin from yesterday in that case.
  if (!activeDays.has(todayKey())) date.setDate(date.getDate() - 1);
  while (activeDays.has(date.toLocaleDateString("en-CA"))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function showCompletion() {
  elements.quizCard.classList.add("hidden");
  elements.completeCard.classList.remove("hidden");
  const done = todayProgress.completed.length;
  elements.completionMessage.textContent =
    `You completed ${done} of ${QUESTIONS.length} questions and got ${todayProgress.correct} correct. Every small moment of practice matters.`;
}

function nextQuestion() {
  if (questionIndex < QUESTIONS.length - 1) {
    questionIndex += 1;
    renderQuestion();
  } else {
    showCompletion();
  }
}

function restartPractice() {
  questionIndex = 0;
  // Restarting lets the user practice again without erasing today's recorded results.
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetToday() {
  const confirmed = window.confirm("Reset today's progress? Your other practice days will stay saved.");
  if (!confirmed) return;
  delete progress.days[todayKey()];
  todayProgress = ensureToday();
  questionIndex = 0;
  saveProgress();
  renderQuestion();
}

elements.answerForm.addEventListener("submit", checkAnswer);
elements.nextButton.addEventListener("click", nextQuestion);
elements.restartButton.addEventListener("click", restartPractice);
elements.resetButton.addEventListener("click", resetToday);

let installPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  elements.installButton.classList.remove("hidden");
});
elements.installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  elements.installButton.classList.add("hidden");
});

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => console.warn("Offline support could not be registered:", error));
  });
}

renderQuestion();
saveProgress();
