import { defineConfig } from "@rosseta/dev"

export default defineConfig({
    // Where to look for your locale declarations
    include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

    // Files to exclude
    exclude: [],

    // The output directory for your locale system
    outdir: "locale"
    
})