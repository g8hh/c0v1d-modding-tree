let modInfo = {
	name: "Plague Tree (Vorona Cirus Treesease)",
	id: "c0v1d",
	author: "Vorona",
	pointsName: "cases",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 0.05,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5.7",
	name: "Vorona Cirus GAS GAS GAS",
}

let changelog = `<h1>Changelog:</h1><br>
        <h3>v0.5.7</h3><br>
        - Added CRNA.<br>
        - Added 2 Achievements.<br>
        <h3>v0.5.6</h3><br>
        - Added Corona Mutations.<br>
        - Added 2 Achievements.<br>
        <h3>v0.5.5</h3><br>
        - Added MMNA.<br>
        - Added 2 Achievements.<br>
        <h3>v0.5.4</h3><br>
        - Added mRNA.<br>
        - Added 3 Achievements.<br>
        <h3>v0.5.3</h3><br>
        - Added Molecules.<br>
        - Added 3 Achievements.<br>
        <h3>v0.5.2</h3><br>
        - Added RNA.<br>
        - Added 2 Achievements.<br>
        - Added 2 Milestones.<br>
        <h3>v0.5.1</h3><br>
        - Added 6 Infecter and Quarantine Upgrades.<br>
        - Added a buyable.<br>
        - Made the game less laggy<br>
        <h2 style = color:#93d281;>v0.5</h2><br>
        - Added Infecters.<br>
        - Added 7 more CV upgrades.<br>
        - Added 11 more Achievements.<br>
        <h3>v0.4.4</h3><br>
        - Added Casual Virus.<br>
        - Added more Casualty upgrades.<br>
	    <h3>v0.4.3</h3><br>
		- Added News Button.<br>
        - Added Casualty (Infinity in AD).<br>
        <h3>v0.4.2</h3><br>
		- Added News Ticker.<br>
        - Added Fatality Dimension Shifts.<br>
        <h3>v0.4.1</h3><br>
		- Added Fatality.<br>
        - Added Achievements.<br>
        <h2 style = color:#93d281;>v0.4</h2><br>
		- Added Symptom Challenges.<br>
        - Rebalanced.<br>
        <h3>v0.3.3</h3><br>
        - Added Deaths.<br>
        <h3>v0.3.2</h3><br>
		- Added Recoveries.<br>
        - Added more symptom upgrades.<br>
        <h3>v0.3.1</h3><br>
        - Added Symptoms.<br>
        <h2 style = color:#93d281;>v0.3</h2><br>
		- Added Uncoater Challenges.<br>
        - Added more uncoater upgrades.<br>
        <h3>v0.2.2</h3><br>
		- Added more uncoater upgrades.<br>
        - Made 1st uncoater upgrade based on best.<br>
        <h3>v0.2.1</h3><br>
		- Added Uncoaters.<br>
        - Added (hardcapped).<br>
        - Renamed to Plague Tree (Vorona Cirus Treesease).<br>
        <h2 style = color:#93d281;>v0.2</h2><br>
        - Added Statistics.<br>
        - Added Replicators.<br>
        - Added (softcapped).<br>
        - Renamed to Vorona Cirus Treesease.<br>
        <h2 style = color:#93d281;>v0.1</h2><br>
        - Release (COVID Tree).<br>
        - Added Virus Points.<br>
        - Added Cases.<br>
    `
