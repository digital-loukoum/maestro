import { MaestroParser } from "./MaestroParser.js"

const parser = new MaestroParser<string>({
	tokens: [
		{
			name: "number",
			match: (input, offset) => {
				let length = 0
				while (input[offset + length] >= "0" && input[offset + length] <= "9") {
					length++
				}
				return length
			},
		},
	],

	nodes: [
		{
			name: "Number",
			match: context => {
				const token = context.getToken()
				if (!token || token.name != "number") return null
				return {
					...token,
					name: "Number",
					value: Number(context.input.slice(token.start, token.stop)),
				}
			},
		},
	],

	expressions: [],
})

const ast = parser.parse("54e")
console.log("[AST]\n", ast)
