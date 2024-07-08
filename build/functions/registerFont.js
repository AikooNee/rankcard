const { GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");
const fs = require("fs");

function registerFont(fontPath, fontName) {
    const rootFontsPath = path.join(__dirname, "../../build/assets/fonts", fontPath);
    if (fs.existsSync(rootFontsPath)) {
        GlobalFonts.registerFromPath(rootFontsPath, fontName);
    } else {
        const srcFontsPath = path.join(__dirname, "../../build/assets/fonts", fontPath);
        if (fs.existsSync(srcFontsPath)) {
            GlobalFonts.registerFromPath(srcFontsPath, fontName);
        } else {
            throw new Error(`Font file not found at ${rootFontsPath} or ${srcFontsPath}`);
        }
    }
}

module.exports = { registerFont };
