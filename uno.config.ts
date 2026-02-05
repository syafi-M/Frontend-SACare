import { defineConfig, presetWind4, presetIcons } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(), // mirip Tailwind
    presetIcons({
      scale: 1.2,
      warn: true,
      cdn: "https://esm.sh/",
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': '1.2em',
        'height': '1.2em',
      },
    }),
  ],
});
