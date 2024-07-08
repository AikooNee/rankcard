# rankcard

Make your rank cards stand out with rankcard!

```bash
npm install rankcard
```

## Example

```js
const { RankCard } = require("rankcard");
const fs = require("fs");

const rankcard = RankCard({
    name: "AikooNee",
    level: "Level 7",
    color: "auto",
    brightness: "50", // 0 to 100
    avatar: "https://imgur.com/D3fPXyK.png",
    progress: "33",
    rank: "1",
    requiredXp: "4900",
    currentXp: "1600",
    showXp: true,
    shape: "square" // circle
}).then(b => {
    fs.writeFileSync("rankcard.png", b);
});
```

## Advanced Usage

```js
const { AttachmentBuilder } = require("discord.js");
const { RankCard } = require("rankcard");

const card = await RankCard({
    name: "AikooNee",
    level: "Level 7",
    color: "auto",
    brightness: "50", // 0 to 100
    avatar: "https://imgur.com/D3fPXyK.png",
    progress: "33",
    rank: "1",
    requiredXp: "4900",
    currentXp: "1600",
    showXp: true,
    shape: "square" // circle
});

const attachment = new AttachmentBuilder(card, { name: "rankcard.png" });
```

Preview:

![RankCard](https://imgur.com/xcAZzj2.png)