import { Maestro } from "Maestro.js"
import { parseNodes } from "parseNodes.js"
import { parseTokens } from "parseTokens.js"
import { generateMatcher } from "./generateMatcher.js"

export function generateGrammar(ast: Maestro.Ast): Maestro.Grammar {
	const tokenDeclarations = parseTokens(ast)
	const nodeDeclarations = parseNodes(ast)

	return {
		tokens: tokenDeclarations.map(declaration => ({
			name: declaration.name,
			arguments: declaration.anonymous,
			match: generateMatcher("Token", declaration.rule),
		})),
		nodes: nodeDeclarations.map(declaration => ({
			name: declaration.name,
			match: generateMatcher("Node", declaration.rule),
		})),
	}
}
