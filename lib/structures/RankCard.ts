import { createCanvas, loadImage } from "@napi-rs/canvas";
import { registerFont } from "../functions/registerFont";
import type { RankCardOption } from "../typings/types";
import { colorFetch } from "../functions/colorFetch";
import path from "path";

registerFont("circularstd-black.otf", "circular-std");
registerFont("notosans-jp-black.ttf", "noto-sans-jp");
registerFont("notosans-black.ttf", "noto-sans");
registerFont("notoemoji-bold.ttf", "noto-emoji");
registerFont("notosans-kr-black.ttf", "noto-sans-kr");
registerFont("Chewy-Regular.ttf", "chewy");

const RankCard = async (options: RankCardOption): Promise<Buffer> => {
    options.name = options.name ?? "AikooNee";
    options.level = options.level ?? "3";
    options.color = options.color ?? "auto";
    options.shape = options.shape ?? "circle";
    options.status = options.status ?? "online";
    options.brightness = options.brightness ?? "50";
    options.avatar = options.avatar ?? "https://imgur.com/uNeB2S6.png";
    options.progress = options.progress ?? "50";
    options.rank = options.rank ?? "3";
    options.requiredXp = options.requiredXp ?? "6900";
    options.currentXp = options.currentXp ?? "3000";
    options.showXp = options.showXp ?? true;

    let validatedProgress = parseFloat(options.progress);
    if (isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) {
        throw new Error("Invalid progress parameter, must be between 0 to 100");
    }

    validatedProgress = Math.min(Math.max(validatedProgress, 2), 99);

    const validatedColor = await colorFetch(
        options.color || "ff0000",
        parseInt(options.brightness) || 0,
        options.avatar
    );

    if (options.name.length > 10) options.name = `${options.name.slice(0, 10)}...`;
    if (options.level.length > 10) options.level = `${options.level.slice(0, 10)}...`;
    if (options.rank.length > 5) options.rank = "99999";

    const frame = createCanvas(1280, 450);
    const ctx = frame.getContext("2d");

    const backgroundPath = path.join(__dirname, "./assets/img/background.png");
    const background = await loadImage(backgroundPath);

    ctx.drawImage(background, 0, 0, frame.width, frame.height);

    const avatar = createCanvas(650, 650);
    const av = avatar.getContext("2d");
    const avImg = await loadImage(options.avatar);
    const avSize = Math.min(avImg.width, avImg.height);
    const radius = options.shape === "circle" ? avatar.width / 2 : 45;

    av.beginPath();
    av.moveTo(0 + radius, 0);
    av.arcTo(avatar.width, 0, avatar.width, avatar.height, radius);
    av.arcTo(avatar.width, avatar.height, 0, avatar.height, radius);
    av.arcTo(0, avatar.height, 0, 0, radius);
    av.arcTo(0, 0, avatar.width, 0, radius);
    av.closePath();
    av.clip();

    av.drawImage(avImg, (avImg.width - avSize) / 2, (avImg.height - avSize) / 2, avSize, avSize, 0, 0, avatar.width, avatar.height);
    ctx.drawImage(avatar, 60, 69, 308, 313);

    ctx.beginPath();
    ctx.arc(214, 226, 157, 0, Math.PI * 2, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#2f3136";
    ctx.stroke();

    if (options.shape !== "circle") {
        throw new Error("Status indicator can only be shown if shape is a circle");
    }

    const statusPath = path.join(__dirname, `./assets/img/${options.status}.png`);
    const status = await loadImage(statusPath);

    ctx.beginPath();
    ctx.arc(297 + 70 / 2, 297 + 70 / 2, 70 / 3, 0, Math.PI * 2, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#2f3136";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(297 + 70 / 2, 297 + 70 / 2, 70 / 3, 0, Math.PI * 2, true);
    ctx.fillStyle = "#2f3136";
    ctx.fill();

    ctx.drawImage(status, 297, 297, 70, 70);

    ctx.font = "bold 90px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
    ctx.fillStyle = `#${validatedColor}`;
    ctx.fillText(options.name, 431, 200);

    ctx.font = "bold 60px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
    ctx.fillStyle = "#787878";
    ctx.fillText(options.level, 440, 270);

    const rankFontSize = options.rank.length <= 2 ? 60 :
                         options.rank.length === 3 ? 55 :
                         options.rank.length === 4 ? 50 : 45;

    ctx.font = `bold ${rankFontSize}px chewy`;
    ctx.fillStyle = "#787878";
    ctx.fillText(`#${options.rank}`, 1035 + (5 - options.rank.length) * 10, 250);

    const abbreviateNumber = (value: number): string => {
        const suffixes = ["", "K", "M", "B", "T", "Tr"];
        let suffixNum = 0;
        while (value >= 1000) {
            suffixNum++;
            value /= 1000;
        }
        const shortValue = value % 1 !== 0 ? value.toFixed(1) : value.toString();
        return shortValue + suffixes[suffixNum];
    };

    if (options.showXp) {
        ctx.font = "thin 55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
        ctx.fillStyle = "#787878";
        ctx.fillText("Exp: ", 440, 350);

        ctx.font = "thin 55px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`${abbreviateNumber(Number(options.currentXp))} / ${abbreviateNumber(Number(options.requiredXp))}`, 580, 350);
    }

    ctx.beginPath();
    ctx.arc(1115, 235, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#242323";
    ctx.stroke();

    const angle = (validatedProgress / 100) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(1115, 235, 100, -Math.PI / 2, -Math.PI / 2 + angle, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = `#${validatedColor}`;
    ctx.stroke();

    return frame.toBuffer("image/png");
};

export { RankCard };