const express = require('express')
const cors = require('cors')
const axios = require('axios')
const FormData = require('form-data')

const app = express()

app.use(cors())
app.use(express.json())

const output = []
let cookie = ''
let automation = 'no'
const oldRequest = null
const oldResponse1 = null
const isResponseSent = false

const solutions = {
  cube: 'return Math.pow(x,3)',
  multiplierCount: 'return(x-x%y)/y',
  isPrime: 'if (x <= 1 || (x % 2 === 0 && x > 2)) return false; const sqrt = Math.sqrt(x); for (let i = 3; i <= sqrt; i += 2) { if (x % i === 0) return false };return true',
  squareRoot: 'return Math.sqrt(x)',
  removeAllSpaces: 'return x.replace(/\\s/g,"")',
  hexToRGB: 'return x.match(/\\w\\w/g).map((x)=> +`0x${x}`)',
  reverseString: 'return x.split("").reverse().join("")',
  findAverage: 'return Math.ceil((arr => arr.reduce((arr, e) => arr + e, 0) / x.length)(x))',
  countUniqueNumbers: 'return[...new Set(x)].length',
  numberOfCircles: 'const t=["0","6","8","9"],r={0:1,6:1,8:2,9:1};let c=0;return x.toString().split("").forEach(x=>{t.includes(x)&&(c+=r[x])}),c',
  numberRepresentation: 'const t = {}; let e = ""; return arr.sort().forEach(arr => { t[arr] = (t[arr] || 0) + 1 }), Object.values(t).forEach(arr => (e += arr)), parseInt(e) || 0',
  twoArrayAvg: 'const c=x=>x.reduce((x,c)=>x+c,0)/x.length;x.concat(y);return(c(y)+c(x))/2',
  charCountInString: 'return y.split("").filter(v=>v===x).length',
  firstUniqueChar: 'let i = x[0]; const n = x.split(""); i = n.find(x => { if (n.filter(i => i === x).length === 1) { return x } }); return i || false',
  digitOccurrence: 'let e = 0; for (let i = 0; i <= n; i++) { e += i.toString().split("").filter(n => n === x.toString()).length }; return e  ',
  isRotatedStr: 'let e=!1;const l=x.split(""),i=y.split("");if(l.length===i.length&&l.length>0){const x=l;e=l.filter(y=>(x.push(x.shift()),x.join()===i.join())).length>0}else 0===l.length&&0===i.length&&(e=!0);return e',
  averageAsciiChar: 'const t = x.length; const e = x.split("").reduce((x, t) => (x += t.codePointAt(0)), 0); return String.fromCharCode(Math.round(e / t))',
  hashPassword: 'let t="";return password.split("").forEach((e,a)=>{if(e.match(/[a-z]/i)){const s=x%26,h=password.charCodeAt(a),n=e.toLowerCase()===e,C=n?122:90,c=n?96:64,f=h+s%26;let i=f-26*Math.floor(f/C);i=i===c?i+26:i,t+=n?String.fromCharCode(i).toUpperCase():String.fromCharCode(i).toLowerCase()}else{const password=x%10;t+=(parseInt(e)+password)%10}}),t',
  validateIP: 'const e=x.split(".");return 4===e.length&&0===e.filter(x=>!x.match(/^ *[0-9]+ *$/i)||!Number.isInteger(parseInt(x))||parseInt(x)<0||parseInt(x)>255).length',
  romanToInt: 'let t=0;const e={I:1,V:5,X:10,L:50,C:100,D:500,M:1e3};for(let o=0;o<x.length;o++)"I"===x[o]&&"V"===x[o+1]?(t+=4,o++):"I"===x[o]&&"X"===x[o+1]?(t+=9,o++):"X"===x[o]&&"L"===x[o+1]?(t+=40,o++):"X"===x[o]&&"C"===x[o+1]?(t+=90,o++):"C"===x[o]&&"D"===x[o+1]?(t+=400,o++):"C"===x[o]&&"M"===x[o+1]?(t+=900,o++):t+=e[x[o]];return t',
  isPalindrome: 'x = x.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();return (Array.from(x).reverse().join("") === x)',
  matchingType: 'return typeof x == typeof y',
  replaceSpaces: 'return x.replace(/ /g, "%20")',
  monthToString: 'const date = new Date(2020, parseInt(x) - 1, 1); return date.toLocaleString("en-us", { month: "short" })',
  findWord: 'const o=sentence.toLowerCase().indexOf(word.toLowerCase());if(-1!==o){return[o,o+word.length-1]}return[]',
  arrayToObject: 'let t={};return x.forEach(r=>{2===r.length&&(t={...t,[r[0]]:r[1]})}),t',
  binaryToNumber: 'return parseInt(x, 2)',
  reverseCase: 'return x.split("").map(e=>{const r=e.charCodeAt(0);return r>=65&&r<=90?e.toLowerCase():r>=97&&r<=122?e.toUpperCase():e}).join("")',
  reverseAllWords: 'return x.split(" ").map((word) => (word.split("").reverse().join(""))).join(" ")',
  getHalfArray: 'return x.slice(0, Math.ceil(x.length / 2))',
  removeDuplicates: 'return [...new Set(x.split(""))].join("")',
  findUniqueNumber: 'return x.find(n => { return ((e, n) => x.reduce((e, r) => r === n ? e + 1 : e, 0))(x, n) === 1 })',
  missingInteger: 'const t = x.sort().find((t, s) => x[s] !== x[0] + s); return t ? t - 1 : x[x.length - 1] + 1 || 1',
  getType: 'return typeof x'
}

