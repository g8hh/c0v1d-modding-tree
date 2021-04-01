const STATIC_SCALE_STARTS = {
    "2": function() { return new Decimal(2000) },
    "3": function() { return new Decimal(320) },
    "4": function() { return new Decimal(10) },
}

function scaleStaticCost(gain, row) {
    let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
    let g = gain
    if (gain.gte(start)) { 
        if (row == 1) gain = gain.pow(2).div(start);
        if (row == 2) {
            gain = gain.pow(3).div(Decimal.pow(start, 2))
            if (g.gte(1e34)) gain = gain.div(9.765625e96).pow(5).mul(9.765625e96)
        }
        if (row == 3) {
            let scale = tmp.e.infScale
            if (g.gte(3e6)) g = Decimal.pow(1.000005,g.sub(3e6)).mul(3e6)
            if (g.gte(scale.add(1e3))) g = g.pow(5).div(Decimal.pow(scale.add(1e3), 4))
            if (g.gte(scale)) g = g.pow(3).div(Decimal.pow(scale, 2))
            if (g.gte(30)) gain = Decimal.pow(1.08,g.sub(30)).mul(30)
            gain = gain.pow(3).div(Decimal.pow(start, 2))
        };
    }
	return gain
}
function startCChallenge(id) {
    doReset("f")
    player.f.p = new Decimal(0)
    player.f.cp = new Decimal(0)
    player.f.casuals = new Decimal(1)
    player.f.cboosts = new Decimal(0)
    player.f.points = new Decimal(0)
    player.f.resettime = new Decimal(0.001)
    player.f.sac = new Decimal(0)
    player.f.d1 = new Decimal(0)
    player.f.d2 = new Decimal(0)
    player.f.d3 = new Decimal(0)
    player.f.d4 = new Decimal(0)
    player.f.d5 = new Decimal(0)
    player.f.d6 = new Decimal(0)
    player.f.d7 = new Decimal(0)
    player.f.d8 = new Decimal(0)
    player.f.mult = new Decimal(0)
    player.f.buyables[11] = new Decimal(0)
    player.f.buyables[12] = new Decimal(0)
    player.f.buyables[13] = new Decimal(0)
    player.f.buyables[14] = new Decimal(0)
    player.f.buyables[21] = new Decimal(0)
    player.f.buyables[22] = new Decimal(0)
    player.f.buyables[23] = new Decimal(0)
    player.f.buyables[24] = new Decimal(0)
    player.f.buyables[31] = new Decimal(0)
    player.f.buyables[32] = (hasFUpg(84) && id !== 22 && id !== 31) ? new Decimal(2) : new Decimal(0)
    player.f.buyables[33] = new Decimal(0) 
    player.f.buyables[71] = player.f.buyables[71].min(player.f.cd[0])
    player.f.buyables[72] = player.f.buyables[72].min(player.f.cd[1])
    player.f.buyables[73] = player.f.buyables[73].min(player.f.cd[2])
    player.f.buyables[74] = player.f.buyables[74].min(player.f.cd[3])
    player.f.buyables[81] = player.f.buyables[81].min(player.f.cd[4])
    player.f.buyables[82] = player.f.buyables[82].min(player.f.cd[5])
}

function startIChallenge(id) {
    doReset("i")
    player.v.upgrades = []
    player.e.ct = 0
    player.i.points = new Decimal(0)
    player.r.points = new Decimal(0)
    player.v.points = new Decimal(0)
    player.points = new Decimal(0)
}

function softcapStaticGain(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
    if (gain.gte(start)) {
        if (row == 1) gain = gain.times(start).pow(1/2);
        if (row == 2) {
            gain = gain.times(Decimal.pow(start,2)).root(3)
        }
        if (row == 3) {
            let scale = tmp.e.infScale
            gain = gain.times(Decimal.pow(start,2)).root(3)
            if (gain.gte(30)) gain = gain.div(30).log(1.08).add(30)
            if (gain.gte(scale)) gain = gain.times(Decimal.pow(scale,2)).root(3)
            if (gain.gte(scale.add(1e3))) gain = gain.times(Decimal.pow(scale.add(1e3),4)).root(5)
            if (gain.gte(3e6)) gain = gain.div(3e6).log(1.000005).add(3e6)
        }
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
    softcap: Decimal.pow(10,1e7),
    softcapPower: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if(hasVUpg(22)) mult = mult.mul(getVUpgEff(22))
        if(hasVUpg(31)) mult = mult.mul(getVUpgEff(31))
        if(hasIUpg(11)) mult = mult.mul(getIUpgEff(11))
        mult = mult.mul(tmp.d.effect)
        mult = mult.mul(tmp.f.effect)
        if (hasAchievement("a", 21)) mult = mult.mul(tmp.a.effect)
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
                base = base.add(tmp.r.effect2)
                if(hasIUpg(21) && hasIUpg(31)) base = base.mul(getIUpgEff(21).max(1))
                if(hasIUpg(22) && hasIUpg(32)) base = base.mul(getIUpgEff(22).max(1))
                if(hasUUpg(11)) base = base.mul(getUUpgEff(11))
                if(hasSUpg(24)) base = base.mul(getSUpgEff(24))
                base = base.mul(tmp.s.buyables[23].effect)
                return base
            },
            effect(){
                let eff = this.base()
                let v12sf = Decimal.pow(10,1e4)
                let v12sf2 = Decimal.pow(10,1e10)
                let v12sf3 = Decimal.pow(10,1e50)
                if(hasVUpg(23)) eff = eff.pow(getVUpgEff(23))
                if(hasFUpg(33)) eff = eff.pow(getFUpgEff(33))
                if(eff.gte(v12sf)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf)).pow(3/4)).mul(v12sf)
                if(eff.gte(v12sf2)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf2)).pow(0.9)).mul(v12sf2)
                if(eff.gte(v12sf3)) eff = Decimal.pow(10,Decimal.pow(10,eff.div(v12sf3).log10().log10().pow(0.99))).mul(v12sf3)
                if (eff.gte(Decimal.pow(10,Decimal.pow(10,1e3)))) eff = eff.log10().pow(Decimal.pow(10,997))
                if(hasUpgrade("e",11)) eff = eff.pow(upgradeEffect("e",11))
                if(hasUpgrade("e",16)) eff = eff.pow(tmp.e.upgrades[16].effect2)
                if(hasUpgrade("e",61)) eff = eff.pow(upgradeEffect("e",61))
                if(hasUpgrade("e",111)) eff = eff.pow(upgradeEffect("e",111))
                if (inChallenge("u", 12)) eff = new Decimal(1)
                return eff
            },
            effectDisplay(){
                let v12dis = format(getVUpgEff(12))+"x"
                let v12sf = Decimal.pow(10,1e4)
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
                let v13sf = new Decimal(1.797e308)
                let v13sf2 = Decimal.pow(10,2370)
                let v13sf3 = Decimal.pow(10,25e8)
                let v13sf4 = Decimal.pow(10,1e14)
                let v13sf5 = Decimal.pow(10,1e50)
                let v13sff = new Decimal(0.5)
                let v13sff2 = new Decimal(0.8)
                let v13sff3 = new Decimal(10/11)
                let v13sff4 = new Decimal(5/6)
                let v13sff5 = new Decimal(0.8)
                v13 = v13.pow(1/2)
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                if(hasUUpg(12)) v13sf2 = v13sf2.mul(getUUpgEff(12)).add(1).max(1)
                if(hasUUpg(12)) v13sf3 = v13sf3.mul(getUUpgEff(12)).add(1).max(1)
                if(hasUUpg(12)) v13sf4 = v13sf4.mul(getUUpgEff(12)).add(1).max(1)
                if(hasUUpg(12)) v13sf5 = v13sf5.mul(getUUpgEff(12)).add(1).max(1)
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
                if(v13.gte(v13sf5)) {
                    v13 = Decimal.pow(10,Decimal.pow(10,v13.div(v13sf5).log10().add(1).max(1).log10().pow(v13sff5))).mul(v13sf5)
                }
                if (v13.gte("eee3")) v13 = v13.log10().pow("e997")
                return v13  
            },
            effectDisplay(){
                let v13sf = new Decimal(1.797e308)
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
                let v21 = player.points.add(1).max(1)
                let v21sf = Decimal.pow(10,1e5)
                let v21sf2 = Decimal.pow(10,1e16)
                let v21sf3 = Decimal.pow(10,1e90)
                v21 = Decimal.log10(v21).pow(2).add(2)
                if(hasVUpg(32)) v21 = v21.pow(getVUpgEff(32))
                if(hasRUpg(23)) v21 = v21.pow(getRUpgEff(23))
                if(v21.gte(v21sf)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf)).pow(0.8)).mul(v21sf)
                if(v21.gte(v21sf2)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf2)).pow(0.88)).mul(v21sf2)
                if(v21.gte(v21sf3)) v21 = Decimal.pow(10,Decimal.pow(10,Decimal.log10(v21.div(v21sf3)).log10().pow(0.95))).mul(v21sf3)
                if (v21.gte(Decimal.pow(10,Decimal.pow(10,1e3)))) v21 = v21.log10().pow(Decimal.pow(10,997))
                return v21
            },
            effectDisplay(){
                let v21sf = Decimal.pow(10,1e5)
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
                let v22 = player.points.add(1).max(1)
                v22 = Decimal.log10(v22).add(1).max(1)
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
                let v31 = player.v.points.add(10).max(10)
                v31 = Decimal.log10(v31).pow(1.3)
                if(hasRUpg(12)) v31 = v31.pow(getRUpgEff(12))
                if (v31.gte("eee50")) v31 = v31.div("eee50").log10().log10().pow(0.85).pow10().pow10().mul("eee50")
                if (v31.gte(Decimal.pow(10,Decimal.pow(10,Decimal.pow(10,4e4))))) v31 = v31.log10().log10().pow(Decimal.pow(10,39995).mul(2.5)).pow10()
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
                let v32 = player.v.points.add(10).max(10)
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
                let v33 = player.points.add(10).max(10)
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
    requires: new Decimal(7.8e9),
    resource: "infectivity",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.08,
    branches: ["v"],
    softcap: new Decimal(Decimal.pow(10,1e7)),
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
        let eff = player.i.points.add(1).max(1)
        eff = eff.pow(2)
        if (inChallenge("u", 12)) eff = new Decimal(1)
        if (eff.gte(Decimal.pow(10,1e16))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e16)).log10().pow(0.88)).mul(Decimal.pow(10,1e16))
        if (eff.gte(Decimal.pow(10,1e32))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e32)).log10().pow(0.85)).mul(Decimal.pow(10,1e32))
        if (eff.gte(Decimal.pow(10,1e63))) eff = eff.log10().div(1e13).pow(2e61)
        return eff
    },
    effectDescription() {
        let dis = "which boost cases gain by "+layerText("h2", "i", format(this.effect()))
        if (this.effect().gte(Decimal.pow(10,1e16))) dis += " (softcapped)"
        return dis
    },
    gainMult() {
        imult = new Decimal(1)
        if (hasIUpg(13)) imult = imult.mul(getIUpgEff(13))
        if (hasIUpg(23)) imult = imult.mul(getIUpgEff(23))
        imult = imult.mul(tmp.u.effect)
        imult = imult.mul(tmp.d.effect)
        imult = imult.mul(tmp.f.effect)
        if (hasAchievement("a", 31)) imult = imult.mul(tmp.a.effect)
        imult = imult.mul(tmp.s.buyables[12].effect)
        if (player.s.unlocked) imult = imult.mul(tmp.s.severityEff);
        return imult
    },
    gainExp() {
        let exp = new Decimal(1)
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
            let i11 = player.i.points.add(1).max(1)
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
            let i13 = player.v.points.add(10).max(10)
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
            let i21 = player.i.points.add(1).max(1)
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
            let i22 = player.points.add(1).max(1)
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
            let i23 = player.points.add(10).max(10)
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
            cost: new Decimal(2.5e60),
            effect(){
            let i31 = player.r.points.add(1).max(1)
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
            cost: new Decimal(4.20e69),
            effect(){
            let i32 = player.r.points.add(1).max(1)
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
            cost: new Decimal(7.77e77),
            effect(){
            let i33 = player.i.points.add(10).max(10)
            i33 = Decimal.log10(i33).pow(1/3)
            if (inChallenge("u", 12)) i33 = new Decimal(1)
            if (hasChallenge("u", 12)) i33 = i33.pow(challengeEffect("u", 12))
            if (i33.gte(1e17)) i33 = i33.div(1e17).pow(0.5).mul(1e17)
            if (i33.gte(1e130)) i33 = Decimal.pow(10,i33.div(1e130).log10().pow(0.75)).mul(1e130)
            if (i33.gte(Decimal.pow(10,1e57))) i33 = Decimal.pow(10,i33.div(Decimal.pow(10,1e57)).log10().pow(0.9)).mul(Decimal.pow(10,1e57))
            return i33
            },
            effectDisplay(){
                let dis = "^"+format(getIUpgEff(33))
                if (this.effect().gte(1e17)) dis += " (softcapped)"
                return dis
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
    requires: new Decimal(5e58),
    resource: "replicators",
    baseResource: "cases",
    baseAmount() { 
        if (player.cases) return tmp.e.cases
        return player.points 
    },
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
        if (eff.gte("eee3")) eff = eff.log10().pow("e997")
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
        return "which boost cases gain by "+layerText("h2", "r", format(this.effect()))+" and increasing 'Infection' base by "+layerText("h2", "r", format(this.effect2()))
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
            let r11 = player.i.points.add(10).max(10)
            r11 = Decimal.log10(r11).pow(1.2).add(1).max(1)
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
            let r12 = player.r.points.add(10).max(10)
            r12 = Decimal.log10(r12).pow(1.6).mul(1.65).add(1).max(1)
            if(hasRUpg(33)) r12 = r12.pow(getRUpgEff(33))
            if (inChallenge("u", 21)) r12 = new Decimal(1)
            return r12.pow(tmp.e.reff2)
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
            let r13 = player.v.points.add(10).max(10)
            r13 = Decimal.log10(r13).pow(0.7).add(1).max(1)
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
            let r21 = player.v.points.add(10).max(10)
            r21 = Decimal.log10(r21).pow(0.35).add(1).max(1)
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
            let r22 = player.points.add(10).max(10)
            r22 = Decimal.log10(r22).add(10).max(10)
            r22 = Decimal.log10(r22).pow(2).div(10).add(1).max(1)
            r22 = r22.mul(tmp.u.effect2)
            if (r22.gte(4.8e6)) r22 = r22.div(4.8e6).pow(0.5).mul(4.8e6)
            if (r22.gte(3e11)) r22 = Decimal.pow(10,r22.div(3e11).log10().pow(0.5)).mul(3e11)
            if (r22.gte(1e55)) r22 = Decimal.pow(10,r22.div(1e55).log10().pow(0.75)).mul(1e55)
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
            let r23 = player.r.points.add(10).max(10)
            r23 = Decimal.log10(r23).pow(2.4).add(1).max(1)
            if (hasChallenge("u", 22)) r23 = r23.mul(challengeEffect("u", 22))
            if (hasUUpg(24)) r23 = r23.pow(getUUpgEff(24))
            if (r23.gte(1e25)) r23 = r23.div(1e25).pow(0.3).mul(1e25)
            if (r23.gte(1e80)) r23 = Decimal.pow(10,r23.div(1e80).log10().pow(0.75)).mul(1e80)
            if (inChallenge("u", 21)) r23 = new Decimal(1)
            return r23
            },
            effectDisplay(){
                let dis = "^"+format(getRUpgEff(23))
                if (this.effect().gte(1e25)) dis += " (softcapped)"
                return dis
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
            let r31 = player.r.points.add(10).max(10)
            r31 = Decimal.log10(r31).pow(3.8).add(1).max(1)
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
            let r33 = player.points.add(10).max(10)
            r33 = Decimal.log10(r33).add(10).max(10)
            r33 = Decimal.log10(r33).pow(0.4).add(1).max(1)
            if (hasUpgrade("e",146)) r33 = r33.pow(upgradeEffect("e",146))
            if (r33.gte(1e50)) r33 = r33.div(1e50).log10().pow(0.5).pow10().mul(1e50)
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
    requires: new Decimal(5e116),
    resource: "uncoaters",
    baseResource: "infectivity",
    baseAmount() { 
        if (player.infectivity) return tmp.e.infectivity
        return player.i.points
    },
    type: "static",
    exponent() {
        let exp = new Decimal(3.2)
        return exp
    },
    base() {
        let base = new Decimal(1e10)
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
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "u") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "u") return "resource-display"},
            "blank",
            "upgrades"
            ]
        },
        "Milestones": {
            content:[
                function() {if (player.tab == "u") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "u") return "resource-display"},
            "blank",
            "milestones"
            ],
        },
        "Challenges": {
            content:[
                function() {if (player.tab == "u") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "u") return "resource-display"},
            "blank",
                "challenges"
            ],
            unlocked() {return hasMilestone("u",5)}
        },
    },
    effbase() {
        let eff = new Decimal(30)
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).u)
        if(hasSUpg(11)) eff = eff.mul(getSUpgEff(11))
        if(hasSUpg(13)) eff = eff.mul(getSUpgEff(13))
        if(hasDUpg(21)) eff = eff.mul(getDUpgEff(21))
        if (getBuyableAmount("s", 22).gte(1)) eff = eff.mul(tmp.s.buyables[22].effect.add(1).max(1))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = eff.pow(player.u.points)
        if(hasFUpg(54)) eff = eff.pow(getFUpgEff(54))
        if (eff.gte(Decimal.pow(10,Decimal.pow(10,15e3)))) eff = eff.log10().mul(Decimal.pow(10,5e3)).pow(Decimal.pow(10,14995).mul(5))
        if (inChallenge("u", 11)) eff = new Decimal(1)
        return eff
    },
    effect2(){
        let eff2 = player.u.points.add(10).max(10)
        eff2 = Decimal.log10(eff2).pow(3)
        if(hasSUpg(12)) eff2 = eff2.mul(getSUpgEff(12))
        if(hasUUpg(23)) eff2 = eff2.pow(getUUpgEff(23))
        if (eff2.gte(Decimal.pow(10,1e4))) eff2 = Decimal.pow(10,eff2.div(Decimal.pow(10,1e4)).log10().pow(0.5)).mul(Decimal.pow(10,1e4))
        if (eff2.gte(Decimal.pow(10,Decimal.pow(10,1e15)))) eff2 = Decimal.pow(10,eff2.div(Decimal.pow(10,Decimal.pow(10,1e15))).log10().pow(0.3)).mul(Decimal.pow(10,Decimal.pow(10,1e15)))
        if (eff2.gte(Decimal.pow(10,Decimal.pow(10,1e52)))) eff2 = eff2.div(Decimal.pow(10,Decimal.pow(10,1e52))).log10().log10().pow(0.85).pow10().pow10().mul(Decimal.pow(10,Decimal.pow(10,1e52)))
        if (inChallenge("u", 11)) eff2 = new Decimal(1)
        return eff2
    },
    effectDescription() {
        return "which boost cases and infectivity by "+layerText("h2", "u", format(this.effect()))+", and boosts 'Uncoating' by "+layerText("h2", "u", format(this.effect2()))
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
        if (hasMilestone("a", 1)) keep.push("challenges")
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
            let u11 = player.u.best.add(1).max(1)
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
            let u12 = tmp.u.effect.pow(7.5)
            let rep = player.r.points
            u12 = u12.pow(rep.div(10).add(1).max(1))
            if (inChallenge("u", 11) || inChallenge("u", 21) || inChallenge("s", 21)) u12 = new Decimal(1)
            if (u12.gte(Decimal.pow(10,1500))) u12 = u12.div(Decimal.pow(10,1500)).pow(0.3).mul(Decimal.pow(10,1500))
            if (u12.gte(Decimal.pow(10,15000))) u12 = Decimal.pow(10,u12.div(Decimal.pow(10,1500)).log10().pow(2/3)).mul(Decimal.pow(10,15000))
            if (u12.gte(Decimal.pow(10,1e17))) u12 = Decimal.pow(10,u12.div(Decimal.pow(10,1e17)).log10().pow(0.93)).mul(Decimal.pow(10,1e17))
            if (u12.gte(Decimal.pow(10,1e70))) u12 = Decimal.pow(10,u12.div(Decimal.pow(10,1e70)).log10().pow(0.9)).mul(Decimal.pow(10,1e70))
            if (u12.gte(Decimal.pow(10,Decimal.pow(10,1e3)))) u12 = u12.log10().pow(Decimal.pow(10,997))
            return u12
            },
            effectDisplay(){
                let u12dis = format(getUUpgEff(12))+"x"
                if (this.effect().gte(Decimal.pow(10,1500))) u12dis = u12dis + " (softcapped)"
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
                let u13 = player.u.points.add(1).max(1)
                let u13b = player.r.points.add(1).max(1)
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
            let u14 = player.points.add(1).max(1)
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
            let u21 = player.points.add(10).max(10)
            u21 = Decimal.log10(u21).add(10).max(10)
            u21 = Decimal.log10(u21).add(10).max(10)
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
            let u22 = player.i.points.add(10).max(10)
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
            let u23 = player.i.points.add(10).max(10)
            u23 = Decimal.log10(u23)
            u23 = u23.pow(0.0747)
            if (u23.gte(150)) u23 = u23.div(150).pow(0.333).mul(150)
            if (u23.gte(1e9)) u23 = u23.div(1e9).pow(0.2).mul(1e9)
            if (inChallenge("u", 12) || inChallenge("s", 21)) u23 = new Decimal(1)
            return u23
            },
            effectDisplay(){
                let dis = "^"+format(getUUpgEff(23))
                if (getUUpgEff(23).gte(150)) dis += " (softcapped)"
                return dis
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
            let u24 = player.u.points.add(10).max(10)
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
                if (challengeCompletions("u", 11) == 0) return Decimal.pow(10,2610);
                if (challengeCompletions("u", 11) == 1) return Decimal.pow(10,2865);
                if (challengeCompletions("u", 11) == 2) return Decimal.pow(10,4860);
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Infectivity makes uncoaters cheaper.",
            rewardEffect() {
                 let c11 = player.i.points.add(1).max(1)
                 let c11r = new Decimal(1.27)
                 let c11c = challengeCompletions("u", 11)
                 c11c = Decimal.pow(1.2, c11c)
                 c11 = Decimal.log10(c11).pow(0.7)
                 c11 = Decimal.pow(10,c11)
                 c11r = c11r.mul(c11c)
                 c11 = c11.pow(c11r)
                 c11 = c11.pow(tmp.s.buyables[13].effect)
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
                if (challengeCompletions("u", 12) == 0) return Decimal.pow(10,714);
                if (challengeCompletions("u", 12) == 1) return Decimal.pow(10,2360);
                if (challengeCompletions("u", 12) == 2) return Decimal.pow(10,3434);
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Cases boost 'Genetic ReShuffle'.",
            rewardEffect() {
                 let c12 = player.points.add(10).max(10)
                 let c12r = new Decimal(1/5)
                 let c12c = challengeCompletions("u", 12)
                 c12c = Decimal.div(c12c, 20)
                 c12r = c12r.add(c12c)
                 c12 = Decimal.log10(c12).add(10).max(10)
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
                if (challengeCompletions("u", 21) == 0) return Decimal.pow(10,3700);
                if (challengeCompletions("u", 21) == 1) return Decimal.pow(10,5720);
                if (challengeCompletions("u", 21) == 2) return Decimal.pow(10,6905);
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Cases boost replicators 1st effect base.",
            rewardEffect() {
                 let c21 = player.points.add(10).max(10)
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
                if (challengeCompletions("u", 22) == 0) return new Decimal(1e14);
                if (challengeCompletions("u", 22) == 1) return new Decimal(5e19);
                if (challengeCompletions("u", 22) == 2) return new Decimal(5e21);
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            countsAs: [11, 12],
            rewardDescription: "VP boosts 'Transcription' and makes 'Transmission' softcap weaker.",
            rewardEffect() {
                 let c22 = player.v.points.add(10).max(10)
                 let c22r = new Decimal(0.15)
                 let c22c = challengeCompletions("u", 22)
                 c22c = Decimal.div(c22c, 20)
                 c22r = c22r.add(c22c)
                 c22 = Decimal.log10(c22).add(10).max(10)
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
    requires: Decimal.pow(10,10310),
    resource: "symptoms",
    baseResource: "infectivity",
    baseAmount() { 
        if (player.infectivity) return tmp.e.infectivity
        return player.i.points
    },
    type: "static",
    exponent: new Decimal(1.99),
    base: Decimal.pow(10,570),
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
        let eff = new Decimal(123)
        eff = eff.mul(tmp.s.buyables[21].effect)
        if (hasDUpg(11)) eff = eff.mul(getDUpgEff(11))
        if (hasSUpg(35)) eff = eff.mul(getSUpgEff(35))
        return eff
    },
    effect(){
        let eff = tmp.s.effbase
        eff = eff.pow(player.s.points).sub(1)
        if (hasSUpg(14)) eff = eff.mul(getSUpgEff(14))
        if (hasSUpg(32)) eff = eff.mul(getSUpgEff(32))
        eff = eff.mul(tmp.s.buyables[11].effect)
        eff = eff.mul(tmp.d.effect)
        eff = eff.mul(tmp.f.effect)
        if (hasChallenge("s", 11)) eff = eff.mul(challengeEffect("s", 11))
        eff = eff.pow(tmp.s.buyables[33].effect)
        if (player.s.severity.gte(new Decimal(1.797e308))) eff = eff.div(tmp.s.recoveryEff)
        if (hasDUpg(42)) {
            if (hasDUpg(31)) eff = eff.pow(getDUpgEff(31))
            if (hasDUpg(32)) eff = eff.pow(getDUpgEff(32))
            if (hasChallenge("s", 22)) eff = eff.pow(challengeEffect("s", 22))
            if (hasSUpg(53)) eff = Decimal.pow(10,eff.log10().pow(getSUpgEff(53)))
            if (hasSUpg(54)) eff = Decimal.pow(10,eff.log10().pow(getSUpgEff(54)))
            if (hasDUpg(44)) eff = Decimal.pow(10,eff.log10().pow(getDUpgEff(44)))
            if (hasFUpg(21)) eff = Decimal.pow(10,eff.log10().pow(getFUpgEff(21)))
        }
        if (eff.gte(Decimal.pow(10,2e6))) eff = eff.log10().mul(5000).pow(2e5)
        if (player.s.points.eq(0)) eff = new Decimal(0)
        if (hasFUpg(11)) eff = eff.mul(getFUpgEff(11))
        if (hasFUpg(13)) eff = eff.mul(getFUpgEff(13))
        if (hasFUpg(15)) eff = eff.mul(tmp.f.effect)
        eff = eff.mul(tmp.d.buyables[11].effect)
        return eff
    },
    recoveryGain() {
        let s = player.s.severity
        let recov = (s.add(10).max(10)).log10().div(308.254).pow(40)
        let r = player.s.recoveries.add(1).max(1)
        if (s.gte(Decimal.pow(10,1000))) recov = recov.pow(s.log10().sub(999).pow(0.3)).pow(r.log10().pow(0.1))
        if (s.gte(Decimal.pow(10,150000))) recov = Decimal.pow(10,recov.log10().pow(s.log10().div(3e6).add(0.95)))
        if (hasDUpg(42)) recov = new Decimal(0)
        return recov
    },
    recoveryEff() {
        let s = player.s.severity
        let recov = player.s.recoveries.add(1).max(1)
        recov = Decimal.log10(recov).add(1).max(1).pow(40)
        if (s.gte(Decimal.pow(10,1000))) recov = recov.pow(s.log10().sub(999).pow(0.15)).pow(recov.log10().pow(0.2))
        if (s.gte(Decimal.pow(10,2000))) recov = recov.pow(s.log10().sub(1999).pow(0.12))
        if (s.gte(Decimal.pow(10,5000))) recov = Decimal.pow(10,recov.log10().pow(s.log10().sub(4999).pow(0.02)))
        if (s.gte(Decimal.pow(10,150000))) recov = Decimal.pow(10,recov.log10().pow(s.log10().div(1.5e6).add(0.9)))
        if (hasDUpg(31)) recov = recov.pow(getDUpgEff(31))
        if (hasDUpg(32)) recov = recov.pow(getDUpgEff(32))
        if (hasChallenge("s", 22)) recov = recov.pow(challengeEffect("s", 22))
        if (hasSUpg(53)) recov = Decimal.pow(10,recov.log10().pow(getSUpgEff(53)))
        if (hasSUpg(54)) recov = Decimal.pow(10,recov.log10().pow(getSUpgEff(54)))
        if (hasDUpg(42)) recov = new Decimal(1)
        return recov
    },
    effectDescription() {
        let desc = "which produces " + layerText("h2", "s", format(this.effect())) + " severity "
        if (this.effect().gte("e2e6")) desc += " (softcapped) "
        if (player.s.severity.gte(new Decimal(1.797e308)) && !hasDUpg(42)) desc = desc + "and " + format(this.recoveryGain()) + " recoveries"
        desc = desc + " per second."
        return desc
    },
    severityEff() {
        let seff = player.s.severity.add(1).max(1)
        seff = seff.pow(6)
        if (hasSUpg(21)) seff = seff.pow(getSUpgEff(21))
        if (hasSUpg(51)) seff = seff.pow(getSUpgEff(51))
        if (seff.gte("eee3")) seff = seff.log10().pow("e997")
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
        if (hasFUpg(73)) buymult = buymult.mul(1000)
        if (hasFUpg(123)) buymult = buymult.pow(2)
        if (hasFUpg(143)) buymult = buymult.pow(10)
        if (hasUpgrade("e",15)) buymult = buymult.tetrate(1.79e308)
        return buymult
    },
    speed() {
        let speed = 1
        if (hasMilestone("d", 9)) speed *= 2
        if (hasMilestone("a", 0)) speed *= 2
        if (hasAchievement("a", 41)) speed *= 2
        if (hasDUpg(33)) speed *= 2
        if (hasFUpg(73)) speed *= 2
        return speed
    },
    update(diff) {
        if (player.s.unlocked) player.s.severity = player.s.severity.add(tmp.s.effect.times(diff));
        if (tmp.s.effect.gte(Decimal.pow(10,1000)) && player.s.severity.lt(Decimal.pow(10,1000))) player.s.severity = Decimal.pow(10,1000)
        if (tmp.s.effect.gte(Decimal.pow(10,5000)) && player.s.severity.lt(Decimal.pow(10,5000))) player.s.severity = Decimal.pow(10,5000)
        if (player.s.severity.gte(1.797e308)) player.s.recoveries = player.s.recoveries.add(tmp.s.recoveryGain.times(diff));
        if (player.s.recoveries.log10().gte(this.recoveryGain().log10().add(2))) player.s.recoveries = this.recoveryGain().mul(100)
        let t = diff*tmp.s.speed
            player.s.time = Decimal.add(player.s.time, t)
            if (player.s.time.gte(1) && tmp.s.speed<20) {
                let times = Decimal.floor(player.s.time).mul(-1)
                player.s.time = Decimal.add(player.s.time, times)
                times = times.mul(-1)
                if ((hasUpgrade("s", 31) || hasAchievement("a", 41)) && tmp.s.speed<20) {
                    layers.s.buyables[11].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[12].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[13].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[21].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[22].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[23].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[31].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[32].buyMax(times.mul(tmp.s.bulk))
                    layers.s.buyables[33].buyMax(times.mul(tmp.s.bulk))
                }
            };
        if (player.s.ct <0.1 && (inChallenge("s", 11) || inChallenge("s", 12) || inChallenge("s", 21) || inChallenge("s", 22)))player.s.ct += diff
        if (player.s.ct >= 0.1) {
            player.v.upgrades = [11,12,13,21,22,23,31,32,33]
        }
        if ((hasUpgrade("s", 31) || hasAchievement("a", 41)) && tmp.s.speed>20) {
            let s = player.s.severity.max(1)
            player.s.buyables[11] = player.s.buyables[11].add(Decimal.log10(s.div(1e15)).div(Decimal.log10(2.5)).pow(10/13).ceil().sub(player.s.buyables[11]).min(tmp.s.bulk))
            player.s.buyables[12] = player.s.buyables[12].add(Decimal.log10(s.div(1e19)).pow(Decimal.pow(1.29,-1)).ceil().sub(player.s.buyables[12]).min(tmp.s.bulk))
            player.s.buyables[13] = player.s.buyables[13].add(Decimal.log10(s.div(2e164)).div(Decimal.log10(tmp.s.buyables[13].scalebase)).pow(Decimal.pow(1.5,-1)).ceil().sub(player.s.buyables[13]).min(tmp.s.bulk))
            player.s.buyables[21] = player.s.buyables[21].add(Decimal.log10(s.div(1e20)).div(Decimal.log10(65)).pow(Decimal.pow(1.35,-1)).ceil().sub(player.s.buyables[21]).min(tmp.s.bulk))
            player.s.buyables[22] = player.s.buyables[22].add(Decimal.log10(s.div(1e37)).div(Decimal.log10(tmp.s.buyables[22].scalebase)).pow(Decimal.pow(1.5,-1)).ceil().sub(player.s.buyables[22]).min(tmp.s.bulk))
            player.s.buyables[23] = player.s.buyables[23].add(Decimal.log10(s.div(1e270)).div(Decimal.log10(tmp.s.buyables[23].scalebase)).pow(Decimal.pow(1.65,-1)).ceil().sub(player.s.buyables[23]).min(tmp.s.bulk))
            player.s.buyables[31] = player.s.buyables[31].add(Decimal.log10(s.div(Decimal.pow(10,34e5))).div(Decimal.log10(tmp.s.buyables[31].scalebase)).pow(0.5).ceil().sub(player.s.buyables[31]).min(tmp.s.bulk))
            player.s.buyables[32] = player.s.buyables[32].add(Decimal.log10(s.div(Decimal.pow(10,3573000))).div(Decimal.log10(tmp.s.buyables[32].scalebase)).pow(0.5).ceil().sub(player.s.buyables[32]).min(tmp.s.bulk))
            player.s.buyables[33] = player.s.buyables[33].add(Decimal.log10(s.div(Decimal.pow(10,388e4))).div(Decimal.log10(tmp.s.buyables[33].scalebase)).pow(Decimal.pow(2.2,-1)).ceil().sub(player.s.buyables[33]).min(tmp.s.bulk))
        }
    },
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "s") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html", function() {if (player.tab == "s") return "You have " + layerText("h2", "s", format(player.s.severity)) +  ' severity, which boosts cases, VP, and infectivity by ' + layerText("h2", "s", format(tmp.s.severityEff))}],
            ["display-text",
            function() {
                if (player.s.severity.gte(1.797e308) && !hasDUpg(42)) return 'You have ' + format(player.s.recoveries) + ' recoveries, which divides severity gain by ' + format(tmp.s.recoveryEff)
            },
            ],
            "upgrades"
            ]
        },
        "Milestones": {
            content:[
                function() {if (player.tab == "s") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html", function() {if (player.tab == "s") return "You have " + layerText("h2", "s", format(player.s.severity)) +  ' severity, which boosts cases, VP, and infectivity by ' + layerText("h2", "s", format(tmp.s.severityEff))}],
            ["display-text",
            function() {
                if (player.s.severity.gte(1.797e308) && !hasDUpg(42)) return 'You have ' + format(player.s.recoveries) + ' recoveries, which divides severity gain by ' + format(tmp.s.recoveryEff)
            },
            ],
                "milestones"
            ],
        },
        "Buyables": {
            content:[
                function() {if (player.tab == "s") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html", function() {if (player.tab == "s") return "You have " + layerText("h2", "s", format(player.s.severity)) +  ' severity, which boosts cases, VP, and infectivity by ' + layerText("h2", "s", format(tmp.s.severityEff))}],
            ["display-text",
            function() {
                if (player.s.severity.gte(1.797e308) && !hasDUpg(42)) return 'You have ' + format(player.s.recoveries) + ' recoveries, which divides severity gain by ' + format(tmp.s.recoveryEff)
            },
            ],
                "buyables"
            ],
            unlocked() {return hasMilestone("s",2)}
        },
        "Challenges": {
            content:[
                function() {if (player.tab == "s") return "main-display"},
            "prestige-button",
            "blank",
            ["raw-html", function() {if (player.tab == "s") return "You have " + layerText("h2", "s", format(player.s.severity)) +  ' severity, which boosts cases, VP, and infectivity by ' + layerText("h2", "s", format(tmp.s.severityEff))}],
            ["display-text",
            function() {
                if (player.s.severity.gte(1.797e308) && !hasDUpg(42)) return 'You have ' + format(player.s.recoveries) + ' recoveries, which divides severity gain by ' + format(tmp.s.recoveryEff)
            },
            ],
                "challenges"
            ],
            unlocked() {return hasMilestone("d",8)}
        },
    },
    gainMult() {
        smult = new Decimal(1)
        let s = player.s.points
        let ssc = new Decimal(8)
        let ssc2 = new Decimal(20)
        if (hasDUpg(41)) ssc2 = ssc2.add(getDUpgEff(41))
        if (s.gte(ssc)) smult = smult.mul(Decimal.pow(1e100, s.sub(ssc).pow(3.7)))
        if (s.gte(ssc2)) smult = smult.mul(Decimal.pow(Decimal.pow(10,10000),Decimal.pow(1.9,s.sub(ssc2))))
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
    canBuyMax() {return hasMilestone("f",12)},
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
                base = base.mul(tmp.s.buyables[31].effect)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                if (!inChallenge("s", 22)) {
                if (hasSUpg(22)) extra = extra.add(tmp.s.buyables[12].total)
                if (hasSUpg(23)) extra = extra.add(tmp.s.buyables[21].total)
                extra = extra.add(tmp.d.buyables[11].total)
                extra = extra.add(tmp.s.buyables[33].total)
                }
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 11).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(22)) extra = "+" + formatWhole(tmp.s.buyables[11].extra)
                if (player.tab != "s") return 
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
                extra = extra.add(tmp.s.buyables[33].total)
                if (hasSUpg(25) && !inChallenge("s", 21)) extra = extra.add(tmp.s.buyables[22].total)
                if (hasSUpg(34) && !inChallenge("s", 21)) extra = extra.add(tmp.s.buyables[13].total)
                extra = extra.add(tmp.d.buyables[12].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 12).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[12].total
                let base = tmp.s.buyables[12].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (hasSUpg(25)) extra = "+" + formatWhole(tmp.s.buyables[12].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
                let cost = Decimal.pow(65, x.pow(1.35)).mul(new Decimal(1e20))
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.5)
                if (hasSUpg(45)) base = base.add(getSUpgEff(45))
                base = base.add(tmp.s.buyables[32].effect)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(tmp.s.buyables[33].total)
                if (hasSUpg(31) && !inChallenge("s", 21)) extra = extra.add(tmp.s.buyables[22].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 21).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[21].total
                let base = tmp.s.buyables[21].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (hasSUpg(31)) extra = "+" + formatWhole(tmp.s.buyables[21].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(new Decimal(1e37))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10).max(10)
                b = Decimal.log10(b)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(tmp.s.buyables[33].total)
                if (hasSUpg(44) && !inChallenge("s", 21)) extra = extra.add(tmp.s.buyables[23].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 22).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[22].total
                let base = tmp.s.buyables[22].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (hasSUpg(44)) extra = "+" + formatWhole(tmp.s.buyables[22].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(new Decimal(2e164))
                return cost.floor()
            },
            base() { 
                let b = player.i.points.add(1).max(1)
                b = Decimal.log10(b).add(10).max(10)
                b = Decimal.log10(b).pow(0.8)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(tmp.d.buyables[13].total)
                extra = extra.add(tmp.s.buyables[33].total)
                if (hasSUpg(44) && !inChallenge("s", 21)) extra = extra.add(tmp.s.buyables[23].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 13).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[13].total
                let base = tmp.s.buyables[13].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x).add(1).max(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (hasSUpg(44)) extra = "+" + formatWhole(tmp.s.buyables[13].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("2e164")).div(Decimal.log10(tmp.s.buyables[13].scalebase)).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(tmp.s.buyables[13].scalebase, target.sub(1).pow(1.5)).mul("2e164")
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
                let cost = Decimal.pow(this.scalebase(), x.pow(1.65)).mul(new Decimal(1e270))
                return cost.floor()
            },
            base() { 
                let b = player.v.points.add(10).max(10)
                b = Decimal.log10(b).pow(4)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(tmp.s.buyables[33].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 23).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[23].total
                let base = tmp.s.buyables[23].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(tmp.s.buyables[23].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
                let base = new Decimal(1e100)
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2)).mul(new Decimal(Decimal.pow(10,34e5)))
                return cost.floor()
            },
            base() { 
                let b = player.d.points.add(1).max(1)
                b = Decimal.pow(10,b.log10().pow(0.5)).pow(0.02)
                return b
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(tmp.s.buyables[33].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 31).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[31].total
                let base = tmp.s.buyables[31].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(tmp.s.buyables[31].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
                let base = new Decimal(1e300)
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2)).mul(Decimal.pow(10,3573000))
                return cost.floor()
            },
            base() { 
                let b = player.f.points.add(10).max(10)
                let s = player.s.severity.add(10).max(10)
                b = Decimal.pow(10,b.log10().pow(1.25)).pow(0.03).pow(s.log10().pow(0.17)).div(20)
                if (b.gte(1e300)) b = b.div(1e300).pow(0.1).mul(1e300)
                if (b.gte("ee4")) b = Decimal.pow(10,b.div("ee4").log10().pow(0.8)).mul("ee4")
                return b
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(tmp.s.buyables[33].total)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 32).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[32].total
                let base = tmp.s.buyables[32].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(tmp.s.buyables[32].extra)
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(Decimal.pow(10,3573000))).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2)).mul(Decimal.pow(10,3573000))
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
                let base = Decimal.pow(10,500)
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2.2)).mul(Decimal.pow(10,388e4))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10).max(10)
                let s = player.i.points.add(10).max(10)
                b = Decimal.pow(10,b.log10().pow(0.12)).pow(0.03).pow(s.log10().pow(0.005)).div(100)
                return b
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 33).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.s.buyables[33].total
                let base = tmp.s.buyables[33].base
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x).add(1).max(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "s") return 
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
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
            cost: new Decimal(5e3),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s11 = player.s.severity.add(10).max(10)
            s11 = Decimal.log10(s11)
            s11 = s11.pow(2).add(10).max(10)
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
            cost: new Decimal(3e7),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s13 = player.s.points.add(1).max(1)
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
            cost: new Decimal(77777777),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s14 = player.i.points.add(1).max(1)
            s14 = s14.pow(new Decimal(3e-4))
            if (s14.gte(Decimal.pow(10,5000))) s14 = s14.div(Decimal.pow(10,5000)).pow(0.1).mul(Decimal.pow(10,5000))
            if (inChallenge("s", 21)) s14 = new Decimal(1)
            return s14
            },
            effectDisplay(){
                let dis = format(getSUpgEff(14))+"x"
                if (this.effect().gte(Decimal.pow(10,5000))) dis += " (softcapped)"
                return dis
            },
            unlocked(){
                return hasSUpg(13)
            }
        },
        15: {
            title: "Sore Throat",
            description: "Severity boosts replicators 1st effect base.",
            cost: new Decimal(1.5e12),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s15 = player.s.severity.add(1).max(1)
            s15 = s15.pow(0.3)
            if (s15.gte(Decimal.pow(10,1e45))) s15 = Decimal.pow(10,s15.div(Decimal.pow(10,1e45)).log10().pow(0.8)).mul(Decimal.pow(10,1e45))
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
            cost: new Decimal(1e15),
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
            cost: new Decimal(2.22e22),
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
            cost: new Decimal(5e38),
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
            cost: new Decimal(7),
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
            cost: new Decimal(5e58),
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
            cost: new Decimal(1e63),
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
            cost: new Decimal(5e164),
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
            cost: new Decimal(15e271),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = tmp.s.buyables[11].total.div(5e3)
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
            cost: Decimal.pow(10,54490),
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
            cost: Decimal.pow(10,60100),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10).max(10)
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
            cost: Decimal.pow(10,7e4),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.d.points.add(10).max(10)
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
            cost: Decimal.pow(10,87700),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.s.severity.add(10).max(10)
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
            cost: Decimal.pow(10,133420),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10).max(10)
                s32 = s32.log10().add(10).max(10)
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
            cost: Decimal.pow(10,146060),
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
            cost: Decimal.pow(10,191185),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = tmp.s.buyables[23].total.div(1e4)
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
            cost: Decimal.pow(10,215350),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10).max(10)
                s32 = s32.log10().add(1).max(1).log10()
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
            cost: Decimal.pow(10,225315),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.i.points.add(10).max(10)
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
            cost: Decimal.pow(10,301777),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.u.points.add(10).max(10)
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
            cost: Decimal.pow(10,435630),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.r.points.add(10).max(10)
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
            cost: Decimal.pow(10,545766),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.s.severity.add(10).max(10)
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
                if (challengeCompletions("s", 11) == 0) return Decimal.pow(10,78000);
                if (challengeCompletions("s", 11) == 1) return Decimal.pow(10,107500);
                if (challengeCompletions("s", 11) == 2) return Decimal.pow(10,285000);
                if (challengeCompletions("s", 11) == 3) return Decimal.pow(10,3e6);
                if (challengeCompletions("s", 11) == 4) return Decimal.pow(10,893e4);
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
                 let c11 = player.points.add(1).max(1)
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
                if (challengeCompletions("s", 12) == 0) return Decimal.pow(10,5640);
                if (challengeCompletions("s", 12) == 1) return Decimal.pow(10,13600);
                if (challengeCompletions("s", 12) == 2) return Decimal.pow(10,86400);
                if (challengeCompletions("s", 12) == 3) return Decimal.pow(10,154000);
                if (challengeCompletions("s", 12) == 4) return Decimal.pow(10,327000);
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
                 let c12 = player.points.add(1).max(1)
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
                if (challengeCompletions("s", 21) == 0) return Decimal.pow(10,4660);
                if (challengeCompletions("s", 21) == 1) return Decimal.pow(10,34100);
                if (challengeCompletions("s", 21) == 2) return Decimal.pow(10,44640);
                if (challengeCompletions("s", 21) == 3) return Decimal.pow(10,64500);
                if (challengeCompletions("s", 21) == 4) return Decimal.pow(10,89100);
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
                 let c12 = player.d.points.add(10).max(10)
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
                if (challengeCompletions("s", 22) == 0) return Decimal.pow(10,1020);
                if (challengeCompletions("s", 22) == 1) return Decimal.pow(10,2170);
                if (challengeCompletions("s", 22) == 2) return Decimal.pow(10,4720);
                if (challengeCompletions("s", 22) == 3) return Decimal.pow(10,5850);
                if (challengeCompletions("s", 22) == 4) return Decimal.pow(10,12715);
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
                 let c12 = player.s.severity.add(10).max(10)
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
    requires: new Decimal(1.797e308),
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
                if (canReset(this.layer) && !hasMilestone("d",10))
                    doReset(this.layer)
            }
        },
    ],
    bulk() {
        let bulk = new Decimal(100)
        if (hasAchievement("a", 53)) bulk = bulk.mul(5)
        if (hasMilestone("f", 8)) bulk = bulk.mul(100)
        if (hasFUpg(73)) bulk = bulk.mul(1000)
        if (hasFUpg(123)) bulk = bulk.pow(2)
        if (hasFUpg(143)) bulk = bulk.pow(10)
        if (hasUpgrade("e",15)) bulk = bulk.tetrate(1.79e308)
        return bulk
    },
    speed() {
        let speed = 1
        if (hasAchievement("a", 53)) speed *=2
        if (hasFUpg(73)) speed *=2
        if (hasMilestone("a", 0)) speed *=2
        if (hasMilestone("a", 1)) speed *=2
        if (hasMilestone("e", 0)) speed *=2
        return speed
    },
    update(diff) {
        if (hasMilestone("d", 10) && !inChallenge("f",31)) generatePoints("d", diff/100);
        let t = diff*tmp.d.speed
        player.d.time = Decimal.add(player.d.time, t)
            if (player.d.time.gte(1)) {
                let times = Decimal.floor(player.d.time).mul(-1)
                player.d.time = Decimal.add(player.d.time, times)
                times = times.mul(-1)
                if (hasUpgrade("f", 25) && tmp.d.speed<20) {
                    layers.d.buyables[11].buyMax(times.mul(tmp.d.bulk))
                    layers.d.buyables[12].buyMax(times.mul(tmp.d.bulk))
                    layers.d.buyables[13].buyMax(times.mul(tmp.d.bulk))
                }
            };
        if (hasUpgrade("f", 25) && tmp.d.speed>20) {
            let s = player.d.points.max(1)
            let target = Decimal.log10(s.div(Decimal.pow(10,17000)).max(10).log10().div(1000)).div(Decimal.log10(tmp.d.buyables[13].scalebase))
            let d = tmp.d.buyables[13].distant
                if (target.gte(d)) target = target.div(d).pow(0.4).mul(d)
                target = target.ceil()
            player.d.buyables[11] = player.d.buyables[11].add(Decimal.log10(s.div(Decimal.pow(10,16000))).div(Decimal.log10(tmp.d.buyables[11].scalebase)).pow(2/3).ceil().sub(player.d.buyables[11]).min(tmp.d.bulk))
            player.d.buyables[12] = player.d.buyables[12].add(Decimal.log10(s.div(Decimal.pow(10,17000))).div(Decimal.log10(tmp.d.buyables[12].scalebase)).pow(2/3).ceil().sub(player.d.buyables[12]).min(tmp.d.bulk))
            player.d.buyables[13] = player.d.buyables[13].add(target.sub(player.d.buyables[13]).min(tmp.d.bulk))
        }
    },
    layerShown() {
        let shown = hasSUpg(33)
        if(player.d.unlocked) shown = true
        return shown
    },
    effect() {
        let eff = player.d.best.add(1).max(1)
        eff = eff.pow(5)
        if (eff.gte(Decimal.pow(10,Decimal.pow(10,1000)))) eff = eff.log10().pow(Decimal.pow(10,997))
        return eff
    },
    effectDescription() {
        return "which boost cases, VP, infectivity, and severity gain by "+layerText("h2", "d", format(this.effect())) + " (based on best)."
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
        mult = mult.mul(tmp.f.effect2)
        if (hasAchievement("a", 52)) mult = mult.mul(tmp.a.effect)
        mult = mult.mul(tmp.d.buyables[12].effect)
        if (hasChallenge("s", 12)) mult = mult.mul(challengeEffect("s", 12))
        return mult
    },
    doReset(resettingLayer){
        let keep = [];
        if (hasMilestone("f", 3)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
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
        if (resettingLayer == "f" && !hasMilestone("a",1)) {
            player.d.buyables[11] = new Decimal(0)
            player.d.buyables[12] = new Decimal(0)
            player.d.buyables[13] = new Decimal(0)
        }
        if (hasMilestone("f", 0) || hasMilestone("a",1)) {
            player.u.auto = true
            player.d.auto = true
            player.d.autos = true
            player.d.milestones = [0,1,2,3,4,5]
            player.s.milestones = [0,1,2,3]
            if (hasMilestone("f", 3) || hasMilestone("a",1)) player.d.upgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
            if (hasMilestone("f", 1) || hasMilestone("a",1)) player.d.milestones = [0,1,2,3,4,5,6,7,8,9,10]
            player.u.challenges[11] = 3
            player.u.challenges[12] = 3
            player.u.challenges[21] = 3
            player.u.challenges[22] = 3
            if (hasMilestone("f", 4) || hasMilestone("a",1)) {
            player.s.challenges[11] = 5
            player.s.challenges[12] = 5
            player.s.challenges[21] = 5
            player.s.challenges[22] = 5
            }
        }
    },
    tabFormat: {
        "Milestones": {
            content: [
                function() {if (player.tab == "d") return "main-display"},
            function() {if (!hasMilestone("d", 10)) return "prestige-button"},
            ["raw-html", function() {if (hasMilestone("d",10) && player.tab == "d") return "You are gaining " + layerText("h2", "d", format(getResetGain("d").div(100))) + " deaths per second"}],
            function() {if (player.tab == "d") return "resource-display"},
            "blank",
            ["display-text",
            "Deaths reset all previous progress.",
            ],
            "milestones"
            ]
        },
        "Upgrades": {
            content: [
                function() {if (player.tab == "d") return "main-display"},
                function() {if (!hasMilestone("d", 10)) return "prestige-button"},
                ["raw-html", function() {if (hasMilestone("d",10) && player.tab == "d") return "You are gaining " + layerText("h2", "d", format(getResetGain("d").div(100))) + " deaths per second"}],
                function() {if (player.tab == "d") return "resource-display"},
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
                function() {if (player.tab == "d") return "main-display"},
                function() {if (!hasMilestone("d", 10)) return "prestige-button"},
                ["raw-html", function() {if (hasMilestone("d",10) && player.tab == "d") return "You are gaining " + layerText("h2", "d", format(getResetGain("d").div(100))) + " deaths per second"}],
                function() {if (player.tab == "d") return "resource-display"},
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
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(Decimal.pow(10,16000))
                return cost.floor()
            },
            base() { 
                let base = player.d.points.add(10).max(10)
                base = base.log10().pow(100)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 11).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "d") return 
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let s = player.d.points
                let target = Decimal.log10(s.div(Decimal.pow(10,16000))).div(Decimal.log10(this.scalebase())).pow(2/3)
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(Decimal.pow(10,16000))
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
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(Decimal.pow(10,17000))
                return cost.floor()
            },
            base() { 
                let base = player.f.points.add(10).max(10)
                base = base.log10().pow(3)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 12).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "d") return 
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let s = player.d.points
                let target = Decimal.log10(s.div(Decimal.pow(10,17000))).div(Decimal.log10(this.scalebase())).pow(2/3)
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(Decimal.pow(10,17000))
                let diff = target.sub(player.d.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[12] = player.d.buyables[12].add(diff)
                }
            },
        },
        13: {
            title() {
                let dis = ""
                if (player.d.buyables[13].gte(tmp.d.buyables[13].distant)) dis = "Distant "
                dis += "Cases Boost"
                return dis
            },
            distant() {
                let d = new Decimal(1e20)
                if (hasUpgrade("e",191)) d = d.mul(upgradeEffect("e",191))
                if (hasUpgrade("e",203)) d = d.mul(upgradeEffect("e",203))
                if (hasUpgrade("e",213)) d = d.mul(upgradeEffect("e",213))
                if (hasUpgrade("e",234)) d = d.mul(upgradeEffect("e",234))
                if (hasUpgrade("e",241)) d = d.mul(tmp.e.upgrades[241].effect)
                return d
            },
            scalebase() {
                let base = new Decimal(1.007)
                if (hasFUpg(142)) base = base.div(getFUpgEff(142))
                return base
            },
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let d = tmp.d.buyables[13].distant
                if (x.gte(d)) x = x.div(d).pow(2.5).mul(d)
                let cost = Decimal.pow(10, Decimal.pow(this.scalebase(),x).mul(1000)).mul(Decimal.pow(10,17000))
                return cost.floor()
            },
            scStart() {
                let sc = new Decimal(2500)
                if (hasFUpg(174)) sc = sc.add(getFUpgEff(174))
                if (hasFUpg(175)) sc = sc.add(getFUpgEff(175))
                sc = sc.add(tmp.e.peffect2)
                return sc
            },
            base() { 
                let base = player.points.add(10).max(10)
                base = base.log10().add(10).max(10)
                base = base.log10().add(10).max(10)
                base = base.log10().pow(0.004)
                if (hasFUpg(141)) base = base.add(getFUpgEff(141))
                if (hasFUpg(152)) base = base.add(getFUpgEff(152))
                if (hasUpgrade("e",15)) base = base.add(upgradeEffect("e",15))
                if (hasUpgrade("e",93)) base = base.add(upgradeEffect("e",93))
                if (hasChallenge("e",11)) base = base.add(challengeEffect("e",11))
                base = base.mul(tmp.e.buyables[63].effect)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                if (hasFUpg(71)) extra = extra.add(getFUpgEff(71))
                if (hasFUpg(123)) extra = extra.add(getFUpgEff(123))
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 13).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                if (x.gte(tmp.d.buyables[13].scStart)) eff = Decimal.pow(base, x.mul(tmp.d.buyables[13].scStart).pow(0.5))
                if (eff.gte(Decimal.pow(10,Decimal.pow(10,1e21)))) eff = eff.log10().log10().div(10).pow(5e19).pow10()
                if (inChallenge("e",11) || player.e.inC) eff = new Decimal(1)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "d") return 
                let extra = ""
                let eff = format(tmp[this.layer].buyables[this.id].effect)
                if (this.total().gte(tmp.d.buyables[13].scStart)) eff += " (softcapped)"
                if (hasFUpg(71)) extra = "+" + formatWhole(tmp[this.layer].buyables[this.id].extra)
                return "Raise cases gain to "+format(this.base())+" (based on cases).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: ^" + eff +"\n\
                Amount: " + formatWhole(getBuyableAmount("d", 13)) + extra
            },
            unlocked() { return player.d.buyables[12].gte(1) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let s = player.d.points // log1.003(log10(cost/e17k)/1k)=x
                let d = tmp.d.buyables[13].distant
                let target = Decimal.log10(s.div(Decimal.pow(10,17000)).log10().div(1000)).div(Decimal.log10(this.scalebase()))
                if (target.gte(d)) target = target.div(d).pow(0.4).mul(d)
                target = target.ceil()
                let cost = Decimal.pow(10, Decimal.pow(this.scalebase(),target).mul(1000)).mul(Decimal.pow(10,17000))
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
            let d11 = player.d.points.add(10).max(10)
            d11 = Decimal.log10(d11).pow(4.5).add(1).max(1)
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
            let d12 = player.points.add(1).max(1)
            d12 = Decimal.log10(d12).pow(0.1).add(1).max(1)
            if (hasDUpg(33)) d12 = d12.pow(getDUpgEff(33))
            if (hasFUpg(31)) d12 = d12.pow(getFUpgEff(31))
            if (d12.gte("ee3e20")) d12 = d12.div("ee3e20").log10().log10().pow(0.95).pow10().pow10().mul("ee3e20")
            if (d12.gte("eee32")) d12 = d12.div("eee32").log10().log10().pow(0.9).pow10().pow10().mul("eee32")
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
            let d12 = player.d.points.add(1).max(1)
            d12 = d12.pow(20)
            if (d12.gte("eee20")) d12 = d12.div("eee20").log10().log10().pow(0.95).pow10().pow10().mul("eee20")
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
            let d14 = player.d.points.add(10).max(10)
            d14 = Decimal.log10(d14).add(10).max(10)
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
            let d12 = player.d.points.add(1).max(1)
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
            let d24 = player.s.severity.add(10).max(10)
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
            let d24 = player.d.points.add(10).max(10)
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
            let d24 = player.points.add(10).max(10)
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
            let d24 = player.v.points.add(10).max(10)
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
            cost: Decimal.pow(10,2089).mul(1.5),
            effect(){
            let d24 = player.d.points.add(10).max(10)
            d24 = Decimal.log10(d24).pow(0.3).sub(1)
            if (d24.gte(5000)) d24 = d24.div(5000).pow(0.5).mul(5000)
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
            cost: Decimal.pow(10,2208).mul(5),
            unlocked() {
                return hasDUpg(41)
            }
        },
        43: {
            title: "Slain",
            description: "Deaths boost cases gain.",
            cost: Decimal.pow(10,9101).mul(1.5),
            effect(){
            let d24 = player.d.points.add(10).max(10).log10().pow(0.025)
            if (d24.gte(Decimal.pow(10,1e57))) d24 = d24.div(Decimal.pow(10,1e57)).log10().pow(0.85).pow10().mul(Decimal.pow(10,1e57))
            if (d24.gte(Decimal.pow(10,Decimal.pow(10,1e21)))) d24 = d24.log10().log10().div(10).pow(5e19).pow10()
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
                let dis = "^"+format(getDUpgEff(43))
                if (getDUpgEff(43).gte(Decimal.pow(10,1e57))) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasDUpg(42)
            }
        },
        44: {
            title: "Slaughter",
            description: "Deaths boost severity gain exponent.",
            cost: Decimal.pow(10,9291).mul(8),
            effect(){
                let d24 = player.d.points.add(10).max(10)
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
        ["raw-html", 
            function () {
                if (player.tab == "stat") {
                let a = "You have "+format(player.points)+" cases.<br><br>"
                let b = "You have "+format(player.v.points)+" virus points.<br><br>"
                let c = player.i.unlocked?"You have "+format(player.i.points)+" infectivity.<br><br>":""
                let d = player.r.unlocked?"You have "+format(player.r.points)+" replicators.<br><br>":""
                let e = player.u.unlocked?"You have "+format(player.u.points)+" uncoaters.<br><br>":""
                let f = player.s.unlocked?"You have "+format(player.s.points)+" symptoms.<br><br>":""
                let g = player.s.unlocked?"You have "+format(player.s.severity)+" severity.<br><br>":""
                let h = player.d.unlocked?"You have "+format(player.d.points)+" deaths.<br><br>":""
                let i = "'Infection' base:"+format(tmp.v.upgrades[12].base)+"<br><br>"
                let j = player.r.unlocked?"Replicator base:"+format(tmp.r.effbase)+"<br><br>":""
                let k = player.u.unlocked?"Uncoater base:"+format(tmp.u.effbase)+"<br><br>":""
                let l = player.s.unlocked?"Symptom base:"+format(tmp.s.effbase)+"<br><br>":""
                let m = player.e.unlocked?"Infecter base:"+format(tmp.e.effbase)+"<br><br>":""
                let n = hasSUpg(31) || player.d.unlocked?"'Smell Loss' autobuy:"+formatWhole(tmp.s.bulk)+"/" + format(1/tmp.s.speed)+"s (" + format(Decimal.mul(tmp.s.bulk,tmp.s.speed)) + "/s)<br><br>":""
                let o = hasFUpg(25)?"'More Fatal' autobuy:"+formatWhole(tmp.d.bulk)+"/" + format(1/tmp.d.speed)+"s (" + format(Decimal.mul(tmp.d.bulk,tmp.d.speed)) + "/s)<br><br>":""
                let p = hasFUpg(187)?"'More Exponenter' autobuy:"+formatWhole(tmp.f.bulk)+"/" + format(1/tmp.f.speed)+"s (" + format(Decimal.mul(tmp.f.bulk,tmp.f.speed)) + "/s)<br><br>":""
                return a+b+c+d+e+f+g+h+i+j+k+l+m+n+o+p
                }
            }],
        ["display-text", function() {if (player.d.buyables[13].gte(2500) && player.tab == "stat") return "'Cases Boost' softcap start:"+format(tmp.d.buyables[13].scStart)}],
        "blank",
        ["display-text", function() {if (hasMilestone("f",6) && player.tab == "stat") return "Multiplier per Fatality Dimension:"+format(tmp.f.multpd)}],
        "blank",
        ["display-text", function() {if (player.f.total.gte(Decimal.pow(10,1e3)) && player.tab == "stat") return "Fatality Dimension Scaling:"+format(tmp.f.DimScaling)}],
        "blank",
        ["display-text", function() {if (player.f.total.gte("6.969e420") && player.tab == "stat") return "Fatality Dimension Boost Scaling:"+format(tmp.f.buyables[32].scale)}],
        "blank",
        ["display-text", function() {if (player.f.buyables[33].gte(100) && player.tab == "stat") return "Distant Multiplier Boost Scaling Start:"+format(tmp.f.buyables[33].distantStart)}],
        "blank",
        ["display-text", function() {if (player.f.buyables[33].gte(10000) && player.tab == "stat") return "Social Distant Multiplier Boost Scaling Start:"+format(tmp.f.buyables[33].sStart)}],
        "blank",
        ["display-text", function() {if (player.e.rna.gte(Decimal.pow(10,1e3)) && player.tab == "stat") return "Immunity exponent:"+format(tmp.e.iexp)}],
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
        rows: 11,
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
                return player.d.points.gte(1e30)
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
            tooltip: "Get ee18 cases. Reward: 4 AP, Double Fatality Dimensions",
            done() {
                return player.points.gte("ee18")
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        55: {
            name: "PPOOWWEERR!",
            tooltip: "Get 1e1000 fatality power. Reward: 4 AP",
            done() {
                return player.f.p.gte("ee3")
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        56: {
            name: "The 9th Dimension is a lie",
            tooltip: "Get exactly 99 8th Dimensions. Reward: 5 AP",
            done() {
                return player.f.buyables[24].eq(99)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        61: {
            name: "Casual",
            tooltip: "Get 1 casualty. Reward: 5 AP",
            done() {
                return player.f.casualty.gte(1)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        62: {
            name: "Fatally Challenged",
            tooltip: "Complete 4 Fatality Challenges Reward: 5 AP",
            done() {
                return hasChallenge("f",11) && hasChallenge("f",12) && hasChallenge("f",21) && hasChallenge("f",22)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        63: {
            name: "Zero Deaths",
            tooltip: "Get 1e10000 fatality without Dimension and Multiplier Boosts. Reward: 5 AP",
            done() {
                return player.f.points.gte("ee4") && player.f.buyables[32].eq(0) && player.f.buyables[33].eq(0)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        64: {
            name: "REPLICANTI",
            tooltip: "Unlock Casuals. Reward: 5 AP",
            done() {
                return hasMilestone("f",17)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        65: {
            name: "'ZERO' Deaths",
            tooltip: "Get 6e666,666 fatality without Dimension and Multiplier Boosts in Casualty Challenge 1. Reward: 5 AP, AP boosts fatality dimensions",
            done() {
                return player.f.points.gte("6e666666") && player.f.buyables[32].eq(0) && player.f.buyables[33].eq(0) && inChallenge("f",31)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        66: {
            name: "0 cases from Casualty",
            tooltip: "Get 1 Casualty Dimension 8. Reward: 5 AP",
            done() {
                return player.f.buyables[84].gte(1)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        71: {
            name: "GoogolPlex",
            tooltip: "Get ee100 cases. Reward: 5 AP",
            done() {
                return player.points.gte("ee100")
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        72: {
            name: "When will it be enough?",
            tooltip: "Get 1e30000 casuals. Reward: 5 AP",
            done() {
                return player.f.casuals.gte("e30000")
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        73: {
            name: "GAS",
            tooltip: "Get ee1000 cases. Reward: 6 AP",
            done() {
                return player.points.gte("eee3")
            },
            onComplete() {
                addPoints("a",6)
            }
        },
        74: {
            name: "Corona GAS",
            tooltip: "Get ee1,000,000 cases. Reward: 6 AP",
            done() {
                return player.points.gte("eee6")
            },
            onComplete() {
                addPoints("a",6)
            }
        },
        75: {
            name: "Infected Challenge",
            tooltip: "Complete all Infecter Challenges. Reward: 6 AP",
            done() {
                return player.e.c11.gte(1e6) && player.e.c12.gte(1e6)
            },
            onComplete() {
                addPoints("a",6)
            }
        },
        76: {
            name: "Unimmune",
            tooltip: "Get 1 'Immunity Base'. Reward: 6 AP",
            done() {
                return player.e.buyables[23].gte(1)
            },
            onComplete() {
                addPoints("a",6)
            }
        },
        81: {
            name: "Diseased Diseases",
            tooltip: "Get 1 'Disease Boost'. Reward: 7 AP",
            done() {
                return player.e.buyables[42].gte(1)
            },
            onComplete() {
                addPoints("a",7)
            }
        },
        82: {
            name: "Quarantined",
            tooltip: "Get 1 Unquarantined Infection. Reward: 7 AP",
            done() {
                return player.e.qt.gte(1)
            },
            onComplete() {
                addPoints("a",7)
            }
        },
        83: {
            name: "E-World Quarantine",
            tooltip: "Get e7,800,000,000 cases in Quarantine. Reward: 8 AP",
            done() {
                return player.e.inC && player.points.gte("e7.8e9")
            },
            onComplete() {
                addPoints("a",8)
            }
        },
        84: {
            name: "Unquarantined Quarantine",
            tooltip: "Get Unquarantined Infections out of Quarantine. Reward: 8 AP",
            done() {
                return hasUpgrade("e",162)
            },
            onComplete() {
                addPoints("a",8)
            }
        },
        85: {
            name: "GAS GAS",
            tooltip: "Get eee20 cases. Reward: 8 AP",
            done() {
                return player.points.gte("eee20")
            },
            onComplete() {
                addPoints("a",8)
            }
        },
        86: {
            name: "Multi-Million",
            tooltip: "Get 1,000,000 Multiplier Boosts. Reward: 8 AP",
            done() {
                return player.f.buyables[33].gte(1e6)
            },
            onComplete() {
                addPoints("a",8)
            }
        },
        91: {
            name: "Cased GAS",
            tooltip: "Get ee8.8521e33 cases. Reward: 9 AP",
            done() {
                return player.points.gte(Decimal.pow(Math.E,Decimal.pow(Math.E,Decimal.pow(Math.E,79))))
            },
            onComplete() {
                addPoints("a",9)
            }
        },
        92: {
            name: "Atomic Virus",
            tooltip: "Get 1 Atom. Reward: 9 AP",
            done() {
                return player.e.h.gte(1)
            },
            onComplete() {
                addPoints("a",9)
            }
        },
        93: {
            name: "Molecular Virus",
            tooltip: "Get 1 Molecule. Reward: 9 AP",
            done() {
                return player.e.ad.gte(1) || player.e.ur.gte(1)
            },
            onComplete() {
                addPoints("a",9)
            }
        },
        94: {
            name: "Phospate",
            tooltip: "Get 1 Phosphorus. Reward: 9 AP",
            done() {
                return player.e.ph.gte(1)
            },
            onComplete() {
                addPoints("a",9)
            }
        },
        95: {
            name: "Phospate Virus",
            tooltip: "Get 1 Ribose-Phosphate. Reward: 9 AP",
            done() {
                return player.e.rp.gte(1)
            },
            onComplete() {
                addPoints("a",9)
            }
        },
        96: {
            name: "mRNA Virus",
            tooltip: "Get 1 mRNA. Reward: 10 AP",
            done() {
                return player.e.mrna.gte(1)
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        101: {
            name: "Corona GAS GAS",
            tooltip: "Get eee1000 cases. Reward: 10 AP",
            done() {
                return player.points.gte("eee1000")
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        102: {
            name: "Automatic Diseases",
            tooltip: "Get 8 Infecter milestones. Reward: 10 AP",
            done() {
                return player.e.points.gte(2e4)
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        103: {
            name: "Mutated",
            tooltip: "Get 1 MMNA. Reward: 10 AP",
            done() {
                return player.e.mm.gte(1)
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        104: {
            name: "Infecterrr",
            tooltip: "Get 10 Infecter milestones. Reward: 10 AP",
            done() {
                return player.e.points.gte(5e4)
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        105: {
            name: "In'F'ected",
            tooltip: "Get 1F5 cases. Reward: 10 AP",
            done() {
                return player.points.gte(Decimal.tetrate(10,5))
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        106: {
            name: "COV",
            tooltip: "Get 3 Corona Mutations. Reward: 10 AP",
            done() {
                return player.e.mu2.gte(3)
            },
            onComplete() {
                addPoints("a",10)
            }
        },
        111: {
            name: "Mutant",
            tooltip: "Get 300 Mutations. Reward: 15 AP",
            done() {
                return player.e.mu.gte(300)
            },
            onComplete() {
                addPoints("a",15)
            }
        },
        112: {
            name: "CO.RO.NA.",
            tooltip: "Get 1 CRNA. Reward: 15 AP",
            done() {
                return player.e.crna.gte(1)
            },
            onComplete() {
                addPoints("a",15)
            }
        },
        113: {
            name: "COVI",
            tooltip: "Get 7 Corona Mutations. Reward: 15 AP",
            done() {
                return player.e.mu2.gte(7)
            },
            onComplete() {
                addPoints("a",15)
            }
        },
        114: {
            name: "Mutated Mutations",
            tooltip: "Get 1000 Mutations. Reward: 15 AP",
            done() {
                return player.e.mu.gte(1e3)
            },
            onComplete() {
                addPoints("a",15)
            }
        },
    },
    effect() {
        let eff = player.a.points
        let x = Decimal.add(1.2,tmp.e.Gueffect)
        let exp = new Decimal(1.5)
        if (hasUpgrade("e",276)) exp = exp.add(upgradeEffect("e",276))
        if (hasAchievement("a", 42)) eff = Decimal.pow(x, eff.pow(exp))
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
        },
        1: {
            requirementDescription: "115 Achievement Points",
            effectDescription: "Keep S,D upgrades, milestones and challenges, and autobuy 2x more and faster.",
            done() { return player.a.points.gte(115) }
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
        sac: new Decimal(0),
        p: new Decimal(0),
        mult: new Decimal(0),
        d1: new Decimal(0),
        d2: new Decimal(0),
        d3: new Decimal(0),
        d4: new Decimal(0),
        d5: new Decimal(0),
        d6: new Decimal(0),
        d7: new Decimal(0),
        d8: new Decimal(0),
        resettime: new Decimal(0.001),
        cpm: new Decimal(0),
        casualty: new Decimal(0),
        casualtyTotal: new Decimal(0),
        d1auto: false,
        d2auto: false,
        d3auto: false,
        d4auto: false,
        d5auto: false,
        d6auto: false,
        d7auto: false,
        d8auto: false,
        multauto: false,
        boostauto: false,
        multbauto: false,
        sacauto: false,
        cmultauto: false,
        cdauto: false,
        crbauto: false,
        rbauto: false,
        iauto: false,
        rmultauto: false,
        t: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        times: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        buy: [41,42,43,44,51,52,53,54,61,62,63],
        sact: new Decimal(0),
        sactimes: new Decimal(0),
        cd: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        cp: new Decimal(0),
        casuals: new Decimal(1),
        rt: new Decimal(0),
        rtimes: new Decimal(0),
        crb: new Decimal(0),
        crbtimes: new Decimal(0),
        rb: new Decimal(0),
        rbtimes: new Decimal(0),
        cboosts: new Decimal(0),
        virus: new Decimal(0),
        bt: new Decimal(0),
        btimes: new Decimal(0),
    }},
    color: "#f53d63",
    nodeStyle() {return {
        "background": (player.f.unlocked||canReset("f"))?"radial-gradient(#d5a776, #f53d63)":"#bf8f8f" ,
    }},
    componentStyles: {
        "prestige-button"() {return { "background": canReset("f")?"radial-gradient(#d5a776, #f53d63)":"#bf8f8f" }},
    },
    requires: Decimal.pow(10,10450),
    resource: "fatality",
    baseResource: "deaths",
    baseAmount() { return player.d.points },
    type: "custom",
    exponent: 0.3,
    branches: ["d","s","u"],
    row: "3",
    hotkeys: [
            {key:"f", description: "F:Reset for fatality", onPress() {
                if (canReset(this.layer) && !hasMilestone("f",9)) doReset(this.layer)}
            },
            {key:"m", description: "M:Buy max Fatality Dimensions", onPress() {
                if (hasMilestone("f",6)) layers.f.clickables[11].onClick()
                if (hasMilestone("f",16)) layers.f.clickables[51].onClick()}
            },
            {key:"c", description: "C:Reset for casualty", onPress() {
                if (hasMilestone("f",12) && player.f.points.gte(Decimal.pow(10,5095).mul(5))) layers.f.clickables[12].onClick()}
            },
    ],
    powergain() {
        let pgain = tmp.f.buyables[11].gain
        return pgain
    },
    cpowergain() {
        let pgain = tmp.f.buyables[71].gain
        return pgain
    },
    fDimMult() {
        let mult = new Decimal(1)
        if (hasFUpg(35)) mult = mult.mul(getFUpgEff(35))
        if (hasFUpg(41)) mult = mult.mul(getFUpgEff(41))
        if (hasFUpg(52)) mult = mult.mul(getFUpgEff(52))
        if (hasFUpg(55)) mult = mult.mul(getFUpgEff(55))
        if (hasFUpg(61)) mult = mult.mul(getFUpgEff(61))
        if (hasFUpg(81)) mult = mult.mul(getFUpgEff(81))
        if (hasFUpg(103)) mult = mult.mul(getFUpgEff(103))
        mult = mult.mul(tmp.f.buyables[31].effect)
        mult = mult.mul(tmp.f.buyables[32].effect)
        mult = mult.mul(this.cpeffect())
        if (inChallenge("f",61)) mult = tmp.f.buyables[32].effect
        if (inChallenge("f",62)) mult = this.cpeffect()
        if (hasAchievement("a",54)) mult = mult.mul(2)
        if (hasAchievement("a",65)) mult = mult.mul(tmp.a.effect)
        return mult
    },
    cDimMult() {
        let mult = new Decimal(1)
        if (hasChallenge("f",31)) mult = mult.mul(challengeEffect("f",31))
        if (hasChallenge("f",52)) mult = mult.mul(challengeEffect("f",52))
        mult = mult.mul(this.caseffect())
        if (hasFUpg(153)) mult = mult.mul(getFUpgEff(153))
        return mult
    },
    virusGain() {
        let exp = new Decimal(2)
        if (hasFUpg(163)) exp = exp.add(1).max(1)
        if (hasFUpg(164)) exp = exp.add(getFUpgEff(164))
        if (hasFUpg(165)) exp = exp.add(getFUpgEff(165))
        if (hasFUpg(166)) exp = exp.add(getFUpgEff(166))
        exp = exp.add(tmp.f.buyables[102].effect)
        let gain = player.f.casualty.div("ee4").add(1).max(1).log10().pow(exp).div(10000)
        if (hasFUpg(155)) gain = gain.mul(getFUpgEff(155))
        if (hasFUpg(157)) gain = gain.mul(tmp.f.upgrades[157].effect)
        if (hasFUpg(162)) gain = gain.mul(getFUpgEff(162))
        if (hasFUpg(181)) gain = gain.mul(getFUpgEff(181))
        gain = gain.mul(tmp.f.buyables[101].effect)
        if (hasUpgrade("e",12)) gain = gain.mul(upgradeEffect("e",12))
        if (hasUpgrade("e",125)) gain = gain.mul(upgradeEffect("e",125))
        return gain
    },
    speed() {
        let speed = 1
        if (hasUpgrade("e",12)) speed*=2
        if (hasUpgrade("e",23)) speed*=2
        if (hasUpgrade("e",123)) speed*=2
        if (hasMilestone("e",0)) speed*=4
        return speed
    },
    bulk() {
        let bulk = new Decimal(1)
        if (hasUpgrade("e",12)) bulk = bulk.mul(10)
        if (hasUpgrade("e",23)) bulk = bulk.mul(100)
        if (hasUpgrade("e",123)) bulk = bulk.mul(1000)
        if (hasUpgrade("e",81)) bulk = bulk.pow(10)
        if (hasMilestone("e",8)) bulk = bulk.tetrate(1.79e308)
        return bulk
    },
    int() {
        let int = new Decimal(308)
        if (hasUpgrade("e",155)) int = int.mul(upgradeEffect("e",155))
        return int
    },
    update(diff) {
        player.f.p = player.f.p.add(tmp.f.powergain.mul(diff))
        player.f.cp = player.f.cp.add(tmp.f.cpowergain.mul(diff))
        if (hasMilestone("f",20)) player.f.virus = player.f.virus.add(tmp.f.virusGain.mul(diff)).min(tmp.f.virusGain.mul(60))
        player.f.casualtyTotal = player.f.casualtyTotal.max(player.f.casualty)
        player.f.resettime = player.f.resettime.add(diff)
        if (hasMilestone("f",7)) generatePoints("f",diff/100)
        if (hasMilestone("f",9)) generatePoints("f",diff)
        if (hasMilestone("f",18)) {
            player.f.casualty = player.f.casualty.add(tmp.f.clickables[12].gain.mul(diff/100))
            player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.clickables[12].gain.mul(diff/100))
        }
        if (hasFUpg(113)) {
            player.f.casualty = player.f.casualty.add(getFUpgEff(113).mul(diff))
            player.f.casualtyTotal = player.f.casualtyTotal.add(getFUpgEff(113).mul(diff))
        }
        player.f.buyables[11] = player.f.buyables[11].add(tmp.f.buyables[12].gain.mul(diff))
        player.f.buyables[12] = player.f.buyables[12].add(tmp.f.buyables[13].gain.mul(diff))
        player.f.buyables[13] = player.f.buyables[13].add(tmp.f.buyables[14].gain.mul(diff))
        player.f.buyables[14] = player.f.buyables[14].add(tmp.f.buyables[21].gain.mul(diff))
        player.f.buyables[21] = player.f.buyables[21].add(tmp.f.buyables[22].gain.mul(diff))
        player.f.buyables[22] = player.f.buyables[22].add(tmp.f.buyables[23].gain.mul(diff))
        player.f.buyables[23] = player.f.buyables[23].add(tmp.f.buyables[24].gain.mul(diff))
        player.f.buyables[71] = player.f.buyables[71].add(tmp.f.buyables[72].gain.mul(diff))
        player.f.buyables[72] = player.f.buyables[72].add(tmp.f.buyables[73].gain.mul(diff))
        player.f.buyables[73] = player.f.buyables[73].add(tmp.f.buyables[74].gain.mul(diff))
        player.f.buyables[74] = player.f.buyables[74].add(tmp.f.buyables[81].gain.mul(diff))
        player.f.buyables[81] = player.f.buyables[81].add(tmp.f.buyables[82].gain.mul(diff))
        player.f.buyables[82] = player.f.buyables[82].add(tmp.f.buyables[83].gain.mul(diff))
        player.f.buyables[83] = player.f.buyables[83].add(tmp.f.buyables[84].gain.mul(diff))
        player.f.times = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        if (player.f.casualtyTotal.gte(1)) {
        for (i = 0; i < player.f.t.length; i++) {
            let t = tmp.f.buyables[player.f.buy[i]].speed.mul(diff)
            player.f.t[i] = Decimal.add(player.f.t[i], t)
            if (player.f.t[i].gte(1)) {
                player.f.times[i] = Decimal.floor(player.f.t[i]).mul(-1)
                player.f.t[i] = Decimal.add(player.f.t[i], player.f.times[i])
                player.f.times[i] = player.f.times[i].mul(-1)
                if (tmp.f.buyables[player.f.buy[i]].on) layers.f.buyables[player.f.buy[i]-30].buyMax(tmp.f.buyables[player.f.buy[i]].bulk)
            }
        }
    }
        let st = tmp.f.buyables[64].speed.mul(diff)
        player.f.sact = Decimal.add(player.f.sact, st)
        if (player.f.sact.gte(1) && !inChallenge("f",22) && !hasMilestone("f",14)) {
            player.f.sactimes = Decimal.floor(player.f.sact).mul(-1)
            player.f.sact = Decimal.add(player.f.sact, player.f.sactimes)
            player.f.sactimes = player.f.sactimes.mul(-1)
            if (tmp.f.buyables[64].on && tmp.f.clickables[13].effectnext.gte(100)) layers.f.clickables[13].onClick()
        }
        if (hasMilestone("f",14)) {
            player.f.sac = player.f.buyables[11]
        }
        let m = tmp.f.buyables[91].effect.pow(diff)
        let limit = new Decimal(1.7976e308)
        if (hasFUpg(181)) limit = Decimal.tetrate(10,1.79e308)
        if (tmp.f.buyables[92].effect.gte(0.1)) {
        player.f.rt = Decimal.add(player.f.rt, diff)
            if (player.f.rt.gte(tmp.f.buyables[92].interval) && hasMilestone("f",17)) {
                player.f.rtimes = player.f.rt.mul(-1)
                player.f.rt = Decimal.add(player.f.rt, player.f.rtimes)
                player.f.rtimes = player.f.rtimes.mul(-1)
                player.f.casuals = player.f.casuals.mul(tmp.f.buyables[91].effect).min(limit)
            }
        } 
        else if (player.f.casuals.mul(m.pow(tmp.f.buyables[92].interval.pow(-1))).gte(Decimal.pow(10,tmp.f.buyables[91].effect.log10().div(tmp.f.buyables[92].effect).mul(1e4).log(getFUpgEff(184)).mul(tmp.f.int)))) {
            player.f.casuals = Decimal.pow(10,tmp.f.buyables[91].effect.log10().div(tmp.f.buyables[92].effect).mul(0.0001).log(getFUpgEff(184)).mul(tmp.f.int))
        }
        else {
            player.f.casuals = player.f.casuals.mul(m.pow(tmp.f.buyables[92].interval.pow(-1))).min(limit)
        }
        player.f.casuals = player.f.casuals.max(1)
        let bst = tmp.f.speed*diff
        player.f.bt = Decimal.add(player.f.bt, bst)
        if (player.f.bt.gte(1)) {
            player.f.btimes = Decimal.floor(player.f.bt).mul(-1)
            player.f.bt = Decimal.add(player.f.bt, player.f.btimes)
            player.f.btimes = player.f.btimes.mul(-1)
            if (hasUpgrade("f", 187)) {
                layers.f.buyables[101].buyMax(player.f.btimes.mul(tmp.f.bulk))
                layers.f.buyables[102].buyMax(player.f.btimes.mul(tmp.f.bulk))
                layers.f.buyables[103].buyMax(player.f.btimes.mul(tmp.f.bulk))
            }
        }
        if (player.f.cmultauto) {
            if (hasMilestone("f",18)) {
                let max = player.f.casualty.div(5).max(1).log10()
                if (max.gte(1e35)) max = max.div(1e35).pow(1/3).mul(1e35)
                player.f.buyables[34] = max
            }
            else layers.f.clickables[14].onClick()
        }
        if (player.f.cdauto) {
            player.f.cd[0] = player.f.casualty.div(1e14).log10().div(5).ceil()
            player.f.cd[1] = player.f.casualty.div(1e16).log10().div(9).ceil()
            player.f.cd[2] = player.f.casualty.div(1e29).log10().div(13).ceil()
            player.f.cd[3] = player.f.casualty.div(1e50).log10().div(17).ceil()
            player.f.cd[4] = player.f.casualty.div(Decimal.pow(10,460)).log10().div(20).ceil()
            player.f.cd[5] = player.f.casualty.div(Decimal.pow(10,575)).log10().div(25).ceil()
            player.f.cd[6] = player.f.casualty.div(Decimal.pow(10,790)).log10().div(30).ceil()
            player.f.cd[7] = player.f.casualty.div(Decimal.pow(10,1905)).log10().div(40).ceil()
            player.f.buyables[84] = player.f.casualty.div(Decimal.pow(10,1905)).log10().div(40).ceil()
        }
        if (player.f.crbauto) layers.f.buyables[93].buyMax()
        if (player.f.iauto) hasMilestone("e",0) ? layers.f.buyables[92].buyMax() : layers.f.buyables[92].buy()
        if (player.f.rmultauto) {
            if (hasFUpg(183)) {
                let max = player.f.casualty.div(Decimal.pow(10,470)).log10().div(25).ceil()
                player.f.buyables[91] = max
            }
            else layers.f.buyables[91].buyMax()
        }
        if (player.f.rbauto && tmp.f.clickables[52].canClick && !hasFUpg(181)) layers.f.clickables[52].onClick()
        if (player.f.rbauto && hasFUpg(181)) player.f.cboosts = tmp.f.buyables[93].effect
    },
    canReset() {return player.d.points.gte(Decimal.pow(10,10450)) && !hasMilestone("f",9)},
    gainMult() {
        let mult = new Decimal(1)
        if (hasFUpg(12)) mult = mult.mul(getFUpgEff(12))
        if (hasFUpg(14)) mult = mult.mul(getFUpgEff(14))
        if (hasFUpg(22)) mult = mult.mul(getFUpgEff(22))
        if (hasFUpg(24)) mult = mult.mul(getFUpgEff(24))
        mult = mult.mul(tmp.f.peffect)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        if (hasFUpg(25)) exp = exp.add(1).max(1)
        if (hasFUpg(32)) exp = exp.add(getFUpgEff(32))
        if (hasFUpg(42)) exp = exp.add(getFUpgEff(42))
        if (hasFUpg(51)) exp = exp.add(getFUpgEff(51))
        return exp
    },
    getResetGain() {
        let f = tmp.f.baseAmount
        if (inChallenge("f",31)) f = Decimal.pow(10,10450)
        if (f.lt(tmp.f.requires)) return new Decimal(0)
        let gain = f.div(tmp.f.requires).mul(10).log10().pow(tmp.f.exponent).pow(this.gainExp()).mul(this.gainMult())
        if (inChallenge("f",42)) gain = gain.pow(0.1)
        if (inChallenge("f",51)) gain = Decimal.pow(10,gain.log10().pow(0.75))
        if (hasChallenge("f",42)) gain = gain.pow(1.05)
        if (hasFUpg(171)) gain = gain.pow(getFUpgEff(171))
        if (hasUpgrade("e",175)) gain = gain.pow(upgradeEffect("e",175))
        if (hasUpgrade("e",194)) gain = gain.pow(upgradeEffect("e",194))
        return gain.floor()
    },
    getNextAt() {
        let next = tmp.f.getResetGain.add(1).max(1)
		if (next.gte(tmp.f.softcap)) next = next.div(tmp.f.softcap.pow(decimalOne.sub(tmp.f.softcapPower))).pow(decimalOne.div(tmp.f.softcapPower))
		next = Decimal.pow(10,(next.div(tmp.f.gainMult).root(tmp.f.exponent).root(tmp.f.gainExp))).mul(tmp.f.requires).div(10).max(tmp.f.requires)
		return next;
    },
    prestigeButtonText() {
        let text =  `${ player.f.points.lt(1e3) ? (tmp.f.resetDescription !== undefined ? tmp.f.resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp.f.resetGain)}</b> ${tmp.f.resource} ${tmp.f.getResetGain.lt(100) && player.f.points.lt(1e3) ? `<br><br>Next at ${ (tmp.f.roundUpCost ? formatWhole(tmp.f.nextAt) : format(tmp.f.nextAt))} ${ tmp.f.baseResource }` : ""}` + "<br>"
        let gain = tmp.f.getResetGain.div(player.f.resettime)
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
        if (hasFUpg(53)) base = base.add(getFUpgEff(53))
        if (hasFUpg(82)) base = base.add(0.3)
        if (inChallenge("f",12)) base = new Decimal(1)
        return base
    },
    cmultpd() {
        let base = new Decimal(5)
        return base
    },
    effect() {
        let eff = player.f.best.add(1).max(1)
        eff = eff.pow(eff.log10().add(1).max(1).pow(1.7)).pow(15)
        if (hasFUpg(15)) eff = eff.pow(getFUpgEff(15))
        if (hasFUpg(124)) eff = eff.pow(getFUpgEff(124))
        if (eff.gte(Decimal.pow(10,2e6))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,2e6)).log10().pow(0.85)).mul(Decimal.pow(10,2e6))
        return eff
    },
    effect2() {
        let eff = player.f.best.add(1).max(1)
        eff = eff.pow(eff.log10().add(1).max(1).pow(1.2)).pow(2)
        if (hasFUpg(124)) eff = eff.pow(getFUpgEff(124))
        return eff
    },
    peffect() {
        let eff = player.f.p.add(1).max(1)
        eff = eff.pow(0.6)
        if (hasFUpg(62)) eff = eff.pow(getFUpgEff(62))
        if (hasFUpg(161)) eff = eff.pow(getFUpgEff(161))
        if (hasUpgrade("e",144)) eff = eff.pow(upgradeEffect("e",144))
        if (eff.gte(Decimal.pow(10,1e8))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e8)).log10().pow(0.8)).mul(Decimal.pow(10,1e8))
        if (eff.gte(Decimal.pow(10,5e10))) eff = hasUpgrade("e",141) ? Decimal.pow(10,eff.div(Decimal.pow(10,5e10)).log10().pow(0.93)).mul(Decimal.pow(10,5e10)) : eff.log10().div(5).pow(5e9)
        if (eff.gte(Decimal.pow(10,1e66))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e66)).log10().pow(0.66)).mul(Decimal.pow(10,1e66))
        if (inChallenge("f",52)) eff = new Decimal(1)
        return eff
    },
    cpeffect() {
        let eff = player.f.cp.add(1).max(1)
        eff = eff.pow(50)
        if (hasChallenge("f",42)) eff = eff.pow(1.5)
        if (hasChallenge("f",62)) eff = eff.pow(challengeEffect("f",62))
        if (hasFUpg(167)) eff = eff.pow(getFUpgEff(167))
        if (eff.gte(Decimal.pow(10,2e9))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,2e9)).log10().pow(0.8)).mul(Decimal.pow(10,2e9))
        return eff
    },
    caseffect() {
        let eff = player.f.casuals.max(1)
        eff = eff.log10().add(1).max(1).pow(30) 
        if (eff.gte(1e30)) eff = eff.div(1e30).pow(0.2).mul(1e30)
        if (hasFUpg(181)) eff = eff.add(player.f.casuals.max(1).pow(20))
        return eff
    },
    DimScaling() {
        let scale = new Decimal(10)
        if (inChallenge("f",21)) scale = new Decimal(100)
        if (inChallenge("f",41)) scale = new Decimal(1.797e308)
        if (hasFUpg(65)) scale = scale.sub(1)
        if (hasFUpg(73)) scale = scale.sub(1)
        if (hasFUpg(111)) scale = scale.sub(1)
        if (hasFUpg(84)) scale = scale.sub(1)
        if (hasFUpg(115)) scale = scale.sub(1)
        if (hasFUpg(122)) scale = scale.sub(1)
        if (hasFUpg(134)) scale = scale.sub(0.5)
        if (hasFUpg(154)) scale = scale.sub(getFUpgEff(154))
        if (hasFUpg(185)) scale = scale.sub(tmp.f.upgrades[185].effect)
        if (hasChallenge("f",41)) scale = scale.sub(1)
        if (hasUpgrade("e",35)) scale = scale.pow(0.05)
        if (hasUpgrade("e",186)) scale = new Decimal(1.000001)
        return scale
    },
    effectDescription() {
        return "which boost cases, VP, infectivity, severity by " + layerText("h2", "f", format(this.effect())) + ", and death gain by " +layerText("h2", "f", format(this.effect2())) + " (based on best)."
    },
    tabFormat: {
        "Milestones": {
            content: [
                function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Milestones") return "main-display"},
                ["raw-html", function() {if (hasMilestone("f",9)) return "You are gaining " + layerText("h2", "f", format(tmp.f.getResetGain)) + " fatality per second"}],
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
                function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Upgrades") return "main-display"},
                ["raw-html", function() {if (hasMilestone("f",9)) return "You are gaining " + layerText("h2", "f", format(tmp.f.getResetGain)) + " fatality per second"}],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Upgrades") return ["upgrades",[1,2,3,4,5,6,7]]}
            ]
        },
        "Dimensions": {
            content: [
                function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Dimensions") return "main-display"},
                ["raw-html", function() {if (hasMilestone("f",9) && player.tab == "f" && player.subtabs.f.mainTabs == "Dimensions" ) return "You are gaining " + layerText("h2", "f", format(tmp.f.getResetGain)) + " fatality per second"}],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["raw-html", function() {
                    if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions" ) return
                    let dis = "You have " + layerText("h2", "f", format(player.f.p)) + " fatality power, which boosts fatality gain by " + layerText("h2", "f", format(tmp.f.peffect))
                    if (tmp.f.peffect.gte(Decimal.pow(10,1e8))) dis += " (softcapped)"
                    return dis
                }],
                ["raw-html", 
                function () {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Dimensions") {
                    let a = "You are gaining " + format(tmp.f.powergain) + " fatality power per second.<br>"
                    let b = "You are gaining " + format(tmp.f.buyables[12].gain) + " Fatality Dimension 1 per second.<br>"
                    let c = "You are gaining " + format(tmp.f.buyables[13].gain) + " Fatality Dimension 2 per second.<br>"
                    let d = "You are gaining " + format(tmp.f.buyables[14].gain) + " Fatality Dimension 3 per second.<br>"
                    let e = "You are gaining " + format(tmp.f.buyables[21].gain) + " Fatality Dimension 4 per second.<br>"
                    let f = "You are gaining " + format(tmp.f.buyables[22].gain) + " Fatality Dimension 5 per second.<br>"
                    let g = getBuyableAmount("f",32).gte(1)?"You are gaining " + format(tmp.f.buyables[23].gain) + " Fatality Dimension 6 per second.<br>":""
                    let h = getBuyableAmount("f",33).gte(1)?"You are gaining " + format(tmp.f.buyables[24].gain) + " Fatality Dimension 7 per second.<br>":""
                    return a+b+c+d+e+f+g+h
                    }
                }],
                "blank",
                ["row", [["clickable", 11],["clickable", 13]]],
                ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13], ["buyable", 14]]],
                ["row", [["buyable", 21], ["buyable", 22], ["buyable", 23], ["buyable", 24]]],
                ["row", [["buyable", 31], ["buyable", 32], ["buyable", 33]]],
            ],
            unlocked() {return hasMilestone("f", 6)}
        },
        "Casualty": {
            content: [
                function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty") return "main-display"},
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Casualty") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty") return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["display-text", 
                function() {
                    if (!hasMilestone("f",18)) return "Casualty time: " + formatTime(player.f.resettime)
                }
                ],
                ["display-text", 
                function() {
                    let dis = "Best Casualty/min: "
                    if (player.f.cpm.lt(10)) dis += format(player.f.cpm.mul(60)) + "/min"
                    else dis += format(player.f.cpm) + "/s"
                    if (!hasMilestone("f",18)) return dis
                }
                ],
                ["raw-html", "<br><h2>Casualty Upgrades</h2><br>"],
                function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty") return ["upgrades",[8,9,10,11,12,13,14]]}
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 12)},
        },
        "Multiplier": {
            content: [
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Multiplier") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Multiplier") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["column", [["row", [["clickable", 14]]]]],
                ["row", [["buyable", 34]]],
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 12)},
        },
        "Challenges": {
            content: [
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Challenges") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Challenges") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Challenges") return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["display-text", 
                function() {
                    return "Starting a challenge does a casualty reset. Completing a challenge gives " + formatWhole(tmp.f.buyables[34].effect) + " casualty"
                }
                ],
                ["bar", "NextCC"],
                "challenges"
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 12)},
        },
        "Autobuyers": {
            content: [
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Autobuyers") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Autobuyers") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Autobuyers") return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["row",[["column", [["buyable", 41],["clickable", 21]]],["column", [["buyable", 42],["clickable", 22]]],["column", [["buyable", 43],["clickable", 23]]],["column", [["buyable", 44],["clickable", 24]]]]],
                ["row",[["column", [["buyable", 51],["clickable", 31]]],["column", [["buyable", 52],["clickable", 32]]],["column", [["buyable", 53],["clickable", 33]]],["column", [["buyable", 54],["clickable", 34]]]]],
                ["row",[["column", [["buyable", 61],["clickable", 41]]],["column", [["buyable", 62],["clickable", 42]]],["column", [["buyable", 63],["clickable", 43]]],["column", [["buyable", 64],["clickable", 44]]]]],
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasChallenge("f", 11)},
        },
        "Casualty Dimensions": {
            content: [
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty Dimensions" ) return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Casualty Dimensions" ) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty Dimensions" ) return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["raw-html", function() {
                    if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions" ) return
                    let dis = "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(player.f.cp) + "</h2> casualty power, which boosts Fatality Dimensions by <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(tmp.f.cpeffect) +"</h2>"
                    if (tmp.f.cpeffect.gte(Decimal.pow(10,2e9))) dis += " (softcapped)"
                    return dis
                }],
                ["raw-html", 
                function () {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Casualty Dimensions") {
                    let a = "You are gaining " + format(tmp.f.cpowergain) + " casualty power per second.<br>"
                    let b = "You are gaining " + format(tmp.f.buyables[72].gain) + " Casualty Dimension 1 per second.<br>"
                    let c = tmp.f.buyables[73].unlocked?"You are gaining " + format(tmp.f.buyables[73].gain) + " Casualty Dimension 2 per second.<br>":""
                    let d = tmp.f.buyables[74].unlocked?"You are gaining " + format(tmp.f.buyables[74].gain) + " Casualty Dimension 3 per second.<br>":""
                    let e = tmp.f.buyables[81].unlocked?"You are gaining " + format(tmp.f.buyables[81].gain) + " Casualty Dimension 4 per second.<br>":""
                    let f = tmp.f.buyables[82].unlocked?"You are gaining " + format(tmp.f.buyables[82].gain) + " Casualty Dimension 5 per second.<br>":""
                    let g = tmp.f.buyables[83].unlocked?"You are gaining " + format(tmp.f.buyables[83].gain) + " Fatality Dimension 6 per second.<br>":""
                    let h = tmp.f.buyables[84].unlocked?"You are gaining " + format(tmp.f.buyables[84].gain) + " Fatality Dimension 7 per second.<br>":""
                    return a+b+c+d+e+f+g+h
                    }
                }],
                ["bar", "NextCD"],
                "blank",
                ["column", [["row", [["clickable", 51]]]]],
                ["row", [["buyable", 71],["buyable", 72],["buyable", 73],["buyable", 74]]],
                ["row", [["buyable", 81],["buyable", 82],["buyable", 83],["buyable", 84]]],
                
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 16)},
        },
        "Casuals": {
            content: [
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casuals") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Casuals") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Casuals") return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casuals") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casuals) +"</h2> casuals, which boost Casualty Dimensions by <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(tmp.f.caseffect) +"</h2>"}],
                "blank",
                ["row", [["column", [["buyable", 91],["clickable", 62]]], ["column", [["buyable", 92],["clickable", 61]]], ["column", [["buyable", 93],["clickable", 53]]]]],
                ["row", [["column", [["clickable", 52],["clickable", 54]]]]]
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 17)},
        },
        "Casual Virus": {
            content: [
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casual Virus") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18) && player.tab == "f" && player.subtabs.f.mainTabs == "Casual Virus") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    if (player.tab == "f" && player.subtabs.f.mainTabs == "Casual Virus") return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                "blank",
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casual Virus") return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(player.f.virus) +"</h2> casual viruses"}],
                "blank",
                ["raw-html", function() {if (player.tab == "f" && player.subtabs.f.mainTabs == "Casual Virus") return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(tmp.f.virusGain) +"</h2> casual viruses per second, with a limit of <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(tmp.f.virusGain.mul(60)) + "</h2> casual viruses"}],
                ["upgrades",[15,16,17,18]],
                ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103]]]
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 20)},
        },
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
            done() { return player.f.total.gte(3e33) },
            unlocked() {return hasMilestone("f",6)}
        },
        8: {
            requirementDescription() { return "4.44e44 total fatality" },
            effectDescription() { return "Unlock Dimension Multiplier and autobuyers buy 100x more." },
            done() { return player.f.total.gte(4.44e44) },
            unlocked() {return hasMilestone("f",6)}
        },
        9: {
            requirementDescription() { return format(Decimal.pow(2,512)) + " total fatality" },
            effectDescription() { return "Gain 100% of fatality gain per second and disable prestige." },
            done() { return player.f.total.gte(Decimal.pow(2,512)) },
            unlocked() {return hasMilestone("f",6)}
        },
        10: {
            requirementDescription() { return "6.969e420 total fatality" },
            effectDescription() { return "Unlock Dimension Shifts and dimensions cost nothing." },
            done() { return player.f.total.gte("6.969e420") },
            unlocked() {return hasMilestone("f",9)}
        },
        11: {
            requirementDescription() { return "1.337e1,337 total fatality" },
            effectDescription() { return "Unlock Multiplier Boosts and buy max Dimension Boosts." },
            done() { return player.f.total.gte("1.337e1337") },
            unlocked() {return player.f.points.gte(Decimal.pow(10,1e3)) || hasMilestone("f",11)}
        },
        12: {
            requirementDescription() { return "5.095e5,095 total fatality" },
            effectDescription() { return "Unlock Casualty and buy max Multiplier Boosts." },
            done() { return player.f.total.gte(Decimal.pow(10,5095).mul(5)) },
            unlocked() {return player.f.points.gte(Decimal.pow(10,4e3)) || hasMilestone("f",12)}
        },
        13: {
            requirementDescription() { return "50 total casualty" },
            effectDescription() { return "Multiplier Boosts don't reset Dimension Boosts and unlock Auto Sacrifice." },
            done() { return player.f.casualtyTotal.gte(50) },
            unlocked() {return player.f.casualtyTotal.gte(1)}
        },
        14: {
            requirementDescription() { return "10,000,000 total casualty" },
            effectDescription() { return "Dimension Boosts and Sacrifice reset nothing." },
            done() { return player.f.casualtyTotal.gte(1e7) },
            unlocked() {return player.f.casualtyTotal.gte(1e6)}
        },
        15: {
            requirementDescription() { return "1e12 total casualty" },
            effectDescription() { return "Multiplier Boosts reset nothing." },
            done() { return player.f.casualtyTotal.gte(1e12) },
            unlocked() {return player.f.casualtyTotal.gte(1e9)}
        },
        16: {
            requirementDescription() { return "1e14 total casualty" },
            effectDescription() { return "Unlock Casualty Dimensions." },
            done() { return player.f.casualtyTotal.gte(1e14) },
            unlocked() {return player.f.casualtyTotal.gte(1e12)}
        },
        17: {
            requirementDescription() { return "4.70e470 total casualty" },
            effectDescription() { return "Unlock Casuals." },
            done() { return player.f.casualtyTotal.gte("4.70e470") },
            unlocked() {return player.f.casualtyTotal.gte(1e100)}
        },
        18: {
            requirementDescription() { return "1e1000 total casualty" },
            effectDescription() { return "Gain 1% of casualty gain per second, autobuy Casualty Multiplier, Casualty Multiplier costs nothing, and disable prestige." },
            done() { return player.f.casualtyTotal.gte(Decimal.pow(10,1e3)) },
            toggles: [["f", "cmultauto"]],
            unlocked() {return player.f.casualtyTotal.gte("e500")}
        },
        19: {
            requirementDescription() { return "5.555e5,555 total casualty" },
            effectDescription() { return "Autobuy Casualty Dimensions and they cost nothing." },
            done() { return player.f.casualtyTotal.gte("e5555") },
            toggles: [["f", "cdauto"]],
            unlocked() {return player.f.casualtyTotal.gte(Decimal.pow(10,1e3))}
        },
        20: {
            requirementDescription() { return "1e10,000 total casualty" },
            effectDescription() { return "Unlock Casual Virus and Replicated Boost Autobuyer." },
            done() { return player.f.casualtyTotal.gte("ee4") },
            unlocked() {return player.f.casualtyTotal.gte("e5000")}
        },
        21: {
            requirementDescription() { return "1e100,000 total casualty" },
            effectDescription() { return "Unlock Casual Virus buyables." },
            done() { return player.f.casualtyTotal.gte("ee5") },
            unlocked() {return player.f.casualtyTotal.gte("ee4")}
        },
    },
    clickables: {
        rows: 6,
        cols: 4,
        11: {
            display() {
                return "<h2>Max All (M)</h2>"
            },
            canClick() {return true},
            onClick() {
                layers.f.buyables[11].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[12].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[13].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[14].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[21].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[22].buyMax(Decimal.tetrate(10,1.79e308))
                if (getBuyableAmount("f",32).gte(1)) layers.f.buyables[23].buyMax(Decimal.tetrate(10,1.79e308))
                if (getBuyableAmount("f",32).gte(2)) layers.f.buyables[24].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[31].buyMax(Decimal.tetrate(10,1.79e308))
            },
            style: {'height':'130px', 'width':'130px'},
        },
        12: {
            gain() { 
                let f = player.f.points.add(1).max(1)
                f = Decimal.pow(10,f.log10().div(5095).sub(1)).max(1).mul(tmp.f.clickables[12].gainmult)
                return f.floor()
            },
            next() {
                let gain = tmp.f.clickables[12].gain.add(1).max(1)
                let next = Decimal.pow(10,gain.div(tmp.f.clickables[12].gainmult).log10().add(1).max(1).mul(5095))
                return next
            },
            gainmult() {
                let mult = tmp.f.buyables[34].effect 
                if (hasFUpg(94)) mult = mult.mul(getFUpgEff(94))
                if (hasFUpg(104)) mult = mult.mul(getFUpgEff(104))
                if (hasFUpg(114)) mult = mult.mul(getFUpgEff(114))
                if (hasFUpg(85)) mult = mult.mul(getFUpgEff(85))
                return mult
            },
            display() {
                let dis = "Reset Dimensions for +<h3>" + formatWhole(tmp.f.clickables[12].gain) + "</h3> casualty<br>"
                if (tmp.f.clickables[12].gain.lt(1000)) {
                if (player.f.points.gte(Decimal.pow(10,5095).mul(5))) dis += "Next at " + format(tmp.f.clickables[12].next) + " fatality"
                else dis += "Req: 5.095e5,095 fatality"
                }
                if (tmp.f.clickables[12].gain.div(player.f.resettime).gte(10)) dis += "<br>" + format(tmp.f.clickables[12].gain.div(player.f.resettime)) + "/s"
                else dis += "<br>" + format(tmp.f.clickables[12].gain.div(player.f.resettime).mul(60)) + "/min"
                return dis
            },
            canClick() {
                return player.f.points.gte(Decimal.pow(10,5095).mul(5)) && !hasMilestone("f",18)
            },
            onClick() {
                if (!hasMilestone("f",18)) {player.f.casualty = player.f.casualty.add(tmp.f.clickables[12].gain)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.clickables[12].gain)
                player.f.cpm = player.f.cpm.max(tmp.f.clickables[12].gain.div(player.f.resettime))
                startCChallenge(0)
                }
            },
            style: {'height':'130px', 'width':'175px', 'font-size':'13px',
            'background-color'() {
                let points = player.f.points
                let color = "#bf8f8f"
                if (points.gte(Decimal.pow(10,5095).mul(5))) color = "#3d2963"
                return color
            }
        }
        },
        14: {
            display() {
                return "<h2>Buy Max</h2>"
            },
            canClick() {return true},
            onClick() {
                layers.f.buyables[34].buyMax()
            },
            style: {'height':'130px', 'width':'130px',
                "background-color"() {
                    let color = "#3d2963"
                    return color
                }
            },
        },
        13: {
            display() {
                if (player.tab != "f") return 
                let dis = "<h2>Sacrifice</h2><br>Multiply Fatality Dimension 8 by " + format(this.effectnext().max(1)) + "."
                dis += "<br>Multiplier: " + format(this.effect()) + "x"
                return dis
            },
            effect() {
                let eff = player.f.sac.add(1).max(1).pow(0.025)
                if (hasChallenge("f",32)) eff = eff.pow(3)
                if (eff.gte(Decimal.pow(10,1e8))) eff = eff.div(Decimal.pow(10,1e8)).pow(0.2).mul(Decimal.pow(10,1e8))
                return eff
            },
            effectnext() {
                let eff = player.f.buyables[11].pow(0.025)
                if (hasChallenge("f",32)) eff = eff.pow(3)
                if (eff.gte(Decimal.pow(10,1e8))) eff = eff.div(Decimal.pow(10,1e8)).pow(0.2).mul(Decimal.pow(10,1e8))
                return eff.div(this.effect())
            },
            canClick() {return this.effectnext().gte(1) && player.f.buyables[24].gte(1)},
            onClick() {
                player.f.sac = player.f.sac.add(player.f.buyables[11])
                if (!hasMilestone("f",14)) {
                player.f.buyables[11] = new Decimal(0)
                player.f.buyables[12] = new Decimal(0)
                player.f.buyables[13] = new Decimal(0)
                player.f.buyables[14] = new Decimal(0)
                player.f.buyables[21] = new Decimal(0)
                player.f.buyables[22] = new Decimal(0)
                player.f.buyables[23] = new Decimal(0)
                }
            },
            unlocked() {return hasFUpg(83)},
            style: {'height':'130px', 'width':'130px'},
        },
        21: {
            display() {
                if (player.f.d1auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d1auto) player.f.d1auto = false 
                else player.f.d1auto = true
            },
            unlocked() {
                return hasChallenge("f",11)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        22: {
            display() {
                if (player.f.d2auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d2auto) player.f.d2auto = false 
                else player.f.d2auto = true
            },
            unlocked() {
                return hasChallenge("f",11)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        23: {
            display() {
                if (player.f.d3auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d3auto) player.f.d3auto = false 
                else player.f.d3auto = true
            },
            unlocked() {
                return hasChallenge("f",11)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        24: {
            display() {
                if (player.f.d4auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d4auto) player.f.d4auto = false 
                else player.f.d4auto = true
            },
            unlocked() {
                return hasChallenge("f",12)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        31: {
            display() {
                if (player.f.d5auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d5auto) player.f.d5auto = false 
                else player.f.d5auto = true
            },
            unlocked() {
                return hasChallenge("f",12)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        32: {
            display() {
                if (player.f.d6auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d6auto) player.f.d6auto = false 
                else player.f.d6auto = true
            },
            unlocked() {
                return hasChallenge("f",12)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        33: {
            display() {
                if (player.f.d7auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d7auto) player.f.d7auto = false 
                else player.f.d7auto = true
            },
            unlocked() {
                return hasChallenge("f",21)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        34: {
            display() {
                if (player.f.d8auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d8auto) player.f.d8auto = false 
                else player.f.d8auto = true
            },
            unlocked() {
                return hasChallenge("f",21)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        41: {
            display() {
                if (player.f.multauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.multauto) player.f.multauto = false 
                else player.f.multauto = true
            },
            unlocked() {
                return hasChallenge("f",21)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        42: {
            display() {
                if (player.f.boostauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.boostauto) player.f.boostauto = false 
                else player.f.boostauto = true
            },
            unlocked() {
                return hasChallenge("f",22)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        43: {
            display() {
                if (player.f.multbauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.multbauto) player.f.multbauto = false 
                else player.f.multbauto = true
            },
            unlocked() {
                return hasChallenge("f",22)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        44: {
            display() {
                if (player.f.sacauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.sacauto) player.f.sacauto = false 
                else player.f.sacauto = true
            },
            unlocked() {
                return hasMilestone("f",13)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        51: {
            display() {
                return "<h2>Max All (M)</h2>"
            },
            canClick() {return true},
            onClick() {
                layers.f.buyables[71].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[72].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[73].unlocked) layers.f.buyables[73].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[74].unlocked) layers.f.buyables[74].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[81].unlocked) layers.f.buyables[81].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[82].unlocked) layers.f.buyables[82].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[83].unlocked) layers.f.buyables[83].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[84].unlocked) layers.f.buyables[84].buyMax(Decimal.tetrate(10,1.79e308))
            },
            style: {'height':'130px', 'width':'130px', 'background-color':"#3d2963"},
        },
        52: {
            display() {
                let dis = "Reset casuals for a Replicated Boost.<br>"
                dis += "Replicated Boosts: " + formatWhole(player.f.cboosts) + "/" + formatWhole(tmp.f.buyables[93].effect)
                return dis
            },
            canClick() {return player.f.casuals.gte(1.796e308) && player.f.cboosts.lt(tmp.f.buyables[93].effect) },
            onClick() {
                if (!hasFUpg(181)) player.f.casuals = new Decimal(1)
                if (!hasFUpg(181)) player.f.cboosts = player.f.cboosts.add(1).max(1)
                else player.f.cboosts = tmp.f.buyables[93].effect
            },
            style: {'height':'130px', 'width':'175px', 'font-size':'13px',
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.f.clickables[52].canClick) color = "#3d2963"
                return color
            }}
        },
        53: {
            display() {
                if (player.f.crbauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.crbauto) player.f.crbauto = false 
                else player.f.crbauto = true
            },
            unlocked() {
                return hasMilestone("f",20)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        54: {
            display() {
                if (player.f.rbauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.rbauto) player.f.rbauto = false 
                else player.f.rbauto = true
            },
            unlocked() {
                return hasMilestone("f",20)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        61: {
            display() {
                if (player.f.iauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.iauto) player.f.iauto = false 
                else player.f.iauto = true
            },
            unlocked() {
                return hasFUpg(182)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        62: {
            display() {
                if (player.f.rmultauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.rmultauto) player.f.rmultauto = false 
                else player.f.rmultauto = true
            },
            unlocked() {
                return hasFUpg(183)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
    },
    buyables: {
		rows: 10,
        cols: 4,
        11: {
			title: "Fatality Dimension 1",
			cost(x=player.f.d1) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e3, x).mul(1e11)
                let scale = x.sub(330)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(91) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(91))
                if (hasFUpg(34) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(34))
                if (inChallenge("f", 11)) eff = eff.div("1.8e308")
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { //log10(cost/1e1001)/log10(Inc) = (x^2+x)/2+3x
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1001").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(329)
                let max = f.div(1e11).log10().div(3).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(3).mul(4).mul(z).add(z.pow(2)).add(36).pow(0.5).sub(z).sub(6).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d1).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e3,max)).div(-999).mul(1e11)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',},
        },
        12: {
			title: "Fatality Dimension 2",
			cost(x=player.f.d2) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e4, x).mul(1e14)
                let scale = x.sub(247)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(92) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(92))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d2 = player.f.d2.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1001").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(246)
                let max = f.div(1e14).log10().div(4).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(4).mul(4).mul(z).add(z.pow(2)).add(64).pow(0.5).sub(z).sub(8).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d2).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e4,max)).div(-9999).mul(1e14)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
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
                let scale = x.sub(197)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(101) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(101))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d3 = player.f.d3.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div(Decimal.pow(10,1e3)).log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(196)
                let max = f.div(1e15).log10().div(5).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(5).mul(4).mul(z).add(z.pow(2)).add(100).pow(0.5).sub(z).sub(10).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d3).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e5,max)).div(-99999).mul(1e15)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
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
                let scale = x.sub(164)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(102) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(102))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d4 = player.f.d4.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1002").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(163)
                let max = f.div(1e18).log10().div(6).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(6).mul(4).mul(z).add(z.pow(2)).add(144).pow(0.5).sub(z).sub(12).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d4).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e6,max)).div(-999999).mul(1e18)
                if (this.canAfford()) { 
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
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
                let scale = x.sub(123)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(102) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(102))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d5 = player.f.d5.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1005").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(122)
                let max = f.div(1e21).log10().div(8).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(8).mul(4).mul(z).add(z.pow(2)).add(256).pow(0.5).sub(z).sub(16).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d5).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e8,max)).div(-99999999).mul(1e21)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
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
                let scale = x.sub(98)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(101) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(101))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d6 = player.f.d6.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1006").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(97)
                let max = f.div(1e26).log10().div(10).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(10).mul(4).mul(z).add(z.pow(2)).add(400).pow(0.5).sub(z).sub(20).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d6).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e10,max)).div(-9999999999).mul(1e26)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d6 = player.f.d6.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        23: {
			title: "Fatality Dimension 7",
			cost(x=player.f.d7) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e12, x).mul("e435")
                let scale = x.sub(48)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let total = getBuyableAmount("f", 23)
                return total
            },
            bought() {
                let bought = player.f.d7
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(92) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(92))
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
                return "Produces Fatality Dimension 6.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.buyables[32].gte(1) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost) && !inChallenge("f",22)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d7 = player.f.d7.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1011").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(47)
                let max = f.div("e435").log10().div(12).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(12).mul(4).mul(z).add(z.pow(2)).add(576).pow(0.5).sub(z).sub(24).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d7).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e12,max)).div(-1e12).mul("e435")
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d7 = player.f.d7.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        24: {
			title: "Fatality Dimension 8",
			cost(x=player.f.d8) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e15, x).mul("e560")
                let scale = x.sub(30)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
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
                let total = getBuyableAmount("f", 24)
                return total
            },
            bought() {
                let bought = player.f.d8
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(91) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(91))
                if (!inChallenge("f",61)) eff = eff.mul(tmp.f.clickables[13].effect)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
                return "Produces Fatality Dimension 7.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.buyables[32].gte(2) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost) && !inChallenge("f",22)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d8 = player.f.d8.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1010").log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(29)
                let max = f.div("e560").log10().div(15).ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(15).mul(4).mul(z).add(z.pow(2)).add(900).pow(0.5).sub(z).sub(30).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d8).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e15,max)).div(-1e15).mul("e560")
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d8 = player.f.d8.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        31: {
			title: "Fatality Dimension Multiplier",
			cost(x=player.f.mult) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x).mul(1e45)
                let scale = x.sub(955)
                if (cost.gte(Decimal.pow(10,1e3)) && !hasUpgrade("e",186)) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).max(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = new Decimal(1.1)
                if (hasFUpg(63)) base = base.add(getFUpgEff(63))
                if (hasFUpg(64)) base = base.add(getFUpgEff(64))
                base = base.mul(layers.f.buyables[33].effect())
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
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
                return "Multiply fatality dimensions by " + format(this.base()) + "\n\
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
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.mult = player.f.mult.add(1).max(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div(Decimal.pow(10,1e3)).log10()
                let m = Decimal.tetrate(10,(hasUpgrade("e",186)+0)*1.79e308).add(954)
                let max = player.f.points.div(1e45).log10().ceil().min(m)
                if (max.gte(m)) max = max.add(s.mul(2).add(1).max(1).mul(4).mul(z).add(z.pow(2)).add(4).pow(0.5).sub(z).sub(2).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.mult).min(b)
                cost = Decimal.sub(1,Decimal.pow(10,diff)).div(-9).mul(cost)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.mult = player.f.mult.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        32: {
			title() {
                let dim = "Fatality Dimension Shift"
                if (tmp.f.buyables[32].total.gte(2)) dim = "Fatality Dimension Boost"
                return dim
            },
			cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = new Decimal(40)
                let x = tmp.f.buyables[32].total
                if (x.gte(1e18)) x = x.div(1e18).pow(2).mul(1e18)
                if (x.gte(1)) cost = new Decimal(10)
                if (x.gte(2)) cost = Decimal.add(10,x.sub(2).mul(this.scale()))
                return cost.floor()
            },
            scale() {
                let scale = new Decimal(4)
                if (hasFUpg(65)) scale = scale.sub(1)
                if (hasFUpg(74)) scale = scale.sub(0.5)
                if (hasFUpg(84)) scale = scale.sub(0.5)
                if (hasFUpg(122)) scale = scale.sub(0.5)
                if (hasFUpg(134)) scale = scale.sub(0.5)
                return scale
            },
            base() { 
                let base = new Decimal(10)
                if (hasFUpg(72)) base = base.mul(2)
                if (hasFUpg(75)) base = base.mul(5)
                if (hasFUpg(93)) base = base.mul(5)
                if (hasFUpg(122)) base = base.mul(getFUpgEff(122))
                if (hasChallenge("f",61)) base = base.mul(challengeEffect("f",61))
                base = base.mul(tmp.e.deff)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 32)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
                let req = Decimal.add(6,tmp.f.buyables[32].total).min(8)
                let dim = "Unlock a new Dimension, and multiply fatality dimensions by "
                if (tmp.f.buyables[32].total.gte(2)) dim = "Multiply fatality dimensions by "
                return dim + format(this.base()) +".\n\
                Requires: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" Fatality Dimension " + formatWhole(req) + "\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(tmp.f.buyables[32].total)
            },
            unlocked() { return hasMilestone("f", 10) }, 
            canAfford() {
                let req = getBuyableAmount("f", 22)
                if (this.total().gte(2)) req = getBuyableAmount("f", 24)
                else if (this.total().gte(1)) req = getBuyableAmount("f", 23)
                return req.gte(tmp[this.layer].buyables[this.id].cost) && !inChallenge("f",22)},
            buy() { //x=(cost-10)/s+2
                let d6 = getBuyableAmount("f", 24)
                let max = d6.sub(10).div(this.scale()).add(3)
                if (max.gte(1e18)) max = max.div(1e18).pow(0.5).mul(1e18)
                let diff = max.floor().sub(this.total()).max(1)
                if (this.total().lt(2)) diff = new Decimal(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",14)) {
                    player.f.p = new Decimal(0)
                    player.f.points = new Decimal(0)
                    player.f.sac = new Decimal(0)
                    player.f.d1 = new Decimal(0)
                    player.f.d2 = new Decimal(0)
                    player.f.d3 = new Decimal(0)
                    player.f.d4 = new Decimal(0)
                    player.f.d5 = new Decimal(0)
                    player.f.d6 = new Decimal(0)
                    player.f.d7 = new Decimal(0)
                    player.f.d8 = new Decimal(0)
                    player.f.mult = new Decimal(0)
                    player.f.buyables[11] = new Decimal(0)
                    player.f.buyables[12] = new Decimal(0)
                    player.f.buyables[13] = new Decimal(0)
                    player.f.buyables[14] = new Decimal(0)
                    player.f.buyables[21] = new Decimal(0)
                    player.f.buyables[22] = new Decimal(0)
                    player.f.buyables[23] = new Decimal(0)
                    player.f.buyables[24] = new Decimal(0)
                    player.f.buyables[31] = new Decimal(0)
                    }
                    if (hasMilestone("f",11)) player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                    else player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { //x=(cost-10)/s+2
                let d6 = getBuyableAmount("f", 24)
                let max = d6.sub(10).div(this.scale()).add(3)
                if (max.gte(1e18)) max = max.div(1e18).pow(0.5).mul(1e18)
                let diff = max.floor().min(b).sub(this.total()).max(1)
                if (this.total().lt(2)) diff = new Decimal(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",14)) {
                        player.f.p = new Decimal(0)
                        player.f.points = new Decimal(0)
                        player.f.sac = new Decimal(0)
                        player.f.d1 = new Decimal(0)
                        player.f.d2 = new Decimal(0)
                        player.f.d3 = new Decimal(0)
                        player.f.d4 = new Decimal(0)
                        player.f.d5 = new Decimal(0)
                        player.f.d6 = new Decimal(0)
                        player.f.d7 = new Decimal(0)
                        player.f.d8 = new Decimal(0)
                        player.f.mult = new Decimal(0)
                        player.f.buyables[11] = new Decimal(0)
                        player.f.buyables[12] = new Decimal(0)
                        player.f.buyables[13] = new Decimal(0)
                        player.f.buyables[14] = new Decimal(0)
                        player.f.buyables[21] = new Decimal(0)
                        player.f.buyables[22] = new Decimal(0)
                        player.f.buyables[23] = new Decimal(0)
                        player.f.buyables[24] = new Decimal(0)
                        player.f.buyables[31] = new Decimal(0)
                        }
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        33: {
			title() {
                let dim = "Fatality Multiplier Boost"
                if (this.total().gte(this.distantStart())) dim = "Distant Fatality Multiplier Boost"
                if (this.total().gte(this.sStart())) dim = "Social Distant Multiplier Boost"
                return dim
            },
			cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = new Decimal(45)
                let x = player.f.buyables[33]
                let distant = this.distantStart()
                let ss = this.sStart()
                if (x.gte(ss)) x = Decimal.pow(this.sScale(),x.sub(ss)).mul(ss) 
                if (inChallenge("f",22)) cost = cost = new Decimal(100)
                cost = cost.add(x.mul(this.scale()))
                if (x.gte(distant)) cost = cost.add(x.sub(distant).pow(2).add(x).sub(distant).div(this.distantScale()))
                return cost.floor()
            },
            scale() {
                let scale = new Decimal(7)
                if (inChallenge("f",22)) scale = new Decimal(11)
                if (hasFUpg(111)) scale = scale.sub(1)
                if (hasFUpg(115)) scale = scale.sub(1)
                return scale
            },
            distantStart() {
                let distant = new Decimal(100)
                if (hasFUpg(133)) distant = distant.add(20)
                if (hasFUpg(145)) distant = distant.add(getFUpgEff(145))
                return distant.min(this.sStart())
            },
            distantScale() {
                let distant = new Decimal(10)
                if (hasFUpg(185)) distant = distant.mul(tmp.f.upgrades[185].effect2)
                return distant
            },
            sStart() {
                let scale = new Decimal(10000)
                if (hasUpgrade("e",35)) scale = scale.add(upgradeEffect("e",35))
                return scale
            },
            sScale() {
                let scale = new Decimal(1.001)
                if (hasUpgrade("e",54)) scale = scale.root(upgradeEffect("e",54))
                if (hasUpgrade("e",55)) scale = scale.root(upgradeEffect("e",55))
                return scale
            },
            base() { 
                let base = new Decimal(1.032)
                if (hasFUpg(75)) base = base.pow(1.125)
                if (hasFUpg(112)) base = base.pow(1.3)
                if (hasFUpg(105)) base = base.pow(getFUpgEff(105))
                if (hasFUpg(172)) base = base.pow(getFUpgEff(172))
                if (hasFUpg(121)) base = base.pow(1.35)
                if (hasFUpg(132)) base = base.pow(tmp.f.upgrades[132].effect2)
                if (hasChallenge("f",51)) base = base.pow(1.2)
                if (inChallenge("f",22)) base = base.pow(1.5)
                if (inChallenge("f",32)) base = new Decimal(1)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 33)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total().add(player.f.cboosts.mul(5))
                let base = this.base()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Dimensions") return 
                let dim = "Reset Dimension Boosts, and multiply Fatality Dimension Multiplier base by "
                let req = "8"
                if (inChallenge("f",22)) req = "6"
                return dim + format(this.base()) +".\n\
                Requires: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" Fatality Dimension " +req+"\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f", 11) }, 
            canAfford() {
                let req = getBuyableAmount("f", 24)
                if (inChallenge("f",22)) req = getBuyableAmount("f", 22)
                return req.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { //cost = 45+sx+((x-y)^2+x-y)/10         cost-45 = sx+((x-y)^2+x-y)/10
                let d8 = getBuyableAmount("f", 24)
                let sub = new Decimal(45)
                let d = this.distantStart()
                let b = this.distantScale()
                let s = this.scale()
                let ss = this.sStart()
                if (inChallenge("f",22)) {
                    d8 = getBuyableAmount("f", 22)
                    sub = new Decimal(100)
                } 
                let max = d8.sub(sub).div(this.scale()).add(1).max(1).floor()
                if (max.gte(d)) max = b.pow(2).mul(s.pow(2)).add(d8.mul(2).sub(s.mul(2).mul(d)).add(s).sub(90).mul(b.mul(2))).add(1).max(1).pow(0.5).sub(b.mul(s)).add(d.mul(2)).sub(1).div(2).add(1).max(1).floor()
                if (max.gte(ss)) max = max.div(ss).log(this.sScale()).add(ss.add(1).max(1)).floor()
                let diff = max.sub(this.total()).max(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",15)) {
                    player.f.p = new Decimal(0)
                    player.f.points = new Decimal(0)
                    player.f.sac = new Decimal(0)
                    player.f.d1 = new Decimal(0)
                    player.f.d2 = new Decimal(0)
                    player.f.d3 = new Decimal(0)
                    player.f.d4 = new Decimal(0)
                    player.f.d5 = new Decimal(0)
                    player.f.d6 = new Decimal(0)
                    player.f.d7 = new Decimal(0)
                    player.f.d8 = new Decimal(0)
                    player.f.mult = new Decimal(0)
                    player.f.buyables[11] = new Decimal(0)
                    player.f.buyables[12] = new Decimal(0)
                    player.f.buyables[13] = new Decimal(0)
                    player.f.buyables[14] = new Decimal(0)
                    player.f.buyables[21] = new Decimal(0)
                    player.f.buyables[22] = new Decimal(0)
                    player.f.buyables[23] = new Decimal(0)
                    player.f.buyables[24] = new Decimal(0)
                    player.f.buyables[31] = new Decimal(0)
                    if (!hasMilestone("f",13)) player.f.buyables[32] = (hasFUpg(84) && !inChallenge("f", 22)) ? new Decimal(2) : new Decimal(0)
                    }
                    if (hasMilestone("f",12)) player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                    else player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(m) { //(cost-45)/s = x
                let d8 = getBuyableAmount("f", 24)
                let sub = new Decimal(45)
                let d = this.distantStart()
                let b = this.distantScale()
                let s = this.scale()
                let ss = this.sStart()
                if (inChallenge("f",22)) {
                    d8 = getBuyableAmount("f", 22)
                    sub = new Decimal(100)
                }
                let max = d8.sub(sub).div(this.scale()).add(1).max(1).floor()
                if (max.gte(d)) max = b.pow(2).mul(s.pow(2)).add(d8.mul(2).sub(s.mul(2).mul(d)).add(s).sub(90).mul(b.mul(2))).add(1).max(1).pow(0.5).sub(b.mul(s)).add(d.mul(2)).sub(1).div(2).add(1).max(1).floor()
                if (max.gte(ss)) max = max.div(ss).log(this.sScale()).add(ss.add(1).max(1)).floor()
                max = max.min(m)
                let diff = max.sub(this.total()).max(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",15)) {
                        player.f.p = new Decimal(0)
                        player.f.points = new Decimal(0)
                        player.f.sac = new Decimal(0)
                        player.f.d1 = new Decimal(0)
                        player.f.d2 = new Decimal(0)
                        player.f.d3 = new Decimal(0)
                        player.f.d4 = new Decimal(0)
                        player.f.d5 = new Decimal(0)
                        player.f.d6 = new Decimal(0)
                        player.f.d7 = new Decimal(0)
                        player.f.d8 = new Decimal(0)
                        player.f.mult = new Decimal(0)
                        player.f.buyables[11] = new Decimal(0)
                        player.f.buyables[12] = new Decimal(0)
                        player.f.buyables[13] = new Decimal(0)
                        player.f.buyables[14] = new Decimal(0)
                        player.f.buyables[21] = new Decimal(0)
                        player.f.buyables[22] = new Decimal(0)
                        player.f.buyables[23] = new Decimal(0)
                        player.f.buyables[24] = new Decimal(0)
                        player.f.buyables[31] = new Decimal(0)
                        if (!hasMilestone("f",13)) player.f.buyables[32] = (hasFUpg(84) && !inChallenge("f", 22)) ? new Decimal(2) : new Decimal(0)
                        }
                    if (hasMilestone("f",12)) player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        34: {
			title() {
                let dis = ""
                let x=tmp[this.layer].buyables[this.id].total
                if (x.gte(1e35)) dis += "Distant "
                return dis + "Casualty Multiplier"
            },
            cost(x=tmp[this.layer].buyables[this.id].total) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(1e35)) x = x.div(1e35).pow(3).mul(1e35)
                let cost = Decimal.pow(10, x).mul(5)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(2)
                if (hasFUpg(135)) base = base.add(0.1)
                if (hasFUpg(151)) base = base.add(getFUpgEff(151))
                if (hasFUpg(173)) base = base.add(getFUpgEff(173))
                return base
            },
            total() {
                let total = getBuyableAmount("f", 34)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Multiplier") return 
                return "Multiply Casualty gain by " + format(this.base()) + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f", 8) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",18)) player.f.casualty = player.f.casualty.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(5).log10()
                if (max.gte(1e35)) max = max.div(1e35).pow(1/3).mul(1e35)
                let diff = max.ceil().sub(this.total())
                cost = Decimal.sub(1,Decimal.pow(10,diff)).div(-9).mul(cost)
                if (this.canAfford()) {
                    if (!hasMilestone("f",18)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[34].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        41: {
			title() {
                let dim = "Fatality Dimension 1 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d1auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 41)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(1.25).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 1."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 11) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[41].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        42: {
			title() {
                let dim = "Fatality Dimension 2 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d2auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 42)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(1.5).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 2."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 11) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[42].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        43: {
			title() {
                let dim = "Fatality Dimension 3 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d3auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 43)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(1.75).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 3."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 11) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[43].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        44: {
			title() {
                let dim = "Fatality Dimension 4 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d4auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 44)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(2).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 4."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 12) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[44].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        51: {
			title() {
                let dim = "Fatality Dimension 5 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d5auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 51)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(2.25).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 5."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 12) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[51].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        52: {
			title() {
                let dim = "Fatality Dimension 6 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d6auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 52)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(2.5).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 6."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 12) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[52].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        53: {
			title() {
                let dim = "Fatality Dimension 7 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d7auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 53)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(2.75).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 7."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 21) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[53].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        54: {
			title() {
                let dim = "Fatality Dimension 8 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d8auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 54)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(3).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension 8."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 21) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[54].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        61: {
			title() {
                let dim = "Fatality Dimension Multiplier Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.multauto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 61)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(1.5).min(10);
            },
            bulk() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].bulkbase
                let eff = Decimal.pow(base, x)
                if (hasUpgrade("e",21)) eff = eff.mul(1e6)
                if (hasUpgrade("e",143)) eff = Decimal.tetrate(10,1.79e308)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension Multiplier."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 21) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[61].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        62: {
			title() {
                let dim = "Fatality Dimension Boost Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(3.5,x)
                return cost.floor()
            },
            on() {
                return player.f.boostauto
            },
            speedbase() { 
                let base = new Decimal(1.8)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 62)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(15).min(10);
            },
            bulk() { 
                return Decimal.tetrate(10, 1.79e308);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Dimension Boost."
                if (this.speed().gte(10)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.speed().lt(10)},
            unlocked() { return hasChallenge("f", 22) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[62].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        63: {
			title() {
                let dim = "Fatality Multiplier Boost Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(3.5,x)
                return cost.floor()
            },
            on() {
                return player.f.multbauto
            },
            speedbase() { 
                let base = new Decimal(1.7)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 63)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(60).min(10);
            },
            bulk() { 
                return Decimal.tetrate(10, 1.79e308);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Autobuys Fatality Multiplier Boost."
                if (this.speed().gte(10)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.speed().lt(10)},
            unlocked() { return hasChallenge("f", 22) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[63].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        64: {
			title() {
                let dim = "Automatic Sacrifice"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(3.5,x)
                return cost.floor()
            },
            on() {
                return player.f.sacauto
            },
            speedbase() { 
                let base = new Decimal(1.7)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 64)
                return total
            },
			speed() { 
                let x = tmp.f.buyables[this.id].total
                let base = tmp.f.buyables[this.id].speedbase
                return Decimal.pow(base, x).div(10).min(10);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Autobuyers") return 
                let dim = "Automatically Sacrifice at 100x."
                if (this.speed().gte(10)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.speed().lt(10)},
            unlocked() { return hasMilestone("f", 13) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[64].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        71: {
			title: "Casualty Dimension 1",
			cost(x=player.f.cd[0]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x).mul(1e14)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(15)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 71)
                return total
            },
            bought() {
                let bought = player.f.cd[0]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces casualty power.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 16) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[0] = player.f.cd[0].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e14).log10().div(5).ceil()
                let diff = max.sub(player.f.cd[0]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e5,max)).div(-99999).mul(1e14)
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[0] = player.f.cd[0].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[71].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        72: {
			title: "Casualty Dimension 2",
			cost(x=player.f.cd[1]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e9, x).mul(1e16)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(10)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 72)
                return total
            },
            bought() {
                let bought = player.f.cd[1]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 1.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 16) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[1] = player.f.cd[1].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e16).log10().div(9).ceil()
                let diff = max.sub(player.f.cd[1]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e9,max)).div(-999999999).mul(1e16)
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[1] = player.f.cd[1].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[72].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        73: {
			title: "Casualty Dimension 3",
			cost(x=player.f.cd[2]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e13, x).mul(1e29)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(4)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 73)
                return total
            },
            bought() {
                let bought = player.f.cd[2]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 2.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e120000") || getBuyableAmount("f", 74).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[2] = player.f.cd[2].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e29).log10().div(13).ceil()
                let diff = max.sub(player.f.cd[2]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e13,max)).div(-1e13).mul(1e29)
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[2] = player.f.cd[2].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[73].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        74: {
			title: "Casualty Dimension 4",
			cost(x=player.f.cd[3]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e17, x).mul(1e50)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(2)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 74)
                return total
            },
            bought() {
                let bought = player.f.cd[3]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 3.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e300000") || getBuyableAmount("f", 74).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[3] = player.f.cd[3].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e50).log10().div(17).ceil()
                let diff = max.sub(player.f.cd[3]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e17,max)).div(-1e17).mul(1e50)
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[3] = player.f.cd[3].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[74].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        81: {
			title: "Casualty Dimension 5",
			cost(x=player.f.cd[4]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e20, x).mul("1e460")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 81)
                return total
            },
            bought() {
                let bought = player.f.cd[4]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 4.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e1600000") || getBuyableAmount("f", 81).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[4] = player.f.cd[4].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e460").log10().div(20).ceil()
                let diff = max.sub(player.f.cd[4]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e20,max)).div(-1e20).mul("1e460")
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[4] = player.f.cd[4].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[81].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        82: {
			title: "Casualty Dimension 6",
			cost(x=player.f.cd[5]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e25, x).mul("1e575")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 82)
                return total
            },
            bought() {
                let bought = player.f.cd[5]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 5.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e2000000") || getBuyableAmount("f", 82).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[5] = player.f.cd[5].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e575").log10().div(25).ceil()
                let diff = max.sub(player.f.cd[5]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e25,max)).div(-1e25).mul("1e575")
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[5] = player.f.cd[5].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[82].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        83: {
			title: "Casualty Dimension 7",
			cost(x=player.f.cd[6]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e30, x).mul("1e790")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 83)
                return total
            },
            bought() {
                let bought = player.f.cd[6]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 6.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e2830000") || getBuyableAmount("f", 83).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[6] = player.f.cd[6].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e790").log10().div(30).ceil()
                let diff = max.sub(player.f.cd[6]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e30,max)).div(-1e30).mul("1e790")
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[6] = player.f.cd[6].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[83].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        84: {
			title: "Casualty Dimension 8",
			cost(x=player.f.cd[7]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e40, x).mul("1e1905")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 84)
                return total
            },
            bought() {
                let bought = player.f.cd[7]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].bought
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casualty Dimensions") return 
                return "Produces Casualty Dimension 7.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e6750000") || getBuyableAmount("f", 84).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[7] = player.f.cd[7].add(1).max(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e1905").log10().div(40).ceil()
                let diff = max.sub(player.f.cd[7]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e40,max)).div(-1e40).mul("1e1905")
                if (this.canAfford()) {
                    if (!hasMilestone("f",19)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[7] = player.f.cd[7].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[84].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        91: {
			title: "Casual Replicate Multiplier",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e25, x).mul("1e470")
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 91)
                return total
            },
			base() { // Effects of owning x of the items, x is a decimal
                let x = this.total().div(20).add(1).max(1)
                return x;
            },
            effect() {
                let eff = this.base()
                if (hasFUpg(183)) eff = eff.pow(getFUpgEff(183))
                return eff
            },
            max() {
                let max = new Decimal(100)
                if (hasFUpg(183)) max = Decimal.tetrate(10,1.79e308)
                return max
            },
            display() { // Everything else displayed in the buyable button after the title
                let dis = "Increase the replicate multiplier."
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casuals") return 
                if (this.total().gte(this.max())) dis += " (MAXED)"
                return dis + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f",17) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(this.max())},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasFUpg(183)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("e470").log10().div(25).ceil()
                let diff = max.sub(this.total())
                cost = Decimal.sub(1,Decimal.pow(1e25,diff)).div(-1e25).mul(cost)
                if (this.canAfford()) {
                    if (!hasFUpg(183)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[91].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        92: {
			title: "Casual Replicate Interval",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e15, x).mul("1e475")
                if (x.gte(44)) cost = Decimal.pow(1e15,Decimal.pow(1.1,x.sub(44))).mul("e1120")
                return cost.floor()
            },
            max() {
                let max = new Decimal(0.02)
                if (hasFUpg(133)) max = max.div(20)
                if (hasFUpg(182)) max = Decimal.tetrate(10,1.79e308).pow(-1)
                return max
            },
            total() {
                let total = getBuyableAmount("f", 92)
                return total
            },
            effect() {
                let x = this.total()
                let eff = Decimal.pow(0.9,x)
                if (hasFUpg(131)) eff = eff.div(getFUpgEff(131))
                if (hasFUpg(132)) eff = eff.div(getFUpgEff(132))
                return eff.max(this.max())
            },
			interval() { // Effects of owning x of the items, x is a decimal
                let eff = this.effect()
                return eff.mul(this.scale());
            },
            scale() {
                let scale = new Decimal(1)
                let base = new Decimal(1.2)
                if (hasFUpg(184)) base = getFUpgEff(184)
                if (player.f.casuals.gte(Decimal.pow(10,tmp.f.int).mul(1.8))) scale = scale.mul(Decimal.pow(base,player.f.casuals.log10().sub(tmp.f.int).div(tmp.f.int))).mul(10)
                return scale
            },
            display() { // Everything else displayed in the buyable button after the title
                let dis = "Reduce the replicate interval."
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casuals") return 
                if (this.effect().lte(this.max())) dis += " (MAXED)"
                return dis + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTimeLong(tmp[this.layer].buyables[this.id].interval)+"\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f",17) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.effect().gt(this.max()) },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() { 
                let cost = this.cost() // log1.1(log10(cost/e1120)/15)+44 =
                let f = player.f.casualty
                let max = f.div("e470").log10().div(15).ceil().min(44)
                if (max.gte(44)) max = f.div("e1120").log10().div(15).log(1.1).add(45).floor()
                let diff = max.sub(this.total())
                cost = Decimal.sub(1,Decimal.pow(1e15,diff)).div(-1e15).mul(cost)
                if (this.canAfford()) {
                    if (!hasFUpg(182)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[92].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        93: {
			title() {
                let x=player[this.layer].buyables[this.id]
                let dis = ""
                if (x.gte(600)) dis = "Distant "
                if (x.gte(100000)) dis = "Social Distant "
                dis += "Casual Replicated Boosts"
                return dis
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e25, x).mul(Decimal.pow(1e5,(x.pow(2).add(x).div(2)))).mul("1e750")
                let s = x.sub(100)
                if (x.gte(1e5)) x = Decimal.pow(1.0001,x.sub(1e5)).mul(1e5)
                if (x.gte(100)) cost = Decimal.pow("e775", s).mul(Decimal.pow(1e55,(s.pow(2).add(s).div(2)))).mul("e28500")
                if (x.gte(600)) cost = Decimal.pow("e775",x.sub(600).pow(3)).mul("e7304750")
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 93)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let eff = x
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let dis = "Increase the max Replicated Boosts."
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casuals") return 
                return dis + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Max: " + formatWhole(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f",17) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() { 
                let f = player.f.casualty
                let max = f.log10().mul(8).sub(5395).mul(5).pow(0.5).sub(55).div(10).floor().add(1).max(1).min(100)
                if (max.gte(100)) max = f.log10().mul(440).sub(9963975).pow(0.5).sub(1605).div(110).floor().add(101).min(600)
                if (max.gte(600)) max = Decimal.log10(f.div("e7304750")).div(775).pow(Decimal.pow(3,-1)).floor().add(601)
                if (max.gte(1e5)) max = max.div(1e5).log(1.0001).add(100001).floor()
                let diff = max.sub(player.f.buyables[93])
                if (this.canAfford()) {
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[93].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        101: {
			title: "Virus Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x.pow(1.2)).mul(1e45)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(10)
                if (hasFUpg(177)) base = base.add(getFUpgEff(177))
                if (hasFUpg(186)) base = base.add(getFUpgEff(186))
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("f", 101).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casual Virus") return 
                return "Multiply Casual Virus gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casual viruses\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("f",101)) + extra
            },
            unlocked() { return hasMilestone("f", 21) }, 
            canAfford() {
                    return player.f.virus.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",0)) player.f.virus = player.f.virus.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let c = player.f.virus
                let target = Decimal.log10(c.div(1e45)).pow(Decimal.pow(1.2,-1))
                target = target.ceil()
                let cost = Decimal.pow(10, target.sub(1).pow(1.2)).mul(1e45)
                let diff = target.sub(player.f.buyables[101])
                if (this.canAfford()) {
                    if (!hasMilestone("e",0)) player.f.virus = player.f.virus.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.f.buyables[101] = player.f.buyables[101].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[101].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        102: {
			title: "Virus Exponent",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(30, x.pow(1.3)).mul(1e55)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(0.15)
                if (hasFUpg(187)) base = base.add(getFUpgEff(187))
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("f", 102).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.mul(base, x)
                let exp = new Decimal(0.2)
                if (hasUpgrade("e",76)) exp = exp.add(0.35)
                if (eff.gte(250)) eff = eff.div(250).pow(exp).mul(250)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casual Virus") return 
                let dis =  format(tmp[this.layer].buyables[this.id].effect)
                if (this.effect().gte(250)) dis += " (softcapped)"
                return "Increase Casual Virus gain exponent by "+format(this.base()) + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casual viruses\n\
                Effect: +" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("f",102)) + extra
            },
            unlocked() { return hasFUpg(173) }, 
            canAfford() {
                    return player.f.virus.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",0)) player.f.virus = player.f.virus.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let c = player.f.virus
                let target = Decimal.log10(c.div(1e55)).div(Decimal.log10(30)).pow(Decimal.pow(1.3,-1))
                target = target.ceil()
                let cost = Decimal.pow(30, target.sub(1).pow(1.3)).mul(1e55)
                let diff = target.sub(player.f.buyables[102])
                if (this.canAfford()) {
                    if (!hasMilestone("e",0)) player.f.virus = player.f.virus.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.f.buyables[102] = player.f.buyables[102].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[102].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        103: {
			title: "Self Booster",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(4e72)
                return cost.floor()
            },
            scalebase() {
                let base = new Decimal(1e6)
                if (hasUpgrade("e",34)) base = base.div(upgradeEffect("e",34))
                return base
            },
            base() { 
                let base = player.f.virus.add(10).max(10)
                base = base.log10().add(10).max(10)
                base = base.log10().div(10)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("f", 103).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let s = new Decimal(100)
                if (hasUpgrade("e",34)) s = s.add(400)
                if (hasUpgrade("e",56)) s = s.add(1000)
                if (x.gte(s) && !hasUpgrade("e",154)) x = x.div(s).pow(0.3).mul(s)
                return Decimal.mul(base, x).add(1).max(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != "f" || player.subtabs.f.mainTabs != "Casual Virus") return 
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                let s = new Decimal(100)
                if (hasUpgrade("e",34)) s = s.add(400)
                if (hasUpgrade("e",56)) s = s.add(1000)
                if (this.total().gte(s) && !hasUpgrade("e",154)) dis += " (softcapped)"
                return "Raise 'Self Casual Boost' to (1+"+format(this.base())+"x) (based on Casual Viruses).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casual viruses\n\
                Effect: ^" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("f",103)) + extra
            },
            unlocked() { return hasFUpg(176) }, 
            canAfford() {
                    return player.f.virus.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",0)) player.f.virus = player.f.virus.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax(max) {
                let c = player.f.virus
                let target = Decimal.log10(c.div(4e72)).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(4e72)
                let diff = target.sub(player.f.buyables[103])
                if (this.canAfford()) {
                    if (!hasMilestone("e",0)) player.f.virus = player.f.virus.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.f.buyables[103] = player.f.buyables[103].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[103].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
    },
    upgrades: {
        rows: 18,
        cols: 7,
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
                let eff = player.d.points.add(10).max(10)
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
                if (eff.gte("e5e12")) eff = Decimal.pow(10,eff.div("e5e12").log10().pow(0.9)).mul("e5e12")
                if (eff.gte("ee19")) eff = Decimal.pow(10,eff.div("ee19").log10().pow(0.9)).mul("ee19")
                if (eff.gte("ee24")) eff = Decimal.pow(10,eff.div("ee24").log10().pow(0.88)).mul("ee24")
                if (eff.gte("ee45")) eff = Decimal.pow(10,eff.div("ee45").log10().pow(0.85)).mul("ee45")
                if (eff.gte("ee200")) eff = Decimal.pow(10,eff.div("ee200").log10().pow(0.8)).mul("ee200")
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(13)) + "x"
                if (this.effect().gte("e5e12")) dis += " (softcapped)"
                return dis
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
                let eff = player.points.add(10).max(10)
                eff = eff.log10().pow(0.075)
                if (hasFUpg(143)) eff = eff.tetrate(getFUpgEff(143))
                if (eff.gte(Decimal.pow(10,1e8))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e8)).log10().pow(0.8)).mul(Decimal.pow(10,1e8))
                if (eff.gte("ee9")) eff = eff.log10().mul(10).pow(1e8)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(14)) + "x"
                if (this.effect().gte(Decimal.pow(10,1e8))) dis += " (softcapped)"
                return dis
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
                let eff = player.d.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
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
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
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
                let eff = player.s.severity.add(10).max(10)
                eff = eff.pow("3e-7")
                if (eff.gte(1e30)) eff = Decimal.pow(10,eff.div(1e30).log10().pow(0.4)).mul(1e30)
                if (eff.gte("e40000")) eff = Decimal.pow(10,eff.div("e40000").log10().pow(0.8)).mul("e40000")
                if (eff.gte("e100000")) eff = eff.log10().pow(2e4)
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
                let eff = player.f.points.add(1).max(1)
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
                let eff = player.i.points.add(1).max(1)
                eff = Decimal.pow(10,eff.log10().pow(0.2)).pow(0.005)
                if (eff.gte(Decimal.pow(10,1e3))) eff = Decimal.pow(10,eff.div(Decimal.pow(10,1e3)).log10().pow(0.7)).mul(Decimal.pow(10,1e3))
                if (eff.gte("e30000")) eff = Decimal.pow(10,eff.div("e30000").log10().pow(0.8)).mul("e30000")
                if (eff.gte("e100000")) eff = eff.log10().pow(2e4)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(24))+"x"
                if (getFUpgEff(24).gte(Decimal.pow(10,1e3))) dis += " (softcapped)"
                return dis
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
                let eff = player.i.points.add(10).max(10)
                eff = eff.log10().pow(0.13)
                if (eff.gte("ee20")) eff = eff.div("ee20").log10().pow(0.8).pow10().mul("ee20")
                if (eff.gte("ee24")) eff = eff.div("ee24").log10().pow(0.8).pow10().mul("ee24")
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
                let eff = player.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
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
                let eff = player.f.p.max(0).add(10).max(10)
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
                let eff = player.f.points.add(1).max(1)
                eff = eff.pow(0.07)
                if (eff.gte("e15000")) eff = eff.div("e15000").pow(0.2).mul("e15000")
                if (eff.gte("ee50")) eff = Decimal.pow(10,eff.div("ee50").log10().pow(0.88)).mul("ee50")
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(34))+"x"
                if (getFUpgEff(34).gte("e15000")) dis += " (softcapped)"
                return dis
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
                let eff = player.d.points.add(10).max(10)
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
                let eff = player.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
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
                let eff = player.f.p.add(10).max(10)
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
            title: "Powerful Cases",
            description: "Fatality power boosts cases gain.",
            cost: new Decimal(4e40),
            effect() {
                let eff = player.f.p.add(10).max(10)
                eff = eff.log10().pow(0.14)
                if (eff.gte(Decimal.pow(10,1e24))) eff = eff.log10().mul(10).pow(4e22)
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
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().pow(0.2)
                if (eff.gte(Decimal.pow(10,1e24))) eff = eff.log10().mul(10).pow(4e22)
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
                let eff = player.f.p.add(1).max(1)
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
                let eff = player.d.points.add(1).max(1)
                eff = eff.log10().pow(0.197)
                if (eff.gte(1e6)) eff = eff.log10().add(4).pow(6)
                if (eff.gte(1e10)) eff = eff.log10().pow(10)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(51))
            },
            unlocked() {
                return hasFUpg(45)
            }
        },
        52: {
            title: "Severity Dimension",
            description: "Severity boosts fatality dimensions.",
            cost: new Decimal(1.62e162),
            effect() {
                let eff = player.s.severity.add(10).max(10)
                eff = eff.log10().pow(0.6)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(52))+"x"
            },
            unlocked() {
                return hasFUpg(51)
            }
        },
        53: {
            title: "Infected Dimension",
            description: "Infectivity increases multiplier per dimension.",
            cost: new Decimal(2.06e206),
            effect() {
                let eff = player.i.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1).div(2)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(53))
            },
            unlocked() {
                return hasFUpg(52)
            }
        },
        54: {
            title: "Uncoated Fatalities",
            description: "Fatality boosts uncoaters 1st effect.",
            cost: new Decimal(2.626e262),
            effect() {
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().pow(2.35)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(54))
            },
            unlocked() {
                return hasFUpg(53)
            }
        },
        55: {
            title: "Uncoated Dimension",
            description: "Uncoaters boost fatality dimensions.",
            cost: new Decimal(2.75e275),
            effect() {
                let eff = player.u.points.add(1).max(1)
                eff = eff.pow(1.7)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(55))+"x"
            },
            unlocked() {
                return hasFUpg(54)
            }
        },
        61: {
            title: "Replicated Dimension",
            description: "Replicators boost fatality dimensions.",
            cost: Decimal.pow(10,353).mul(3.535),
            effect() {
                let eff = player.r.points.add(1).max(1).pow(0.75)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(61))+"x"
            },
            unlocked() {
                return hasFUpg(55)
            }
        },
        62: {
            title: "Replicated Power",
            description: "Replicators boost fatality power effect.",
            cost: Decimal.pow(10,505).mul(5.05),
            effect() {
                let eff = player.r.points.add(10).max(10).log10().div(7.45)
                if (eff.gte(1.2)) eff = eff.div(1.1).pow(0.5).mul(1.2)
                return eff.max(1)
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(62))
            },
            unlocked() {
                return hasFUpg(61)
            }
        },
        63: {
            title: "Multiplied Fatalities",
            description: "Fatality adds to the Dimension Multiplier base.",
            cost: Decimal.pow(10,911).mul(9.111),
            effect() {
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().pow(0.05).div(50)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(63))
            },
            unlocked() {
                return hasFUpg(62)
            }
        },
        64: {
            title: "Multiplied Cases",
            description: "Cases add to the Dimension Multiplier base.",
            cost: Decimal.pow(10,1158).mul(1.158),
            effect() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().pow(0.07).div(930)
                if (eff.gte(0.115)) eff = eff.div(0.115).pow(0.4).mul(0.115)
                if (eff.gte(0.3)) eff = eff.div(0.3).pow(0.1).mul(0.3)
                return eff.min(Decimal.pow(10,1e16))
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(64))
            },
            unlocked() {
                return hasFUpg(63)
            }
        },
        65: {
            title: "Scaling Reduction",
            description: "Reduce the Dimension and Dimension Boost cost scaling by 1.",
            cost: Decimal.pow(10,1515).mul(1.515),
            unlocked() {
                return hasFUpg(64)
            }
        },
        71: {
            title: "8 Dimension Cases",
            description: "Fatality Dimension 8 gives 2 free 'Cases Boost'.",
            cost: Decimal.pow(10,1731).mul(1.731),
            effect() {
                let eff = getBuyableAmount("f",24).mul(2)
                if (eff.gte(1e5)) eff = eff.div(1e5).pow(0.33).mul(1e5)
                if (eff.gte(Decimal.pow(10,2e5))) eff = eff.log10().div(2).pow(4e4)
                return eff.floor()
            },
            effectDisplay() {
                let dis = "+"+formatWhole(getFUpgEff(71))
                if (this.effect().gte(1e5)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(65)
            }
        },
        72: {
            title: "Boosted Boosts",
            description: "Multiply the Dimension Boost base by 2.",
            cost: Decimal.pow(10,2092).mul(2.092),
            unlocked() {
                return hasFUpg(71)
            }
        },
        73: {
            title: "BULK",
            description: "Reduce the Dimension cost scaling by 1 and autobuyers buy 1,000x more and 2x faster.",
            cost: Decimal.pow(10,2888).mul(2.888),
            unlocked() {
                return hasFUpg(72)
            }
        },
        74: {
            title: "Boost Scaling",
            description: "Reduce the Dimension Boost cost scaling by 0.5.",
            cost: Decimal.pow(10,3222).mul(3.222),
            unlocked() {
                return hasFUpg(73)
            }
        },
        75: {
            title: "Boost Boosters",
            description: "Multiply Dimension Boost base by 5 and Multiplier Boost is 1.125x stronger.",
            cost: Decimal.pow(10,4134).mul(4.134),
            unlocked() {
                return hasFUpg(74)
            }
        },
        81: {
            title: "Virus Dimension",
            description: "VP boosts fatality dimensions.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.v.points.add(10).max(10)
                eff = eff.log10().pow(0.5)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(81))+"x"
            },
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(81)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        82: {
            title: "Stronger Dimensions",
            description: "Increase the multiplier per Dimension by +0.3.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(82)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        91: {
            title: "Casualty 18",
            description: "Total casualty boosts Fatality Dimension 1 and 8.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1).max(1)
                eff = eff.pow(15)
                return eff.min("ee25")
            },
            effectDisplay() {
                return format(getFUpgEff(91))+"x"
            },
            unlocked() {
                return hasFUpg(81)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(91)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        92: {
            title: "Casualty 27",
            description: "Total casualty boosts Fatality Dimension 2 and 7.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1).max(1)
                eff = eff.pow(15)
                return eff.min("ee25")
            },
            effectDisplay() {
                return format(getFUpgEff(92))+"x"
            },
            unlocked() {
                return hasFUpg(82)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(92)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        101: {
            title: "Casualty 36",
            description: "Total casualty boosts Fatality Dimension 3 and 6.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1).max(1)
                eff = eff.pow(15)
                return eff.min("ee25")
            },
            effectDisplay() {
                return format(getFUpgEff(101))+"x"
            },
            unlocked() {
                return hasFUpg(91)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(101)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        102: {
            title: "Casualty 45",
            description: "Total casualty boosts Fatality Dimension 4 and 5.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1).max(1)
                eff = eff.pow(15)
                return eff.min("ee25")
            },
            effectDisplay() {
                return format(getFUpgEff(92))+"x"
            },
            unlocked() {
                return hasFUpg(92)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(102)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        111: {
            title: "Scaled Dimension",
            description: "Reduce the Dimension, and Multiplier Boost scaling by 1.",
            cost: new Decimal(3),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(101)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(111)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(3)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        112: {
            title: "Stronger Multipliers",
            description: "Multiplier Boosts are 1.3x stronger.",
            cost: new Decimal(3),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(102)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(112)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(3)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        83: {
            title: "Sacrificed Fatality",
            description: "Unlock Sacrifice.",
            cost: new Decimal(5),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(83)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(5)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        93: {
            title: "Dimension 55555",
            description: "Multiply Dimension Boost base by 5.",
            cost: new Decimal(7),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(83)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(93)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(7)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        103: {
            title: "Casualty Boost",
            description: "Casualty boosts Fatality Dimensions.",
            cost: new Decimal(10),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(1).max(1)
                eff = eff.pow(20)
                return eff.min("ee25")
            },
            effectDisplay() {
                return format(getFUpgEff(103))+"x"
            },
            unlocked() {
                return hasFUpg(93)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(103)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(10)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        113: {
            title: "Casualty Auto Gain",
            description: "Gain 50% of best casualty/min.",
            cost: new Decimal(15),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.cpm.mul(0.5)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(113))+"/s"
                if (getFUpgEff(113).lt(10)) dis = format(getFUpgEff(113).mul(60))+"/min"
                return dis
            },
            unlocked() {
                return hasFUpg(103)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(113)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(15)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        84: {
            title: "Scaled",
            description: "You start with 2 Dimension Shifts, Reduce Dimension scaling by 1, Dimension Boost scaling by 0.5.",
            cost: new Decimal(30),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(84)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(30)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        94: {
            title: "Powerful Casualties",
            description: "Fatality power boosts casualty gain.",
            cost: new Decimal(110),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.p.add(10).max(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(94))+"x"
            },
            unlocked() {
                return hasFUpg(84)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(94)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(110)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        104: {
            title: "Casual Cases",
            description: "Cases boost casualty gain.",
            cost: new Decimal(2000),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().pow(0.02)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(104))+"x"
            },
            unlocked() {
                return hasFUpg(94)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(104)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(2000)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        114: {
            title: "Severe Casualties",
            description: "Severity boosts casualty gain.",
            cost: new Decimal(15e3),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.s.severity.add(10).max(10)
                eff = eff.log10().pow(0.1)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(114))+"x"
            },
            unlocked() {
                return hasFUpg(104)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(114)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(15e3)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        85: {
            title: "Deadly Casualties",
            description: "Deaths boost casualty gain.",
            cost: new Decimal(5e6),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.d.points.add(10).max(10)
                eff = eff.log10().pow(0.15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(85))+"x"
            },
            unlocked() {
                return hasFUpg(114)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(85)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(5e6)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        95: {
            title: "Casual Casualties",
            description: "Casualty boosts cases gain.",
            cost: new Decimal(3e9),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(5)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(95))
            },
            unlocked() {
                return hasFUpg(85)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(95)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(3e9)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        105: {
            title: "Casual Multipliers",
            description: "Casualty boosts Multiplier Boosts.",
            cost: new Decimal(8e9),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(1.2)
                if (eff.gte(1.7)) eff = eff.div(1.7).pow(0.3).mul(1.7)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(105))+"x"
                if (getFUpgEff(105).gte(1.7)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(95)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(105)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(8e9)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        115: {
            title: "Casual Scaling",
            description: "Reduce the Dimension, and Multiplier Boost scaling by 1.",
            cost: new Decimal(1e11),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(105)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(115)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1e11)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        121: {
            title: "Stronger Casualties",
            description: "Multiplier Boosts are 1.35x stronger.",
            cost: new Decimal(2e19),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(115)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(121)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(2e19)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        122: {
            title: "Casual Boosts",
            description: "Casualty boosts Dimension Boost base, Reduce Dimension scaling by 1, Dimension Boost scaling by 0.5.",
            cost: new Decimal(2.828e28),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(122))+"x"
            },
            unlocked() {
                return hasFUpg(121)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(122)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(2.828e28)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        123: {
            title: "Case-ual Boosts",
            description: "Casualty gives free 'Cases Boost' and buyable autobuyers buy ^2 more.",
            cost: new Decimal(4.141e41),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().pow(0.3).mul(400)
                if (eff.gte(Decimal.pow(10,2e5))) eff = eff.log10().div(2).pow(4e4)
                return eff.floor()
            },
            effectDisplay() {
                return "+"+formatWhole(getFUpgEff(123))
            },
            unlocked() {
                return hasFUpg(122)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(123)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(4.141e41)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        124: {
            title: "Fatal Casualties",
            description: "Casualty boosts fatality effect.",
            cost: new Decimal(9.393e93),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().mul(50)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(124))
            },
            unlocked() {
                return hasFUpg(123)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(124)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(9.393e93)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        125: {
            title: "Case PoWeR",
            description: "Casualty power boosts cases gain.",
            cost: Decimal.pow(10,369).mul(3.69),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.cp.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(5)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(125))
            },
            unlocked() {
                return hasFUpg(124)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(125)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("3.69e369")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        131: {
            title: "Casual Replication",
            description: "Casualty reduces replicate interval.",
            cost: Decimal.pow(10,500).mul(5),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(131))+"x"
            },
            unlocked() {
                return hasMilestone("f",17)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(131)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("5e500")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        132: {
            title: "Replicated Replication",
            description: "Replicators reduce interval and boost Multiplier Boosts.",
            cost: Decimal.pow(10,606).mul(6.06),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.r.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(3)
                return eff
            },
            effect2() {
                let eff = player.r.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.5)
                return eff
            },
            effectDisplay() {
                return "Interval:" + format(this.effect())+"x, Boosts:" + format(this.effect2())+"x"
            },
            unlocked() {
                return hasFUpg(131)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(132)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("6.06e606")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        133: {
            title: "Distance",
            description: "Divide the max interval by 20 and Distant scaling starts 20 later.",
            cost: new Decimal("7.92e792"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(132)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(133)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("7.92e792")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        134: {
            title: "Replicated Scaling",
            description: "Reduce the Dimension and Dimension Boost scaling by 0.5.",
            cost: new Decimal("1.107e1107"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(133)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(134)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("1.107e1107")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        135: {
            title: "Casual Casual",
            description: "Increase the Casualty Multiplier base by +0.1.",
            cost: new Decimal("2.1e2100"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(134)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(135)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("2.1e2100")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        141: {
            title: "Cases MultiBoost",
            description: "Multiplier Boosts increase 'Cases Boost' base by +5e-7.",
            cost: new Decimal("2.395e2395"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = getBuyableAmount("f",33).div(2e6)
                if (eff.gte(0.003)) eff = eff.div(0.003).pow(0.25).mul(0.003)
                return eff
            },
            effectDisplay() {
                let dis = "+"+format(getFUpgEff(141))
                if (getFUpgEff(141).gte(0.003)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(135)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(141)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("2.395e2395")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        142: {
            title: "Case Scaling",
            description: "Casualty reduces 'Cases Boost' scaling.",
            cost: new Decimal("2.787e2787"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.03)
                return eff.min(1.006)
            },
            effectDisplay() {
                return format(getFUpgEff(142))+"x"
            },
            unlocked() {
                return hasFUpg(141)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(142)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("2.787e2787")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        143: {
            title: "Fatal Synergy",
            description: "Cases and 'Fatally' boost each other, buyable autobuyers buy ^10 more.",
            cost: new Decimal("3.958e3958"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(1).max(1).slog().pow(0.47)
                return eff.min(2)
            },
            effect2() {
                let eff = getFUpgEff(14).add(10).max(10)
                eff = eff.log10().pow(0.15)
                if (eff.gte(Decimal.pow(10,1e24))) eff = eff.log10().mul(10).pow(4e22)
                return eff
            },
            effectDisplay() {
                let dis = "Fatally: ^^"+format(tmp.f.upgrades[143].effect)
                if (tmp.f.upgrades[143].effect.gte(2)) dis += " (hardcapped)"
                return dis + ", Cases: ^" + format(this.effect2())
            },
            unlocked() {
                return hasFUpg(142)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(143)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("3.958e3958")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        144: {
            title: "Fatal Cases",
            description: "Fatality boosts cases exponent.",
            cost: new Decimal("5.75e5750"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.07)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(144))
            },
            unlocked() {
                return hasFUpg(143)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(144)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("5.75e5750")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        145: {
            title: "Distant Fatalities",
            description: "Fatality makes Distant scaling start later.",
            cost: new Decimal("7.272e7272"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().pow(0.2355)
                if (eff.gte(1000)) eff = eff.div(1e3).pow(0.3).mul(1e3)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(145))
            },
            unlocked() {
                return hasFUpg(144)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(145)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("7.272e7272")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        151: {
            title: "MultiVirus",
            description: "Casual viruses add to Casualty Multiplier base.",
            cost: new Decimal(1),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.2).div(15)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(151))
            },
            unlocked() {
                return hasMilestone("f",20)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(151)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        152: {
            title: "Boosted Virus",
            description: "Casual viruses add to 'Cases Boost' base.",
            cost: new Decimal(22650),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.5).div(7e3)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(152))
            },
            unlocked() {
                return hasFUpg(151)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(152)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(22650)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        153: {
            title: "Casual Vimension",
            description: "Casual viruses boost Casualty Dimensions.",
            cost: new Decimal(220300),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(1).max(1)
                eff = eff.pow(17)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(153))+"x"
            },
            unlocked() {
                return hasFUpg(152)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(153)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(220300)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        154: {
            title: "Scaled Virus",
            description: "Casual viruses reduce Dimension scaling.",
            cost: new Decimal(675200),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.08).div(13)
                return eff.min(0.3)
            },
            effectDisplay() {
                return "-"+format(getFUpgEff(154))
            },
            unlocked() {
                return hasFUpg(153)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(154)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(675200)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        155: {
            title: "Case-ual Virus",
            description: "Cases boost casual virus gain.",
            cost: new Decimal(1926500),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().pow(0.03)
                if (eff.gte("e3e9")) eff = Decimal.pow(10,eff.div("e3e9").log10().pow(0.85)).mul("e3e9")
                if (eff.gte("e1.5e15")) eff = Decimal.pow(10,eff.div("e1.5e15").log10().pow(0.82)).mul("e1.5e15")
                if (eff.gte("e1.8e18")) eff = Decimal.pow(10,eff.div("e1.8e18").log10().pow(0.78)).mul("e1.8e18")
                if (eff.gte("ee20")) eff = eff.log10().pow(5e18)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(155))+"x"
                if (getFUpgEff(155).gte("e3e9")) dis += " (softcapped)" 
                return dis
            },
            unlocked() {
                return hasFUpg(154)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(155)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1926500)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        156: {
            title: "Case-ual Upgrades",
            description: "Raise cases to ^1.2 per Casual Virus upgrade.",
            cost: new Decimal(2.599e9),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.upgrades.length-70
                eff = Decimal.pow(1.2,eff)
                return eff.max(1)
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(156))
            },
            unlocked() {
                return hasFUpg(155)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(156)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(2.599e9)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        157: {
            title: "Self Casual Boost",
            description: "Casual viruses boosts itself and cases gain.",
            cost: new Decimal(4.0874e9),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(4)
                eff = eff.pow(tmp.f.buyables[103].effect)
                return eff.max(1)
            },
            effect2() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(4)
                eff = eff.pow(tmp.f.buyables[103].effect)
                if (eff.gte(Decimal.pow(10,Decimal.pow(10,1e46)))) eff = eff.log10().log10().mul(1e4).pow(2e44).pow10()
                return eff.max(1)
            },
            effectDisplay() {
                return format(this.effect())+"x, ^"+format(this.effect2())
            },
            unlocked() {
                return hasFUpg(156)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(157)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(4.0874e9)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        161: {
            title: "Powerful Viruses",
            description: "Casual viruses boost fatality power effect.",
            cost: new Decimal(8.2995e14),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.6)
                return eff.max(1)
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(161))
            },
            unlocked() {
                return hasFUpg(157)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(161)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(8.2995e14)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        162: {
            title: "Fatal Virus",
            description: "Fatality boosts casual virus gain.",
            cost: new Decimal(1.4627e15),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().pow(0.6)
                return eff.max(1)
            },
            effectDisplay() {
                return format(getFUpgEff(162))+'x'
            },
            unlocked() {
                return hasFUpg(161)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(162)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1.4627e15)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        163: {
            title: "Virus Virus",
            description: "Add 1 to base casual virus gain exponent.",
            cost: new Decimal(6.2435e20),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(162)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(163)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(6.2435e20)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        164: {
            title: "Infected Casual",
            description: "Infectivity adds to casual virus exponent.",
            cost: new Decimal(1.0085e26),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.i.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.3).div(4)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(164))
            },
            unlocked() {
                return hasFUpg(163)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(164)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1.0085e26)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        165: {
            title: "Severe Casual",
            description: "Severity adds to casual virus exponent.",
            cost: new Decimal(3.0174e31),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.s.severity.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.4).div(4)
                if (eff.gte(1e20)) eff = eff.div(1e20).pow(0.2).mul(1e20)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(165))
            },
            unlocked() {
                return hasFUpg(164)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(165)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(3.0174e31)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        166: {
            title: "Replicated Casual",
            description: "Replicators add to casual virus exponent.",
            cost: new Decimal(2.7224e37),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.r.points.add(10).max(10)
                eff = eff.log10().pow(0.25).div(2)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(166))
            },
            unlocked() {
                return hasFUpg(165)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(166)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(2.7224e37)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        167: {
            title: "Powerful Casuals",
            description: "Casual virus boosts casualty power effect.",
            cost: new Decimal(2.1969e44),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.403425)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(167))
            },
            unlocked() {
                return hasFUpg(166)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(167)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(2.1969e44)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        171: {
            title: "Fatal Casual",
            description: "Casual viruses boost fatality gain.",
            cost: new Decimal(3.111e48),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.3)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(171))
            },
            unlocked() {
                return hasFUpg(167)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(171)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(3.111e48)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        172: {
            title: "Casual MultiVoost",
            description: "Casual viruses boost Multiplier Boosts.",
            cost: new Decimal(1.2197e53),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(2)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(172))+"x"
            },
            unlocked() {
                return hasFUpg(171)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(172)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1.2197e53)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        173: {
            title: "Case-ual Multipliers",
            description: "Cases add to Casualty Multiplier base and unlock a buyable.",
            cost: new Decimal(5.98e54),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1).div(10)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(173))
            },
            unlocked() {
                return hasFUpg(172)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(173)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(5.98e54)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        174: {
            title: "Infected Softcaps",
            description: "Cases make 'Cases Boost' softcap start later.",
            cost: new Decimal(6.196e60),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.3).mul(100)
                return eff.floor()
            },
            effectDisplay() {
                return "+"+formatWhole(getFUpgEff(174))
            },
            unlocked() {
                return hasFUpg(173)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(174)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(6.196e60)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        175: {
            title: "Casual Softcaps",
            description: "Casual viruses make 'Cases Boost' softcap start later.",
            cost: new Decimal(1.533e66),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(1.5).mul(200)
                return eff.floor()
            },
            effectDisplay() {
                return "+"+formatWhole(getFUpgEff(175))
            },
            unlocked() {
                return hasFUpg(174)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(175)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1.533e66)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        176: {
            title: "Exponent Exponent",
            description: "Casual viruses boost cases exponent and unlock a buyable.",
            cost: new Decimal(7.316e69),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.03)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(176))
            },
            unlocked() {
                return hasFUpg(175)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(176)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(7.316e69)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        177: {
            title: "Casualer Virus",
            description: "Casualty adds to 'Virus Gain' base.",
            cost: new Decimal(1.02e88),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().pow(0.1)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(177))
            },
            unlocked() {
                return hasFUpg(176)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(177)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1.02e88)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        181: {
            title: "Unlimited Casuals",
            description: "Remove cas. lim.,its form. is better,it boosts CV gain,RBs reset nothing.",
            cost: new Decimal(6.1248e150),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casuals.add(1).max(1)
                eff = Decimal.pow(10,eff.log10().pow(0.305))
                if (hasUpgrade("e",24)) eff = eff.pow(upgradeEffect("e",24))
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(181))+"x"
            },
            unlocked() {
                return hasFUpg(177)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(181)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(6.1248e150)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        182: {
            title: "Unlimited Interval",
            description: "Remove the interval limit, and unlock autobuy interval.",
            cost: new Decimal(2.15e215),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(181)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(182)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(2.15e215)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        183: {
            title: "Unlimited Multiplier",
            description: "Remove the rep mult limit,unlock auto mult, and it boosts itself.",
            cost: new Decimal(2.48e248),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = tmp.f.buyables[91].base
                eff = eff.log10().pow(4.5).add(1).max(1)
                if (hasUpgrade("e",24)) eff = eff.pow(upgradeEffect("e",24))
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(183))
            },
            unlocked() {
                return hasFUpg(182)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(183)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(2.48e248)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        184: {
            title: "Faster Replication",
            description: "Casual viruses slow interval scaling.",
            cost: new Decimal(2.56e256),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.f.virus.add(1).max(1)
                eff = eff.log10().pow(0.5).div(10).add(1).max(1)
                eff = Decimal.div(0.2,eff).add(1).max(1)
                return eff.max(1.001)
            },
            effectDisplay() {
                return "1.2x -> "+format(getFUpgEff(184)) +'x'
            },
            unlocked() {
                return hasFUpg(183)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(184)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(2.56e256)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        185: {
            title: "Slow Scaling",
            description: "Cases reduce Dimension scaling and Distant scaling.",
            cost: new Decimal(1e286),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1).div(7)
                return eff.min(0.4)
            },
            effect2() {
                let eff = player.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.15)
                return eff
            },
            effectDisplay() {
                return "-"+format(this.effect()) + ", "+format(this.effect2())+"x"
            },
            unlocked() {
                return hasFUpg(184)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(185)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1e286)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        186: {
            title: "Casualest Virus",
            description: "Each 'Virus Gain' adds 0.05 to its base.",
            cost: new Decimal(1.5e304),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = tmp.f.buyables[101].total.div(20)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(186))
            },
            unlocked() {
                return hasFUpg(185)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(186)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte(1.5e304)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        187: {
            title: "More Exponenter",
            description: "Each SB adds 0.0033 to VE base and autobuy buyables once per second.",
            cost: new Decimal("e367"),
            currencyDisplayName: "casual viruses",
            currencyInternalName: "virus",
            currencyLayer: "f",
            effect() {
                let eff = tmp.f.buyables[103].total.mul(0.0033)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(187))
            },
            unlocked() {
                return hasFUpg(186)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(187)) {
                    let color = "#bf8f8f"
                    if (player.f.virus.gte("e367")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
    },
    challenges: { 
        rows: 6,
        cols: 2,
        11: {
            name: "Fatality Challenge 1",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality power/1.8e308."
                if (inChallenge("f", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 11) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal(Decimal.pow(10,5095).mul(5))
            },
            rewardDescription: "Unlock Fatality Dimension 1,2,3 Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(11)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        12: {
            name: "Fatality Challenge 2",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Multiplier per Fatality Dimension is 1."
                if (inChallenge("f", 12)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 12) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal(Decimal.pow(10,5095).mul(5))
            },
            rewardDescription: "Unlock Fatality Dimension 4,5,6 Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(12)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        21: {
            name: "Fatality Challenge 3",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Dimension cost scaling is 100x."
                if (inChallenge("f", 21)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 21) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal(Decimal.pow(10,5095).mul(5))
            },
            rewardDescription: "Unlock Fatality Dimension 7,8, Multiplier Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(21)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        22: {
            name: "Fatality Challenge 4",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "You can't buy Dimension Boosts. Multiplier Boosts cost Fatality Dimension 6 and they are 1.5x stronger."
                if (inChallenge("f", 22)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 22) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal(Decimal.pow(10,5095).mul(5))
            },
            rewardDescription: "Unlock Dimension and Multiplier Boost Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(22)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        31: {
            name: "Casualty Challenge 1",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            countsAs: [11,12,21,22],
            challengeDescription: function() {
                let c11 = "All Fatality Challenges are applied at once. You can't gain deaths. Fatality gain is gain from 1.000e10,450 deaths"
                if (inChallenge("f", 31)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 31) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e26000")
            },
            rewardDescription() {
                let des =  "Casualty boosts Casualty Dimensions."
                return des
            },
            rewardEffect() {
                 let c12 = player.f.casualty.add(10).max(10)
                 c12 = c12.log10().pow(1.5)
                 return c12
            },
            rewardDisplay() {return format(this.rewardEffect()) + 'x'},
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(31)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e155000")
            }
        },
        32: {
            name: "Casualty Challenge 2",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Multiplier Boosts are useless."
                if (inChallenge("f", 32)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 32) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e61000")
            },
            rewardDescription() {
                let des =  "More powerful Sacrifice."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(32)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e177000")
            }
        },
        41: {
            name: "Casualty Challenge 3",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Dimension scaling is 1.8e308x"
                if (inChallenge("f", 41)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 41) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e175500")
            },
            rewardDescription() {
                let des =  "Reduce the Dimension scaling by 1."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(41)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e350000")
            }
        },
        42: {
            name: "Casualty Challenge 4",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality gain is ^0.1."
                if (inChallenge("f", 42)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 42) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e20000")
            },
            rewardDescription() {
                let des =  "Fatality gain is ^1.05 and casualty power effect is ^1.5."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(42)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e410000")
            }
        },
        51: {
            name: "Casualty Challenge 5",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality gain exp is ^0.75."
                if (inChallenge("f", 51)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 51) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e11850")
            },
            rewardDescription() {
                let des =  "Multiplier Boosts are 1.2x stronger."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(51)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e550000")
            }
        },
        52: {
            name: "Casualty Challenge 6",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality power is useless."
                if (inChallenge("f", 52)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 52) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e130000")
            },
            rewardDescription() {
                let des =  "Fatality Dimension Multiplier boosts Casualty Dimensions."
                return des
            },
            rewardEffect() {
                let c12 = tmp.f.buyables[31].effect
                c12 = c12.pow(2e-4)
                return c12
           },
           rewardDisplay() {return format(this.rewardEffect()) + 'x'},
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(52)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e720000")
            }
        },
        61: {
            name: "Casualty Challenge 7",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            countsAs: [12],
            challengeDescription: function() {
                let c11 = "Dimension Boosts are the only thing that boosts dimensions."
                if (inChallenge("f", 61)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 61) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e157630")
            },
            rewardDescription() {
                let des =  "Fatality boosts Dimension Boosts."
                return des
            },
            rewardEffect() {
                let c12 = player.f.points.add(10).max(10)
                c12 = c12.log10().pow(0.7)
                return c12
           },
           rewardDisplay() {return format(this.rewardEffect()) + 'x'},
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(61)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e800000")
            }
        },
        62: {
            name: "Casualty Challenge 8",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            countsAs: [12],
            challengeDescription: function() {
                let c11 = "Casualty power is the only thing that boosts dimensions."
                if (inChallenge("f", 62)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 62) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e360000")
            },
            rewardDescription() {
                let des =  "Fatality boosts casualty power effect."
                return des
            },
            rewardEffect() {
                let c12 = player.f.points.add(10).max(10)
                c12 = c12.log10().add(10).max(10)
                c12 = c12.log10().pow(0.1)
                return c12
           },
           rewardDisplay() {return "^"+format(this.rewardEffect())},
           onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(62)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e1137000")
            }
        },
    },
    bars: {
        NextCD: {
            direction: RIGHT,
            width: 700,
            height: 30,
            fillStyle: {'background-color' : "#3d2963"},
            req() {
                let req =tmp.f.buyables[84].unlocked ? new Decimal("10")
                :tmp.f.buyables[83].unlocked ? new Decimal("e6750000")
                :tmp.f.buyables[82].unlocked ? new Decimal("e2830000")
                :tmp.f.buyables[81].unlocked ? new Decimal("e2000000")  
                :tmp.f.buyables[74].unlocked ? new Decimal("e1600000") 
                :tmp.f.buyables[73].unlocked ? new Decimal("e300000")
                :new Decimal("e120000")
                return req
            },
            display() {
                let f = player.f.points.add(1).max(1)
                let r = "Get " + format(this.req()) + " fatality to unlock a new Dimension. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                if (tmp.f.buyables[84].unlocked ) r = "All Dimensions Unlocked"
                return r
            },
            progress() { 
                let f = player.f.points.add(1).max(1)
                let p = tmp.f.buyables[84].unlocked ? 1 :f.log10().div(this.req().log10())
                return p
            },
        },
        NextCC: {
            direction: RIGHT,
            width: 700,
            height: 30,
            fillStyle: {'background-color' : "#3d2963"},
            req() {
                let req = tmp.f.challenges[62].unlocked ? new Decimal("10")
                :tmp.f.challenges[61].unlocked ? new Decimal("e1137000") 
                :tmp.f.challenges[52].unlocked ? new Decimal("e800000") 
                :tmp.f.challenges[51].unlocked ? new Decimal("e720000")
                :tmp.f.challenges[42].unlocked ? new Decimal("e550000") 
                :tmp.f.challenges[41].unlocked ? new Decimal("e410000")
                :tmp.f.challenges[32].unlocked ? new Decimal("e350000") 
                :tmp.f.challenges[31].unlocked ? new Decimal("e177000") 
                :new Decimal("e155000")
                return req
            },
            display() {
                let f = player.f.points.add(1).max(1)
                let r = "Get " + format(this.req()) + " fatality to unlock a new Challenge. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                if (tmp.f.challenges[62].unlocked) r = "All Challenges Unlocked"
                return r
            },
            progress() { 
                let f = player.f.points.add(1).max(1)
                let p = tmp.f.challenges[62].unlocked ? 1 : f.log10().div(this.req().log10())
                return p
            },
        },
    }
})
addLayer("e", {
    name: "e",
    symbol: "IN",
    position: 1,
    startData() { 
        let l = [31,32]
                let b = {}
                for (j in l){
                        b[l[j]] = new Decimal(0)
                }
        return {
            clickableAmounts: b,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        p: new Decimal(0),
        i: new Decimal(1000),
        in: new Decimal(0),
        ins: new Decimal(0),
        infections: new Decimal(0),
        diseases: new Decimal(0),
        spent: new Decimal(0),
        qt: new Decimal(0),
        qc: new Decimal(0),
        h: new Decimal(0),
        c: new Decimal(0),
        n: new Decimal(0),
        o: new Decimal(0),
        ph: new Decimal(0),
        at: new Decimal(0),
        ad: new Decimal(0),
        ur: new Decimal(0),
        gu: new Decimal(0),
        cy: new Decimal(0),
        rp: new Decimal(0),
        mrna: new Decimal(0),
        crna: new Decimal(0),
        mm: new Decimal(0),
        mu: new Decimal(0),
        mu2: new Decimal(0),
        unlocked: false,
        autob: false,
        autoq: false,
        autoi: false,
        autoa: false,
        autod: false,
        autom: false,
        automm2: false,
        automax: false,
        path: 1,
        ct: 0,
        m: 0,
        Cr: new Decimal(0),
        c11: new Decimal(0),
        c12: new Decimal(0),
        rna: new Decimal(0),
        inC: false,
        upgg: [],
        virus: ["C","CO","COB","COV","COVA","COVE","COVO","COVI","COVIS","COVIR","COVIC","COVIP","COVIT","COVIM","COVID"],
    }},
    color: "#34c29a",
    nodeStyle() {return {
        "background-color": ((player.e.unlocked||canReset("e"))?"#34c29a":"#bf8f8f"),
    }},
    requires: new Decimal(1.7e32),
    resource: "infecters",
    baseResource: "uncoaters",
    baseAmount() { return player.u.points },
    type: "static",
    exponent: new Decimal(1.4),
    base: new Decimal(1e5),
    branches: ["u","s","d"],
    row: 3,
    position: 0,
    hotkeys: [
        {
            key:"n", description: "N:Reset for infecters", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    milestones: {
        0: {
            requirementDescription: "6 infecters",
            effectDescription: "Unlock Buyables and Casual Virus buyables cost nothing.",
            done() { return player.e.points.gte(6) }
        },
        1: {
            requirementDescription: "13 infecters",
            effectDescription: "Unlock Infected Infections.",
            done() { return player.e.points.gte(13) },
            unlocked() {return hasMilestone("e",0)}
        },
        2: {
            requirementDescription: "18 infecters",
            effectDescription: "Unlock Infectious Diseases and autobuy buyables.",
            toggles: [["e","autob"]],
            done() { return player.e.points.gte(18) },
            unlocked() {return hasMilestone("e",1)}
        },
        3: {
            requirementDescription: "46 infecters",
            effectDescription: "Unlock Infection Challenges, buy max infecters, and buyables cost nothing.",
            done() { return player.e.points.gte(46) },
            unlocked() {return hasMilestone("e",2)}
        },
        4: {
            requirementDescription: "95 infecters",
            effectDescription: "Autobuy Quarantine buyables.",
            toggles: [["e","autoq"]],
            done() { return player.e.points.gte(95) },
            unlocked() {return hasMilestone("e",3)}
        },
        5: {
            requirementDescription: "300 infecters",
            effectDescription: "Autobuy Infecters and they reset nothing.",
            toggles: [["e","autoi"]],
            done() { return player.e.points.gte(300) },
            unlocked() {return hasMilestone("e",4)}
        },
        6: {
            requirementDescription: "600 infecters",
            effectDescription: "Autobuy RNA buyables and Atom RNAs and they cost nothing.",
            toggles: [["e","autoa"]],
            done() { return player.e.points.gte(600) },
            unlocked() {return hasMilestone("e",5)}
        },
        7: {
            requirementDescription: "20,000 infecters",
            effectDescription: "Autobuy Disease buyables.",
            toggles: [["e","autod"]],
            done() { return player.e.points.gte(2e4) },
            unlocked() {return hasMilestone("e",6)}
        },
        8: {
            requirementDescription: "30,000 infecters",
            effectDescription: "Autobuy mRNA buyables and they cost nothing.",
            toggles: [["e","autom"]],
            done() { return player.e.points.gte(3e4) },
            unlocked() {return hasMilestone("e",7)}
        },
        9: {
            requirementDescription: "50,000 infecters",
            effectDescription: "Autobuy 'MMNA Virus', shift buys 10x more, and it costs nothing.",
            toggles: [["e","automm"]],
            done() { return player.e.points.gte(5e4) },
            unlocked() {return hasMilestone("e",8)}
        },
        10: {
            requirementDescription: "4,000,000 infecters",
            effectDescription: "Autobuy MMNA buyables.",
            toggles: [["e","automm2"]],
            done() { return player.e.points.gte(4e6) },
            unlocked() {return hasMilestone("e",9)}
        },
        11: {
            requirementDescription: "10,000,000 infecters",
            effectDescription: "Autobuy 'Max Buyable'.",
            toggles: [["e","automax"]],
            done() { return player.e.points.gte(1e7) },
            unlocked() {return hasMilestone("e",10)}
        },
    },
    layerShown() {
        let shown = hasFUpg(181)
        if (player.e.unlocked) shown = true
        return shown
    },
    cases() {
        if (player.cases) return player.points.pow10()
        return player.points
    },
    cases2() {
        if (player.cases) return player.points.pow10()
        return player.points
    },
    infectivit() {
        if (player.infectivity) return player.i.points.pow10()
        return player.i.points
    },
    infectivity() {
        if (tmp.e.infectivit.layer>player.i.points.layer) return tmp.e.infectivit.log10()
        return player.i.points
    },
    i() {
        let i = new Decimal(1000)
        if (hasUpgrade("e",13)) i = i.div(upgradeEffect("e",13))
        if (hasUpgrade("e",14)) i = i.div(tmp.e.upgrades[14].effect2)
        if (hasUpgrade("e",16)) i = i.div(tmp.e.upgrades[16].effect)
        if (hasUpgrade("e",25)) i = i.div(upgradeEffect("e",25))
        if (hasUpgrade("e",26)) i = i.div(tmp.e.upgrades[26].effect)
        if (hasUpgrade("e",33)) i = i.div(upgradeEffect("e",33))
        if (hasUpgrade("e",52)) i = i.div(upgradeEffect("e",52))
        if (hasUpgrade("e",56)) i = i.div(1.25)
        if (hasUpgrade("e",95)) i = i.div(upgradeEffect("e",95))
        if (hasUpgrade("e",152)) i = i.div(upgradeEffect("e",152))
        if (hasChallenge("e",12)) i = i.div(challengeEffect("e",12))
        i = i.div(tmp.e.buyables[13].effect)
        return i
    },
    iexp() {
        let exp = tmp.e.buyables[94].effect.mul(30)
        if (hasUpgrade("e",251)) exp = exp.mul(upgradeEffect("e",251))
        if (hasUpgrade("e",252)) exp = exp.mul(upgradeEffect("e",252))
        if (hasUpgrade("e",273)) exp = exp.mul(upgradeEffect("e",273))
        if (hasUpgrade("e",286)) exp = exp.mul(tmp.e.upgrades[286].effect2)
        if (hasUpgrade("e",313)) exp = exp.mul(upgradeEffect("e",313))
        if (hasUpgrade("e",363)) exp = exp.mul(upgradeEffect("e",363))
        if (hasUpgrade("e",366)) exp = exp.pow(upgradeEffect("e",366))
        if (hasUpgrade("e",371)) exp = exp.pow(upgradeEffect("e",371))
        if (hasUpgrade("e",406)) exp = exp.pow(1.2)
        if (hasUpgrade("e",392)) exp = exp.pow(1.15)
        if (hasUpgrade("e",382)) exp = exp.pow(1.1)
        if (hasUpgrade("e",391)) exp = exp.pow(1.1)
        if (hasUpgrade("e",394)) exp = exp.pow(1.1)
        if (hasUpgrade("e",383)) exp = exp.pow(1.05)
        if (hasUpgrade("e",385)) exp = exp.pow(1.05)
        if (hasUpgrade("e",386)) exp = exp.pow(upgradeEffect("e",386))
        if (hasUpgrade("e",402)) exp = exp.pow(upgradeEffect("e",386))
        if (hasUpgrade("e",395)) exp = powExp(exp,1.02)
        if (hasUpgrade("e",421)) exp = powExp(exp,1.02)
        if (hasUpgrade("e",404)) exp = powExp(exp,1.03)
        return exp
    },
    icap() {
        let i = player.e.i.pow(-1)
        if (i.gte(0.064)) i = i.div(0.064).pow(0.4).mul(0.064)
        i = Decimal.add(3.43,i).min(1.79769e308)
        if (i.gte(3.75)) i = i.div(3.75).pow(0.3).mul(3.75)
        if (i.gte(3.85)) i = i.div(3.85).pow(0.333).mul(3.85)
        if (i.gte(3.95)) i = i.div(3.95).pow(0.2).mul(3.95)
        if (i.gte(4)) i = i.add(6).log10().pow(1.3).add(3)
        if (i.gte(4.03)) i = i.div(4.03).pow(0.45).mul(4.03)
        if (i.gte(4.046)) i = i.div(4.046).pow(0.2).mul(4.046)
        if (i.gte(4.065)) i = i.div(4.065).pow(0.05).mul(4.065)
        if (hasUpgrade("e",95)) i = i.add(0.005)
        i = Decimal.tetrate(10,i)
        if (i.gte("eee16") && hasUpgrade("e",101)) i = player.e.i.pow(-1).mul(1e3).log10().pow(tmp.e.iexp).div(1e60).pow10().pow10()
        return i
    },
    effbase() {
        let eff = new Decimal(8)
        if (hasUpgrade("e",22)) eff = eff.add(upgradeEffect("e",22))
        if (hasUpgrade("e",26)) eff = eff.add(tmp.e.upgrades[26].effect2)
        if (hasUpgrade("e",66)) eff = eff.mul(upgradeEffect("e",66))
        if (hasUpgrade("e",73)) eff = eff.mul(upgradeEffect("e",73))
        eff = eff.mul(tmp.e.buyables[12].effect)
        return eff
    },
    effect(){
        let eff = player.e.points
        eff = Decimal.pow(this.effbase(),eff).sub(1)
        if (hasUpgrade("e",14)) eff = eff.mul(tmp.e.upgrades[14].effect)
        if (hasUpgrade("e",21)) eff = eff.mul(upgradeEffect("e",21))
        if (hasUpgrade("e",23)) eff = eff.mul(upgradeEffect("e",23))
        if (hasUpgrade("e",32)) eff = eff.mul(upgradeEffect("e",32))
        if (hasUpgrade("e",36)) eff = eff.mul(upgradeEffect("e",36))
        if (hasUpgrade("e",83)) eff = eff.mul(upgradeEffect("e",83))
        if (hasUpgrade("e",112)) eff = eff.mul(upgradeEffect("e",112))
        if (hasUpgrade("e",121)) eff = eff.mul(upgradeEffect("e",121))
        if (hasUpgrade("e",122)) eff = eff.mul(upgradeEffect("e",122))
        if (hasUpgrade("e",126)) eff = eff.mul(upgradeEffect("e",126))
        eff = eff.mul(tmp.e.buyables[11].effect)
        return eff
    },
    peffect(){
        let eff = player.e.p.add(1).max(1)
        eff = Decimal.pow(10,eff.log10().pow(0.75)).max(1)
        if (hasUpgrade("e",31)) eff = eff.pow(upgradeEffect("e",31))
        if (hasUpgrade("e",135)) eff = eff.pow(upgradeEffect("e",135))
        if (hasUpgrade("e",106)) eff = Decimal.pow(10,eff.add(10).max(10).max(1).log10().pow(1.1))
        if (hasUpgrade("e",156)) eff = Decimal.pow(10,eff.add(10).max(10).max(1).log10().pow(upgradeEffect("e",156)))
        if (hasUpgrade("e",204)) eff = eff.pow(tmp.e.upgrades[204].effect)
        if (eff.gte("eee25")) eff = eff.log10().log10().pow(4e23).pow10()
        return eff
    },
    peffect2(){
        let eff = player.e.p.add(1).max(1)
        eff = eff.log10().pow(1.5).mul(30).floor()
        if (hasUpgrade("e",103)) eff = eff.pow(upgradeEffect("e",103))
        if (hasUpgrade("e",173)) eff = eff.pow(upgradeEffect("e",173))
        if (hasUpgrade("e",183)) eff = eff.pow(upgradeEffect("e",183))
        if (hasUpgrade("e",186)) eff = eff.pow(tmp.e.upgrades[186].effect2)
        if (hasUpgrade("e",204)) eff = eff.pow(tmp.e.upgrades[204].effect2)
        return eff
    },
    Heffect(){
        let eff = player.e.h.max(10).log10().pow(0.5)
        if (eff.gte(9)) eff = eff.div(9).pow(0.5).mul(9)
        if (hasUpgrade("e",242)) eff = eff.pow(upgradeEffect("e",242))
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        eff = eff.pow(tmp.e.Pheffect).sub(1).mul(tmp.e.Oeffect)
        if (eff.gte(5e3)) eff = eff.div(5).log10().pow(2).mul(5e3/9)
        return eff
    },
    Ceffect(){
        let eff = player.e.c.max(10).log10().pow(1.2)
        if (eff.gte(5)) eff = eff.div(5).pow(0.3).mul(5)
        if (eff.gte(160)) eff = eff.div(160).pow(0.5).mul(160)
        if (hasUpgrade("e",242)) eff = eff.pow(upgradeEffect("e",242))
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff.pow(tmp.e.Pheffect).mul(tmp.e.Oeffect)
    },
    Neffect(){
        let eff = player.e.n.max(10).log10().pow(0.0333)
        if (hasUpgrade("e",242)) eff = eff.pow(upgradeEffect("e",242))
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff.pow(tmp.e.Pheffect).sub(1).mul(tmp.e.Oeffect)
    },
    Oeffect(){
        let eff = player.e.o.max(10).log10().pow(0.1)
        if (hasUpgrade("e",242)) eff = eff.pow(upgradeEffect("e",242))
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff.pow(tmp.e.Pheffect)
    },
    Pheffect(){
        let eff = player.e.ph.max(10).log10().pow(0.1)
        if (hasUpgrade("e",242)) eff = eff.pow(upgradeEffect("e",242))
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff
    },
    Aeffect(){
        let eff = player.e.at.add(1).max(1).pow(0.5).pow(tmp.e.Pheffect)
        return eff
    },
    Adeffect(){
        let eff = player.e.ad.add(10).div(2.2e9).max(10).log10().pow(0.333)
        if (eff.gte(1.3)) eff = eff.div(1.3).pow(0.3333).mul(1.3)
        if (hasUpgrade("e",243)) eff = eff.pow(tmp.e.upgrades[243].effect)
        if (hasUpgrade("e",245)) eff = eff.pow(tmp.e.upgrades[245].effect)
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff.pow(tmp.e.Rpeffect)
    },
    Ureffect(){
        let eff = player.e.ur.add(10).div(4e9).max(10).log10().pow(0.12)
        if (eff.gte(1.1)) eff = eff.div(1.1).pow(0.3333).mul(1.1)
        if (hasUpgrade("e",243)) eff = eff.pow(tmp.e.upgrades[243].effect)
        if (hasUpgrade("e",245)) eff = eff.pow(tmp.e.upgrades[245].effect2)
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff.pow(tmp.e.Rpeffect).sub(1)
    },
    Cyeffect(){
        let eff = player.e.cy.add(10).div(8e12).max(10).log10().pow(0.07)
        if (eff.gte(1.07)) eff = eff.div(1.07).pow(0.3333).mul(1.07)
        if (hasUpgrade("e",246)) eff = eff.pow(tmp.e.upgrades[246].effect)
        if (hasUpgrade("e",254)) eff = eff.pow(tmp.e.upgrades[254].effect)
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        if (hasUpgrade("e",323)) eff = eff.pow(tmp.e.upgrades[323].effect.pow(1.6))
        return eff.pow(tmp.e.Rpeffect).sub(1)
    },
    Gueffect(){
        let eff = player.e.gu.add(10).div(5e12).max(10).log10().pow(0.15)
        if (eff.gte(1.15)) eff = eff.div(1.15).pow(0.3333).mul(1.15)
        if (hasUpgrade("e",246)) eff = eff.pow(tmp.e.upgrades[246].effect2)
        if (hasUpgrade("e",254)) eff = eff.pow(tmp.e.upgrades[254].effect)
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff.pow(tmp.e.Rpeffect).sub(1)
    },
    Rpeffect(){
        let eff = player.e.rp.add(10).div(1e19).max(10).log10().pow(0.07)
        if (eff.gte(1.13)) eff = eff.div(1.13).pow(0.3333).mul(1.13)
        if (hasUpgrade("e",264)) eff = eff.pow(tmp.e.upgrades[264].effect)
        if (hasUpgrade("e",266)) eff = eff.pow(tmp.e.upgrades[266].effect)
        if (hasUpgrade("e",284)) eff = eff.pow(tmp.e.upgrades[284].effect)
        if (hasUpgrade("e",312)) eff = eff.pow(tmp.e.upgrades[312].effect)
        return eff
    },
    Again(){
        let eff = new Decimal(1)
        if (hasUpgrade("e",232)) eff = eff.mul(tmp.e.upgrades[232].effect)
        if (hasUpgrade("e",235)) eff = eff.mul(tmp.e.upgrades[235].effect)
        if (hasUpgrade("e",241)) eff = eff.mul(tmp.e.upgrades[241].effect2)
        if (hasUpgrade("e",256)) eff = eff.mul(tmp.e.upgrades[256].effect)
        if (hasUpgrade("e",261)) eff = eff.mul(tmp.e.upgrades[261].effect)
        return eff.mul(tmp.e.mreff)
    },
    buyCap(){
        let eff = Decimal.mul(1e6,tmp.e.buyables[31].effect)
        return eff.floor()
    },
    resetsNothing() { return hasMilestone("e", 5) },
    canBuyMax() {return hasMilestone("e",3)},
    autoPrestige() { return (hasMilestone("e", 5) && player.e.autoi) },
    dgain(){
        let eff = player.e.p.add(10).max(10)
        eff = eff.log10().div(327)
        if (hasUpgrade("e",151)) eff = eff.mul(upgradeEffect("e",151))
        if (hasUpgrade("e",211)) eff = eff.mul(tmp.e.upgrades[211].effect)
        eff = eff.mul(tmp.e.buyables[41].effect).pow(tmp.e.buyables[41].effect)
        if (hasUpgrade("e",113)) eff = eff.mul(upgradeEffect("e",113))
        if (hasUpgrade("e",116)) eff = eff.mul(upgradeEffect("e",116))
        if (hasUpgrade("e",124)) eff = eff.mul(upgradeEffect("e",124))
        if (hasUpgrade("e",142)) eff = eff.mul(upgradeEffect("e",142))
        if (hasUpgrade("e",85)) eff = eff.mul(upgradeEffect("e",85))
        if (player.e.p.lt("e327")) eff = new Decimal(0)
        return eff
    },
    deff(){
        let eff = player.e.diseases.add(1).max(1).pow(1000)
        if (hasUpgrade("e",143)) eff = eff.pow(upgradeEffect("e",143))
        if (hasUpgrade("e",156)) eff = Decimal.pow(10,eff.add(10).max(10).max(1).log10().pow(upgradeEffect("e",156)))
        if (hasUpgrade("e",171)) eff = Decimal.pow(10,eff.add(10).max(10).max(1).log10().pow(upgradeEffect("e",171)))
        if (hasUpgrade("e",195)) eff = Decimal.pow(10,eff.add(10).max(10).max(1).log10().pow(upgradeEffect("e",195)))
        return eff
    },
    reff(){
        let eff = player.e.rna.add(1).max(1).pow(5)
        if (hasUpgrade("e",232)) eff = eff.pow(tmp.e.upgrades[232].effect2)
        if (hasUpgrade("e",243)) eff = eff.pow(tmp.e.upgrades[243].effect)
        if (hasUpgrade("e",275)) eff = eff.pow(tmp.e.upgrades[275].effect)
        if (hasUpgrade("e",304)) eff = eff.pow(tmp.e.upgrades[304].effect)
        return eff.pow(tmp.e.buyables[95].effect)
    },
    rgain(){
        let exp = Decimal.add(5,tmp.e.buyables[72].effect).add(tmp.e.Heffect)
        let eff = player.e.p.log10().div(6644e8).pow(exp)
        if (hasUpgrade("e",202)) eff = eff.mul(upgradeEffect("e",202))
        if (hasUpgrade("e",205)) eff = eff.mul(upgradeEffect("e",205))
        if (hasUpgrade("e",206)) eff = eff.mul(upgradeEffect("e",206))
        if (hasUpgrade("e",212)) eff = eff.mul(upgradeEffect("e",212))
        if (hasUpgrade("e",214)) eff = eff.mul(upgradeEffect("e",214))
        if (hasUpgrade("e",215)) eff = eff.mul(upgradeEffect("e",215))
        if (hasUpgrade("e",225)) eff = eff.mul(upgradeEffect("e",225))
        if (hasUpgrade("e",233)) eff = eff.mul(upgradeEffect("e",233))
        if (hasUpgrade("e",236)) eff = eff.mul(upgradeEffect("e",236))
        if (hasUpgrade("e",244)) eff = eff.mul(upgradeEffect("e",244))
        if (hasUpgrade("e",272)) eff = eff.mul(upgradeEffect("e",272))
        if (player.e.p.lt("e6644e8")) eff = new Decimal(0)
        return eff.mul(tmp.e.buyables[71].effect).mul(tmp.e.Aeffect)
    },
    reff2(){
        let eff = player.e.rna.add(1).max(1).pow(0.1).max(1)
        if (hasUpgrade("e",232)) eff = eff.pow(tmp.e.upgrades[232].effect2)
        if (hasUpgrade("e",243)) eff = eff.pow(tmp.e.upgrades[243].effect)
        if (hasUpgrade("e",275)) eff = eff.pow(tmp.e.upgrades[275].effect)
        if (hasUpgrade("e",304)) eff = eff.pow(tmp.e.upgrades[304].effect)
        eff = eff.pow(tmp.e.buyables[95].effect)
        let start = new Decimal(1e160)
        let exp = new Decimal(0.6)
        if (hasUpgrade("e",306)) {
            start = start.mul(Decimal.pow(10,840))
            exp = exp.add(0.02)
        }
        if (hasUpgrade("e",406)) exp = exp.add(0.18)
        if (eff.gte(start)) eff = eff.div(start).log10().pow(exp).pow10().mul(start)
        return eff
    },
    infScale() {
        let scale = new Decimal(2e4)
        if (hasUpgrade("e",325)) scale = scale.add(tmp.e.upgrades[325].effect2)
        return scale.add(tmp.e.mueff.e4)
    },
    mrgain(){
        let exp = Decimal.add(0.1,tmp.e.mueff.e1)
        if (hasUpgrade("e",292)) exp = exp.add(upgradeEffect("e",292))
        if (hasUpgrade("e",315)) exp = exp.add(upgradeEffect("e",315))
        if (hasUpgrade("e",321)) exp = exp.add(upgradeEffect("e",321))
        let eff = player.e.ad.div(1.1e75).max(10).log10().mul(player.e.ur.div(1.75e75).max(10).log10()).mul(player.e.cy.div(1.75e75).max(10).log10()).mul(player.e.gu.div(1.1e75).max(10).log10()).mul(player.e.rp.div(1.831e54).max(10).log10())
        .sub(1).pow(exp).div(10)
        if (hasUpgrade("e",271)) eff = eff.mul(upgradeEffect("e",271))
        if (hasUpgrade("e",274)) eff = eff.mul(upgradeEffect("e",274))
        if (hasUpgrade("e",281)) eff = eff.mul(upgradeEffect("e",281))
        if (hasUpgrade("e",301)) eff = eff.mul(upgradeEffect("e",301))
        if (hasUpgrade("e",305)) eff = eff.mul(upgradeEffect("e",305))
        if (hasUpgrade("e",341)) eff = eff.mul(upgradeEffect("e",341))
        if (hasUpgrade("e",286)) eff = eff.mul(tmp.e.upgrades[286].effect)
        if (player.e.ad.lt(1.1e76) || player.e.ur.lt(1.75e76) || player.e.cy.lt(1.75e76) || player.e.gu.lt(1.1e76) || player.e.rp.lt(1.831e55)) return new Decimal(0)
        return eff.mul(tmp.e.buyables[93].effect).mul(tmp.e.mmeff).mul(tmp.e.buyables[105].effect.pow(player.e.buyables[102]))
    },
    mreff(){
        let eff = player.e.mrna.add(10).log10().pow(10)
        if (hasUpgrade("e",285)) eff = eff.pow(upgradeEffect("e",285))
        if (hasUpgrade("e",291)) eff = eff.pow(upgradeEffect("e",291))
        if (hasUpgrade("e",302)) eff = eff.pow(upgradeEffect("e",302))
        if (hasUpgrade("e",311)) eff = powExp(eff,1.1)
        if (hasUpgrade("e",333)) eff = powExp(eff,1.125)
        if (hasUpgrade("e",316)) eff = powExp(eff,upgradeEffect("e",316))
        if (eff.gte(Decimal.pow(10,4e8))) eff = eff.log10().log10().div(Decimal.log10(4e8)).pow(0.3).mul(Decimal.log10(4e8)).pow10().pow10()
        if (eff.gte(Decimal.pow(10,1e9))) eff = eff.log10().log10().div(9).pow(0.5).mul(9).pow10().pow10()
        return eff
    },
    mmeff(){
        let eff = player.e.mm.add(1).pow(5)
        if (hasUpgrade("e",326)) eff = eff.pow(upgradeEffect("e",326).pow(2.5))
        if (hasUpgrade("e",331)) eff = eff.pow(upgradeEffect("e",331))
        if (hasUpgrade("e",336)) eff = eff.pow(1.25)
        if (hasUpgrade("e",352)) eff = eff.pow(upgradeEffect("e",352))
        if (hasUpgrade("e",371)) eff = eff.pow(upgradeEffect("e",371))
        if (hasUpgrade("e",375)) eff = eff.pow(upgradeEffect("e",375))
        if (hasUpgrade("e",386)) eff = eff.pow(upgradeEffect("e",386))
        if (hasUpgrade("e",396)) eff = eff.pow(tmp.e.mueff.e6)
        if (hasUpgrade("e",392)) eff = powExp(eff,1.01)
        if (hasUpgrade("e",393)) eff = powExp(eff,1.02)
        if (eff.gte(Decimal.pow(10,1e12))) eff = eff.log10().log10().div(12).pow(0.5).mul(12).pow10().pow10()
        return eff
    },
    mueff(){
        let mu = player.e.mu.add(tmp.e.mueff2.e1)
        if (hasUpgrade("e",402)) mu = mu.mul(1.3)
        let eff = mu.pow(0.8).div(7)
        if (hasUpgrade("e",332)) eff = eff.add(1).pow(upgradeEffect("e",332)).sub(1)
        if (hasUpgrade("e",385)) eff = eff.add(1).pow(upgradeEffect("e",385)).sub(1)
        if (eff.gte(15e5)) eff = eff.div(15e5).pow(0.2).mul(15e5)
        let eff2 = mu.add(1).pow(0.75)
        if (hasUpgrade("e",332)) eff2 = eff2.pow(upgradeEffect("e",332))
        if (hasUpgrade("e",342)) eff2 = eff2.pow(upgradeEffect("e",342))
        if (hasUpgrade("e",355)) eff2 = eff2.pow(upgradeEffect("e",355))
        if (hasUpgrade("e",375)) eff2 = eff2.pow(upgradeEffect("e",375))
        if (hasUpgrade("e",404)) eff2 = powExp(eff2,1.03)
        if (hasUpgrade("e",414)) eff2 = powExp(eff2,1.02)
        let eff3 = mu.sub(19).max(0).pow(1.5).mul(2)
        if (eff3.gte(25)) eff3 = eff3.div(25).pow(0.3).mul(25)
        if (hasUpgrade("e",343)) eff3 = eff3.mul(upgradeEffect("e",343))
        let eff4 = mu.sub(39).max(0).mul(1e3)
        let eff5 = mu.max(10).log10().pow(0.6)
        if (hasUpgrade("e",356)) eff5 = eff5.pow(upgradeEffect("e",356))
        if (hasUpgrade("e",381)) eff5 = eff5.pow(1.2)
        let eff6 = mu.pow(1/3).div(20).add(1)
        return {e1:eff,e2:eff2,e3:eff3.floor(),e4:eff4,e5:eff5.sub(1),e6:eff6}
    },
    mueff2(){
        let mu = player.e.mu2
        if (hasUpgrade("e",403)) mu = mu.add(1)
        if (hasUpgrade("e",411)) mu = mu.add(upgradeEffect("e",411))
        if (hasUpgrade("e",412)) mu = mu.add(upgradeEffect("e",412))
        if (hasUpgrade("e",376)) mu = mu.mul(1.5)
        let eff = mu.pow(1.5).mul(10)
        if (eff.gte(147)) eff = eff.div(147).pow(1.5).mul(147)
        let eff2 = mu.pow(1.5)
        if (hasUpgrade("e",396)) eff2 = eff2.mul(upgradeEffect("e",396))
        if (hasUpgrade("e",406)) eff2 = eff2.mul(upgradeEffect("e",406))
        let eff3 = Decimal.pow(100,mu)
        if (eff3.gte(1e9)) eff3 = eff3.log10().div(9).pow(1.75).mul(9).pow10()
        if (hasUpgrade("e",416)) eff3 = eff3.pow(3)
        if (hasUpgrade("e",421)) eff3 = eff3.pow(2)
        let eff4 = mu.div(100).add(1)
        return {e1:eff,e2:eff2,e3:eff3,e4:eff4}
    },
    mmlim(){
        let eff = tmp.e.mueff.e2.mul(10).mul(tmp.e.buyables[104].effect).mul(tmp.e.mueff2.e3)
        if (hasUpgrade("e",323)) eff = eff.mul(upgradeEffect("e",323))
        if (hasUpgrade("e",326)) eff = eff.mul(upgradeEffect("e",326))
        if (hasUpgrade("e",334)) eff = eff.mul(upgradeEffect("e",334))
        if (hasUpgrade("e",416)) eff = eff.pow(1.2)
        return eff
    },
    creff(){
        let exp = player.e.crna.add(10).max(10).log10().pow(1.5)
        if (exp.gte(3)) exp = exp.div(3).pow(0.4).mul(3)
        let eff = player.e.crna.add(1).pow(player.e.crna.add(10).max(10).log10().pow(1.5)).pow(3)
        return eff
    },
    crgain(){
        let eff = powExp(player.e.mm,0.4).root(Decimal.pow(309,0.4)).div(10).pow(20)
        if (player.e.mm.lt(Decimal.pow(10,309))) eff = new Decimal(0)
        return eff.mul(tmp.e.buyables[111].effect).mul(tmp.e.buyables[112].effect).mul(tmp.e.buyables[113].effect)
    },
    qExp(){
        let exp = new Decimal(0.5)
        if (hasUpgrade("e",96)) exp = exp.mul(upgradeEffect("e",96))
        if (hasUpgrade("e",104)) exp = exp.mul(upgradeEffect("e",104))
        if (hasUpgrade("e",164)) exp = exp.mul(upgradeEffect("e",164))
        exp = exp.mul(tmp.e.buyables[62].effect)
        return exp
    },
    ucGain(){
        let exp = Decimal.add(0.7,tmp.e.buyables[53].effect)
        let eff = player.e.qt.pow(exp).mul(tmp.e.buyables[51].effect)
        if (hasUpgrade("e",81)) eff = eff.mul(upgradeEffect("e",81))
        if (hasUpgrade("e",84)) eff = eff.mul(upgradeEffect("e",84))
        if (hasUpgrade("e",86)) eff = eff.mul(upgradeEffect("e",86))
        if (hasUpgrade("e",91)) eff = eff.mul(upgradeEffect("e",91))
        if (hasUpgrade("e",101)) eff = eff.mul(upgradeEffect("e",101))
        if (hasUpgrade("e",186)) eff = eff.mul(tmp.e.upgrades[186].effect)
        if (hasUpgrade("e",201)) eff = eff.mul(upgradeEffect("e",201))
        return eff
    },
    mmgain(){
        let eff = new Decimal(0.15)
        if (hasUpgrade("e",324)) eff = eff.mul(tmp.e.upgrades[324].effect2)
        return eff.mul(tmp.e.buyables[104].effect).mul(tmp.e.mueff2.e3).mul(tmp.e.creff)
    },
    uiMult() {
        let eff = tmp.e.buyables[52].effect
        if (hasUpgrade("e",163)) eff = eff.mul(upgradeEffect("e",163))
        if (hasUpgrade("e",172)) eff = eff.mul(upgradeEffect("e",172))
        return eff
    },
    freeMBuy() {
        let x = tmp.e.buyables[101].total.mul(tmp.e.buyables[101].base2)
        return x
    },
    effectDescription() {
        return "which produces "+layerText("h2", "e", format(tmp.e.effect)) + " infection power per second."
    },
    crg(){
        let eff = player.e.Cr
        return eff
    },
    crexp(){
        let eff = new Decimal(3)
        if (hasUpgrade("e",406)) eff= eff.add(0.1)
        if (hasUpgrade("e",411)) eff= eff.add(0.15)
        if (hasUpgrade("e",423)) eff= eff.add(0.2)
        if (hasUpgrade("e",414)) eff= eff.add(upgradeEffect("e",414))
        if (hasUpgrade("e",416)) eff= eff.add(upgradeEffect("e",416))
        return eff
    },
    crlog(){
        let eff = new Decimal(1)
        if (hasUpgrade("e",413)) eff= eff.sub(0.01)
        if (hasUpgrade("e",414)) eff= eff.sub(0.01)
        if (hasUpgrade("e",415)) eff= eff.sub(0.03)
        if (hasUpgrade("e",421)) eff= eff.sub(upgradeEffect("e",421))
        return eff
    },
    crMult(){
        let eff = new Decimal(1)
        return eff.mul(tmp.e.buyables[121].effect).mul(tmp.e.buyables[122].effect).mul(tmp.e.buyables[123].effect)
    },
    update(diff) {
        player.e.virus= ["C","CO","COB","COV","COVA","COVE","COVO","COVI","COVIS","COVIR","COVIC","COVIP","COVIM","COVIT","COVID"]
        if (player.e.unlocked) player.e.p = player.e.p.add(tmp.e.effect.times(diff)).min(tmp.e.effect.mul(1000))
        if (hasMilestone("e",2)) player.e.diseases = player.e.diseases.add(tmp.e.dgain.times(diff))
        if (hasUpgrade("e",46)) player.e.qc = player.e.qc.add(tmp.e.ucGain.times(diff))
        if (hasUpgrade("e",196)) player.e.rna = player.e.rna.add(tmp.e.rgain.times(diff))
        if (hasUpgrade("e",316)) player.e.mm = player.e.mm.add(tmp.e.buyables[102].effect.times(diff)).min(tmp.e.mmlim)
        if (hasUpgrade("e",403)) {
            let cg = player.e.crna.div(tmp.e.crMult).root(tmp.e.crexp).iteratedlog(10,tmp.e.crlog.neg()).add(tmp.e.crgain.times(diff)).iteratedlog(10,tmp.e.crlog).pow(tmp.e.crexp).mul(tmp.e.crMult)
            player.e.Cr = cg.sub(player.e.crna).div(diff)
            player.e.crna = cg
        }
        if (hasUpgrade("e",226)) {
            player.e.h = player.e.h.add(tmp.e.buyables[81].effect.times(diff))
            player.e.c = player.e.c.add(tmp.e.buyables[82].effect.times(diff))
            player.e.n = player.e.n.add(tmp.e.buyables[83].effect.times(diff))
            player.e.o = player.e.o.add(tmp.e.buyables[91].effect.times(diff))
            player.e.ph = player.e.ph.add(tmp.e.buyables[92].effect.times(diff))
        }
        if (hasUpgrade("e",266)) {
            player.e.ad = player.e.ad.add(player.e.h.div(5).min(player.e.c.div(5)).min(player.e.n.div(5)).times(diff))
            player.e.ur = player.e.ur.add(player.e.h.div(4).min(player.e.c.div(4)).min(player.e.n.div(2)).min(player.e.o.div(2)).times(diff))
            player.e.cy = player.e.cy.add(player.e.h.div(5).min(player.e.c.div(4)).min(player.e.n.div(3)).min(player.e.o).times(diff))
            player.e.gu = player.e.gu.add(player.e.h.div(5).min(player.e.c.div(5)).min(player.e.n.div(5)).min(player.e.o).times(diff))
            player.e.rp = player.e.rp.add(player.e.h.div(11).min(player.e.c.div(5)).min(player.e.o.div(8)).min(player.e.ph).times(diff))
            player.e.mrna = player.e.mrna.add(tmp.e.mrgain.times(diff))
        }
        player.e.i = tmp.e.i
        player.e.at = player.e.h.add(1).max(1).mul(player.e.c.add(1).max(1)).mul(player.e.n.add(1).max(1)).mul(player.e.o.add(1).max(1)).mul(player.e.ph.add(1).max(1)).sub(1)
        if (hasUpgrade("e",46)) player.e.ins = player.e.ins.add(upgradeEffect("e",46).times(diff))
        player.e.in = tmp.e.buyables[11].total.add(tmp.e.buyables[12].total).add(tmp.e.buyables[13].total).add(tmp.e.buyables[21].total.mul(10)).add(tmp.e.buyables[22].total.mul(10)).add(tmp.e.buyables[23].total.mul(10)).add(player.e.ins).add(upgradeEffect("e",44).mul(hasUpgrade("e",44)+0))
        player.e.infections = player.e.in.sub(player.e.spent)
        let gain = tmp.pointGen.root(tmp.d.buyables[13].effect).log10().log10().pow(tmp.e.qExp).div(920000).pow(tmp.e.clickables[11].exp).mul(100).mul(tmp.e.uiMult).max(0)
        if (hasUpgrade("e",162)) player.e.qt = player.e.qt.max(gain)
        if (player.e.autob) {
            if (hasMilestone("e",3)) {
                player.e.buyables[11] = player.e.buyables[11].add(Decimal.log10(player.e.p.div(4e14)).div(Decimal.log10(5)).root(1.4).ceil().sub(player.e.buyables[11])).min(tmp.e.buyCap).max(player.e.buyables[11])
                player.e.buyables[12] = player.e.buyables[12].add(Decimal.log10(player.e.p.div(1e16)).div(Decimal.log10(100)).root(1.4).ceil().sub(player.e.buyables[12])).min(tmp.e.buyCap).max(player.e.buyables[12])
                player.e.buyables[13] = player.e.buyables[13].add(Decimal.log10(player.e.p.div(1e24)).div(Decimal.log10(1e5)).root(1.49).ceil().sub(player.e.buyables[13])).min(tmp.e.buyCap).max(player.e.buyables[13])
                if (hasUpgrade("e",146)) {
                    player.e.buyables[21] = player.e.buyables[21].add(Decimal.log10(player.e.p.div("3e48054")).div(Decimal.log10(1e50)).root(1.45).ceil().sub(player.e.buyables[21])).min(tmp.e.buyCap).max(player.e.buyables[21])
                    player.e.buyables[22] = player.e.buyables[22].add(Decimal.log10(player.e.p.div("e55618")).div(Decimal.log10(1e120)).root(1.45).ceil().sub(player.e.buyables[22])).min(tmp.e.buyCap).max(player.e.buyables[22])
                    player.e.buyables[23] = player.e.buyables[23].add(Decimal.log10(player.e.p.div("1.337e74304")).div(Decimal.log10(1e250)).root(1.53).ceil().sub(player.e.buyables[23])).min(tmp.e.buyCap).max(player.e.buyables[23])
                }
            } else {
            layers.e.buyables[11].buyMax()
            layers.e.buyables[12].buyMax()
            layers.e.buyables[13].buyMax()
            if (hasUpgrade("e",146)) {
            layers.e.buyables[21].buyMax()
            layers.e.buyables[22].buyMax()
            layers.e.buyables[23].buyMax()
            }
        }
        }
        if (player.e.autoq) {
            layers.e.buyables[51].buyMax()
            layers.e.buyables[52].buyMax()
            layers.e.buyables[53].buyMax()
            if (hasUpgrade("e",106)) {
            layers.e.buyables[61].buyMax()
            layers.e.buyables[62].buyMax()
            layers.e.buyables[63].buyMax()
            }
        }
        if (player.e.autoa) {
            layers.e.buyables[71].buyMax()
            layers.e.buyables[72].buyMax()
            if (hasUpgrade("e",226)) {
            layers.e.buyables[81].buyMax()
            layers.e.buyables[82].buyMax()
            layers.e.buyables[83].buyMax()
            layers.e.buyables[91].buyMax()
            if (hasUpgrade("e",253)) layers.e.buyables[92].buyMax()
            }
        }
        if (player.e.autod) {
            layers.e.buyables[41].buyMax()
            layers.e.buyables[42].buyMax()
        }
        if (player.e.autom) {
            layers.e.buyables[93].buyMax()
            if (hasUpgrade("e",293)) layers.e.buyables[94].buyMax()
            if (hasUpgrade("e",305)) layers.e.buyables[95].buyMax()
            if (hasUpgrade("e",313)) layers.e.buyables[101].buyMax()
        }
        if (player.e.automm) {
            layers.e.buyables[102].buyMax()
        }
        if (player.e.automm2) {
            layers.e.buyables[103].buyMax()
            layers.e.buyables[104].buyMax()
            layers.e.buyables[105].buyMax()
        }
        if (player.e.automax) {
            layers.e.buyables[31].buyMax()
        }
        let t = 0.1
        if (hasUpgrade("e",46)) t = 0.33
        if (player.e.ct < t && (inChallenge("e", 11) || inChallenge("e", 12) || player.e.inC))player.e.ct += diff
        if (player.e.ct >= t) {
            player.v.upgrades = [11,12,13,21,22,23,31,32,33]
        }
    },
    microtabs: {
        mRNAupg: {
            "Upgrades": {
                content: [
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.mRNAupg == "Upgrades") return ["upgrades",[27,28,29,30,31,32,33]]},
                ],
                buttonStyle: {"border-color": "#00AA55"},
            },
            "Upgrades2": {
                content: [
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.mRNAupg == "Upgrades2") return ["upgrades",[34,35,36,37,38,39,40]]},
                ],
                buttonStyle: {"border-color": "#00AA55"},
                unlocked() {return hasUpgrade("e",336)}
            },
            "Upgrades3": {
                content: [
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.mRNAupg == "Upgrades3") return ["upgrades",[41,42]]},
                ],
                buttonStyle: {"border-color": "#00AA55"},
                unlocked() {return hasUpgrade("e",406)}
            },
            "Buyables": {
                content: [
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.mRNAupg == "Buyables") return ["row",[["buyable",93],["buyable",94],["buyable",95]]]},
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.mRNAupg == "Buyables") return ["buyable",101]},
                ],
                buttonStyle: {"border-color": "#00AA55"},
            }
        },
        stuff: {
            "Upgrades": {
                content: [
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Upgrades") return ["upgrades",[20,21,22,23,24,25,26]]},
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Upgrades") return ["row",[["buyable",71],["buyable",72]]]},
                ],
                buttonStyle: {"border-color": "#0066cc"},
            },
            "Atoms": {
                content: [
                    ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Atoms") {
                        let a = "You have <h2 style='color:#A00000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.h) + "</h2> Hydrogen, which increases RNA gain exp by " + format(tmp.e.Heffect)+"<br>"
                        let b = "You have <h2 style='color:#00A000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.c) + "</h2> Carbon, which boosts cases exp and 'Nucleotides' by ^" + format(tmp.e.Ceffect)+"<br>"
                        let c = "You have <h2 style='color:#00A0A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.n) + "</h2> Nitrogen, which increases 'Max Buyable' base by " + format(tmp.e.Neffect)+"<br>"
                        let d = "You have <h2 style='color:#0000A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.o) + "</h2> Oxygen, which boosts previous Atom effects by " + format(tmp.e.Oeffect)+"<br>"
                        let e = hasUpgrade("e",253)?"You have <h2 style='color:#BB5500;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.ph) + "</h2> Phosphorus, which boosts previous Atom and Atomic RNA effects by ^" + format(tmp.e.Pheffect)+"<br>":""
                        let f = "You have <h2 style='color:#A0A000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.at) + "</h2> Atomic RNA, which boosts RNA gain by " + format(tmp.e.Aeffect)
                        return a+b+c+d+e+f
                        }
                    }],
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Atoms") return ["row",[["buyable",81],["buyable",82],["buyable",83],["buyable",91],["buyable",92]]]},
                ],
                buttonStyle: {"border-color": "#0066cc"},
                shouldNotify() {return (tmp.e.buyables[81].canAfford || tmp.e.buyables[82].canAfford || tmp.e.buyables[83].canAfford || tmp.e.buyables[91].canAfford || tmp.e.buyables[92].canAfford) && !player.e.autoa},
                unlocked() {return hasUpgrade("e",226)}
            },
            "Molecules": {
                content: [
                    ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Molecules") {
                        let a = "You have <h2 style='color:#A00000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.h) + "</h2> Hydrogen<br>"
                        let b = "You have <h2 style='color:#00A000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.c) + "</h2> Carbon<br>"
                        let c = "You have <h2 style='color:#00A0A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.n) + "</h2> Nitrogen<br>"
                        let d = "You have <h2 style='color:#0000A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.o) + "</h2> Oxygen<br>"
                        let e = hasUpgrade("e",253)?"You have <h2 style='color:#BB5500;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.ph) + "</h2> Phosphorus<br>":""
                        let f = "You have <h2 style='color:#A000A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.ad) + "</h2> Adenine (starts at 2.2e10), which boosts Self RNA by ^" + format(tmp.e.Adeffect)+"<br>"
                        let g = "You have <h2 style='color:#A0A000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.ur) + "</h2> Uracil (starts at 4e10), which increases 'RNA Boost' base by " + format(tmp.e.Ureffect)+"<br>"
                        let h = hasUpgrade("e",244)?"You have <h2 style='color:#A0A0A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.cy) + "</h2> Cytosine (starts at 8e13), which increases 'Protein Synthesis' base by " + format(tmp.e.Cyeffect)+"<br>":""
                        let i = hasUpgrade("e",244)?"You have <h2 style='color:#A05000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.gu) + "</h2> Guanine (starts at 5e13), which increases AP base by " + format(tmp.e.Gueffect)+"<br>":""
                        let j = hasUpgrade("e",256)?"You have <h2 style='color:#0055AA;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.rp) + "</h2> Ribose-Phosphate (starts at 1e20), which boosts previous Molecules by ^" + format(tmp.e.Rpeffect):""
                        return a+b+c+d+e+f+g+h+i+j
                        }
                    }],
                    ["clickable",12],
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Molecules") return ["row",[["clickable",21],["clickable",22],["clickable",23],["clickable",24],["clickable",25]]]},
                ],
                buttonStyle: {"border-color": "#0066cc"},
                unlocked() {return hasUpgrade("e",242)}
            },
            "mRNA": {
                content: [
                    ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "mRNA") {
                        let a = "You have <h2 style='color:#A000A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.ad) + "</h2> Adenine<br>"
                        let b = "You have <h2 style='color:#A0A000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.ur) + "</h2> Uracil<br>"
                        let c = "You have <h2 style='color:#A0A0A0;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.cy) + "</h2> Cytosine<br>"
                        let d = "You have <h2 style='color:#A05000;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.gu) + "</h2> Guanine<br>"
                        let e = "You have <h2 style='color:#0055AA;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.rp) + "</h2> Ribose-Phosphate<br>"
                        let f = "You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mrna) + "</h2> mRNA, which boosts atom gain by " + format(tmp.e.mreff)+"<br>"
                        let g = "You are gaining <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + format(tmp.e.mrgain) + "</h2> mRNA per second (starts at 1.1e76 AD, 1.75e76 UR, 1.75e76 CY, 1.1e76 GU, 1.831e55 R5P)<br>"
                        return a+b+c+d+e+f+g
                        }
                    }],
                    ["microtabs", "mRNAupg"],
                ],
                buttonStyle: {"border-color": "#0066cc"},
                unlocked() {return hasUpgrade("e",266)}
            },
            "MMNA": {
                content: [
                    ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "MMNA") {
                        let a = "You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mrna) + "</h2> mRNA, which boosts atom gain by " + format(tmp.e.mreff)+"<br>"
                        let b = "You are gaining <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + format(tmp.e.mrgain) + "</h2> mRNA per second<br>"
                        let c ="You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mm) + "</h2> MMNA (Limit: "+formatWhole(tmp.e.mmlim)+"), which boosts mRNA gain by " + format(tmp.e.mmeff)+"<br>"
                        let d = "Attempt amount:"+formatWhole(tmp.e.clickables.getAttemptAmount)+"x"
                        return a+b+c+d
                        }
                    }],
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "MMNA") return ["row",[["buyable",102],["buyable",103],["buyable",104],["buyable",105]]]},
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "MMNA") return ["row",[["clickable",31],["clickable",32]]]},
                    "blank",
                ],
                buttonStyle: {"border-color": "#0066cc"},
                unlocked() {return hasUpgrade("e",316)}
            },
            "Rewards": {
                content: [
                    ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "Rewards") {
                        let a = "You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mu) + "</h2> Mutations, which gives:<br>"
                        let b = "+"+format(tmp.e.mueff.e1)+" mRNA exponent<br>"
                        let c = format(tmp.e.mueff.e2)+"x MMNA limit<br>"
                        let d = player.e.mu.gte(20)?formatWhole(tmp.e.mueff.e3)+" free 'mRNA Gain'<br>":""
                        let e = player.e.mu.gte(40)?formatWhole(tmp.e.mueff.e4)+" later 20,000 Infecter scaling <br>":""
                        let e2 = hasUpgrade("e",346)?"+"+format(tmp.e.mueff.e5)+" Max Buyable exp<br>":""
                        let e3 = hasUpgrade("e",346)?"^"+format(tmp.e.mueff.e6)+" MMNA effect and base MMNA gain<br>":""
                        let f = "You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mu2) + "</h2> Corona Mutations, which gives:<br>"
                        let g = player.e.mu2.gte(1)?format(tmp.e.mueff2.e1)+" effective Mutations<br>":""
                        let h = player.e.mu2.gte(1)?format(tmp.e.mueff2.e2)+" free 'mRNA Booster'<br>":""
                        let i = player.e.mu2.gte(1)?format(tmp.e.mueff2.e3)+"x MMNA gain and limit<br>":""
                        let j = player.e.mu2.gte(5)?"/"+format(tmp.e.mueff2.e4)+" MMNA buyables scaling<br>":""
                        return a+b+c+d+e+e2+e3+"<br>"+f+g+h+i+j
                        }
                    }],
                ],
                buttonStyle: {"border-color": "#0066cc"},
                unlocked() {return hasUpgrade("e",316)}
            },
            "CRNA": {
                content: [
                    ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "CRNA") {
                        let a = "You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mrna) + "</h2> mRNA, which boosts atom gain by " + format(tmp.e.mreff)+"<br>"
                        let b = "You are gaining <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + format(tmp.e.mrgain) + "</h2> mRNA per second<br>"
                        let c ="You have <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + formatWhole(player.e.mm) + "</h2> MMNA (Limit: "+formatWhole(tmp.e.mmlim)+"), which boosts mRNA gain by " + format(tmp.e.mmeff)+"<br>"
                        let d = "You are gaining <h2 style='color:#00AA55;text-shadow:0px 0px 10px;'>" + format(tmp.e.buyables[102].effect) + "</h2> MMNA per second<br>"
                        let e ="You have <h2 style='color:#AA55AA;text-shadow:0px 0px 10px;'>" + format(player.e.crna) + "</h2> CRNA, which boosts MMNA gain by " + format(tmp.e.creff)+" (hold shift to see gain formula)<br>"
                        let e2= shiftDown?"Gain: log<sup>"+format(tmp.e.crlog)+"</sup>10(x)^"+format(tmp.e.crexp)+"*"+format(tmp.e.crMult)+"<br>":""
                        let f = "You are gaining <h2 style='color:#AA55AA;text-shadow:0px 0px 10px;'>" + format(player.e.Cr) + "</h2> CRNA per second (Base Gain: <h2 style='color:#AA55AA;text-shadow:0px 0px 10px;'>"+ format(tmp.e.crgain)+"</h2>) (starts at 1e309 MMNA)<br>"
                        return a+b+c+d+e+e2+f
                        }
                    }],
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "CRNA") return ["row",[["buyable",111],["buyable",112],["buyable",113]]]},
                    function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA" && player.subtabs.e.stuff == "CRNA") return ["row",[["buyable",121],["buyable",122],["buyable",123]]]},
                    "blank",
                ],
                buttonStyle: {"border-color": "#0066cc"},
                unlocked() {return hasUpgrade("e",403)}
            },
        },
    },
    tabFormat:{
        "Main": {
            content: [
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Main") return "main-display"},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Main") return "prestige-button"},
                "blank",
                ["raw-html", 
                function () {
                    if (player.tab == "e" && player.subtabs.e.mainTabs == "Main") {
                    let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                    let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br><br>":""
                    return a+b
                    }
                }],
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Main") return ["upgrades",[1,2,3,4,19]]},
            ],
        },
        "Milestones": {
            content: [
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Milestones") return "main-display"},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Milestones") return "prestige-button"},
                "blank",
                ["raw-html", 
                function () {
                    if (player.tab == "e" && player.subtabs.e.mainTabs == "Milestones") {
                    let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                    let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br><br>":""
                    return a+b
                    }
                }],
                function () {if (player.tab == "e") return "milestones"},
            ],
        },
        "Buyables": {
            content: [
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Buyables") return "main-display"},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Buyables") return "prestige-button"},
                "blank",
                ["raw-html", 
                function () {
                    if (player.tab == "e" && player.subtabs.e.mainTabs == "Buyables") {
                    let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                    let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br><br>":""
                    let c =(hasMilestone("e",1))?"You have " + layerText("h2", "e", formatWhole(player.e.infections)) +  ' infected infections ('+layerText("h2", "e", formatWhole(player.e.in))+" total)":""
                    return a+b+c
                    }
                }],
                ["display-text", "Buyables give free levels to left buyables."],
                ["display-text", function () {if (hasMilestone("e",1)) return "Each buyable gives 1 infected infection."}],
                ["display-text", function () {if (hasUpgrade("e",146)) return "Each Row 2 buyable gives 10 infected infections."}],
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Buyables") return ["row",[["buyable",11],["buyable",12],["buyable",13]]]},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Buyables") return ["row",[["buyable",21],["buyable",22],["buyable",23]]]},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Buyables") return ["row",[["buyable",31]]]},
            ],
            shouldNotify() {return tmp.e.buyables[31].canAfford},
            unlocked() {return hasMilestone("e",0)}
        },
        "Infections": {
            content: [
                function () {if (player.tab == "e") return "main-display"},
                function () {if (player.tab == "e") return "prestige-button"},
                "blank",
                ["raw-html", 
                function () {
                    if (player.tab == "e" && player.subtabs.e.mainTabs == "Infections") {
                    let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                    let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br><br>":""
                    let c ="You have " + layerText("h2", "e", formatWhole(player.e.infections)) +  ' infected infections ('+layerText("h2", "e", formatWhole(player.e.in))+" total)"
                    return a+b+c
                    }
                }],
                "blank",
                "respec-button",
                ["upgrade",51],
                ["row",[["upgrade",52],["upgrade",53]]],
                ["row",[["upgrade",54],["upgrade",55]]],
                ["upgrade",56],
                ["upgrade",61],
                ["row",[["upgrade",62],["upgrade",65],["upgrade",72]]],
                ["row",[["upgrade",63],["upgrade",66],["upgrade",73]]],
                ["row",[["upgrade",64],["upgrade",71],["upgrade",74]]],
                ["upgrade",75],
                ["upgrade",76],
            ],
            unlocked() {return hasMilestone("e",1)}
        },
        "Diseases": {
            content: [
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Diseases") return "main-display"},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Diseases") return "prestige-button"},
                "blank",
                ["raw-html", 
                function () {
                    if (player.tab == "e" && player.subtabs.e.mainTabs == "Diseases") {
                    let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                    let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br>":""
                    let c = "You have " + layerText("h2", "e", format(player.e.diseases)) +  ' infectious diseases, which boost Dimension Boosts by '+ layerText("h2", "e", format(tmp.e.deff))+"<br>"
                    let d = "You are gaining " + layerText("h2", "e", format(tmp.e.dgain)) +  ' infectious diseases per second (starts at 1e327 infection power)'
                    return a+b+c+d
                    }
                }],
                "blank",
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Diseases") return ["upgrades",[11,12,13,14,15]]},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Diseases") return ["row",[["buyable",41], ["buyable",42]]]},
            ],
            shouldNotify() {return (tmp.e.buyables[41].canAfford || tmp.e.buyables[42].canAfford) && !player.e.autod},
            unlocked() {return hasMilestone("e",2)}
        },
        "Challenges": {
            content: [
                function () {if (player.tab == "e") return "main-display"},
                function () {if (player.tab == "e") return "prestige-button"},
                "blank",
                ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "Challenges") {
                        let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                        let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br>":""
                        return a+b
                        }
                    }],
                "blank",
                function () {if (player.tab == "e") return "challenges"},
            ],
            unlocked() {return hasMilestone("e",3)}
        },
        "Quarantine": {
            content: [
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Quarantine") return "main-display"},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Quarantine") return "prestige-button"},
                "blank",
                ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "Quarantine") {
                        let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                        let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br><br>":""
                        let c = "You have " + layerText("h2", "e", formatWhole(player.e.infections)) +  ' infected infections ('+layerText("h2", "e", formatWhole(player.e.in))+" total)<br>"
                        let d = "You are gaining " + layerText("h2", "e", format(upgradeEffect("e",46))) +  ' infected infections per second.<br><br>'
                        let e = "You have " + layerText("h2", "e", formatWhole(player.e.qt)) + " Unquarantined Infections, which produce " + layerText("h2", "e", format(tmp.e.ucGain)) + " Unquarantined Cases per second<br>"
                        let f = "You have " + layerText("h2", "e", formatWhole(player.e.qc)) + " Unquarantined Cases<br>"
                        return a+b+c+d+e+f
                        }
                    }],
                "blank",
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Quarantine" && (!hasUpgrade("e",162)) || !hasAchievement("a",83)) return ["clickable",11]},
                "blank",
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Quarantine") return ["row",[["buyable",51],["buyable",52],["buyable",53]]]},
                function () {if (player.tab == "e" && hasUpgrade("e",106) && player.subtabs.e.mainTabs == "Quarantine") return ["row",[["buyable",61],["buyable",62],["buyable",63]]]},
                "blank",
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "Quarantine") return ["upgrades",[8,9,10,16,17,18]]},
            ],
            unlocked() {return hasUpgrade("e",46)}
        },
        "RNA": {
            content: [
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA") return "main-display"},
                function () {if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA") return "prestige-button"},
                "blank",
                ["raw-html", 
                    function () {
                        if (player.tab == "e" && player.subtabs.e.mainTabs == "RNA") {
                        let a = "You have " + layerText("h2", "e", format(player.e.p)) +  ' infection power, which boosts cases gain by ^' + layerText("h2", "e", format(tmp.e.peffect)) + ", and  makes 'Cases Boost' softcap start +" + layerText("h2", "e", formatWhole(tmp.e.peffect2)) + " later.<br>"
                        let b = player.points.gte(Decimal.pow(10,Decimal.pow(10,498).mul(3)))? "You have " + layerText("h2", "e", format(player.e.i)) +  ' immunity, which makes cases gain (hardcapped) at ' + layerText("h2", "e", format(tmp.e.icap))+"<br>":""
                        let c = "You have " + layerText("h2", "e", formatWhole(player.e.rna)) +  ' RNA, which boosts II gain by ' + layerText("h2", "e", format(tmp.e.reff)) + ", and DNA by ^" + layerText("h2", "e", format(tmp.e.reff2))+"<br>"
                        let d = "You are gaining " + layerText("h2", "e", format(tmp.e.rgain)) +  ' RNA per second (starts at e664,400,000,000 IP).'
                        return a+b+c+d
                        }
                    }],
                "blank",
                ["microtabs", "stuff"],
            ],
            unlocked() {return hasUpgrade("e",196)}
        },
    },
    clickables: {
        getAttemptAmount(force = false){
            let ret = new Decimal(1)
            if (!shiftDown && !force) return ret
            if (hasUpgrade("e",324)) ret = ret.times(10)
            if (hasUpgrade("e",332)) ret = ret.times(100)
            if (hasUpgrade("e",336)) ret = ret.times(10)
            if (hasUpgrade("e",361)) ret = ret.times(1e4)
            if (hasUpgrade("e",382)) ret = ret.times(1e12)
            if (hasUpgrade("e",413)) ret = ret.times(tmp.e.creff)
            if (hasUpgrade("e",363)) ret = ret.times(upgradeEffect("e",363))
            if (hasUpgrade("e",383)) ret = ret.times(tmp.e.upgrades[383].effect2)
            if (hasMilestone("e",9)) ret = ret.times(10)
            return ret 
    },
    getChargeComsumption(){
        let mu = player.e.mu2
        if (mu.gte(10)) mu = mu.div(10).pow(mu.div(10).add(0.3)).mul(10)
        if (mu.gte(9)) mu = mu.div(9).pow(1.7).mul(9)
        if (mu.gte(7)) mu = mu.div(7).pow(1.25).mul(7)
        if (mu.gte(2)) mu = mu.div(2).pow(1.5).mul(2)
        if (hasUpgrade("e",423)) mu = mu.root(upgradeEffect("e",423))
        let ret = Decimal.pow(1e9,mu.pow(1.5))
        return ret.floor()
    }, 
    chance() {
        let m = player.e.mu2
        let x = player.e.mu.sub(m.mul(m.add(1)).div(2).add(m.mul(4)).mul(10))
        let exp = m.sub(6).pow(2).div(10).add(1.5)
        if (hasUpgrade("e",413)) exp = exp.root(upgradeEffect("e",413))
        if (hasUpgrade("e",422)) exp = exp.root(upgradeEffect("e",422))
        if (hasUpgrade("e",415)) exp = exp.root(2)
        if (hasUpgrade("e",421)) exp = exp.root(3)
        if (x.gte(100) && m.gte(7)) x = x.div(100).pow(exp).mul(100)
        if (x.gte(50) && m.gte(6)) x = x.div(50).pow(m.sub(5).pow(1.75).div(10).add(1.5)).mul(50)
        if (m.gte(7)) m = m.div(7).pow(1.75).mul(7)
        if (m.gte(4)) m = m.div(4).pow(1.75).mul(4)
        if (m.gte(2)) x = x.add(m.mul(23))
        if (hasUpgrade("e",356)) x = x.div(1.1)
        if (hasUpgrade("e",392)) x = x.div(1.075)
        if (hasUpgrade("e",396)) x = x.div(1.05)
        if (hasUpgrade("e",372)) x = x.div(1.05)
        if (hasUpgrade("e",386)) x = x.div(1.025)
        if (hasUpgrade("e",361)) x = x.div(upgradeEffect("e",361))
        if (hasUpgrade("e",362)) x = x.div(upgradeEffect("e",362))
        if (hasUpgrade("e",364)) x = x.div(upgradeEffect("e",364))
        if (hasUpgrade("e",373)) x = x.div(upgradeEffect("e",373))
        if (hasUpgrade("e",383)) x = x.div(upgradeEffect("e",383))
        if (hasUpgrade("e",381)) x = x.div(tmp.e.buyables[103].effect.pow(0.15))
        if (x.gte(30)) x = x.div(30).pow(3).mul(30)
        if (x.gte(5) && m.gte(1)) x = x.div(5).pow(1.7).mul(5)
        if (player.e.mu2.gte(9)) x = x.pow(player.e.mu2.div(35).add(1))
        if (hasUpgrade("e",412)) x = x.pow(0.75)
        if (hasUpgrade("e",422)) x = x.pow(0.8)
        let scale = Decimal.pow(0.82,m.pow(2).add(1))
        let c = Decimal.pow(scale,x).div(Decimal.pow(1e5,m))
        if (hasUpgrade("e",334)) c = c.mul(upgradeEffect("e",334))
        if (hasUpgrade("e",363)) c = c.mul(upgradeEffect("e",363))
        return c.mul(tmp.e.buyables[105].effect).min(1)
    },
    chance2() {
        let x = player.e.mu2
        if (x.gte(6)) x = x.div(6).pow(2.5).mul(6)
        if (hasUpgrade("e",393)) x = x.div(1.2)
        if (hasUpgrade("e",404)) x = x.div(1.1)
        if (hasUpgrade("e",401)) x = x.div(upgradeEffect("e",401))
        let c = Decimal.pow(0.1,x.pow(1.5))
        return c.min(1)
    },
        rows: 3,
        cols: 5,
        11: {
            display() {
                let dis = "'Boostless' and 'Logarithm' are applied. Cases gain exponent is ^" + format(tmp.e.qExp) + "."
                if (player.e.inC) dis += "(IN)"
                dis += "<br>Get 1e920,000 cases per second<br>" 
                if (player.e.inC) dis += "+<h3>" + formatWhole(tmp.e.clickables[11].gain)+"</h3> Unquarantined Infections<br>"
                if (tmp.e.clickables[11].gain.lt(1e6)) dis += "Next at " + formatWhole(tmp.e.clickables[11].next)
                return dis
            },
            g() {
                let gain = getPointGen().max(1).log10().div(920000).pow(tmp.e.clickables[11].exp).mul(100).mul(tmp.e.uiMult).max(0)
                if (getPointGen().max(1).log10().lt(920000)) gain = new Decimal(0)
                return gain.floor()
            },
            gain() {
                let gain = getPointGen().max(1).log10().div(920000).pow(tmp.e.clickables[11].exp).mul(100).mul(tmp.e.uiMult).sub(player.e.qt).max(0)
                if (getPointGen().max(1).log10().lt(920000)) gain = new Decimal(0)
                return gain.floor()
            },
            exp() {
                let exp = new Decimal(2)
                if (hasUpgrade("e",92)) exp = exp.add(upgradeEffect("e",92))
                if (hasUpgrade("e",94)) exp = exp.add(upgradeEffect("e",94))
                exp = exp.add(tmp.e.buyables[61].effect)
                return exp
            },
            next() {
                let gain = tmp.e.clickables[11].g
                let next = gain.max(player.e.qt).add(1).max(1)
                next = next.div(tmp.e.uiMult).div(100).root(tmp.e.clickables[11].exp).mul(920000).max(920000).pow10()
                return next
            },
            canClick() {return true},
            onClick() {
                if (player.e.inC) player.e.qt = player.e.qt.add(tmp.e.clickables[11].gain).max(player.e.qt)
                player.e.inC = player.e.inC ? false : true
                if (player.e.inC) startIChallenge(11)
            },
            style: {'height':'160px', 'width':'215px', 'font-size':'13px', 'background-color': "#006633"
            }
        },
        12: {
            display() {
                let d = ["1%","10%","50%","100%"]
                let dis = d[player.e.m % 4]
                return dis
            },
            canClick() {return true},
            onClick() {
                player.e.m ++
            },
            style: {'height':'70px', 'width':'70px', 'font-size':'13px', 'background-color': "#0066cc"
            }
        },
        21: {
            title: "<h3>Adenine</h3><br><span style='color:#00A000;font-size:20px'>C5</span><span style='color:#A00000;font-size:20px'>H5</span><span style='color:#00A0A0;font-size:20px'>N5</span><br>",
            display() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(5).min(player.e.c.div(5)).min(player.e.n.div(5)).mul(m[player.e.m % 4]).floor()
                let dis = "<span style = 'font-size:13px'>Purchase Adenine (" + formatWhole(a) + ")</span>"
                return dis
            },
            canClick() {return player.e.h.gte(5) && player.e.c.gte(5) && player.e.n.gte(5)},
            onClick() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(5).min(player.e.c.div(5)).min(player.e.n.div(5)).mul(m[player.e.m % 4]).floor()
                player.e.h = player.e.h.sub(a.mul(5)).max(0)
                player.e.c = player.e.c.sub(a.mul(5)).max(0)
                player.e.n = player.e.n.sub(a.mul(5)).max(0)
                player.e.ad = player.e.ad.add(a)
            },
            style: {"width":"150px","height":"150px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[21].canClick) color = "#0066cc"
                return color
            }
        }
        },
        22: {
            title: "<h3>Uracil</h3><br><span style='color:#00A000;font-size:20px'>C4</span><span style='color:#A00000;font-size:20px'>H4</span><span style='color:#00A0A0;font-size:20px'>N2</span></span><span style='color:#0000A0;font-size:20px'>O2</span><br>",
            display() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(4).min(player.e.c.div(4)).min(player.e.n.div(2)).min(player.e.o.div(2)).mul(m[player.e.m % 4]).floor()
                let dis = "<span style = 'font-size:13px'>Purchase Uracil (" + formatWhole(a) + ")</span>"
                return dis
            },
            canClick() {return player.e.h.gte(4) && player.e.c.gte(4) && player.e.n.gte(2) && player.e.o.gte(2)},
            onClick() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(4).min(player.e.c.div(4)).min(player.e.n.div(2)).min(player.e.o.div(2)).mul(m[player.e.m % 4]).floor()
                player.e.h = player.e.h.sub(a.mul(4)).max(0)
                player.e.c = player.e.c.sub(a.mul(4)).max(0)
                player.e.n = player.e.n.sub(a.mul(2)).max(0)
                player.e.o = player.e.o.sub(a.mul(2)).max(0)
                player.e.ur = player.e.ur.add(a)
            },
            style: {"width":"150px","height":"150px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[22].canClick) color = "#0066cc"
                return color
            }
        }
        },
        23: {
            title: "<h3>Cytosine</h3><br><span style='color:#00A000;font-size:20px'>C4</span><span style='color:#A00000;font-size:20px'>H5</span><span style='color:#00A0A0;font-size:20px'>N3</span></span><span style='color:#0000A0;font-size:20px'>O</span><br>",
            display() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(5).min(player.e.c.div(4)).min(player.e.n.div(3)).min(player.e.o).mul(m[player.e.m % 4]).floor()
                let dis = "<span style = 'font-size:13px'>Purchase Cytosine (" + formatWhole(a) + ")</span>"
                return dis
            },
            canClick() {return player.e.h.gte(5) && player.e.c.gte(3) && player.e.n.gte(3) && player.e.o.gte(1)},
            onClick() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(5).min(player.e.c.div(4)).min(player.e.n.div(3)).min(player.e.o).mul(m[player.e.m % 4]).floor()
                player.e.h = player.e.h.sub(a.mul(5)).max(0)
                player.e.c = player.e.c.sub(a.mul(4)).max(0)
                player.e.n = player.e.n.sub(a.mul(3)).max(0)
                player.e.o = player.e.o.sub(a).max(0)
                player.e.cy = player.e.cy.add(a)
            },
            unlocked() {return hasUpgrade("e",244)},
            style: {"width":"150px","height":"150px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[23].canClick) color = "#0066cc"
                return color
            }
        }
        },
        24: {
            title: "<h3>Guanine</h3><br><span style='color:#00A000;font-size:20px'>C5</span><span style='color:#A00000;font-size:20px'>H5</span><span style='color:#00A0A0;font-size:20px'>N5</span></span><span style='color:#0000A0;font-size:20px'>O</span><br>",
            display() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(5).min(player.e.c.div(5)).min(player.e.n.div(5)).min(player.e.o).mul(m[player.e.m % 4]).floor()
                let dis = "<span style = 'font-size:13px'>Purchase Guanine (" + formatWhole(a) + ")</span>"
                return dis
            },
            canClick() {return player.e.h.gte(5) && player.e.c.gte(5) && player.e.n.gte(5) && player.e.o.gte(1)},
            onClick() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(5).min(player.e.c.div(5)).min(player.e.n.div(5)).min(player.e.o).mul(m[player.e.m % 4]).floor()
                player.e.h = player.e.h.sub(a.mul(5)).max(0)
                player.e.c = player.e.c.sub(a.mul(5)).max(0)
                player.e.n = player.e.n.sub(a.mul(5)).max(0)
                player.e.o = player.e.o.sub(a).max(0)
                player.e.gu = player.e.gu.add(a)
            },
            unlocked() {return hasUpgrade("e",244)},
            style: {"width":"150px","height":"150px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[24].canClick) color = "#0066cc"
                return color
            }
        }
        },
        25: {
            title: "<h3>Ribose-Phosphate</h3><br><span style='color:#00A000;font-size:20px'>C5</span><span style='color:#A00000;font-size:20px'>H11</span><span style='color:#0000A0;font-size:20px'>O8</span></span><span style='color:#BB5500;font-size:20px'>P</span><br>",
            display() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(11).min(player.e.c.div(5)).min(player.e.o.div(8)).min(player.e.ph).mul(m[player.e.m % 4]).floor()
                let dis = "<span style = 'font-size:13px'>Purchase Ribose-Phosphate (" + formatWhole(a) + ")</span>"
                return dis
            },
            canClick() {return player.e.h.gte(11) && player.e.c.gte(5) && player.e.o.gte(8) && player.e.ph.gte(1)},
            onClick() {
                let m = [0.01,0.1,0.5,1]
                let a = player.e.h.div(11).min(player.e.c.div(5)).min(player.e.o.div(8)).min(player.e.ph).mul(m[player.e.m % 4]).floor()
                player.e.h = player.e.h.sub(a.mul(11)).max(0)
                player.e.c = player.e.c.sub(a.mul(5)).max(0)
                player.e.o = player.e.o.sub(a.mul(8)).max(0)
                player.e.ph = player.e.ph.sub(a).max(0)
                player.e.rp = player.e.rp.add(a)
            },
            unlocked() {return hasUpgrade("e",256)},
            style: {"width":"150px","height":"150px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[25].canClick) color = "#0066cc"
                return color
            }
        }
        },
        31: {
            title: "Mutation",
            display() {
                let m = player.e.mu2
                let num = player.e.mu.div(10).sub(m.mul(m.add(1)).div(2).add(m.mul(4)))
                let dis = "Virus Number:"+format((num),1) +"<br>Cost:"+ formatWhole(tmp.e.clickables[31].cost)
                dis += " mRNA<br>"+formatWhole(tmp.e.clickables.getChargeComsumption)+" MMNA<br>Chance: "+ format(tmp.e.clickables.chance.mul(100))+"%"
                return dis
            },
            cost() {
                let x = player.e.mu
                let m = player.e.mu2
                if (x.gte(1240)) x = x.div(1240).pow(m.div(20).add(0.75)).mul(1240)
                if (m.gte(9)) m = m.div(9).pow(1.5).mul(1.9)
                if (x.gte(810)) x = x.div(810).pow(1.5).mul(810)
                if (x.gte(560)) x = x.div(560).pow(1.5).mul(560)
                if (x.gte(450)) x = x.div(450).pow(2).mul(450)
                if (x.gte(350)) x = x.div(350).pow(2).mul(350)
                if (x.gte(115)) x = x.div(115).pow(3).mul(115)
                x = x.add(m.pow(2.75).mul(2)).div(tmp.e.buyables[103].effect)
                if (hasUpgrade("e",322)) x = x.mul(0.85)
                if (hasUpgrade("e",324)) x = x.div(tmp.e.upgrades[324].effect)
                if (hasUpgrade("e",333)) x = x.div(tmp.e.upgrades[333].effect.pow(0.07))
                if (hasUpgrade("e",373)) x = x.div(upgradeEffect("e",373).pow(2))
                if (hasUpgrade("e",383)) x = x.div(upgradeEffect("e",383).pow(1.65))
                if (hasUpgrade("e",386)) x = x.div(1.5)
                let cost = Decimal.pow(1e55,Decimal.pow(1.23,x.mul(m.sub(8).max(1)))).mul(Decimal.pow(10,1012)).mul(5)
                return cost
            },
            canClick() {
                let m = player.e.mu2
                let num = player.e.mu.div(10).sub(m.mul(m.add(1)).div(2).add(m.mul(4)))
                return player.e.mrna.gte(tmp.e.clickables[31].cost) && player.e.mm.gte(tmp.e.clickables.getChargeComsumption) && num.lt(m.add(5))
            },
            onClick(force = false){
                let b = 0
                let remaining = layers.e.clickables.getAttemptAmount(force)
                let data = player.e
                let id = 31
                        while (b < 1000){
                                b ++ 
                                if (!this.canClick()) break 
                                let chance = layers.e.clickables.chance(data.clickableAmounts[id])
                                let cc = tmp.e.clickables.getChargeComsumption
                                let cost = this.cost()

                                let times = getTimesRequired(chance)
                                // the random chance factor
                                let maxMMNA = data.mm.div(cc).floor()
                                // max num at current MMNA
                                let maxMu = data.mrna.div(cost).floor()
                                //max num at current mu

                                let target = Decimal.min(times, maxMMNA).min(maxMu).min(remaining)
                                //max num overall
                                
                                remaining = remaining.minus(target) //how many bulks left
                                data.mrna = data.mrna.sub(cost.times(target)).max(0)
                                data.mm = data.mm.minus(cc.times(target)).max(0)
                                //remove MMNA

                                if (target != times) break
                                //didnt do it enough times
                                
                                //if did do enough, add one
                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                data.mu = data.mu.plus(1)
                        } 
            },
            unlocked() {return hasUpgrade("e",316)},
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[31].canClick) color = "#00AA55"
                return color
            }
        }
        },
        32: {
            title: "Corona Mutations",
            display() {
                let m = player.e.mu2
                let virus = player.e.virus[m]
                let sub = m.mul(m.add(1)).div(2).add(m.mul(4))
                let num = player.e.mu.div(10).sub(sub)
                let dis = "Virus Name:"+virus+"-" +format((num),1) +"<br>Cost:"+ formatWhole(tmp.e.clickables[32].cost)
                dis += " mRNA<br>"+formatWhole(m.add(5))+" Virus Number<br>"+formatWhole(tmp.e.clickables[32].MMcost)+" MMNA<br>Chance: "+ format(tmp.e.clickables.chance2.mul(100))+"%"
                return dis
            },
            cost() {
                let x = player.e.mu2
                if (hasUpgrade("e",393)) x = x.div(1.2)
                if (hasUpgrade("e",404)) x = x.div(1.1)
                if (hasUpgrade("e",405)) x = x.div(1.05)
                if (hasUpgrade("e",406)) x = x.div(1.05)
                if (hasUpgrade("e",422)) x = x.div(1.05)
                if (hasUpgrade("e",401)) x = x.div(upgradeEffect("e",401))
                let cost = Decimal.pow(1e100,Decimal.pow(15.95,x).mul(100)).mul(Decimal.pow(10,-394))
                return cost
            },
            MMcost () {
                let m = player.e.mu2
                if (m.gte(9)) m = m.div(9).pow(m.div(5).add(0.2)).mul(9)
                if (m.gte(7)) m = m.div(7).pow(1.6).mul(7)
                let div = new Decimal(1)
                if (hasUpgrade("e",393)) div = div.mul(1.2)
                if (hasUpgrade("e",404)) div = div.mul(1.1)
                if (hasUpgrade("e",422)) div = div.mul(1.2)
                if (hasUpgrade("e",401)) div = div.mul(upgradeEffect("e",401))
                if (hasUpgrade("e",423)) m = m.root(upgradeEffect("e",423))
                let cost = Decimal.pow(1e6,m.div(div).pow(2.2).add(1))
                return cost.mul(tmp.e.clickables.getChargeComsumption.root(div))
            },
            canClick() {
                let m = player.e.mu2
                let sub = m.mul(m.add(1)).div(2).add(m.mul(4))
                let num = player.e.mu.div(10).sub(sub)
                return player.e.mrna.gte(tmp.e.clickables[32].cost) && player.e.mm.gte(tmp.e.clickables[32].MMcost) && num.gte(m.add(5))
            },
            onClick(force = false){
                let b = 0
                let remaining = layers.e.clickables.getAttemptAmount(force)
                let data = player.e
                let id = 32
                        while (b < 1000){
                                b ++ 
                                if (!this.canClick()) break 
                                let chance = layers.e.clickables.chance2(data.clickableAmounts[id])
                                let cc = tmp.e.clickables[32].MMcost
                                let cost = this.cost()

                                let times = getTimesRequired(chance)
                                // the random chance factor
                                let maxMMNA = data.mm.div(cc).floor()
                                // max num at current MMNA
                                let maxMu = data.mrna.div(cost).floor()
                                //max num at current mu

                                let target = Decimal.min(times, maxMMNA).min(maxMu).min(remaining)
                                //max num overall
                                
                                remaining = remaining.minus(target) //how many bulks left
                                data.mrna = data.mrna.sub(cost.times(target)).max(0)
                                data.mm = data.mm.minus(cc.times(target)).max(0)
                                //remove MMNA

                                if (target != times) break
                                //didnt do it enough times
                                
                                //if did do enough, add one
                                data.clickableAmounts[id] = data.clickableAmounts[id].plus(1)
                                data.mu2 = data.mu2.plus(1)
                        } 
            },
            unlocked() {return hasUpgrade("e",336)},
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.clickables[32].canClick) color = "#00AA55"
                return color
            }
        }
        },
    },
    buyables: {
        respec() {
            player.e.upgg = player.e.upgg.filter(number => number<50 || number>80)
            player.e.upgrades = player.e.upgg
            player.e.spent = new Decimal(0)
            player.e.p = new Decimal(10)
            player.e.path = hasUpgrade("e",145) ? 3 : hasUpgrade("e",131) ? 2 : 1
            startCChallenge(0)
            doReset(this.layer, true)
		},
        respecText:() => "Respec Infections",
		rows: 10,
        cols: 5,
        11: {
			title: "Power Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(5, x.pow(1.4)).mul(4e14)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(4)
                if (hasUpgrade("e",51)) base = base.add(1).max(1)
                if (hasUpgrade("e",62)) base = base.add(upgradeEffect("e",62))
                if (hasUpgrade("e",65)) base = base.add(upgradeEffect("e",65))
                if (hasUpgrade("e",72)) base = base.add(upgradeEffect("e",72))
                base = base.add(tmp.e.buyables[21].effect)
                if (hasUpgrade("e",75)) base = base.mul(upgradeEffect("e",75))
                return base
            },
            extra() {
                let x = tmp.e.buyables[12].total.add(tmp.e.buyables[13].total)
                return x
            },
            total() {
                let total = getBuyableAmount("e", 11).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let dis = "Multiply infection power gain by "+format(this.base())
                if (player.e.buyables[11].gte(tmp.e.buyCap)) dis += " (MAXED)"
                if (player.e.buyables[12].gte(1)) extra = "+"+formatWhole(tmp[this.layer].buyables[this.id].extra)
                return dis + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 11)) + extra
            },
            unlocked() { return hasMilestone("e", 0) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[11].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3)) player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.p
                let target = Decimal.log10(s.div(4e14)).div(Decimal.log10(5)).root(1.4)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(5, target.sub(1).pow(1.4)).mul(4e14)
                let diff = target.sub(player.e.buyables[11])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[11] = player.e.buyables[11].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        12: {
			title: "Infecter Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(100, x.pow(1.4)).mul(1e16)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.4)
                if (hasUpgrade("e",63)) base = base.add(0.05)
                if (hasUpgrade("e",114)) base = base.add(0.05)
                base = base.add(tmp.e.buyables[22].effect)
                return base
            },
            extra() {
                let x = tmp.e.buyables[13].total
                return x
            },
            total() {
                let total = getBuyableAmount("e", 12).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let dis = "Multiply infecter base by "+format(this.base())
                if (player.e.buyables[12].gte(tmp.e.buyCap)) dis += " (MAXED)"
                if (player.e.buyables[13].gte(1)) extra = "+"+formatWhole(tmp[this.layer].buyables[this.id].extra)
                return dis + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 12)) + extra
            },
            unlocked() { return hasMilestone("e", 0) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[12].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.p
                let target = Decimal.log10(s.div(1e16)).div(Decimal.log10(100)).root(1.4)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(100, target.sub(1).pow(1.4)).mul(1e16)
                let diff = target.sub(player.e.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[12] = player.e.buyables[12].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        13: {
			title: "Immunity Divider",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x.pow(1.49)).mul(1e24)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.05)
                if (hasUpgrade("e",53)) base = base.add(0.01)
                if (hasUpgrade("e",136)) base = base.add(upgradeEffect("e",136))
                base = base.add(tmp.e.buyables[23].effect)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 13)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                if (x.gte(10)) x = x.div(10).pow(0.5).mul(10)
                if (x.gte(900)) x = Decimal.pow(10,x.div(900).log10().add(1).max(1).pow(0.3)).mul(90)
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let disp = "Divide immunity by "+format(this.base())
                if (player.e.buyables[13].gte(tmp.e.buyCap)) disp += " (MAXED)"
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                if (this.total().gte(10)) dis += " (softcapped)"
                return disp +".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: /" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 13)) + extra
            },
            unlocked() { return hasMilestone("e", 0) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[13].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.p
                let target = Decimal.log10(s.div(1e24)).div(Decimal.log10(1e5)).root(1.49)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(1e5, target.sub(1).pow(1.49)).mul(1e24)
                let diff = target.sub(player.e.buyables[13])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[13] = player.e.buyables[13].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        21: {
			title: "Power Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e50, x.pow(1.45)).mul("3e48054")
                return cost.floor()
            },
            base() { 
                let base = new Decimal(5)
                if (hasUpgrade("e",41)) base = base.add(upgradeEffect("e",41))
                if (hasUpgrade("e",226)) base = base.mul(upgradeEffect("e",226))
                if (hasUpgrade("e",231)) base = base.mul(upgradeEffect("e",231))
                return base
            },
            extra() {
                let x = tmp.e.buyables[22].total.add(tmp.e.buyables[23].total)
                return x
            },
            total() {
                let total = getBuyableAmount("e", 21).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let disp = "Increase 'Power Gain' base by "+format(this.base())
                if (player.e.buyables[21].gte(tmp.e.buyCap)) disp += " (MAXED)"
                if (player.e.buyables[22].gte(1)) extra = "+"+formatWhole(tmp[this.layer].buyables[this.id].extra)
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return disp +".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: +" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 21)) + extra
            },
            unlocked() { return hasUpgrade("e", 146) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[21].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.p
                let target = Decimal.log10(s.div("3e48054")).div(Decimal.log10(1e50)).root(1.45)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(1e50, target.sub(1).pow(1.45)).mul("3e48054")
                let diff = target.sub(player.e.buyables[21])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[21] = player.e.buyables[21].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        22: {
			title: "Infecter Base^2",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e120, x.pow(1.45)).mul("e55618")
                return cost.floor()
            },
            base() { 
                let base = new Decimal(0.002)
                if (hasUpgrade("e",226)) base = base.mul(upgradeEffect("e",226))
                if (hasUpgrade("e",231)) base = base.mul(upgradeEffect("e",231))
                return base
            },
            extra() {
                let x = tmp.e.buyables[23].total
                return x
            },
            total() {
                let total = getBuyableAmount("e", 22).add(tmp[this.layer].buyables[this.id].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let disp = "Increase 'Infecter Base' base by "+format(this.base())
                if (player.e.buyables[22].gte(tmp.e.buyCap)) disp += " (MAXED)"
                if (player.e.buyables[23].gte(1)) extra = "+"+formatWhole(tmp[this.layer].buyables[this.id].extra)
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return disp+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: +" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 22)) + extra
            },
            unlocked() { return hasUpgrade("e", 146) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[22].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.p
                let target = Decimal.log10(s.div("e55618")).div(Decimal.log10(1e120)).root(1.45)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(1e120, target.sub(1).pow(1.45)).mul("e55618")
                let diff = target.sub(player.e.buyables[22])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3))player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[22] = player.e.buyables[22].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        23: {
			title: "Immunity Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e250, x.pow(1.53)).mul("1.337e74304")
                return cost.floor()
            },
            base() { 
                let base = new Decimal(0.0005)
                if (hasUpgrade("e",226)) base = base.mul(upgradeEffect("e",226))
                if (hasUpgrade("e",231)) base = base.mul(upgradeEffect("e",231))
                return base
            },
            total() {
                let total = getBuyableAmount("e", 23)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let disp = "Increase 'Immunity Divider' base by "+format(this.base())
                if (player.e.buyables[23].gte(tmp.e.buyCap)) disp += " (MAXED)"
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return disp+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: +" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 23)) + extra
            },
            unlocked() { return hasUpgrade("e", 146) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[23].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3)) player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.p
                let target = Decimal.log10(s.div("1.337e74304")).div(Decimal.log10("1e250")).root(1.53)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(1e250, target.sub(1).pow(1.53)).mul("1.337e74304")
                let diff = target.sub(player.e.buyables[23])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[23] = player.e.buyables[23].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        31: {
			title: "Max Buyable",
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(3e3)) x = x.div(3e3).pow(3).mul(3e3)
                x = x.div(tmp.e.buyables[31].div)
                if (x.gte(6)) x = x.div(6).pow(4).mul(6)
                let b = Decimal.sub(3.1,hasUpgrade("e",246)*0.5+hasUpgrade("e",255)+hasUpgrade("e",296)*0.35)
                let cost = Decimal.pow(10,Decimal.pow(b,x).mul(1e9)).mul(Decimal.pow(10,10786e7))
                return cost.floor()
            },// logb(log10(c/e)/1e9) = x
            base() { 
                let base = player.e.qc.add(10).max(10).log10().pow(0.09).div(3).max(1)
                if (base.gte(1.35)) base = base.div(1.35).pow(0.2).mul(1.35)
                return base.add(tmp.e.Neffect)
            },
            div() {
                let div = new Decimal(1)
                if (hasUpgrade("e",345)) div = div.mul(upgradeEffect("e",345))
                if (hasUpgrade("e",373)) div = div.mul(upgradeEffect("e",373))
                return div
            },
            total() {
                let total = getBuyableAmount("e", 31)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x.pow(tmp.e.buyables[31].exp));
            },
            exp () {
                let exp = new Decimal(1.5)
                if (hasUpgrade("e",346)) exp = exp.add(tmp.e.mueff.e5)
                return exp
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Buyables") return
                let extra = ""
                let disp = "Multiply max buyable level by "+format(this.base())+"^x^"+format(tmp.e.buyables[31].exp)+" (based on UC)"
                if (player.e.buyables[31].gte(tmp.e.buyCap)) disp += " (MAXED)"
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return disp+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infection power\n\
                Effect: " + dis +"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 31)) + extra
            },
            unlocked() { return hasUpgrade("e", 194) }, 
            canAfford() {
                    return player.e.p.gte(tmp[this.layer].buyables[this.id].cost) && player.e.buyables[31].lt(tmp.e.buyCap)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",3)) player.e.p = player.e.p.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() { // logb(log10(c/e)/1e9) = x
                let s = player.e.p
                let b = Decimal.sub(3.1,hasUpgrade("e",246)*0.5+hasUpgrade("e",255)+hasUpgrade("e",296)*0.35)
                let target = s.div(Decimal.pow(10,10786e7)).log10().div(1e9).log(b)
                if (target.gte(6)) target = target.div(6).pow(0.25).mul(6)
                target = target.mul(tmp.e.buyables[31].div)
                if (target.gte(3e3)) target = target.div(3e3).pow(1/3).mul(3e3)
                target = target.ceil().min(tmp.e.buyCap)
                let cost = Decimal.pow(1e250, target.sub(1).pow(1.53)).mul(Decimal.pow(10,10786e7))
                let diff = target.sub(player.e.buyables[31])
                if (this.canAfford()) {
                    if (!hasMilestone("e",3)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[31] = player.e.buyables[31].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        41: {
			title: "Disease Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(600)) x = x.div(600).pow(5).mul(600)
                if (x.gte(30)) x = x.div(30).pow(2).mul(30)
                let cost = Decimal.pow(2, Decimal.pow(1.5, x)).mul(5)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.25)
                if (hasUpgrade("e",115)) base = base.add(0.025)
                if (hasUpgrade("e",134)) base = base.add(upgradeEffect("e",134))
                if (hasUpgrade("e",166)) base = base.add(upgradeEffect("e",166))
                base = base.mul(tmp.e.buyables[42].effect).pow(tmp.e.buyables[42].effect)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 41)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.pow(x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Diseases") return
                let extra = ""
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Multiply and raise base disease gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infectious diseases\n\
                Effect: " + dis + "x, ^" + dis+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 41)) + extra
            },
            unlocked() { return hasMilestone("e", 2) }, 
            canAfford() {
                    return player.e.diseases.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",7)) player.e.diseases = player.e.diseases.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.diseases//log1.5(log2(c/5))=x
                let target = s.div(5).log(2).log(1.5)
                if (target.gte(30)) target = target.div(30).pow(0.5).mul(30)
                if (target.gte(600)) target = target.div(600).pow(0.2).mul(600)
                target = target.ceil()
                let cost = Decimal.pow(2, Decimal.pow(1.5, target.sub(1))).mul(5)
                let diff = target.sub(player.e.buyables[41])
                if (this.canAfford()) {
                    if (!hasMilestone("e",7)) player.e.diseases = player.e.diseases.sub(cost).max(0)
                    player.e.buyables[41] = player.e.buyables[41].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        42: {
			title: "Disease Boost",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(1.5e4)) x = x.div(1.5e4).pow(4).mul(1.5e4)
                let cost = Decimal.pow(2, Decimal.pow(2, Decimal.pow(tmp.e.buyables[42].scale, x.add(12)))).mul(Decimal.pow(10,36974))
                return cost.floor()
            },
            scale() {
                let s = new Decimal(1.2)
                if (hasUpgrade("e",185)) s = s.root(upgradeEffect("e",185))
                return s
            },
            base() { 
                let base = new Decimal(1.002)
                if (hasUpgrade("e",45)) base = base.add(0.005)
                if (hasUpgrade("e",105)) base = base.add(0.003)
                if (hasUpgrade("e",236)) base = base.add(0.002)
                if (hasUpgrade("e",293)) base = base.add(0.003)
                if (hasUpgrade("e",314)) base = base.add(0.005)
                if (hasUpgrade("e",382)) base = base.add(0.005)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 42)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.pow(x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Diseases") return
                let extra = ""
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Multiply and raise 'Disease Gain' base by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" infectious diseases\n\
                Effect: " + dis + "x, ^" + dis+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 42)) + extra
            },
            unlocked() { return hasUpgrade("e",152) }, 
            canAfford() {
                    return player.e.diseases.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",7)) player.e.diseases = player.e.diseases.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.diseases
                let target = s.div(Decimal.pow(10,36974)).log(2).log(2).log(tmp.e.buyables[42].scale).sub(12)
                if (target.gte(1.5e4)) target = target.div(1.5e4).pow(0.25).mul(1.5e4)
                target = target.ceil()
                let cost = Decimal.pow(2, Decimal.pow(1.5, target.sub(1))).mul(5)
                let diff = target.sub(player.e.buyables[42])
                if (this.canAfford()) {
                    if (!hasMilestone("e",7)) player.e.diseases = player.e.diseases.sub(cost).max(0)
                    player.e.buyables[42] = player.e.buyables[42].add(diff)
                }
            },
            style: {"width":"150px","height":"150px"}
        },
        51: {
			title: "UC Gain",
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(600)) x = x.div(600).pow(1.5).mul(600)
                let cost = Decimal.pow(15, x).mul(300)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(2.5)
                if (hasUpgrade("e",161)) base = base.add(upgradeEffect("e",161))
                if (hasUpgrade("e",182)) base = base.add(upgradeEffect("e",182))
                if (hasUpgrade("e",192)) base = base.add(upgradeEffect("e",192))
                return base
            },
            total() {
                let total = getBuyableAmount("e", 51)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.pow(x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Quarantine") return
                let extra = ""
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Multiply UC gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" Unquarantined Cases\n\
                Multiplier: " + dis + "x"+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 51)) + extra
            },
            unlocked() { return hasUpgrade("e",46) }, 
            canAfford() {
                    return player.e.qc.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.qc = player.e.qc.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.qc
                let target = Decimal.log10(s.div(300)).div(Decimal.log10(15))
                if (target.gte(600)) target = target.div(600).root(1.5).mul(600)
                target = target.ceil()
                let cost = Decimal.pow(15, target.sub(1)).mul(300)
                let diff = target.sub(player.e.buyables[51])
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[51] = player.e.buyables[51].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[51].canAfford) color = "#006633"
                return color
            }
        }
        },
        52: {
			title: "UI Gain",
            cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let x = player[this.layer].buyables[this.id]
                if (x.gte(15)) x = x.div(15).pow(1.5).mul(15)
                if (x.gte(12e4)) x = x.div(12e4).pow(2).mul(12e4)
                let cost = Decimal.pow(50, x).mul(5e4)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(4)
                if (hasUpgrade("e",165)) base = base.add(upgradeEffect("e",165))
                return base
            },
            total() {
                let total = getBuyableAmount("e", 52)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.pow(x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Quarantine") return
                let extra = ""
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Multiply UI gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" Unquarantined Cases\n\
                Multiplier: " + dis + "x"+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 52)) + extra
            },
            unlocked() { return hasUpgrade("e",46) }, 
            canAfford() {
                    return player.e.qc.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.qc = player.e.qc.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.qc
                let target = Decimal.log10(s.div(5e4)).div(Decimal.log10(50))
                if (target.gte(15)) target = target.div(15).root(1.5).mul(15)
                if (target.gte(6e3)) target = target.div(6e3).root(2).mul(6e3)
                target = target.ceil()
                let cost = Decimal.pow(50, target.sub(1)).mul(5e4)
                let diff = target.sub(player.e.buyables[52])
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[52] = player.e.buyables[52].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[52].canAfford) color = "#006633"
                return color
            }
        }
        },
        53: {
			title: "UC Boost",
            cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let x = player[this.layer].buyables[this.id]
                if (x.gte(5)) x = x.div(5).pow(1.7).mul(5)
                let cost = Decimal.pow(1e4, x.pow(1.5)).mul(5e5)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(0.2)
                if (hasUpgrade("e",176)) base = base.add(tmp.e.upgrades[176].effect2)
                return base
            },
            extra() {
                return player.e.buyables[63]
            },
            total() {
                let total = getBuyableAmount("e", 53).add(tmp.e.buyables[53].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.mul(x)
                if (eff.gte(4e3)) eff = eff.div(4e3).pow(0.5).mul(4e3)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Quarantine") return
                let extra = ""
                if (player.e.buyables[63].gte(1)) extra = "+" + formatWhole(tmp.e.buyables[53].extra)
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Increase UI to UC exponent by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" Unquarantined Cases\n\
                Effect: +" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 53)) + extra
            },
            unlocked() { return hasUpgrade("e",46) }, 
            canAfford() {
                    return player.e.qc.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.qc = player.e.qc.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.qc
                let target = Decimal.log10(s.div(5e5)).div(Decimal.log10(1e4)).root(1.5)
                if (target.gte(5)) target = target.div(5).root(1.7).mul(5)
                target = target.ceil()
                let cost = Decimal.pow(1e4, target.sub(1).pow(1.5)).mul(5e5)
                let diff = target.sub(player.e.buyables[53])
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[53] = player.e.buyables[53].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[53].canAfford) color = "#006633"
                return color
            }
        }
        },
        61: {
			title: "UI Boost",
            cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let x = player[this.layer].buyables[this.id]
                if (x.gte(666)) x = x.div(666).pow(2).mul(666)
                let cost = Decimal.pow(1e15, x.pow(2)).mul("e720")
                return cost.floor()
            },
            base() { 
                let base = new Decimal(0.5)
                return base
            },
            extra() {
                return player.e.buyables[63]
            },
            total() {
                let total = getBuyableAmount("e", 61).add(tmp.e.buyables[61].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.mul(x)
                if (eff.gte(500)) eff = eff.div(500).pow(0.25).mul(500)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Quarantine") return
                let extra = ""
                if (player.e.buyables[63].gte(1)) extra = "+" + formatWhole(tmp.e.buyables[61].extra)
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Increase UI gain exponent by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" Unquarantined Cases\n\
                Effect: +" + dis +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 61)) + extra
            },
            unlocked() { return hasUpgrade("e",106) }, 
            canAfford() {
                    return player.e.qc.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.qc = player.e.qc.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.qc
                let target = Decimal.log10(s.div("e720")).div(Decimal.log10(1e15)).root(2)
                if (target.gte(666)) target = target.div(666).pow(0.5).mul(666)
                target = target.ceil()
                let cost = Decimal.pow(1e15, target.sub(1).pow(2)).mul("e720")
                let diff = target.sub(player.e.buyables[61])
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[61] = player.e.buyables[61].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[61].canAfford) color = "#006633"
                return color
            }
        }
        },
        62: {
			title: "Quarantine Boost",
            cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let x = player[this.layer].buyables[this.id]
                if (x.gte(1200)) x = x.div(1200).pow(3).mul(1200)
                let cost = Decimal.pow(1e20, x.pow(2.2)).mul("e842")
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.04)
                if (hasUpgrade("e",193)) base = base.add(upgradeEffect("e",193))
                return base
            },
            extra() {
                return player.e.buyables[63]
            },
            total() {
                let total = getBuyableAmount("e", 62).add(tmp.e.buyables[62].extra)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.pow(x.pow(0.5))
                if (eff.gte(1e3)) eff = eff.log10().mul(1e3/3)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Quarantine") return
                let extra = ""
                if (player.e.buyables[63].gte(1)) extra = "+" + formatWhole(tmp.e.buyables[62].extra)
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Multiply Quarantine exponent by "+format(tmp.e.buyables[62].base)+"^sqrt(x).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" Unquarantined Cases\n\
                Effect: " + dis +"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 62)) + extra
            },
            unlocked() { return hasUpgrade("e",106) }, 
            canAfford() {
                    return player.e.qc.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (tmp.e.buyables[62].canAfford) {
                    if (!hasUpgrade("e",96)) player.e.qc = player.e.qc.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.qc
                let target = Decimal.log10(s.div("e842")).div(Decimal.log10(1e20)).root(2.2)
                if (target.gte(1200)) target = target.div(1200).pow(1/3).mul(1200)
                target = target.ceil()
                let cost = Decimal.pow(1e20, target.sub(1).pow(2.2)).mul("e842")
                let diff = target.sub(player.e.buyables[62])
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[62] = player.e.buyables[62].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[62].canAfford) color = "#006633"
                return color
            }
        }
        },
        63: {
			title: "Cases Base",
            cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let x = player[this.layer].buyables[this.id]
                let cost = Decimal.pow(Decimal.pow(10,1e3), Decimal.pow(tmp.e.buyables[63].scale,x)).mul("3.172e2172")
                return cost.floor()
            },
            scale() {
                let s = new Decimal(1.5)
                if (hasUpgrade("e",184)) s = s.root(upgradeEffect("e",184))
                if (hasUpgrade("e",216)) s = s.root(tmp.e.upgrades[216].effect2)
                return s
            },
            base() { 
                let base = new Decimal(1.75)
                if (hasUpgrade("e",176)) base = base.add(tmp.e.upgrades[176].effect)
                if (hasUpgrade("e",192)) base = base.add(upgradeEffect("e",192))
                if (hasUpgrade("e",216)) base = base.mul(tmp.e.upgrades[216].effect)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 63)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = base.pow(x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "Quarantine") return
                let extra = ""
                let dis = format(tmp[this.layer].buyables[this.id].effect)
                return "Multiply 'Cases Boost' base by "+format(this.base())+", and get 1 free UC Boost, UI Boost, and Quarantine Boost.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" Unquarantined Cases\n\
                Effect: " + dis +"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 63)) + extra
            },
            unlocked() { return hasUpgrade("e",106) }, 
            canAfford() {
                    return player.e.qc.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.qc = player.e.qc.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.qc
                let target = Decimal.log10(s.div("3.172e2172")).div(1000).log(tmp.e.buyables[63].scale)
                target = target.ceil()
                let cost = Decimal.pow(Decimal.pow(10,1e3), Decimal.pow(tmp.e.buyables[63].scale,target.sub(1))).mul("3.172e2172")
                let diff = target.sub(player.e.buyables[63])
                if (this.canAfford()) {
                    if (!hasUpgrade("e",96)) player.e.p = player.e.p.sub(cost).max(0)
                    player.e.buyables[63] = player.e.buyables[63].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[63].canAfford) color = "#006633"
                return color
            }
        }
        },
        71: {
			title: "RNA Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(4, x.pow(1.5)).mul(5e20)
                return cost.floor()
            },
            base() { 
                let base = Decimal.add(3,tmp.e.buyables[72].effect)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 71)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Upgrades") return
                let extra = ""
                let dis = "Multiply RNA gain by "+format(this.base())
                return dis + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 71)) + extra
            },
            unlocked() { return hasUpgrade("e", 216) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div(5e20)).div(Decimal.log10(4)).root(1.5)
                target = target.ceil()
                let cost = Decimal.pow(4, target.sub(1).pow(1.5)).mul(5e20)
                let diff = target.sub(player.e.buyables[71])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[71] = player.e.buyables[71].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[71].canAfford) color = "#0066cc"
                return color
            }
        }
        },
        72: {
			title: "RNA Boost",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(50, x.pow(1.5)).mul(1e45)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(0.25)
                return base.add(tmp.e.Ureffect)
            },
            total() {
                let total = getBuyableAmount("e", 72)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.mul(base, x)
                if (eff.gte(3e6)) eff = eff.div(30).log10().mul(2).pow(6).mul(3)
                if (eff.gte(1e30)) eff = eff.div(1e30).pow(0.3).mul(1e30)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Upgrades") return
                let extra = ""
                let dis = "Increase 'RNA Gain' base and RNA gain exponent by "+format(this.base())
                return dis + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 72)) + extra
            },
            unlocked() { return hasUpgrade("e", 224) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div(1e45)).div(Decimal.log10(50)).root(1.5)
                target = target.ceil()
                let cost = Decimal.pow(50, target.sub(1).pow(1.5)).mul(1e45)
                let diff = target.sub(player.e.buyables[72])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[72] = player.e.buyables[72].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[72].canAfford) color = "#0066cc"
                return color
            }
        }
        },
        81: {
			title: "Hydrogen RNA",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(100, x.pow(1.2)).mul(1e68)
                return cost.floor()
            },
            base() { 
                let base = tmp.e.Again
                return base
            },
            total() {
                let total = getBuyableAmount("e", 81)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Atoms") return
                let extra = ""
                let dis = "Gain "+format(this.base())
                return dis + " H/s.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+" H/s\n\
                Amount: " + formatWhole(getBuyableAmount("e", 81)) + extra
            },
            unlocked() { return hasUpgrade("e", 226) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div(1e68)).div(Decimal.log10(100)).root(1.2)
                target = target.ceil()
                let cost = Decimal.pow(100, target.sub(1).pow(1.2)).mul(1e68)
                let diff = target.sub(player.e.buyables[81])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[81] = player.e.buyables[81].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[81].canAfford) color = "#A00000"
                return color
            }
        }
        },
        82: {
			title: "Carbon RNA",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1000, x.pow(1.2)).mul(1e90)
                return cost.floor()
            },
            base() { 
                let base = tmp.e.Again
                return base
            },
            total() {
                let total = getBuyableAmount("e", 82)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Atoms") return
                let extra = ""
                let dis = "Gain "+format(this.base())
                return dis + " C/s.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+" C/s\n\
                Amount: " + formatWhole(getBuyableAmount("e", 82)) + extra
            },
            unlocked() { return hasUpgrade("e", 226) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div(1e90)).div(Decimal.log10(1000)).root(1.2)
                target = target.ceil()
                let cost = Decimal.pow(1000, target.sub(1).pow(1.2)).mul(1e90)
                let diff = target.sub(player.e.buyables[82])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[82] = player.e.buyables[82].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[82].canAfford) color = "#00A000"
                return color
            }
        }
        },
        83: {
			title: "Nitrogen RNA",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e4, x.pow(1.2)).mul(1e133)
                return cost.floor()
            },
            base() { 
                let base = tmp.e.Again
                return base
            },
            total() {
                let total = getBuyableAmount("e", 83)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Atoms") return
                let extra = ""
                let dis = "Gain "+format(this.base())
                return dis + " N/s.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+" N/s\n\
                Amount: " + formatWhole(getBuyableAmount("e", 83)) + extra
            },
            unlocked() { return hasUpgrade("e", 226) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div(1e133)).div(Decimal.log10(1e4)).root(1.2)
                target = target.ceil()
                let cost = Decimal.pow(1e4, target.sub(1).pow(1.2)).mul(1e133)
                let diff = target.sub(player.e.buyables[83])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[83] = player.e.buyables[83].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[83].canAfford) color = "#00A0A0"
                return color
            }
        }
        },
        91: {
			title: "Oxygen RNA",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x.pow(1.2)).mul(1e171)
                return cost.floor()
            },
            base() { 
                let base = tmp.e.Again
                return base
            },
            total() {
                let total = getBuyableAmount("e", 91)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Atoms") return
                let extra = ""
                let dis = "Gain "+format(this.base())
                return dis + " O/s.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+" O/s\n\
                Amount: " + formatWhole(getBuyableAmount("e", 91)) + extra
            },
            unlocked() { return hasUpgrade("e", 226) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div(1e171)).div(Decimal.log10(1e5)).root(1.2)
                target = target.ceil()
                let cost = Decimal.pow(1e5, target.sub(1).pow(1.2)).mul(1e171)
                let diff = target.sub(player.e.buyables[91])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[91] = player.e.buyables[91].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[91].canAfford) color = "#0000A0"
                return color
            }
        }
        },
        92: {
			title: "Phosphorus RNA",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e10, x.pow(1.25)).mul("e2270")
                return cost.floor()
            },
            base() { 
                let base = tmp.e.Again.div(1e21)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 92)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                return Decimal.mul(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "Atoms") return
                let extra = ""
                let dis = "Gain "+format(this.base())
                return dis + " P/s.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" RNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+" P/s\n\
                Amount: " + formatWhole(getBuyableAmount("e", 92)) + extra
            },
            unlocked() { return hasUpgrade("e", 253) }, 
            canAfford() {
                    return player.e.rna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.rna
                let target = Decimal.log10(s.div("e2270")).div(10).root(1.25)
                target = target.ceil()
                let cost = Decimal.pow(1e10, target.sub(1).pow(1.25)).mul("e2270")
                let diff = target.sub(player.e.buyables[92])
                if (this.canAfford()) {
                    if (!hasMilestone("e",6)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[92] = player.e.buyables[92].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[92].canAfford) color = "#BB5500"
                return color
            }
        }
        },
        93: {
			title: "mRNA Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(5, x.pow(1.5)).mul(5e9)
                return cost.floor()
            },
            base() { 
                let base = player.e.infections.max(10).log10().max(10).log10()
                .pow(0.1)
                return base.add(tmp.e.buyables[101].effect)
            },
            total() {
                let total = getBuyableAmount("e", 93).add(tmp.e.buyables[94].total).add(tmp.e.freeMBuy).add(tmp.e.mueff.e3)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let exp = player.e.upgrades.filter(number => number>270).length
                if (hasUpgrade("e",314)) exp = Decimal.pow(exp,upgradeEffect("e",314))
                if (hasUpgrade("e",391)) exp = Decimal.pow(exp,1.1)
                if (hasUpgrade("e",405)) exp = Decimal.pow(exp,1.25)
                let sc = new Decimal(500)
                let ss = new Decimal(0.4)
                if (hasUpgrade("e",391)) ss = ss.root(upgradeEffect("e",391))
                if (hasUpgrade("e",392)) ss = ss.root(upgradeEffect("e",392))
                if (hasUpgrade("e",415)) ss = ss.root(upgradeEffect("e",415))
                if (hasUpgrade("e",343)) sc = sc.add(50)
                if (hasUpgrade("e",384)) sc = sc.add(upgradeEffect("e",384))
                if (x.gte(sc)) x = x.div(sc).pow(ss).mul(sc)
                return Decimal.pow(base, x).pow(exp);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "mRNA" || player.subtabs.e.mRNAupg != "Buyables") return
                let extra = "+" + formatWhole(tmp.e.buyables[94].total.add(tmp.e.freeMBuy).add(tmp.e.mueff.e3))
                let sc = new Decimal(500)
                if (hasUpgrade("e",343)) sc = sc.add(50)
                if (hasUpgrade("e",384)) sc = sc.add(upgradeEffect("e",384))
                let eff = format(tmp[this.layer].buyables[this.id].effect)+"x"
                if (tmp.e.buyables[93].total.gte(sc)) eff+=" (softcapped)"
                if (player.e.buyables[94].lt(1)) extra = ""
                let dis = "Multiply mRNA gain by "+format(this.base())
                return dis + " per mRNA upgrade (based on II).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: " + eff+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 93)) + extra
            },
            unlocked() { return hasUpgrade("e", 286) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(5e9)).div(Decimal.log10(5)).root(1.5)
                target = target.ceil()
                let cost = Decimal.pow(5, target.sub(1).pow(1.5)).mul(5e9)
                let diff = target.sub(player.e.buyables[93])
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[93] = player.e.buyables[93].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[93].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        94: {
			title: "Immunity Boost",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1000, x.pow(1.5)).mul(25e23)
                return cost.floor()
            },
            base() { 
                let base = player.e.mrna.max(10).log10().max(10).log10().pow(0.2)
                return base.add(tmp.e.buyables[101].effect)
            },
            total() {
                let total = getBuyableAmount("e", 94).add(tmp.e.buyables[95].total).add(tmp.e.freeMBuy)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                sc = new Decimal(1)
                let ss = new Decimal(0.7)
                if (hasUpgrade("e",391)) ss = ss.root(upgradeEffect("e",391))
                if (hasUpgrade("e",392)) ss = ss.root(upgradeEffect("e",392))
                if (hasUpgrade("e",415)) ss = ss.root(upgradeEffect("e",415))
                if (hasUpgrade("e",396)) ss = ss.root(1.1)
                if (hasUpgrade("e",375)) sc = sc.mul(1.05)
                if (x.gte(500)) x = x.div(500).pow(sc.mul(ss)).mul(500)
                if (x.gte(200)) x = x.div(200).pow(sc.mul(ss)).mul(200)
                if (x.gte(60)) x = x.div(60).pow(sc.mul(ss.div(7/3))).mul(60)
                let eff = Decimal.pow(base, x)
                if (eff.gte(15)) eff = eff.div(15).pow(0.2).mul(15)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "mRNA" || player.subtabs.e.mRNAupg != "Buyables") return
                let extra = "+" + formatWhole(tmp.e.buyables[95].total.add(tmp.e.freeMBuy))
                if (player.e.buyables[95].lt(1)) extra = ""
                let dis = "Multiply immunity exponent by "+format(this.base())
                let efs = format(tmp[this.layer].buyables[this.id].effect)+"x"
                if (tmp.e.buyables[94].effect.gte(15)) efs += " (softcapped)"
                return dis + " (based on mRNA).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: " + efs +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 94)) + extra
            },
            unlocked() { return hasUpgrade("e", 293) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(25e23)).div(3).root(1.5)
                target = target.ceil()
                let cost = Decimal.pow(1e3, target.sub(1).pow(1.5)).mul(25e23)
                let diff = target.sub(player.e.buyables[94])
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[94] = player.e.buyables[94].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[94].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        95: {
			title: "RNA Booster",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e7, x.pow(1.6)).mul(3e157)
                return cost.floor()
            },
            base() { 
                let base = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10()
                .add(10).max(10).log10().add(10).max(10).log10().pow(0.15)
                return base.add(tmp.e.buyables[101].effect)
            },
            total() {
                let total = getBuyableAmount("e", 95).add(tmp.e.freeMBuy)
                return total
            },
            sc() {
                let sc = new Decimal(8)
                if (hasUpgrade("e",336)) sc = sc.add(2)
                if (hasUpgrade("e",372)) sc = sc.add(upgradeEffect("e",372))
                if (hasUpgrade("e",386)) sc = sc.add(5)
                return sc
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let sc = tmp.e.buyables[95].sc
                let ss = new Decimal(0.3)
                if (hasUpgrade("e",391)) ss = ss.root(upgradeEffect("e",391))
                if (hasUpgrade("e",392)) ss = ss.root(upgradeEffect("e",392))
                if (hasUpgrade("e",415)) ss = ss.root(upgradeEffect("e",415))
                if (x.gte(sc)) x = x.div(sc).pow(ss).mul(sc)
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "mRNA" || player.subtabs.e.mRNAupg != "Buyables") return
                let extra = "+" + formatWhole(tmp.e.freeMBuy)
                if (player.e.buyables[101].lt(1)) extra = ""
                let dis = "Raise RNA eff to "+format(this.base())
                let efs = format(tmp[this.layer].buyables[this.id].effect)
                if (tmp.e.buyables[95].total.gte(tmp.e.buyables[95].sc)) efs += " (softcapped)"
                return dis + " (based on cases).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: ^" + efs +"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 95)) + extra
            },
            unlocked() { return hasUpgrade("e", 305) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(3e157)).div(7).root(1.6)
                target = target.ceil()
                let cost = Decimal.pow(1e7, target.sub(1).pow(1.5)).mul(3e157)
                let diff = target.sub(player.e.buyables[95])
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[95] = player.e.buyables[95].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[95].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        101: {
			title: "mRNA Booster",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(80)) x = x.div(80).pow(2.5).mul(80)
                let cost = Decimal.pow(1e50, x.pow(2)).mul(Decimal.pow(10,330))
                return cost.floor()
            },
            base() { 
                let base = player.e.rna.add(10).max(10).log10().add(10).max(10).log10().pow(0.05).div(100)
                if (hasUpgrade("e",344)) base = base.add(upgradeEffect("e",344))
                if (hasUpgrade("e",394)) base = base.add(upgradeEffect("e",394))
                if (hasUpgrade("e",403)) base = base.add(upgradeEffect("e",403))
                if (hasUpgrade("e",404)) base = base.add(upgradeEffect("e",404))
                if (hasUpgrade("e",423)) base = base.mul(1.2)
                return base
            },
            base2() { 
                let base = new Decimal(1)
                if (hasUpgrade("e",395)) base = base.add(upgradeEffect("e",395))
                if (hasUpgrade("e",405)) base = base.add(upgradeEffect("e",405))
                if (hasUpgrade("e",423)) base = base.pow(1.3)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 101).add(tmp.e.mueff2.e2)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.mul(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "mRNA" || player.subtabs.e.mRNAupg != "Buyables") return
                let extra = "+" + formatWhole(tmp.e.mueff2.e2)
                if (player.e.mu2.lt(1)) extra = ""
                let dis = "Increases previous buyable bases by "+format(this.base())
                let dis2 = format(tmp.e.buyables[101].base2) + " free levels."
                if (tmp.e.buyables[101].base2) + " free levels."
                return dis + " (based on RNA) and gives "+dis2+"\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 101)) + extra
            },
            unlocked() { return hasUpgrade("e", 313) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(Decimal.pow(10,330))).div(50).root(2)
                if (target.gte(80)) target = target.div(80).pow(0.4).mul(80)
                target = target.ceil()
                let cost = Decimal.pow(1e50, target.sub(1).pow(2)).mul(Decimal.pow(10,330))
                let diff = target.sub(player.e.buyables[101])
                if (this.canAfford()) {
                    if (!hasMilestone("e",8)) player.e.rna = player.e.rna.sub(cost).max(0)
                    player.e.buyables[101] = player.e.buyables[101].add(diff)
                }
            },
            style: {"width":"170px","height":"170px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[101].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        102: {
			title: "MMNA Virus",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(3e4)) x = x.div(3e4).pow(3).mul(3e4)
                let cost = Decimal.pow(1e5, x.div(tmp.e.buyables[102].scaleDiv).pow(2)).mul(Decimal.pow(10,1063))
                return cost.floor()
            },
            base() { 
                let base = tmp.e.mmgain
                return base
            },
            total() {
                let total = getBuyableAmount("e", 102)
                return total
            },
            scaleDiv() {
                let div = new Decimal(1)
                if (hasUpgrade("e",333)) div = div.mul(upgradeEffect("e",333))
                if (hasUpgrade("e",361)) div = div.mul(upgradeEffect("e",361))
                if (hasUpgrade("e",382)) div = div.mul(upgradeEffect("e",382))
                if (player.e.mu2.gte(5)) div = div.mul(tmp.e.mueff2.e4)
                return div
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                if (hasUpgrade("e",334)) x = x.pow(1.25)
                if (hasUpgrade("e",384)) x = x.pow(1.25)
                if (hasUpgrade("e",396)) x = x.pow(tmp.e.mueff.e6)
                let eff = Decimal.mul(base, x)
                if (hasUpgrade("e",342)) eff = eff.pow(1.2)
                if (hasUpgrade("e",401)) eff = eff.pow(1.15)
                if (hasUpgrade("e",353)) eff = eff.pow(1.1)
                if (hasUpgrade("e",392)) eff = eff.pow(1.1)
                if (hasUpgrade("e",385)) eff = eff.pow(1.05)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "MMNA") return
                let extra = ""
                let dis = "Gain "+format(this.base())
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp.e.buyables[105].effect
                let eff2 = Decimal.pow(base,x)
                let disp = dis + " MMNA/s."
                let disp2 = ", "+format(eff2)+"x"
                if (player.e.buyables[105].gte(1)) disp += " and multiply mRNA gain by "+format(base)
                if (player.e.buyables[105].lt(1)) disp2 = ""
                return disp+"\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+disp2+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 102)) + extra
            },
            unlocked() { return hasUpgrade("e", 316) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",9)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(Decimal.pow(10,1063))).div(5).root(2).mul(tmp.e.buyables[102].scaleDiv)
                if (target.gte(3e4)) target = target.div(3e4).pow(1/3).mul(3e4)
                target = target.ceil()
                let cost = Decimal.pow(1e5, target.sub(1).pow(2)).mul(Decimal.pow(10,1063))
                let diff = target.sub(player.e.buyables[102])
                if (this.canAfford()) {
                    if (!hasMilestone("e",9)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player.e.buyables[102] = player.e.buyables[102].add(diff)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[102].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        103: {
			title: "Mutation Scaling",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(250)) x = x.div(250).pow(2).mul(250)
                if (x.gte(28)) x = x.div(28).pow(3).mul(28)
                x =  x.div(tmp.e.buyables[103].scaleDiv)
                let cost = Decimal.pow(1e100, x.pow(2)).mul(Decimal.pow(10,3721))
                return cost.floor()
            },
            scaleDiv() {
                let div = new Decimal(1)
                if (hasUpgrade("e",376)) div = div.mul(upgradeEffect("e",376))
                if (hasUpgrade("e",382)) div = div.mul(upgradeEffect("e",382))
                if (player.e.mu2.gte(5)) div = div.mul(tmp.e.mueff2.e4)
                return div
            },
            base() { 
                let base = new Decimal(1.05)
                if (hasUpgrade("e",346)) base = base.add(upgradeEffect("e",346))
                if (hasUpgrade("e",365)) base = base.add(upgradeEffect("e",365))
                if (hasUpgrade("e",381)) base = base.add(upgradeEffect("e",381))
                if (hasUpgrade("e",393)) base = base.add(upgradeEffect("e",393).div(10))
                return base
            },
            total() {
                let total = getBuyableAmount("e", 103)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x.pow(2/3))
                if (eff.gte(2e52)) eff = eff.log10().div(Decimal.log10(2e5)).pow(0.5).mul(Decimal.log10(2e5)).pow10()
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "MMNA") return
                let extra = ""
                let dis = "Reduce scaling by "+format(this.base())
                return dis + "^x<sup>2/3</sup>.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: /" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("e", 103)) + extra
            },
            unlocked() { return hasUpgrade("e", 326) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",10)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(Decimal.pow(10,3721))).div(100).root(2).mul(tmp.e.buyables[103].scaleDiv)
                if (target.gte(28)) target = target.div(28).pow(1/3).mul(28)
                if (target.gte(250)) target = target.div(250).pow(1/2).mul(250)
                target = target.ceil()
                let cost = Decimal.pow(1e100, target.sub(1).pow(2)).mul(Decimal.pow(10,3721))
                let diff = target.sub(player.e.buyables[103])
                if (this.canAfford()) {
                    if (!hasMilestone("e",10)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player.e.buyables[103] = player.e.buyables[103].add(diff)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[103].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        104: {
			title: "MMNA Boost",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(165)) x = x.div(165).pow(3).mul(165)
                x = x.div(tmp.e.buyables[104].scaleDiv)
                let cost = Decimal.pow(1e5, x.pow(2.75)).mul(Decimal.pow(10,3740))
                return cost.floor()
            },
            scaleDiv() {
                let div = new Decimal(1)
                if (hasUpgrade("e",356)) div = div.mul(1.1)
                if (hasUpgrade("e",361)) div = div.mul(upgradeEffect("e",361))
                if (player.e.mu2.gte(5)) div = div.mul(tmp.e.mueff2.e4)
                return div
            },
            base() { 
                let base = new Decimal(1.2)
                if (hasUpgrade("e",336)) base = base.add(upgradeEffect("e",336))
                if (hasUpgrade("e",393)) base = base.add(upgradeEffect("e",393))
                if (hasUpgrade("e",351)) base = base.add(tmp.e.upgrades[351].effect2)
                if (hasUpgrade("e",403)) base = base.add(tmp.e.upgrades[403].effect2)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 104)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "MMNA") return
                let extra = ""
                let dis = "Multiply MMNA gain and limit by "+format(this.base())
                return dis + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 104)) + extra
            },
            unlocked() { return hasUpgrade("e", 326) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",10))player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(Decimal.pow(10,3740))).div(5).root(2.75).mul(tmp.e.buyables[104].scaleDiv)
                if (target.gte(165)) target = target.div(165).pow(1/3).mul(165)
                target = target.ceil()
                let cost = Decimal.pow(1e5, target.sub(1).pow(2.75)).mul(Decimal.pow(10,3740))
                let diff = target.sub(player.e.buyables[104])
                if (this.canAfford()) {
                    if (!hasMilestone("e",10)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player.e.buyables[104] = player.e.buyables[104].add(diff)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[104].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        105: {
			title: "Chance Boost",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                if (x.gte(50)) x = x.div(50).pow(2.5).mul(50)
                x = x.div(tmp.e.buyables[105].scaleDiv)
                let cost = Decimal.pow(1e10, x.pow(3)).mul(Decimal.pow(10,4184))
                return cost.floor()
            },
            scaleDiv() {
                let div = new Decimal(1)
                if (hasUpgrade("e",354)) div = div.mul(upgradeEffect("e",354))
                if (hasUpgrade("e",361)) div = div.mul(upgradeEffect("e",361))
                if (hasUpgrade("e",373)) div = div.mul(upgradeEffect("e",373))
                if (hasUpgrade("e",376)) div = div.mul(upgradeEffect("e",376))
                if (player.e.mu2.gte(5)) div = div.mul(tmp.e.mueff2.e4)
                return div
            },
            base() { 
                let base = new Decimal(2)
                if (hasUpgrade("e",335)) base = base.add(upgradeEffect("e",335))
                if (hasUpgrade("e",352)) base = base.add(tmp.e.upgrades[352].effect2)
                if (hasUpgrade("e",353)) base = base.add(upgradeEffect("e",353))
                if (hasUpgrade("e",363)) base = base.add(tmp.e.upgrades[363].effect2)
                if (hasUpgrade("e",374)) base = base.mul(tmp.e.upgrades[374].effect)
                if (hasUpgrade("e",386)) base = base.mul(1.5)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 105)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "MMNA") return
                let extra = ""
                let dis = "Multiply mRNA gain per 'MMNA Virus' and Mutate chance by "+format(this.base())
                return dis + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" mRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 105)) + extra
            },
            unlocked() { return hasUpgrade("e", 326) }, 
            canAfford() {
                    return player.e.mrna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("e",10)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            buyMax() {
                let s = player.e.mrna
                let target = Decimal.log10(s.div(Decimal.pow(10,4184))).div(10).root(3).mul(tmp.e.buyables[105].scaleDiv)
                if (target.gte(50)) target = target.div(50).pow(0.4).mul(50)
                target = target.ceil()
                let cost = Decimal.pow(1e10, target.sub(1).pow(3)).mul(Decimal.pow(10,4184))
                let diff = target.sub(player.e.buyables[105])
                if (this.canAfford()) {
                    if (!hasMilestone("e",10)) player.e.mrna = player.e.mrna.sub(cost).max(0)
                    player.e.buyables[105] = player.e.buyables[105].add(diff)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[105].canAfford) color = "#00AA55"
                return color
            }
        }
        },
        111: {
			title: "CRCR",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                x = x.div(tmp.e.buyables[111].scaleDiv)
                let cost = Decimal.pow(1.5, x.pow(1.5)).mul(10)
                return cost
            },
            scaleDiv() {
                let div = new Decimal(1)
                return div
            },
            base() { 
                let base = player.e.crna.add(1).log10().pow(0.5).add(1.5)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 111)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "CRNA") return
                let extra = ""
                let dis = "Multiply base CRNA gain by "+format(this.base())
                return dis + " (based on CRNA).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" CRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 111)) + extra
            },
            unlocked() { return hasUpgrade("e", 403) }, 
            canAfford() {
                    return player.e.crna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.e.crna = player.e.crna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[111].canAfford) color = "#AA55AA"
                return color
            }
        }
        },
        112: {
			title: "CRIN",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                x = x.div(tmp.e.buyables[112].scaleDiv)
                let cost = Decimal.pow(1.7, x.pow(1.5)).mul(350)
                return cost
            },
            scaleDiv() {
                let div = new Decimal(1)
                return div
            },
            base() { 
                let base = player.e.points.add(1).pow(1/3).div(100).add(1)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 112)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "CRNA") return
                let extra = ""
                let dis = "Multiply base CRNA gain by "+format(this.base())
                return dis + " (based on infecters).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" CRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 112)) + extra
            },
            unlocked() { return hasUpgrade("e", 404) }, 
            canAfford() {
                    return player.e.crna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.e.crna = player.e.crna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[112].canAfford) color = "#AA55AA"
                return color
            }
        }
        },
        113: {
			title: "CRMU",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                x = x.div(tmp.e.buyables[113].scaleDiv)
                let cost = Decimal.pow(2, x.pow(1.5)).mul(4e3)
                return cost
            },
            scaleDiv() {
                let div = new Decimal(1)
                return div
            },
            base() { 
                let base = player.e.mu.add(1).pow(0.85).div(15).add(1)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 113)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "CRNA") return
                let extra = ""
                let dis = "Multiply base CRNA gain by "+format(this.base())
                return dis + " (based on mutations).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" CRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 113)) + extra
            },
            unlocked() { return hasUpgrade("e", 406) }, 
            canAfford() {
                    return player.e.crna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.e.crna = player.e.crna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[113].canAfford) color = "#AA55AA"
                return color
            }
        }
        },
        121: {
			title: "CGCR",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                x = x.div(tmp.e.buyables[121].scaleDiv)
                let cost = Decimal.pow(2, x.pow(1.7)).mul(47500)
                return cost
            },
            scaleDiv() {
                let div = new Decimal(1)
                return div
            },
            base() { 
                let base = player.e.crna.max(10).log10().pow(0.25).add(0.5)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 121)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "CRNA") return
                let extra = ""
                let dis = "Multiply CRNA gain after log by "+format(this.base())
                return dis + " (based on CRNA).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" CRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 121)) + extra
            },
            unlocked() { return hasUpgrade("e", 412) }, 
            canAfford() {
                    return player.e.crna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.e.crna = player.e.crna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[121].canAfford) color = "#AA55AA"
                return color
            }
        }
        },
        122: {
			title: "CGMM",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                x = x.div(tmp.e.buyables[122].scaleDiv)
                let cost = Decimal.pow(3, x.pow(1.7)).mul(65e7)
                return cost
            },
            scaleDiv() {
                let div = new Decimal(1)
                return div
            },
            base() { 
                let base = player.e.mm.max(10).log10().max(10).log10().pow(0.33).add(0.5)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 122)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "CRNA") return
                let extra = ""
                let dis = "Multiply CRNA gain after log by "+format(this.base())
                return dis + " (based on MMNA).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" CRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 122)) + extra
            },
            unlocked() { return hasUpgrade("e", 416) }, 
            canAfford() {
                    return player.e.crna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.e.crna = player.e.crna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[122].canAfford) color = "#AA55AA"
                return color
            }
        }
        },
        123: {
			title: "CGMR",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                x = x.div(tmp.e.buyables[123].scaleDiv)
                let cost = Decimal.pow(3.5, x.pow(1.7)).mul(29e10)
                return cost
            },
            scaleDiv() {
                let div = new Decimal(1)
                return div
            },
            base() { 
                let base = player.e.mrna.max(10).log10().max(10).log10().pow(0.25).add(0.5)
                return base
            },
            total() {
                let total = getBuyableAmount("e", 123)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp[this.layer].buyables[this.id].total
                let base = tmp[this.layer].buyables[this.id].base
                let eff = Decimal.pow(base, x)
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                if (player.tab != "e" || player.subtabs.e.mainTabs != "RNA" || player.subtabs.e.stuff != "CRNA") return
                let extra = ""
                let dis = "Multiply CRNA gain after log by "+format(this.base())
                return dis + " (based on mRNA).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" CRNA\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("e", 123)) + extra
            },
            unlocked() { return hasUpgrade("e", 422) }, 
            canAfford() {
                    return player.e.crna.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.e.crna = player.e.crna.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            },
            style: {"width":"140px","height":"140px",
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.e.buyables[123].canAfford) color = "#AA55AA"
                return color
            }
        }
        },
    },
    upgrades: {
        rows: 11,
        cols: 6,
        11: {
            title: "Infected",
            description: "Infection power boosts 'Infection' after softcap.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(200),
            effect(){
                let eff = player.e.p.add(10).max(10).log10().pow(150)
                return eff
            },
            canAfford() {
                return player.e.p.gte(200)
            },
            pay() {
                player.e.p = player.e.p.sub(200)
                player.e.upgg.push(11)
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",11))
            },
        },
        12: {
            title: "Infected Virus",
            description: "IN power boost CV gain and 'More Exponenter' buys 10x more and 2x faster.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(250),
            effect(){
                let eff = player.e.p.add(1).max(1).pow(20)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",12))+"x"
            },
            canAfford() {
                return player.e.p.gte(250)
            },
            pay() {
                player.e.p = player.e.p.sub(250)
                player.e.upgg.push(12)
            },
            unlocked() {
                return hasUpgrade("e",11)
            }
        },
        13: {
            title: "Infected Immunity",
            description: "Infection power divides immunity.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(2000),
            effect(){
                let eff = player.e.p.add(1).max(1)
                eff = eff.slog().pow(3)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",13))
            },
            canAfford() {
                return player.e.p.gte(2000)
            },
            pay() {
                player.e.p = player.e.p.sub(2e3)
                player.e.upgg.push(13)
            },
            unlocked() {
                return hasUpgrade("e",12)
            }
        },
        14: {
            title: "Infected Cases",
            description: "Cases boost infection power gain and divide immunity.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(3000),
            effect(){
                let eff = tmp.e.cases2.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(2)
                if (hasUpgrade("e",64)) eff = eff.pow(upgradeEffect("e",64))
                return eff
            },
            effect2(){
                let eff = tmp.e.cases2.add(1).max(1)
                eff = eff.slog().pow(1.4)
                return eff.max(1)
            },
            canAfford() {
                return player.e.p.gte(3000)
            },
            pay() {
                player.e.p = player.e.p.sub(3e3)
                player.e.upgg.push(14)
            },
            effectDisplay(){
                return format(tmp.e.upgrades[14].effect)+"x, /"+format(tmp.e.upgrades[14].effect2)+"x"
            },
            unlocked() {
                return hasUpgrade("e",13)
            }
        },
        15: {
            title: "Infected Boost",
            description: "Infecters add to 'Cases Boost' base, S and D autobuyers buy max.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(15000),
            effect(){
                let eff = player.e.points.div(2000)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",15))
            },
            canAfford() {
                return player.e.p.gte(15e3)
            },
            pay() {
                player.e.p = player.e.p.sub(15e3)
                player.e.upgg.push(15)
            },
            unlocked() {
                return hasUpgrade("e",14)
            }
        },
        16: {
            title: "Infect Infect",
            description: "Infectivity divides immunity and boosts 'Infection' after softcap.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(20000),
            effect(){
                let eff = player.i.points.add(10).max(10)
                eff = eff.slog().pow(0.5)
                return eff.max(1)
            },
            effect2(){
                let eff = player.i.points.add(10).max(10)
                eff = eff.log10().pow(0.08)
                if (eff.gte("ee21")) eff = Decimal.pow(10,eff.div("ee21").log10().pow(0.8)).mul("ee21")
                return eff.max(1)
            },
            effectDisplay(){
                return "/"+format(tmp.e.upgrades[16].effect) + ", ^"+format(tmp.e.upgrades[16].effect2)
            },
            canAfford() {
                return player.e.p.gte(2e4)
            },
            pay() {
                player.e.p = player.e.p.sub(2e4)
                player.e.upgg.push(16)
            },
            unlocked() {
                return hasUpgrade("e",15)
            }
        },
        21: {
            title: "Infected Infectivity",
            description: "Infectivity boosts IN power gain and dimension autobuyers buy 1,000,000x more.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(30000),
            effect(){
                let eff = player.i.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.3)
                if (hasUpgrade("e",42)) eff = eff.pow(upgradeEffect("e",42))
                if (eff.gte("ee10")) eff = Decimal.pow(10,eff.div("ee10").log10().pow(0.85)).mul("ee10")
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",21))+"x"
                if (upgradeEffect("e",21).gte("ee10")) dis += ' (softcapped)'
                return dis
            },
            canAfford() {
                return player.e.p.gte(3e4)
            },
            pay() {
                player.e.p = player.e.p.sub(3e4)
                player.e.upgg.push(21)
            },
            unlocked() {
                return hasUpgrade("e",16)
            }
        },
        22: {
            title: "Infected Infecters",
            description: "Infection power adds to infecter base.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(400000),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",22))
            },
            canAfford() {
                return player.e.p.gte(4e5)
            },
            pay() {
                player.e.p = player.e.p.sub(4e5)
                player.e.upgg.push(22)
            },
            unlocked() {
                return hasUpgrade("e",21)
            }
        },
        23: {
            title: "Infected Casuals",
            description: "Casuals boost IN power gain and 'More Exponenter' buys 100x more and 2x faster.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(1000000),
            effect(){
                let eff = player.f.casuals.add(10).max(10)
                eff = eff.log10().pow(0.2)
                if (hasUpgrade("e",74)) eff = eff.pow(upgradeEffect("e",74))
                if (eff.gte("ee26")) eff = eff.log10().div(10).pow(4e24)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",23))+"x"
            },
            canAfford() {
                return player.e.p.gte(1e6)
            },
            pay() {
                player.e.p = player.e.p.sub(1e6)
                player.e.upgg.push(23)
            },
            unlocked() {
                return hasUpgrade("e",22)
            }
        },
        24: {
            title: "Casualer Infection",
            description: "IN power boosts 'Unlimited Casuals' and 'Unlimited Multiplier'.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(4e9),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().pow(0.8)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",24))
            },
            canAfford() {
                return player.e.p.gte(4e9)
            },
            pay() {
                player.e.p = player.e.p.sub(4e9)
                player.e.upgg.push(24)
            },
            unlocked() {
                return hasUpgrade("e",23)
            }
        },
        25: {
            title: "Casual Immunity",
            description: "Casuals divide immunity.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(7e9),
            effect(){
                let eff = player.f.casuals.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().div(4)
                return eff.min(2)
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",25))
            },
            canAfford() {
                return player.e.p.gte(7e9)
            },
            pay() {
                player.e.p = player.e.p.sub(7e9)
                player.e.upgg.push(25)
            },
            unlocked() {
                return hasUpgrade("e",24)
            }
        },
        26: {
            title: "Infected Casualty",
            description: "Casualty divides immunity and adds to infecter base.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(3e11),
            effect(){
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.5).div(2)
                return eff.min(2)
            },
            effect2(){
                let eff = player.f.casualty.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(2).div(5)
                return eff
            },
            effectDisplay(){
                return "/"+format(tmp.e.upgrades[26].effect)+", +"+format(tmp.e.upgrades[26].effect2)
            },
            canAfford() {
                return player.e.p.gte(3e11)
            },
            pay() {
                player.e.p = player.e.p.sub(3e11)
                player.e.upgg.push(26)
            },
            unlocked() {
                return hasUpgrade("e",25)
            }
        },
        31: {
            title: "Powerful Infection",
            description: "Casuals boost infection power 1st effect.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(1.313e13),
            effect(){
                let eff = player.f.casuals.add(10).max(10)
                eff = eff.log10().pow(0.253)
                return eff.max(1)
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",31))
            },
            canAfford() {
                return player.e.p.gte(1.313e13)
            },
            pay() {
                player.e.p = player.e.p.sub(1.313e13)
                player.e.upgg.push(31)
            },
            unlocked() {
                return hasUpgrade("e",26)
            }
        },
        32: {
            title: "Multiplied Infection",
            description: "Multiplier Boosts boost infection power gain.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(8.585e85),
            effect(){
                let eff = player.f.buyables[33]
                eff = Decimal.pow(1.001,eff)
                return eff.max(1)
            },
            effectDisplay(){
                return format(upgradeEffect("e",32))+"x"
            },
            canAfford() {
                return player.e.p.gte(8.585e85)
            },
            pay() {
                player.e.p = player.e.p.sub(8.585e85)
                player.e.upgg.push(32)
            },
            unlocked() {
                return hasUpgrade("e",31)
            }
        },
        33: {
            title: "MultiDivide Immunity",
            description: "Multiplier Boosts divide immunity.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(1.09e109),
            effect(){
                let eff = player.f.buyables[33]
                eff = Decimal.pow(1.00001,eff)
                if (eff.gte(1.5)) eff = eff.div(1.5).pow(0.1).mul(1.5)
                if (eff.gte(2)) eff = eff.log(2).pow(0.2).mul(2)
                if (eff.gte(3)) eff = eff.add(7).slog().add(2)
                return eff.max(1)
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",33))
            },
            canAfford() {
                return player.e.p.gte(1.09e109)
            },
            pay() {
                player.e.p = player.e.p.sub(3e94)
                player.e.upgg.push(33)
            },
            unlocked() {
                return hasUpgrade("e",32)
            }
        },
        34: {
            title: "Self Voost",
            description: "Infection power divides 'Self Booster' scaling base and its softcap starts 400 later.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(4e109),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(18)
                return eff.min(900000)
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",34))
            },
            canAfford() {
                return player.e.p.gte(4e109)
            },
            pay() {
                player.e.p = player.e.p.sub(4e109)
                player.e.upgg.push(34)
            },
            unlocked() {
                return hasUpgrade("e",33)
            }
        },
        35: {
            title: "Distant Distancing",
            description: "Infection power makes Social Distant scaling start later and Dimension scaling is ^0.05.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(1.1e110),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(5).mul(150)
                if (eff.gte(1e4)) eff = eff.div(1e4).pow(0.25).mul(1e4)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",35))
            },
            canAfford() {
                return player.e.p.gte(1.1e110)
            },
            pay() {
                player.e.p = player.e.p.sub(1.1e110)
                player.e.upgg.push(35)
            },
            unlocked() {
                return hasUpgrade("e",34)
            }
        },
        36: {
            title: "Fataler Infection",
            description: "Fatality power boosts infection power gain.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal(1.3e130),
            effect(){
                let eff = player.f.p.add(1).max(1)
                eff = Decimal.pow(10,eff.log10().pow(0.1)).pow(0.35)
                if (eff.gte("ee11")) eff = Decimal.pow(10,eff.div("ee11").log10().pow(0.8)).mul("ee11")
                if (eff.gte("e2e16")) eff = Decimal.pow(10,eff.div("e2e16").log10().pow(0.8)).mul("e2e16")
                if (eff.gte("ee18")) eff = eff.log10().mul(100).pow(5e16)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",36))+"x"
                if (upgradeEffect("e",36).gte("ee11")) dis += ' (softcapped)'
                return dis
            },
            canAfford() {
                return player.e.p.gte(1.3e130)
            },
            pay() {
                player.e.p = player.e.p.sub(1.3e130)
                player.e.upgg.push(36)
            },
            unlocked() {
                return hasUpgrade("e",35)
            }
        },
        41: {
            title: "Fatal Base",
            description: "Fatality power adds to 'Power Base' base.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("3e537694"),
            effect(){
                let eff = player.f.p.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.4)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",41))
            },
            canAfford() {
                return player.e.p.gte("3e537694")
            },
            pay() {
                player.e.p = player.e.p.sub("3e537694")
                player.e.upgg.push(41)
            },
            unlocked() {
                return hasUpgrade("e",156)
            }
        },
        42: {
            title: "Self Infection",
            description: "'Infected Infectivity' boosts itself.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e583805"),
            effect(){
                let eff = upgradeEffect("e",21).add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(5.75)
                if (hasUpgrade("e",102)) eff = eff.pow(upgradeEffect("e",102))
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",42))
            },
            canAfford() {
                return player.e.p.gte("e583805")
            },
            pay() {
                player.e.p = player.e.p.sub("e583805")
                player.e.upgg.push(42)
            },
            unlocked() {
                return hasUpgrade("e",41)
            }
        },
        43: {
            title: "Self Exponent",
            description: "Cases boost its exponent.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("6.942e688497"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.03)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",43))
            },
            canAfford() {
                return player.e.p.gte("6.942e688497")
            },
            pay() {
                player.e.p = player.e.p.sub("6.942e688497")
                player.e.upgg.push(43)
            },
            unlocked() {
                return hasUpgrade("e",42)
            }
        },
        44: {
            title: "Infected Diseaser",
            description: "Infectious diseases give infected infections.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("4.2e735005"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().pow(0.75)
                return eff.floor()
            },
            effectDisplay(){
                return "+"+formatWhole(upgradeEffect("e",44))
            },
            canAfford() {
                return player.e.p.gte("4.2e735005")
            },
            pay() {
                player.e.p = player.e.p.sub("4.2e735005")
                player.e.upgg.push(44)
            },
            unlocked() {
                return hasUpgrade("e",43)
            }
        },
        45: {
            title: "Diseaser Boost",
            description: "Add 0.005 to 'Disease Boost' base.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("1.5e761214"),
            canAfford() {
                return player.e.p.gte("1.5e761214")
            },
            pay() {
                player.e.p = player.e.p.sub("1.5e761214")
                player.e.upgg.push(45)
            },
            unlocked() {
                return hasUpgrade("e",44)
            }
        },
        46: {
            title: "PROduction",
            description: "Cases produce infected infections and unlock Quarantine.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("2.69e989588"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(1.5).sub(1)
                if (hasUpgrade("e",82)) eff = eff.mul(upgradeEffect("e",82))
                return eff.mul(tmp.e.reff)
            },
            effectDisplay(){
                return format(upgradeEffect("e",46))+"/s"
            },
            canAfford() {
                return player.e.p.gte("2.69e989588")
            },
            pay() {
                player.e.p = player.e.p.sub("2.69e989588")
                player.e.upgg.push(46)
            },
            unlocked() {
                return hasUpgrade("e",45)
            }
        },
        51: {
            title: "11",
            description: "Add 1 to 'Power Gain' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(100),
            pay() {
                player.e.spent = player.e.spent.add(100)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        52: {
            title: "21",
            description: "Fatality divides immunity.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(50),
            effect(){
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.04)
                if (hasUpgrade("e",123)) eff = eff.pow(5)
                return eff.min(3)
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",52))
            },
            canAfford() {
                return hasUpgrade("e",51) && player.e.infections.gte(50)
            },
            pay() {
                player.e.spent = player.e.spent.add(50)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        53: {
            title: "22",
            description: "Add 0.01 to 'Immunity Divider' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(50),
            canAfford() {
                return hasUpgrade("e",51) && player.e.infections.gte(50)
            },
            pay() {
                player.e.spent = player.e.spent.add(50)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        54: {
            title: "31",
            description: "Fatality makes Social Distant scaling weaker.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(10),
            effect(){
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.5)
                return eff.min(4.7)
            },
            effectDisplay(){
                return format(upgradeEffect("e",54))+"x"
            },
            canAfford() {
                return hasUpgrade("e",52) && player.e.infections.gte(10)
            },
            pay() {
                player.e.spent = player.e.spent.add(10).max(10)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        55: {
            title: "32",
            description: "Infection power makes Social Distant scaling weaker.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(30),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(1.8)
                return eff.min(7.7)
            },
            effectDisplay(){
                return format(upgradeEffect("e",55))+"x"
            },
            canAfford() {
                return hasUpgrade("e",53) && player.e.infections.gte(30)
            },
            pay() {
                player.e.spent = player.e.spent.add(30)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        56: {
            title: "41",
            description: "Divide immunity by 1.25, and 'Self Booster' softcap starts 1,000 later.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(16),
            canAfford() {
                return (hasUpgrade("e",54) || hasUpgrade("e",55)) && player.e.infections.gte(16)
            },
            pay() {
                player.e.spent = player.e.spent.add(16)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        61: {
            title: "51",
            description: "'More Infections' is applied after softcap at reduced rate.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(15),
            effect(){
                let eff = Decimal.add(getVUpgEff(23),1)
                eff = eff.log10().pow(238)
                if (eff.gte("ee31")) eff = eff.div("ee31").log10().pow(0.9).pow10().mul("ee31")
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",61))
            },
            canAfford() {
                return hasUpgrade("e",56) && player.e.infections.gte(15)
            },
            pay() {
                player.e.spent = player.e.spent.add(15)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        62: {
            title: "61",
            description: "Infection power adds to 'Power Gain' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(100),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",62))
            },
            canAfford() {
                return hasUpgrade("e",61) && player.e.path>=1 && player.e.infections.gte(100)
            },
            pay() {
                player.e.spent = player.e.spent.add(100)
                player.e.path -=1
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        63: {
            title: "71",
            description: "Add 0.05 to 'Infecter Base' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(150),
            canAfford() {
                return hasUpgrade("e",62) && player.e.infections.gte(150)
            },
            pay() {
                player.e.spent = player.e.spent.add(150)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        64: {
            title: "81",
            description: "IN power boosts 'Infected Cases'.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(200),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().pow(0.603)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",64))
            },
            canAfford() {
                return hasUpgrade("e",63) && player.e.infections.gte(200)
            },
            pay() {
                player.e.spent = player.e.spent.add(200)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        65: {
            title: "62",
            description: "Infectious diseases add to 'Power Gain' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(170),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().pow(0.55)
                return eff.min(1e3)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",65))
            },
            canAfford() {
                return hasUpgrade("e",61) && player.e.path>=1 &&  player.e.infections.gte(170)
            },
            pay() {
                player.e.spent = player.e.spent.add(170)
                player.e.path -=1
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        66: {
            title: "72",
            description: "Infectious diseases boost infecter base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(220),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().pow(2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",66))+"x"
            },
            canAfford() {
                return hasUpgrade("e",65) &&  player.e.infections.gte(220)
            },
            pay() {
                player.e.spent = player.e.spent.add(220)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        71: {
            title: "82",
            description: "IN power boosts 'Disease Power'.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(280),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().pow(0.4)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",71))
            },
            canAfford() {
                return hasUpgrade("e",66) && player.e.infections.gte(280)
            },
            pay() {
                player.e.spent = player.e.spent.add(280)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        72: {
            title: "63",
            description: "Casual viruses add to 'Power Gain' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(170),
            effect(){
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.175)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",72))
            },
            canAfford() {
                return hasUpgrade("e",61) && player.e.path>=1 && player.e.infections.gte(170)
            },
            pay() {
                player.e.spent = player.e.spent.add(170)
                player.e.path -=1
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        73: {
            title: "73",
            description: "Casual viruses boost infecter base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(220),
            effect(){
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.65)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",73))+"x"
            },
            canAfford() {
                return hasUpgrade("e",72) && player.e.infections.gte(220)
            },
            pay() {
                player.e.spent = player.e.spent.add(220)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        74: {
            title: "83",
            description: "Casual viruses boost 'Infected Casuals'.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(280),
            effect(){
                let eff = player.f.virus.add(10).max(10)
                eff = eff.log10().pow(0.35)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",74))
            },
            canAfford() {
                return hasUpgrade("e",73) && player.e.infections.gte(280)
            },
            pay() {
                player.e.spent = player.e.spent.add(280)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        75: {
            title: "91",
            description: "Total infected infections boost 'Power Gain' base.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(800),
            effect(){
                let eff = player.e.in.div(200).add(1).max(1)
                if (eff.gte("e1400")) eff = eff.div("e1400").log10().pow(0.5).pow10().mul("e1400")
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",75))+"x"
                if (upgradeEffect("e",75).gte("e1400")) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return (hasUpgrade("e",64) || hasUpgrade("e",71) || hasUpgrade("e",74)) && player.e.infections.gte(800)
            },
            pay() {
                player.e.spent = player.e.spent.add(800)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        76: {
            title: "101",
            description: "'Virus Exponent' softcap is weaker.",
            currencyDisplayName: "infected infections",
            currencyInternalName: "infections",
            currencyLayer: "e",
            cost: new Decimal(800),
            canAfford() {
                return (hasUpgrade("e",75)) && player.e.infections.gte(800)
            },
            pay() {
                player.e.spent = player.e.spent.add(800)
            },
            unlocked() {
                return hasMilestone("e",1)
            }
        },
        81: {
            title: "Infectious Quarantine",
            description: "Infectious diseases boosts UC gain and 'More Exponenter' buys ^10 more.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(1e4),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().pow(0.15)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",81))+"x"
            },
            canAfford() {
                return player.e.qc.gte(1e4)
            },
            pay() {
                player.e.qc = player.e.qc.sub(1e4)
                player.e.upgg.push(81)
            },
            unlocked() {
                return hasUpgrade("e",46)
            }
        },
        82: {
            title: "Unquarantined Infection",
            description: "UI boosts infected infection gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(3e5),
            effect(){
                let eff = player.e.qt.add(1).max(1).pow(0.15)
                if (eff.gte("e1300")) eff = eff.div("e1300").log10().pow(0.5).pow10().mul("e1300")
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",82))+"x"
            },
            canAfford() {
                return player.e.qc.gte(3e5)
            },
            pay() {
                player.e.qc = player.e.qc.sub(3e5)
                player.e.upgg.push(82)
            },
            unlocked() {
                return hasUpgrade("e",81)
            }
        },
        83: {
            title: "Unquarantined Power",
            description: "UC boosts infection power gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(44444444),
            effect(){
                let eff = player.e.qc.add(1).max(1).pow(5000)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",83))+"x"
            },
            canAfford() {
                return player.e.qc.gte(44444444)
            },
            pay() {
                player.e.qc = player.e.qc.sub(44444444)
                player.e.upgg.push(83)
            },
            unlocked() {
                return hasUpgrade("e",82)
            }
        },
        84: {
            title: "Infected Quarantine",
            description: "Infected infections boost UC gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(333333333),
            effect(){
                let eff = player.e.infections.add(1).max(1).pow(0.2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",84))+"x"
            },
            canAfford() {
                return player.e.qc.gte(333333333)
            },
            pay() {
                player.e.qc = player.e.qc.sub(333333333)
                player.e.upgg.push(84)
            },
            unlocked() {
                return hasUpgrade("e",83)
            }
        },
        85: {
            title: "Unquarantined Disease",
            description: "UC boost infectious disease gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(5e15),
            effect(){
                let eff = player.e.qc.add(1).max(1).pow(2000)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",85))+"x"
            },
            canAfford() {
                return player.e.qc.gte(5e15)
            },
            pay() {
                player.e.qc = player.e.qc.sub(5e15)
                player.e.upgg.push(85)
            },
            unlocked() {
                return hasUpgrade("e",84)
            }
        },
        86: {
            title: "Quarantine Power",
            description: "Infection power boosts UC gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(8e15),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",86))+"x"
            },
            canAfford() {
                return player.e.qc.gte(8e15)
            },
            pay() {
                player.e.qc = player.e.qc.sub(8e15)
                player.e.upgg.push(86)
            },
            unlocked() {
                return hasUpgrade("e",85)
            }
        },
        91: {
            title: "Cased Quarantine",
            description: "Cases boost UC gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(1.5e49),
            effect(){
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",91))+"x"
            },
            canAfford() {
                return player.e.qc.gte(1.5e49)
            },
            pay() {
                player.e.qc = player.e.qc.sub(1.5e49)
                player.e.upgg.push(91)
            },
            unlocked() {
                return hasUpgrade("e",86)
            }
        },
        92: {
            title: "Infected Quarantine",
            description: "Infected infections add to UI gain exponent.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(6.565e65),
            effect(){
                let eff = player.e.infections.add(10).max(10)
                eff = eff.log10().pow(2).div(50)
                if (eff.gte(2)) eff = eff.div(2).pow(0.3).mul(2)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",92))
            },
            canAfford() {
                return player.e.qc.gte(6.565e65)
            },
            pay() {
                player.e.qc = player.e.qc.sub(6.565e65)
                player.e.upgg.push(92)
            },
            unlocked() {
                return hasUpgrade("e",91)
            }
        },
        93: {
            title: "Unquarantined Boost",
            description: "Infected infections add to 'Cases Boost' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(1e72),
            effect(){
                let eff = player.e.infections.add(10).max(10)
                eff = eff.log10().div(100)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",93))
            },
            canAfford() {
                return player.e.qc.gte(1e72)
            },
            pay() {
                player.e.qc = player.e.qc.sub(1e72)
                player.e.upgg.push(93)
            },
            unlocked() {
                return hasUpgrade("e",92)
            }
        },
        94: {
            title: "Quarantine Infecter",
            description: "Infecters add to UI gain exponent.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(7.575e75),
            effect(){
                let eff = player.e.points.add(1).max(1).div(50)
                if (hasUpgrade("e",174)) eff = eff.pow(upgradeEffect("e",174))
                if (eff.gte(450)) eff = eff.div(450).pow(0.1).mul(450)
                if (eff.gte(1e13)) eff = eff.log10().sub(3).pow(13)
                if (eff.gte(1e25)) eff = eff.log10().mul(4).pow(12.5)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",94))
            },
            canAfford() {
                return player.e.qc.gte(7.575e75)
            },
            pay() {
                player.e.qc = player.e.qc.sub(7.575e75)
                player.e.upgg.push(94)
            },
            unlocked() {
                return hasUpgrade("e",93)
            }
        },
        95: {
            title: "Unquarantined Immunity",
            description: "UC divides immunity.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(6.969e106),
            effect(){
                let eff = Decimal.pow(10,player.e.qc.add(10).max(10).log10().pow(2/3))
                if (eff.gte("e5000")) eff = eff.div("e5000").log10().pow(0.7).pow10().mul("e5000")
                if (eff.gte("e15000")) eff = eff.div("e15000").log10().pow(0.7).pow10().mul("e15000")
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",95))
            },
            canAfford() {
                return player.e.qc.gte(6.969e106)
            },
            pay() {
                player.e.qc = player.e.qc.sub(6.969e106)
                player.e.upgg.push(95)
            },
            unlocked() {
                return hasUpgrade("e",94)
            }
        },
        96: {
            title: "UnQuarantine",
            description: "UC boosts Quarantine exponent and Quarantine buyables cost nothing.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(2.222e110),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10()
                eff = eff.add(10).max(10).log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",96))+"x"
            },
            canAfford() {
                return player.e.qc.gte(2.222e110)
            },
            pay() {
                player.e.qc = player.e.qc.sub(2.222e110)
                player.e.upgg.push(96)
            },
            unlocked() {
                return hasUpgrade("e",95)
            }
        },
        101: {
            title: "Self Unquarantine",
            description: "UC boosts itself, imm. eff. is stronger at eee16 eff.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal(1e248),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10().pow(3)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",101))+"x"
            },
            canAfford() {
                return player.e.qc.gte(1e248)
            },
            pay() {
                player.e.qc = player.e.qc.sub(1e248)
                player.e.upgg.push(101)
            },
            unlocked() {
                return hasUpgrade("e",96)
            }
        },
        102: {
            title: "Infected Self",
            description: "Infected infections boost 'Self Infection'.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("3.16e316"),
            effect(){
                let eff = player.e.infections.add(10).max(10).log10().add(10).max(10).log10().pow(0.7)
                if (eff.gte(1.8)) eff = eff.div(1.8).pow(0.2).mul(1.8)
                return eff
            },
            effectDisplay(){
                let dis = "^"+format(upgradeEffect("e",102))
                if (upgradeEffect("e",102).gte(1.8)) dis += ' (softcapped)'
                return dis
            },
            canAfford() {
                return player.e.qc.gte("3.16e316")
            },
            pay() {
                player.e.qc = player.e.qc.sub("3.16e316")
                player.e.upgg.push(102)
            },
            unlocked() {
                return hasUpgrade("e",101)
            }
        },
        103: {
            title: "InBoofecsted Power",
            description: "Infected infections boost IN power 2nd effect.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("3.28e328"),
            effect(){
                let eff = player.e.infections.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.6)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",103))
            },
            canAfford() {
                return player.e.qc.gte("3.28e328")
            },
            pay() {
                player.e.qc = player.e.qc.sub("3.28e328")
                player.e.upgg.push(103)
            },
            unlocked() {
                return hasUpgrade("e",102)
            }
        },
        104: {
            title: "Diseased Quarantine",
            description: "Infectious diseases boost Quarantine exponent.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e409"),
            effect(){
                let eff = player.e.diseases.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",104))+"x"
            },
            canAfford() {
                return player.e.qc.gte("e409")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e409")
                player.e.upgg.push(104)
            },
            unlocked() {
                return hasUpgrade("e",103)
            }
        },
        105: {
            title: "Diseasest Boost",
            description: "Add 0.003 to 'Disease Boost' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("6.08e608"),
            canAfford() {
                return player.e.qc.gte("6.08e608")
            },
            pay() {
                player.e.qc = player.e.qc.sub("6.08e608")
                player.e.upgg.push(105)
            },
            unlocked() {
                return hasUpgrade("e",104)
            }
        },
        106: {
            title: "Infected Expower",
            description: "Raise IP exponent to 1.1 and unlock a row of Quarantine buyables.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("6.969e690"),
            canAfford() {
                return player.e.qc.gte("6.969e690")
            },
            pay() {
                player.e.qc = player.e.qc.sub("6.969e690")
                player.e.upgg.push(106)
            },
            unlocked() {
                return hasUpgrade("e",105)
            }
        },
        111: {
            title: "Infected Disease",
            description: "'Disease' boosts 'Infection' after softcap.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(50000),
            effect(){
                let eff = Decimal.add(getVUpgEff(31),1)
                eff = eff.log10().pow(10)
                if (eff.gte("ee18")) eff = Decimal.pow(10,eff.div("ee18").log10().pow(0.85)).mul("ee18")
                return eff
            },
            effectDisplay(){
                let dis = "^"+format(upgradeEffect("e",111))
                if (upgradeEffect("e",111).gte("ee18")) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.diseases.gte(5e4)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(5e4)
                player.e.upgg.push(111)
            },
            unlocked() {
                return hasMilestone("e",2)
            }
        },
        112: {
            title: "Disease Power",
            description: "Infectious diseases boost infection power gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(100000),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().pow(10)
                if (hasUpgrade("e",71)) eff = eff.pow(upgradeEffect("e",71))
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",112))+"x"
            },
            canAfford() {
                return player.e.diseases.gte(1e5)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(1e5)
                player.e.upgg.push(112)
            },
            unlocked() {
                return hasUpgrade("e",111)
            }
        },
        113: {
            title: "Infectious Power",
            description: "Infection power boosts infectious disease gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(1.5e7),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().pow(1.2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",113))+"x"
            },
            canAfford() {
                return player.e.diseases.gte(1.5e7)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(1.5e7)
                player.e.upgg.push(113)
            },
            unlocked() {
                return hasUpgrade("e",112)
            }
        },
        114: {
            title: "Infectious Infecters",
            description: "Add 0.05 to 'Infecter Base' base.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(2.424e24),
            canAfford() {
                return player.e.diseases.gte(2.424e24)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(2.424e24)
                player.e.upgg.push(114)
            },
            unlocked() {
                return hasUpgrade("e",113)
            }
        },
        115: {
            title: "Diseaser",
            description: "Add 0.025 to 'Disease Gain' base.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(3.434e34),
            canAfford() {
                return player.e.diseases.gte(3.434e34)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(3.434e34)
                player.e.upgg.push(115)
            },
            unlocked() {
                return hasUpgrade("e",114)
            }
        },
        116: {
            title: "Disease Immunity",
            description: "Immunity boosts infectious disease gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(5.757e57),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3)
                eff = eff.pow(5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",116))+"x"
            },
            canAfford() {
                return player.e.diseases.gte(5.757e57)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(5.757e57)
                player.e.upgg.push(116)
            },
            unlocked() {
                return hasUpgrade("e",115)
            }
        },
        121: {
            title: "Infected Power",
            description: "Unspent infected infections boost infection power gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(5e117),
            effect(){
                let eff = hasUpgrade("e",132) ? player.e.in.add(1).max(1) : player.e.infections.add(1).max(1)
                eff = Decimal.pow(1.7,eff)
                if (eff.gte("ee5")) eff = eff.log10().pow(2e4)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",121))+"x"
                if (upgradeEffect("e",121).gte("ee5")) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.diseases.gte(5e117)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(5e117)
                player.e.upgg.push(121)
            },
            unlocked() {
                return hasUpgrade("e",116)
            }
        },
        122: {
            title: "Immunity Power",
            description: "Immunity boosts infection power gain",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(4e128),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3)
                eff = eff.pow(31.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",122))+"x"
            },
            canAfford() {
                return player.e.diseases.gte(4e128)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(4e128)
                player.e.upgg.push(122)
            },
            unlocked() {
                return hasUpgrade("e",121)
            }
        },
        123: {
            title: "21 Bulck",
            description: "Infection 21 effect is ^5 and 'More Exponenter' buys 1000x more and 2x faster.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(1.3e130),
            canAfford() {
                return player.e.diseases.gte(1.3e130)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(1.3e130)
                player.e.upgg.push(123)
            },
            unlocked() {
                return hasUpgrade("e",122)
            }
        },
        124: {
            title: "Infected Infectious",
            description: "Unspent infected infections boost infectious disease gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(1.82e182),
            effect(){
                let eff = hasUpgrade("e",132) ? player.e.in.add(1).max(1) : player.e.infections.add(1).max(1)
                eff = Decimal.pow(1.07,eff)
                if (eff.gte("ee5")) eff = eff.log10().pow(2e4)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",124))+"x"
                if (upgradeEffect("e",124).gte("ee5")) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.diseases.gte(1.82e182)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(1.82e182)
                player.e.upgg.push(124)
            },
            unlocked() {
                return hasUpgrade("e",123)
            }
        },
        125: {
            title: "Casual Disease",
            description: "Infectious diseases boost casual virus gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(2.89e289),
            effect(){
                let eff = player.e.diseases.add(1).max(1)
                eff = Decimal.pow(10,eff.log10().pow(0.75)).pow(2e4)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",125))+"x"
            },
            canAfford() {
                return player.e.diseases.gte(2.89e289)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(2.89e289)
                player.e.upgg.push(125)
            },
            unlocked() {
                return hasUpgrade("e",124)
            }
        },
        126: {
            title: "Virus Power",
            description: "Casual viruses boost infection power gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal(5e289),
            effect(){
                let eff = player.f.virus.add(1).max(1)
                eff = Decimal.pow(10,eff.log10().pow(0.75)).pow(0.0011)
                if (eff.gte(Decimal.pow(10,1e14))) eff = eff.div(Decimal.pow(10,1e14)).log10().pow(0.1).mul(Decimal.pow(10,1e14))
                if (player.e.diseases.gte("ee18")) eff = eff.div(Decimal.pow(10,1e14)).pow10().mul(Decimal.pow(10,1e14))
                if (eff.gte(Decimal.pow(10,1e41))) eff = eff.log10().div(10).pow(2.5e39)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",126))+"x"
                if (upgradeEffect("e",126).gte(Decimal.pow(10,1e14))) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.diseases.gte(5e289)
            },
            pay() {
                player.e.diseases = player.e.diseases.sub(5e289)
                player.e.upgg.push(126)
            },
            unlocked() {
                return hasUpgrade("e",125)
            }
        },
        131: {
            title: "Ininfection",
            description: "You can pick another path in the 3 way split.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("e367"),
            canAfford() {
                return player.e.diseases.gte("e367")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("e367")
                player.e.upgg.push(131)
                player.e.path ++
            },
            unlocked() {
                return hasUpgrade("e",126)
            }
        },
        132: {
            title: "Totally Infected",
            description: "Upgrades based on unspent infected infections are based on total.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("4.06e406"),
            canAfford() {
                return player.e.diseases.gte("4.06e406")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("4.06e406")
                player.e.upgg.push(132)
            },
            unlocked() {
                return hasUpgrade("e",131)
            }
        },
        133: {
            title: "Infectious Cases",
            description: "Infectious diseases boost cases exponent.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("5.41e541"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",133))
            },
            canAfford() {
                return player.e.diseases.gte("5.41e541")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("5.41e541")
                player.e.upgg.push(133)
            },
            unlocked() {
                return hasUpgrade("e",132)
            }
        },
        134: {
            title: "Disfectease",
            description: "Infection power adds to 'Disease Gain' base.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("5.49e549"),
            effect(){
                let eff = player.e.p.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.15).div(32.91)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",134))
            },
            canAfford() {
                return player.e.diseases.gte("5.49e549")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("5.49e549")
                player.e.upgg.push(134)
            },
            unlocked() {
                return hasUpgrade("e",133)
            }
        },
        135: {
            title: "Powerful Disease",
            description: "Infectious diseases boost infection power 1st effect.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("e1984"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(2)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",135))
            },
            canAfford() {
                return player.e.diseases.gte("e1984")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("e1984")
                player.e.upgg.push(135)
            },
            unlocked() {
                return hasUpgrade("e",134)
            }
        },
        136: {
            title: "Divided Disease",
            description: "Infectious diseases add to 'Immunity Divider' base.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("e1993"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1).div(200)
                if (eff.gte(0.1)) eff = eff.mul(100).slog().div(10)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",136))
            },
            canAfford() {
                return player.e.diseases.gte("e1993")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("e1993")
                player.e.upgg.push(136)
            },
            unlocked() {
                return hasUpgrade("e",135)
            }
        },
        141: {
            title: "Softer Power",
            description: "Fatality power softcap is weaker.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("e2003"),
            canAfford() {
                return player.e.diseases.gte("e2003")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("e2003")
                player.e.upgg.push(141)
            },
            unlocked() {
                return hasUpgrade("e",136)
            }
        },
        142: {
            title: "Fatal Disease",
            description: "Fatality boosts infectious disease gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("2.004e2004"),
            effect(){
                let eff = player.f.points.add(1).max(1)
                eff = Decimal.pow(10,eff.log10().pow(0.3)).pow(2e-5)
                if (eff.gte("e8e4")) eff = Decimal.pow(10,eff.div("e8e4").log10().pow(0.7)).mul("e8e4")
                if (eff.gte("ee12")) eff = Decimal.pow(10,eff.div("ee12").log10().pow(0.8)).mul("ee12")
                if (eff.gte("ee18")) eff = Decimal.pow(10,eff.div("ee18").log10().pow(0.8)).mul("ee18")
                if (eff.gte("ee26")) eff = eff.log10().div(10).pow(4e24)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",142))+"x"
                if (upgradeEffect("e",142).gte("e8e4")) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.diseases.gte("2.004e2004")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("2.004e2004")
                player.e.upgg.push(142)
            },
            unlocked() {
                return hasUpgrade("e",141)
            }
        },
        143: {
            title: "Fataler Disease",
            description: "Fatality boosts infectious disease effect and dimension autobuyers buy max.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("2.994e2994"),
            effect(){
                let eff = player.f.points.add(10).max(10)
                eff = eff.log10().pow(0.15)
                if (eff.gte(Decimal.pow(10,1000))) eff = eff.log10().pow(1e3/3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",143))
            },
            canAfford() {
                return player.e.diseases.gte("2.994e2994")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("2.994e2994")
                player.e.upgg.push(143)
            },
            unlocked() {
                return hasUpgrade("e",142)
            }
        },
        144: {
            title: "Fatalest Disease",
            description: "Infectious diseases boost fatality power effect.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("3.266e3266"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",144))
            },
            canAfford() {
                return player.e.diseases.gte("3.266e3266")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("3.266e3266")
                player.e.upgg.push(144)
            },
            unlocked() {
                return hasUpgrade("e",143)
            }
        },
        145: {
            title: "Infrection",
            description: "You can pick all paths in the 3 way split.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("6.574e6574"),
            canAfford() {
                return player.e.diseases.gte("6.574e6574")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("6.574e6574")
                player.e.upgg.push(145)
                player.e.path ++
            },
            unlocked() {
                return hasUpgrade("e",144)
            }
        },
        146: {
            title: "Released Diseases",
            description: "Infectious diseases boost 'Release' and unlock a row of buyables.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("7.04e7040"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(3.5)
                if (eff.gte(2.5)) eff = eff.div(2.5).pow(0.25).mul(2.5)
                if (eff.gte(2.7)) eff = eff.div(2.7).pow(0.15).mul(2.7)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",146))
            },
            canAfford() {
                return player.e.diseases.gte("7.04e7040")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("7.04e7040")
                player.e.upgg.push(146)
            },
            unlocked() {
                return hasUpgrade("e",145)
            }
        },
        151: {
            title: "Case Base",
            description: "Cases boost base infectious disease gain.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("6.942e22801"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",151))+"x"
            },
            canAfford() {
                return player.e.diseases.gte("6.942e22801")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("6.942e22801")
                player.e.upgg.push(151)
            },
            unlocked() {
                return hasUpgrade("e",146)
            }
        },
        152: {
            title: "Diseased",
            description: "Infectious diseases divide immnunity and unlock a disease buyable.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("3e36166"),
            effect(){
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(4)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",152))
            },
            canAfford() {
                return player.e.diseases.gte("3e36166")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("3e36166")
                player.e.upgg.push(152)
            },
            unlocked() {
                return hasUpgrade("e",151)
            }
        },
        153: {
            title: "Immune Cases",
            description: "Immunity boosts cases exponent.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("4e84721"),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",153))
            },
            canAfford() {
                return player.e.diseases.gte("4e84721")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("4e84721")
                player.e.upgg.push(153)
            },
            unlocked() {
                return hasUpgrade("e",152)
            }
        },
        154: {
            title: "{Self Capped}",
            description: "Remove 'Self Booster' softcap.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("2e104143"),
            canAfford() {
                return player.e.diseases.gte("2e104143")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("2e104143")
                player.e.upgg.push(154)
            },
            unlocked() {
                return hasUpgrade("e",153)
            }
        },
        155: {
            title: "Infected Scales",
            description: "Cases slow interval scaling.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("e125760"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.15)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",155))+"x"
            },
            canAfford() {
                return player.e.diseases.gte("e125760")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("e125760")
                player.e.upgg.push(155)
            },
            unlocked() {
                return hasUpgrade("e",154)
            }
        },
        156: {
            title: "Powered Powers",
            description: "Cases boost IP and ID effect exponent and unlock a row of IP upgrades.",
            currencyDisplayName: "infectious diseases",
            currencyInternalName: "diseases",
            currencyLayer: "e",
            cost: new Decimal("e171717"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.08)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",156))
            },
            canAfford() {
                return player.e.diseases.gte("e171717")
            },
            pay() {
                player.e.diseases = player.e.diseases.sub("e171717")
                player.e.upgg.push(156)
            },
            unlocked() {
                return hasUpgrade("e",155)
            }
        },
        161: {
            title: "DiseasedTine",
            description: "Infectious diseases add to 'UC Gain' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("1.142e1142"),
            effect(){
                let eff = player.e.diseases.add(10).max(10).log10().pow(0.1).div(20)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",161))
            },
            canAfford() {
                return player.e.qc.gte("1.142e1142")
            },
            pay() {
                player.e.qc = player.e.qc.sub("1.142e1142")
                player.e.upgg.push(161)
            },
            unlocked() {
                return hasUpgrade("e",106)
            }
        },
        162: {
            title: "'UN'Quarantine",
            description: "You can gain UI out of Quarantine.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("1.346e1346"),
            canAfford() {
                return player.e.qc.gte("1.346e1346")
            },
            pay() {
                player.e.qc = player.e.qc.sub("1.346e1346")
                player.e.upgg.push(162)
            },
            unlocked() {
                return hasUpgrade("e",161)
            }
        },
        163: {
            title: "Unquarantined Infrection",
            description: "UC boosts UI gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("1.662e1662"),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10()
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",163))+"x"
            },
            canAfford() {
                return player.e.qc.gte("1.662e1662")
            },
            pay() {
                player.e.qc = player.e.qc.sub("1.662e1662")
                player.e.upgg.push(163)
            },
            unlocked() {
                return hasUpgrade("e",162)
            }
        },
        164: {
            title: "Powered Quarantine",
            description: "IP boosts Quarantine exponent.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("1.736e1736"),
            effect(){
                let eff = player.e.p.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",164))+"x"
            },
            canAfford() {
                return player.e.qc.gte("1.736e1736")
            },
            pay() {
                player.e.qc = player.e.qc.sub("1.736e1736")
                player.e.upgg.push(164)
            },
            unlocked() {
                return hasUpgrade("e",163)
            }
        },
        165: {
            title: "Unquarantined Base",
            description: "Each 'UC Boost' adds 0.005 to 'UI Gain' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e12100"),
            effect(){
                let eff = tmp.e.buyables[53].total.div(200)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",165))
            },
            canAfford() {
                return player.e.qc.gte("e12100")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e12100")
                player.e.upgg.push(165)
            },
            unlocked() {
                return hasUpgrade("e",164)
            }
        },
        166: {
            title: "Fataler Disease",
            description: "Fatality adds to 'Disease Gain' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e17535"),
            effect(){
                let eff = player.f.points.add(10).max(10).log10().add(10).max(10).log10().pow(0.5).div(90)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",166))
            },
            canAfford() {
                return player.e.qc.gte("e17535")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e17535")
                player.e.upgg.push(166)
            },
            unlocked() {
                return hasUpgrade("e",165)
            }
        },
        171: {
            title: "Powerful Unquarantine",
            description: "UC boosts ID effect exponent.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e23100"),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.8)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",171))
            },
            canAfford() {
                return player.e.qc.gte("e23100")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e23100")
                player.e.upgg.push(171)
            },
            unlocked() {
                return hasUpgrade("e",166)
            }
        },
        172: {
            title: "Fatal Unquarantine",
            description: "Fatality boosts UI gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e25095"),
            effect(){
                let eff = player.f.points.add(10).max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",172))+"x"
            },
            canAfford() {
                return player.e.qc.gte("e25095")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e25095")
                player.e.upgg.push(172)
            },
            unlocked() {
                return hasUpgrade("e",171)
            }
        },
        173: {
            title: "Fatal Softcap",
            description: "Fatality boosts IP 2nd effect.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e33222"),
            effect(){
                let eff = player.f.points.add(10).max(10).log10().add(10).max(10).log10().pow(0.02)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",173))
            },
            canAfford() {
                return player.e.qc.gte("e33222")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e33222")
                player.e.upgg.push(173)
            },
            unlocked() {
                return hasUpgrade("e",172)
            }
        },
        174: {
            title: "Fatal Infecter",
            description: "Fatality boosts 'Quarantine Infecter'.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e38550"),
            effect(){
                let eff = player.f.points.add(10).max(10).log10().add(10).max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",174))
            },
            canAfford() {
                return player.e.qc.gte("e38550")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e38550")
                player.e.upgg.push(174)
            },
            unlocked() {
                return hasUpgrade("e",173)
            }
        },
        175: {
            title: "Fataler Unquarantine",
            description: "UC boosts fatality gain.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e170835"),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10().add(10).max(10).log10().pow(2)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",175))
            },
            canAfford() {
                return player.e.qc.gte("e170835")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e170835")
                player.e.upgg.push(175)
            },
            unlocked() {
                return hasUpgrade("e",174)
            }
        },
        176: {
            title: "Infecter Booster",
            description: "Infecters add to 'Cases Base' and 'UC Boost' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e181364"),
            effect(){
                let eff = player.e.points.div(100)
                return eff
            },
            effect2(){
                let eff = player.e.points.div(7e3)
                return eff
            },
            effectDisplay(){
                return "+"+format(tmp.e.upgrades[176].effect)+", +"+format(tmp.e.upgrades[176].effect2)
            },
            canAfford() {
                return player.e.qc.gte("e181364")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e181364")
                player.e.upgg.push(176)
            },
            unlocked() {
                return hasUpgrade("e",175)
            }
        },
        181: {
            title: "QuarUntined Cases",
            description: "UC boosts cases exponent.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e312750"),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10().add(10).max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",181))
            },
            canAfford() {
                return player.e.qc.gte("e312750")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e312750")
                player.e.upgg.push(181)
            },
            unlocked() {
                return hasUpgrade("e",176)
            }
        },
        182: {
            title: "Cased Cases",
            description: "Cases add to 'UC Gain' base.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e337923"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",182))
            },
            canAfford() {
                return player.e.qc.gte("e337923")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e337923")
                player.e.upgg.push(182)
            },
            unlocked() {
                return hasUpgrade("e",181)
            }
        },
        183: {
            title: "Softer Softpower",
            description: "Cases boost IP 2nd effect.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e403270"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.03)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",183))
            },
            canAfford() {
                return player.e.qc.gte("e403270")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e403270")
                player.e.upgg.push(183)
            },
            unlocked() {
                return hasUpgrade("e",182)
            }
        },
        184: {
            title: "Scaled Cases",
            description: "Cases reduce 'Cases Base' cost scaling.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e483180"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.15)
                return eff.min(4e10)
            },
            effectDisplay(){
                return format(upgradeEffect("e",184))+"x"
            },
            canAfford() {
                return player.e.qc.gte("e483180")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e483180")
                player.e.upgg.push(184)
            },
            unlocked() {
                return hasUpgrade("e",183)
            }
        },
        185: {
            title: "Scaled Disease",
            description: "Cases reduce 'Disease Boost' cost scaling.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e629435"),
            effect(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",185))+"x"
            },
            canAfford() {
                return player.e.qc.gte("e629435")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e629435")
                player.e.upgg.push(185)
            },
            unlocked() {
                return hasUpgrade("e",184)
            }
        },
        186: {
            title: "Fatal Scaling",
            description: "MBs boost UC gain, IP 2nd eff, remove Dim sc., unlock a row of IP upgs.",
            currencyDisplayName: "Unquarantined Cases",
            currencyInternalName: "qc",
            currencyLayer: "e",
            cost: new Decimal("e691498"),
            effect(){
                let eff = Decimal.pow(1.15,tmp.f.buyables[33].total)
                return eff
            },
            effect2(){
                let eff = tmp.f.buyables[33].total.add(10).max(10).log10().pow(0.05)
                return eff
            },
            effectDisplay(){
                return format(tmp.e.upgrades[186].effect)+"x, ^"+format(tmp.e.upgrades[186].effect2)
            },
            canAfford() {
                return player.e.qc.gte("e691498")
            },
            pay() {
                player.e.qc = player.e.qc.sub("e691498")
                player.e.upgg.push(186)
            },
            unlocked() {
                return hasUpgrade("e",185)
            }
        },
        191: {
            title: "Distant Infection",
            description: "IP makes Distant Cases Boost scaling start later.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e84170e6"),
            effect(){
                let eff = player.e.p.add(10).max(10).log10().add(10).max(10).log10().pow(4)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",191))+"x"
            },
            canAfford() {
                return player.e.p.gte("e84170e6")
            },
            pay() {
                player.e.p = player.e.p.sub("e84170e6")
                player.e.upgg.push(191)
            },
            unlocked() {
                return hasUpgrade("e",186)
            }
        },
        192: {
            title: "Powerful Bases",
            description: "IP adds to 'UC Gain' and 'Cases Base' base.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e93514e6"),
            effect(){
                let eff = player.e.p.add(10).max(10).log10().add(10).max(10).log10()
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",192))
            },
            canAfford() {
                return player.e.p.gte("e93514e6")
            },
            pay() {
                player.e.p = player.e.p.sub("e93514e6")
                player.e.upgg.push(192)
            },
            unlocked() {
                return hasUpgrade("e",191)
            }
        },
        193: {
            title: "Fatally Quarantined",
            description: "Fatality adds to 'Quarantine Boost' base",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e94777e6"),
            effect(){
                let eff = player.f.points.add(10).max(10).log10().add(10).max(10).log10().pow(0.25).div(150)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",193))
            },
            canAfford() {
                return player.e.p.gte("e94777e6")
            },
            pay() {
                player.e.p = player.e.p.sub("e94777e6")
                player.e.upgg.push(193)
            },
            unlocked() {
                return hasUpgrade("e",192)
            }
        },
        194: {
            title: "Fataler Fatality",
            description: "Fatality power boosts fatality gain and unlock a buyable (no auto).",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e106858e6"),
            effect(){
                let eff = player.f.p.add(10).max(10).log10().add(10).max(10).log10().pow(1.5)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",194))
            },
            canAfford() {
                return player.e.p.gte("e106858e6")
            },
            pay() {
                player.e.p = player.e.p.sub("e106858e6")
                player.e.upgg.push(194)
            },
            unlocked() {
                return hasUpgrade("e",193)
            }
        },
        195: {
            title: "Diseaser Quarantine",
            description: "UC boosts ID effect exponent",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e133627e6"),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10().add(10).max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",195))
            },
            canAfford() {
                return player.e.p.gte("e133627e6")
            },
            pay() {
                player.e.p = player.e.p.sub("e133627e6")
                player.e.upgg.push(195)
            },
            unlocked() {
                return hasUpgrade("e",194)
            }
        },
        196: {
            title: "Powerful Infections",
            description: "IP boosts cases exponent and unlock RNA.",
            currencyDisplayName: "infection power",
            currencyInternalName: "p",
            currencyLayer: "e",
            cost: new Decimal("e31927e7"),
            effect(){
                let eff = player.e.p.add(10).max(10).log10().add(10).max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",196))
            },
            canAfford() {
                return player.e.p.gte("e31927e7")
            },
            pay() {
                player.e.p = player.e.p.sub("e31927e7")
                player.e.upgg.push(196)
            },
            unlocked() {
                return hasUpgrade("e",195)
            }
        },
        201: {
            title: "Ribonucleic",
            description: "RNA boosts UC gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(30),
            effect(){
                let eff = player.e.rna.add(1).max(1).pow(1e5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",201))+"x"
            },
            canAfford() {
                return player.e.rna.gte(30)
            },
            pay() {
                player.e.rna = player.e.rna.sub(30)
                player.e.upgg.push(201)
            },
            unlocked() {
                return hasUpgrade("e",196)
            }
        },
        202: {
            title: "Self RNA",
            description: "RNA boosts RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(60),
            effect(){
                let eff = player.e.rna.add(10).max(10).log10().pow(player.e.rna.add(10).max(10).log10().add(10).max(10).log10().pow(2).add(1).max(1)).max(1)
                if (hasUpgrade("e",224)) eff = eff.pow(upgradeEffect("e",224))
                if (hasUpgrade("e",295)) eff = eff.pow(upgradeEffect("e",295))
                eff = eff.pow(tmp.e.Adeffect)
                if (eff.gte(Decimal.pow(10,5e8))) eff = eff.div(Decimal.pow(10,5e8)).log10().pow(0.85).pow10().mul(Decimal.pow(10,5e8))
                if (eff.gte(Decimal.pow(10,5e9))) eff = eff.log10().mul(2).pow(5e8)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",202))+"x"
                if (upgradeEffect("e",202).gte(Decimal.pow(10,5e8))) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.rna.gte(60)
            },
            pay() {
                player.e.rna = player.e.rna.sub(60)
                player.e.upgg.push(202)
            },
            unlocked() {
                return hasUpgrade("e",201)
            }
        },
        203: {
            title: "Nucleic Acid",
            description: "RNA makes Distant Cases Boost scaling start later.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(666),
            effect(){
                let eff = player.e.rna.add(10).max(10).log10().pow(5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",203))+"x"
            },
            canAfford() {
                return player.e.rna.gte(666)
            },
            pay() {
                player.e.rna = player.e.rna.sub(666)
                player.e.upgg.push(203)
            },
            unlocked() {
                return hasUpgrade("e",202)
            }
        },
        204: {
            title: "Ribose",
            description: "RNA boosts IP effects.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1234),
            effect(){
                let eff = player.e.rna.add(10).max(10).log10().pow(10).mul(50)
                return eff
            },
            effect2(){
                let eff = player.e.rna.add(10).max(10).log10().pow(0.15).div(1.15).max(1)
                if (eff.gte(2)) eff = eff.div(2).pow(1/3).mul(2)
                return eff
            },
            effectDisplay(){
                return "^"+format(tmp.e.upgrades[204].effect)+", ^" + format(tmp.e.upgrades[204].effect2)
            },
            canAfford() {
                return player.e.rna.gte(1234)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1234)
                player.e.upgg.push(204)
            },
            unlocked() {
                return hasUpgrade("e",203)
            }
        },
        205: {
            title: "Macromolecule",
            description: "UC boosts RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(2021),
            effect(){
                let eff = player.e.qc.add(10).max(10).log10().pow(0.15)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",205))+"x"
            },
            canAfford() {
                return player.e.rna.gte(2021)
            },
            pay() {
                player.e.rna = player.e.rna.sub(2021)
                player.e.upgg.push(205)
            },
            unlocked() {
                return hasUpgrade("e",204)
            }
        },
        206: {
            title: "RNA Genome",
            description: "II boosts RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(69420),
            effect(){
                let eff = player.e.infections.add(10).max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",206))+"x"
            },
            canAfford() {
                return player.e.rna.gte(69420)
            },
            pay() {
                player.e.rna = player.e.rna.sub(69420)
                player.e.upgg.push(206)
            },
            unlocked() {
                return hasUpgrade("e",205)
            }
        },
        211: {
            title: "Gene Expression",
            description: "RNA boosts base ID gain, ID boosts cases exp.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(3e10),
            effect(){
                let eff = player.e.rna.add(1).max(1)
                return eff
            },
            effect2(){
                let eff = player.e.diseases.add(10).max(10).log10().add(10).max(10).log10().pow(0.2)
                return eff
            },
            effectDisplay(){
                return format(tmp.e.upgrades[211].effect)+"x, ^"+format(tmp.e.upgrades[211].effect2)
            },
            canAfford() {
                return player.e.rna.gte(3e10)
            },
            pay() {
                player.e.rna = player.e.rna.sub(3e10)
                player.e.upgg.push(211)
            },
            unlocked() {
                return hasUpgrade("e",206)
            }
        },
        212: {
            title: "Nucleotides",
            description: "Cases boost RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(69420666969),
            effect(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(tmp.e.Ceffect)
                if (eff.gte(Decimal.pow(10,2e4))) eff = eff.div(Decimal.pow(10,2e4)).log10().pow(0.7).pow10().mul(Decimal.pow(10,2e4))
                if (eff.gte(Decimal.pow(10,5e6))) eff = eff.log10().div(50).pow(1e6)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",212))+"x"
                if (upgradeEffect("e",212).gte(Decimal.pow(10,2e4))) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.rna.gte(69420666969)
            },
            pay() {
                player.e.rna = player.e.rna.sub(69420666969)
                player.e.upgg.push(212)
            },
            unlocked() {
                return hasUpgrade("e",211)
            }
        },
        213: {
            title: "Single-stranded",
            description: "II makes Distant Cases Boost scaling start later.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e13),
            effect(){
                let eff = player.e.infections.add(10).max(10).log10().pow(1.3)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",213))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e13)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e13)
                player.e.upgg.push(213)
            },
            unlocked() {
                return hasUpgrade("e",212)
            }
        },
        214: {
            title: "Protein Synthesis",
            description() {
                let a = player.e.buyables[72].div(1e3)
                if (a.gte(500)) a = a.div(500).pow(0.3).mul(500)
                let exp = Decimal.add(1.05,a.mul(hasUpgrade("e",246)+0).add(tmp.e.Cyeffect))
                return "Multiply RNA gain by " + format(exp) + " per RNA upgrade squared."
            } ,
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(3e13),
            effect(){
                let eff = player.e.upgrades.filter(number => number>200 && number<270).length
                let exp = Decimal.add(1.05,player.e.buyables[72].mul(hasUpgrade("e",241)/1000)).add(tmp.e.Cyeffect)
                let exp2 = Decimal.add(2,upgradeEffect("e",263).mul(hasUpgrade("e",263)+0)).add(upgradeEffect("e",294).mul(hasUpgrade("e",294)+0))
                eff = Decimal.pow(exp,Decimal.pow(eff,exp2))
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",214))+"x"
            },
            canAfford() {
                return player.e.rna.gte(3e13)
            },
            pay() {
                player.e.rna = player.e.rna.sub(3e13)
                player.e.upgg.push(214)
            },
            unlocked() {
                return hasUpgrade("e",213)
            }
        },
        215: {
            title: "Amino Acids",
            description: "Infecters boost RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1.616e16),
            effect(){
                let exp = new Decimal(1)
                if (hasUpgrade("e",253)) exp = exp.mul(1.25)
                if (hasUpgrade("e",265)) exp = exp.mul(upgradeEffect("e",265))
                let eff = Decimal.pow(1.02,player.e.points.pow(exp))
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",215))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1.616e16)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1.616e16)
                player.e.upgg.push(215)
            },
            unlocked() {
                return hasUpgrade("e",214)
            }
        },
        216: {
            title: "Catalysis",
            description: "RNA boost 'Cases Base' base, reduce its scaling, unlock a buyable.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(5e19),
            effect(){
                let eff = player.e.rna.add(1).max(1).pow(0.15)
                return eff
            },
            effect2(){
                let eff = player.e.rna.add(10).max(10).log10().pow(0.25).min(1e3)
                return eff
            },
            effectDisplay(){
                return format(tmp.e.upgrades[216].effect)+"x, "+format(tmp.e.upgrades[216].effect2)+"x"
            },
            canAfford() {
                return player.e.rna.gte(5e19)
            },
            pay() {
                player.e.rna = player.e.rna.sub(5e19)
                player.e.upgg.push(216)
            },
            unlocked() {
                return hasUpgrade("e",215)
            }
        },
        221: {
            title: "Genetics",
            description: "'DNA' boosts cases.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(2e21),
            effect(){
                let eff = getRUpgEff(12).add(10).max(10).log10().pow(0.86).pow10()
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",221))
            },
            canAfford() {
                return player.e.rna.gte(2e21)
            },
            pay() {
                player.e.rna = player.e.rna.sub(2e21)
                player.e.upgg.push(221)
            },
            unlocked() {
                return hasUpgrade("e",216)
            }
        },
        222: {
            title: "Cased RNA",
            description: "RNA boosts cases exp.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e26),
            effect(){
                let eff = player.e.rna.add(10).max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",222))
            },
            canAfford() {
                return player.e.rna.gte(1e26)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e26)
                player.e.upgg.push(222)
            },
            unlocked() {
                return hasUpgrade("e",221)
            }
        },
        223: {
            title: "Upgraded RNA",
            description: "Infectivity boosts cases exp (boosted by RNA upgrades).",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e28),
            effect(){
                let exp = player.e.upgrades.filter(number => number>200 && number<270).length+1
                let eff = player.i.points.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(Decimal.div(exp,70))
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",223))
            },
            canAfford() {
                return player.e.rna.gte(1e28)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e28)
                player.e.upgg.push(223)
            },
            unlocked() {
                return hasUpgrade("e",222)
            }
        },
        224: {
            title: "Infected RNA",
            description: "II boosts 'Self RNA' and unlock a buyable.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e34),
            effect(){
                let eff = player.e.infections.add(10).max(10).log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",224))
            },
            canAfford() {
                return player.e.rna.gte(1e34)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e34)
                player.e.upgg.push(224)
            },
            unlocked() {
                return hasUpgrade("e",223)
            }
        },
        225: {
            title: "Virus RNA",
            description: "CV boosts RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e48),
            effect(){
                let eff = player.f.virus.add(10).max(10).log10().pow(0.3)
                if (eff.gte(Decimal.pow(10,1e12))) eff = eff.log10().div(100).pow(1e11)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",225))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e48)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e48)
                player.e.upgg.push(225)
            },
            unlocked() {
                return hasUpgrade("e",224)
            }
        },
        226: {
            title: "Atomic",
            description: "RNA boosts 2nd row Infecter buyable bases and unlock Atoms.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e65),
            effect(){
                let eff = player.e.rna.add(1).max(1).pow(0.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",226))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e65)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e65)
                player.e.upgg.push(226)
            },
            unlocked() {
                return hasUpgrade("e",225)
            }
        },
        231: {
            title: "Polymeric",
            description: "'Max Buyable' boosts 2nd row buyable bases.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e73),
            effect(){
                let exp = player.e.buyables[31].pow(1.7777)
                if (hasUpgrade("e",255)) exp = exp.pow(upgradeEffect("e",255))
                if (hasUpgrade("e",282)) exp = exp.pow(upgradeEffect("e",282))
                if (hasUpgrade("e",351)) exp = exp.pow(upgradeEffect("e",351))
                let eff = tmp.e.buyables[31].effect.pow(exp)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",231))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e73)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e73)
                player.e.upgg.push(231)
            },
            unlocked() {
                return hasUpgrade("e",226)
            }
        },
        232: {
            title: "Genetic Information",
            description: "Immunity boosts atom gain and RNA effect.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e103),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3).add(10).max(10).log10().add(10).max(10).log10().pow(1.2)
                return eff
            },
            effect2(){
                let eff = player.e.i.pow(-1).mul(1e3).add(10).max(10).log10().add(10).max(10).log10().pow(0.05)
                return eff
            },
            effectDisplay(){
                return format(tmp.e.upgrades[232].effect)+"x, ^"+format(tmp.e.upgrades[232].effect2)
            },
            canAfford() {
                return player.e.rna.gte(1e103)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e103)
                player.e.upgg.push(232)
            },
            unlocked() {
                return hasUpgrade("e",231)
            }
        },
        233: {
            title: "Ribosomes",
            description: "Each Atom RNA doubles RNA gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e113),
            effect(){
                let eff = Decimal.pow(2,player.e.buyables[81].add(player.e.buyables[82]).add(player.e.buyables[83]).add(player.e.buyables[91]).add(player.e.buyables[92]))
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",233))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e113)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e113)
                player.e.upgg.push(233)
            },
            unlocked() {
                return hasUpgrade("e",232)
            }
        },
        234: {
            title: "Distant Atoms",
            description: "Atomic RNA makes Distant Cases Boost scaling start later.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e148),
            effect(){
                let eff = player.e.at.add(1).max(1)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",234))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e148)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e148)
                player.e.upgg.push(234)
            },
            unlocked() {
                return hasUpgrade("e",233)
            }
        },
        235: {
            title: "Atomic Atoms",
            description: "Each Atom RNA multiplies atom gain by 1.075.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(5e152),
            effect(){
                let exp = player.e.buyables[81].add(player.e.buyables[82]).add(player.e.buyables[83]).add(player.e.buyables[91]).add(player.e.buyables[92])
                if (exp.gte(120)) exp = exp.div(120).pow(0.5).mul(120)
                if (exp.gte(11111)) exp = exp.div(11111).pow(0.3).mul(11111)
                let eff = Decimal.pow(1.075,exp)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",235))+"x"
                let exp = player.e.buyables[81].add(player.e.buyables[82]).add(player.e.buyables[83]).add(player.e.buyables[91]).add(player.e.buyables[92])
                if (exp.gte(120)) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.rna.gte(5e152)
            },
            pay() {
                player.e.rna = player.e.rna.sub(5e152)
                player.e.upgg.push(235)
            },
            unlocked() {
                return hasUpgrade("e",234)
            }
        },
        236: {
            title: "Diseased RNA",
            description: "ID boosts RNA gain and add 0.002 to 'Disease Boost' base.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e217),
            effect(){
                let exp = new Decimal(10)
                if (hasUpgrade("e",283)) exp = exp.pow(upgradeEffect("e",283))
                let eff = player.e.diseases.add(10).max(10).log10().add(10).max(10).log10().pow(exp)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",236))+"x"
            },
            canAfford() {
                return player.e.rna.gte(1e217)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e217)
                player.e.upgg.push(236)
            },
            unlocked() {
                return hasUpgrade("e",235)
            }
        },
        241: {
            title: "Atom Boost",
            description: "DCB 2x later, +0.001 to Pro Syn base, Atoms x1.2 per RNA Boost.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(1e265),
            effect(){
                let eff = Decimal.pow(2,player.e.buyables[72])
                return eff
            },
            effect2(){
                let exp = player.e.buyables[72]
                if (exp.gte(320)) exp = exp.div(320).pow(0.5).mul(320)
                if (exp.gte(3200)) exp = exp.div(3200).pow(0.3).mul(3200)
                let eff = Decimal.pow(1.2,exp)
                return eff
            },
            effectDisplay(){
                let dis = format(tmp.e.upgrades[241].effect)+"x, "+format(tmp.e.upgrades[241].effect2)+"x"
                let exp = player.e.buyables[72]
                if (exp.gte(320)) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.rna.gte(1e265)
            },
            pay() {
                player.e.rna = player.e.rna.sub(1e265)
                player.e.upgg.push(241)
            },
            unlocked() {
                return hasUpgrade("e",236)
            }
        },
        242: {
            title: "Nitrogenous Bases",
            description: "Atomic RNA boosts Atom effects and unlock Molecules.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,317),
            effect(){
                let eff = player.e.at.add(10).max(10).log10().add(10).max(10).log10().pow(0.25).max(1)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",242))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,317))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,317))
                player.e.upgg.push(242)
            },
            unlocked() {
                return hasUpgrade("e",241)
            }
        },
        243: {
            title: "Atomic Boost",
            description: "Atomic RNA boosts RNA, Adenine, and Uracil effects.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,455),
            effect(){
                let eff = player.e.at.add(10).max(10).log10().add(10).max(10).log10().pow(0.2).max(1)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",243))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,455))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,455))
                player.e.upgg.push(243)
            },
            unlocked() {
                return hasUpgrade("e",242)
            }
        },
        244: {
            title: "Molecular Achievement",
            description: "AP boosts RNA gain, and unlock 2 Molecules.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,515),
            effect(){
                let eff = tmp.a.effect.pow(0.1)
                if (hasUpgrade("e",262)) eff = eff.pow(upgradeEffect("e",262))
                if (eff.gte(Decimal.pow(10,1.5e8))) eff = eff.div(Decimal.pow(10,1.5e8)).log10().pow(0.85).pow10().mul(Decimal.pow(10,1.5e8))
                if (eff.gte(Decimal.pow(10,2e10))) eff = eff.log10().div(2).pow(2e9)
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",244))+"x"
                if (upgradeEffect("e",244).gte(Decimal.pow(10,1.5e8))) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,515))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,515))
                player.e.upgg.push(244)
            },
            unlocked() {
                return hasUpgrade("e",243)
            }
        },
        245: {
            title: "Base Pair 1",
            description: "Adenine and Uracil boost each other.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,770),
            effect(){
                let eff = player.e.ur.add(10).log10().pow(0.05)
                return eff
            },
            effect2(){
                let eff = player.e.ad.add(10).log10().pow(0.05)
                return eff
            },
            effectDisplay(){
                return "AD: ^"+format(tmp.e.upgrades[245].effect)+", UR: ^"+format(tmp.e.upgrades[245].effect2)
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,770))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,770))
                player.e.upgg.push(245)
            },
            unlocked() {
                return hasUpgrade("e",244)
            }
        },
        246: {
            title: "Base Pair 2",
            description: "Cytosine and Guanine boost each other, and reduce 'Max Buyable' scaling base by 0.5.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,870),
            effect(){
                let eff = player.e.gu.add(10).log10().pow(0.085)
                return eff
            },
            effect2(){
                let eff = player.e.cy.add(10).log10().pow(0.085)
                return eff
            },
            effectDisplay(){
                return "CY: ^"+format(tmp.e.upgrades[246].effect)+", GU: ^"+format(tmp.e.upgrades[246].effect2)
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,870))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,870))
                player.e.upgg.push(246)
            },
            unlocked() {
                return hasUpgrade("e",245)
            }
        },
        251: {
            title: "Immune RNA",
            description: "RNA boosts immunity exponent.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal("e1005"),
            effect(){
                let eff = player.e.rna.add(10).log10().pow(0.025)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",251))+"x"
            },
            canAfford() {
                return player.e.rna.gte("e1005")
            },
            pay() {
                player.e.rna = player.e.rna.sub("e1005")
                player.e.upgg.push(251)
            },
            unlocked() {
                return hasUpgrade("e",246)
            }
        },
        252: {
            title: "Immune Molecules",
            description: "Molecules boost immunity exponent.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal("5.678e1234"),
            effect(){
                let eff = player.e.ad.add(player.e.ur).add(player.e.cy).add(player.e.gu).add(10).log10().pow(0.03)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",252))+"x"
            },
            canAfford() {
                return player.e.rna.gte("5.678e1234")
            },
            pay() {
                player.e.rna = player.e.rna.sub("5.678e1234")
                player.e.upgg.push(252)
            },
            unlocked() {
                return hasUpgrade("e",251)
            }
        },
        253: {
            title: "Infected Acids",
            description: "'Amino Acids' infecters is ^1.25 and unlock an Atom.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal("e1950"),
            canAfford() {
                return player.e.rna.gte("e1950")
            },
            pay() {
                player.e.rna = player.e.rna.sub("e1950")
                player.e.upgg.push(253)
            },
            unlocked() {
                return hasUpgrade("e",252)
            }
        },
        254: {
            title: "Phosphate Pair",
            description: "Phosphorus boosts Cytosine and Guanine effects.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal("e3500"),
            effect(){
                let eff = player.e.ph.max(10).log10().pow(0.125)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",254))
            },
            canAfford() {
                return player.e.rna.gte("e3500")
            },
            pay() {
                player.e.rna = player.e.rna.sub("e3500")
                player.e.upgg.push(254)
            },
            unlocked() {
                return hasUpgrade("e",253)
            }
        },
        255: {
            title: "Max Atomic",
            description: "A. RNA boosts 'Polymeric' exp and reduce 'Max B.' sc. base by 1.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,4100),
            effect(){
                let eff = player.e.at.max(10).log10().max(10).log10().pow(0.6)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",255))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,4100))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,4100))
                player.e.upgg.push(255)
            },
            unlocked() {
                return hasUpgrade("e",254)
            }
        },
        256: {
            title: "Infected Atoms",
            description: "II boosts Atom gain and unlock a Molecule.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,4510),
            effect(){
                let eff = player.e.infections.max(10).log10().pow(0.1).pow10()
                if (eff.gte(Decimal.pow(10,1e9))) eff = eff.log10().mul(10).pow(1e8)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",256))+"x"
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,4510))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,4510))
                player.e.upgg.push(256)
            },
            unlocked() {
                return hasUpgrade("e",255)
            }
        },
        261: {
            title: "Ribonucleic Atoms",
            description: "RNA boosts Atom gain.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal("e7220"),
            effect(){
                let eff = player.e.rna.max(10).log10().pow(0.1).pow10()
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",261))+"x"
            },
            canAfford() {
                return player.e.rna.gte("e7220")
            },
            pay() {
                player.e.rna = player.e.rna.sub("e7220")
                player.e.upgg.push(261)
            },
            unlocked() {
                return hasUpgrade("e",256)
            }
        },
        262: {
            title: "Phosphate Achievement",
            description: "Ribose-Phosphate (R5P) boosts 'Molecular Achievement'.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal("e9750"),
            effect(){
                let eff = player.e.rna.max(10).log10().pow(0.15)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",262))
            },
            canAfford() {
                return player.e.rna.gte("e9750")
            },
            pay() {
                player.e.rna = player.e.rna.sub("e9750")
                player.e.upgg.push(262)
            },
            unlocked() {
                return hasUpgrade("e",261)
            }
        },
        263: {
            title: "Phosphate Synthesis",
            description: "R5P boosts 'Protein Synthesis' exponent.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,11500),
            effect(){
                let eff = player.e.rna.max(10).log10().max(10).log10().pow(0.12).sub(1)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",263))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,11500))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,11500))
                player.e.upgg.push(263)
            },
            unlocked() {
                return hasUpgrade("e",262)
            }
        },
        264: {
            title: "Atomic Phosphate",
            description: "Atomic RNA boosts R5P effect.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,13000),
            effect(){
                let eff = player.e.at.max(10).log10().pow(0.07)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",264))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,13000))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,13000))
                player.e.upgg.push(264)
            },
            unlocked() {
                return hasUpgrade("e",263)
            }
        },
        265: {
            title: "Infected Phosphate",
            description: "R5P boosts infecter amount in 'Amino Acids' effect.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: Decimal.pow(10,15000),
            effect(){
                let eff = player.e.rp.max(10).log10().max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",265))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,15000))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,15000))
                player.e.upgg.push(265)
            },
            unlocked() {
                return hasUpgrade("e",264)
            }
        },
        266: {
            title: "Molecular RNA",
            description: "RNA boosts At and Mol eff. and gain 100% of molecules per second, and unlock mRNA.",
            currencyDisplayName: "RNA",
            currencyInternalName: "rna",
            currencyLayer: "e",
            cost: new Decimal(Decimal.pow(10,17000)),
            effect(){
                let eff = player.e.rna.add(10).max(10).log10().add(10).max(10).log10().add(10).max(10).log10().pow(0.15)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",266))
            },
            canAfford() {
                return player.e.rna.gte(Decimal.pow(10,17000))
            },
            pay() {
                player.e.rna = player.e.rna.sub(Decimal.pow(10,17000))
                player.e.upgg.push(266)
            },
            unlocked() {
                return hasUpgrade("e",265)
            }
        },
        271: {
            title: "Messenger RNA",
            description: "RNA boosts mRNA gain.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(10),
            effect(){
                let eff = player.e.rna.max(10).log10().max(10).log10()
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",271))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(10)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(10)
                player.e.upgg.push(271)
            },
            unlocked() {
                return hasUpgrade("e",266)
            }
        },
        272: {
            title: "mRRNA",
            description: "mRNA boosts RNA gain.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(42),
            effect(){
                let eff = player.e.mrna.add(1).max(1).pow(500)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",272))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(42)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(42)
                player.e.upgg.push(272)
            },
            unlocked() {
                return hasUpgrade("e",271)
            }
        },
        273: {
            title: "Immune mRNA",
            description: "mRNA boosts immunity exponent.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(69),
            effect(){
                let eff = player.e.mrna.add(10).max(10).log10().pow(0.2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",273))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(69)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(69)
                player.e.upgg.push(273)
            },
            unlocked() {
                return hasUpgrade("e",272)
            }
        },
        274: {
            title: "Atomic mRNA",
            description: "Atomic RNA boosts mRNA gain.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(100),
            effect(){
                let eff = player.e.at.add(10).max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",274))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(100)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(100)
                player.e.upgg.push(274)
            },
            unlocked() {
                return hasUpgrade("e",273)
            }
        },
        275: {
            title: "RNA Boost",
            description: "mRNA boosts RNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(420),
            effect(){
                let eff = player.e.mrna.add(10).max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",275))
            },
            canAfford() {
                return player.e.mrna.gte(420)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(420)
                player.e.upgg.push(275)
            },
            unlocked() {
                return hasUpgrade("e",274)
            }
        },
        276: {
            title: "Achievement Boost",
            description: "mRNA boosts AP exponent.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(666),
            effect(){
                let eff = player.e.mrna.add(10).max(10).log10().pow(0.125)
                return eff.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",276))
            },
            canAfford() {
                return player.e.mrna.gte(666)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(666)
                player.e.upgg.push(276)
            },
            unlocked() {
                return hasUpgrade("e",275)
            }
        },
        281: {
            title: "Self Upgrade",
            description: "mRNA boosts itself (boosted by mRNA upgrades).",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(1e3),
            effect(){
                let exp = player.e.upgrades.filter(number => number>270).length
                if (hasUpgrade("e",314)) exp = Decimal.pow(exp,upgradeEffect("e",314))
                let eff = player.e.mrna.add(10).max(10).log10().pow(Decimal.div(exp,3))
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",281))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(1e3)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(1e3)
                player.e.upgg.push(281)
            },
            unlocked() {
                return hasUpgrade("e",276)
            }
        },
        282: {
            title: "PolymRNA",
            description: "mRNA boosts 'Polymeric' exponent.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(5e4),
            effect(){
                let eff = player.e.mrna.add(10).max(10).log10().pow(0.07)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",282))
            },
            canAfford() {
                return player.e.mrna.gte(5e4)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(5e4)
                player.e.upgg.push(282)
            },
            unlocked() {
                return hasUpgrade("e",281)
            }
        },
        283: {
            title: "Diseased mRNA",
            description: "mRNA boosts 'Diseased RNA' exponent.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(1e5),
            effect(){
                let eff = player.e.mrna.add(10).max(10).log10().add(10).max(10).log10().pow(0.8).mul(3)
                return eff.min(7)
            },
            effectDisplay(){
                let dis = "^"+format(upgradeEffect("e",283))
                if (upgradeEffect("e",283).gte(7)) dis += " (hardcapped)"
                return dis
            },
            canAfford() {
                return player.e.mrna.gte(1e5)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(1e5)
                player.e.upgg.push(283)
            },
            unlocked() {
                return hasUpgrade("e",282)
            }
        },
        284: {
            title: "Molecular mRNA",
            description: "mRNA boosts Atom and Molecule effects.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(25e4),
            effect(){
                let eff = player.e.mrna.add(10).max(10).log10().add(10).max(10).log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",284))
            },
            canAfford() {
                return player.e.mrna.gte(25e4)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(25e4)
                player.e.upgg.push(284)
            },
            unlocked() {
                return hasUpgrade("e",283)
            }
        },
        285: {
            title: "mRNA Boost",
            description: "RNA boosts mRNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(5e5),
            effect(){
                let eff = player.e.rna.add(10).max(10).log10().add(10).max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",285))
            },
            canAfford() {
                return player.e.mrna.gte(5e5)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(5e5)
                player.e.upgg.push(285)
            },
            unlocked() {
                return hasUpgrade("e",284)
            }
        },
        286: {
            title: "Cased mRNA",
            description: "Cases boosts mRNA gain and imm exp, unlock a buyable.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(25e5),
            effect(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10()
                .add(10).max(10).log10().pow(0.75)
                return eff
            },
            effect2(){
                let eff = tmp.e.cases.add(10).max(10).log10().add(10).max(10).log10()
                .add(10).max(10).log10().pow(0.05)
                return eff
            },
            effectDisplay(){
                return format(tmp.e.upgrades[286].effect)+"x, " + format(tmp.e.upgrades[286].effect2)+"x"
            },
            canAfford() {
                return player.e.mrna.gte(25e5)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(25e5)
                player.e.upgg.push(286)
            },
            unlocked() {
                return hasUpgrade("e",285)
            }
        },
        291: {
            title: "Atomic Booster",
            description: "Atomic RNA boosts mRNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(2e14),
            effect(){
                let eff = player.e.at.add(10).max(10).log10().add(10).max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",291))
            },
            canAfford() {
                return player.e.mrna.gte(2e14)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(2e14)
                player.e.upgg.push(291)
            },
            unlocked() {
                return hasUpgrade("e",286)
            }
        },
        292: {
            title: "mMNA",
            description: "Add 0.015 to mRNA gain exp per 'mRNA Gain' bought.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(5e16),
            effect(){
                let eff = player.e.buyables[93].mul(0.015)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",292))
            },
            canAfford() {
                return player.e.mrna.gte(5e16)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(5e16)
                player.e.upgg.push(292)
            },
            unlocked() {
                return hasUpgrade("e",291)
            }
        },
        293: {
            title: "Diseaser mRNA",
            description: "Add 0.003 to 'Disease Boost' base  and unlock a buyable.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(2e21),
            canAfford() {
                return player.e.mrna.gte(2e21)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(2e21)
                player.e.upgg.push(293)
            },
            unlocked() {
                return hasUpgrade("e",292)
            }
        },
        294: {
            title: "mRNA Synthesis",
            description: "mRNA adds to 'Protein Synthesis' exp.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(5e30),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(1.1)
                if (eff.gte(2.4)) eff = eff.div(2.4).pow(0.3).mul(2.4)
                return eff.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",294))
            },
            canAfford() {
                return player.e.mrna.gte(5e30)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(5e30)
                player.e.upgg.push(294)
            },
            unlocked() {
                return hasUpgrade("e",293)
            }
        },
        295: {
            title: "Self Boostest",
            description: "mRNA boosts 'Self RNA'.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(4e37),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",295))
            },
            canAfford() {
                return player.e.mrna.gte(4e37)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(4e37)
                player.e.upgg.push(295)
            },
            unlocked() {
                return hasUpgrade("e",294)
            }
        },
        296: {
            title: "Maxer Scaling",
            description: "Reduce 'Max Buyable' scaling base by 0.35.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(1e45),
            canAfford() {
                return player.e.mrna.gte(1e45)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(1e45)
                player.e.upgg.push(296)
            },
            unlocked() {
                return hasUpgrade("e",295)
            }
        },
        301: {
            title: "Infected mRNA",
            description: "Infecters boost mRNA gain.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(1e53),
            effect(){
                let inf = player.e.points
                if (hasUpgrade("e",334)) inf = inf.pow(1.1)
                let eff = Decimal.pow(1.01,inf.sub(20000).max(0))
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",301))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(1e53)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(1e53)
                player.e.upgg.push(301)
            },
            unlocked() {
                return hasUpgrade("e",296)
            }
        },
        302: {
            title: "Cased Boost",
            description: "Cases boost mRNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(3e75),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10().pow(0.05)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",302))
            },
            canAfford() {
                return player.e.mrna.gte(3e75)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(3e75)
                player.e.upgg.push(302)
            },
            unlocked() {
                return hasUpgrade("e",301)
            }
        },
        303: {
            title: "Upgraded Exp",
            description: "Cases exp is squared per upg per 'mRNA Gain'.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(8.888e88),
            effect(){
                let exp = player.e.upgrades.filter(number => number>270).length
                if (hasUpgrade("e",314)) exp = Decimal.pow(exp,upgradeEffect("e",314).pow(20))
                let eff = Decimal.pow(2,exp).pow(tmp.e.buyables[93].total)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",303))
            },
            canAfford() {
                return player.e.mrna.gte(8.888e88)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(8.888e88)
                player.e.upgg.push(303)
            },
            unlocked() {
                return hasUpgrade("e",302)
            }
        },
        304: {
            title: "Cased RRNA",
            description: "Cases boost RNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(2e100),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10().pow(0.03)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",304))
            },
            canAfford() {
                return player.e.mrna.gte(2e100)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(2e100)
                player.e.upgg.push(304)
            },
            unlocked() {
                return hasUpgrade("e",303)
            }
        },
        305: {
            title: "Immuner mRNA",
            description: "Immunity boosts mRNA gain and unlock a buyable.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(35e115),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3).max(10).log10().pow(0.7)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",305))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(35e115)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(35e115)
                player.e.upgg.push(305)
            },
            unlocked() {
                return hasUpgrade("e",304)
            }
        },
        306: {
            title: "Soft RNA",
            description: "RNA 2nd eff softcap is weaker.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(2e176),
            canAfford() {
                return player.e.mrna.gte(2e176)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(2e176)
                player.e.upgg.push(306)
            },
            unlocked() {
                return hasUpgrade("e",305)
            }
        },
        311: {
            title: "mRNA Caser",
            description: "mRNA boosts cases exp<sup>2</sup>, mRNA effect exp is ^1.1.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(1e219),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(0.05)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",311))
            },
            canAfford() {
                return player.e.mrna.gte(1e219)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(1e219)
                player.e.upgg.push(311)
            },
            unlocked() {
                return hasUpgrade("e",306)
            }
        },
        312: {
            title: "Cased Atoms",
            description: "Cases boost Atom and Molecule effects.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(5e262),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10()
                .max(10).log10().pow(0.03)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",312))
            },
            canAfford() {
                return player.e.mrna.gte(5e262)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(5e262)
                player.e.upgg.push(312)
            },
            unlocked() {
                return hasUpgrade("e",311)
            }
        },
        313: {
            title: "Cased Immunity",
            description: "Cases boost Immunity exp and unlock a buyable.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: new Decimal(5e291),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10().pow(0.03)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",313))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(5e291)
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(5e291)
                player.e.upgg.push(313)
            },
            unlocked() {
                return hasUpgrade("e",312)
            }
        },
        314: {
            title: "Cased Upgrades",
            description: "Cases boost Upg amt. in 'Self Upg', 'mRNA Gain', and 'Upg Exp', +0.005 Dis. Boost base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,435),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10()
                .max(10).log10().pow(0.02)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",314))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,435))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,435))
                player.e.upgg.push(314)
            },
            unlocked() {
                return hasUpgrade("e",313)
            }
        },
        315: {
            title: "cRNA",
            description: "Cases add to mRNA exponent.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,718).mul(3),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10().pow(0.05)
                if (eff.gte(6e4)) eff = eff.div(6).log10().mul(2).pow(1/3).mul(3e4)
                return eff.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",315))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,718).mul(3))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,718).mul(3))
                player.e.upgg.push(315)
            },
            unlocked() {
                return hasUpgrade("e",314)
            }
        },
        316: {
            title: "Mutation",
            description: "Cases boost mRNA effect exp and unlock MMNA.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,921.699),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10()
                .max(10).log10().pow(0.1)
                if (eff.gte(1.38)) eff = eff.div(1.38).pow(0.25).mul(1.38)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",316))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,921.699))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,921.699))
                player.e.upgg.push(316)
            },
            unlocked() {
                return hasUpgrade("e",315)
            }
        },
        321: {
            title: "Mutated MRNA",
            description: "MMNA adds to mRNA exponent.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,1101).mul(5),
            effect(){
                let eff = player.e.mm.pow(0.7).div(10)
                if (eff.gte(4)) eff = eff.div(4).pow(0.07).mul(4)
                if (eff.gte(1e4)) eff = eff.log10().pow(0.5).mul(5e3)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",321))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1101).mul(5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1101).mul(5))
                player.e.upgg.push(321)
            },
            unlocked() {
                return hasUpgrade("e",316)
            }
        },
        322: {
            title: "Cheaper Mutations",
            description: "Reduce Mutation scaling by 15%.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,1432).mul(7),
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1432).mul(7))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1432).mul(7))
                player.e.upgg.push(322)
            },
            unlocked() {
                return hasUpgrade("e",321)
            }
        },
        323: {
            title: "MuRNA",
            description: "mRNA boosts MMNA limit and Cytosine effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,1578).mul(2),
            effect(){
                let eff = player.e.mrna.max(10).log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",323))+"x, ^"+format(upgradeEffect("e",323).pow(1.6))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1578).mul(2))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1578).mul(2))
                player.e.upgg.push(323)
            },
            unlocked() {
                return hasUpgrade("e",322)
            }
        },
        324: {
            title: "Mutated Scaling",
            description: "mRNA reduces Mutation scaling and boosts MMNA gain, shift buys 10.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,1948).mul(4),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(0.151)
                return eff
            },
            effect2(){
                let eff = player.e.mrna.max(10).log10().max(10).log10()
                return eff
            },
            effectDisplay(){
                return "/"+format(tmp.e.upgrades[324].effect)+", x"+format(tmp.e.upgrades[324].effect2)
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1948).mul(4))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1948).mul(4))
                player.e.upgg.push(324)
            },
            unlocked() {
                return hasUpgrade("e",323)
            }
        },
        325: {
            title: "Scaled mRNA",
            description: "mRNA boosts cases exp<sup>2</sup>, RNA makes 20,000 infecter scaling start later.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,2485.699),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(0.04)
                return eff
            },
            effect2(){
                let eff = player.e.rna.max(10).log10().max(10).log10().pow(2).mul(20)
                return eff.floor()
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",325))+", +"+formatWhole(tmp.e.upgrades[325].effect2)
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,2485.699))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,2485.699))
                player.e.upgg.push(325)
            },
            unlocked() {
                return hasUpgrade("e",324)
            }
        },
        326: {
            title: "Cased MMNA",
            description: "Cases boost MMNA limit and effect, unlock 3 MMNA buyables.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,3065).mul(6),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10()
                .max(10).log10().max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",326))+"x, ^"+format(upgradeEffect("e",326).pow(2.5))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,3065).mul(6))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,3065).mul(6))
                player.e.upgg.push(326)
            },
            unlocked() {
                return hasUpgrade("e",325)
            }
        },
        331: {
            title: "RMNA",
            description: "RNA boost MMNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,3751),
            effect(){
                let eff = player.e.rna.max(10).log10().max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",331))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,3751))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,3751))
                player.e.upgg.push(331)
            },
            unlocked() {
                return hasUpgrade("e",326)
            }
        },
        332: {
            title: "BULCKED Mutations",
            description: "mRNA boost Reward 1 and 2, shift buys 100x more.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,4212).mul(3),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(0.3)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",332))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,4212).mul(3))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,4212).mul(3))
                player.e.upgg.push(332)
            },
            unlocked() {
                return hasUpgrade("e",331)
            }
        },
        333: {
            title: "CHEAPENER",
            description: "Mutations reduce 'MMNA Virus' and Mutation scaling, mRNA effect exp^1.125.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,4670).mul(1.5),
            effect(){
                let eff = player.e.mu.add(2).pow(0.5)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",333))+", /"+format(upgradeEffect("e",333).pow(0.07))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,4670).mul(1.5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,4670).mul(1.5))
                player.e.upgg.push(333)
            },
            unlocked() {
                return hasUpgrade("e",332)
            }
        },
        334: {
            title: "Infected MMNA",
            description: "A. RNA boosts Mutation chance and MMNA lim, base MMNA gain^1.25, inf amt in 'Infected mRNA' ^1.1.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,5613).mul(2),
            effect(){
                let eff = player.e.at.max(10).log10().pow(0.2)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",334))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,5613).mul(2))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,5613).mul(2))
                player.e.upgg.push(334)
            },
            unlocked() {
                return hasUpgrade("e",333)
            }
        },
        335: {
            title: "Atomic Chance",
            description: "A. RNA increases 'Chance Boost' base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,6937).mul(6),
            effect(){
                let eff = player.e.at.max(10).log10().max(10).log10().div(7)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",335))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,6937).mul(6))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,6937).mul(6))
                player.e.upgg.push(335)
            },
            unlocked() {
                return hasUpgrade("e",334)
            }
        },
        336: {
            title: "Atomic Mutations",
            description: "<span style='font-size:9px;'>A. RNA increases 'MMNA Boost' base,'RNA Booster' soft. start +2, MMNA eff^1.25, Shift buys 10x.</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,7940).mul(2),
            effect(){
                let eff = player.e.at.max(10).log10().max(10).log10().div(30)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",336))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,7940).mul(2))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,7940).mul(2))
                player.e.upgg.push(336)
            },
            unlocked() {
                return hasUpgrade("e",335)
            }
        },
        341: {
            title: "Alteration",
            description: "Infection power boosts mRNA gain.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,11346.6021),
            effect(){
                let eff = player.e.p.max(10).log10().pow(player.e.p.max(10).log10().max(10).log10().pow(0.5))
                if (eff.gte(Decimal.pow(10,5e7))) eff = eff.log10().div(5e7).pow(0.2).mul(5e7).pow10()
                return eff
            },
            effectDisplay(){
                let dis = format(upgradeEffect("e",341))+"x"
                if (upgradeEffect("e",341).gte(Decimal.pow(10,5e7))) dis += " (softcapped)"
                return dis
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,11346.6021))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,11346.6021))
                player.e.upgg.push(341)
            },
            unlocked() {
                return hasUpgrade("e",336)
            }
        },
        342: {
            title: "Replication Errors",
            description: "Infection power boosts Reward 2 and MMNA gain is ^1.2.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,12999),
            effect(){
                let eff = player.e.p.max(10).log10().max(10).log10().pow(0.125)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",342))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,12999))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,12999))
                player.e.upgg.push(342)
            },
            unlocked() {
                return hasUpgrade("e",341)
            }
        },
        343: {
            title: "Immune Mutations",
            description: "Immunity boosts Reward 3 and 'mRNA Gain' softcap starts 50 later.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,14098),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3).max(10).log10().max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",343))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,14098))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,14098))
                player.e.upgg.push(343)
            },
            unlocked() {
                return hasUpgrade("e",342)
            }
        },
        344: {
            title: "Sequence Change ",
            description: "Immunity adds to 'mRNA Booster' base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,15741).mul(4),
            effect(){
                let eff = player.e.i.pow(-1).mul(1e3).max(10).log10().max(10).log10().pow(0.05).div(1e3)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",344))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,15741).mul(4))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,15741).mul(4))
                player.e.upgg.push(344)
            },
            unlocked() {
                return hasUpgrade("e",343)
            }
        },
        345: {
            title: "Genetic Recombination",
            description: "mRNA reduces 'Max Buyable' scaling.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,16974).mul(2),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(0.25)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",345))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,16974).mul(2))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,16974).mul(2))
                player.e.upgg.push(345)
            },
            unlocked() {
                return hasUpgrade("e",344)
            }
        },
        346: {
            title: "Spontaneous Mutations",
            description: "mRNA adds to 'Mutation Scaling' base and unlock a Reward.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,17767).mul(5),
            effect(){
                let eff = player.e.mrna.max(10).log10().max(10).log10().pow(0.005)
                return eff.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",346))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,17767).mul(5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,17767).mul(5))
                player.e.upgg.push(346)
            },
            unlocked() {
                return hasUpgrade("e",345)
            }
        },
        351: {
            title: "Error-prone Replication",
            description: "MMNA boosts 'Polymeric' exp and 'MMNA Boost' base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,18823).mul(5),
            effect(){
                let eff = player.e.mm.max(10).log10().pow(0.2)
                return eff
            },
            effect2(){
                let eff = player.e.mm.max(10).log10().add(10).max(10).log10().pow(0.15)
                return eff.sub(1)
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",351))+", +"+format(tmp.e.upgrades[351].effect2)
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,18823).mul(5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,18823).mul(5))
                player.e.upgg.push(351)
            },
            unlocked() {
                return hasUpgrade("e",346)
            }
        },
        352: {
            title: "Repair Errors",
            description: "Infection power boosts MMNA effect and 'Chance Boost' base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,20229).mul(5),
            effect(){
                let eff = player.e.p.max(10).log10().max(10).log10().pow(1/30)
                return eff
            },
            effect2(){
                let eff = player.e.p.max(10).log10().max(10).log10().pow(0.15)
                return eff.sub(1)
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",352))+", +"+format(tmp.e.upgrades[352].effect2)
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,20229).mul(5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,20229).mul(5))
                player.e.upgg.push(352)
            },
            unlocked() {
                return hasUpgrade("e",351)
            }
        },
        353: {
            title: "Induced Mutations",
            description: "Add 0.05 to 'Chance Boost' base per 'mRNA Booster' bought, MMNA gain ^1.1.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,24079).mul(3),
            effect(){
                let eff = player.e.buyables[101].mul(0.05)
                return eff
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",353))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,24079).mul(3))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,24079).mul(3))
                player.e.upgg.push(353)
            },
            unlocked() {
                return hasUpgrade("e",352)
            }
        },
        354: {
            title: "Mutagens",
            description: "Cases reduce 'Chance Boost' scaling.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,27530).mul(1.5),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10()
                .max(10).log10().pow(0.1)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",354))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,27530).mul(1.5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,27530).mul(1.5))
                player.e.upgg.push(354)
            },
            unlocked() {
                return hasUpgrade("e",353)
            }
        },
        355: {
            title: "Mutant Cases",
            description: "Cases boost Reward 2.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,32390).mul(3),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10()
                .max(10).log10().pow(0.2)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",355))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,32390).mul(3))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,32390).mul(3))
                player.e.upgg.push(355)
            },
            unlocked() {
                return hasUpgrade("e",354)
            }
        },
        356: {
            title: "Mutant Sequences",
            description: "Cases boost Reward 5 and divide Mutation chance and 'MMNA Boost' scaling by 1.1.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,35250),
            effect(){
                let eff = tmp.e.cases.max(10).log10().max(10).log10().max(10).log10()
                .max(10).log10().pow(0.5)
                if (eff.gte(10)) eff = eff.log10().mul(10)
                return eff
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",356))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,35250))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,35250))
                player.e.upgg.push(356)
            },
            unlocked() {
                return hasUpgrade("e",355)
            }
        },
        361: {
            title: "Tautomerism",
            description: "Mutations reduce MMNA buyables exc. 'Mutation Scaling' and chance scaling, shift buys 10,000x.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,38600),
            effect(){
                let eff = player.e.mu.add(1).pow(0.04)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",361))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,38600))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,38600))
                player.e.upgg.push(361)
            },
            unlocked() {
                return hasUpgrade("e",356)
            }
        },
        362: {
            title: "Depurination",
            description: "MMNA reduces Chance scaling.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,67700),
            effect(){
                let eff = player.e.mm.max(10).log10().pow(0.04)
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",362))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,67700))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,67700))
                player.e.upgg.push(362)
            },
            unlocked() {
                return hasUpgrade("e",361)
            }
        },
        363: {
            title: "Deamination",
            description: "MMNA boosts imm exp, attempt amt, and 'Chance Boost' base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,74300),
            effect(){
                let eff = player.e.mm.max(10).log10().pow(2)
                return eff
            },
            effect2(){
                let eff = player.e.mm.max(10).log10().pow(0.5)
                return eff
            },
            effectDisplay(){
                return format(upgradeEffect("e",363))+"x, +"+format(tmp.e.upgrades[363].effect2)
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,74300))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,74300))
                player.e.upgg.push(363)
            },
            unlocked() {
                return hasUpgrade("e",362)
            }
        },
        364: {
            title: "Strand Mispairing",
            description: "'Chance Boost' reduces Chance scaling.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "e",
            cost: Decimal.pow(10,142000),
            effect(){
                let eff = Decimal.pow(1.02,player.e.buyables[105].pow(0.5))
                return eff
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",364))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,142000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,142000))
                player.e.upgg.push(364)
            },
            unlocked() {
                return hasUpgrade("e",363)
            }
        },
        365: { //Nayeon, Jeongyeon, Momo, Sana, Jihyo, Mina, Dahyun, Chaeyoung, Tzuyu
            title: "Replication Slippage",
            description: "Immunity adds to 'Mutation Scaling' base.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,185500),
            effect(){
                let Nayeon = player.e.i.pow(-1).mul(1e3).max(10).log10().max(10).log10()
                .max(10).log10().pow(0.2).div(300)
                return Nayeon
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",365))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,185500))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,185500))
                player.e.upgg.push(365)
            },
            unlocked() {
                return hasUpgrade("e",364)
            }
        },
        366: {
            title: "Hydroxylamine",
            description: "MMNA boosts cases exp<sup>2</sup> and Immunity exp.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,306750),
            effect(){
                let Jeongyeon = player.e.mm.max(10).log10().max(10).log10().pow(0.25)
                return Jeongyeon
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",366))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,306750))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,306750))
                player.e.upgg.push(366)
            },
            unlocked() {
                return hasUpgrade("e",365)
            }
        },
        371: {
            title: "Base Analogs",
            description: "Mutations boost Immunity exp and MMNA effect.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,360000),
            effect(){
                let Momo = player.e.mu.max(10).log10().pow(0.15)
                return Momo
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",371))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,360000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,360000))
                player.e.upgg.push(371)
            },
            unlocked() {
                return hasUpgrade("e",366)
            }
        },
        372: {
            title: "Alkylating Agents",
            description: "Mutations make 'RNA Booster' softcap later and Chance scaling/1.05.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,393393).mul(3.933),
            effect(){
                let Sana = player.e.mu.div(12)
                return Sana.floor()
            },
            effectDisplay(){
                return "+"+formatWhole(upgradeEffect("e",372))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,393393).mul(3.933))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,393393).mul(3.933))
                player.e.upgg.push(372)
            },
            unlocked() {
                return hasUpgrade("e",371)
            }
        },
        373: {
            title: "DNA Adducts",
            description: "IP reduces Mutation(^2), Chance, 'Max Buyable', 'Chance Boost' scaling.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,420420).mul(4.2),
            effect(){
                let Jihyo = player.e.p.max(10).log10().max(10).log10().max(10).log10().pow(0.075)
                return Jihyo
            },
            effectDisplay(){
                return "/"+formatWhole(upgradeEffect("e",373))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,420420).mul(4.2))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,420420).mul(4.2))
                player.e.upgg.push(373)
            },
            unlocked() {
                return hasUpgrade("e",372)
            }
        },
        374: {
            title: "DNA Crosslinkers",
            description: "'Mutation Scaling' boosts 'Chance Boost base' based on Mutations.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,453453).mul(4.53),
            effect(){
                let exp = player.e.mu.pow(0.1).div(2)
                let Mina = tmp.e.buyables[103].effect.pow(exp)
                return Mina
            },
            effectDisplay(){
                return format(upgradeEffect("e",374))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,453453).mul(4.53))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,453453).mul(4.53))
                player.e.upgg.push(374)
            },
            unlocked() {
                return hasUpgrade("e",373)
            }
        },
        375: {
            title: "Oxidative Damage",
            description: "RNA boosts Reward 2 and MMNA effect, 'Immunity Boost' softcap is weaker.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,613000),
            effect(){
                let Dahyun = player.e.rna.max(10).log10().max(10).log10().pow(0.15)
                return Dahyun
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",375))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,613000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,613000))
                player.e.upgg.push(375)
            },
            unlocked() {
                return hasUpgrade("e",374)
            }
        },
        376: {
            title: "Ionizing Radiation",
            description: "<span style='font-size:9px'>RNA reduces 'Mutation Scaling', 'Chance Boost' scaling, Corona Rewards are 50% stronger.</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,688000),
            effect(){
                let Chaeyoung = player.e.rna.max(10).log10().max(10).log10().pow(0.075)
                return Chaeyoung
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",376))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,688000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,688000))
                player.e.upgg.push(376)
            },
            unlocked() {
                return hasUpgrade("e",375)
            }
        },
        381: {
            title: "Chromosome Abnormality",
            description: "<span style='font-size:9px'>ID adds to 'Mutation Scaling' base and it affects chance scaling at reduced rate, Reward 5 ^1.2.</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,868000),
            effect(){
                let Tzuyu = player.e.diseases.max(10).log10().max(10).log10().pow(0.03).div(100)
                if (Tzuyu.gte(0.15)) Tzuyu = Tzuyu.div(0.15).pow(0.1).mul(0.15)
                if (Tzuyu.gte(0.16)) Tzuyu = Tzuyu.div(0.016).log10().pow(0.1).mul(0.16)
                return Tzuyu
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",381))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,868000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,868000))
                player.e.upgg.push(381)
            },
            unlocked() {
                return hasUpgrade("e",376)
            }
        },
        382: {
            title: "Chromosomal Rearrangement",
            description: "<span style='font-size:9px'>ID reduces 'MMNA Virus' and 'Mut Scaling', 'Dis Boost' base +0.005, Shift buys 1e12x, Imm exp^1.1.</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,1093000),
            effect(){
                let Nayeon = player.e.diseases.max(10).log10().max(10).log10().max(10).log10().pow(0.07)
                return Nayeon
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",382))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1093000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1093000))
                player.e.upgg.push(382)
            },
            unlocked() {
                return hasUpgrade("e",381)
            }
        },
        383: {
            title: "Chromosomal Translocation",
            description: "<span style='font-size:9px'>ID reduces mut(^1.65) and chance scaling, and boost att. amt, Imm exp^1.05.</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,1710000),
            effect(){
                let Jeongyeon = player.e.diseases.max(10).log10().max(10).log10().max(10).log10().pow(1/12)
                return Jeongyeon
            },
            effect2(){
                let Jeongyeon = player.e.diseases.max(10).log10().max(10).log10()
                return Jeongyeon
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",383))+", "+format(tmp.e.upgrades[383].effect2)+"x"
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1710000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1710000))
                player.e.upgg.push(383)
            },
            unlocked() {
                return hasUpgrade("e",382)
            }
        },
        384: {
            title: "Chromosomal Inversion",
            description: "MMNA makes 'mRNA Gain' softcap start later, base MMNA gain^1.25.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,2160000),
            effect(){
                let Momo = player.e.mm.max(10).log10().pow(1.5)
                return Momo.floor()
            },
            effectDisplay(){
                return "+"+formatWhole(upgradeEffect("e",384))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,2160000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,2160000))
                player.e.upgg.push(384)
            },
            unlocked() {
                return hasUpgrade("e",383)
            }
        },
        385: {
            title: "Chromosomal Crossover",
            description: "MMNA boosts Reward 1, MMNA gain and Imm exp^1.05.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,3210000),
            effect(){
                let Sana = player.e.mm.max(10).log10().max(10).log10().pow(0.7)
                if (Sana.gte(1.9)) Sana = Sana.div(1.9).pow(0.3).mul(1.9)
                return Sana
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",385))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,3210000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,3210000))
                player.e.upgg.push(385)
            },
            unlocked() {
                return hasUpgrade("e",384)
            }
        },
        386: {
            title: "Interstitial Deletions",
            description: "<span style='font-size:9px'>Mutations boost Imm exp and MMNA eff, Mut sc/1.5, Ch sc/1.025, +5 'RB' sc start, 'CB' base x2.</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,3790000),
            effect(){
                let Jihyo = player.e.mu.add(1).pow(0.025)
                return Jihyo
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",386))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,3790000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,3790000))
                player.e.upgg.push(386)
            },
            unlocked() {
                return hasUpgrade("e",385)
            }
        },
        391: {
            title: "Soft mRNA",
            description: "mRNA makes mRNA buyables sc. weaker, Imm exp and upg amt in 'mRNA Gain'^1.1.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,6600000),
            effect(){
                let Mina = player.e.mrna.max(10).log10().max(10).log10().pow(0.05)
                return Mina
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",391))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,6600000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,6600000))
                player.e.upgg.push(391)
            },
            unlocked() {
                return hasUpgrade("e",386)
            }
        },
        392: {
            title: "Soft MMNA",
            description: "<span style='font-size:9px'>MMNA makes mRNA buyables sc. weaker, Chance sc/1.075, Imm exp^1.15, MMNA gain^1.1, eff exp^1.01.<span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,12600000),
            effect(){
                let Dahyun = player.e.mm.max(10).log10().max(10).log10().pow(0.15)
                return Dahyun
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",392))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,12600000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,12600000))
                player.e.upgg.push(392)
            },
            unlocked() {
                return hasUpgrade("e",391)
            }
        },
        393: {
            title: "<span style='font-size:10px'><b>Maxed Boosters</b></span>",
            description: "<span style='font-size:9px'>Each 'Max Bb' adds 0.001 to 'MMNA Boost' and 1e-4 to 'Mut Sc' base, C Mut sc /1.2, MMNA eff exp^1.02</span>",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,16600000),
            effect(){
                let Chaeyoung = player.e.buyables[31].div(1e3)
                return Chaeyoung
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",393))+", +"+format(upgradeEffect("e",393).div(10))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,16600000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,16600000))
                player.e.upgg.push(393)
            },
            unlocked() {
                return hasUpgrade("e",392)
            }
        },
        394: {
            title: "Mutated Boosters",
            description: "Mutations add to 'mRNA Booster' base, Imm exp^1.1.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,21050000),
            effect(){
                let Tzuyu = player.e.mu.pow(0.5).div(3e3)
                return Tzuyu
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",394))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,21050000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,21050000))
                player.e.upgg.push(394)
            },
            unlocked() {
                return hasUpgrade("e",393)
            }
        },
        395: {
            title: "Mutatest Boostest",
            description: "Mutations add to 'mRNA Booster' 2nd base, Imm exp<sup>2</sup>^1.02.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,30320000),
            effect(){
                let Nayeon = player.e.mu.div(10)
                return Nayeon
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",395))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,30320000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,30320000))
                player.e.upgg.push(395)
            },
            unlocked() {
                return hasUpgrade("e",394)
            }
        },
        396: {
            title: "Corona Boost",
            description: "MMNA boosts Cor Reward 2, unlock a Reward, 'Imm Boost' sc is weaker, Chance sc/1.05.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,41000000),
            effect(){
                let Jeongyeon = player.e.mm.max(10).log10().max(10).log10().pow(1.5)
                return Jeongyeon
            },
            effectDisplay(){
                return format(upgradeEffect("e",396))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,41000000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,41000000))
                player.e.upgg.push(396)
            },
            unlocked() {
                return hasUpgrade("e",395)
            }
        },
        401: {
            title: "Cheap Coronas",
            description: "MMNA reduces Corona Mutation scaling, MMNA gain^1.15.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,71250000),
            effect(){
                let Momo = player.e.mm.max(10).log10().max(10).log10().pow(0.12)
                return Momo
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",401))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,71250000))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,71250000))
                player.e.upgg.push(401)
            },
            unlocked() {
                return hasUpgrade("e",396)
            }
        },
        402: {
            title: "Mutanter",
            description: "Mutations boost Imm exp, Mutations are 1.3x stronger.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,1239e5),
            effect(){
                let Sana = player.e.mu.pow(0.5).div(100).add(1)
                return Sana
            },
            effectDisplay(){
                return "^"+format(upgradeEffect("e",402))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1239e5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1239e5))
                player.e.upgg.push(402)
            },
            unlocked() {
                return hasUpgrade("e",401)
            }
        },
        403: {
            title: "Boosterona",
            description: "<span style='font-size:9px'>mRNA adds to 'mRNA Booster' and 'MMNA Boost' base, +1 eff Corona Mutation, unlock CRNA</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,2115e5),
            effect(){
                let Jihyo = player.e.mrna.max(10).log10().max(10).log10().pow(0.3).div(500)
                return Jihyo
            },
            effect2(){
                let Mina = player.e.mrna.max(10).log10().max(10).log10().pow(0.9).div(40)
                return Mina
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",403))+", +"+format(tmp.e.upgrades[403].effect2)
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,2115e5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,2115e5))
                player.e.upgg.push(403)
            },
            unlocked() {
                return hasUpgrade("e",402)
            }
        },
        404: {
            title: "CR Booster",
            description: "<span style='font-size:9px'>CRNA adds to 'mRNA Booster' base, Reward 2 and Imm exp<sup>2</sup>^1.03, C Mut sc/1.1, unlock a buyable</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,5520e5),
            effect(){
                let Dahyun = powExp(player.e.crna.add(10).max(10),0.2).div(2500)
                return Dahyun
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",404))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,5520e5))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,5520e5))
                player.e.upgg.push(404)
            },
            unlocked() {
                return hasUpgrade("e",403)
            }
        },
        405: {
            title: "Cooster",
            description: "<span style='font-size:9px'>CRNA adds to 'mRNA Booster' 2nd base, upg amt in 'mRNA Gain' ^1.25, C Mut mRNA cost scaling/1.05</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,1300e6),
            effect(){
                let Chaeyoung = powExp(player.e.crna.add(10).max(10),1/6).mul(3)
                return Chaeyoung
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",405))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1300e6))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1300e6))
                player.e.upgg.push(405)
            },
            unlocked() {
                return hasUpgrade("e",404)
            }
        },
        406: {
            title: "Softerona",
            description: "<span style='font-size:9px'>CRNA boosts Corona Reward 2, RNA effect softcap is weaker, Imm exp^1.2, unlock a buyable, +0.1 CRNA gain exp, /1.1 CM mRNA scaling</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,1940e6),
            effect(){
                let Tzuyu = powExp(player.e.crna.add(10).max(10),0.1).pow(0.2)
                return Tzuyu
            },
            effectDisplay(){
                return format(upgradeEffect("e",406))+"x"
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1940e6))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1940e6))
                player.e.upgg.push(406)
            },
            unlocked() {
                return hasUpgrade("e",405)
            }
        },
        411: {
            title: "Corona Corona",
            description: "CRNA adds effective Corona Mutations, +0.15 CRNA gain exp.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,99e8),
            effect(){
                let Nayeon = player.e.crna.max(10).log10().pow(0.7)
                return Nayeon.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",411))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,99e8))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,99e8))
                player.e.upgg.push(411)
            },
            unlocked() {
                return hasUpgrade("e",406)
            }
        },
        412: {
            title: "COMMNA Chance",
            description: "MMNA adds effective Corona Mutations, Chance scaling^0.75, unlock a buyable.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,186e8),
            effect(){
                let Jeongyeon = player.e.mm.max(10).log10().max(10).log10().pow(0.7)
                return Jeongyeon.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",412))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,186e8))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,186e8))
                player.e.upgg.push(412)
            },
            unlocked() {
                return hasUpgrade("e",411)
            }
        },
        413: {
            title: "Corona Scaling",
            description: "CRNA reduces 10 VN chance scaling, CRNA affects att amt, CRNA gain log -0.01.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,324e8),
            effect(){
                let Momo = player.e.crna.max(10).log10().pow(0.09)
                return Momo
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",413))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,324e8))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,324e8))
                player.e.upgg.push(413)
            },
            unlocked() {
                return hasUpgrade("e",412)
            }
        },
        414: {
            title: "mCNA",
            description: "mRNA adds to CRNA exponent, Reward 2 exp^1.02, CRNA gain log -0.01.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,500e8),
            effect(){
                let Sana = player.e.mrna.max(10).log10().max(10).log10().pow(0.05)
                return Sana.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",414))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,500e8))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,500e8))
                player.e.upgg.push(414)
            },
            unlocked() {
                return hasUpgrade("e",413)
            }
        },
        415: {
            title: "Softerer mRNA",
            description: "<span style='font-size:9px'>MMNA limit makes mRNA buyables softcap weaker, 10 VN chance scaling/2, CRNA gain log -0.03</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,713e8),
            effect(){
                let Jihyo = tmp.e.mmlim.max(10).log10().max(10).log10().pow(0.07)
                return Jihyo
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",415))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,713e8))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,713e8))
                player.e.upgg.push(415)
            },
            unlocked() {
                return hasUpgrade("e",414)
            }
        },
        416: {
            title: "CCNA",
            description: "<span style='font-size:9px'>MMNA limit adds to CRNA exponent, C Reward 3 ^3, MMNA lim^1.2, unlock a buyable</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,1405e8),
            effect(){
                let Mina = tmp.e.mmlim.max(10).log10().max(10).log10().pow(0.11)
                return Mina.sub(1)
            },
            effectDisplay(){
                return "+"+format(upgradeEffect("e",416))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,1405e8))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,1405e8))
                player.e.upgg.push(416)
            },
            unlocked() {
                return hasUpgrade("e",415)
            }
        },
        421: {
            title: "Logged MMNA",
            description: "<span style='font-size:9px'>MMNA limit reduces CRNA log, 10 VN ch sc/3, imm exp<sup>2</sup>^1.02, C Reward 3 ^2</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,449e9),
            effect(){
                let Dahyun = tmp.e.mmlim.max(10).log10().max(10).log10().pow(0.01)
                return Dahyun.sub(1).min(0.05)
            },
            effectDisplay(){
                return "-"+format(upgradeEffect("e",421))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,449e9))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,449e9))
                player.e.upgg.push(421)
            },
            unlocked() {
                return hasUpgrade("e",416)
            }
        },
        422: {
            title: "Scaled Corona",
            description: "<span style='font-size:9px'>MMNA limit reduces 10 VN ch sc, Chance sc^0.8, C Mut mRNA sc/1.05, MMNA sc/1.2, unlock a buyable</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,2123e9),
            effect(){
                let Chaeyoung = tmp.e.mmlim.max(10).log10().max(10).log10().pow(0.4)
                return Chaeyoung
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",422))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,2123e9))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,2123e9))
                player.e.upgg.push(422)
            },
            unlocked() {
                return hasUpgrade("e",421)
            }
        },
        423: {
            title: "Mutated Corona",
            description: "<span style='font-size:9px'>MMNA limit reduces MMNA cost scaling, Chance sc^0.8, 'mRNA Booster' base x1.2, 2nd base^1.3, +0.2 CRNA exp</span>.",
            currencyDisplayName: "mRNA",
            currencyInternalName: "mrna",
            currencyLayer: "in",
            cost: Decimal.pow(10,2563e9),
            effect(){
                let Tzuyu = tmp.e.mmlim.max(10).log10().max(10).log10().pow(0.04)
                return Tzuyu
            },
            effectDisplay(){
                return "/"+format(upgradeEffect("e",423))
            },
            canAfford() {
                return player.e.mrna.gte(Decimal.pow(10,2563e9))
            },
            pay() {
                player.e.mrna = player.e.mrna.sub(Decimal.pow(10,2563e9))
                player.e.upgg.push(423)
            },
            unlocked() {
                return hasUpgrade("e",422)
            }
        },
    },
    challenges: { 
        rows: 2,
        cols: 2,
        11: {
            name: "Boostless",
            currencyDisplayName: "cases per second",
            completionLimit: 100000,
            challengeDescription: function() {
                let c11 = "'Cases Boost' is useless."
                if (inChallenge("e", 11)) c11 = c11 + " (In Challenge)"
                if (player.e.c11.gte(1e6)) c11 = c11 + " (Completed)"
                return c11
            },
            canComplete() {
                return getPointGen().gte("ee1664750")
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startIChallenge(11)
                }
            },
            onComplete() {
                player.e.c11 = tmp.e.challenges[11].cp.floor().max(player.e.c11)
            },
            goalDescription: "e1e1,664,750 cases per second",
            cp() { 
                let gain = Decimal.pow(4,getPointGen().add(1).max(1).log10().add(1).max(1).log10().div(1664750).sub(1)).pow(1/5).mul(100).max(player.e.c11)
                if (gain.gte(1e4)) gain = gain.div(1e4).pow(0.2).mul(1e4)
                return gain.min(1e6)
            },
            rewardDescription() {
                let dis = "Infectious Diseases add to 'Cases Boost' base. <br>Challenge Points:" + formatWhole(player.e.c11)
                let next = tmp.e.challenges[11].cp.floor().max(player.e.c11).add(1).max(1)
                if (next.gte(1e4)) next = next.div(1e4).pow(5).mul(1e4)
                next = next.div(100).pow(5).log(4).add(1).max(1).mul(1664750).pow10().sub(1).pow10().sub(1)
                if (inChallenge("e", 11)) {
                    dis += "(+" + formatWhole(tmp.e.challenges[11].cp.sub(player.e.c11).max(0).floor()) + ")"
                    dis += "<br>Next at " + format(next)
                }
                return dis
            },
            rewardEffect() {
                let eff = player.e.diseases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.1).div(1111).mul(player.e.c11.pow(0.3))
                return eff
            },
            rewardDisplay() {
                return "+" + format(this.rewardEffect())
            },
            unlocked(){
                return hasMilestone("e", 3)
            }
        },
        12: {
            name: "Logarithm",
            currencyDisplayName: "cases per second",
            completionLimit: 100000,
            challengeDescription: function() {
                let c11 = "Cases gain is log10(gain)."
                if (inChallenge("e", 12)) c11 = c11 + " (In Challenge)"
                if (player.e.c12.gte(1e6)) c11 = c11 + " (Completed)"
                return c11
            },
            canComplete() {
                return getPointGen().gte("e16349349")
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startIChallenge(12)
                }
            },
            onComplete() {
                player.e.c12 = tmp.e.challenges[12].cp.floor().max(player.e.c12)
            },
            goalDescription: "1e16,349,349 cases per second",
            cp() { 
                let gain =  Decimal.pow(3,getPointGen().add(1).max(1).log10().div(16349349).sub(1)).mul(100).max(player.e.c12)
                if (gain.gte(1e5)) gain = gain.div(1e5).pow(1/6).mul(1e5)
                return gain.min(1e6)
            },
            rewardDescription() {
                let dis = "Cases divide immunity. <br>Challenge Points:" + formatWhole(player.e.c12)
                let next = tmp.e.challenges[12].cp.floor().max(player.e.c12).add(1).max(1)
                if (next.gte(1e5)) next = next.div(1e5).pow(6).mul(1e5)
                next = next.div(100).log(3).add(1).max(1).mul(16349349).pow10().sub(1)
                if (inChallenge("e", 12)) {
                    dis += "(+" + formatWhole(tmp.e.challenges[12].cp.sub(player.e.c12).max(0).floor()) + ")"
                    dis += "<br>Next at " + format(next)
                }
                return dis
            },
            rewardEffect() {
                let eff = tmp.e.cases.add(10).max(10)
                eff = eff.log10().add(10).max(10)
                eff = eff.log10().pow(0.03).div(2.3).mul(player.e.c12.add(1).max(1).log10().pow(0.5))
                if (eff.gte(7)) eff = eff.add(3).log10().add(6)
                return eff.max(1)
            },
            rewardDisplay() {
                return "/" + format(this.rewardEffect())
            },
            unlocked(){
                return hasMilestone("e", 3)
            }
        },
    },
})