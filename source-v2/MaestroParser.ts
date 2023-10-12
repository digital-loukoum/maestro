import type { BaseNode, Grammar, NodeMatcher, Token } from "./Grammar.js"

export class MaestroParser<Input extends ArrayLike<unknown>> {
	input!: Input
	inputOffset = 0
	tokens = new Array<Token>()
	tokenOffset = 0

	protected triedNodes: Array<WeakMap<NodeMatcher<Input>, BaseNode | null>> = []

	constructor(public grammar: Grammar<Input>) {}

	savePosition() {
		const tokenOffset = this.tokenOffset
		const inputOffset = this.inputOffset
		return () => {
			this.tokenOffset = tokenOffset
			this.inputOffset = inputOffset
			this.triedNodes.length = tokenOffset
			return null
		}
	}

	parse(input: Input) {
		this.input = input
		return this.getNode(this.grammar.nodes.start ?? Object.values(this.grammar.nodes)[0])
	}

	getToken(): Token | null {
		if (this.tokenOffset < this.tokens.length) {
			return this.tokens[this.tokenOffset++]
		}
		this.skipWhitespaces()
		const token = this.parseToken(this.inputOffset)
		if (!token) return null
		this.tokens.push(token)
		this.tokenOffset++
		return token
	}

	getNode(...nodes: Array<NodeMatcher<Input>>): BaseNode | null {
		const reset = this.savePosition()
		let result: BaseNode | null = null
		let node: BaseNode | null = null

		// console.log({ offset: this.tokenOffset })

		for (const nodeMatcher of nodes) {
			this.triedNodes[this.tokenOffset] ??= new Map()
			const cached = this.triedNodes[this.tokenOffset].get(nodeMatcher)

			if (cached === undefined) {
				this.triedNodes[this.tokenOffset].set(nodeMatcher, null)
				node = nodeMatcher(this)
				this.triedNodes[this.tokenOffset].set(nodeMatcher, node)
			} else {
				node = cached
			}

			console.log("Trying node", nodeMatcher, this.tokenOffset)

			if (node) {
				result = node
				break
			} else {
				reset()
			}
		}

		return result
	}

	parseToken(at: number): Token | null {
		let tokenLength = 0
		let name = ""
		for (const tokenMatcher of Object.values(this.grammar.tokens)) {
			if ((tokenLength = tokenMatcher(this.input, at))) {
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

	skipWhitespaces() {
		while (this.input[this.inputOffset] == " ") {
			this.inputOffset++
		}
	}
}
