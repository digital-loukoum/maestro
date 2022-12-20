import { generateGrammar } from "generators/generateGrammar.js"
import { parse } from "index.js"
import { inspect } from "util"

const file = await Bun.file("tests/test.maestro.coffee").text()

const ast = parse(file)
// console.log(inspect(ast, { depth: null, colors: true }))

const grammar = generateGrammar(ast)
console.log(inspect(grammar, { depth: null, colors: true }))
