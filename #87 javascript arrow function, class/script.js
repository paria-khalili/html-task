const chapters = [
  {
    title: "Chapter 1: Morning Mood",
    actions: [
      { text: "🧸 share a toy", emotion: 2 },
      { text: "🥪 take a nap", emotion: 1 },
      { text: "😡 throw a tantrum", emotion: -3 }
    ]
  },
  {
    title: "Chapter 2: Playground Fun",
    actions: [
      { text: "🤝 hug a friend", emotion: 3 },
      { text: "😢 break a toy", emotion: -2 },
      { text: "🌟 help clean up", emotion: 4 }
    ]
  },
  {
    title: "Chapter 3: Hide or Seek?",
    actions: [
      { text: "😶‍🌫️ hide from mom", emotion: -1 },
      { text: "🍎 share lunch", emotion: 2 },
      { text: "🧼 wash hands", emotion: 1 }
    ]
  }
];

const characterDiv = document.getElementById('character-selection');
const choicesDiv = document.getElementById('choices');
const outputDiv = document.getElementById('story-output');
const faceMeter = document.getElementById('face-meter');
const moodFill = document.getElementById('mood-fill');
const narrationControls = document.getElementById('narration-controls');
const resetContainer = document.getElementById('reset-button-container');
const progressDiv = document.getElementById('progress');
const chapterTitle = document.getElementById('chapter-title');

let narrationEnabled = true;
let currentCharacter = null;
let currentChapterIndex = 0;

// Narration toggle
const narrationLabel = document.createElement('p');
narrationLabel.textContent = '🔈 Toggle narrator (read story aloud):';
const toggleBtn = document.createElement('button');
toggleBtn.textContent = '🔊 Narration: ON';
toggleBtn.onclick = () => {
  narrationEnabled = !narrationEnabled;
  toggleBtn.textContent = narrationEnabled ? '🔊 Narration: ON' : '🔇 Narration: OFF';
};
narrationControls.appendChild(narrationLabel);
narrationControls.appendChild(toggleBtn);

// Character class with arrow function
class Character {
  constructor(animal, customName) {
    this.animal = animal;
    this.name = `${customName} the ${animal}`;
    this.mood = 0;
    this.actionsChosen = [];
  }
  updateMood = (value) => {
    this.mood += value;
  };
}

window.onload = () => {
  const saved = localStorage.getItem('savedStory');
  if (saved) {
    const story = JSON.parse(saved);
    outputDiv.textContent = `📖 LAST SAVED STORY\n${story.summary}`;
    updateFace(story.mood);
  }
  renderCharacters();
};

function renderCharacters() {
  characterDiv.innerHTML = '<h3>Pick a character:</h3>';
  chapters.length = 3;
  currentChapterIndex = 0;
  chapters.forEach(() => {}); // prevent unused warning
  const characters = [
    { name: "Fox", img: "🦊" },
    { name: "Bunny", img: "🐰" },
    { name: "Cat", img: "🐱" }
  ];
  characters.forEach(char => {
    const btn = document.createElement('button');
    btn.textContent = `${char.img} ${char.name}`;
    btn.onclick = () => {
      const customName = prompt(`What do you want to name your ${char.name}?`);
      if (customName) startStory(char.name, customName);
    };
    characterDiv.appendChild(btn);
  });
}

function startStory(animal, name) {
  currentCharacter = new Character(animal, name);
  outputDiv.textContent = `${currentCharacter.name} is starting their story!`;
  updateFace(0);
  showChapter();
  updateProgress();
}

function showChapter() {
  const chapter = chapters[currentChapterIndex];
  chapterTitle.textContent = chapter.title;
  choicesDiv.innerHTML = '';
  chapter.actions.forEach(action => {
    const btn = document.createElement('button');
    btn.textContent = action.text;
    btn.className = 'choice-button fade-in';
    btn.onclick = () => handleChapterAction(action);
    choicesDiv.appendChild(btn);
  });
}

async function handleChapterAction(action) {
  if (!currentCharacter || currentChapterIndex >= chapters.length) return;

  outputDiv.textContent += `\nThinking about "${action.text}"...`;
  updateProgress();

  setTimeout(async () => {
    currentCharacter.updateMood(action.emotion);
    currentCharacter.actionsChosen.push(action.text);
    outputDiv.textContent += `\n✅ ${currentCharacter.name} did "${action.text}"!`;
    updateFace(currentCharacter.mood);
    updateProgress();

    currentChapterIndex++;
    if (currentChapterIndex < chapters.length) {
      await wait(1000);
      showChapter();
    } else {
      const summary = await finishStory();
      outputDiv.textContent += `\n\n${summary}`;
      localStorage.setItem('savedStory', JSON.stringify({
        character: currentCharacter.name,
        actions: currentCharacter.actionsChosen,
        mood: currentCharacter.mood,
        summary: summary
      }));
      if (narrationEnabled) speakSummary(summary);
      showResetButton();
    }
  }, 1000);
}

function updateProgress() {
  if (currentCharacter)
    progressDiv.textContent = `📚 Chapter: ${currentChapterIndex + 1}/${chapters.length} | 🎯 Actions taken: ${currentCharacter.actionsChosen.length}`;
}

function finishStory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mood = currentCharacter.mood;
      let moodLabel = "😐 calm";
      if (mood >= 6) moodLabel = "🥳 super joyful";
      else if (mood >= 3) moodLabel = "😄 happy";
      else if (mood >= 0) moodLabel = "😌 calm";
      else if (mood >= -2) moodLabel = "😠 grumpy";
      else moodLabel = "😭 very upset";

      resolve(` STORY SUMMARY \n${currentCharacter.name} felt ${moodLabel} today!\nThey did: ${currentCharacter.actionsChosen.join(', ')}\nMood Score: ${mood}`);
    }, 1500);
  });
}

function updateFace(mood) {
  let face = '😐';
  if (mood >= 6) face = '😁';
  else if (mood >= 3) face = '🙂';
  else if (mood >= 0) face = '😐';
  else if (mood >= -2) face = '😠';
  else face = '😭';
  faceMeter.textContent = `Mood Meter: ${face}`;
  const fillPercent = Math.max(0, Math.min(100, ((mood + 6) / 12) * 100));
  moodFill.style.width = `${fillPercent}%`;
}

function speakSummary(text) {
  if ('speechSynthesis' in window) {
    const cleaned = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
    const say = new SpeechSynthesisUtterance(cleaned);
    say.rate = 0.95;
    say.pitch = 1.1;
    speechSynthesis.speak(say);
  }
}

function showResetButton() {
  resetContainer.innerHTML = '';
  const resetBtn = document.createElement('button');
  resetBtn.textContent = '🔄 Start Over';
  resetBtn.onclick = () => {
    localStorage.removeItem('savedStory');
    location.reload();
  };
  resetContainer.appendChild(resetBtn);
}

// Promise-based wait helper (for async pacing)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
