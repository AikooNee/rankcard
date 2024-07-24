const { registerFont } = require("../functions/registerFont");
const { colorFetch } = require("../functions/colorFetch");
const { loadImage } = require("@napi-rs/canvas");
const canvas = require("@napi-rs/canvas");
const path = require("path");

registerFont("circularstd-black.otf", "circular-std");
registerFont("notosans-jp-black.ttf", "noto-sans-jp");
registerFont("notosans-black.ttf", "noto-sans");
registerFont("notoemoji-bold.ttf", "noto-emoji");
registerFont("notosans-kr-black.ttf", "noto-sans-kr");
registerFont("Chewy-Regular.ttf", "chewy");

const RankCard = async (options) => {
    if (!options.name) options.name = "AikooNee";
    if (!options.level) options.level = "3";
    if (!options.color) options.color = "auto";
    if (!options.shape) options.shape = "circle";
    if (!options.status) options.status = "online";
    if (!options.brightness) options.brightness = "50";
    if (!options.avatar) options.avatar = "https://imgur.com/L09Pk3D.png";
    if (!options.progress) options.progress = "50";
    if (!options.rank) options.rank = "3";
    if (!options.requiredXp) options.requiredXp = "6900";
    if (!options.currentXp) options.currentXp = "3000";
    if (!options.showXp) options.showXp = true;

    let validatedProgress = parseFloat(options.progress);
    if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error("Invalid progress parameter, must be between 0 to 100");

    if (validatedProgress < 2) validatedProgress = 2;
    if (validatedProgress > 99) validatedProgress = 99;

    const validatedColor = await colorFetch(
        options.color || "ff0000",
        parseInt(options.brightness) || 0,
        options.avatar
    );

    if (options.name.length > 10) options.name = `${options.name.slice(0, 10)}...`;
    if (options.level.length > 10) options.level = `${options.level.slice(0, 10)}...`;
    if (options.rank.length > 5) options.rank = "99999";

    const frame = canvas.createCanvas(1280, 450);
    const ctx = frame.getContext("2d");

    let backgroundPath = path.join(__dirname, "../../assets/img/background.png");
    let background = await canvas.loadImage(backgroundPath);

    ctx.drawImage(background, 0, 0, frame.width, frame.height);

    const av = canvas.createCanvas(650, 650);
    const avCtx = av.getContext("2d");
    const avImg = await loadImage(options.avatar);
    const avSize = Math.min(avImg.width, avImg.height);
    const avX = (avImg.width - avSize) / 2;
    const avY = (avImg.height - avSize) / 2;

    const cornerRadius2 = options.shape === "circle" ? av.width / 2 : 45;

    avCtx.beginPath();
    avCtx.moveTo(0 + cornerRadius2, 0);
    avCtx.arcTo(av.width, 0, av.width, av.height, cornerRadius2);
    avCtx.arcTo(av.width, av.height, 0, av.height, cornerRadius2);
    avCtx.arcTo(0, av.height, 0, 0, cornerRadius2);
    avCtx.arcTo(0, 0, av.width, 0, cornerRadius2);
    avCtx.closePath();
    avCtx.clip();

    avCtx.drawImage(avImg, avX, avY, avSize, avSize, 0, 0, av.width, av.height);
    ctx.drawImage(av, 60, 69, 308, 313);

    ctx.beginPath();
    ctx.arc(214, 226, 157, 0, Math.PI * 2, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#2f3136";
    ctx.stroke();

    if (options.shape !== "circle") {
        throw new Error("Status indicator can only be show if shape is a circle");
    }
    
    let statusPath = path.join(__dirname, `../../assets/img/${options.status}.png`);
    let status = await loadImage(statusPath);

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

    if (options.rank.length == 1) {
        ctx.font = "bold 60px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`#${options.rank}`, 1080, 250);
    } else if (options.rank.length == 2) {
        ctx.font = "bold 60px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`#${options.rank}`, 1060, 250);
    } else if (options.rank.length == 3) {
        ctx.font = "bold 60px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`#${options.rank}`, 1050, 250);
    } else if (options.rank.length == 4) {
        ctx.font = "bold 55px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`#${options.rank}`, 1040, 250);
    } else if (options.rank.length == 5) {
        ctx.font = "bold 50px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`#${options.rank}`, 1035, 250);
    }

    const abbreviateNumber = (value) => {
        const suffixes = ["", "K", "M", "B", "T", "Tr"];
        let suffixNum = 0;
        while (value >= 1000) {
            suffixNum++;
            value /= 1000;
        }
        let shortValue = value;
        if (shortValue % 1 !== 0) {
            shortValue = shortValue.toFixed(1);
        }
        if (suffixNum > 0) {
            shortValue += suffixes[suffixNum];
        }
        return shortValue;
    };

    if (options.showXp) {
        ctx.font = "thin 55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
        ctx.fillStyle = "#787878";
        ctx.fillText("Exp: ", 440, 350);

        ctx.font = "thin 55px chewy";
        ctx.fillStyle = "#787878";
        ctx.fillText(`${abbreviateNumber(`${options.currentXp}`)} / ${abbreviateNumber(`${options.requiredXp}`)}`, 580, 350);
    }

    ctx.beginPath();
    ctx.arc(1115, 235, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#242323";
    ctx.stroke();

    const progress = validatedProgress;
    const angle = (progress / 100) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(1115, 235, 100, -Math.PI / 2, -Math.PI / 2 + angle, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = `#${validatedColor}`;
    ctx.stroke();

    return frame.toBuffer("image/png");
};

module.exports = { RankCard };