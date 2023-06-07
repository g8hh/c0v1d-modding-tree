function powExp(n, exp){ // dilate
	if (n.lt(10)) return n
	return Decimal.pow(10,n.log10().pow(exp))
}

function powExp2(n, exp){ // Trilate
	if (n.lt(1e10)) return n
	return Decimal.pow(10,Decimal.pow(10,n.log10().log10().pow(exp)))
}

function powExp3(n, exp){ // Tetralate
	if (n.lt(Decimal.pow(10,1e10))) return n
	return Decimal.pow(10,Decimal.pow(10,Decimal.pow(10,n.log10().log10().log10().pow(exp))))
}

function powExpN(num, n, exp){ // n-late
	num = new Decimal(num)
	exp = new Decimal(exp)
	if (num.lt(tet10(n))) return num
	return slogadd(slogadd(num,-n).pow(exp),n)
}

function mulSlog(n, mul){
	if (n.lt(10)) return n
	return tet10(slog(n).mul(mul))
}

function powSlog(n, exp){ // Vaccinate
	if (n.lt(10)) return n
	return tet10(slog(n).pow(exp))
}

function powSlogExp(n, exp){ //Vaccidilate
	if (n.lt(10)) return n
	return tet10(powExp(slog(n),exp))
}

function slog(n){ // slog10(x), .slog is bugged >=eee9e15
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

// ************ Big Feature related ************
function getTimesRequired(chance, r1){
	chance = new Decimal(chance)
	if (chance.gte(1)) return 1
	if (chance.lte(0)) return Infinity
	if (r1 == undefined) r1 = Math.random()
	//we want (1-chance)^n < r1
	let n
	if (chance.log10().gt(-5)){
			n = Decimal.ln(r1).div(Math.log(1-chance))
	} else {
			n = Decimal.ln(1/r1).div(chance)
	}
	//log(1-chance) of r2
	return n.floor().add(1)
}
function bulkRoll(chance,ms,r1) {
	chance = new Decimal(chance)
	if (r1 == undefined) r1 = Math.random()
	let n = 1-((1-r1)**(50/ms))
	let c = Decimal.log(n,1/Math.E).div(chance)
	return c.floor()
}
function recurse(func, startingValue, times){
	if (times <= 0) return startingValue
	return recurse(func, func(startingValue), times-1)
}

//Tree of life
function getLogisticTimeConstant(current, gain, loss){
	if (current.eq(gain.div(loss))) return Infinity
	if (current.gt(gain.div(loss))) return current.times(loss).sub(gain).ln().div(-1).div(loss)
	return current.times(loss).sub(gain).times(-1).ln().div(-1).div(loss)
}

function logisticTimeUntil(goal, current, gain, loss){
	if (current.gte(goal)) return formatTime(0)
	if (goal.gte(gain.div(loss))) return formatTime(1/0)
	// we have current < goal < gain/loss
	val1 = goal.times(loss) //Bx
	val2 = gain.sub(val1) //A-Bx
	val3 = val2.ln() //ln(A-Bx)
	val4 = val3.times(-1).div(loss) //LHS

	c = getLogisticTimeConstant(current, gain, loss)
	return formatTime(val4.sub(c))  
}

function getLogisticAmount(current, gain, loss, diff){
	if (loss.eq(0)) return current.add(gain.mul(diff))
	if (current.eq(gain.div(loss))) return current
	if (gain.gte("ee10") || loss.gte(1e308)) return gain.div(loss)
	if (current.lt(gain.div(loss))) {
			c = getLogisticTimeConstant(current, gain, loss)
			
			val1 = c.plus(diff) // t+c
			val2 = val1.times(-1).times(loss) // -B(t+c)
			val3 = Decimal.exp(val2) // this should be A-Bx
			val4 = gain.sub(val3) // should be A-(A-Bx) = Bx
			val5 = val4.div(loss) // should be x

			return val5.max(0)
	} else {
			c = getLogisticTimeConstant(current, gain, loss)
			
			val1 = c.plus(diff) // t+c
			val2 = val1.times(-1).times(loss) // -B(t+c)
			val3 = Decimal.exp(val2) // this should be Bx-A
			val4 = gain.plus(val3) // should be (Bx-A)+A
			val5 = val4.div(loss) // should be x

			return val5.max(0)
	}
}