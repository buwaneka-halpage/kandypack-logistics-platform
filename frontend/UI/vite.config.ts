import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          // Split vendor chunks for better caching (client-side only)
          'react-vendor': ['react', 'react-dom', 'react-router', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot', 'class-variance-authority'],
          'chart-vendor': ['recharts'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
    // Increase chunk size warning limit for large dependencies
    chunkSizeWarningLimit: 1000,
  },
  ssr: {
    noExternal: ['recharts', 'leaflet', 'react-leaflet'],
  },
}));