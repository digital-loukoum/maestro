import { Maestro } from "Maestro.js"

export type MatchKind = "token" | "node"

export type ParserInput = string | Uint8Array

export type Token = {
	type: "Token"
	name: string
	start: number
	stop: number
	value: string | Uint8Array
}

export type Matchers = Record<
	MatchKind,
	{
		[Key in Maestro.Expression["type"]]: (expression: Maestro.Expressions[Key]) => number
	}
>

export type Node = {
	type: string
	start: number
	stop: number
	value: ParserInput
}

export class FooParser {
	input!: ParserInput
	nodes: Array<Node> = []
	tokens: Array<Token> = []
	characterCursor = 0
	tokenCursor = 0

	// the grammar is replaced at compile-time
	grammar!: Maestro.Grammar

	parse(input: ParserInput) {
		this.input = input
		const rootNode = this.grammar.nodes.find(node => node.name == "root")
		return rootNode?.match()
	}

	protected getNextToken(): Token {
		if (this.tokenCursor < this.tokens.length) {
			return this.tokens[this.tokenCursor]
		}
		let tokenLength = 0
		let name = ""
		for (const tokenMatcher of this.grammar.tokens) {
			if ((tokenLength = tokenMatcher.match())) {
				name = tokenMatcher.name
				break
			}
		}
		if (!tokenLength) {
			throw new Error("Could not find token")
		}

		const start = this.characterCursor
		const stop = start + tokenLength
		this.characterCursor = stop

		const nextToken: Token = {
			type: "Token",
			name,
			start,
			stop,
			value: this.input.slice(start, stop),
		}
		this.tokens.push(nextToken)
		return nextToken
	}

	/**
	 * TOKEN MATCHERS
	 */
	matchTokenLiteral({ value }: Maestro.Expressions["Literal"]) {
		let length = 0
		while (
			length < value.length &&
			this.input[this.characterCursor + length] == value[length]
		) {
			length++
		}
		return length
	}
	matchTokenFunction() {
		return 0
	}
	matchTokenIdentifier() {
		return 0
	}
	matchTokenNumber() {
		return 0
	}
	matchTokenProperty() {
		return 0
	}

	/**
	 * NODE MATCHERS
	 */
	matchNodeLiteral({ value }: Maestro.Expressions["Literal"]) {
		const nextToken = this.getNextToken()
		return nextToken.name == value ? 1 : 0
	}
	matchNodeFunction() {
		return 0
	}
	matchNodeIdentifier() {
		return 0
	}
	matchNodeNumber() {
		return 0
	}
	matchNodeProperty() {
		return 0
	}
}
