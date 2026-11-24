/* ==========================================================================
   Toy piano + "jam with me"

   1. Notes & keys
   2. Sound: a tiny electric-piano synth (Web Audio, no files needed)
   3. Playing it: mouse, finger (slide across!) and computer keyboard
   4. Jam with me: a chord loop to play along with
   ========================================================================== */


/* ---------- 1. Notes & keys ---------- */

const FIRST_NOTE = 60;  // C4, as a MIDI number (60 = middle C)
const LAST_NOTE = 76;   // E5

// Computer keys by their position, so it works on Swiss QWERTZ keyboards too:
// A W S E D F T G Z H U J K O L P Ö
const KEY_CODES = [
  "KeyA", "KeyW", "KeyS", "KeyE", "KeyD", "KeyF", "KeyT", "KeyG", "KeyY",
  "KeyH", "KeyU", "KeyJ", "KeyK", "KeyO", "KeyL", "KeyP", "Semicolon",
];

const keyboard = document.getElementById("keys");
const jamButton = document.getElementById("jam");
const chordLabels = [...document.querySelectorAll("#chords span")];

const isBlack = (note) => [1, 3, 6, 8, 10].includes(note % 12);
const frequency = (note) => 440 * 2 ** ((note - 69) / 12);

for (let note = FIRST_NOTE; note <= LAST_NOTE; note++) {
  const key = document.createElement("span");
  key.className = isBlack(note) ? "key key--black" : "key";
  key.dataset.note = note;
  keyboard.append(key);
}

const keyFor = (note) => keyboard.querySelector(`[data-note="${note}"]`);


/* ---------- 2. Sound ---------- */

let audio = null;   // made on the first touch: browsers only allow sound after a click
let output = null;

function getAudio() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();

    const warmth = audio.createBiquadFilter();  // takes the harsh edge off
    warmth.type = "lowpass";
    warmth.frequency.value = 2400;

    output = audio.createGain();
    output.gain.value = 0.8;
    output.connect(warmth).connect(audio.destination);
  }
  if (audio.state === "suspended") audio.resume();
  return audio;
}

// One soft note: a triangle wave plus a quiet sine an octave higher,
// a fast attack and a long, natural fade.
function playNote(note, { when = 0, length = 1.6, volume = 0.22, into = null } = {}) {
  const ctx = getAudio();
  const start = Math.max(when, ctx.currentTime);

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
  envelope.connect(into || output);

  for (const [wave, octave, level] of [["triangle", 1, 1], ["sine", 2, 0.3]]) {
    const oscillator = ctx.createOscillator();
    oscillator.type = wave;
    oscillator.frequency.value = frequency(note) * octave;

    const mix = ctx.createGain();
    mix.gain.value = level;

    oscillator.connect(mix).connect(envelope);
    oscillator.start(start);
    oscillator.stop(start + length + 0.05);
  }
}


/* ---------- 3. Playing it ---------- */

function press(note) {
  playNote(note);
  keyFor(note).classList.add("is-down");
}

function release(note) {
  keyFor(note).classList.remove("is-down");
}

// Mouse & finger: press, then slide across the keys like a glissando.
let fingerNote = null;

function noteUnder(event) {
  const element = document.elementFromPoint(event.clientX, event.clientY);
  return element && element.dataset.note ? Number(element.dataset.note) : null;
}

function slideTo(note) {
  if (note === fingerNote) return;
  if (fingerNote !== null) release(fingerNote);
  fingerNote = note;
  if (note !== null) press(note);
}

keyboard.addEventListener("pointerdown", (event) => {
  keyboard.setPointerCapture(event.pointerId);
  slideTo(noteUnder(event));
});
keyboard.addEventListener("pointermove", (event) => {
  if (keyboard.hasPointerCapture(event.pointerId)) slideTo(noteUnder(event));
});
keyboard.addEventListener("pointerup", () => slideTo(null));
keyboard.addEventListener("pointercancel", () => slideTo(null));

// Computer keyboard
function shouldIgnore(event) {
  return event.repeat || event.metaKey || event.ctrlKey || event.altKey ||
    event.target.closest("input, textarea, select") ||
    document.querySelector("dialog[open]");
}

