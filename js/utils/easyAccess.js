function hasUpgrade(layer, id) {
	return (player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString()))
}

function hasMilestone(layer, id) {
	return (player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString()))
}

function hasAchievement(layer, id) {
	return (player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString()))
}

function hasChallenge(layer, id) {
	return (player[layer].challenges[id])
}

function maxedChallenge(layer, id) {
	return (player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit)
}

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}

function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function powExp(n, exp){
	if (n.lt(10)) return n
	return Decimal.pow(10,n.log10().pow(exp))
}

function powExp2(n, exp){
	if (n.lt(1e10)) return n
	return Decimal.pow(10,Decimal.pow(10,n.log10().log10().pow(exp)))
}

function powExp3(n, exp){
	if (n.lt(Decimal.pow(10,1e10))) return n
	return Decimal.pow(10,Decimal.pow(10,Decimal.pow(10,n.log10().log10().log10().pow(exp))))
}

function powSlog(n, exp){
	if (n.lt(10)) return n
	return tet10(slog(n).pow(exp))
}

function slog(n){
	n = new Decimal(n)
	return Decimal.add(n.layer,new Decimal(n.mag).slog())
}

function slogadd(n,add){
	n = new Decimal(n)
	return Decimal.tetrate(10,slog(n).add(add))
}

function tet10(n){
	n = new Decimal(n)
	return Decimal.tetrate(10,n)
}

function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}

function milestoneEffect(layer, id){
	return (tmp[layer].milestones[id].effect)
}

function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
}

function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}