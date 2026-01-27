// apps/apps.js
// page: 1 or 2 (or more later)

export const APPS = [
  { id: "phone",      label: "Phone",       iconClass: "phone",      glyph: "phone",      page: 1 },
  { id: "music",      label: "Music",       iconClass: "music",      glyph: "music",      page: 1 },
  { id: "maps",       label: "Maps",        iconClass: "maps",       glyph: "none",       page: 1 },
  { id: "messages",   label: "Messages",    iconClass: "messages",   glyph: "messages",   page: 1 },
  { id: "nowplaying", label: "Now Playing", iconClass: "nowplaying", glyph: "nowplaying", page: 1 },

  { id: "podcasts",   label: "Podcasts",    iconClass: "podcasts",   glyph: "podcasts",   page: 1 },
  { id: "audiobooks", label: "Audiobooks",  iconClass: "audiobooks", glyph: "audiobooks", page: 1 },
  { id: "news",       label: "News",        iconClass: "news",       glyph: "news",       page: 1 },
  { id: "calendar",   label: "Calendar",    iconClass: "calendar",   glyph: "calendar",   page: 1, meta: { day: "Tue", date: "1" } },
  { id: "settings",   label: "Settings",    iconClass: "settings",   glyph: "settings",   page: 1 },

  // Example: assign future apps to page 2 later
  // { id: "future", label: "Future", iconClass: "maps", glyph: "none", page: 2 },
];
