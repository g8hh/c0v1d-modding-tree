let modInfo = {
	name: "Plague Tree (Vorona Cirus Treesease)",
	id: "c0v1d",
	author: "Vorona",
	pointsName: "cases",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 0.0833,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.4.1",
	name: "Vorona Cirus REBALANCING Coughin Dance",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	let can=false
	if(hasVUpg(11)) can = getVUpgEff(11)
	return can
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
    gain = gain.mul(layers.f.effect())
    gain = gain.mul(layers.a.effect())
    if (player.s.unlocked) gain = gain.mul(tmp.s.severityEff);
    if (inChallenge("u", 22)) gain = Decimal.mul(gain ,c22c)
    if (inChallenge("s", 11)) gain = gain.pow(0.1)
    if (inChallenge("s", 12)) gain = gain.pow(0.01)
    if (inChallenge("s", 21)) gain = gain.pow(0.03)
    if (hasDUpg(43)) gain = gain.pow(getDUpgEff(43))
    if (hasFUpg(43)) gain = gain.pow(getFUpgEff(43))
    if (hasFUpg(44)) gain = gain.pow(getFUpgEff(44))
    gain = gain.pow(layers.d.buyables[13].effect())
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = ["Current endgame: all milestones (v0.4.1)"]

// Determines when the game "ends"
function isEndgame() {
	return player.f.total.gte(new Decimal("1.341e154"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(300) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
