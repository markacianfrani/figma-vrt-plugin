import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
	  emptyOutDir: true,
	  rollupOptions: {
		  input: {
			  app: 'live.html'
		  }
	  }
  }
});