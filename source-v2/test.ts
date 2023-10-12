import { MaestroParser } from "./MaestroParser.js"
import { nodes } from "./test/nodes.js"
import { tokens } from "./test/tokens.js"

const parser = new MaestroParser<string>({
	tokens,
	nodes,
})

const ast = parser.parse("54 - 3 - 2")
console.log("[AST]\n", ast)
