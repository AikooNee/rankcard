type RGB = [number, number, number];

async function adjustBrightness(r: number, g: number, b: number, adjustment: number): Promise<RGB> {
    const adjustedR = Math.max(0, Math.min(255, r + adjustment));
    const adjustedG = Math.max(0, Math.min(255, g + adjustment));
    const adjustedB = Math.max(0, Math.min(255, b + adjustment));

    return [adjustedR, adjustedG, adjustedB];
}

export { adjustBrightness };