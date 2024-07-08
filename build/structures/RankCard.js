const path = require('path');
const canvas = require("@napi-rs/canvas");
const { registerFont } = require("../functions/registerFont");
const { loadImage } = require("@napi-rs/canvas");
const { colorFetch } = require("../functions/colorFetch");

registerFont("circularstd-black.otf", "circular-std");
registerFont("notosans-jp-black.ttf", "noto-sans-jp");
registerFont("notosans-black.ttf", "noto-sans");
registerFont("notoemoji-bold.ttf", "noto-emoji");
registerFont("notosans-kr-black.ttf", "noto-sans-kr");
registerFont("Chewy-Regular.ttf", "chewy");

const RankCard = async (options) => {
    if (!options.name) options.name = 'AikooNee';
    if (!options.level) options.level = '3';
    if (!options.color) options.color = 'auto';
    if (!options.brightness) options.brightness = '50';
    if (!options.avatar) options.avatar = 'https://imgur.com/D3fPXyK.png';
    if (!options.progress) options.progress = '50';
    if (!options.rank) options.rank = '3';
    if (!options.requiredXp) options.requiredXp = '6900';
    if (!options.currentXp) options.currentXp = '3000';
    if (!options.showXp) options.showXp = true;
    if (!options.shape) options.shape = 'square';

    let validatedProgress = parseFloat(options.progress);
    if (Number.isNaN(validatedProgress) || validatedProgress < 0 || validatedProgress > 100) throw new Error('Invalid progress parameter, must be between 0 to 100');

    if (validatedProgress < 2) validatedProgress = 2;
    if (validatedProgress > 99) validatedProgress = 99;

    const validatedColor = await colorFetch(
        options.color || 'ff0000',
        parseInt(options.brightness) || 0,
        options.avatar
    );

    if (options.name.length > 10) options.name = `${options.name.slice(0, 10)}...`;
    if (options.level.length > 10) options.level = `${options.level.slice(0, 10)}...`;
    if (options.rank.length > 5) options.rank = `99999`;

    const frame = canvas.createCanvas(1280, 450);
    const ctx = frame.getContext("2d");

    let backgroundPath = path.join(__dirname, "../../build/assets/img/background.png");
    let background = await canvas.loadImage(backgroundPath);

    ctx.drawImage(background, 0, 0, frame.width, frame.height);

    const thumbnailCanvas = canvas.createCanvas(650, 650);
    const thumbnailCtx = thumbnailCanvas.getContext('2d');
    const thumbnailImage = await loadImage(options.avatar);
    const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
    const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
    const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

    const cornerRadius2 = options.shape === 'circle' ? thumbnailCanvas.width / 2 : 45;

    thumbnailCtx.beginPath();
    thumbnailCtx.moveTo(0 + cornerRadius2, 0);
    thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, cornerRadius2);
    thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, cornerRadius2);
    thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
    thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
    thumbnailCtx.closePath();
    thumbnailCtx.clip();

    thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

    ctx.drawImage(thumbnailCanvas, 60, 69, 308, 313);

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
        const suffixes = ['', 'K', 'M', 'B', 'T', 'Tr'];
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
    }

    if (options.showXp) {
        ctx.font = "thin 55px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
        ctx.fillStyle = "#787878";
        ctx.fillText(`Exp: `, 440, 350);

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
}

module.exports = { RankCard };
