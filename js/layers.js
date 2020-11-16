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
function hasRUpg(id){
    return hasUpgrade("r",id)
}
function getRUpgEff(id){
    return upgradeEffect("r",id)
}
function hasUUpg(id){
    return hasUpgrade("u",id)
}
function getUUpgEff(id){
    return upgradeEffect("u",id)
}
function getPointGen() {
    let gain = new Decimal(0.1)
    if(!canGenPoints()) gain = new Decimal(0)
    if(hasVUpg(12)) gain = gain.mul(getVUpgEff(12))
    if(hasVUpg(13)) gain = gain.mul(getVUpgEff(13))
    if(hasVUpg(21)) gain = gain.mul(getVUpgEff(21))
    gain = gain.mul(layers.i.effect())
    gain = gain.mul(layers.r.effect())
    gain = gain.mul(layers.u.effect())
	return gain
}

addLayer("stat", {
    name: "Statistics", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
              points: new Decimal(0),
    }},
    tooltip() {
      return "Statistics"
    },
    color: "#FFFFFF",
    requires: new Decimal(0.25), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat: [
          "blank",
          ["display-text", function() {return "You have "+format(player.points)+" cases."}],
          "blank", "blank",
          ["display-text", function() {return "You have "+format(player.v.points)+" virus points."}],
          "blank", "blank",
          ["display-text", function() {if (player.i.unlocked) return "You have "+format(player.i.points)+" infectivity."}],
          "blank", "blank",
          ["display-text", function() {if (player.r.unlocked) return "You have "+format(player.r.points)+" replicators."}],
          "blank", "blank",
          ["display-text", function() {
              let base =  new Decimal(2)
              if(hasIUpg(21)) base = base.add(getIUpgEff(21))
              if(hasIUpg(22)) base = base.add(getIUpgEff(22))
              base = base.add(layers.r.effect2())
              if(hasIUpg(21) && hasIUpg(31)) base = base.mul(getIUpgEff(21))
              if(hasIUpg(22) && hasIUpg(32)) base = base.mul(getIUpgEff(22))
              if(hasUUpg(11)) base = base.mul(getUUpgEff(11))
              return "'Infection' base:"+format(base)
            }],
    ],
})

