import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

console.log(path.resolve(__dirname, "Shared"));
// aliases for the electron side of things
const alias = {
  "~/": `${path.resolve(__dirname, "./")}/`,
  "Shared": `${path.resolve(__dirname, "./Shared")}/`,
  "Electron/": `${path.resolve(__dirname, "./electron")}/`,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.ts",
        vite: {
          resolve: {
            alias,
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, "electron/preload.ts"),
        vite: {
          resolve: {
            alias,
          },
        },
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),
  ],
});
