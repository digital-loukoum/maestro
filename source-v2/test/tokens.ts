import { Grammar } from "../Grammar.js"
import { literalToken } from "../utilities/literalToken.js"

export const tokens: Grammar<string>["tokens"] = {
	number: (input, offset) => {
		let length = 0
		while (input[offset + length] >= "0" && input[offset + length] <= "9") {
			console.log(input[offset + length])
			length++
		}
		return length
	},
	...literalToken("+"),
	...literalToken("-"),
	...literalToken("*"),
	...literalToken("/"),
}
