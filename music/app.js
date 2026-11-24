/* ==========================================================================
   Lisa Gehrig: music page

   1. Setup
   2. The strip (cards at the bottom)
   3. Selecting a card
   4. The stage: cassette, video, photo or "coming soon"
   5. The story panel
   6. The song player (the cassette is its remote control)
   7. Smooth volume fades
   8. Sheets ("more about me", "let's make something")
   9. "write me": the chips fill in the e-mail
  10. Start
   ========================================================================== */


/* ---------- 1. Setup ---------- */

const EMAIL = "kontakt@lisa-gehrig.ch";

const stage = document.getElementById("stage");
const panel = document.getElementById("panel");
const strip = document.getElementById("strip");
const stripList = document.getElementById("strip-list");
const song = document.getElementById("song");

const isBigScreen = window.matchMedia("(min-width: 901px)");
const wantsCalm = window.matchMedia("(prefers-reduced-motion: reduce)");

let current = null;   // the item on stage right now
let video = null;     // the <video> on stage, if there is one

// Tell the rest of the page "something started playing" (piano.js listens too),
// so only one thing ever plays at a time.
function announcePlaying(source) {
  document.dispatchEvent(new CustomEvent("lisa:playing", { detail: source }));
}
document.addEventListener("lisa:playing", (event) => {
  if (event.detail === "jam") stopEverything();
});

// small helpers
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const clock = (seconds) =>
  Number.isFinite(seconds)
    ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`
    : "–:––";
const quote = (text) => String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const hasMedia = (item) => Boolean(item.audio || item.video || item.photo);


/* ---------- 2. The strip ---------- */

function buildStrip() {
  ITEMS.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="card" style="--i:${index}" aria-pressed="false">
        <span class="card__label">
          <span class="card__dot" aria-hidden="true"></span>
          <span class="card__title">${item.title}</span>
          <span class="card__tag">— ${item.tag}</span>
        </span>
        ${coverHTML(item)}
      </button>`;

    const card = li.querySelector(".card");
    card.dataset.id = item.id;
    card.addEventListener("click", () => select(item, { byClick: true }));
    stripList.append(li);
  });
}

function coverHTML(item) {
  if (item.cover) {
    return `<span class="card__cover"><img src="${item.cover}" alt="" loading="lazy"></span>`;
  }
  // no picture yet: a typographic card in the item's own colour
  return `
    <span class="card__cover card__cover--type" style="--card:${item.tint}">
      <span class="card__big">${item.title}</span>
      ${hasMedia(item) ? "" : `<span class="card__soon">coming soon</span>`}
    </span>`;
}

// The mouse wheel moves the strip sideways, and glides instead of jumping.
let glideTarget = 0;
let glidePosition = 0;
let gliding = false;

strip.addEventListener("wheel", (event) => {
  const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  const step = event.deltaMode === 1 ? delta * 32 : delta;  // some mice count in lines, not pixels
  const max = strip.scrollWidth - strip.clientWidth;

  if (!gliding) glideTarget = glidePosition = strip.scrollLeft;
  const next = clamp(glideTarget + step, 0, max);
  if (next === glideTarget) return;  // already at the end: let the page scroll normally

  event.preventDefault();
  glideTarget = next;
  if (!gliding) {
    gliding = true;
    requestAnimationFrame(glide);
  }
}, { passive: false });

function glide() {
  glidePosition += (glideTarget - glidePosition) * 0.18;  // cover 18% of the way each frame
  if (Math.abs(glideTarget - glidePosition) < 0.5) glidePosition = glideTarget;
  strip.scrollLeft = glidePosition;

  if (glidePosition !== glideTarget) requestAnimationFrame(glide);
  else gliding = false;
}

// "things I made ▾": on a big screen the strip is already visible, so the cards wave hello.
document.querySelector('a[href="#strip"]').addEventListener("click", (event) => {
  if (!isBigScreen.matches) return;  // small screens: normal jump down to the strip
  event.preventDefault();
  strip.classList.remove("is-waving");
  void strip.offsetWidth;            // restart the animation if it's clicked twice
  strip.classList.add("is-waving");
});
strip.addEventListener("animationend", (event) => {
  // the cards wave one after another: wait for the last one
  if (event.target.closest("li") === stripList.lastElementChild) strip.classList.remove("is-waving");
});


/* ---------- 3. Selecting a card ---------- */

function select(item, { byClick = false } = {}) {
  // clicking the card that's already on stage = play / pause
  if (item === current) {
    if (byClick) togglePlay();
    return;
  }

  stopEverything();
  current = item;

  document.body.style.setProperty("--tint", item.tint);
  for (const card of stripList.querySelectorAll(".card")) {
    card.setAttribute("aria-pressed", String(card.dataset.id === item.id));
  }

  renderStage(item);
  renderPanel(item, { fade: byClick });

  if (byClick) {
    history.replaceState(null, "", "#" + item.id);  // shareable link to this card
    if (!isBigScreen.matches) stage.scrollIntoView({ behavior: wantsCalm.matches ? "auto" : "smooth" });
    startPlaying();
  }
}

