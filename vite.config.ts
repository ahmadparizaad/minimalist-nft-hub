import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Define base path - useful for subdirectory hosting
    base: '/',
    
    // Server configuration
    server: {
      host: "::",
      port: 8080,
      // Proxy API requests in development
      proxy: mode === 'development' ? {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      } : undefined,
    },
    
    // Plugins
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    
    // Path aliases
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // Build options
    build: {
      // Output directory
      outDir: 'dist',
      // Optimize chunks
      chunkSizeWarningLimit: 1000,
      // Minify options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Source maps
      sourcemap: mode !== 'production',
    },
    
    // Define global variables
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV || mode),
    }
  };
});
