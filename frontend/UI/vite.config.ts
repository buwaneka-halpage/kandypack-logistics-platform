import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter({
      future: {
        v7_dev: true,
        v7_unstable_server_rendering: true,
      },
      // @ts-expect-error - `process.env.VERCEL` is a string, not a boolean
      platform: process.env.VERCEL ? "vercel" : "node",
    }),
    tsconfigPaths(),
  ],
});
