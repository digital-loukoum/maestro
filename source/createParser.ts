import { Maestro } from "Maestro.js"
import { parseNodes } from "parseNodes.js"
import { parseTokens } from "parseTokens.js"
import { inspect } from "util"

type Parser = {
	parse(input: string): void
}

type Token = {
	type: "Token"
	start: number
	stop: number
	value: string
}

export function createParser(ast: Maestro.Ast): Parser {
	let cursor = 0
	let nextToken: null | Token

	const declarations = {
		tokens: parseTokens(ast),
		nodes: parseNodes(ast),
	}

	console.log(inspect({ declarations }, { depth: null, colors: true }))

	function findNextToken(): Token {
		if (!nextToken) {
			nextToken = 
		}
		return nextToken
	}

	return {
		parse(input) {
			for (const nodeDeclaration of declarations.nodes) {
				for (const expression of nodeDeclaration.rule) {
					const token = findNextToken()
				}
			}
		},
	}
}