document.addEventListener("keydown", (event) => {
  const index = KEY_CODES.indexOf(event.code);
  if (index === -1 || shouldIgnore(event)) return;
  press(FIRST_NOTE + index);
});

document.addEventListener("keyup", (event) => {
  const index = KEY_CODES.indexOf(event.code);
  if (index !== -1) release(FIRST_NOTE + index);
});

// Switched windows while holding a key? Its key-up never arrives, so let go of everything.
window.addEventListener("blur", () => {
  for (const key of keyboard.querySelectorAll(".is-down")) key.classList.remove("is-down");
});


/* ---------- 4. Jam with me ---------- */

// Four chords, voiced close together so they flow (that's what inversions are for).
const CHORDS = [
  { name: "Am", notes: [57, 60, 64], bass: 45 },  // A C E
  { name: "F",  notes: [57, 60, 65], bass: 41 },  // A C F
  { name: "C",  notes: [55, 60, 64], bass: 48 },  // G C E
  { name: "G",  notes: [55, 59, 62], bass: 43 },  // G B D
];
const BEAT = 60 / 86;   // seconds per beat at 86 bpm
const BAR = 4 * BEAT;

let jamming = false;
let jamBus = null;      // every jam note goes through here, so "stop" can fade them all
let jamTimer = null;
let jamRound = 0;       // counts jams, so leftovers from an old jam can be ignored
let nextBarTime = 0;
let barNumber = 0;

jamButton.addEventListener("click", () => (jamming ? stopJam() : startJam()));

function startJam() {
  const ctx = getAudio();
  jamming = true;
  jamRound++;

  jamBus = ctx.createGain();
  jamBus.connect(output);

  nextBarTime = ctx.currentTime + 0.1;
  barNumber = 0;
  scheduleBars();
  jamTimer = setInterval(scheduleBars, 100);

  jamButton.setAttribute("aria-pressed", "true");
  jamButton.textContent = "stop jamming";
  document.dispatchEvent(new CustomEvent("lisa:playing", { detail: "jam" }));
}

// Plan the next bar a moment before it's due: Web Audio then plays it exactly on time.
function scheduleBars() {
  const ctx = getAudio();
  while (nextBarTime < ctx.currentTime + 0.3) {
    playBar(CHORDS[barNumber % CHORDS.length], nextBarTime);
    nextBarTime += BAR;
    barNumber++;
  }
}

function playBar(chord, time) {
  // chord on beat 1, on the "and" of 2, and on 4; bass on 1 and 3
  for (const beat of [0, 1.5, 3]) {
    for (const note of chord.notes) {
      playNote(note, { when: time + beat * BEAT, length: beat === 0 ? 2 : 1, volume: 0.07, into: jamBus });
    }
  }
  for (const beat of [0, 2]) {
    playNote(chord.bass, { when: time + beat * BEAT, length: 1.6, volume: 0.14, into: jamBus });
  }

  // light up the chord on screen right when it starts sounding
  const round = jamRound;
  const delay = (time - getAudio().currentTime) * 1000;
  setTimeout(() => {
    if (jamming && round === jamRound) showChord(chord);
  }, delay);
}

function stopJam() {
  if (!jamming) return;
  jamming = false;
  clearInterval(jamTimer);

  jamBus.gain.setTargetAtTime(0, getAudio().currentTime, 0.08);  // fade out what's already planned
  jamBus = null;

  showChord(null);
  jamButton.setAttribute("aria-pressed", "false");
  jamButton.textContent = "jam with me";
}

// Show the chord name, and make its notes glow on the keyboard: those always fit.
function showChord(chord) {
  for (const label of chordLabels) {
    label.classList.toggle("is-now", Boolean(chord) && label.textContent === chord.name);
  }
  const fitting = chord ? chord.notes.map((note) => note % 12) : [];
  for (const key of keyboard.children) {
    key.classList.toggle("fits", fitting.includes(Number(key.dataset.note) % 12));
  }
}

// The song or a clip started: the jam makes room.
document.addEventListener("lisa:playing", (event) => {
  if (event.detail !== "jam") stopJam();
});

// Browsers slow down background tabs, which would make the jam stumble: stop politely.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopJam();
});
