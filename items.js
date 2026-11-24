/* ==========================================================================
   ✎ THE THINGS IN THE STRIP
   --------------------------------------------------------------------------
   Every entry below becomes one card in the strip at the bottom of the page.
   Click a card → it goes onto the stage (middle), its story shows on the
   right, and the whole page takes on its colour ("tint").

   Like a cassette, the strip has two sides:
     side A  the real work          (no "side" field needed)
     side B  outtakes & silly stuff (write  side: "B")

   Fields:
     id       short name, used in the link (…/music/#all-i-need)
     title    big title
     tag      small grey label next to the title
     year     shown above the title
     tint     background colour of the page while this card is selected
     cover    image for the card (leave "" for a typographic card)
     audio    an mp3                 → plays on the cassette
     video    an mp4                 → plays on the stage
     photos   one or more pictures   → shown on the stage
              (no audio/video/photos → the card says "coming soon")
     credits  list of [role, who]
     text     list of paragraphs (simple HTML like <em> or <a> is fine)
     links    list of [label, url]

   To add a clip: put the file into media/clips/ and write its path
   into "video", e.g.  video: "media/clips/all-i-need.mp4"
   Phone videos are big: shrink them first (see the README).
   ========================================================================== */

const ITEMS = [

  /* ------------------------------ SIDE A ------------------------------ */

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
      "The first song I ever finished. I wrote it, played every instrument, recorded, mixed and mastered it myself, in my bedroom.",
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
    cover: "media/clips/all-i-need.jpg",
    video: "media/clips/all-i-need.mp4",
    credits: [
      ["original", "Radiohead"],
      ["taken apart & rebuilt", "lisa"],
    ],
    text: [
      "My favourite game: hear a song, take it apart by ear as fast as I can (chords, inversions, melody, countermelodies), then build it back up, track by track.",
      "Rebuilding a song like this teaches you how it's made, and that's exactly what I bring to yours.",
    ],
    links: [],
  },

  {
    id: "piano-song",
    title: "a song I wrote",
    tag: "just piano & voice",
    year: "",
    tint: "#efe8d8",
    cover: "media/clips/piano-song.jpg",
    video: "media/clips/piano-song.mp4",
    credits: [
      ["written, played & sung", "lisa"],
    ],
    text: [
      "Just a piano, my voice and a song I wrote. Before any production, a song has to work like this.",
    ],
    links: [],
  },

  {
    id: "boogie",
    title: "boogie after the gig",
    tag: "improvised, 4 hands",
    year: "",
    tint: "#f2e5c4",
    cover: "media/clips/boogie.jpg",
    video: "media/clips/boogie.mp4",
    credits: [
      ["piano", "lisa & a friend"],
      ["arrangement", "made up on the spot"],
    ],
    text: [
      "After a concert, a friend and I sat down at the piano and improvised a boogie, four hands, listening to each other. That's what making music together feels like at its best.",
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
    cover: "media/ceramic-doves-band.jpg",
    photos: ["media/ceramic-doves-band.jpg"],
    credits: [
      ["keys & backing vocals", "lisa"],
      ["band-it 2025", "3rd place"],
      ["band coach", "Moritz von Tobel (VSS Bounce, Vorstadt Sounds)"],
      ["photo", "Jeremie Luke Dubois"],
    ],
    text: [
      "My former band: years of rehearsing, writing and playing live together.",
      "We played Openair Greifensee (same bill as Lo & Leduc), Moods, Althörnli Openair, Powerplay Nights and Vorstadt Sounds Festival.",
    ],
    links: [
      ["band-it", "https://www.band-it.ch/band/2025/ceramic-doves"],
      ["ceramic doves", "https://ceramicdoves.ch"],
    ],
  },

  /* ------------------------------ SIDE B ------------------------------ */

  {
    id: "bass",
    side: "B",
    title: "bass, just because",
    tag: "not my main instrument",
    year: "",
    tint: "#dfe3ef",
    cover: "media/clips/bass.jpg",
    video: "media/clips/bass.mp4",
    credits: [
      ["bass", "lisa"],
      ["seriousness", "low"],
    ],
    text: [
      "Piano is home. Everything else is a playground.",
    ],
    links: [],
  },

  {
    id: "drums-fail",
    side: "B",
    title: "drums",
    tag: "it went great (it didn't)",
    year: "",
    tint: "#f0e0da",
    cover: "media/clips/drums-fail.jpg",
    video: "media/clips/drums-fail.mp4",
    credits: [
      ["drums", "lisa, a bit"],
    ],
    text: [
      "I play a bit of drums. This is the bit.",
    ],
    links: [],
  },

  {
    id: "first-drum-kit",
    side: "B",
    title: "my first drum kit",
    tag: "a very early setup",
    year: "",
    tint: "#ece4d6",
    cover: "media/first-drum-kit.jpg",
    photos: ["media/first-drum-kit.jpg"],
    credits: [],
    text: [
      "Every studio starts somewhere.",
    ],
    links: [],
  },

  {
    id: "cellar",
    side: "B",
    title: "a band room in a cellar",
    tag: "self-made",
    year: "",
    tint: "#e4e1da",
    cover: "media/clips/cellar.jpg",
    video: "media/clips/cellar.mp4",
    credits: [
      ["cables", "too many"],
      ["budget", "very small"],
    ],
    text: [
      "A mixer, some speakers, a drum kit and far too many cables: a home-made band room in a cellar, made for jamming.",
    ],
    links: [],
  },

  {
    id: "celery",
    side: "B",
    title: "celery, keyboard, bike",
    tag: "a very important poll",
    year: "",
    tint: "#e5eedc",
    cover: "media/celery-2.jpg",
    photos: ["media/celery-1.jpg", "media/celery-2.jpg", "media/celery-3.jpg"],
    credits: [
      ["problem", "one celery, one MIDI keyboard, one bike"],
      ["solution", "still unclear"],
    ],
    text: [
      "How do you take a celery and a MIDI keyboard home on a bike? I asked the internet.",
    ],
    links: [],
  },

];
