import { Maestro } from "Maestro.js"

export type TokenDeclarations = Array<TokenDeclaration>
export type TokenDeclaration = {
	name: string
	rule: Maestro.Rule
	anonymous?: boolean
}

export function parseTokens(ast: Maestro.Ast): TokenDeclarations {
	const tokens: TokenDeclarations = []

	ast.forEach(section => {
		// we list all declared tokens
		if (section.name == "tokens") {
			section.rules.forEach(({ identifier, rule }) => {
				tokens.push({
					name: identifier,
					rule,
				})
			})
		}

		// and we add all anonymous tokens
		section.rules.forEach(({ rule }) => {
			rule.forEach(expression => {
				if (expression.type == "Literal") {
					const name = expression.value
					tokens.push({
						name,
						rule: [expression],
						anonymous: true,
					})
				}
			})
		})
	})

	return tokens
}
