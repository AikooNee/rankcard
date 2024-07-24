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
    shape: "circle", // square
    // Optional status: "dnd", // online, dnd, offline, idle, streaming
    brightness: "50", // 0 to 100
    avatar: "https://imgur.com/uNeB2S6.png",
    progress: "33",
    rank: "1",
    requiredXp: "4900",
    currentXp: "1600",
    showXp: true
}).then(b => {
    fs.writeFileSync("rankcard.png", b);
console.log("Done!")
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
    shape: "circle", // square
    // Optional status: "dnd", // online, dnd, offline, idle, streaming
    brightness: "50", // 0 to 100
    avatar: "https://imgur.com/uNeB2S6.png",
    progress: "33",
    rank: "1",
    requiredXp: "4900",
    currentXp: "1600",
    showXp: true
});

const attachment = new AttachmentBuilder(rankcard, { name: "rankcard.png" });
```

Preview:

![RankCard](https://imgur.com/wFNKzLc.png)