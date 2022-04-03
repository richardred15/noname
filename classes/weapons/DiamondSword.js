class DiamondSword extends Weapon {
    constructor(dmg = 40) {
        super(dmg);
        this.image = images.diamond_sword;
        this.enchanted_image = images.enchanted_sword;
        this.glowColor = "rgb(0,145,187)";
        this.enchantable = true;
    }

    render(x, y, w, h, still) {
        super.render(x, y, w, h, still);
        if (fancy_graphics) {
            drawingContext.shadowBlur = 0;
        }
    }
}