import { getColorFromURL } from "rc-color";
import { rgbToHex } from "./rgbToHex";
import { adjustBrightness } from "./adjustBrightness";

async function colorFetch(color: string, brightness: number, thumbnail: string): Promise<string> {
    if (color === "auto") {
        try {
            const dominantColor: [number, number, number] = await getColorFromURL(thumbnail);

            const [red, green, blue] = dominantColor;

            const adjustedPalette: [number, number, number] = await adjustBrightness(red, green, blue, brightness);
            const hexColor: string = await rgbToHex(...adjustedPalette);

            return hexColor.replace("#", "");
        } catch {
            return "03fc7f";
        }
    } else {
        return color.replace("#", "");
    }
}

export { colorFetch };