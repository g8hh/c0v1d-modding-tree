const STATIC_SCALE_STARTS = {
    "2": function() { return new Decimal(2000) },
    "3": function() { return new Decimal(320) },
}

function scaleStaticCost(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
    if (gain.gte(start)) { 
        if (row == 1) gain = gain.pow(2).div(start);
        if (row == 2) gain = gain.pow(3).div(Decimal.pow(start, 2))
    }
	return gain;
}

function softcapStaticGain(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
    if (gain.gte(start)) {
        if (row == 1) gain = gain.times(start).pow(1/2);
        if (row == 2) gain = gain.times(Decimal.pow(start,2)).root(3)
    }
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
function hasFUpg(id){
    return hasUpgrade("f",id)
}
function getFUpgEff(id){
    return upgradeEffect("f",id)
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
    softcap: new Decimal("ee7"),
    softcapPower: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if(hasVUpg(22)) mult = mult.mul(getVUpgEff(22))
        if(hasVUpg(31)) mult = mult.mul(getVUpgEff(31))
        if(hasIUpg(11)) mult = mult.mul(getIUpgEff(11))
        mult = mult.mul(layers.d.effect())
        mult = mult.mul(layers.f.effect())
        if (hasAchievement("a", 21)) mult = mult.mul(layers.a.effect())
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
        if (hasAchievement("a", 31)) keep.push("upgrades")
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
            cost: new Decimal(2),
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
                let v12sf2 = new Decimal("ee10")
                if(hasVUpg(23)) eff = eff.pow(getVUpgEff(23))
                if(hasFUpg(33)) eff = eff.pow(getFUpgEff(33))
                if(eff.gte(v12sf)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf)).pow(3/4)).mul(v12sf)
                if(eff.gte(v12sf2)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf2)).pow(0.9)).mul(v12sf2)
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
            cost: new Decimal(5),
            effect(){
                let v13 = player.v.points.add(2)
                let v13sf = new Decimal("1.8e308")
                let v13sf2 = new Decimal("1e2370")
                let v13sf3 = new Decimal("e25e8")
                let v13sf4 = new Decimal("ee14")
                let v13sff = new Decimal(0.5)
                let v13sff2 = new Decimal(0.8)
                let v13sff3 = new Decimal(10/11)
                let v13sff4 = new Decimal(5/6)
                v13 = v13.pow(1/2)
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                if(hasUUpg(12)) v13sf2 = v13sf2.mul(getUUpgEff(12)).add(1)
                if (inChallenge("u", 22)) v13sf = new Decimal(1)
                if (inChallenge("u", 22)) v13sf2 = new Decimal(1)
                if (hasChallenge("u", 22)) v13sff = v13sff.pow(challengeEffect("u", 22).pow(-1))
                if (hasChallenge("u", 22)) v13sff2 = v13sff2.pow(challengeEffect("u", 22).pow(-1))
                if(hasIUpg(12)) v13 = v13.pow(getIUpgEff(12))
                if(hasDUpg(14)) v13 = v13.pow(getDUpgEff(14))
                if(hasSUpg(55)) v13 = v13.pow(getSUpgEff(55))
                if(v13.gte(v13sf)) v13 = v13.mul(v13sf).pow(v13sff) 
                if(v13.gte(v13sf2)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf2)).pow(v13sff2)).mul(v13sf2)
                }
                if(v13.gte(v13sf3)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf3)).pow(v13sff3)).mul(v13sf3)
                }
                if(v13.gte(v13sf4)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf4)).pow(v13sff4)).mul(v13sf4)
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
            cost: new Decimal(10),
            effect(){
                let v21 = player.points.add(1)
                let v21sf = new Decimal("ee5")
                let v21sf2 = new Decimal("ee16")
                v21 = Decimal.log10(v21).pow(2).add(2)
                if(hasVUpg(32)) v21 = v21.pow(getVUpgEff(32))
                if(hasRUpg(23)) v21 = v21.pow(getRUpgEff(23))
                if(v21.gte(v21sf)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf)).pow(0.8)).mul(v21sf)
                if(v21.gte(v21sf2)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf2)).pow(0.88)).mul(v21sf2)
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
            cost: new Decimal(20),
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
            cost: new Decimal(200),
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
            cost: new Decimal(5e3),
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
            cost: new Decimal(2.5e5),
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
            cost: new Decimal(5e6),
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
    softcap: new Decimal("ee7"),
    softcapPower: 0.5,
    hotkeys: [
        {
            key:"i", description: "I:Reset for infectivity", onPress() {
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
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
        if (hasAchievement("a", 41)) keep.push("upgrades")
        if (hasMilestone("a", 0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    effect(){
        let eff = player.i.points.add(1)
        eff = eff.pow(2)
        if (inChallenge("u", 12)) eff = new Decimal(1)
        if (eff.gte("ee16")) eff = Decimal.pow(10,eff.div("ee16").log10().pow(0.88)).mul("ee16")
        return eff
    },
    effectDescription() {
        let dis = "which boost cases gain by "+format(this.effect())
        if (this.effect().gte("ee16")) dis += " (softcapped)"
        return dis
    },
    gainMult() {
        imult = new Decimal(1)
        if (hasIUpg(13)) imult = imult.mul(getIUpgEff(13))
        if (hasIUpg(23)) imult = imult.mul(getIUpgEff(23))
        imult = imult.mul(layers.u.effect())
        imult = imult.mul(layers.d.effect())
        imult = imult.mul(layers.f.effect())
        if (hasAchievement("a", 31)) imult = imult.mul(layers.a.effect())
        imult = imult.mul(layers.s.buyables[12].effect())
        if (player.s.unlocked) imult = imult.mul(tmp.s.severityEff);
        return imult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    update(diff) {
        if (hasMilestone("u", 2)) generatePoints("i", diff);
    },
    row: 1,
    layerShown() {
        let shown = player.v.total.gte(new Decimal(1))
        if(player.i.unlocked) shown = true
        return shown
    },
    milestones: {
        0: {
            requirementDescription: "15 total infectivity",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.i.total.gte(15) }
        },
        1: {
            requirementDescription: "2,000 total infectivity",
            effectDescription: "Gain 100% of VP gain per second.",
            done() { return player.i.total.gte(2e3) }
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
            cost: new Decimal(50),
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
            cost: new Decimal(500),
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
            cost: new Decimal(5e3),
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
            cost: new Decimal(25e3),
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
            cost: new Decimal("2.5e60"),
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
            if (i33.gte(1e17)) i33 = i33.div(1e17).pow(0.5).mul(1e17)
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
    requires: new Decimal("5e58"),
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
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
        if (hasAchievement("a", 41)) keep.push("upgrades")
        if (hasMilestone("a", 0)) keep.push("milestones")
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
            requirementDescription: "5 replicators",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.r.points.gte(5) }
        },
        1: {
            requirementDescription: "12 replicators",
            effectDescription: "You can buy max replicators.",
            done() { return player.r.points.gte(12) }
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
            if (r22.gte(4.8e6)) r22 = r22.div(4.8e6).pow(0.5).mul(4.8e6)
            if (r22.gte(3e11)) r22 = Decimal.pow(10,r22.div(3e11).log10().pow(0.5)).mul(3e11)
            return r22
            },
            effectDisplay(){
                let dis = format(getRUpgEff(22))+"x"
                if (this.effect().gte(4.8e6)) dis += " (softcapped)"
                return dis
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
    requires: new Decimal("5e116"),
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
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("a", 0)) keep.push("upgrades")
        if (hasMilestone("a", 0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    autoPrestige() { return (hasMilestone("d", 2) && player.d.auto) },
    canBuyMax() { return hasMilestone("d", 1)},
    resetsNothing() { return hasMilestone("d", 5) },
    milestones: {
        0: {
            requirementDescription: "2 uncoaters",
            effectDescription: "Keep Infectivity/Replicator milestones on reset.",
            done() { return player.u.points.gte(2) }
        },
        2: {
            requirementDescription: "3 uncoaters",
            effectDescription: "Gain 100% of infectivity gain per second.",
            done() { return player.u.points.gte(3) }
        },
        3: {
            requirementDescription: "6 uncoaters",
            effectDescription: "Keep Infectivity/Replicator upgrades on reset.",
            done() { return player.u.points.gte(6) }
        },
        4: {
            requirementDescription: "8 uncoaters",
            effectDescription: "Autobuy replicators.",
            toggles: [["u", "auto"]],
            done() { return player.u.points.gte(8) }
        },
        5: {
            requirementDescription: "10 uncoaters",
            effectDescription: "Replicators reset nothing.",
            done() { return player.u.points.gte(10) }
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
            if (inChallenge("u", 11) || inChallenge("s", 21)) u11 = new Decimal(1)
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
            if (inChallenge("u", 11) || inChallenge("u", 21) || inChallenge("s", 21)) u12 = new Decimal(1)
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
                if (inChallenge("u", 11) || inChallenge("s", 21)) u13 = new Decimal(1)
                if (inChallenge("u", 21) || inChallenge("s", 21)) u13b = new Decimal(1)
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
            if (inChallenge("s", 21)) u14 = new Decimal(1)
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
            if (inChallenge("s", 21)) u21 = new Decimal(1)
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
            if (inChallenge("u", 12) || inChallenge("s", 21)) u22 = new Decimal(1)
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
            if (inChallenge("u", 12) || inChallenge("s", 21)) u23 = new Decimal(1)
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
            if (inChallenge("u", 11) || inChallenge("s", 21)) u24 = new Decimal(1)
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
    challenges: { // Order: 1x1,2x1,1x2,3x1,4x1,2x2,1x3,3x2,2x3,4x2,3x3,4x3
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
                if (challengeCompletions("u", 11) == 0) return new Decimal("e2610");
                if (challengeCompletions("u", 11) == 1) return new Decimal("e2865");
                if (challengeCompletions("u", 11) == 2) return new Decimal("e4860");
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
                if (challengeCompletions("u", 12) == 0) return new Decimal("e714");
                if (challengeCompletions("u", 12) == 1) return new Decimal("e2360");
                if (challengeCompletions("u", 12) == 2) return new Decimal("e3434");
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
                if (challengeCompletions("u", 21) == 0) return new Decimal("e3700");
                if (challengeCompletions("u", 21) == 1) return new Decimal("e5720");
                if (challengeCompletions("u", 21) == 2) return new Decimal("e6905");
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
                if (challengeCompletions("u", 22) == 0) return new Decimal("1e14");
                if (challengeCompletions("u", 22) == 1) return new Decimal("5e19");
                if (challengeCompletions("u", 22) == 2) return new Decimal("5e21");
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
        ct: 0,
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
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("f", 3)) keep.push("upgrades")
        if (hasMilestone("f", 4)) keep.push("challenges")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    resetsNothing() { return hasMilestone("d", 9) },
    autoPrestige() { return (hasMilestone("d", 7) && player.d.autos) },
    effbase() {
        let eff = new Decimal("123")
        eff = eff.mul(layers.s.buyables[21].effect())
        if (hasDUpg(11)) eff = eff.mul(getDUpgEff(11))
        if (hasSUpg(35)) eff = eff.mul(getSUpgEff(35))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = eff.pow(player.s.points).sub(1)
        if (hasSUpg(14)) eff = eff.mul(getSUpgEff(14))
        if (hasSUpg(32)) eff = eff.mul(getSUpgEff(32))
        eff = eff.mul(layers.s.buyables[11].effect())
        eff = eff.mul(layers.d.effect())
        eff = eff.mul(layers.f.effect())
        if (hasChallenge("s", 11)) eff = eff.mul(challengeEffect("s", 11))
        eff = eff.pow(layers.s.buyables[33].effect())
        if (player.s.severity.gte(new Decimal("1.8e308"))) eff = eff.div(tmp.s.recoveryEff)
        if (hasDUpg(42)) {
            if (hasDUpg(31)) eff = eff.pow(getDUpgEff(31))
            if (hasDUpg(32)) eff = eff.pow(getDUpgEff(32))
            if (hasChallenge("s", 22)) eff = eff.pow(challengeEffect("s", 22))
            if (hasSUpg(53)) eff = Decimal.pow(10,eff.log10().pow(getSUpgEff(53)))
            if (hasSUpg(54)) eff = Decimal.pow(10,eff.log10().pow(getSUpgEff(54)))
            if (hasDUpg(44)) eff = Decimal.pow(10,eff.log10().pow(getDUpgEff(44)))
            if (hasFUpg(21)) eff = Decimal.pow(10,eff.log10().pow(getFUpgEff(21)))
        }
        if (eff.gte("e2e6")) eff = eff.log10().mul(5000).pow(2e5)
        if (player.s.points.eq(0)) eff = new Decimal(0)
        if (hasFUpg(11)) eff = eff.mul(getFUpgEff(11))
        if (hasFUpg(13)) eff = eff.mul(getFUpgEff(13))
        if (hasFUpg(15)) eff = eff.mul(layers.f.effect())
        eff = eff.mul(layers.d.buyables[11].effect())
        return eff
    },
    recoveryGain() {
        let s = player.s.severity
        let recov = (s.add(10)).log10().div(308.254).pow(40)
        let r = player.s.recoveries.add(1)
        if (s.gte(new Decimal("e1000"))) recov = recov.pow(s.log10().sub(999).pow(0.3)).pow(r.log10().pow(0.1))
        if (s.gte(new Decimal("e150000"))) recov = Decimal.pow(10,recov.log10().pow(s.log10().div(3e6).add(0.95)))
        if (hasDUpg(42)) recov = new Decimal(0)
        return recov
    },
    recoveryEff() {
        let s = player.s.severity
        let recov = player.s.recoveries.add(1)
        recov = Decimal.log10(recov).add(1).pow(40)
        if (s.gte(new Decimal("e1000"))) recov = recov.pow(s.log10().sub(999).pow(0.15)).pow(recov.log10().pow(0.2))
        if (s.gte(new Decimal("e2000"))) recov = recov.pow(s.log10().sub(1999).pow(0.12))
        if (s.gte(new Decimal("e5000"))) recov = Decimal.pow(10,recov.log10().pow(s.log10().sub(4999).pow(0.02)))
        if (s.gte(new Decimal("e150000"))) recov = Decimal.pow(10,recov.log10().pow(s.log10().div(1.5e6).add(0.9)))
        if (hasDUpg(31)) recov = recov.pow(getDUpgEff(31))
        if (hasDUpg(32)) recov = recov.pow(getDUpgEff(32))
        if (hasChallenge("s", 22)) recov = recov.pow(challengeEffect("s", 22))
        if (hasSUpg(53)) recov = Decimal.pow(10,recov.log10().pow(getSUpgEff(53)))
        if (hasSUpg(54)) recov = Decimal.pow(10,recov.log10().pow(getSUpgEff(54)))
        if (hasDUpg(42)) recov = new Decimal(1)
        return recov
    },
    effectDescription() {
        let desc = "which produces " + format(this.effect()) + " severity "
        if (this.effect().gte("e2e6")) desc += " (softcapped) "
        if (player.s.severity.gte(new Decimal("1.8e308"))) desc = desc + "and " + format(this.recoveryGain()) + " recoveries"
        desc = desc + " per second."
        return desc
    },
    severityEff() {
        let seff = player.s.severity.add(1)
        seff = seff.pow(6)
        if (hasSUpg(21)) seff = seff.pow(getSUpgEff(21))
        if (hasSUpg(51)) seff = seff.pow(getSUpgEff(51))
        if (inChallenge("s", 11)) seff = new Decimal(1)
        return seff
    },
    bulk() {
        let buymult = new Decimal(1)
        if (hasMilestone("d", 4)) buymult = buymult.mul(10)
        if (hasMilestone("a", 0)) buymult = buymult.mul(2)
        if (hasAchievement("a", 41)) buymult = buymult.mul(2)
        if (hasDUpg(23)) buymult = buymult.mul(2)
        if (hasDUpg(32)) buymult = buymult.mul(5)
        if (hasDUpg(33)) buymult = buymult.mul(2)
        if (hasSUpg(55)) buymult = buymult.mul(25)
        if (hasMilestone("f", 8)) buymult = buymult.mul(100)
        return buymult
    },
    speed() {
        let speed = 1
        if (hasMilestone("d", 9)) speed *= 2
        if (hasMilestone("a", 0)) speed *= 2
        if (hasAchievement("a", 41)) speed *= 2
        if (hasDUpg(33)) speed *= 2
        return speed
    },
    update(diff) {
        if (player.s.unlocked) player.s.severity = player.s.severity.add(tmp.s.effect.times(diff));
        if (tmp.s.effect.gte(new Decimal("e1000")) && player.s.severity.lt(new Decimal("e1000"))) player.s.severity = new Decimal("e1000")
        if (tmp.s.effect.gte(new Decimal("e5000")) && player.s.severity.lt(new Decimal("e5000"))) player.s.severity = new Decimal("e5000")
        if (player.s.severity.gte(new Decimal("1.8e308"))) player.s.recoveries = player.s.recoveries.add(tmp.s.recoveryGain.times(diff));
        if (player.s.recoveries.log10().gte(this.recoveryGain().log10().add(2))) player.s.recoveries = this.recoveryGain().mul(100)
        let t = diff*this.speed()
            player.s.time = Decimal.add(player.s.time, t)
            if (player.s.time.gte(1)) {
                let times = Decimal.floor(player.s.time).mul(-1)
                player.s.time = Decimal.add(player.s.time, times)
                times = times.mul(-1)
                if (hasUpgrade("s", 31) || hasAchievement("a", 41)) {
                    layers.s.buyables[11].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[12].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[13].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[21].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[22].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[23].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[31].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[32].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[33].buyMax(times.mul(this.bulk()))
                }
            };
        if (player.s.ct <0.1 && (inChallenge("s", 11) || inChallenge("s", 12) || inChallenge("s", 21) || inChallenge("s", 22)))player.s.ct += diff
        if (player.s.ct >= 0.1) {
            player.v.upgrades = [11,12,13,21,22,23,31,32,33]
        }
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
        let ssc2 = new Decimal(20)
        if (hasDUpg(41)) ssc2 = ssc2.add(getDUpgEff(41))
        if (s.gte(ssc)) smult = smult.mul(Decimal.pow(1e100, s.sub(ssc).pow(3.7)))
        if (s.gte(ssc2)) smult = smult.mul(Decimal.pow(new Decimal("e10000"),Decimal.pow(1.9,s.sub(ssc2))))
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
            requirementDescription: "2 symptoms",
            effectDescription: "Keep Infectivity/Replicator milestones on reset.",
            done() { return player.s.points.gte(2) }
        },
        1: {
            requirementDescription: "3 symptoms",
            effectDescription: "Keep Infectivity/Replicator upgrades on reset.",
            done() { return player.s.points.gte(3) }
        },
        2: {
            requirementDescription: "4 symptoms",
            effectDescription: "Unlock buyables.",
            done() { return player.s.points.gte(4) }
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
                let cost = Decimal.pow(2.5, x.pow(1.3)).mul(1e15)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(2)
                if (hasSUpg(33)) base = base.add(getSUpgEff(33))
                base = base.mul(layers.s.buyables[31].effect())
                return base
            },
            extra() {
                let extra = new Decimal(0)
                if (!inChallenge("s", 22)) {
                if (hasSUpg(22)) extra = extra.add(layers.s.buyables[12].total())
                if (hasSUpg(23)) extra = extra.add(layers.s.buyables[21].total())
                extra = extra.add(layers.d.buyables[11].total())
                extra = extra.add(layers.s.buyables[33].total())
                }
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 11).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(22)) extra = "+" + formatWhole(layers.s.buyables[11].extra())
                return "Multiply severity gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 11)) + extra
            },
            unlocked() { return hasMilestone("s", 2) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e15)).div(Decimal.log10(2.5)).pow(10/13)
                target = target.ceil()
                let cost = Decimal.pow(2.5, target.sub(1).pow(1.3)).mul(1e15)
                let diff = target.sub(player.s.buyables[11])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[11] = player.s.buyables[11].add(diff)
                }
            },
        },
        12: {
			title: "Infectivity Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x.pow(1.29)).mul(1e19)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1e100)
                if (hasDUpg(13)) base = base.mul(getDUpgEff(13))
                return base
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(25) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[22].total())
                if (hasSUpg(34) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[13].total())
                extra = extra.add(layers.d.buyables[12].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 12).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[12].total()
                let base = layers.s.buyables[12].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(25)) extra = "+" + formatWhole(layers.s.buyables[12].extra())
                return "Multiply Infectivity gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 12)) + extra
            },
            unlocked() { return player[this.layer].buyables[11].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e19)).pow(Decimal.pow(1.29,-1))
                target = target.ceil()
                let cost = Decimal.pow(10, target.sub(1).pow(1.29)).mul(1e19)
                let diff = target.sub(player.s.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[12] = player.s.buyables[12].add(diff)
                }
            },
		},
		21: {
			title: "Symptom Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(65, x.pow(1.35)).mul(new Decimal("e20"))
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.5)
                if (hasSUpg(45)) base = base.add(getSUpgEff(45))
                base = base.add(layers.s.buyables[32].effect())
                return base
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(31) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[22].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 21).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[21].total()
                let base = layers.s.buyables[21].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(31)) extra = "+" + formatWhole(layers.s.buyables[21].extra())
                return "Multiply the symptom base by "+ format(this.base()) + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 21)) + extra
            },
            unlocked() { return player[this.layer].buyables[12].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e20)).div(Decimal.log10(65)).pow(Decimal.pow(1.35,-1))
                target = target.ceil()
                let cost = Decimal.pow(65, target.sub(1).pow(1.35)).mul(1e20)
                let diff = target.sub(player.s.buyables[21])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[21] = player.s.buyables[21].add(diff)
                }
            },
        },
        22: {
            title: "Uncoater Base",
            scalebase(){
                let base = new Decimal(5e3)
                if (hasSUpg(42)) base = base.div(getSUpgEff(42))
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(new Decimal("e37"))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10)
                b = Decimal.log10(b)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(44) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[23].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 22).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[22].total()
                let base = layers.s.buyables[22].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(44)) extra = "+" + formatWhole(layers.s.buyables[22].extra())
                return "Multiply the uncoater base by " + format(this.base())+" (based on cases)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 22)) + extra
            },
            unlocked() { return player[this.layer].buyables[21].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e37)).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(1e37)
                let diff = target.sub(player.s.buyables[22])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[22] = player.s.buyables[22].add(diff)
                }
            },
        },
        13: {
            title: "'Coated' Boost",
            scalebase(){
                let base = new Decimal(1e5)
                if (hasSUpg(41)) base = base.div(getSUpgEff(41))
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(new Decimal("2e164"))
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
                extra = extra.add(layers.d.buyables[13].total())
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(44) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[23].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 13).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[13].total()
                let base = layers.s.buyables[13].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x).add(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(44)) extra = "+" + formatWhole(layers.s.buyables[13].extra())
                return "Raise 'Coated' reward to ^(1+" + format(this.base())+"x) (based on infectivity)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: ^" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("s", 13)) + extra
            },
            unlocked() { return hasMilestone("s", 3) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("2e164")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul("2e164")
                let diff = target.sub(player.s.buyables[13])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[13] = player.s.buyables[13].add(diff)
                }
            },
        },
        23: {
            title: "'Infection' Base",
            scalebase(){
                let base = new Decimal(1e10)
                if (hasSUpg(43)) base = base.div(getSUpgEff(43))
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.65)).mul(new Decimal("e270"))
                return cost.floor()
            },
            base() { 
                let b = player.v.points.add(10)
                b = Decimal.log10(b).pow(4)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 23).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[23].total()
                let base = layers.s.buyables[23].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(layers.s.buyables[23].extra())
                return "Multiply 'Infection' base by " + format(this.base())+". (based on VP)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 23)) + extra
            },
            unlocked() { return player[this.layer].buyables[13].gte(1) }, 
            canAfford() {
                return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e270")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.65,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.65)).mul("e270")
                let diff = target.sub(player.s.buyables[23])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[23] = player.s.buyables[23].add(diff)
                }
            },
        },
        31: {
            title: "Severity Boost",
            scalebase(){
                let base = new Decimal("e100")
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2)).mul(new Decimal("e34e5"))
                return cost.floor()
            },
            base() { 
                let b = player.d.points.add(1)
                b = Decimal.pow(10,b.log10().pow(0.5)).pow(0.02)
                return b
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 31).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[31].total()
                let base = layers.s.buyables[31].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(layers.s.buyables[31].extra())
                return "Multiply 'Severity Gain' base by " + format(this.base())+"x (based on deaths)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 31)) + extra
            },
            unlocked() { return hasFUpg(21) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e34e5")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2)).mul("e34e5")
                let diff = target.sub(player.s.buyables[31])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[31] = player.s.buyables[31].add(diff)
                }
            },
        },
        32: {
            title: "Symptom Boost",
            scalebase(){
                let base = new Decimal("e300")
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2)).mul(new Decimal("e3573000"))
                return cost.floor()
            },
            base() { 
                let b = player.f.points.add(10)
                let s = player.s.severity.add(10)
                b = Decimal.pow(10,b.log10().pow(1.25)).pow(0.03).pow(s.log10().pow(0.17)).div(20)
                if (b.gte("e300")) b = b.div("e300").pow(0.1).mul("e300")
                return b
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 32).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[32].total()
                let base = layers.s.buyables[32].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(layers.s.buyables[32].extra())
                return "Increase 'Symptom Base' base by " + format(this.base())+" (based on fatality and severity)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("s", 32)) + extra
            },
            unlocked() { return player["s"].buyables[31].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e3573000")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2)).mul("e3573000")
                let diff = target.sub(player.s.buyables[32])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[32] = player.s.buyables[32].add(diff)
                }
            },
        },
        33: {
            title: "Severity Exponent",
            scalebase(){
                let base = new Decimal("e500")
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2.2)).mul(new Decimal("e388e4"))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10)
                let s = player.i.points.add(10)
                b = Decimal.pow(10,b.log10().pow(0.12)).pow(0.03).pow(s.log10().pow(0.005)).div(100)
                return b
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 33).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[33].total()
                let base = layers.s.buyables[33].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x).add(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Increase severity gain exponent by " + format(this.base())+" (based on cases and infectivity) and gives free levels to all previous buyables\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: ^" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("s", 33)) + extra
            },
            unlocked() { return player["s"].buyables[32].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e388e4")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2.2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2.2)).mul("e388e4")
                let diff = target.sub(player.s.buyables[33])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[33] = player.s.buyables[33].add(diff)
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
            cost: new Decimal("5e3"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s11 = player.s.severity.add(10)
            s11 = Decimal.log10(s11)
            s11 = s11.pow(2).add(10)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s11 = new Decimal(1)
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
            if (hasDUpg(34)) s12 += player.d.upgrades.length*2
            s12 = Decimal.div(s12, 2.85).pow(0.3)
            s12 = s12.mul(1.5).add(0.7)
            if (inChallenge("s", 21)) s12 = new Decimal(1)
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
            cost: new Decimal("3e7"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s13 = player.s.points.add(1)
            s13 = s13.pow(3.75)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s13 = new Decimal(1)
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
            cost: new Decimal("77777777"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s14 = player.i.points.add(1)
            s14 = s14.pow(new Decimal("3e-4"))
            if (s14.gte(new Decimal("e5000"))) s14 = s14.div("e5000").pow(0.1).mul("e5000")
            if (inChallenge("s", 21)) s14 = new Decimal(1)
            return s14
            },
            effectDisplay(){
                let dis = format(getSUpgEff(14))+"x"
                if (this.effect().gte(new Decimal("e5000"))) dis += " (softcapped)"
                return dis
            },
            unlocked(){
                return hasSUpg(13)
            }
        },
        15: {
            title: "Sore Throat",
            description: "Severity boosts replicators 1st effect base.",
            cost: new Decimal("1.5e12"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s15 = player.s.severity.add(1)
            s15 = s15.pow(0.3)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s15 = new Decimal(1)
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
            cost: new Decimal("1e15"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s21 = getSUpgEff(12)
            s21 = s21.pow(2).add(1.8)
            if (inChallenge("s", 21)) s21 = new Decimal(1)
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
            cost: new Decimal("2.22e22"),
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
            if (inChallenge("s", 11) || inChallenge("s", 21)) s24 = new Decimal(1)
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
            cost: new Decimal("5e58"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(24)
            }
        },
        31: {
            title: "Smell Loss",
            description: "'Uncoater Base' gives free levels to 'Symptom Base' and autobuy buyables once per second.",
            cost: new Decimal("1e63"),
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
                if (inChallenge("s", 21)) s32 = new Decimal(1)
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
                if (hasChallenge("s", 21)) s32 = s32.mul(challengeEffect("s", 21))
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32
            },
            effectDisplay(){
                return "+"+format(getSUpgEff(33))
            },
            unlocked(){
                return hasSUpg(32)
            }
        },
        34: {
            title: "Shortness of Breath",
            description: "'Coated Boost' gives free 'Infectivity gain'.",
            cost: new Decimal("e54490"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasDUpg(34)
            }
        },
        35: {
            title: "Chest Pain",
            description: "Cases boost symptom base.",
            cost: new Decimal("e60100"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10)
                s32 = s32.log10().pow(5)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32
            },
            effectDisplay(){
                return format(getSUpgEff(35))+"x"
            },
            unlocked(){
                return hasSUpg(34)
            }
        },
        41: {
            title: "Speech Loss",
            description: "Deaths reduce 'Coated Boost' scaling base.",
            cost: new Decimal("e70000"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.d.points.add(10)
                s32 = s32.log10().pow(1.2)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32.min(7e4)
            },
            effectDisplay(){
                return format(getSUpgEff(41))+"x"
            },
            unlocked(){
                return hasSUpg(35)
            }
        },
        42: {
            title: "Movement Loss",
            description: "Severity reduces 'Uncoater Base' scaling base.",
            cost: new Decimal("e87700"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.s.severity.add(10)
                s32 = s32.log10().pow(0.27)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32.min(1e3)
            },
            effectDisplay(){
                return format(getSUpgEff(42))+"x"
            },
            unlocked(){
                return hasSUpg(41)
            }
        },
        43: {
            title: "Pneumonia",
            description: "Cases reduce 'Infection Base' scaling base.",
            cost: new Decimal("e133420"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10)
                s32 = s32.log10().add(10)
                s32 = s32.log10().pow(5).mul(3333)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32.min(3e9)
            },
            effectDisplay(){
                return format(getSUpgEff(43))+"x"
            },
            unlocked(){
                return hasSUpg(42)
            }
        },
        44: {
            title: "Fatigue",
            description: "'Infection Base' gives free 'Coated Boost' and 'Uncoater Base'.",
            cost: new Decimal("e146060"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(43)
            }
        },
        45: {
            title: "Congestion",
            description: "Each 'Infection Base' adds 0.0001 to 'Symptom Base' base.",
            cost: new Decimal("e191185"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = layers.s.buyables[23].total().div(1e4)
                return s32
            },
            effectDisplay(){
                return "+"+format(getSUpgEff(45))
            },
            unlocked(){
                return hasSUpg(44)
            }
        },
        51: {
            title: "Muscle Aches",
            description: "Cases boost severity effect.",
            cost: new Decimal("e215350"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10)
                s32 = s32.log10().add(1).log10()
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(51))
            },
            unlocked(){
                return hasSUpg(45)
            }
        },
        52: {
            title: "Nausea",
            description: "Infectivity boosts 'Deadly'.",
            cost: new Decimal("e225315"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.i.points.add(10)
                s32 = s32.log10().pow(0.23)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(52))
            },
            unlocked(){
                return hasSUpg(51)
            }
        },
        53: {
            title: "Asthma",
            description() {
                let des =  "Uncoaters reduce recovery effect exponent."
                if (hasDUpg(42)) des =  "Uncoaters boost severity gain exponent."
                return des
            },
            cost: new Decimal("e301777"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.u.points.add(10)
                s32 = s32.log10().pow(-0.1)
                if (hasDUpg(42)) s32 = s32.pow(-1)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(53))
            },
            unlocked(){
                return hasSUpg(52)
            }
        },
        54: {
            title: "Cancer",
            description() {
                let des =  "Replicators reduce recovery effect exponent."
                if (hasDUpg(42)) des =  "Replicators boost severity gain exponent."
                return des
            },
            cost: new Decimal("e435630"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.r.points.add(10)
                s32 = s32.log10().pow(-0.05)
                if (hasDUpg(42)) s32 = s32.pow(-1)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(54))
            },
            unlocked(){
                return hasSUpg(53)
            }
        },
        55: {
            title: "Heart Failure",
            description: "Severity boosts 'Transmission', 'Smell Loss' buys 25x more, and unlock a row of death upgrades.",
            cost: new Decimal("e545766"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.s.severity.add(10)
                s32 = s32.log10().pow(0.12)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(55))
            },
            unlocked(){
                return hasSUpg(54)
            }
        },
    },
    challenges: { // Order: 1x1,2x1,1x2,3x1,2x2,1x3,4x1,1x4,2x3,3x2,4x2,3x3,2x4,1x5,4x3,3x4,4x4,2x5,3x5,4x5
        rows: 2,
        cols: 2,
        11: {
            name: "Asymptomatic",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c11 = "Symptoms and severity are useless. Cases gain is ^0.1."
                if (inChallenge("s", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("s", 11) == 5) c11 = c11 + " (Completed)"
                c11 = c11 + "<br>Completed:" + challengeCompletions("s",11) + "/" + this.completionLimit
                return c11
            },
            goal(){
                if (challengeCompletions("s", 11) == 0) return new Decimal("e78000");
                if (challengeCompletions("s", 11) == 1) return new Decimal("e107500");
                if (challengeCompletions("s", 11) == 2) return new Decimal("e285000");
                if (challengeCompletions("s", 11) == 3) return new Decimal("e3e6");
                if (challengeCompletions("s", 11) == 4) return new Decimal("e8.93e6");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            completionLimit: 5,
            rewardDescription: "Cases boost severity gain.",
            rewardEffect() {
                 let c11 = player.points.add(1)
                 let c11r = new Decimal(0.38)
                 let c11c = challengeCompletions("s", 11)
                 c11r = Decimal.add(c11r, Decimal.div(c11c, 50))
                 let c11r2 = new Decimal(0.3)
                 if (c11c >= 4) c11r2 = Decimal.sub(0.6, Decimal.div(c11c, 11))
                 if (c11c == 5) c11r = c11r.add(0.007)
                 c11 = Decimal.pow(10, Decimal.log10(c11).pow(c11r)).pow(c11r2)
                 return c11
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasMilestone("d", 8)
            }
        },
        12: {
            name: "Unbuyable",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c12 = "Symptom buyables are useless. Cases gain is ^0.01."
                if (inChallenge("s", 12)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("s", 12) == 5) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("s",12) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("s", 12) == 0) return new Decimal("e5640");
                if (challengeCompletions("s", 12) == 1) return new Decimal("e13600");
                if (challengeCompletions("s", 12) == 2) return new Decimal("e86400");
                if (challengeCompletions("s", 12) == 3) return new Decimal("e154000");
                if (challengeCompletions("s", 12) == 4) return new Decimal("e327000");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            completionLimit: 5,
            rewardDescription: "Infectivity boosts death gain.",
            rewardEffect() {
                 let c12 = player.points.add(1)
                 let c12r = new Decimal(0.33)
                 let c12c = challengeCompletions("s", 12)
                 c12r = Decimal.add(c12r, Decimal.div(c12c, 5))
                 c12 = Decimal.log10(c12).pow(c12r).div(100).max(1)
                 return c12
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("s", 11)
            }
        },
        21: {
            name: "Row 3 Downgrade",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c12 = "Row 3 Upgrades are useless. Cases gain is ^0.03."
                if (inChallenge("s", 21)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("s", 21) == 5) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("s",21) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("s", 21) == 0) return new Decimal("e4660");
                if (challengeCompletions("s", 21) == 1) return new Decimal("e34100");
                if (challengeCompletions("s", 21) == 2) return new Decimal("e44640");
                if (challengeCompletions("s", 21) == 3) return new Decimal("e64500");
                if (challengeCompletions("s", 21) == 4) return new Decimal("e89100");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            completionLimit: 5,
            rewardDescription: "Deaths boost 'Discoloration'.",
            rewardEffect() {
                 let c12 = player.d.points.add(10)
                 let c12r = new Decimal(0.07)
                 let c12c = challengeCompletions("s", 21)
                 c12r = Decimal.add(c12r, Decimal.div(c12c, 15))
                 c12 = Decimal.log10(c12).pow(c12r)
                 return c12
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("s", 12)
            }
        },
        22: {
            name: "Symptomless Symptoms",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c12 = "'Asymptomatic' and 'Unbuyable' at once."
                if (inChallenge("s", 22)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("s", 22) == 5) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("s",22) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("s", 22) == 0) return new Decimal("e1020");
                if (challengeCompletions("s", 22) == 1) return new Decimal("e2170");
                if (challengeCompletions("s", 22) == 2) return new Decimal("e4720");
                if (challengeCompletions("s", 22) == 3) return new Decimal("e5850");
                if (challengeCompletions("s", 22) == 4) return new Decimal("e12715");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            countsAs: [11,12],
            completionLimit: 5,
            rewardDescription() {
                let des =  "Severity reduces the recovery effect."
                if (hasDUpg(42)) des =  "Severity boosts severity gain."
                return des
            },
            rewardEffect() {
                 let c12 = player.s.severity.add(10)
                 let c12r = new Decimal(0.02)
                 let c12c = challengeCompletions("s", 22)
                 c12r = Decimal.add(c12r, Decimal.div(c12c, 200))
                 c12 = Decimal.log10(c12).pow(-c12r)
                 if (hasDUpg(42)) c12 = c12.pow(-1)
                 return c12
            },
            rewardDisplay() {return "^"+format(this.rewardEffect())},
            unlocked(){
                return hasChallenge("s", 21)
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
        unlocked: false,
        time: new Decimal(0)
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
    bulk() {
        let bulk = new Decimal(100)
        if (hasAchievement("a", 53)) bulk = bulk.mul(5)
        if (hasMilestone("f", 8)) bulk = bulk.mul(100)
        return bulk
    },
    speed() {
        let speed = 1
        if (hasAchievement("a", 53)) speed *=2
        return speed
    },
    update(diff) {
        if (hasMilestone("d", 10)) generatePoints("d", diff/100);
        let t = diff*this.speed()
            player.d.time = Decimal.add(player.d.time, t)
            if (player.d.time.gte(1)) {
                let times = Decimal.floor(player.d.time).mul(-1)
                player.d.time = Decimal.add(player.d.time, times)
                times = times.mul(-1)
                if (hasUpgrade("f", 25)) {
                    layers.d.buyables[11].buyMax(times.mul(this.bulk()))
                    layers.d.buyables[12].buyMax(times.mul(this.bulk()))
                    layers.d.buyables[13].buyMax(times.mul(this.bulk()))
                }
            };
    },
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
        if (hasDUpg(24)) mult = mult.mul(getDUpgEff(24))
        if (hasFUpg(23)) mult = mult.mul(getFUpgEff(23))
        if (hasFUpg(45)) mult = mult.mul(getFUpgEff(45))
        if (hasAchievement("a", 43)) mult = mult.mul(2)
        if (hasAchievement("a", 44)) mult = mult.mul(2)
        mult = mult.mul(layers.f.effect2())
        if (hasAchievement("a", 52)) mult = mult.mul(layers.a.effect())
        mult = mult.mul(layers.d.buyables[12].effect())
        if (hasChallenge("s", 12)) mult = mult.mul(challengeEffect("s", 12))
        return mult
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("f", 3)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    doReset(resettingLayer){
        if (resettingLayer == "d") {
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
        if (!hasMilestone("d", 6) && !hasMilestone("a", 0)) player.u.upgrades = []
        if (!hasMilestone("d", 6)) player.s.upgrades = []
        if (!hasMilestone("d", 0) && !hasMilestone("a", 0)) player.u.milestones = []
        if (!hasMilestone("d", 0)) player.s.milestones = []
        }
        if (resettingLayer == "f") {
            player.d.buyables[11] = new Decimal(0)
            player.d.buyables[12] = new Decimal(0)
            player.d.buyables[13] = new Decimal(0)
            if (hasMilestone("f", 0)) {
                player.u.auto = true
                player.d.milestones = [0,1,2,3,4,5]
                player.s.milestones = [0,1,2,3]
                if (hasMilestone("f", 3)) player.d.upgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
                if (hasMilestone("f", 1)) player.d.milestones = [0,1,2,3,4,5,6,7,8,9,10]
                player.u.challenges[11] = 3
                player.u.challenges[12] = 3
                player.u.challenges[21] = 3
                player.u.challenges[22] = 3
                if (hasMilestone("f", 4)) {
                player.s.challenges[11] = 5
                player.s.challenges[12] = 5
                player.s.challenges[21] = 5
                player.s.challenges[22] = 5
                }
            }
        }
    },
    tabFormat: {
        "Milestones": {
            content: [
            "main-display",
            function() {if (!hasMilestone("d", 10)) return "prestige-button"},
            ["display-text",
            function() {if (hasMilestone("d", 10)) return "You are gaining " + format(getResetGain("d").div(100)) + " deaths per second."},
            ],
            "resource-display",
            "blank",
            ["display-text",
            "Deaths reset all previous progress.",
            ],
            "milestones"
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                function() {if (!hasMilestone("d", 10)) return "prestige-button"},
                ["display-text",
                function() {if (hasMilestone("d", 10)) return "You are gaining " + format(getResetGain("d").div(100)) + " deaths per second."},
                ],
                "resource-display",
                "blank",
                ["display-text",
                "Deaths reset all previous progress.",
                ],
                "upgrades",
            ],
            unlocked() { return hasMilestone("d", 2) }
        },
        "Buyables": {
            content: [
                "main-display",
                function() {if (!hasMilestone("d", 10)) return "prestige-button"},
                ["display-text",
                function() {if (hasMilestone("d", 10)) return "You are gaining " + format(getResetGain("d").div(100)) + " deaths per second."},
                ],
                "resource-display",
                "blank",
                ["display-text",
                "Buyables give free levels to the previous layer buyable.",
                ],
                "buyables",
            ],
            unlocked() { return hasMilestone("f", 5) }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 total death",
            effectDescription: "Keep uncoater/symptom milestones on reset.",
            done() { return player.d.total.gte(1) }
        },
        1: {
            requirementDescription: "2 total deaths",
            effectDescription: "You can buy max uncoaters.",
            done() { return player.d.total.gte(2) }
        },
        2: {
            requirementDescription: "3 total deaths",
            effectDescription: "Autobuy uncoaters and unlock upgrades.",
            toggles:[["d", "auto"]],
            done() { return player.d.total.gte(3) }
        },
        3: {
            requirementDescription: "4 total deaths",
            effectDescription: "Keep uncoater challenge completions.",
            done() { return player.d.total.gte(4) }
        },
        4: {
            requirementDescription: "6 total deaths",
            effectDescription: "'Smell Loss' buys 10x more and buyables cost nothing.",
            done() { return player.d.total.gte(6) }
        },
        5: {
            requirementDescription: "24 total deaths",
            effectDescription: "Uncoaters reset nothing.",
            done() { return player.d.total.gte(24) }
        },
        6: {
            requirementDescription: "48 total deaths",
            effectDescription: "Keep previous upgrades on reset.",
            done() { return player.d.total.gte(48) }
        },
        7: {
            requirementDescription: "96 total deaths",
            effectDescription: "Autobuy symptoms.",
            toggles:[["d", "autos"]],
            done() { return player.d.total.gte(96) }
        },
        8: {
            requirementDescription: "1,048,576 total deaths",
            effectDescription: "Unlock symptom challenges.",
            done() { return player.d.total.gte(1048576) }
        },
        9: {
            requirementDescription() {
                return format(Decimal.pow(2, 32)) + " total deaths"
            },
            effectDescription: "Symptoms reset nothing and 'Smell Loss' buys 2x often.",
            done() { return player.d.total.gte(Decimal.pow(2, 32)) }
        },
        10: {
            requirementDescription: "1.798e308 total deaths",
            effectDescription: "Gain 1% of death gain per second and disable prestige.",
            unlocked() {
                return hasDUpg(34) || player.f.unlocked
            },
            done() { return player.d.total.gte(Decimal.pow(2,1024))}
        },
    },
    buyables: {
		rows: 3,
        cols: 3,
        11: {
            title: "Severity Gain",
            scalebase() {
                return new Decimal(3)
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul("e16000")
                return cost.floor()
            },
            base() { 
                let base = player.d.points.add(10)
                base = base.log10().pow(100)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 11).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Multiply severity gain by "+format(this.base())+" after softcap (based on deaths).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("d", 11)) + extra
            },
            unlocked() { return hasMilestone("f", 5) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.d.points
                let target = Decimal.log10(s.div("e16000")).div(Decimal.log10(this.scalebase())).pow(2/3)
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul("e16000")
                let diff = target.sub(player.d.buyables[11])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[11] = player.d.buyables[11].add(diff)
                }
            },
        },
        12: {
            title: "Death Gain",
            scalebase() {
                return new Decimal(10)
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul("e17000")
                return cost.floor()
            },
            base() { 
                let base = player.f.points.add(10)
                base = base.log10().pow(3)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 12).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Multiply death gain by "+format(this.base())+" (based on fatality).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("d", 12)) + extra
            },
            unlocked() { return player.d.buyables[11].gte(1) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.d.points
                let target = Decimal.log10(s.div("e17000")).div(Decimal.log10(this.scalebase())).pow(2/3)
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul("e17000")
                let diff = target.sub(player.d.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[12] = player.d.buyables[12].add(diff)
                }
            },
        },
        13: {
            title: "Cases Boost",
            scalebase() {
                return new Decimal(1.007)
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, Decimal.pow(this.scalebase(),x).mul(1000)).mul("e17000")
                return cost.floor()
            },
            base() { 
                let base = player.points.add(10)
                base = base.log10().add(10)
                base = base.log10().add(10)
                base = base.log10().pow(0.004)
                return base.min(1.002)
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 13).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                let eff = Decimal.pow(base, x)
                if (x.gte(2500)) eff = Decimal.pow(base, x.mul(2500).pow(0.5))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Raise cases gain to "+format(this.base())+" (based on cases).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: ^" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("d", 13)) + extra
            },
            unlocked() { return player.d.buyables[12].gte(1) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.d.points // log1.003(log10(cost/e17k)/1k)=x
                let target = Decimal.log10(s.div("e17000").log10().div(1000)).div(Decimal.log10(this.scalebase()))
                target = target.ceil()
                let cost = Decimal.pow(10, Decimal.pow(this.scalebase(),target).mul(1000)).mul("e17000")
                let diff = target.sub(player.d.buyables[13])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[13] = player.d.buyables[13].add(diff)
                }
            },
        },
    },
    canReset() { return !hasMilestone("d", 10) },
    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "Deadly",
            description: "Deaths boosts symptom base.",
            cost: new Decimal(2),
            effect(){
            let d11 = player.d.points.add(10)
            d11 = Decimal.log10(d11).pow(4.5).add(1)
            if (hasSUpg(52)) d11 = d11.pow(getSUpgEff(52))
            if (inChallenge("s", 21)) d11 = new Decimal(1)
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
            cost: new Decimal(5),
            effect(){
            let d12 = player.points.add(1)
            d12 = Decimal.log10(d12).pow(0.1).add(1)
            if (hasDUpg(33)) d12 = d12.pow(getDUpgEff(33))
            if (hasFUpg(31)) d12 = d12.pow(getFUpgEff(31))
            if (inChallenge("s", 21)) d12 = new Decimal(1)
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
            cost: new Decimal(20),
            effect(){
            let d12 = player.d.points.add(1)
            d12 = d12.pow(20)
            if (inChallenge("s", 21)) d12 = new Decimal(1)
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
            cost: new Decimal(30),
            effect(){
            let d14 = player.d.points.add(10)
            d14 = Decimal.log10(d14).add(10)
            d14 = Decimal.log10(d14).pow(4)
            if (d14.gte(10)) d14 = d14.div(10).pow(0.3).mul(10)
            if (inChallenge("s", 21)) d14 = new Decimal(1)
            return d14
            },
            effectDisplay(){
                let dis = "^"+format(getDUpgEff(14))
                if (this.effect().gte(10)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasDUpg(13)
            }
        },
        21: {
            title: "Dangerous",
            description: "Deaths boost uncoater base.",
            cost: new Decimal(75),
            effect(){
            let d12 = player.d.points.add(1)
            d12 = d12.pow(30)
            if (inChallenge("s", 21)) d12 = new Decimal(1)
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
            cost: new Decimal(150),
            effect(){
            let d22 = player.d.upgrades.length
            d22 = Decimal.pow(2, d22)
            if (inChallenge("s", 21)) d22 = new Decimal(1)
            return d22
            },
            effectDisplay(){
            return format(getDUpgEff(22))+"x"
            },
            unlocked() {
                return hasDUpg(21)
            }
        },
        23: {
            title: "Kill",
            description: "'Smell Loss' buys 2x more.",
            cost: new Decimal(3e5),
            unlocked() {
                return hasDUpg(22)
            }
        },
        24: {
            title: "Dying",
            description: "Severity boosts death gain.",
            cost: new Decimal(1e8),
            effect(){
            let d24 = player.s.severity.add(10)
            d24 = Decimal.log10(d24).pow(0.5)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return format(getDUpgEff(24))+"x"
            },
            unlocked() {
                return hasDUpg(23)
            }
        },
        31: {
            title: "Pass Away",
            description() {
                let des =  "Deaths reduce recovery effect."
                if (hasDUpg(42)) des =  "Deaths boost severity gain."
                return des
            },
            cost: new Decimal(5e13),
            effect(){
            let d24 = player.d.points.add(10)
            d24 = Decimal.log10(d24).pow(-0.12)
            if (hasDUpg(42)) d24 = d24.pow(-1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(31))
            },
            unlocked() {
                return hasDUpg(24)
            }
        },
        32: {
            title: "Perish",
            description() {
                let des =  "Cases reduce recovery effect "
                if (hasDUpg(42)) des =  "Cases boost severity gain"
                return des + " and 'Smell Loss' buys 5x more."
            },
            cost: new Decimal(2e27),
            effect(){
            let d24 = player.points.add(10)
            d24 = Decimal.log10(d24).pow(-0.018)
            if (hasDUpg(42)) d24 = d24.pow(-1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(32))
            },
            unlocked() {
                return hasDUpg(31)
            }
        },
        33: {
            title: "Expire",
            description: "VP boost 'Fatal' and 'Smell Loss' buys 2x more and 2x often.",
            cost: new Decimal(3e46),
            effect(){
            let d24 = player.v.points.add(10)
            d24 = Decimal.log10(d24).pow(0.1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(33))
            },
            unlocked() {
                return hasDUpg(32)
            }
        },
        34: {
            title: "Decease",
            description: "Bought death upgrades boost 'Fever' and unlock more symptom upgrades.",
            cost: new Decimal(4e165),
            unlocked() {
                return hasDUpg(33)
            }
        },
        41: {
            title: "Demise",
            description: "Deaths make symptom scaling start later.",
            cost: new Decimal("1.5e2089"),
            effect(){
            let d24 = player.d.points.add(10)
            d24 = Decimal.log10(d24).pow(0.3).sub(1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "+"+format(getDUpgEff(41))
            },
            unlocked() {
                return hasSUpg(55)
            }
        },
        42: {
            title: "Murder",
            description: "Stop gaining recoveries and upgrades that reduce recovery effect boost severity gain.",
            cost: new Decimal("5e2208"),
            unlocked() {
                return hasDUpg(41)
            }
        },
        43: {
            title: "Slain",
            description: "Deaths boost cases gain.",
            cost: new Decimal("1.5e9101"),
            effect(){
            let d24 = player.d.points.add(10)
            d24 = Decimal.log10(d24).pow(0.025)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(43))
            },
            unlocked() {
                return hasDUpg(42)
            }
        },
        44: {
            title: "Slaughter",
            description: "Deaths boost severity gain exponent.",
            cost: new Decimal("8e9291"),
            effect(){
                let d24 = player.d.points.add(10)
                d24 = Decimal.log10(d24).pow(0.015)
                if (inChallenge("s", 21)) d24 = new Decimal(1)
                return d24
                },
                effectDisplay(){
                return "^"+format(getDUpgEff(44))
                },
            unlocked() {
                return hasDUpg(43)
            }
        },
    },
})
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
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
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
        ["display-text", function() {if (player.u.unlocked) return "You have "+formatWhole(player.u.points)+" uncoaters."}],
        "blank",
        ["display-text", function() {if (player.s.unlocked) return "You have "+formatWhole(player.s.points)+" symptoms."}],
        "blank",
        ["display-text", function() {if (player.s.unlocked) return "You have "+format(player.s.severity)+" severity."}],
        "blank",
        ["display-text", function() {if (player.d.unlocked) return "You have "+format(player.d.points)+" deaths."}],
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
        "blank",
        ["display-text", function() {if (hasSUpg(31) || player.d.unlocked) return "'Smell Loss' autobuy:"+formatWhole(tmp.s.bulk)+"/" + format(1/tmp.s.speed)+"s (" + format(Decimal.mul(tmp.s.bulk,tmp.s.speed)) + "/s)"}],
        "blank",
        ["display-text", function() {if (hasFUpg(25)) return "'More Fatal' autobuy:"+formatWhole(tmp.d.bulk)+"/" + format(1/tmp.d.speed)+"s (" + format(Decimal.mul(tmp.d.bulk,tmp.d.speed)) + "/s)"}],
    ],
})
addLayer("a", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    tooltip() {
      return "Achievements"
    },
    color: "#FFFF00",
    nodeStyle() {return {
        "background": "radial-gradient(#FFFF00, #d5ad83)" ,
    }},
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "Achievement Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
    achievements: {
        rows: 5,
        cols: 6,
        11: {
            name: "Start",
            tooltip: "Get 2 cases. Reward: 1 AP",
            done() {
                return player.points.gte(2)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        12: {
            name: "Infect",
            tooltip: "Get 10 cases. Reward: 1 AP",
            done() {
                return player.points.gte(10)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        13: {
            name: "Thousand Infected",
            tooltip: "Get 1,000 cases. Reward: 1 AP",
            done() {
                return player.points.gte(1000)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        14: {
            name: "Million Infected",
            tooltip: "Get 1,000,000 cases. Reward: 1 AP",
            done() {
                return player.points.gte(1e6)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        15: {
            name: "Covid 19",
            tooltip: "Get 63,154,455 cases. Reward: 1 AP",
            done() {
                return player.points.gte(63154455)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        16: {
            name: "World Infected",
            tooltip: "Get 7.8e9 cases. Reward: 1 AP",
            done() {
                return player.points.gte(7.8e9)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        21: {
            name: "Infected infections",
            tooltip: "Get 10 infectivity. Reward: 1 AP, AP boosts VP",
            done() {
                return player.i.points.gte(10)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        22: {
            name: "Upgraded infections",
            tooltip: "Get 5 infectivity upgrades. Reward: 1 AP",
            done() {
                return player.i.upgrades.length>=5
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        23: {
            name: "Replicated",
            tooltip: "Get 1 replicator. Reward: 2 AP",
            done() {
                return player.r.points.gte(1)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        24: {
            name: "Infected company",
            tooltip: "Get 1e100 cases. Reward: 2 AP",
            done() {
                return player.points.gte(1e100)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        25: {
            name: "Infinite infections",
            tooltip: "Get 1.798e308 cases. Reward: 2 AP",
            done() {
                return player.points.gte("1.798e308")
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        26: {
            name: "SUS Upgrade",
            tooltip: "Get 7 infectivity upgrades. Reward: 2 AP",
            done() {
                return player.i.upgrades.length>=7
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        31: {
            name: "Uncoated",
            tooltip: "Get 1 uncoater. Reward: 2 AP, AP boosts infectivity and keep virus upgrades",
            done() {
                return player.u.points.gte(1)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        32: {
            name: "(softcapped)",
            tooltip: "Get 2 uncoater upgrades. Reward: 2 AP",
            done() {
                return player.u.upgrades.length>=2
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        33: {
            name: "(hardcapped)",
            tooltip: "Get 5 uncoater upgrades. Reward: 2 AP",
            done() {
                return player.u.upgrades.length>=5
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        34: {
            name: "Challenging",
            tooltip: "Complete an uncoater challenge. Reward: 2 AP",
            done() {
                return challengeCompletions("u", 11)>=1
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        35: {
            name: "Severe case",
            tooltip: "Get 1 severity. Reward: 3 AP",
            done() {
                return player.s.severity.gte(1)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        36: {
            name: "Auto",
            tooltip: "Get 11 symptom upgrades. Reward: 3 AP",
            done() {
                return player.s.upgrades.length>=11
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        41: {
            name: "Dead",
            tooltip: "Get 1 death. Reward: 3 AP, Autobuy buyables, 'Smell Loss' buys 2x more and faster, AP boosts severity, Keep I/R upgrades",
            done() {
                return player.d.points.gte(1)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        42: {
            name: "Automated",
            tooltip: "Get 8 death milestones. Reward: 3 AP, AP formula is better",
            done() {
                return hasMilestone("d", 7)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        43: {
            name: "Corona Death",
            tooltip: "Get 1,466,925 deaths. Reward: 3 AP, Double death gain",
            done() {
                return player.d.points.gte(1466925)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        44: {
            name: "Coffin",
            tooltip: "Get 1e30 deaths. Reward: 3 AP, Double death gain",
            done() {
                return player.d.points.gte(1e10)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        45: {
            name: "Coffin Dance",
            tooltip: "Get 1e100 deaths. Reward: 4 AP",
            done() {
                return player.d.points.gte(1e100)
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        46: {
            name: "Coughin Dance",
            tooltip: "Get 14 death upgrades. Reward: 4 AP",
            done() {
                return player.d.upgrades.length>=14
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        51: {
            name: "Mortal Kombat",
            tooltip: "Get 1 fatality. Reward: 4 AP",
            done() {
                return player.f.points.gte(1)
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        52: {
            name: "Kortal Mombat",
            tooltip: "Get 2 fatality upgrades. Reward: 4 AP, AP boosts death gain",
            done() {
                return player.f.upgrades.length>=2
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        53: {
            name: "DIMENSIONS??",
            tooltip: "Get 6 fatality milestones. Reward: 4 AP, 'More Fatal' buys 5x more and 2x faster",
            done() {
                return player.f.milestones.length>=6
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        54: {
            name: "NG+++ INFECTED",
            tooltip: "Get ee18 cases. Reward: 4 AP",
            done() {
                return player.points.gte("ee18")
            },
            onComplete() {
                addPoints("a",4)
            }
        },
    },
    effect() {
        let eff = player.a.points
        if (hasAchievement("a", 42)) eff = Decimal.pow(1.2, eff.pow(1.5))
        else eff = Decimal.pow(1.07, eff)
        return eff
    },
    effectDescription() {
        return "which boost cases gain by " + format(tmp.a.effect)
    },
    tabFormat: {
        "Achievements" :{
            content: ["main-display",
            "achievements"]
        },
        "Milestones" :{
            content: ["milestones"]
        }
    },
    milestones: {
        0: {
            requirementDescription: "50 Achievement Points",
            effectDescription: "Keep I,R,U upgrades and milestones, and autobuy 2x more and faster.",
            done() { return player.a.points.gte(50) }
        }
    },
    
})
addLayer("f", {
    name: "fatality",
    symbol: "F",
    position: 0,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        unlocked: false,
        p: new Decimal(0),
        mult: new Decimal(0),
        d1: new Decimal(0),
        d2: new Decimal(0),
        d3: new Decimal(0),
        d4: new Decimal(0),
        d5: new Decimal(0),
        d6: new Decimal(0),
        resettime: new Decimal(0.001)
    }},
    color: "#f53d63",
    nodeStyle() {return {
        "background": (player.f.unlocked||canReset("f"))?"radial-gradient(#d5a776, #f53d63)":"#bf8f8f" ,
    }},
    componentStyles: {
        "prestige-button"() {return { "background": canReset("f")?"radial-gradient(#d5a776, #f53d63)":"#bf8f8f" }},
    },
    requires: new Decimal("e10450"),
    resource: "fatality",
    baseResource: "deaths",
    baseAmount() { return player.d.points },
    type: "custom",
    exponent: 0.3,
    branches: ["d","s","u"],
    row: "3",
    hotkeys: [
        {
            key:"f", description: "F:Reset for fatality", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    powergain() {
        let pgain = tmp.f.buyables[11].gain
        if (hasFUpg(34)) pgain = pgain.mul(getFUpgEff(34))
        return pgain
    },
    fDimMult() {
        let mult = new Decimal(1)
        if (hasFUpg(35)) mult = mult.mul(getFUpgEff(35))
        if (hasFUpg(41)) mult = mult.mul(getFUpgEff(41))
        mult = mult.mul(tmp.f.buyables[31].effect)
        return mult
    },
    update(diff) {
        player.f.p = player.f.p.add(this.powergain().mul(diff))
        player.f.resettime = player.f.resettime.add(diff)
        if (hasMilestone("f",7)) generatePoints("f",diff/100)
        if (hasMilestone("f",9)) generatePoints("f",diff)
        player.f.buyables[11] = player.f.buyables[11].add(tmp.f.buyables[12].gain.mul(diff))
        player.f.buyables[12] = player.f.buyables[12].add(tmp.f.buyables[13].gain.mul(diff))
        player.f.buyables[13] = player.f.buyables[13].add(tmp.f.buyables[14].gain.mul(diff))
        player.f.buyables[14] = player.f.buyables[14].add(tmp.f.buyables[21].gain.mul(diff))
        player.f.buyables[21] = player.f.buyables[21].add(tmp.f.buyables[22].gain.mul(diff))
    },
    canReset() {return player.d.points.gte("e10450") && !hasMilestone("f",9)},
    gainMult() {
        let mult = new Decimal(1)
        if (hasFUpg(12)) mult = mult.mul(getFUpgEff(12))
        if (hasFUpg(14)) mult = mult.mul(getFUpgEff(14))
        if (hasFUpg(22)) mult = mult.mul(getFUpgEff(22))
        if (hasFUpg(24)) mult = mult.mul(getFUpgEff(24))
        mult = mult.mul(this.peffect())
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        if (hasFUpg(25)) exp = exp.add(1)
        if (hasFUpg(32)) exp = exp.add(getFUpgEff(32))
        if (hasFUpg(42)) exp = exp.add(getFUpgEff(42))
        if (hasFUpg(51)) exp = exp.add(getFUpgEff(51))
        return exp
    },
    getResetGain() {
        if (tmp["f"].baseAmount.lt(tmp["f"].requires)) return new Decimal(0)
        let gain = tmp["f"].baseAmount.div(tmp["f"].requires).mul(10).log10().pow(tmp["f"].exponent).pow(this.gainExp()).mul(this.gainMult()).floor()
        return gain
    },
    getNextAt() {
        let next = layers.f.getResetGain().add(1)
		if (next.gte(tmp["f"].softcap)) next = next.div(tmp["f"].softcap.pow(decimalOne.sub(tmp["f"].softcapPower))).pow(decimalOne.div(tmp["f"].softcapPower))
		next = Decimal.pow(10,(next.div(this.gainMult()).root(tmp["f"].exponent).root(this.gainExp()))).mul(tmp["f"].requires).div(10).max(tmp["f"].requires)
		return next;
    },
    prestigeButtonText() {
        let text =  `${ player["f"].points.lt(1e3) ? (tmp["f"].resetDescription !== undefined ? tmp["f"].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp["f"].resetGain)}</b> ${tmp["f"].resource} ${tmp["f"].getResetGain.lt(100) && player["f"].points.lt(1e3) ? `<br><br>Next at ${ (tmp["f"].roundUpCost ? formatWhole(tmp["f"].nextAt) : format(tmp["f"].nextAt))} ${ tmp["f"].baseResource }` : ""}` + "<br>"
        let gain = this.getResetGain().div(player.f.resettime)
        if (gain.gte(10)) text += format(gain) + "/s"
        else text += format(gain.mul(60)) + "/min"
        return text
    },
    layerShown() {
        return hasSUpg(55) || player.f.unlocked
    },
    doReset() {
        player.d.points = new Decimal(0)
        player.d.best = new Decimal(0)
        player.d.total = new Decimal(0)
        player.d.upgrades = []
        player.d.milestones = []
        player.f.resettime = new Decimal(0.001)
    },
    multpd() {
        let base = new Decimal(2)
        return base
    },
    effect() {
        let eff = player.f.best.add(1)
        eff = eff.pow(eff.log10().add(1).pow(1.7)).pow(15)
        if (hasFUpg(15)) eff = eff.pow(getFUpgEff(15))
        if (eff.gte("e2e6")) eff = Decimal.pow(10,eff.div("e2e6").log10().pow(0.85)).mul("e2e6")
        return eff
    },
    effect2() {
        let eff = player.f.best.add(1)
        eff = eff.pow(eff.log10().add(1).pow(1.2)).pow(2)
        return eff
    },
    peffect() {
        let eff = player.f.p.add(1)
        eff = eff.pow(0.6)
        return eff
    },
    effectDescription() {
        return "which boost cases, VP, infectivity, severity by " + format(this.effect()) + ", and death gain by " +format(this.effect2()) + " (based on best)."
    },
    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                ["display-text", 
                function() {
                    if (hasMilestone("f",9)) return "You are gaining " + format(tmp.f.getResetGain) + " fatality per second."
                }
                ],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                "milestones",
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                ["display-text", 
                function() {
                    if (hasMilestone("f",9)) return "You are gaining " + format(tmp.f.getResetGain) + " fatality per second."
                }
                ],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                "upgrades",
            ]
        },
        "Dimensions": {
            content: [
                "main-display",
                ["display-text", 
                function() {
                    if (hasMilestone("f",9)) return "You are gaining " + format(tmp.f.getResetGain) + " fatality per second."
                }
                ],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["display-text", 
                function() {
                    return "You have " + format(player.f.p) + " fatality power, which boosts fatality gain by " + format(tmp.f.peffect)
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.powergain) + " fatality power per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[12].gain) + " Fatality Dimension 1 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[13].gain) + " Fatality Dimension 2 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[14].gain) + " Fatality Dimension 3 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[21].gain) + " Fatality Dimension 4 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[22].gain) + " Fatality Dimension 5 per second."
                }
                ],
                "blank",
                "clickables",
                "buyables",
            ],
            unlocked() {return hasMilestone("f", 6)}
        }
    },
    milestones: {
        0: {
            requirementDescription() { return "2 total fatality" },
            effectDescription() { return "Keep first 5 death milestones on reset." },
            done() { return player.f.total.gte(2) }
        },
        1: {
            requirementDescription() { return "3 total fatality" },
            effectDescription() { return "Keep next 6 death milestones on reset." },
            done() { return player.f.total.gte(3) }
        },
        3: {
            requirementDescription() { return "10 total fatality" },
            effectDescription() { return "Keep previous upgrades on reset." },
            done() { return player.f.total.gte(10) }
        },
        4: {
            requirementDescription() { return "25 total fatality" },
            effectDescription() { return "Keep symptom challenges on reset." },
            done() { return player.f.total.gte(25) }
        },
        5: {
            requirementDescription() { return "3,000,000 total fatality" },
            effectDescription() { return "Unlock death buyables." },
            done() { return player.f.total.gte(3e6) }
        },
        6: {
            requirementDescription() { return "1e11 total fatality" },
            effectDescription() { return "Unlock fatality dimensions and death buyables cost nothing." },
            done() { return player.f.total.gte(1e11) }
        },
        7: {
            requirementDescription() { return "3e33 total fatality" },
            effectDescription() { return "Gain 1% of fatality gain per second." },
            done() { return player.f.total.gte(3e33) }
        },
        8: {
            requirementDescription() { return "4.44e44 total fatality" },
            effectDescription() { return "Unlock Dimension Multiplier and autobuyers buy 100x more." },
            done() { return player.f.total.gte(4.44e44) }
        },
        9: {
            requirementDescription() { return format(Decimal.pow(2,512)) + " total fatality" },
            effectDescription() { return "Gain 100% of fatality gain per second and disable prestige." },
            done() { return player.f.total.gte(Decimal.pow(2,512)) }
        },
    },
    clickables: {
        rows: 1,
        cols: 1,
        11: {
            display() {return "<h2>Max All</h2>"},
            canClick() {return true},
            onClick() {
                layers.f.buyables[11].buyMax()
                layers.f.buyables[12].buyMax()
                layers.f.buyables[13].buyMax()
                layers.f.buyables[14].buyMax()
                layers.f.buyables[21].buyMax()
                layers.f.buyables[22].buyMax()
                layers.f.buyables[31].buyMax()
            }
        },
    },
    buyables: {
		rows: 3,
        cols: 4,
        11: {
			title: "Fatality Dimension 1",
			cost(x=player.f.d1) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e3, x).mul(1e11)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 11)
                return total
            },
            bought() {
                let bought = player.f.d1
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x).mul(tmp.f.fDimMult);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces fatality power.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e11).log10().div(3).ceil()
                let diff = max.sub(player.f.d1)
                cost = Decimal.sub(1,Decimal.pow(1e3,max)).div(-999).mul(1e11)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        12: {
			title: "Fatality Dimension 2",
			cost(x=player.f.d2) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e4, x).mul(1e14)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 12)
                return total
            },
            bought() {
                let bought = player.f.d2
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x).mul(tmp.f.fDimMult);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 1.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d2 = player.f.d2.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e14).log10().div(4).ceil()
                let diff = max.sub(player.f.d2)
                cost = Decimal.sub(1,Decimal.pow(1e4,max)).div(-9999).mul(1e14)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d2 = player.f.d2.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        13: {
			title: "Fatality Dimension 3",
			cost(x=player.f.d3) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x).mul(1e15)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 13)
                return total
            },
            bought() {
                let bought = player.f.d3
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x).mul(tmp.f.fDimMult);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 2.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d3 = player.f.d3.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e15).log10().div(5).ceil()
                let diff = max.sub(player.f.d3)
                cost = Decimal.sub(1,Decimal.pow(1e5,max)).div(-99999).mul(1e15)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d3 = player.f.d3.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        14: {
			title: "Fatality Dimension 4",
			cost(x=player.f.d4) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e6, x).mul(1e18)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 14)
                return total
            },
            bought() {
                let bought = player.f.d4
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x).mul(tmp.f.fDimMult);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 3.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d4 = player.f.d4.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e18).log10().div(6).ceil()
                let diff = max.sub(player.f.d4)
                cost = Decimal.sub(1,Decimal.pow(1e6,max)).div(-999999).mul(1e18)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d4 = player.f.d4.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        21: {
			title: "Fatality Dimension 5",
			cost(x=player.f.d5) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e8, x).mul(1e21)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 21)
                return total
            },
            bought() {
                let bought = player.f.d5
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x).mul(tmp.f.fDimMult);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 4.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d5 = player.f.d5.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e21).log10().div(8).ceil()
                let diff = max.sub(player.f.d5)
                cost = Decimal.sub(1,Decimal.pow(1e8,max)).div(-99999999).mul(1e21)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d5 = player.f.d5.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        22: {
			title: "Fatality Dimension 6",
			cost(x=player.f.d6) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e10, x).mul(1e26)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 22)
                return total
            },
            bought() {
                let bought = player.f.d6
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x).mul(tmp.f.fDimMult);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 5.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d6 = player.f.d6.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e26).log10().div(10).ceil()
                let diff = max.sub(player.f.d6)
                cost = Decimal.sub(1,Decimal.pow(1e10,max)).div(-9999999999).mul(1e26)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d6 = player.f.d6.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        31: {
			title: "Fatality Dimension Multiplier",
			cost(x=player.f.mult) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x).mul(1e45)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.1)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 31)
                return total
            },
            bought() {
                let bought = player.f.mult
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Multiply fatality dimensions by 1.1.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 8) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)
                    player.f.mult = player.f.mult.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let max = player.f.points.div(1e45).log10().ceil()
                let diff = max.sub(player.f.mult)
                cost = Decimal.sub(1,Decimal.pow(10,diff)).div(-9).mul(cost)
                if (this.canAfford()) {
                    player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.mult = player.f.mult.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
    },
    upgrades: {
        rows: 6,
        cols: 6,
        11: {
            title: "Lethality",
            description: "Symptoms boost severity after softcap at reduced effect.",
            cost: new Decimal(4),
            effect() {
                let eff = Decimal.pow(10,tmp.s.effbase.pow(player.s.points).log10().pow(0.75))
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(11)) + "x"
            }
        },
        12: {
            title: "Deadliness",
            description: "Deaths boost fatality gain.",
            cost: new Decimal(25),
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(12)) + "x"
            },
            unlocked() {
                return hasFUpg(11)
            }
        },
        13: {
            title: "Mortality",
            description: "'Asymptomatic' reward is applied after softcap at reduced effect.",
            cost: new Decimal(200),
            effect() {
                let eff = challengeEffect("s", 11)
                eff = eff.pow(0.2)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(13)) + "x"
            },
            unlocked() {
                return hasFUpg(12)
            }
        },
        14: {
            title: "Fatally",
            description: "Cases boost fatality gain.",
            cost: new Decimal(500),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().pow(0.075)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(14)) + "x"
            },
            unlocked() {
                return hasFUpg(13)
            }
        },
        15: {
            title: "Fatalness",
            description: "Fatality 1st effect is applied after softcap and is stronger based on deaths.",
            cost: new Decimal(2500),
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(2.5)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(15))
            },
            unlocked() {
                return hasFUpg(14)
            }
        },
        21: {
            title: "Severely",
            description: "Fatality boosts severity gain exponent and unlock 3 more symptom buyables.",
            cost: new Decimal(5000),
            effect() {
                let eff = player.f.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(0.25)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(21))
            },
            unlocked() {
                return hasFUpg(15)
            }
        },
        22: {
            title: "Severer",
            description: "Severity boosts fatality gain.",
            cost: new Decimal(8000),
            effect() {
                let eff = player.s.severity.add(10)
                eff = eff.pow("3e-7")
                if (eff.gte(1e30)) eff = Decimal.pow(10,eff.div(1e30).log10().pow(0.4)).mul(1e30)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(22))+"x"
                if (getFUpgEff(22).gte(1e30)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(21)
            }
        },
        23: {
            title: "Deadlier",
            description: "Fatality boosts death gain.",
            cost: new Decimal(30000),
            effect() {
                let eff = player.f.points.add(1)
                eff = Decimal.pow(10,eff.log10().pow(1.75)).pow(15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(23))+"x"
            },
            unlocked() {
                return hasFUpg(22)
            }
        },
        24: {
            title: "Infectious",
            description: "Infectivity boosts fatality gain.",
            cost: new Decimal(55555),
            effect() {
                let eff = player.i.points.add(1)
                eff = Decimal.pow(10,eff.log10().pow(0.2)).pow(0.005)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(24))+"x"
            },
            unlocked() {
                return hasFUpg(23)
            }
        },
        25: {
            title: "More Fatal",
            description: "Add 1 to base fatality gain exponent and autobuy death buyables 100 per second.",
            cost: new Decimal(6e6),
            unlocked() {
                return hasFUpg(24)
            }
        },
        31: {
            title: "Fataler",
            description: "Infectivity boosts 'Fatal'.",
            cost: new Decimal(1e8),
            effect() {
                let eff = player.i.points.add(10)
                eff = eff.log10().pow(0.13)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(31))
            },
            unlocked() {
                return hasFUpg(25)
            }
        },
        32: {
            title: "Fatalest",
            description: "Cases add to the fatality exponent.",
            cost: new Decimal(1e9),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(0.175)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(32))
            },
            unlocked() {
                return hasFUpg(31)
            }
        },
        33: {
            title: "Fatal Infection",
            description: "Fatality power boosts 'Infection'.",
            cost: new Decimal(3e13),
            effect() {
                let eff = player.f.p.add(10)
                eff = eff.log10().pow(0.75)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(33))
            },
            unlocked() {
                return hasMilestone("f", 6)
            }
        },
        34: {
            title: "Powerful Fatalities",
            description: "Fatality boosts fatality power gain.",
            cost: new Decimal(2e14),
            effect() {
                let eff = player.f.points.add(1)
                eff = eff.pow(0.07)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(34))+"x"
            },
            unlocked() {
                return hasFUpg(33)
            }
        },
        35: {
            title: "Death Dimension",
            description: "Deaths boost fatality dimensions.",
            cost: new Decimal(4e16),
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().pow(0.13)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(35))+"x"
            },
            unlocked() {
                return hasFUpg(34)
            }
        },
        41: {
            title: "Case Dimension",
            description: "Cases boost fatality dimensions.",
            cost: new Decimal(1e23),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(41))+"x"
            },
            unlocked() {
                return hasFUpg(35)
            }
        },
        42: {
            title: "Powerful Power",
            description: "Fatality power boosts fatality exponent.",
            cost: new Decimal(3.5e35),
            effect() {
                let eff = player.f.p.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(42))
            },
            unlocked() {
                return hasFUpg(41)
            }
        },
        43: {
            title: "Powerful Power",
            description: "Fatality power boosts cases gain.",
            cost: new Decimal(4e40),
            effect() {
                let eff = player.f.p.add(10)
                eff = eff.log10().pow(0.14)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(43))
            },
            unlocked() {
                return hasFUpg(42)
            }
        },
        44: {
            title: "Fatal Fatalities",
            description: "Fatality boosts cases gain.",
            cost: new Decimal(5.05e50),
            effect() {
                let eff = player.f.points.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(44))
            },
            unlocked() {
                return hasFUpg(43)
            }
        },
        45: {
            title: "Deadly Power",
            description: "Fatality power boosts death gain.",
            cost: new Decimal(6.06e60),
            effect() {
                let eff = player.f.p.add(1)
                eff = eff.pow(1000)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(45))+"x"
            },
            unlocked() {
                return hasFUpg(44)
            }
        },
        51: {
            title: "Fatal Deaths",
            description: "Deaths add to the fatality exponent.",
            cost: new Decimal(7.07e70),
            effect() {
                let eff = player.d.points.add(1)
                eff = eff.log10().pow(0.197)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(51))
            },
            unlocked() {
                return hasFUpg(45)
            }
        },
    },
})