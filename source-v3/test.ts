import { parserV3 } from "./parserV3"
import { Grammar, Node } from "./types"

const myGrammar: Grammar<string> = [
	// NUMBER
	({ input, start }) => {
		let end = start
		while (input[end] >= "0" && input[end] <= "9") {
			// console.log(input[end])
			end++
		}
		if (end == start) return
		return {
			name: "Number",
			start,
			end,
			value: Number(input.slice(start, end)),
		}
	},

	// ADDITION
	({ input, start, useLeftNode, useRightNode }) => {
		if (input[start] != "+") return
		console.log("Addition!!")
		const node: Node<any> = {
			name: "Addition",
			start,
			end: start + 1,
		}
		node.left = useLeftNode(node, 10)
		node.right = useRightNode(10)
		return node
	},

	({ input, start, useLeftNode, useRightNode }) => {
		if (input[start] != "*") return
		console.log("Multiplication!!")
		const node: Node<any> = {
			name: "Multiplication",
			start,
			end: start + 1,
		}
		node.left = useLeftNode(node, 20)
		node.right = useRightNode(20)
		return node
	},
]

const parseStuff = parserV3<string>(myGrammar)

console.log("AST", parseStuff("12 + 4 * 5"))
