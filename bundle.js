const fs = require('fs');
const path = require('path');

const artDir = "C:\\Users\\Rachit S\\.gemini\\antigravity\\brain\\39c76833-0af9-4eb7-b9fc-39be5ecef848";
const srcDir = "C:\\aegis-platform";

const html = fs.readFileSync(path.join(srcDir, "index.html"), "utf8");
const css = fs.readFileSync(path.join(srcDir, "css", "styles.css"), "utf8");

const scripts = [
  "audio.js", "data.js", "map-engine.js", "cyclone-module.js",
  "flood-module.js", "citizen-module.js", "dispatch-module.js",
  "sandbox-module.js", "broadcast-module.js", "app.js"
];

let inlinedJs = scripts.map(s => {
  return "/* ===== " + s + " ===== */\n" + fs.readFileSync(path.join(srcDir, "js", s), "utf8");
}).join("\n\n");

// Replace stylesheet link with inline style
let bundled = html.replace('<link rel="stylesheet" href="css/styles.css">', '<style>\n' + css + '\n</style>');

// Replace module scripts with inline script
const scriptTagsRegex = /<script src="js\/audio\.js"><\/script>[\s\S]*?<script src="js\/app\.js"><\/script>/;
bundled = bundled.replace(scriptTagsRegex, '<script>\n' + inlinedJs + '\n</script>');

if (!fs.existsSync(artDir)) {
  fs.mkdirSync(artDir, { recursive: true });
}

fs.writeFileSync(path.join(artDir, "aegis_app.html"), bundled, "utf8");
console.log("Successfully generated bundled aegis_app.html, bytes:", bundled.length);
