import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// Note: `@replit/vite-plugin-runtime-error-modal` can be mispackaged —
// load it dynamically below so a bad package export doesn't break startup.

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig(async () => {
  const plugins: any[] = [react(), tailwindcss()];

  // Try to load the Replit runtime error overlay plugin if available.
  try {
    const runtimeModule = await import("@replit/vite-plugin-runtime-error-modal");
    if (runtimeModule && typeof runtimeModule.default === "function") {
      plugins.push(runtimeModule.default());
    } else if (runtimeModule && typeof runtimeModule.runtimeErrorOverlay === "function") {
      plugins.push(runtimeModule.runtimeErrorOverlay());
    }
  } catch (e) {
    // plugin not available or failed to load — continue without it
  }

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const cartographerModule = await import("@replit/vite-plugin-cartographer");
    const devBannerModule = await import("@replit/vite-plugin-dev-banner");

    plugins.push(
      cartographerModule.cartographer({
        root: path.resolve(import.meta.dirname, ".."),
      }),
    );

    plugins.push(devBannerModule.devBanner());
  }

  return {
    base: basePath,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
