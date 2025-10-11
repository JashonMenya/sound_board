const grid = document.getElementById("grid");
const search = document.getElementById("search");
const stopAllBtn = document.getElementById("stopAll");
const volume = document.getElementById("volume");
let currentVolume = Number(volume.value);
const volValue = document.getElementById("volValue");


let sounds = [];
const players = new Map(); // file -> { audio, button }

// Local set up
// async function loadSounds() {
//   const res = await fetch("/api/sounds");
//   const data = await res.json();
//   sounds = data.sort((a, b) => a.label.localeCompare(b.label));
//   render(sounds);
// }

// Git hub page static webpage setup
async function loadSounds() {
  // For GitHub Pages (static)
  const res = await fetch("./sounds.json");
  const files = await res.json();

  // Convert file paths into objects with labels
  sounds = files.map((f) => ({
    file: f,
    label: f
      .replace(/^audio_files\//, "") // remove folder prefix
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/[-_]/g, " "), // prettier labels
  }));

  // Sort alphabetically
  sounds.sort((a, b) => a.label.localeCompare(b.label));

  render(sounds);
}

function render(list) {
  grid.innerHTML = "";
  players.clear();

  list.forEach(({ file, label }) => {
    const card = document.createElement("div");
    card.className = "card";

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "▶ Play";

    const lbl = document.createElement("div");
    lbl.className = "label";
    lbl.textContent = label;

    const audio = new Audio(file);
    audio.preload = "auto";
    audio.volume = currentVolume;


    // keep UI in sync
    audio.addEventListener("ended", () => {
      btn.classList.remove("playing");
      btn.textContent = "▶ Play";
    });

    btn.addEventListener("click", () => {
      // toggle play/pause for this sound; stop others if you want single-play
      if (audio.paused) {
        audio.currentTime = 0;
        audio.play();
        btn.classList.add("playing");
        btn.textContent = "⏸ Pause";
      } else {
        audio.pause();
        audio.currentTime = 0;
        btn.classList.remove("playing");
        btn.textContent = "▶ Play";
      }
    });

    players.set(file, { audio, button: btn });

    card.appendChild(btn);
    card.appendChild(lbl);
    grid.appendChild(card);
  });
}

function stopAll() {
  players.forEach(({ audio, button }) => {
    audio.pause();
    audio.currentTime = 0;
    button.classList.remove("playing");
    button.textContent = "▶ Play";
  });
}

search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  const filtered = sounds.filter((s) => s.label.toLowerCase().includes(q));
  render(filtered);
});

stopAllBtn.addEventListener("click", stopAll);

volume.addEventListener("input", () => {
  currentVolume = Number(volume.value);
  volValue.textContent = Math.round(currentVolume * 100) + "%";
  players.forEach(({ audio }) => (audio.volume = currentVolume));
});


loadSounds();
