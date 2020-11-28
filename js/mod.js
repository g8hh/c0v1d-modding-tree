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
	num: "0.4",
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
    if (player.s.unlocked) gain = gain.mul(tmp.s.severityEff);
    if (inChallenge("u", 22)) gain = Decimal.mul(gain ,c22c)
    if (inChallenge("s", 11)) gain = gain.pow(0.1)
    if (inChallenge("s", 12)) gain = gain.pow(0.01)
    if (inChallenge("s", 21)) gain = gain.pow(0.03)
    if (hasDUpg(43)) gain = gain.pow(getDUpgEff(43))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = ["Current endgame: e4.64e12 cases and e10,450 deaths(v0.4)"]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e4.64e12")) && player.d.points.gte(new Decimal("e10450"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(300000) // Default is 1 hour which is just arbitrarily large
}
