import { Grammar } from "../Grammar.js"
import { leftRightoperation } from "../utilities/leftRightOperation.js"

export const nodes: Grammar<string>["nodes"] = {
	start(context) {
		return nodes.expression(context)
	},
	Addition(context) {
		return operation("Addition", "+")(context)
	},
	Subtraction: operation("Subtraction", "-"),
	Multiplication: operation("Multiplication", "*"),
	Division: operation("Division", "/"),

	Number(context) {
		const token = context.getToken()
		if (!token || token.name != "number") return null
		return {
			name: "Number",
			start: token.start,
			stop: token.stop,
			value: Number(context.input.slice(token.start, token.stop)),
		}
	},

	expression: context => {
		return context.getNode(
			nodes.Addition,
			nodes.Subtraction,
			nodes.Multiplication,
			nodes.Division,
			nodes.Number
		)
	},
}

function operation(name: string, operator: string) {
	return leftRightoperation<string>(name, context => nodes.expression(context), operator)
}
