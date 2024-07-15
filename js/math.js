function powExp(n, exp){ // dilate
	n = new Decimal(n)
	exp = new Decimal(exp)
	if (n.lt(10)) return n
	return Decimal.pow(10,n.log10().pow(exp))
}

function powExp2(n, exp){ // Trilate
	n = new Decimal(n)
	exp = new Decimal(exp)
	if (n.lt(1e10)) return n
	return Decimal.pow(10,Decimal.pow(10,n.log10().log10().pow(exp)))
}

function powExp3(n, exp){ // Tetralate
	n = new Decimal(n)
	exp = new Decimal(exp)
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
	n = new Decimal(n)
	mul = new Decimal(mul)
	if (n.lt(10)) return n
	return tet10(slog(n).mul(mul))
}

function powSlog(n, exp){ // Vaccinate
	n = new Decimal(n)
	exp = new Decimal(exp)
	if (n.lt(10)) return n
	return tet10(slog(n).pow(exp))
}

function powSlogExp(n, exp){ //Vaccidilate
	n = new Decimal(n)
	exp = new Decimal(exp)
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

function rateENeg8(x) {
	x = new Decimal(x)
	return x.div(1e-8).min(1)
}

function equal(n1,n2,tolerance=0.0005) {
	n1 = new Decimal(n1)
	n2 = new Decimal(n2)
	if (n1.sign !== n2.sign) { return false; }
    if (Math.abs(n1.layer - n2.layer) > 1) { return false; }
	return n1.sub(n2).abs().lte(n1.abs().max(n2.abs()).mul(tolerance))
}

function getPopulation(pop,br,dr,int,carrying,birthFunc,deathFunc,diff,zeroBirth=false) { // k/(1+e^(a-rt))=n, ln(k/n-1)+rt=a
	pop = new Decimal(pop)
	br = new Decimal(br)
	dr = new Decimal(dr)
	int = new Decimal(int)
	let tempPop = pop
	let intpow = decimalOne
	if (int.lt(diff)) intpow = Decimal.div(diff, int)
	if (zeroBirth && tempPop.eq(0)) {
		if (Decimal.gte(br, 1) || Decimal.gte(dr, 1)) {
			tempPop = tempPop.add(br.sub(dr))
			return tempPop.max(0)
		}
		if (br.toNumber() > Math.random()) tempPop = tempPop.add(1)
		if (dr.toNumber() > Math.random()) tempPop = tempPop.sub(1)
		return tempPop.max(0)
	}
	let highBirthDeath = Decimal.gte(br, Decimal.root(3,intpow).sub(1)) || Decimal.gte(dr, Decimal.root(3,intpow).sub(1)) || int.lt(0.01)
	if (highBirthDeath && br.gt(0)) {
		let cc = carrying
		let bre8 = rateENeg8(br)
		let dre8 = rateENeg8(dr)
		let rBirth = br.max(1e-8).add(1).max(1).ln().mul(bre8)
		let rDeath = dr.max(1e-8).add(1).max(1).ln().mul(dre8)
		let r = rBirth
		let a = cc.div(pop).sub(1).ln()
		tempPop = cc.div(a.sub(r.mul(intpow)).exp().add(1))
		if (pop.gte(cc)) {
			r = rDeath
			a = pop.div(cc).sub(1).ln()
			tempPop = cc.mul(a.sub(r.mul(intpow)).exp().add(1))
		}
		let ip = intpow
		if (int.gte(diff)) ip = Decimal.div(diff, int)
		let tp = tempPop
		let brtp = rBirth.div(int).exp()
		let drtp = rDeath.div(int).exp()
		let popdiv = pop.div(tempPop).max(tempPop.div(pop))
		if (birthFunc(cc).max(1e-8).add(1).pow(ip.mul(rateENeg8(birthFunc(cc)))).gte(100) || deathFunc(cc).max(1e-8).add(1).pow(ip.mul(rateENeg8(deathFunc(cc)))).gte(100)) return cc
		if (brtp.gte(1e3) && !equal(brtp,1e3,0.05) && pop.lt(cc)) {
			for (var j = 0; j < 30; j++) {
				brtp = birthFunc(tp).max(1e-8).add(1).max(1).ln().mul(rateENeg8(birthFunc(tp))).div(int).exp()
				if (brtp.lt(1e3)) {
					tp = tp.div(popdiv.pow(Decimal.pow(1/2,j)))
				} 
				else {
					tp = tp.mul(popdiv.pow(Decimal.pow(1/2,j)))
				}
			}
			if (equal(brtp,1e3) && !equal(pop,tp)) {
				tempPop = tp
			}
			return tempPop.max(pop).max(0)
		}
		if (drtp.gte(1e3) && !equal(drtp,1e3,0.05) && pop.gt(cc)) {
			for (var j = 0; j < 30; j++) {
				drtp = deathFunc(tp).max(1e-8).add(1).max(1).ln().mul(rateENeg8(deathFunc(tp))).div(int).exp()
				if (drtp.lt(1e3)) {
					tp = tp.div(popdiv.pow(Decimal.pow(1/2,j)))
				} 
				else {
					tp = tp.mul(popdiv.pow(Decimal.pow(1/2,j)))
				}
			}
			if (equal(drtp,1e3) && !equal(pop,tp)) {
				tempPop = tp
			}
			return tempPop.min(pop).max(0)
		}
		return tempPop.max(0)
	}
	if (Decimal.gte(br, 1) || Decimal.gte(dr, 1)) {
		tempPop = tempPop.times(br.sub(dr).add(1).max(0).pow(intpow))
		return tempPop.max(0)
	}
	if (tempPop.lt(1e3)) {
	for (var i = 0; tempPop.gt(i); i++) {
		let counter = 0
		if (br.toNumber() > Math.random()) counter++ 
		if (dr.toNumber() > Math.random()) counter-- 
		let y = Decimal.add(tempPop,counter)
		let x = y.div(tempPop)
		tempPop = tempPop.mul(Decimal.pow(x,intpow))
	}
	}
	else {
		let counter = 0
		for (let c = 0; c < 1e3; c++) if (br.toNumber() > Math.random()) counter++
        for (let c = 0; c < 1e3; c++) if (dr.toNumber() > Math.random()) counter--
		let x = counter / 1e3 + 1
		tempPop = tempPop.times(Decimal.pow(x,intpow)).round().max(0)
	}
	return tempPop.max(0)
}

function getCarryingCapacity(pop,baseBirth,baseDeath,birthReducExp,birthDeathDil,deathIncrExp,birthFunc,deathFunc,deathDiv,zeroBirth=false,i=30) {
	pop = new Decimal(pop)
	baseBirth = new Decimal(baseBirth)
	baseDeath = new Decimal(baseDeath)
	birthReducExp = new Decimal(birthReducExp)
	birthDeathDil = new Decimal(birthDeathDil)
	deathIncrExp = new Decimal(deathIncrExp)
	deathDiv = new Decimal(deathDiv)
	if (baseBirth.eq(0)) return decimalZero
	let carryingCapacity = baseBirth.div(baseDeath).root(deathIncrExp).mul(deathDiv)
	if (carryingCapacity.gte(1e40)) {
		carryingCapacity = baseBirth.div(baseDeath).mul(Decimal.pow(10,deathIncrExp.add(birthReducExp.mul(40)))).root(birthReducExp.add(deathIncrExp))
	}
	let inf2 = Decimal.pow(2,2048)
	if (carryingCapacity.gte(inf2)) {
		carryingCapacity = Decimal.pow(2,inf2.div(deathDiv).pow(deathIncrExp).mul(baseDeath).mul(inf2.div(1e40).pow(birthReducExp)).div(baseBirth).log(2).div(birthReducExp.add(deathIncrExp).neg()).mul(2).root(birthDeathDil)).mul(inf2)
	}
	//exp=log2(x/y)^f
	//b/(y/1e40)^c*(2^(exp/-2*c))=(y/10)^a*d*(2^(exp/2*a))
	//b*(2^(exp/-2*c))=(y/10)^a*d*(2^(exp/2*a))*(y/1e40)^c
	//2^(exp/-2*c)=(y/10)^a*d*(2^(exp/2*a))*(y/1e40)^c/b
	//2^(exp/-2*c)/(2^(exp/2*a))=(y/10)^a*d*(y/1e40)^c/b
	//2^(exp/-2*c)/(2^(exp/2*a))=(y/10)^a*d*(y/1e40)^c/b
	//2^(exp/-2*c-(exp/2*a))=(y/10)^a*d*(y/1e40)^c/b
	//2^(exp*-c-exp*a)/2)=(y/10)^a*d*(y/1e40)^c/b
	//2^(exp(-c-a)/2)=(y/10)^a*d*(y/1e40)^c/b
	//exp(-c-a)/2=log2((y/10)^a*d*(y/1e40)^c/b)
	//exp=2log2((y/10)^a*d*(y/1e40)^c/b)/(-c-a)
	//log2(x/y)^f=2log2((y/10)^a*d*(y/1e40)^c/b)/(-c-a)
	//log2(x/y)=(2log2((y/10)^a*d*(y/1e40)^c/b)/(-c-a))^(1/f)
	//x=2^((2log2((y/10)^a*d*(y/1e40)^c/b)/(-c-a))^(1/f))*y
	pop = pop.max(1)
	let popdiv = pop.div(carryingCapacity).max(carryingCapacity.div(pop))
	let br = birthFunc(carryingCapacity.max(zeroBirth?0:2))
	let dr = deathFunc(carryingCapacity)
	for (var j = 0; j < i; j++) {
		if (br.lt(dr)) {
			carryingCapacity = carryingCapacity.div(popdiv.pow(Decimal.pow(1/2,j)))
		}
		else {
			carryingCapacity = carryingCapacity.mul(popdiv.pow(Decimal.pow(1/2,j)))
		}
		br = birthFunc(carryingCapacity.max(zeroBirth?0:2))
		dr = deathFunc(carryingCapacity)
	}
	return carryingCapacity
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