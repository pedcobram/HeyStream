// Returns a number with the letter 'k' every 100.000. E.g. 100.000 -> 100k
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

export default kFormatter;