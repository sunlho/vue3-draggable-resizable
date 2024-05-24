import { defineConfig } from "vite"
import path from "path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      root: ".",
      insertTypesEntry: false,
      outDir: "dist/types",
      exclude: ["**/node_modules/**"],
      tsconfigPath: "tsconfig.lib.json",
      beforeWriteFile: (filePath, content) => {
        const origin = path.resolve(__dirname, "dist/types/packages")
        const replaceVal = path.resolve(__dirname, "dist/types")
        const newFilepath = filePath.replace(origin, replaceVal)
        return { filePath: newFilepath, content }
      },
    }),
  ],
  build: {
    lib: {
      entry: "packages/index.ts",
      name: "index",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
})
