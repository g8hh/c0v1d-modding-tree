function hasVUpg(id){
    return hasUpgrade("v",id)
}
function getVUpgEff(id){
    return upgradeEffect("v",id)
}
function hasIUpg(id){
    return hasUpgrade("i",id)
}
function getIUpgEff(id){
    return upgradeEffect("i",id)
}
function getPointGen() {
    let gain = new Decimal(0.1)
    if(!canGenPoints()) gain = new Decimal(0)
    if(hasVUpg(12)) gain = gain.mul(getVUpgEff(12))
    if(hasVUpg(13)) gain = gain.mul(getVUpgEff(13))
    if(hasVUpg(21)) gain = gain.mul(getVUpgEff(21))
    gain = gain.mul(layers.i.effect())
	return gain
}


addLayer("v", {
    name: "virus",
    symbol: "V",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            total: new Decimal(0),
        }
    },
    color: "#777777",
    requires: new Decimal(1),
    resource: "virus points",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if(hasVUpg(22)) mult = mult.mul(getVUpgEff(22))
        if(hasVUpg(31)) mult = mult.mul(getVUpgEff(31))
        if(hasIUpg(11)) mult = mult.mul(getIUpgEff(11))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {
            key:"v", description: "V:Reset for virus points", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Start",
            description: "Gain 0.1 cases/s.",
            cost: new Decimal(1),
            effect(){
                return true
            }
        },
        12: {
            title: "Infection",
            description: "Double cases gain.",
            cost: new Decimal(5),
            effect(){
                let v12 = new Decimal(2)
                if(hasVUpg(23)) v12 = v12.pow(getVUpgEff(23))
                return v12
            },
            effectDisplay(){
                return format(getVUpgEff(12))+"x"
            },
            unlocked(){
                return hasVUpg(11)
            }
        },
        13: {
            title: "Transmission",
            description: "Multiplier to cases based on VP.",
            cost: new Decimal(10),
            effect(){
                let v13 = player.v.points.add(2)
                v13 = v13.pow(1/2)
                if(hasIUpg(12)) v13 = v13.pow(getIUpgEff(12))
                return v13
            },
            effectDisplay(){
                return format(getVUpgEff(13))+"x"
            },
            unlocked(){
                return hasVUpg(12)
            }
        },
        21: {
            title: "Self Boost",
            description: "Multiplier to cases based on cases.",
            cost: new Decimal("20"),
            effect(){
                let v21 = player.points.add(1)
                v21 = Decimal.log10(v21).pow(2).add(2)
                if(hasVUpg(32)) v21 = v21.pow(getVUpgEff(32))
                return v21
            },
            effectDisplay(){
                return format(getVUpgEff(21))+"x"
            },
            unlocked(){
                return hasVUpg(13)
            }
        },
        22: {
            title: "Contaminate",
            description: "Multiplier to VP based on cases.",
            cost: new Decimal("50"),
            effect(){
                let v22 = player.points.add(1)
                v22 = Decimal.log10(v22).add(1)
                if(hasVUpg(33)) v22 = v22.pow(getVUpgEff(33))
                return v22
            },
            effectDisplay(){
                return format(getVUpgEff(22))+"x"
            },
            unlocked(){
                return hasVUpg(21)
            }
        },
        23: {
            title: "More Infections",
            description: "Raise 'Infection' to the number of bought upgrades.",
            cost: new Decimal("1e3"),
            effect(){
                return player.v.upgrades.length
            },
            effectDisplay(){
                return "^"+format(getVUpgEff(23))
            },
            unlocked(){
                return hasVUpg(22)
            }
        },
        31: {
            title: "Disease",
            description: "Multiplier to VP based on VP.",
            cost: new Decimal("2e4"),
            effect(){
                let v31 = player.v.points.add(10)
                v31 = Decimal.log10(v31).pow(1.3)
                return v31
            },
            effectDisplay(){
                return format(getVUpgEff(31))+"x"
            },
            unlocked(){
                return hasVUpg(23)
            }
        },
        32: {
            title: "BOOSTER",
            description: "'Self Boost' is stronger based on VP.",
            cost: new Decimal("1e6"),
            effect(){
                let v32 = player.v.points.add(10)
                v32 = Decimal.log10(v32).pow(0.2)
                return v32
            },
            effectDisplay(){
                return "^"+format(getVUpgEff(32))
            },
            unlocked(){
                return hasVUpg(31)
            }
        },
        33: {
            title: "Food Contamination",
            description: "'Contaminate' is stronger based on cases.",
            cost: new Decimal("1e7"),
            effect(){
                let v33 = player.points.add(10)
                v33 = Decimal.log10(v33).pow(0.15)
                return v33
            },
            effectDisplay(){
                return "^"+format(getVUpgEff(33))
            },
            unlocked(){
                return hasVUpg(32)
            }
        },
    },
    layerShown() {return true}
})

addLayer("i", {
    name: "infectivity",
    symbol: "I",
    position: 0,
    startData() { return {
    points: new Decimal(0),
    unlocked: false
    }},
    color: "#880435",
    requires: new Decimal("7.8e9"),
    resource: "infectivity",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.08,
    branches: ["v"],
    effect(){
        let eff = player.i.points.add(1)
        eff = eff.pow(2)
        return eff
    },
    effectDescription() {
        return "which boost cases gain by "+format(this.effect())
    },
    gainMult() {
        pmult = new Decimal(1)
        return pmult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    layerShown() {
        let shown = player.v.total.gte(new Decimal(1))
        if(player.i.unlocked) shown = true
        return shown
    },
    upgrades: {
        rows: 2,
        cols: 3,
        11: {
            title: "VP Boost",
            description: "Infectivity boosts VP gain.",
            cost: new Decimal(10),
            effect(){
            let i11 = player.i.points.add(1)
            return i11
            },
            effectDisplay(){
            return format(getIUpgEff(11))+"x"
            },
        },
        12: {
            title: "Air Transmission",
            description: "Infectivity boosts 'Transmission'.",
            cost: new Decimal(20),
            effect(){
            let i12 = player.i.points.add(15)
            i12 = Decimal.log10(i12.mul(2)).pow(0.3)
            return i12
            },
            effectDisplay(){
            return "^"+format(getIUpgEff(12))
            },
        },
    },
})
