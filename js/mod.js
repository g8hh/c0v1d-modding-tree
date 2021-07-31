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
	num: "0.6.9.1",
	name: "Vorona Cirus Adverse GAS GAS GAS",
}

let changelog = `<h1>Changelog:</h1><br>
        v0.6.9.1<br>
        - Fixed In'F'inite CASES Achievement bug.<br>
        <h3>v0.6.9</h3><br>
        - Added 6 Adverse Effect upgrades.<br>
        - Added an Adverse Effect Buyable.<br>
        - Added 2 Achievements.<br>
        <h3>v0.6.8</h3><br>
        - Added Adversities.<br>
        - Added 2 Adverse Effect Buyables.<br>
        - Added 3 Achievements.<br>
        v0.6.7.2<br>
        - Added 2 Achievement Rewards.<br>
        v0.6.7.1<br>
        - Fixed Adverse buyable name and display.<br>
        - Fixed Self Green and ExpoEffect upgrade display bug.<br>
        <h3>v0.6.7</h3><br>
        - Added Adverse Effects.<br>
        - Added 2 Anti-Vaxxer Buyables.<br>
        - Added 3 Achievements.<br>
        <h3>v0.6.6</h3><br>
        - Added Side Effects.<br>
        - Added 4 Anti-Vaxxer Buyables.<br>
        - Added 3 Achievements.<br>
        - Fixed NaN casual bug.<br>
        <h3>v0.6.5</h3><br>
        - Added Anti-Vaxxers.<br>
        - Added an Anti-Masker buyable.<br>
        - Added 3 Anti-Roulette Buyables.<br>
        - Added 7 Achievements.<br>
        - Added Update rate slider.<br>
        <h3>v0.6.4</h3><br>
        - Added Green Bets.<br>
        - Added 4 Anti-Roulette Buyables.<br>
        - Added 4 Achievements.<br>
        - Changed Shift to Ctrl to pin tooltips.<br>
        <h3>v0.6.3</h3><br>
        - Added Anti-Roulette.<br>
        - Added 2 Anti-Masker Buyables.<br>
        - Added 4 Achievements.<br>
        v0.6.2.1<br>
        - Fixed News ticker bug.<br>
        - Fixed OOM/s bug.<br>
        - Fixed Dimension cost bug.<br>
        <h3>v0.6.2</h3><br>
        - Added Anti-Maskers.<br>
        - Added 3 Buyables.<br>
        - Added 2 Achievements.<br>
        <h3>v0.6.1</h3><br>
        - Added 5 Milestones.<br>
        - Added 6 Buyables.<br>
        - Added 4 Achievements.<br>
        <h2 style = color:#93d281;>v0.6</h2><br>
        - Added CTNA.<br>
        - Added 3 more mRNA upgrades.<br>
        - Added 8 more Achievements.<br>
        <h3>v0.5.7</h3><br>
        - Added CRNA.<br>
        - Added 4 Achievements.<br>
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
function getGainMult(){
	let gain = new Decimal(1)
    let c22c = challengeCompletions("u", 11)+challengeCompletions("u", 12)+challengeCompletions("u", 21)+challengeCompletions("u", 22)-5
    c22c = Decimal.add(c22c, 1)
    c22c = Decimal.pow(5, c22c)
    if(hasVUpg(12)) gain = gain.mul(getVUpgEff(12))
    if(hasVUpg(13)) gain = gain.mul(getVUpgEff(13))
    if(hasVUpg(21)) gain = gain.mul(getVUpgEff(21))
    gain = gain.mul(tmp.i.effect).mul(tmp.r.effect).mul(tmp.u.effect).mul(tmp.d.effect).mul(tmp.f.effect).mul(tmp.a.effect).mul(tmp.ct.effect)
    if (player.s.unlocked) gain = gain.mul(tmp.s.severityEff);
    if (inChallenge("u", 22)) gain = Decimal.mul(gain ,c22c)
	return gain
}
function getGainExp(){
	let exp = new Decimal(1)
    if (inChallenge("s", 11)) exp = exp.mul(0.1)
    if (inChallenge("s", 12)) exp = exp.mul(0.01)
    if (inChallenge("s", 21)) exp = exp.mul(0.03)
    if (hasDUpg(43)) exp = exp.mul(getDUpgEff(43))
    if (hasFUpg(43)) exp = exp.mul(getFUpgEff(43))
    if (hasFUpg(44)) exp = exp.mul(getFUpgEff(44))
    if (hasFUpg(95)) exp = exp.mul(getFUpgEff(95))
    if (hasFUpg(125)) exp = exp.mul(getFUpgEff(125))
    if (hasFUpg(143)) exp = exp.mul(tmp.f.upgrades[143].effect2)
    exp = exp.mul(tmp.d.buyables[13].effect)
    exp = exp.mul(tmp.e.peffect)
    if (hasFUpg(156)) exp = exp.mul(getFUpgEff(156))
    if (hasFUpg(157)) exp = exp.mul(tmp.f.upgrades[157].effect2)
    if (hasUpgrade("e",221)) exp = exp.mul(upgradeEffect("e",221))
	return exp
}
function getGainpowExp(){
	let exp = new Decimal(1)
    if (player.e.c.gt(0)) exp = exp.mul(tmp.e.Ceffect)
    if (hasFUpg(144)) exp = exp.mul(getFUpgEff(144))
    if (hasFUpg(176)) exp = exp.mul(getFUpgEff(176))
    if (hasUpgrade("e",133)) exp = exp.mul(upgradeEffect("e",133))
    if (hasUpgrade("e",153)) exp = exp.mul(upgradeEffect("e",153))
    if (hasUpgrade("e",43)) exp = exp.mul(upgradeEffect("e",43))
    if (hasUpgrade("e",181)) exp = exp.mul(upgradeEffect("e",181))
    if (hasUpgrade("e",196)) exp = exp.mul(upgradeEffect("e",196))
    if (hasUpgrade("e",222)) exp = exp.mul(upgradeEffect("e",222))
    if (hasUpgrade("e",223)) exp = exp.mul(upgradeEffect("e",223))
    if (hasUpgrade("e",303)) exp = exp.mul(upgradeEffect("e",303))
    if (hasUpgrade("e",211)) exp = exp.mul(tmp.e.upgrades[211].effect2)
	return exp
}
function getPointGen() {
    let gain = new Decimal(0.1)
    let cap = tmp.e.icap
    if(!canGenPoints()) gain = new Decimal(0)
    gain = gain.mul(getGainMult())
    gain = gain.pow(getGainExp())
    gain = powExp(gain,getGainpowExp())
    if (inChallenge("e",12) || player.e.inC) gain = gain.add(1).log10()
    if (player.e.inC) gain = powExp(gain,tmp.e.qExp)
    if (hasUpgrade("e",311)) gain = powExp2(gain,upgradeEffect("e",311))
    if (hasUpgrade("e",325)) gain = powExp2(gain,upgradeEffect("e",325))
	gain = gain.min(cap)
    if (hasUpgrade("ct",194)) gain = gain.pow(upgradeEffect("ct",194))
    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    newsTotal: new Decimal(0),
    lastSave: new Date().getTime(),
    toggleKeys: false,
    cases: false,
    ca:0,
    infectivity: false,
    ms: 50,
    options:false,
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
		let a = "Current endgame: 6.969e69,696 Adversities (v0.6.9.1)"
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
	return player.ct.Adversity.gte("6.969e69696")
}


// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(180) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
    if(oldVersion=="0.6.3"){
        if (hasAchievement("a",143)) addPoints("a",5)
        if (hasAchievement("a",144)) addPoints("a",5)
	}
    if(oldVersion=="0.6.9"){
        if (player.points.lt(tet10(Decimal.pow(2,1024).log10()))) {
            player.a.achievements.splice(player.a.achievements.indexOf("182"),1)
            addPoints("a",-50)
        }
	}
}