let winText = `Congratulations! You have reached the end and infected this game, but for now...`

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
    gain = gain.mul(tmp.i.effect)
    gain = gain.mul(tmp.r.effect)
    gain = gain.mul(tmp.u.effect)
    gain = gain.mul(tmp.d.effect)
    gain = gain.mul(tmp.f.effect)
    gain = gain.mul(tmp.a.effect)
    if (player.s.unlocked) gain = gain.mul(tmp.s.severityEff);
    if (inChallenge("u", 22)) gain = Decimal.mul(gain ,c22c)
    if (inChallenge("s", 11)) gain = gain.pow(0.1)
    if (inChallenge("s", 12)) gain = gain.pow(0.01)
    if (inChallenge("s", 21)) gain = gain.pow(0.03)
    if (hasDUpg(43)) gain = gain.pow(getDUpgEff(43))
    if (hasFUpg(43)) gain = gain.pow(getFUpgEff(43))
    if (hasFUpg(44)) gain = gain.pow(getFUpgEff(44))
    if (hasFUpg(95)) gain = gain.pow(getFUpgEff(95))
    if (hasFUpg(125)) gain = gain.pow(getFUpgEff(125))
    if (hasFUpg(143)) gain = gain.pow(tmp.f.upgrades[143].effect2)
    gain = gain.pow(tmp.d.buyables[13].effect)
    gain = gain.pow(tmp.e.peffect)
    if (hasFUpg(156)) gain = gain.pow(getFUpgEff(156))
    if (hasFUpg(157)) gain = gain.pow(tmp.f.upgrades[157].effect2)
    if (hasUpgrade("e",221)) gain = gain.pow(upgradeEffect("e",221))
    if (player.e.c.gt(0)) gain = powExp(gain,tmp.e.Ceffect)
    if (hasFUpg(144)) gain = powExp(gain,getFUpgEff(144))
    if (hasFUpg(176)) gain = powExp(gain,getFUpgEff(176))
    if (hasUpgrade("e",133)) gain = powExp(gain,upgradeEffect("e",133))
    if (hasUpgrade("e",153)) gain = powExp(gain,upgradeEffect("e",153))
    if (hasUpgrade("e",43)) gain = powExp(gain,upgradeEffect("e",43))
    if (hasUpgrade("e",181)) gain = powExp(gain,upgradeEffect("e",181))
    if (hasUpgrade("e",196)) gain = powExp(gain,upgradeEffect("e",196))
    if (hasUpgrade("e",222)) gain = powExp(gain,upgradeEffect("e",222))
    if (hasUpgrade("e",223)) gain = powExp(gain,upgradeEffect("e",223))
    if (hasUpgrade("e",303)) gain = powExp(gain,upgradeEffect("e",303))
    if (hasUpgrade("e",211)) gain = powExp(gain,tmp.e.upgrades[211].effect2)
    if (inChallenge("e",12) || player.e.inC) gain = gain.add(1).log10()
    if (player.e.inC) gain = powExp(gain,tmp.e.qExp)
    if (hasUpgrade("e",311)) gain = powExp2(gain,upgradeEffect("e",311))
    if (hasUpgrade("e",325)) gain = powExp2(gain,upgradeEffect("e",325))
	return gain.min(tmp.e.icap)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    newsTotal: new Decimal(0),
    lastSave: new Date().getTime(),
    toggleKeys: false,
    cases: false,
    infectivity: false
}}
var shiftDown = false

window.addEventListener('keydown', function(event) {
	if (player.toggleKeys) {
		if (event.keyCode == 16) shiftDown = !shiftDown;
		if (event.keyCode == 17) controlDown = !controlDown;
	} else {
		if (event.keyCode == 16) shiftDown = true;
		if (event.keyCode == 17) controlDown = true;
	}
}, false);

window.addEventListener('keyup', function(event) {
	if (player.toggleKeys) return 
	if (event.keyCode == 16) shiftDown = false;
	if (event.keyCode == 17) controlDown = false;
}, false);

// Display extra things at the top of the page
var displayThings = [
    function(){
		let a = "Current endgame: e3.689e12 mRNA (v0.5.7)"
		return player.autosave ? a : a + ". Warning: autosave is off"
	},
	function(){
		let a = new Date().getTime() - player.lastSave
		let b = "Last save was " + formatTime(a/1000) + " ago."
		if (lastTenTicks.length < 10) return b
		let c = 0
		for (i = 0; i<10; i++){
			c += lastTenTicks[i] / 10000
		}
		return b + " Average TPS = " + format(c, 3) + "s/tick."
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.e.mrna.gte(Decimal.pow(10,3689e9))
}


// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(180) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
