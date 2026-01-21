/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        buzzbg: "#080834",
        buzzpanel: "#3a3a7e",
        buzzborder: "#343471",
      },
      boxShadow: {
        buzz: "0px 9px 5px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        buzz: "20px",
      },
      fontFamily: {
        luckiest: ['"Luckiest Guy"', "system-ui", "sans-serif"],
        bitter: ['"Bitter"', "serif"],
      },
    },
  },
  plugins: [],
};

