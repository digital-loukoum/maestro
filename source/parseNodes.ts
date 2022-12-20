import { Maestro } from "Maestro.js"

export type NodeDeclaration = {
	name: string
	rule: Maestro.Rule
}

export function parseNodes(ast: Maestro.Ast): Array<NodeDeclaration> {
	const nodes: Array<NodeDeclaration> = []

	ast.forEach(section => {
		if (section.name != "nodes") return

		section.rules.forEach(({ identifier, rule }) => {
			nodes.push({
				name: identifier,
				rule,
			})
		})
	})

	return nodes
}
