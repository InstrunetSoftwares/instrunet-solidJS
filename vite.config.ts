import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import tailwindcss from "@tailwindcss/vite";
import {viteSingleFile} from "vite-plugin-singlefile";
import htmlMinifier from "vite-plugin-html-minifier";
import {webmanifestPlugin} from "@budarin/vite-plugin-webmanifest";

export default defineConfig({
	base: "/",
  plugins: [devtools(), solidPlugin(), tailwindcss(),viteSingleFile({
	  overrideConfig: {
		  base: "/"
	  }
  }), htmlMinifier({
	  minify: true
  }) ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
	  minify: "terser",
  },
});
