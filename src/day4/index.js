const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => rawInput.split(require("os").EOL + require("os").EOL)

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("test.txt"))
const testInvalids = prepareInput(readInput("test-invalids.txt"))
const testValids = prepareInput(readInput("test-valids.txt"))

const goA = (input) => {
  // const fields = {"byr":0, "iyr":0, "eyr":0, "hgt":0, "hcl":0, "ecl":0, "pid":0, "cid":0}
  let valid = 0
  for (let i = 0; i < input.length; i++){
    let passport = input[i].split(/\s+/)
    if (passport.length < 7){continue}
    if (passport.length == 8){
      valid++
      continue
    }
    //we know passport.length == 7, but it might be valid, if cid is the one missing
    if (!input[i].includes("cid:")){
      valid++
      continue
    }
  }
  return valid
}

// https://github.com/kirans08/advent-of-code/blob/main/2020/04/04B.js

const goB = (input) => {
  let valid = 0
  for (let i = 0; i < input.length; i++){
    let passport = input[i].split(/\s+/).reduce((result, key) => {
      let data = key.split(':')
      result[data[0]] = data[1].trim()
      return result
    }, {})
    
    if (!passport.byr || passport.byr < 1920 || passport.byr > 2002){continue}
    if (!passport.iyr || passport.iyr < 2010 || passport.iyr > 2020){continue}
    if (!passport.eyr || passport.eyr < 2020 || passport.eyr > 2030){continue}
    if (!passport.hgt || !(passport.hgt.endsWith("cm") || passport.hgt.endsWith("in"))){continue}
    let hgtInt = parseInt(passport.hgt)
    if (passport.hgt.endsWith("cm") && (hgtInt < 150 || hgtInt > 193)){continue}
    if (passport.hgt.endsWith("in") && (hgtInt < 59 || hgtInt > 76)){continue}
    if (!passport.hcl || !/^#[a-f\d]{6}$/.test(passport.hcl)){continue}
    if (!passport.ecl || !["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(passport.ecl)){continue}
    if (!passport.pid || !/^[\d]{9}$/.test(passport.pid)){continue}
    valid++
  }
  return valid
}

/* Tests */

test(goA(testInput), 2)
test(goB(testInvalids), 0)
test(goB(testValids), 4)


/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
