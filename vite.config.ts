import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import tailwindcss from "@tailwindcss/vite";
import {webmanifestPlugin} from "@budarin/vite-plugin-webmanifest";
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss(), webmanifestPlugin(), viteSingleFile()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
