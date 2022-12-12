import { Maestro } from "Maestro.js"
import { NodeDeclarations } from "parseNodes.js"
import { TokenDeclarations } from "parseTokens.js"

export type MatchKind = "token" | "node"

export type Token = {
	type: "Token"
	name: string
	start: number
	stop: number
	value: string | Uint8Array
}

export type TokenMatcher = {
	name: string
	match: () => number // length of the token
	anonymous?: boolean
}

export type NodeMatcher = {
	name: string
	match: () => any
}

export type MaestroGrammar = {
	tokens: Array<TokenMatcher>
	nodes: Array<NodeMatcher>
}

export type Matchers = Record<
	MatchKind,
	{
		[Key in Maestro.Expression]: (expression: Maestro.Expressions[Key]) => number
	}
>

export type Node = {
	type: string
	start: number
	stop: number
	value: string | Uint8Array
}

export function maestroParser(grammar: MaestroGrammar) {
	return (input: string | Uint8Array) => {
		let nodes: Array<Node> = []
		let tokens: Array<Token> = []
		let characterCursor = 0
		let tokenCursor = 0

		function getNextToken(): Token {
			if (tokenCursor < tokens.length) {
				return tokens[tokenCursor]
			}
			let tokenLength = 0
			let name = ""
			for (const tokenMatcher of grammar.tokens) {
				if ((tokenLength = tokenMatcher.match())) {
					name = tokenMatcher.name
					break
				}
			}
			if (!tokenLength) {
				throw new Error("Could not find token")
			}

			const start = characterCursor
			const stop = start + tokenLength
			characterCursor = stop

			const nextToken: Token = {
				type: "Token",
				name,
				start,
				stop,
				value: input.slice(start, stop),
			}
			tokens.push(nextToken)
			return nextToken
		}

		const rootNode = grammar.nodes.find(node => node.name == "root")

		const matchers: Matchers = {
			token: {
				Literal: ({ value }) => {
					let length = 0
					while (
						length < value.length &&
						input[characterCursor + length] == value[length]
					) {
						length++
					}
					return length
				},
				Function: () => 0,
				Identifier: () => 0,
				Number: () => 0,
				Property: () => 0,
			},
			node: {
				Literal: ({ value }) => {
					const nextToken = getNextToken()
					return nextToken.name == value ? 1 : 0
				},
				Function: () => 0,
				Identifier: () => 0,
				Number: () => 0,
				Property: () => 0,
			},
		}

		return rootNode?.match()
	}
}
