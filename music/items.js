/* ==========================================================================
   ✎ THE THINGS IN THE STRIP
   --------------------------------------------------------------------------
   Every entry below becomes one card in the strip at the bottom of the page.
   Click a card → it goes onto the stage (middle), its story shows on the
   right, and the whole page takes on its colour ("tint").

   Fields:
     id       short name, used in the link (…/music/#all-i-need)
     title    big title
     tag      small grey label next to the title
     year     shown above the title
     tint     background colour of the page while this card is selected
     cover    image for the card (leave "" for a typographic card)
     audio    an mp3            → plays on the cassette
     video    an mp4 / webm     → plays on the stage
     photo    a picture         → shown on the stage
              (leave audio/video "" and the card says "coming soon")
     credits  list of [role, who]
     text     list of paragraphs (simple HTML like <em> or <a> is fine)
     links    list of [label, url]

   To add a clip: put the file into media/clips/ and write its path
   into "video", e.g.  video: "media/clips/all-i-need.mp4"
   ========================================================================== */

const ITEMS = [
  {
    id: "love-you-stand-in-line",
    title: "love, you stand in line",
    tag: "radio single",
    year: "2026",
    tint: "#efe1d9",
    cover: "media/bedroom.jpg",
    audio: "media/love-you-stand-in-line.mp3",
    credits: [
      ["written by", "lisa"],
      ["lyrics", "lisa"],
      ["vocals", "lisa"],
      ["guitar", "lisa"],
      ["bass", "lisa"],
      ["piano", "lisa"],
      ["arranged by", "lisa"],
      ["mixed by", "lisa"],
      ["mastered by", "lisa"],
      ["promotion", "nobody. i told no one."],
    ],
    text: [
      "The first song I ever finished. Made alone in my bedroom with a 130 CHF guitar, a Focusrite and an SM58.",
      "I put it on mx3 and told nobody. Two days later, radio LFM found it, played it at prime time and introduced me as a new artist people should discover.",
      "<em>Now imagine what we could make together.</em>",
    ],
    links: [
      ["hear it on radio LFM", "https://www.lfm.ch/podcasts/ici-cest-bien-23-11-2026-1625/"],
      ["mx3", "https://mx3.ch/t/26qj"],
    ],
  },

  {
    id: "all-i-need",
    title: "All I Need",
    tag: "radiohead, by ear",
    year: "",
    tint: "#dde4ea",
    cover: "",
    video: "", // e.g. "media/clips/all-i-need.mp4"
    credits: [
      ["original", "Radiohead"],
      ["taken apart & rebuilt", "lisa"],
    ],
    text: [
      "My favourite game: hear a song, take it apart by ear as fast as I can (chords, inversions, melody, countermelodies), play it back, then jam with it.",
      "This one was worth every minute.",
    ],
    links: [],
  },

  {
    id: "piano-song",
    title: "a song I wrote",
    tag: "just piano & voice",
    year: "",
    tint: "#efe8d8",
    cover: "",
    video: "", // e.g. "media/clips/piano-song.mp4"
    credits: [
      ["written, played & sung", "lisa"],
    ],
    text: [
      "No production, no tricks. Just a piano, my voice and a song I wrote.",
    ],
    links: [],
  },

  {
    id: "boogie",
    title: "boogie after the gig",
    tag: "improvised, 4 hands",
    year: "",
    tint: "#f2e5c4",
    cover: "",
    video: "", // e.g. "media/clips/boogie.mp4"
    credits: [
      ["piano", "lisa & a friend"],
      ["plan", "none whatsoever"],
    ],
    text: [
      "The concert was over, the piano was still there. A friend and I improvised a boogie: nothing planned, just two people having way too much fun.",
    ],
    links: [],
  },

  {
    id: "zombie",
    title: "Zombie",
    tag: "theatre choir for 20",
    year: "",
    tint: "#e3dff0",
    cover: "",
    video: "", // e.g. "media/clips/zombie.mp4"
    credits: [
      ["choir", "lisa"],
      ["voices", "a 20-person theatre ensemble"],
    ],
    text: [
      "I composed the choir for a 20-person theatre ensemble: an adaptation of “Zombie”.",
      "I also wrote an original song for it (video coming).",
    ],
    links: [],
  },

  {
    id: "ceramic-doves",
    title: "Ceramic Doves",
    tag: "keys · 3rd at band-it",
    year: "former band",
    tint: "#e7e1da",
    cover: "media/ceramic-doves.jpg",
    photo: "media/ceramic-doves.jpg",
    credits: [
      ["keys & backing vocals", "lisa"],
      ["band-it 2025", "3rd place"],
      ["band coach", "Moritz von Tobel (VSS Bounce, Vorstadt Sounds)"],
    ],
    text: [
      "My former band. Loud, sweaty, a lot of fun.",
      "We played Openair Greifensee (same bill as Lo & Leduc), Moods, Althörnli Openair, Powerplay Nights and Vorstadt Sounds Festival.",
    ],
    links: [
      ["band-it", "https://www.band-it.ch/band/2025/ceramic-doves"],
      ["ceramic doves", "https://ceramicdoves.ch"],
    ],
  },
];
