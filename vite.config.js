import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        category: resolve(__dirname, "src/category.html"),
         blog: resolve(__dirname, 'src/blog.html'),
        search: resolve(__dirname, 'src/search.html'),
        about: resolve(__dirname, 'src/aboutUs_contact.html'),
        recipes: resolve(__dirname, 'src/recipes/recipes.html'),
      },
    },
  },
});
