/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,php}"],
  dark: "class",
  theme: {
    fontFamily: {
      'Oswald': ["Oswald", "serif"],
      'Poppins': ["Poppins", "serif"],
    },
    extend: {
      colors: {
        transparent: "transparent",
        primary: "#AEFF0D",
        secondary1: "#E8E8E8",
        bgcolor: "#181C14",
        bgcolortwo: "#212832",
        nt10: "#FFFFFF",
        nt20: "#ACACAC",
        nt30: "#000000",
        nt40: "#202020",
        nt50: "#A5A5A5",
        nt60: "#474747",
      },

      backgroundImage: {
        'my-gradient': 'linear-gradient(90deg, #80BCBD 24.99%, #999 85.98%)',
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1296px",
        // "3xl": "1600px",
        // "4xl": "1700px",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },
  // plugins: plugins,
};
