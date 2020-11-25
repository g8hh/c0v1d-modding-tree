const STATIC_SCALE_STARTS = {
	"2": function() { return new Decimal(2000) },
}

function scaleStaticCost(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
	if (gain.gte(start)) gain = gain.pow(2).div(start);
	return gain;
}

function softcapStaticGain(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
	if (gain.gte(start)) gain = gain.times(start).pow(1/2);
	return gain;
}
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
function hasSUpg(id){
    return hasUpgrade("s",id)
}
function getSUpgEff(id){
    return upgradeEffect("s",id)
}
function hasDUpg(id){
    return hasUpgrade("d",id)
}
function getDUpgEff(id){
    return upgradeEffect("d",id)
}
function getPointGen() {
    let gain = new Decimal(0.1)
    let c22c = challengeCompletions("u", 11)+challengeCompletions("u", 12)+challengeCompletions("u", 21)+challengeCompletions("u", 22)-5
    c22c = Decimal.add(c22c, 1)
    c22c = Decimal.pow(5, c22c)
    if(!canGenPoints()) gain = new Decimal(0)
    if(hasVUpg(12)) gain = gain.mul(getVUpgEff(12))
    if(hasVUpg(13)) gain = gain.mul(getVUpgEff(13))
    if(hasVUpg(21)) gain = gain.mul(getVUpgEff(21))
    gain = gain.mul(layers.i.effect())
    gain = gain.mul(layers.r.effect())
    gain = gain.mul(layers.u.effect())
    gain = gain.mul(layers.d.effect())
    if (player.s.unlocked) gain = gain.mul(tmp.s.severityEff);
    if (inChallenge("u", 22)) gain = Decimal.mul(gain ,c22c)
    if (inChallenge("s", 11)) gain = gain.pow(0.1)
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
        "blank",
        ["display-text", function() {return "You have "+format(player.v.points)+" virus points."}],
        "blank",
        ["display-text", function() {if (player.i.unlocked) return "You have "+format(player.i.points)+" infectivity."}],
        "blank",
        ["display-text", function() {if (player.r.unlocked) return "You have "+formatWhole(player.r.points)+" replicators."}],
        "blank",
        ["display-text", function() {if (player.s.unlocked) return "You have "+formatWhole(player.s.points)+" symptoms."}],
        "blank",
        ["display-text", function() {if (player.s.unlocked) return "You have "+format(player.s.severity)+" severity."}],
        "blank",
        ["display-text", function() {
              let base =  tmp["v"].upgrades[12].base
              return "'Infection' base:"+format(base)
            }],
        "blank",
        ["display-text", function() {
        let eff = tmp["r"].effbase
        if (player.r.unlocked) return "Replicator base:"+format(eff)
        }],
        "blank",
        ["display-text", function() {
        let ueff = tmp["u"].effbase
        if (player.u.unlocked) return "Uncoater base:"+format(ueff)
        }],
        "blank",
        ["display-text", function() {
        let seff = tmp["s"].effbase
        if (player.s.unlocked) return "Symptom base:"+format(seff)
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
        mult = mult.mul(layers.d.effect())
        if (player.s.unlocked) mult = mult.mul(tmp.s.severityEff);
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
        if (hasMilestone("u", 1) && resettingLayer=="u") keep.push("upgrades")
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
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
            },
            effectDisplay() {
                return format(getPointGen()) + "/s"
            }
        },
        12: {
            title: "Infection",
            description: "Multiply cases gain.",
            cost: new Decimal(5),
            base() {
                let base =  new Decimal(2)
                if(hasIUpg(21)) base = base.add(getIUpgEff(21))
                if(hasIUpg(22)) base = base.add(getIUpgEff(22))
                base = base.add(layers.r.effect2())
                if(hasIUpg(21) && hasIUpg(31)) base = base.mul(getIUpgEff(21).max(1))
                if(hasIUpg(22) && hasIUpg(32)) base = base.mul(getIUpgEff(22).max(1))
                if(hasUUpg(11)) base = base.mul(getUUpgEff(11))
                if(hasSUpg(24)) base = base.mul(getSUpgEff(24))
                base = base.mul(layers.s.buyables[23].effect())
                return base
            },
            effect(){
                let eff = this.base()
                let v12sf = new Decimal("e10000")
                if(hasVUpg(23)) eff = eff.pow(getVUpgEff(23))
                if(eff.gte(v12sf)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf)).pow(3/4)).mul(v12sf)
                if (inChallenge("u", 12)) eff = new Decimal(1)
                return eff
            },
            effectDisplay(){
                let v12dis = format(getVUpgEff(12))+"x"
                let v12sf = new Decimal("e10000")
                if (getVUpgEff(12).gte(v12sf)) v12dis = v12dis+" (softcapped)"
                return v12dis
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
                let v13sf2 = new Decimal("1e2370")
                let v13sff = new Decimal(0.5)
                let v13sff2 = new Decimal(0.8)
                v13 = v13.pow(1/2)
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                if(hasUUpg(12)) v13sf2 = v13sf2.mul(getUUpgEff(12)).add(1)
                if (inChallenge("u", 22)) v13sf = new Decimal(1)
                if (inChallenge("u", 22)) v13sf2 = new Decimal(1)
                if (hasChallenge("u", 22)) v13sff = v13sff.pow(challengeEffect("u", 22).pow(-1))
                if (hasChallenge("u", 22)) v13sff2 = v13sff2.pow(challengeEffect("u", 22).pow(-1))
                if(hasIUpg(12)) v13 = v13.pow(getIUpgEff(12))
                if(hasDUpg(14)) v13 = v13.pow(getDUpgEff(14))
                if(v13.gte(v13sf)) v13 = v13.mul(v13sf).pow(v13sff) 
                if(v13.gte(v13sf2)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf2)).pow(v13sff2)).mul(v13sf2)
                }
                return v13  
            },
            effectDisplay(){
                let v13sf = new Decimal("1.8e308")
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                let v13dis = format(getVUpgEff(13))+"x"
                if (getVUpgEff(13).gte(v13sf) || inChallenge("u", 22)) v13dis = v13dis+" (softcapped)"
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
                let v21sf = new Decimal("ee5")
                v21 = Decimal.log10(v21).pow(2).add(2)
                if(hasVUpg(32)) v21 = v21.pow(getVUpgEff(32))
                if(hasRUpg(23)) v21 = v21.pow(getRUpgEff(23))
                if(v21.gte(v21sf)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf)).pow(0.8)).mul(v21sf)
                return v21
            },
            effectDisplay(){
                let v21sf = new Decimal("ee5")
                let v21dis = format(getVUpgEff(21))+"x"
                if (getVUpgEff(21).gte(v21sf)) v21dis = v21dis + " (softcapped)"
                return v21dis
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
        if (hasMilestone("s", 0) && resettingLayer=="s") keep.push("milestones")
        if (hasMilestone("u", 3) && resettingLayer=="u") keep.push("upgrades")
        if (hasMilestone("s", 2) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    effect(){
        let eff = player.i.points.add(1)
        eff = eff.pow(2)
        if (inChallenge("u", 12)) eff = new Decimal(1)
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
        imult = imult.mul(layers.d.effect())
        imult = imult.mul(layers.s.buyables[12].effect())
        if (player.s.unlocked) imult = imult.mul(tmp.s.severityEff);
        return imult
    },
    gainExp() {
        let exp = new Decimal(1)
        if (inChallenge("s", 11)) exp = new Decimal(0.1)
        return exp
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
            if (inChallenge("u", 12)) i11 = new Decimal(1)
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
            let i12sf = new Decimal(1.35)
            i12 = Decimal.log10(i12.mul(2)).pow(0.3)
            if (hasUUpg(21)) i12sf = i12sf.mul(getUUpgEff(21))
            if (i12.gte(i12sf)) i12 = i12.mul(Decimal.pow(i12sf,2)).pow(1/3)
            if (i12.gte(2) && !hasUUpg(21)) i12 = new Decimal(2)
            if (inChallenge("u", 12)) i12 = new Decimal(1)
            return i12
            },
            effectDisplay(){
                let i12dis = "^"+format(getIUpgEff(12))
                let i12sf = new Decimal(1.35)
                if (hasUUpg(21)) i12sf = i12sf.mul(getUUpgEff(21))
                if ((getIUpgEff(12).gte(i12sf) && getIUpgEff(12).lt(2)) || (hasUUpg(21) && getIUpgEff(12).gte(i12sf))) i12dis = i12dis+" (softcapped)" 
                if (getIUpgEff(12).gte(2) && !hasUUpg(21)) i12dis = i12dis+" (hardcapped)"
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
            if (inChallenge("u", 12)) i21 = new Decimal(1)
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
            if (inChallenge("u", 21)) i31 = new Decimal(1)
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
            if (inChallenge("u", 21)) i32 = new Decimal(1)
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
            if (inChallenge("u", 12)) i33 = new Decimal(1)
            if (hasChallenge("u", 12)) i33 = i33.pow(challengeEffect("u", 12))
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
        if (hasMilestone("s", 0) && resettingLayer=="s") keep.push("milestones")
        if (hasMilestone("u", 3) && resettingLayer=="u") keep.push("upgrades")
        if (hasMilestone("s", 2) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    automate() {},
    autoPrestige() { return (hasMilestone("u", 4) && player.u.auto) },
    effbase() {
        let eff = new Decimal(100)
        if(hasRUpg(11)) eff = eff.mul(getRUpgEff(11))
        if(hasRUpg(13)) eff = eff.mul(getRUpgEff(13))
        if(hasSUpg(15)) eff = eff.mul(getSUpgEff(15))
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).r)
        if(hasChallenge("u", 21)) eff = eff.mul(challengeEffect("u", 21))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = Decimal.pow(eff,player.r.points)
        if (inChallenge("u", 21)) eff = new Decimal(1)
        return eff
    },
    effect2(){
        let eff2 = player.r.points
        eff2 = eff2.pow(0.75)
        if(hasRUpg(21)) eff2 = eff2.mul(getRUpgEff(21))
        if(hasUUpg(22)) eff2 = eff2.pow(getUUpgEff(22))
        if (inChallenge("u", 21)) eff2 = new Decimal(0)
        return eff2
    },
    effectDescription() {
        return "which boost cases gain by "+format(this.effect())+" and increasing 'Infection' base by "+format(this.effect2())
    },
    gainMult() {
        rmult = new Decimal(1)
        if(hasUUpg(14)) rmult = rmult.div(getUUpgEff(14))
        return rmult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    resetsNothing() { return hasMilestone("u", 5) },
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
            if (inChallenge("u", 12)) r11 = new Decimal(1)
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
            if (inChallenge("u", 21)) r12 = new Decimal(1)
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
            if (hasChallenge("u", 22)) r23 = r23.mul(challengeEffect("u", 22))
            if (hasUUpg(24)) r23 = r23.pow(getUUpgEff(24))
            if (inChallenge("u", 21)) r23 = new Decimal(1)
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
            if (inChallenge("u", 21)) r31 = new Decimal(1)
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
        auto: false,
    unlocked: false
    }},
    color: "#3fa3d3",
    requires: new Decimal("1e117"),
    resource: "uncoaters",
    baseResource: "infectivity",
    baseAmount() { return player.i.points },
    type: "static",
    exponent() {
        let exp = new Decimal(3.2)
        return exp
    },
    base() {
        let base = new Decimal("1e10")
        return base
    },
    branches: ["i","r"],
    hotkeys: [
        {
            key:"u", description: "U:Reset for uncoaters", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    effbase() {
        let eff = new Decimal("30")
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).u)
        if(hasSUpg(11)) eff = eff.mul(getSUpgEff(11))
        if(hasSUpg(13)) eff = eff.mul(getSUpgEff(13))
        if(hasDUpg(21)) eff = eff.mul(getDUpgEff(21))
        if (getBuyableAmount("s", 22).gte(1)) eff = eff.mul(layers.s.buyables[22].effect().add(1))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = eff.pow(player.u.points)
        if (inChallenge("u", 11)) eff = new Decimal(1)
        return eff
    },
    effect2(){
        let eff2 = player.u.points.add(10)
        eff2 = Decimal.log10(eff2).pow(3)
        if(hasSUpg(12)) eff2 = eff2.mul(getSUpgEff(12))
        if(hasUUpg(23)) eff2 = eff2.pow(getUUpgEff(23))
        if (inChallenge("u", 11)) eff2 = new Decimal(1)
        return eff2
    },
    effectDescription() {
        return "which boost cases and infectivity by "+format(this.effect())+", and boosts 'Uncoating' by "+format(this.effect2())
    },
    gainMult() {
        umult = new Decimal(1)
        if (hasChallenge("u", 11)) umult = umult.div(challengeEffect("u", 11))
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
    autoPrestige() { return (hasMilestone("d", 2) && player.d.auto) },
    canBuyMax() { return hasMilestone("d", 1)},
    resetsNothing() { return hasMilestone("d", 5) },
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
        3: {
            requirementDescription: "8 uncoaters",
            effectDescription: "Keep Infectivity/Replicator upgrades on reset.",
            done() { return player.u.points.gte(8) }
        },
        4: {
            requirementDescription: "11 uncoaters",
            effectDescription: "Autobuy replicators.",
            toggles: [["u", "auto"]],
            done() { return player.u.points.gte(11) }
        },
        5: {
            requirementDescription: "13 uncoaters",
            effectDescription: "Replicators reset nothing.",
            done() { return player.u.points.gte(13) }
        },
        6: {
            requirementDescription: "15 uncoaters",
            effectDescription: "Unlock uncoater challenges.",
            done() { return player.u.points.gte(15) }
        },
    },
    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title: "Uncoated Infection",
            description: "Best uncoaters boosts 'Infection' base.",
            cost: new Decimal(2),
            effect(){
            let u11 = player.u.best.add(1)
            u11 = u11.pow(4.5)
            if (inChallenge("u", 11)) u11 = new Decimal(1)
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
            if (inChallenge("u", 11)) u12 = new Decimal(1)
            if (inChallenge("u", 21)) u12 = new Decimal(1)
            if (u12.gte(new Decimal("e1500"))) u12 = u12.div(new Decimal("e1500")).pow(0.3).mul(new Decimal("e1500"))
            if (u12.gte(new Decimal("e15000"))) u12 = Decimal.pow(10,u12.div(new Decimal("e1500")).log10().pow(2/3)).mul(new Decimal("e15000"))
            return u12
            },
            effectDisplay(){
                let u12dis = format(getUUpgEff(12))+"x"
                if (this.effect().gte(new Decimal("e1500"))) u12dis = u12dis + " (softcapped)"
                return u12dis
            },
            unlocked(){
                return hasUUpg(11)
            }
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
                if (inChallenge("u", 11)) u13 = new Decimal(1)
                if (inChallenge("u", 21)) u13b = new Decimal(1)
                return {r:u13, u:u13b}
            },
            effectDisplay(){
            return format(this.effect().r)+"x to replicators base, "+format(this.effect().u)+"x to uncoaters base."
            },
            unlocked(){
                return hasUUpg(12)
            }
        },
        14: {
            title: "Genome Replication",
            description: "Cases make replicators cheaper.",
            cost: new Decimal(6),
            effect(){
            let u14 = player.points.add(1)
            u14 = Decimal.log10(u14).pow(0.83)
            u14 = Decimal.pow(10,u14).pow(1.536)
            return u14
            },
            effectDisplay(){
            return format(getUUpgEff(14))+"x"
            },
            unlocked(){
                return hasUUpg(13)
            }
        },
        21: {
            title: "Bird Transmission",
            description: "Remove 'Air Transmission' hardcap and its softcap starts later based on cases.",
            cost: new Decimal(8),
            effect(){
            let u21 = player.points.add(10)
            u21 = Decimal.log10(u21).add(10)
            u21 = Decimal.log10(u21).add(10)
            u21 = u21.pow(0.1).div(1.12)
            return u21
            },
            effectDisplay(){
            return format(getUUpgEff(21))+"x"
            },
            unlocked(){
                return hasUUpg(14)
            }
        },
        22: {
            title: "Viral Proteins",
            description: "Infectivity boosts replicators 2nd effect.",
            cost: new Decimal(10),
            effect(){
            let u22 = player.i.points.add(10)
            u22 = Decimal.log10(u22)
            u22 = u22.pow(0.26).add(0.13)
            if (inChallenge("u", 12)) u22 = new Decimal(1)
            return u22
            },
            effectDisplay(){
            return "^"+format(getUUpgEff(22))
            },
            unlocked(){
                return hasUUpg(21)
            }
        },
        23: {
            title: "Viral Enzymes",
            description: "Infectivity boosts uncoaters 2nd effect.",
            cost: new Decimal(11),
            effect(){
            let u23 = player.i.points.add(10)
            u23 = Decimal.log10(u23)
            u23 = u23.pow(0.0747)
            if (inChallenge("u", 12)) u23 = new Decimal(1)
            return u23
            },
            effectDisplay(){
            return "^"+format(getUUpgEff(23))
            },
            unlocked(){
                return hasUUpg(22)
            }
        },
        24: {
            title: "Endocytosis",
            description: "'Transcription' is stronger based on uncoaters.",
            cost: new Decimal(13),
            effect(){
            let u24 = player.u.points.add(10)
            u24 = Decimal.log10(u24)
            u24 = u24.pow(1.523)
            if (inChallenge("u", 11)) u24 = new Decimal(1)
            return u24
            },
            effectDisplay(){
            return "^"+format(getUUpgEff(24))
            },
            unlocked(){
                return hasUUpg(23)
            }
        },
    },
    challenges: {
        rows: 2,
        cols: 2,
        11: {
            name: "Coated",
            challengeDescription: function() {
                let c11 = "Uncoaters are useless."
                if (inChallenge("u", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("u", 11) == 3) c11 = c11 + " (Completed)"
                c11 = c11 + "<br>Completed:" + challengeCompletions("u",11) + "/" + this.completionLimit
                return c11
            },
            goal(){
                if (challengeCompletions("u", 11) == 0) return new Decimal("e2615");
                if (challengeCompletions("u", 11) == 1) return new Decimal("e2870");
                if (challengeCompletions("u", 11) == 2) return new Decimal("e4865");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Infectivity makes uncoaters cheaper.",
            rewardEffect() {
                 let c11 = player.i.points.add(1)
                 let c11r = new Decimal(1.27)
                 let c11c = challengeCompletions("u", 11)
                 c11c = Decimal.pow(1.2, c11c)
                 c11 = Decimal.log10(c11).pow(0.7)
                 c11 = Decimal.pow(10,c11)
                 c11r = c11r.mul(c11c)
                 c11 = c11.pow(c11r)
                 c11 = c11.pow(layers.s.buyables[13].effect())
                 if (inChallenge("u", 12)) c11 = new Decimal(1)
                 return c11
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasMilestone("u", 6)
            }
        },
        12: {
            name: "Disinfectant",
            challengeDescription: function() {
                let c12 = "Infectivity and 'Infection' are useless."
                if (inChallenge("u", 12)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("u", 12) == 3) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("u",12) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("u", 12) == 0) return new Decimal("e715");
                if (challengeCompletions("u", 12) == 1) return new Decimal("5e2360");
                if (challengeCompletions("u", 12) == 2) return new Decimal("e3435");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Cases boost 'Genetic ReShuffle'.",
            rewardEffect() {
                 let c12 = player.points.add(10)
                 let c12r = new Decimal(1/5)
                 let c12c = challengeCompletions("u", 12)
                 c12c = Decimal.div(c12c, 20)
                 c12r = c12r.add(c12c)
                 c12 = Decimal.log10(c12).add(10)
                 c12 = Decimal.log10(c12).pow(c12r)
                 return c12
            },
            rewardDisplay() {return "^"+format(this.rewardEffect())},
            unlocked(){
                return hasChallenge("u", 11)
            }
        },
        21: {
            name: "Unreplicated",
            challengeDescription: function() {
                let c21 = "Replicators are useless."
                if (inChallenge("u", 21)) c21 = c21 + " (In Challenge)"
                if (challengeCompletions("u", 21) == 3) c21 = c21 + " (Completed)"
                c21 = c21 + "<br>Completed:" + challengeCompletions("u",21) + "/" + this.completionLimit
                return c21
            },
            goal(){
                if (challengeCompletions("u", 21) == 0) return new Decimal("e3710");
                if (challengeCompletions("u", 21) == 1) return new Decimal("e5725");
                if (challengeCompletions("u", 21) == 2) return new Decimal("e6910");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Cases boost replicators 1st effect base.",
            rewardEffect() {
                 let c21 = player.points.add(10)
                 let c21r = new Decimal(0.5)
                 let c21c = challengeCompletions("u", 21)
                 c21c = Decimal.div(c21c, 2)
                 c21r = c21r.add(c21c)
                 c21 = Decimal.log10(c21).pow(c21r)
                 return c21
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("u", 12)
            }
        },
        22: {
            name: "Masks",
            challengeDescription: function() {
                let c22 = "'Transmission' softcap starts instantly and 'Coated' and 'Disinfectant' are applied at once. Cases gain is multiplied by 5^(total challenge completions-4)"
                if (inChallenge("u", 22)) c22 = c22 + " (In Challenge)"
                if (challengeCompletions("u", 22) == 3) c22 = c22 + " (Completed)"
                c22 = c22 + "<br>Completed:" + challengeCompletions("u",22) + "/" + this.completionLimit
                return c22
            },
            goal(){
                if (challengeCompletions("u", 22) == 0) return new Decimal("e14");
                if (challengeCompletions("u", 22) == 1) return new Decimal("3e19");
                if (challengeCompletions("u", 22) == 2) return new Decimal("3e21");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            countsAs: [11, 12],
            rewardDescription: "VP boosts 'Transcription' and makes 'Transmission' softcap weaker.",
            rewardEffect() {
                 let c22 = player.v.points.add(10)
                 let c22r = new Decimal(0.15)
                 let c22c = challengeCompletions("u", 22)
                 c22c = Decimal.div(c22c, 20)
                 c22r = c22r.add(c22c)
                 c22 = Decimal.log10(c22).add(10)
                 c22 = Decimal.max(Decimal.log10(c22).pow(c22r).div(1.15),1)
                 return c22
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("u", 21)
            }
        },
    },
})
addLayer("s", {
    name: "symptoms",
    symbol: "S",
    position: 1,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        auto: false,
        severity: new Decimal(0),
        recoveries: new Decimal(0),
        time: new Decimal(0),
    unlocked: false
    }},
    color: "#5ad93f",
    requires: new Decimal("e10310"),
    resource: "symptoms",
    baseResource: "infectivity",
    baseAmount() { return player.i.points },
    type: "static",
    exponent: new Decimal(1.99),
    base: new Decimal("1e570"),
    branches: ["i","r","u"],
    hotkeys: [
        {
            key:"s", description: "S:Reset for symptoms", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    autoPrestige() { return (hasMilestone("d", 7) && player.d.autos) },
    effbase() {
        let eff = new Decimal("123")
        eff = eff.mul(layers.s.buyables[21].effect())
        if (hasDUpg(11)) eff = eff.mul(getDUpgEff(11))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = eff.pow(player.s.points).sub(1)
        if (hasSUpg(14)) eff = eff.mul(getSUpgEff(14))
        if (hasSUpg(32)) eff = eff.mul(getSUpgEff(32))
        eff = eff.mul(layers.s.buyables[11].effect())
        eff = eff.mul(layers.d.effect())
        if (player.s.severity.gte(new Decimal("1.8e308"))) eff = eff.div(tmp.s.recoveryEff)
        return eff
    },
    recoveryGain() {
        let s = player.s.severity
        let recov = (s.add(10)).log10().div(308.254).pow(40)
        if (s.gte(new Decimal("e1000"))) recov = recov.pow(s.log10().sub(999).pow(0.3))
        return recov
    },
    recoveryEff() {
        let s = player.s.severity
        let recov = player.s.recoveries.add(1)
        recov = Decimal.log10(recov).add(1).pow(40)
        if (s.gte(new Decimal("e1000"))) recov = recov.pow(s.log10().sub(999).pow(0.15)).pow(recov.log10().pow(0.08))
        return recov
    },
    effectDescription() {
        let desc = "which produces " + format(this.effect()) + " severity "
        if (player.s.severity.gte(new Decimal("1.8e308"))) desc = desc + "and " + format(this.recoveryGain()) + " recoveries"
        desc = desc + " per second."
        return desc
    },
    severityEff() {
        let seff = player.s.severity.add(1)
        seff = seff.pow(6)
        if (hasSUpg(21)) seff = seff.pow(getSUpgEff(21))
        if (inChallenge("s", 11)) seff = new Decimal(1)
        return seff
    },
    update(diff) {
        if (player.s.unlocked) player.s.severity = player.s.severity.add(tmp.s.effect.times(diff));
        if (player.s.severity.gte(new Decimal("1.8e308"))) player.s.recoveries = player.s.recoveries.add(tmp.s.recoveryGain.times(diff));
            player.s.time = Decimal.add(player.s.time, diff)
            if (player.s.time.gte(1)) {
                let times = Decimal.floor(player.s.time).mul(-1)
                player.s.time = Decimal.add(player.s.time, times)
                times = times.mul(-1)
                if (hasMilestone("d", 4) && player.d.autob) {
                    layers.s.buyables[11].buyMax(times.mul(10))
                    layers.s.buyables[12].buyMax(times.mul(10))
                    layers.s.buyables[13].buyMax(times.mul(10))
                    layers.s.buyables[21].buyMax(times.mul(10))
                    layers.s.buyables[22].buyMax(times.mul(10))
                    layers.s.buyables[23].buyMax(times.mul(10))
                }
            };
    },
    tabFormat: ["main-display",
    "prestige-button",
    "blank",
    ["display-text",
        function() {return 'You have ' + format(player.s.severity) + ' severity, which boosts cases, VP, and infectivity by ' + format(tmp.s.severityEff)},
    ],
    ["display-text",
    function() {
        if (player.s.severity.gte(new Decimal("1.8e308"))) 
        return 'You have ' + format(player.s.recoveries) + ' recoveries, which divides severity gain by ' + format(tmp.s.recoveryEff)
        },
    ],
    "milestones",
    "buyables",
    "upgrades",
    "challenges"
],
    gainMult() {
        smult = new Decimal(1)
        let s = player.s.points
        let ssc = new Decimal(8)
        if (s.gte(ssc)) smult = smult.mul(Decimal.pow(1e100, s.sub(ssc).pow(3.7)))
        return smult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    layerShown() {
        let shown = challengeCompletions("u" ,22) == 3
        if(player.s.unlocked) shown = true
        return shown
    },
    milestones: {
        0: {
            requirementDescription: "3 symptoms",
            effectDescription: "Keep Infectivity/Replicator milestones on reset.",
            done() { return player.s.points.gte(3) }
        },
        1: {
            requirementDescription: "4 symptoms",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.s.points.gte(4) }
        },
        2: {
            requirementDescription: "5 symptoms",
            effectDescription: "Keep Infectivity/Replicator upgrades on reset and unlock buyables.",
            done() { return player.s.points.gte(5) }
        },
        3: {
            requirementDescription: "10 symptoms",
            effectDescription: "Unlock 2 more buyables.",
            done() { return player.s.points.gte(10) }
        },
    },
    buyables: {
		rows: 3,
        cols: 3,
        11: {
			title: "Severity Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.5, x.pow(1.3)).mul(1e17)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(2)
                if (hasSUpg(33)) base = base.add(getSUpgEff(33))
                return base
            },
            extra() {
                let extra = new Decimal(0)
                if (hasSUpg(22)) extra = extra.add(getBuyableAmount("s", 12))
                if (hasSUpg(23)) extra = extra.add(getBuyableAmount("s", 21))
                if (hasSUpg(25)) extra = extra.add(getBuyableAmount("s", 22))
                if (hasSUpg(31)) extra = extra.add(getBuyableAmount("s", 22))
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 11)
                if (hasSUpg(22)) total = total.add(layers.s.buyables[11].extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[11].total()
                let base = layers.s.buyables[11].base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(22)) extra = "+" + layers.s.buyables[11].extra()
                return "Multiply severity gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + getBuyableAmount("s", 11) + extra
            },
            unlocked() { return hasMilestone("s", 2) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e17)).div(Decimal.log10(2.5)).pow(10/13)
                target = target.ceil()
                let cost = Decimal.pow(2.5, target.sub(1).pow(1.3)).mul(1e17)
                let diff = target.sub(player.s.buyables[11])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[11] = player.s.buyables[11].add(diff)
                }
            },
        },
        12: {
			title: "Infectivity Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x.pow(1.3)).mul(1e19)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1e100)
                if (hasDUpg(13)) base = base.mul(getDUpgEff(13))
                return base
            },
            extra() {
                let extra = new Decimal(0)
                if (hasSUpg(25)) extra = extra.add(getBuyableAmount("s", 22))
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 12)
                if (hasSUpg(25)) total = total.add(layers.s.buyables[12].extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[12].total()
                let base = layers.s.buyables[12].base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(25)) extra = "+" + layers.s.buyables[12].extra()
                return "Multiply Infectivity gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + getBuyableAmount("s", 12) + extra
            },
            unlocked() { return player[this.layer].buyables[11].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e19)).pow(10/13)
                target = target.ceil()
                let cost = Decimal.pow(10, target.sub(1).pow(1.3)).mul(1e19)
                let diff = target.sub(player.s.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[12] = player.s.buyables[12].add(diff)
                }
            },
		},
		21: {
			title: "Symptom Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(65, x.pow(1.35)).mul(new Decimal("2e20"))
                return cost.floor()
            },
            base() { 
                return new Decimal(1.5)
            },
            extra() {
                let extra = new Decimal(0)
                if (hasSUpg(31)) extra = extra.add(getBuyableAmount("s", 22))
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 21)
                if (hasSUpg(31)) total = total.add(layers.s.buyables[21].extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[21].total()
                let base = layers.s.buyables[21].base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(31)) extra = "+" + layers.s.buyables[21].extra()
                return "Multiply the symptom base by 1.5.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + getBuyableAmount("s", 21) + extra
            },
            unlocked() { return player[this.layer].buyables[12].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(2e20)).div(Decimal.log10(65)).pow(Decimal.pow(1.35,-1))
                target = target.ceil()
                let cost = Decimal.pow(65, target.sub(1).pow(1.35)).mul(2e20)
                let diff = target.sub(player.s.buyables[21])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[21] = player.s.buyables[21].add(diff)
                }
            },
        },
        22: {
			title: "Uncoater Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(5e3, x.pow(1.5)).mul(new Decimal("3e37"))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10)
                b = Decimal.log10(b)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 22)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[22].total()
                let base = layers.s.buyables[22].base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Multiply the uncoater base by " + format(this.base())+" (based on cases)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + getBuyableAmount("s", 22) + extra
            },
            unlocked() { return player[this.layer].buyables[21].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(3e37)).div(Decimal.log10(5e3)).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(5e3, target.sub(1).pow(1.5)).mul(3e37)
                let diff = target.sub(player.s.buyables[22])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[22] = player.s.buyables[22].add(diff)
                }
            },
        },
        13: {
			title: "'Coated' Boost",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x.pow(1.5)).mul(new Decimal("2e164"))
                return cost.floor()
            },
            base() { 
                let b = player.i.points.add(1)
                b = Decimal.log10(b).add(10)
                b = Decimal.log10(b).pow(0.8)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 13)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[13].total()
                let base = layers.s.buyables[13].base()
                return Decimal.mul(base, x).add(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Raise 'Coated' reward to ^(1+" + format(this.base())+"x) (based on infectivity)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: ^" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + getBuyableAmount("s", 13) + extra
            },
            unlocked() { return hasMilestone("s", 3) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("2e164")).div(Decimal.log10(1e5)).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(1e5, target.sub(1).pow(1.5)).mul("2e164")
                let diff = target.sub(player.s.buyables[13])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[13] = player.s.buyables[13].add(diff)
                }
            },
        },
        23: {
			title: "'Infection' Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e10, x.pow(1.65)).mul(new Decimal("e270"))
                return cost.floor()
            },
            base() { 
                let b = player.v.points.add(10)
                b = Decimal.log10(b).pow(4)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 23)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[23].total()
                let base = layers.s.buyables[23].base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Multiply 'Infection' base by " + format(this.base())+". (based on VP)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + getBuyableAmount("s", 23) + extra
            },
            unlocked() { return player[this.layer].buyables[13].gte(1) }, 
            canAfford() {
                return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)	
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e270")).div(Decimal.log10(1e10)).pow(Decimal.pow(1.65,-1))
                target = target.ceil()
                let cost = Decimal.pow(1e10, target.sub(1).pow(1.65)).mul("e270")
                let diff = target.sub(player.s.buyables[23])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[23] = player.s.buyables[23].add(diff)
                }
            },
		},
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Cough",
            description: "Severity boosts uncoaters 1st effect base.",
            cost: new Decimal("15e3"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s11 = player.s.severity.add(10)
            s11 = Decimal.log10(s11)
            s11 = s11.pow(2).add(10)
            if (inChallenge("s", 11)) s11 = new Decimal(1)
            return s11
            },
            effectDisplay(){
            return format(getSUpgEff(11))+"x"
            },
        },
        12: {
            title: "Fever",
            description: "Uncoaters 2nd effect is boosted by bought symptom upgrades.",
            cost: new Decimal(2),
            effect(){
            let s12 = player.s.upgrades.length
            s12 = Decimal.div(s12, 2.85).pow(0.3)
            s12 = s12.mul(1.5).add(0.7)
            return s12
            },
            effectDisplay(){
            return format(getSUpgEff(12))+"x"
            },
            unlocked(){
            return hasSUpg(11)
            }
        },
        13: {
            title: "Tiredness",
            description: "Symptoms boost uncoaters 1st effect base.",
            cost: new Decimal("5e7"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s13 = player.s.points.add(1)
            s13 = s13.pow(3.75)
            if (inChallenge("s", 11)) s13 = new Decimal(1)
            return s13
            },
            effectDisplay(){
            return format(getSUpgEff(13))+"x"
            },
            unlocked(){
                return hasSUpg(12)
            }
        },
        14: {
            title: "Pain",
            description: "Infectivity boost severity gain.",
            cost: new Decimal("2e8"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s14 = player.i.points.add(1)
            s14 = s14.pow(new Decimal("3e-4"))
            return s14
            },
            effectDisplay(){
            return format(getSUpgEff(14))+"x"
            },
            unlocked(){
                return hasSUpg(13)
            }
        },
        15: {
            title: "Sore Throat",
            description: "Severity boosts replicators 1st effect base.",
            cost: new Decimal("7e12"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s15 = player.s.severity.add(1)
            s15 = s15.pow(0.3)
            if (inChallenge("s", 11)) s15 = new Decimal(1)
            return s15
            },
            effectDisplay(){
            return format(getSUpgEff(15))+"x"
            },
            unlocked(){
                return hasSUpg(14)
            }
        },
        21: {
            title: "Chills",
            description: "'Fever' boosts severity effect.",
            cost: new Decimal("3e15"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s21 = getSUpgEff(12)
            s21 = s21.pow(2).add(1.8)
            return s21
            },
            effectDisplay(){
            return "^"+format(getSUpgEff(21))
            },
            unlocked(){
                return hasSUpg(15)
            }
        },
        22: {
            title: "Headache",
            description: "'Infectivity Gain' gives free levels to 'Severity Gain'.",
            cost: new Decimal("5e22"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(21)
            }
        },
        23: {
            title: "Diarrhea",
            description: "'Symptom Base' gives free levels to 'Severity Gain'.",
            cost: new Decimal("5e38"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(22)
            }
        },
        24: {
            title: "Conjunctivitis",
            description: "Symptoms boost 'Infection' base.",
            cost: new Decimal("7"),
            effect(){
            let s24 = player.s.points
            s24 = Decimal.pow(1e4,s24)
            if (inChallenge("s", 11)) s24 = new Decimal(1)
            return s24
            },
            effectDisplay(){
            return format(getSUpgEff(24))+"x"
            },
            unlocked(){
                return hasSUpg(23)
            }
        },
        25: {
            title: "Taste Loss",
            description: "'Uncoater Base' gives free levels to 'Infectivity Gain'.",
            cost: new Decimal("25e58"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(24)
            }
        },
        31: {
            title: "Smell Loss",
            description: "'Uncoater Base' gives free levels to 'Symptom Base'.",
            cost: new Decimal("25e62"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(25)
            }
        },
        32: {
            title: "Skin Rash",
            description: "Replicators boost severity gain.",
            cost: new Decimal("5e164"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.r.points
                s32 = Decimal.pow(1.02, s32)
                return s32
                },
                effectDisplay(){
                return format(getSUpgEff(32))+"x"
                },
            unlocked(){
                return hasSUpg(31)
            }
        },
        33: {
            title: "Discoloration",
            description: "'Severity Gain' base is increased by 0.0002 per level.",
            cost: new Decimal("15e271"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = layers.s.buyables[11].total().div(5e3)
                return s32
                },
                effectDisplay(){
                return "+"+format(getSUpgEff(33))
                },
            unlocked(){
                return hasSUpg(32)
            }
        },
    },
    challenges: {
        rows: 2,
        cols: 2,
        11: {
            name: "Asymptomatic",
            currencyDisplayName: "infectivity",
            currencyInternalName: "points",
            currencyLayer: "i",
            challengeDescription: function() {
                let c11 = "Symptoms and severity are useless. Cases and infectivity gain is ^0.1."
                if (inChallenge("s", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("s", 11) == 5) c11 = c11 + " (Completed)"
                c11 = c11 + "<br>Completed:" + challengeCompletions("s",11) + "/" + this.completionLimit
                return c11
            },
            goal(){
                if (challengeCompletions("s", 11) == 0) return new Decimal("e9040");
                if (challengeCompletions("s", 11) == 1) return new Decimal("e12870");
                if (challengeCompletions("s", 11) == 2) return new Decimal("e14865");
            },
            completionLimit: 5,
            rewardDescription: "Infectivity makes uncoaters cheaper.",
            rewardEffect() {
                 let c11 = player.i.points.add(1)
                 let c11r = new Decimal(1.27)
                 let c11c = challengeCompletions("s", 11)
                 return c11
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasMilestone("d", 8)
            }
        },
    },
})
addLayer("d", {
    name: "deaths",
    symbol: "D",
    position: 2,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        auto: false,
        autob: false,
        autos: false,
        unlocked: false
    }},
    color: "#ff1234",
    requires: new Decimal("1.8e308"),
    resource: "deaths",
    baseResource: "severity",
    baseAmount() { return player.s.severity },
    type: "normal",
    exponent: new Decimal(0.0035),
    branches: ["i","r","s"],
    row: 2,
    hotkeys: [
        {
            key:"d", description: "D:Reset for deaths", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    layerShown() {
        let shown = hasSUpg(33)
        if(player.d.unlocked) shown = true
        return shown
    },
    effect() {
        let eff = player.d.best.add(1)
        eff = eff.pow(5)
        return eff
    },
    effectDescription() {
        return "which boost cases, VP, infectivity, and severity gain by "+format(this.effect()) + " (based on best)."
    },
    gainMult() {
        let mult = new Decimal(1)
        if (hasDUpg(12)) mult = mult.mul(getDUpgEff(12))
        if (hasDUpg(22)) mult = mult.mul(getDUpgEff(22))
        return mult
    },
    doReset(layer){
        if (layer == "d") {
        player.u.points = new Decimal(0)
        player.u.best = new Decimal(0)
        player.u.total = new Decimal(0)
        player.s.points = new Decimal(0)
        player.s.severity = new Decimal(0)
        player.s.recoveries = new Decimal(0)
        player.s.buyables[11] = new Decimal(0)
        player.s.buyables[12] = new Decimal(0)
        player.s.buyables[13] = new Decimal(0)
        player.s.buyables[21] = new Decimal(0)
        player.s.buyables[22] = new Decimal(0)
        player.s.buyables[23] = new Decimal(0)
        if (!hasMilestone("d", 3)) player.u.challenges[11] = 0
        if (!hasMilestone("d", 3)) player.u.challenges[12] = 0
        if (!hasMilestone("d", 3)) player.u.challenges[21] = 0
        if (!hasMilestone("d", 3)) player.u.challenges[22] = 0
        if (!hasMilestone("d", 6)) player.u.upgrades = []
        if (!hasMilestone("d", 6)) player.s.upgrades = []
        if (!hasMilestone("d", 0)) player.u.milestones = []
        if (!hasMilestone("d", 0)) player.s.milestones = []
        }
    },
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text",
        "Deaths reset all previous progress.",
        ],
        "milestones",
        "buyables",
        "upgrades",
        "challenges"
    ],
    milestones: {
        0: {
            requirementDescription: "2 total deaths",
            effectDescription: "Keep uncoater/symptom milestones on reset.",
            done() { return player.d.total.gte(2) }
        },
        1: {
            requirementDescription: "3 total deaths",
            effectDescription: "You can buy max uncoaters.",
            done() { return player.d.total.gte(3) }
        },
        2: {
            requirementDescription: "4 total deaths",
            effectDescription: "Autobuy uncoaters and unlock upgrades.",
            toggles:[["d", "auto"]],
            done() { return player.d.total.gte(4) }
        },
        3: {
            requirementDescription: "8 total deaths",
            effectDescription: "Keep uncoater challenge completions.",
            done() { return player.d.total.gte(8) }
        },
        4: {
            requirementDescription: "16 total deaths",
            effectDescription: "Autobuy symptom buyables (10/s).",
            toggles:[["d", "autob"]],
            done() { return player.d.total.gte(16) }
        },
        5: {
            requirementDescription: "32 total deaths",
            effectDescription: "Uncoaters reset nothing.",
            done() { return player.d.total.gte(32) }
        },
        6: {
            requirementDescription: "64 total deaths",
            effectDescription: "Keep previous upgrades on reset.",
            done() { return player.d.total.gte(64) }
        },
        7: {
            requirementDescription: "128 total deaths",
            effectDescription: "Autobuy symptoms.",
            toggles:[["d", "autos"]],
            done() { return player.d.total.gte(128) }
        },
        8: {
            requirementDescription: "1,048,576 total deaths",
            effectDescription: "Unlock symptom challenges (next update).",
            done() { return player.d.total.gte(1048576) }
        },
    },
    upgrades: {
        rows: 3,
        cols: 4,
        11: {
            title: "Deadly",
            description: "Deaths boosts symptom base.",
            cost: new Decimal(5),
            effect(){
            let d11 = player.d.points.add(10)
            d11 = Decimal.log10(d11).pow(4.5).add(1)
            return d11
            },
            effectDisplay(){
            return format(getDUpgEff(11))+"x"
            },
            unlocked() {
                return hasMilestone("d", 2)
            }
        },
        12: {
            title: "Fatal",
            description: "Cases boost death gain.",
            cost: new Decimal(10),
            effect(){
            let d12 = player.points.add(1)
            d12 = Decimal.log10(d12).pow(0.085).add(1)
            return d12
            },
            effectDisplay(){
            return format(getDUpgEff(12))+"x"
            },
            unlocked() {
                return hasDUpg(11)
            }
        },
        13: {
            title: "Lethal",
            description: "Deaths boost 'Infectivity Gain' base.",
            cost: new Decimal(30),
            effect(){
            let d12 = player.d.points.add(1)
            d12 = d12.pow(20)
            return d12
            },
            effectDisplay(){
            return format(getDUpgEff(13))+"x"
            },
            unlocked() {
                return hasDUpg(12)
            }
        },
        14: {
            title: "Blood Transmission",
            description: "Deaths boost 'Transmission'.",
            cost: new Decimal(50),
            effect(){
            let d14 = player.d.points.add(10)
            d14 = Decimal.log10(d14).add(10)
            d14 = Decimal.log10(d14).pow(4)
            return d14
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(14))
            },
            unlocked() {
                return hasDUpg(13)
            }
        },
        21: {
            title: "Dangerous",
            description: "Deaths boost uncoater base.",
            cost: new Decimal(100),
            effect(){
            let d12 = player.d.points.add(1)
            d12 = d12.pow(30)
            return d12
            },
            effectDisplay(){
            return format(getDUpgEff(21))+"x"
            },
            unlocked() {
                return hasDUpg(14)
            }
        },
        22: {
            title: "Mortal",
            description: "Double death gain per death upgrade bought.",
            cost: new Decimal(300),
            effect(){
            let d22 = player.d.upgrades.length
            d22 = Decimal.pow(2, d22)
            return d22
            },
            effectDisplay(){
            return format(getDUpgEff(22))+"x"
            },
            unlocked() {
                return hasDUpg(21)
            }
        },
    },
})