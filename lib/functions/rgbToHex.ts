async function rgbToHex(r: number, g: number, b: number): Promise<string> {
    const toHex = (value: number): string => {
        const hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const hexR: string = toHex(r);
    const hexG: string = toHex(g);
    const hexB: string = toHex(b);

    return `#${hexR}${hexG}${hexB}`;
}

export { rgbToHex };