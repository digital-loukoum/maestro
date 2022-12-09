import { readFileSync } from "fs"

import { parse } from "index.js"
import { inspect } from "util"

const file = readFileSync("tests/grammars/simple.maestro.coffee", "utf-8")

const ast = parse(file)
console.log(inspect(ast, { depth: null, colors: true }))
