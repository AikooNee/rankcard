import { GlobalFonts } from "@napi-rs/canvas";
import path from "path";
import fs from "fs";

function registerFont(fontPath: string, fontName: string): void {
    const rootFontsPath: string = path.join(__dirname, "./assets/fonts", fontPath);
    
    if (fs.existsSync(rootFontsPath)) {
        GlobalFonts.registerFromPath(rootFontsPath, fontName);
    } else {
        const srcFontsPath: string = path.join(__dirname, "./assets/fonts", fontPath);
        
        if (fs.existsSync(srcFontsPath)) {
            GlobalFonts.registerFromPath(srcFontsPath, fontName);
        } else {
            throw new Error(`Font file not found at ${rootFontsPath} or ${srcFontsPath}`);
        }
    }
}

export { registerFont };