const runEntry = (body) => {
  cookie = body?.cookie || ''
  automation = body?.auto || 'no'

  console.time('Full_time')
  console.log('start')

  const data = new FormData()
  data.append('challengeSlug', 'toptal-js-2021')
  data.append('email', '')
  data.append('leaderboardName', 'Ahamed Rasheed')
  data.append('isConfirmedToBeContacted', '1')
  data.append('isTermsAndConditionsChecked', '1')
  data.append('countryAlpha2', 'LK')

  const config = {
    method: 'post',
    url: 'https://speedcoding.toptal.com/webappApi/entry?ch=29&acc=2906',
    headers: {
      Cookie: cookie,
      ...data.getHeaders()
    },
    data: data
  }

  axios(config)
    .then((response) => {
      if (response.data.code === 429) {
        const time = response.data.message.replace(/\D+/g, '')
        console.log(response.data.message)
        setTimeout(() => {
          runEntry(body)
        }, (parseInt(time) * 1000))
      } else if (response.data.code !== 200) {
        return {
          statusCode: 200,
          body: JSON.stringify({ error: response.data, result: output })
        }
      }

      const entryId = response.data.data.entry.id
      const entryKey = response.data.data.entry.entry_key
      runTask(response.data.data, entryId, (c) => {
        console.log('callback =>', c)

        return {
          statusCode: 200,
          body: JSON.stringify({ status: 'done', result: output, callback: c })
        }
      }, entryKey)

      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'failed', result: output })
      }
    })
    .catch((error) => {
      console.log(error)
      throw error
    })
}

const runTask = async (data1, entryId, callback, entryKey) => {
  const tests = data1.nextTask.tests_json
  console.time(data1.nextTask.slug)

  const results = Object.fromEntries(Object.entries(tests).map(([key, value]) => {
    if (!value.result) {
      const answer = getNewSolution(data1.nextTask.slug, value.args)
      return [key, answer]
    }

    return [key, value.result]
  }))

  const code = findSolution(data1.nextTask.code, data1.nextTask.slug)

  const data = new FormData()
  data.append('attempt_id', data1.attemptId)
  data.append('tests_json', JSON.stringify(results))
  data.append('entry_key', entryKey)
  data.append('code', code)

  const config = {
    method: 'post',
    url: `https://speedcoding.toptal.com/webappApi/entry/${entryId}/attemptTask`,
    headers: {
      Cookie: cookie,
      ...data.getHeaders()
    },
    data: data
  }

  axios(config)
    .then((response) => {
      const next = response.data.data
      console.timeEnd(data1.nextTask.slug)

      if (next.isChallengeEntryFinished) {
        output.push(next.totalPoints)
        console.timeEnd('Full_time')
        console.log('finish ==========> ', next.totalPoints)

        // !isResponseSent && oldResponse1.status(200).json({ status: 'done', result: output, callback: next })
        // isResponseSent = true

        setTimeout(() => {
          automation === 'yes'
            ? runEntry(oldRequest, oldResponse1)
            : callback(next)
        }, (30 * 1000))
        return
      }

      runTask(next, entryId, callback, entryKey)
    }).catch((error) => {
      console.log(error)
    })
}

