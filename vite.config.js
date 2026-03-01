import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      screens: path.resolve(__dirname, "./src/screens"),
      components: path.resolve(__dirname, "./src/components"),
      routers: path.resolve(__dirname, "./src/routers"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      contexts: path.resolve(__dirname, "./src/contexts"),
      store: path.resolve(__dirname, "./src/store"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
});
