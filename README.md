# rankcard

Make your rank cards stand out with rankcard!

```bash
npm install rankcard
```

## First Example

```js
const { RankCard } = require("rankcard");
const fs = require("fs");

const rankcard = RankCard({
    name: "AikooNee",
    level: "Level 7",
    color: "auto",
    brightness: "50", // 0 to 100
    avatar: "https://imgur.com/L09Pk3D.png",
    progress: "33",
    rank: "1",
    requiredXp: "4900",
    currentXp: "1600",
    showXp: true,
    shape: "circle" // square
}).then(b => {
    fs.writeFileSync("rankcard.png", b);
});
```

## Second Example

```js
const { AttachmentBuilder } = require("discord.js");
const { RankCard } = require("rankcard");

const rankcard = await RankCard({
    name: "AikooNee",
    level: "Level 7",
    color: "auto",
    brightness: "50", // 0 to 100
    avatar: "https://imgur.com/L09Pk3D.png",
    progress: "33",
    rank: "1",
    requiredXp: "4900",
    currentXp: "1600",
    showXp: true,
    shape: "circle" // square
});

const attachment = new AttachmentBuilder(rankcard, { name: "rankcard.png" });
```

Preview:

![RankCard](https://imgur.com/L09Pk3D.png)