addLayer("v", {
    name: "virus",
    symbol: "V",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            total: new Decimal(0),
            best: new Decimal(0),
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
    update(diff) {
        if (hasMilestone("i", 1)) generatePoints("v", diff);
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("i", 0) && resettingLayer=="i") keep.push("upgrades")
        if (hasMilestone("r", 0) && resettingLayer=="r") keep.push("upgrades")
        if (hasMilestone("u", 0) && resettingLayer=="u") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
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
            description: "Multiply cases gain.",
            cost: new Decimal(5),
            effect(){
                let base = new Decimal(2)
                if(hasIUpg(21)) base = base.add(getIUpgEff(21))
                if(hasIUpg(22)) base = base.add(getIUpgEff(22))
                base = base.add(layers.r.effect2())
                if(hasIUpg(21) && hasIUpg(31)) base = base.mul(getIUpgEff(21))
                if(hasIUpg(22) && hasIUpg(32)) base = base.mul(getIUpgEff(22))
                if(hasUUpg(11)) base = base.mul(getUUpgEff(11))
                if(hasVUpg(23)) base = base.pow(getVUpgEff(23))
                return base
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
                let v13sf = new Decimal("1.8e308")
                v13 = v13.pow(1/2)
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                if(hasIUpg(12)) v13 = v13.pow(getIUpgEff(12))
                if(v13.gte(v13sf)) v13 = v13.mul(v13sf).pow(0.5)
                return v13
            },
            effectDisplay(){
                let v13dis = format(getVUpgEff(13))+"x"
                if (getVUpgEff(13).gte(new Decimal("1.8e308"))) v13dis = v13dis+" (softcapped)"
            return v13dis
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
                if(hasRUpg(23)) v21 = v21.pow(getRUpgEff(23))
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
                if(hasRUpg(31)) v22 = v22.pow(getRUpgEff(31))
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
                let v23 = player.v.upgrades.length
                if(hasRUpg(22)) v23 = Decimal.mul(v23,getRUpgEff(22))
                return v23
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
                if(hasRUpg(12)) v31 = v31.pow(getRUpgEff(12))
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
        best: new Decimal(0),
        total: new Decimal(0),
    unlocked: false,
    total: new Decimal(0)
    }},
    color: "#880435",
    requires: new Decimal("7.8e9"),
    resource: "infectivity",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.08,
    branches: ["v"],
    hotkeys: [
        {
            key:"i", description: "I:Reset for infectivity", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    update(diff) {
        if (hasMilestone("u", 2)) generatePoints("i", diff);
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("u", 0) && resettingLayer=="u") keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    effect(){
        let eff = player.i.points.add(1)
        eff = eff.pow(2)
        return eff
    },
    effectDescription() {
        return "which boost cases gain by "+format(this.effect())
    },
    gainMult() {
        imult = new Decimal(1)
        if (hasIUpg(13)) imult = imult.mul(getIUpgEff(13))
        if (hasIUpg(23)) imult = imult.mul(getIUpgEff(23))
        imult = imult.mul(layers.u.effect())
        return imult
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
    milestones: {
        0: {
            requirementDescription: "500 infectivity",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.i.points.gte(500) }
        },
        1: {
            requirementDescription: "500,000 infectivity",
            effectDescription: "Gain 100% of VP gain per second.",
            done() { return player.i.points.gte(5e5) }
        }
    },
    upgrades: {
        rows: 3,
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
            if (i12.gte(1.35)) i12 = i12.mul(Decimal.pow(1.35,2)).pow(1/3)
            if (i12.gte(2)) i12 = new Decimal(2)
            return i12
            },
            effectDisplay(){
                let i12dis = "^"+format(getIUpgEff(12))
                if (getIUpgEff(12).gte(1.4) && getIUpgEff(12).lt(2)) i12dis = i12dis+" (softcapped)" 
                if (getIUpgEff(12).gte(2)) i12dis = i12dis+" (hardcapped)"
            return i12dis
            },
            unlocked(){
                return hasIUpg(11)
            }
        },
        13: {
            title: "Resistance",
            description: "Multiplier to infectivity based on VP.",
            cost: new Decimal(100),
            effect(){
            let i13 = player.v.points.add(10)
            i13 = Decimal.log10(i13).pow(0.4)
            if (hasIUpg(33)) i13 = i13.pow(getIUpgEff(33))
            return i13
            },
            effectDisplay(){
            return format(getIUpgEff(13))+"x"
            },
            unlocked(){
                return hasIUpg(12)
            }
        },
        21: {
            title: "Susceptible",
            description: "Infectivity increases 'Infection' base.",
            cost: new Decimal("1e3"),
            effect(){
            let i21 = player.i.points.add(1)
            i21 = Decimal.log10(i21).pow(0.5)
            if(hasIUpg(31)) i21 = i21.mul(getIUpgEff(31))
            return i21
            },
            effectDisplay(){
            return "+"+format(getIUpgEff(21))
            },
            unlocked(){
                return hasIUpg(13)
            }
        },
        22: {
            title: "Drug Resistance",
            description: "Cases increase 'Infection' base.",
            cost: new Decimal("3e4"),
            effect(){
            let i22 = player.points.add(1)
            i22 = Decimal.log10(i22).pow(0.2)
            if(hasIUpg(32)) i22 = i22.mul(getIUpgEff(32))
            return i22
            },
            effectDisplay(){
            return "+"+format(getIUpgEff(22))
            },
            unlocked(){
                return hasIUpg(21)
            }
        },
        23: {
            title: "Environmental Hardening",
            description: "Multiplier to infectivity based on cases.",
            cost: new Decimal("15e4"),
            effect(){
            let i23 = player.points.add(10)
            i23 = Decimal.log10(i23).pow(0.3).mul(1.25)
            if (hasIUpg(33)) i23 = i23.pow(getIUpgEff(33))
            return i23
            },
            effectDisplay(){
            return format(getIUpgEff(23))+"x"
            },
            unlocked(){
                return hasIUpg(22)
            }
        },
        31: {
            title: "SUSceptible",
            description: "'Susceptible' is stronger based on replicators and make it add and multiply.",
            cost: new Decimal("5e60"),
            effect(){
            let i31 = player.r.points.add(1)
            i31 = i31.pow(0.78)
            return i31
            },
            effectDisplay(){
            return format(getIUpgEff(31))+"x"
            },
            unlocked(){
                return hasRUpg(32)
            }
        },
        32: {
            title: "Genetic Hardening",
            description: "'Drug Resistance' is stronger based on replicators and make it add and multiply.",
            cost: new Decimal("4.20e69"),
            effect(){
            let i32 = player.r.points.add(1)
            return i32
            },
            effectDisplay(){
            return format(getIUpgEff(32))+"x"
            },
            unlocked(){
                return hasIUpg(31)
            }
        },
        33: {
            title: "Genetic ReShuffle",
            description: "'Resistance' and 'Environmental Hardening' is stronger based on infectivity.",
            cost: new Decimal("7.77e77"),
            effect(){
            let i33 = player.i.points.add(10)
            i33 = Decimal.log10(i33).pow(1/3)
            return i33
            },
            effectDisplay(){
            return "^"+format(getIUpgEff(33))
            },
            unlocked(){
                return hasIUpg(32)
            }
        },
    },
})
addLayer("r", {
    name: "replicators",
    symbol: "R",
    position: 1,
    startData() { return {
        points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    unlocked: false
    }},
    color: "#df34c9",
    requires: new Decimal("1e60"),
    resource: "replicators",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "static",
    exponent: new Decimal(1.7),
    base: new Decimal(1e4),
    branches: ["v"],
    hotkeys: [
        {
            key:"r", description: "R:Reset for replicators", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("u", 0) && resettingLayer=="u") keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    effect(){
        let eff = new Decimal(100)
        if(hasRUpg(11)) eff = eff.mul(getRUpgEff(11))
        if(hasRUpg(13)) eff = eff.mul(getRUpgEff(13))
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).r)
        eff = Decimal.pow(eff,player.r.points)
        return eff
    },
    effect2(){
        let eff2 = player.r.points
        eff2 = eff2.pow(0.75)
        if(hasRUpg(21)) eff2 = eff2.mul(getRUpgEff(21))
        return eff2
    },
    effectDescription() {
        return "which boost cases gain by "+format(this.effect())+" and increasing 'Infection' base by "+format(this.effect2())
    },
    gainMult() {
        rmult = new Decimal(1)
        return rmult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    layerShown() {
        let shown = player.i.total.gte(new Decimal(1))
        if(player.r.unlocked) shown = true
        return shown
    },
    canBuyMax() {
        return hasMilestone("r", 1)
    },
    milestones: {
        0: {
            requirementDescription: "8 replicators",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.r.points.gte(8) }
        },
        1: {
            requirementDescription: "16 replicators",
            effectDescription: "You can buy max replicators.",
            done() { return player.r.points.gte(16) }
        },
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Replication",
            description: "Infectivity boosts replicators 1st effect base.",
            cost: new Decimal(4),
            effect(){
            let r11 = player.i.points.add(10)
            r11 = Decimal.log10(r11).pow(1.2).add(1)
            return r11
            },
            effectDisplay(){
            return format(getRUpgEff(11))+"x"
            },
        },
        12: {
            title: "DNA",
            description: "Replicators boost 'Disease'.",
            cost: new Decimal(5),
            effect(){
            let r12 = player.r.points.add(10)
            r12 = Decimal.log10(r12).pow(1.6).mul(1.65).add(1)
            if(hasRUpg(33)) r12 = r12.pow(getRUpgEff(33))
            return r12
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(12))
            },
            unlocked(){
                return hasRUpg(11)
            }
        },
        13: {
            title: "Attachment",
            description: "VP boosts replicators 1st effect base.",
            cost: new Decimal(7),
            effect(){
            let r13 = player.v.points.add(10)
            r13 = Decimal.log10(r13).pow(0.7).add(1)
            return r13
            },
            effectDisplay(){
            return format(getRUpgEff(13))+"x"
            },
            unlocked(){
                return hasRUpg(12)
            }
        },
        21: {
            title: "Entry",
            description: "VP boosts replicators 2nd effect.",
            cost: new Decimal(12),
            effect(){
            let r21 = player.v.points.add(10)
            r21 = Decimal.log10(r21).pow(0.35).add(1)
            return r21
            },
            effectDisplay(){
            return format(getRUpgEff(21))+"x"
            },
            unlocked(){
                return hasRUpg(13)
            }
        },
        22: {
            title: "Uncoating",
            description: "Cases boost 'More Infections'.",
            cost: new Decimal(13),
            effect(){
            let r22 = player.points.add(10)
            r22 = Decimal.log10(r22).add(10)
            r22 = Decimal.log10(r22).pow(2).div(10).add(1)
            r22 = r22.mul(layers.u.effect2())
            return r22
            },
            effectDisplay(){
            return format(getRUpgEff(22))+"x"
            },
            unlocked(){
                return hasRUpg(21)
            }
        },
        23: {
            title: "Transcription",
            description: "'Self Boost' is stronger based on replicators",
            cost: new Decimal(16),
            effect(){
            let r23 = player.r.points.add(10)
            r23 = Decimal.log10(r23).pow(2.4).add(1)
            return r23
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(23))
            },
            unlocked(){
                return hasRUpg(22)
            }
        },
        31: {
            title: "Synthesis",
            description: "'Contaminate' is stronger based on replicators",
            cost: new Decimal(20),
            effect(){
            let r31 = player.r.points.add(10)
            r31 = Decimal.log10(r31).pow(3.8).add(1)
            return r31
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(31))
            },
            unlocked(){
                return hasRUpg(23)
            }
        },
        32: {
            title: "Virion",
            description: "Unlock a row of infectivity upgrades.",
            cost: new Decimal(21),
            unlocked(){
                return hasRUpg(31)
            }
        },
        33: {
            title: "Release",
            description: "'DNA' is stronger based on cases",
            cost: new Decimal(26),
            effect(){
            let r33 = player.points.add(10)
            r33 = Decimal.log10(r33).add(10)
            r33 = Decimal.log10(r33).pow(0.4).add(1)
            return r33
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(33))
            },
            unlocked(){
                return hasIUpg(33)
            }
        },
    },
})
addLayer("u", {
    name: "uncoaters",
    symbol: "U",
    position: 0,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    unlocked: false
    }},
    color: "#3fa3d3",
    requires: new Decimal("1e117"),
    resource: "uncoaters",
    baseResource: "infectivity",
    baseAmount() { return player.i.points },
    type: "static",
    exponent: new Decimal(1.9),
    base: new Decimal("1e8"),
    branches: ["i","r"],
    hotkeys: [
        {
            key:"u", description: "U:Reset for uncoaters", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    effect(){
        let eff = new Decimal("30")
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).u)
        eff = eff.pow(player.u.points)
        return eff
    },
    effect2(){
        let eff2 = player.u.points.add(10)
        eff2 = Decimal.log10(eff2).pow(3)
        return eff2
    },
    effectDescription() {
        return "which boost cases and infectivity by "+format(this.effect())+", and boosts 'Uncoating' by "+format(this.effect2())
    },
    gainMult() {
        umult = new Decimal(1)
        return umult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    layerShown() {
        let shown = hasIUpg(33)
        if(player.u.unlocked) shown = true
        return shown
    },
    milestones: {
        0: {
            requirementDescription: "3 uncoaters",
            effectDescription: "Keep Infectivity/Replicator milestones on reset.",
            done() { return player.u.points.gte(3) }
        },
        1: {
            requirementDescription: "4 uncoaters",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.u.points.gte(4) }
        },
        2: {
            requirementDescription: "6 uncoaters",
            effectDescription: "Gain 100% of infectivity gain per second.",
            done() { return player.u.points.gte(6) }
        },
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Uncoated Infection",
            description: "Uncoaters boosts 'Infection' base.",
            cost: new Decimal(2),
            effect(){
            let u11 = player.u.points.add(1)
            u11 = u11.pow(4.5)
            return u11
            },
            effectDisplay(){
            return format(getUUpgEff(11))+"x"
            },
        },
        12: {
            title: "Water Transmission",
            description: "'Transmission' softcap starts later based on uncoaters and replicators.",
            cost: new Decimal(3),
            effect(){
            let u12 = layers.u.effect()
            u12 = u12.pow(7.5)
            let rep = player.r.points
            u12 = u12.pow(rep.div(10).add(1))
            return u12
            },
            effectDisplay(){
            return format(getUUpgEff(12))+"x"
            },
        },
        13: {
            title: "Synergy",
            description: "Uncoaters and replicators boost each other .",
            cost: new Decimal(4),
            effect(){
                let u13 = player.u.points.add(1)
                let u13b = player.r.points.add(1)
                u13 = u13.pow(2.2)
                u13b = u13b.pow(0.63)
                return {r:u13, u:u13b}
            },
            effectDisplay(){
            return format(this.effect().r)+"x to replicators base, "+format(this.effect().u)+"x to uncoaters base."
            },
        },
    },
})