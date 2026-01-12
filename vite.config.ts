import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import tailwindcss from "@tailwindcss/vite";
import {viteSingleFile} from "vite-plugin-singlefile";
import htmlMinifier from "vite-plugin-html-minifier";

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss(),viteSingleFile(), htmlMinifier({
	  minify: true
  }), ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
	  minify: "terser",
  },
});
