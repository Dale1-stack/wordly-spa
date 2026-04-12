
const form = document.getElementById("search-form");
const input = document.getElementById("word-input");

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

const resultDiv = document.getElementById("result");

const wordEl = document.getElementById("word");
const pronunciationEl = document.getElementById("pronunciation");
const partOfSpeechEl = document.getElementById("part-of-speech");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");
const synonymsEl = document.getElementById("synonyms");
const sourceEl = document.getElementById("source");

const themeToggle = document.getElementById("theme-toggle");

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();

  if (!word) return;

  showLoading();
  clearError();
  clearResult();

  try {
    const response = await fetch(API_URL + word);

    if (!response.ok) {
      throw new Error("Word not found. Try another.");
    }

    const data = await response.json();

    displayWord(data[0]);

    input.value = "";

  } catch (err) {
    showError(err.message);
  } finally {
    hideLoading();
  }
});


function displayWord(data) {
  const meaning = data.meanings[0];
  const definitionObj = meaning.definitions[0];

  wordEl.textContent = data.word;

  pronunciationEl.textContent =
    data.phonetic || "No pronunciation available";

  partOfSpeechEl.textContent = meaning.partOfSpeech;

  definitionEl.textContent = definitionObj.definition;

  exampleEl.textContent =
    definitionObj.example || "No example available";

  synonymsEl.textContent =
    meaning.synonyms && meaning.synonyms.length
      ? meaning.synonyms.join(", ")
      : "No synonyms available";

  sourceEl.textContent = "View Source";
  sourceEl.href = data.sourceUrls
    ? data.sourceUrls[0]
    : "#";

  resultDiv.classList.remove("hidden");
}

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}


function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}


function clearResult() {
  resultDiv.classList.add("hidden");
}

 
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});


loadTheme();
