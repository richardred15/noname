class FireEnchant extends Enchant {
    constructor(level) {
        super(level);
        this.display_name = "Fire Enchant";
        this.image = images.fire_book;
    }

    calculateDamage(damage) {
        return super.calculateDamage(damage + (0.5 * ((this.level * 200) / updateTime)));
    }

    apply(damage, victim, attacker) {
        victim.burn(this.level * 200);
        return super.apply(damage, victim, attacker);
    }
}