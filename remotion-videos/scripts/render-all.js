const { execSync } = require("child_process");
const path = require("path");

const entryPoint = path.join(__dirname, "..", "src", "index.js");
const outDir = path.join(__dirname, "..", "out");

// Render book promo
console.log("Rendering BookPromo...");
execSync(
  `npx remotion render "${entryPoint}" BookPromo "${path.join(outDir, "book-promo.mp4")}"`,
  { stdio: "inherit" }
);

// Render all 24 Scripture clips
for (let day = 1; day <= 24; day++) {
  const id = `ScriptureClip-Day${day}`;
  const outFile = path.join(outDir, `scripture-clip-day${day}.mp4`);
  console.log(`Rendering ${id}...`);
  execSync(`npx remotion render "${entryPoint}" ${id} "${outFile}"`, {
    stdio: "inherit",
  });
}

console.log("All videos rendered to out/ directory.");
