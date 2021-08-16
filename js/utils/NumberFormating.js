function addCommas(s){
	if (s.length <= 3) return s
	let rem = s.length % 3
	if (rem == 0) rem = 3
	return s.slice(0, rem) + "," + addCommas(s.slice(rem))
}

function exponentialFormat(num, precision) {
	let e = num.log10().floor()
	let m = num.div(Decimal.pow(10, e))
	if (m.toStringWithDecimalPlaces(precision) == 10) {
		m = new Decimal(1)
		e = e.add(1)
	}
	if (e.lt(0)) {
		m = m.mul(10)
		e = e.sub(1)
	}
	let start = ""
	if (e.abs().lt(1e9)) {
		if (m.toStringWithDecimalPlaces(precision) == 10) {
			m = new Decimal(1)
			e = e.add(1)
		}
		start = m.toStringWithDecimalPlaces(precision)
	}
	let end = e.toStringWithDecimalPlaces(0)
	if (!end.includes("e")) end = addCommas(end.replace(/-/g, ''))
	if (e.lt(0)) end = "-"+end
	return start + "e" + end
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
	return x || new Decimal(y)
}

function sumValues(x) {
	x = Object.values(x)
	if (!x[0]) return new Decimal(0)
	return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision=3) {
	decimal = new Decimal(decimal)
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		player.hasNaN = true;
		console.log(decimal)
		Decimal(0)
		for (i in player){
			if (player[i] == undefined) continue
			if (player[i].points != undefined) {
				if (isNaN(player[i].points.mag)) console.log(i + "'s points are NaN")
			}
		}
		
		return "NaN"
	}
	if (decimal.sign < 0) return "-"+format(decimal.neg(), precision)
	if (decimal.mag<0) {
		if (decimal.layer > 3 || (decimal.mag < -1e10 && decimal.layer == 3)) return "1/" + format(decimal.recip(), precision)
		else exponentialFormat(decimal, precision)
	}
	if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
	if (decimal.layer > 3 || (decimal.mag > 1e10 && decimal.layer == 3)) {
		var slog = decimal.slog()
		if (slog.gte(1e5)) return "F" + formatWhole(slog.floor())
		if (slog.gte(1e4)) return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(0) + "F" + commaFormat(slog.floor(), 0)
		if (slog.gte(100)) return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
		else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(4) + "F" + commaFormat(slog.floor(), 0)
	} else if (decimal.layer > 2 || (Math.abs(decimal.mag) > 308 && decimal.layer == 2)) {
		return "e" + format(decimal.log10(), precision)
	} else if (decimal.layer > 1 || (Math.abs(decimal.mag) >= 1e12 && decimal.layer == 1)) {
		return "e" + format(decimal.log10(), 4)
	} else if (decimal.layer > 0 || decimal.mag >= 1e9) {
		return exponentialFormat(decimal, precision)
	} else if (decimal.mag >= 1000) {
		return commaFormat(decimal, 0)
	} else if (decimal.mag>=0.001) {
		return regularFormat(decimal, precision)
	} else if (decimal.sign!=0) {
		return exponentialFormat(decimal, precision)
	} else return regularFormat(decimal, precision)
}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 3)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 3)
    return format(decimal, 0)
}

function formatTime(s) {
	if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function formatTimeLong(s) {
	s = new Decimal(s)
	let slo = slog(s).sub(Decimal.log10(4))
	if (s.gte(tet10(3600))) return formatTimeLong(slog(s))+ "^^2"
	else if (s.gte(Decimal.pow(10,10000))) return formatTimeLong(tet10(slo.sub(slo.floor()).add(Decimal.log10(4).add(1)))) + "<sup>"+formatWhole(slo.floor())+"</sup>"
	if (s.gte("31557600e1000")) return format(s.div("31557600e1000")) + " universe lifetimes"
	if (s.gte(31557600e100)) return format(s.div(31557600e100)) + " black hole eras"
	if (s.gte(31557600e40)) return format(s.div(31557600e40)) + " degenerate eras"
	if (s.gte(31557600e9)) return format(s.div(31557600e9)) + " aeons"
	if (s.gte(31557600e3)) return format(s.div(31557600e3)) + " millenia"
	if (s.gte(31557600)) return format(s.div(31557600)) + " years"
	if (s.gte(86400)) return format(s.div(86400)) + " days"
	if (s.gte(3600)) return format(s.div(3600)) + " hours"
	if (s.gte(60)) return format(s.div(60)) + " minutes"
	if (s.gte(1)) return format(s) + " seconds"
	if (s.gte(0.001)) return format(s.mul(1e3)) + " milliseconds"
	if (s.gte(1e-6)) return format(s.mul(1e6)) + " microseconds"
	if (s.gte(1e-9)) return format(s.mul(1e9)) + " nanoseconds"
	if (s.gte(1e-12)) return format(s.mul(1e12)) + " picoseconds"
	if (s.gte(1e-15)) return format(s.mul(1e15)) + " femtoseconds"
	if (s.gte(1e-18)) return format(s.mul(1e18)) + " attoseconds"
	if (s.gte(1e-21)) return format(s.mul(1e21)) + " zeptoseconds"
	if (s.gte(1e-24)) return format(s.mul(1e24)) + " yoctoseconds"
	return format(s.mul(1.855e43)) + " Planck Times"
}

function toPlaces(x, precision, maxAccepted) {
	x = new Decimal(x)
	let result = x.toStringWithDecimalPlaces(precision)
	if (new Decimal(result).gte(maxAccepted)) {
		result = new Decimal(maxAccepted-Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
	}
	return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}