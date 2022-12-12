import { Maestro } from "Maestro.js"

export function generateMatcher(kind: "token" | "node", rule: Maestro.Rule) {
	let body = ""
	for (const expression of rule) {
		body += "\t" + `match.${kind}.${expression.type}()` + ";\n"
	}
	return body
}
