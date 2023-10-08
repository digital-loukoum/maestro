import type { BaseNode, Grammar, Token } from "./Grammar.js"

export class MaestroParser<Input extends ArrayLike<unknown>> {
	input!: Input
	protected inputOffset = 0
	protected tokens = new Array<Token>()
	protected tokenOffset = 0

	constructor(public grammar: Grammar<Input>) {}

	parse(input: Input) {
		this.input = input
		let result: BaseNode | null = null
		for (const nodeRule of this.grammar.nodes) {
			result = nodeRule.match(this)
			if (result) break
		}
		return result
	}

	getToken(): Token | null {
		if (this.tokenOffset < this.tokens.length) {
			return this.tokens[this.tokenOffset++]
		}
		const token = this.parseToken(this.inputOffset)
		if (!token) return null
		this.tokens.push(token)
		return token
	}

	parseToken(at: number): Token | null {
		let tokenLength = 0
		let name = ""
		for (const tokenMatcher of this.grammar.tokens) {
			if ((tokenLength = tokenMatcher.match(this.input, at))) {
				name = tokenMatcher.name
				break
			}
		}
		if (!tokenLength) {
			return null
		}

		const start = at
		const stop = start + tokenLength
		this.inputOffset = stop

		return { name, start, stop }
	}
}