function startPlaying() {
  if (current.audio) fadeIn(song);
  if (video) video.play().catch(() => {});  // if the browser says no, the controls are right there
}

function togglePlay() {
  if (current.audio) {
    if (song.paused) fadeIn(song);
    else fadeOut(song);
  } else if (video) {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }
}

function stopEverything() {
  if (!song.paused) fadeOut(song);
  if (video && !video.paused) video.pause();
}

function setPlaying(isPlaying) {
  document.body.classList.toggle("is-playing", isPlaying);
}


/* ---------- 4. The stage ---------- */

function renderStage(item) {
  video = null;

  if (item.audio) {
    stage.innerHTML = cassetteHTML(item);
    connectCassette(item);
  } else if (item.video) {
    stage.innerHTML = `<video class="screen" src="${item.video}" controls playsinline preload="metadata"></video>`;
    connectVideo(item);
  } else if (item.photo) {
    stage.innerHTML = `<img class="photo" src="${item.photo}" alt="${quote(item.title)}">`;
  } else {
    stage.innerHTML = soonHTML(item);
  }
}

function soonHTML(item, note = "This clip is still on my phone. Coming soon!") {
  return `
    <div class="soon">
      <p class="soon__title">${item.title}</p>
      <p class="soon__note">${note}</p>
    </div>`;
}

function connectVideo(item) {
  video = stage.querySelector("video");
  video.addEventListener("play", () => { setPlaying(true); announcePlaying("video"); });
  video.addEventListener("pause", () => setPlaying(false));
  video.addEventListener("error", () => {
    stage.innerHTML = soonHTML(item, "Hmm, this clip didn't load. Is the file name in items.js right?");
    video = null;
  });
}

function cassetteHTML(item) {
  return `
    <div class="deck">
      <div class="tape" aria-hidden="true">
        <span class="tape__label">
          ${item.cover ? `<img class="tape__art" src="${item.cover}" alt="">` : ""}
          <span class="tape__band">
            <span class="tape__side">A</span>
            <span class="tape__title">${item.title}</span>
            <span class="tape__by">L.G.</span>
          </span>
        </span>
        <span class="tape__window">
          <span class="reel reel--left"><span class="reel__pack"></span><span class="reel__hub"></span></span>
          <span class="reel reel--right"><span class="reel__pack"></span><span class="reel__hub"></span></span>
        </span>
        <span class="tape__base"></span>
      </div>

      <div class="controls">
        <button type="button" class="play" aria-label="Play">
          <svg class="icon-play" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3.5v11l9-5.5z" fill="currentColor"/></svg>
          <svg class="icon-pause" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3.5h3v11H5zM10 3.5h3v11h-3z" fill="currentColor"/></svg>
        </button>
        <input class="seek" type="range" min="0" max="1000" value="0" aria-label="Position in the song">
        <span class="time">0:00</span>
      </div>
    </div>`;
}


/* ---------- 5. The story panel ---------- */

let panelFade = 0;

function renderPanel(item, { fade }) {
  const fill = () => {
    const kicker = [item.tag, item.year].filter(Boolean).join(" — ");
    const credits = (item.credits || [])
      .map(([role, who]) => `<div><dt>${role}</dt><dd>${who}</dd></div>`).join("");
    const text = (item.text || []).map((paragraph) => `<p>${paragraph}</p>`).join("");
    const links = (item.links || [])
      .map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join("");

    panel.innerHTML = `
      <p class="panel__kicker">${kicker}</p>
      <h2 class="panel__title">${item.title}</h2>
      <div class="panel__text">${text}</div>
      ${credits ? `<dl class="credits">${credits}</dl>` : ""}
      ${links ? `<p class="panel__links">${links}</p>` : ""}
      <button type="button" class="panel__cta" data-open="together">let's make something →</button>`;
    panel.scrollTop = 0;
  };

  if (!fade) return fill();

  // fade out, swap the text, fade back in. If clicks come fast, only the last one counts.
  const thisFade = ++panelFade;
  panel.classList.add("is-fading");
  setTimeout(() => {
    if (thisFade !== panelFade) return;
    fill();
    panel.classList.remove("is-fading");
  }, 200);
}


/* ---------- 6. The song player ---------- */

