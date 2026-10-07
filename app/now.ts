// What you're listening to and reading. Edit these and save — the landing page updates.
//
// Covers: put images in /public/now/ and point `cover` at them (e.g. "/now/trying-things.jpg").
// Set `cover` to null to show a simple typographic cover instead.

export const listening = {
  title: "Trying Things",
  artist: "Odeal",
  cover: "/now/trying-things.jpg" as string | null,
  href: "https://open.spotify.com/search/Odeal%20Trying%20Things",
  note: "",
};

export const reading = {
  title: "7 Ensayos",
  author: "José Carlos Mariátegui",
  cover: "/now/siete-ensayos.jpg" as string | null,
  href: "https://openlibrary.org/search?q=Siete+ensayos+de+interpretaci%C3%B3n+de+la+realidad+peruana",
  meta: "",
};

// Location shown in the top bar, used for local time and weather.
export const place = {
  label: "NYC",
  timeZone: "America/New_York",
  latitude: 40.6782, // Brooklyn
  longitude: -73.9442,
};
