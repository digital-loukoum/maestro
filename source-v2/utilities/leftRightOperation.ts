import { MaestroParser } from "../MaestroParser.js"
import { NodeMatcher } from "../Grammar.js"

export function leftRightoperation<Input extends ArrayLike<unknown>>(
	name: string,
	leftMatcher: NodeMatcher<Input>,
	operator: string,
	rightMatcher = leftMatcher
) {
	return (context: MaestroParser<Input>) => {
		const left = leftMatcher(context)
		if (!left) return null
		console.log("left", left, context.tokenOffset, context.inputOffset)
		const operatorToken = context.getToken()
		console.log("operator", operatorToken)
		if (operatorToken?.name != `'${operator}'`) return null
		const right = rightMatcher(context)
		console.log("right", right, context.tokenOffset, context.inputOffset)
		if (!right) return null
		return {
			name,
			start: left.start,
			stop: right.stop,
			left,
			right,
		}
	}
}