const findSolution = (template, slug) => {
  return template.slice(0, -2) + solutions[slug] + '\n};'
}

const getNewSolution = (slug, args = []) => {
  switch (slug) {
    case 'cube':
      return Math.pow(args[0], 3)
    case 'multiplierCount':
      return (args[0] - args[0] % args[1]) / args[1]
    case 'isPrime':
      return isPrime(args[0])
    case 'squareRoot':
      return Math.sqrt(args[0])
    case 'removeAllSpaces':
      return args[0].replace(/\s/g, '')
    case 'hexToRGB':
      return hexToRGB(args[0])
    case 'reverseString':
      return args[0].split('').reverse().join('')
    case 'findAverage':
      return Math.ceil((arr => arr.reduce((arr, e) => arr + e, 0) / arr.length)(args[0]))
    case 'countUniqueNumbers':
      return [...new Set(args[0])].length
    case 'numberOfCircles':
      return numberOfCircles(args[0])
    case 'numberRepresentation':
      return numberRepresentation(args[0])
    case 'twoArrayAvg':
      return twoArrayAvg(args[0], args[1])
    case 'charCountInString':
      return charCountInString(args[0], args[1])
    case 'firstUniqueChar':
      return firstUniqueChar(args[0])
    case 'digitOccurrence':
      return digitOccurrence(args[0], args[1])
    case 'isRotatedStr':
      return isRotatedStr(args[0], args[1])
    case 'averageAsciiChar':
      return averageAsciiChar(args[0])
    case 'hashPassword':
      return hashPassword(args[0], args[1])
    case 'validateIP':
      return validateIP(args[0])
    case 'romanToInt':
      return romanToInt(args[0])
    case 'replaceSpaces':
      return args[0].replace(/ /g, '%20')
    case 'matchingType':
      return matchingType(args[0], args[1])
    case 'monthToString':
      return monthToString(args[0])
    case 'findWord':
      return findWord(args[0], args[1])
    case 'isPalindrome':
      return isPalindrome(args[0])
    case 'arrayToObject':
      return arrayToObject(args[0])
    case 'binaryToNumber':
      return binaryToNumber(args[0])
    case 'reverseCase':
      return reverseCase(args[0])
    case 'reverseAllWords':
      return reverseAllWords(args[0])
    case 'getHalfArray':
      return getHalfArray(args[0])
    case 'removeDuplicates':
      return removeDuplicates(args[0])
    case 'findUniqueNumber':
      return findUniqueNumber(args[0])
    case 'missingInteger':
      return missingInteger(args[0])
    case 'getType':
      return getType(args[0])
  }

  return null
}

