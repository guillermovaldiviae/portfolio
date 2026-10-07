// Photos in the landing page collage, in order. Files live in /public/about/collage/.
// Add, remove or reorder entries here. `width` and `height` are the photo's real size in
// pixels: the collage uses them to show every photo uncropped, with each row filling the screen.

export type CollagePhoto = { src: string; width: number; height: number; caption: string; alt: string };

export const collage: CollagePhoto[] = [
  { src: "/about/collage/cusco-market.jpg", width: 1600, height: 1067, caption: "San Blas market, Cusco", alt: "Guillermo laughing with a friend at the San Blas market in Cusco, Peru" },
  { src: "/about/collage/page-arizona.jpg", width: 1000, height: 1250, caption: "Page, Arizona", alt: "Red desert and sagebrush under a deep blue sky with a daytime moon near Page, Arizona" },
  { src: "/about/collage/machu-picchu.jpg", width: 1600, height: 1067, caption: "Machu Picchu", alt: "Guillermo smiling in front of Huayna Picchu at Machu Picchu" },
  { src: "/about/collage/paracas.jpg", width: 1600, height: 1067, caption: "Paracas", alt: "Guillermo from behind, walking toward the ocean along the Paracas coastline" },
  { src: "/about/collage/mexico-city.jpg", width: 1600, height: 1067, caption: "Mexico City", alt: "Guillermo mid-conversation with friends on a busy street in Mexico City, shot on film" },
  { src: "/about/collage/primrose-hill.jpg", width: 1000, height: 1250, caption: "Primrose Hill, London", alt: "View of the London skyline at dusk from the top of Primrose Hill" },
  { src: "/about/collage/miraflores.jpg", width: 1600, height: 1067, caption: "Miraflores, Lima", alt: "Guillermo and a friend in front of the mosaic walls of Parque del Amor in Lima" },
];
