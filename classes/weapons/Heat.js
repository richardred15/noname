class Heat extends Weapon {
    constructor(dmg = 0) {
        super(dmg);
    }

    strike(victim, attacker) {
        victim.burn(this.cooldown);
        return super.strike(victim, attacker);
    }
}