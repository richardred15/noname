class PowerEnchant extends Enchant {
    constructor(level) {
        super(level);
        this.display_name = "Power Enchant";
        this.image = images.power_book;
    }

    calculateDamage(damage) {
        return super.calculateDamage(damage * ((this.level * 0.5) + 1));
    }

    apply(damage, victim, attacker) {
        let d = (super.apply(damage, victim, attacker) * ((this.level * 0.5) + 1));
        return d;
    }
}