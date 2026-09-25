// Number of photos in each folder.
// Change these numbers to match your collections.
const photoCounts = [7, 6, 6];

const photos = photoCounts.map((count, sectionIndex) =>
  Array.from({ length: count }, (_, imageIndex) => {
    const folder = sectionIndex + 1;
    const number = imageIndex + 1;
    const path = `images/${folder}/${number}.jpg`;

    return {
      url: path,
      thumb: path,
      title: "",
      alt: `Collection ${folder}, photograph ${number}`,
      photographer: "",
      source: ""
    };
  })
);