// Minified
const twoArrayAvg = (t, e) => { const r = t => t.reduce((t, e) => t + e, 0) / t.length; return (r(e) + r(t)) / 2 }
const charCountInString = (t, e) => { return e.split('').filter(e => e === t).length }
const firstUniqueChar = t => { let e = t[0]; const r = t.split(''); return (e = r.find(t => { return r.filter(e => e === t).length === 1 && t })) || !1 }
const digitOccurrence = (t, e) => { let r = 0; for (let n = 0; n <= t; n++) { r += n.toString().split('').filter(t => t === e.toString()).length } return r }
const isRotatedStr = (t, e) => { let r = !1; const n = t.split(''); const o = e.split(''); if (n.length === o.length && n.length > 0) { const t = n; r = n.filter(e => (t.push(t.shift()), t.join() === o.join())).length > 0 } else n.length === 0 && o.length === 0 && (r = !0); return r }
const hexToRGB = t => t.match(/\w\w/g).map(t => +`0x${t}`)
const averageAsciiChar = t => { const e = t.length; const r = t.split('').reduce((t, e) => (t += e.codePointAt(0)), 0); return String.fromCharCode(Math.round(r / e)) }
const hashPassword = (t, e) => { let r = ''; return t.split('').forEach((n, o) => { if (n.match(/[a-z]/i)) { const i = e % 26; const s = t.charCodeAt(o); const a = n.toLowerCase() === n; const l = a ? 122 : 90; const h = a ? 96 : 64; const g = s + i % 26; let c = g - 26 * Math.floor(g / l); c = c === h ? c + 26 : c, r += a ? String.fromCharCode(c).toUpperCase() : String.fromCharCode(c).toLowerCase() } else { const t = e % 10; r += (parseInt(n) + t) % 10 } }), r }
const validateIP = t => { const e = t.split('.'); return e.length === 4 && e.filter(t => !t.match(/^ *[0-9]+ *$/i) || !Number.isInteger(parseInt(t)) || parseInt(t) < 0 || parseInt(t) > 255).length === 0 }
const romanToInt = t => { let e = 0; const r = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1e3 }; for (let n = 0; n < t.length; n++)t[n] === 'I' && t[n + 1] === 'V' ? (e += 4, n++) : t[n] === 'I' && t[n + 1] === 'X' ? (e += 9, n++) : t[n] === 'X' && t[n + 1] === 'L' ? (e += 40, n++) : t[n] === 'X' && t[n + 1] === 'C' ? (e += 90, n++) : t[n] === 'C' && t[n + 1] === 'D' ? (e += 400, n++) : t[n] === 'C' && t[n + 1] === 'M' ? (e += 900, n++) : e += r[t[n]]; return e }
const isPrime = t => { if (t <= 1 || t % 2 == 0 && t > 2) return !1; const e = Math.sqrt(t); for (let r = 3; r <= e; r += 2) if (t % r == 0) return !1; return !0 }
const isPalindrome = t => (t = t.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase()).length > 0 && Array.from(t).reverse().join('') === t
const matchingType = (t, e) => typeof t === typeof e
const monthToString = t => { return new Date(2020, parseInt(t) - 1, 1).toLocaleString('en-us', { month: 'short' }) }
const findWord = (t, e) => { const r = e.toLowerCase().indexOf(t.toLowerCase()); if (r !== -1) { return [r, r + t.length - 1] } return [] }
const arrayToObject = t => { let e = {}; return t.forEach(t => { t.length === 2 && (e = { ...e, [t[0]]: t[1] }) }), e }
const binaryToNumber = t => parseInt(t, 2)
const reverseCase = e => { return e.split('').map(e => { const r = e.charCodeAt(0); return r >= 65 && r <= 90 ? e.toLowerCase() : r >= 97 && r <= 122 ? e.toUpperCase() : e }).join('') }
const reverseAllWords = x => x.split(' ').map((word) => (word.split('').reverse().join(''))).join(' ')
const numberOfCircles = t => { const n = ['0', '6', '8', '9']; const r = { 0: 1, 6: 1, 8: 2, 9: 1 }; let c = 0; return t.toString().split('').forEach(t => { n.includes(t) && (c += r[t]) }), c }
const numberRepresentation = e => { const t = {}; let r = ''; return e.sort().forEach(e => { t[e] = (t[e] || 0) + 1 }), Object.values(t).forEach(e => r += e), parseInt(r) || 0 }
// end of Minified

const getHalfArray = (x) => {
  return x.slice(0, Math.ceil(x.length / 2))
}

const removeDuplicates = (x) => {
  return [...new Set(x.split(''))].join('')
}

const findUniqueNumber = (x) => {
  // const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  // const answer = x.find((number) => {
  //   const occurrence = countOccurrences(x, number)
  //   if (occurrence === 1) return true

  //   return false
  // })

  // return answer
  return x.find(n => { return ((e, n) => x.reduce((e, r) => r === n ? e + 1 : e, 0))(x, n) === 1 })
}

const missingInteger = (x) => {
  // const result = x.sort().find((number, index) => {
  //   if (x[index] !== (x[0] + index)) {
  //     return true
  //   }

  //   return false
  // })

  // return result ? result - 1 : x[x.length - 1] + 1 || 1
  const t = x.sort().find((t, s) => x[s] !== x[0] + s); return t ? t - 1 : x[x.length - 1] + 1 || 1
}

const getType = (x) => {
  return typeof x
}

exports.handler = async function (event, context) {
  const body = JSON.parse(event.body)

  return runEntry(body)
}
