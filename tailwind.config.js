/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#f3f4f6",
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#60a5fa",
              },
            },
            h1: { color: "#f3f4f6" },
            h2: { color: "#f3f4f6" },
            h3: { color: "#f3f4f6" },
            h4: { color: "#f3f4f6" },
            h5: { color: "#f3f4f6" },
            h6: { color: "#f3f4f6" },
            strong: { color: "#f3f4f6" },
            code: { color: "#e5e7eb" },
            pre: {
              backgroundColor: "#1f2937",
              color: "#e5e7eb",
              marginTop: "0.25em",
              marginBottom: "0.5em",
            },
            blockquote: {
              color: "#e5e7eb",
              borderColor: "#374151",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
