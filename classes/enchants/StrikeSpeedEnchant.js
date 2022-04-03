class StrikeSpeedEnchant extends Enchant {
    constructor(level) {
        super(level);
        this.display_name = "Strike Speed Enchant";
        this.image = images.strike_speed_book;
    }

    calculateDamage(damage) {
        return super.calculateDamage(damage * 2);
    }

    apply(damage, victim, attacker) {
        attacker.weapon.current_cooldown /= 2;
        return super.apply(damage, victim, attacker);
    }
}