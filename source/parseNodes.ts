import { Maestro } from "Maestro.js"

export type NodeDeclarations = Array<NodeDeclaration>
export type NodeDeclaration = {
	name: string
	rule: Maestro.Rule
}

export function parseNodes(ast: Maestro.Ast): NodeDeclarations {
	const nodes: NodeDeclarations = []

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
