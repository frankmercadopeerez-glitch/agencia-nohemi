/**
 * Tailwind config — Dunas & Olas (build estático, reemplaza el CDN).
 *
 * RECOMPILAR el CSS cada vez que se agreguen/cambien clases de Tailwind en el HTML o JS:
 *   npx tailwindcss@3 -i src/tailwind-input.css -o css/tailwind.css --minify
 *
 * El archivo generado es css/tailwind.css (ese sí se sube a producción).
 */
module.exports = {
  content: ['./*.html', './en/**/*.html', './blog/**/*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        blue: { 50:"#F3EFFA",100:"#E6DCF2",200:"#CDB8E5",300:"#B194D8",400:"#9B7BC9",500:"#7C5BA6",600:"#5B3A82",700:"#3F2761",800:"#34204F",900:"#2A1A40" },
        yellow: { 50:"#FBF6E8",100:"#F5EBC9",200:"#EAD68E",300:"#DEC065",400:"#D4AE45",500:"#C9A227",600:"#A9871F",700:"#8A6D19",800:"#6B5413",900:"#4D3D0E" },
      },
    },
  },
};
