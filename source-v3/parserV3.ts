import { Node, NodeMatcher, Parsable, Token, TokenDeclaration } from "./types"

export function parserV3<Input extends Parsable>(tokens: Array<TokenDeclaration<Input>>) {
	let offset = 0

	return (input: Input): Token | null => {
		let result: Token | null = null
		let nodes: Array<NodeMatcher>
		let token: Token | null = null
		let node: Node<unknown> | null = null
		let tokenDeclaration!: TokenDeclaration<Input>

		skipWhitespaces()

		while (offset < input.length) {
			// 1. we find the next token
			for (tokenDeclaration of tokens) {
				token = tokenDeclaration.match(input, offset)
				if (token) break
			}
			if (!token) {
				throw new Error(`Unexpected character at position ${offset}`)
			}
			offset = token.end

			// 2. we find the node associated with the token
			// Inline this loop in precompiled mode (with the form `node = nodeMatcher1() ?? nodeMatcher2() ?? ...`)
			for (const nodeMatcher of tokenDeclaration.nodes) {
				node = nodeMatcher()
				if (node) break
			}
			if (!node) {
				throw new Error(`Unexpected token ${token.name} at position ${token.start}`)
			}

			// 3. we add the node to the AST
		}

		return result

		// -- UTILITY FUNCTIONS -- //
		function skipWhitespaces() {
			while (input[offset] == " ") {
				offset++
			}
		}

		function getToken(): Token | null {
			skipWhitespaces()
			let result: Token | null = null
			for (const token of tokens) {
				result = token.match(input, offset)
				if (result) break
			}
			return result
		}
	}
}
