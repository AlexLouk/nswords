//Run this Script from the folder that u want the words_en.json to be written to.
console.time('Transform')
const fs = require('fs')

const inputPath = process.argv[2]
if (!inputPath) return console.error('Usage: node file.js <input.json>')

const json = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
console.log(json)
const transformed = Object.entries(json).map(([key, definition]) => ({
    key,
    definition,
}))

fs.writeFileSync('words_en.json', JSON.stringify(transformed, null, 2))

console.timeEnd('Transform')