function connectCassette(item) {
  const file = new URL(item.audio, location.href).href;
  if (song.src !== file) song.src = file;

  stage.querySelector(".tape").addEventListener("click", togglePlay);
  stage.querySelector(".play").addEventListener("click", togglePlay);

  const seek = stage.querySelector(".seek");
  seek.addEventListener("input", () => {
    if (song.duration) song.currentTime = (seek.value / 1000) * song.duration;
  });

  showProgress();
  showPlayState();
}

// Draw where we are in the song: reels, slider, time.
function showProgress() {
  const tape = stage.querySelector(".tape");
  if (!tape) return;  // the cassette isn't on stage right now

  const progress = song.duration ? song.currentTime / song.duration : 0;
  tape.style.setProperty("--p", progress.toFixed(4));
  stage.querySelector(".seek").value = Math.round(progress * 1000);
  stage.querySelector(".time").textContent = `${clock(song.currentTime)} / ${clock(song.duration)}`;
}

function showPlayState() {
  const playing = !song.paused;
  stage.querySelector(".tape")?.classList.toggle("is-playing", playing);

  const button = stage.querySelector(".play");
  if (button) {
    button.classList.toggle("is-playing", playing);
    button.setAttribute("aria-label", playing ? "Pause" : "Play");
  }
}

song.addEventListener("loadedmetadata", showProgress);
song.addEventListener("timeupdate", showProgress);
song.addEventListener("play", () => {
  showPlayState();
  setPlaying(true);
  announcePlaying("song");
});
song.addEventListener("pause", () => {
  showPlayState();
  setPlaying(false);
});
song.addEventListener("ended", () => {
  song.currentTime = 0;  // rewind the tape
});


/* ---------- 7. Smooth volume fades (no clicks, no sudden silence) ---------- */
// Note: iPhones don't let websites change the volume, there it simply starts/stops.

function fadeIn(media) {
  if (media.paused) media.volume = 0;
  media.play()
    .then(() => rampVolume(media, 1, 450))
    .catch(() => { media.volume = 1; });
}

function fadeOut(media) {
  rampVolume(media, 0, 300, () => {
    media.pause();
    media.volume = 1;
  });
}

function rampVolume(media, target, duration, whenDone) {
  cancelAnimationFrame(media.rampFrame);
  const start = media.volume;
  const startTime = performance.now();

  const step = (now) => {
    // clamp: the frame's timestamp can be a hair earlier than startTime
    const t = clamp((now - startTime) / duration, 0, 1);
    media.volume = clamp(start + (target - start) * t, 0, 1);
    if (t < 1) media.rampFrame = requestAnimationFrame(step);
    else if (whenDone) whenDone();
  };
  media.rampFrame = requestAnimationFrame(step);
}


/* ---------- 8. Sheets ---------- */

// Any element with data-open="…" opens that sheet; data-close closes the sheet it's in.
document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-open]");
  if (opener) openSheet(document.getElementById(opener.dataset.open));

  const closer = event.target.closest("[data-close]");
  if (closer) closeSheet(closer.closest("dialog"));
});

function openSheet(sheet) {
  const other = document.querySelector("dialog[open]");
  if (other) other.close();
  sheet.showModal();
}

function closeSheet(sheet) {
  if (wantsCalm.matches) return sheet.close();
  sheet.classList.add("is-closing");
  sheet.addEventListener("animationend", () => {
    sheet.classList.remove("is-closing");
    sheet.close();
  }, { once: true });
}

for (const sheet of document.querySelectorAll(".sheet")) {
  // Esc key: close with the same soft animation
  sheet.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSheet(sheet);
  });
  // a click on the dimmed background lands on the <dialog> itself
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet) closeSheet(sheet);
  });
}


/* ---------- 9. "write me": the chips fill in the e-mail ---------- */

const chips = [...document.querySelectorAll(".chip")];
const writeMe = document.getElementById("write-me");

for (const chip of chips) {
  chip.addEventListener("click", () => {
    const on = chip.getAttribute("aria-pressed") === "true";
    chip.setAttribute("aria-pressed", String(!on));
    updateMail();
  });
}

function updateMail() {
  const picked = chips
    .filter((chip) => chip.getAttribute("aria-pressed") === "true")
    .map((chip) => chip.textContent.trim());

  // "a", "a and b", "a, b and c"
  const wish = picked.length > 1
    ? `${picked.slice(0, -1).join(", ")} and ${picked.at(-1)}`
    : picked[0] || "make something together";

  const subject = `let's ${wish}`;
  const body = `Hi Lisa,\n\nlet's ${wish}!\n\nA bit about me and the idea:\n\n`;
  writeMe.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


/* ---------- 10. Start ---------- */

buildStrip();
updateMail();

// open the card from the link (…/music/#boogie), otherwise the radio song
const linked = ITEMS.find((item) => "#" + item.id === location.hash);
select(linked || ITEMS[0]);
