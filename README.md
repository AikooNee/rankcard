# rankcard

Transform your rank cards into works of art with rankcard!

```
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
        requiredXp: '4900',
        currentXp: '1600',
        showXp: true,
        shape: 'square' // circle
}).then(b => {
    fs.writeFileSync("rankcard.png", b);
});
 ```
 Preview: 

  ![RankCard](https://imgur.com/xcAZzj2.png)
