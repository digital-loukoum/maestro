import { Maestro } from "Maestro.js"

export function generateMatcher(kind: "Token" | "Node", rule: Maestro.Rule) {
	let body: string
	if (rule.length == 1) {
		body = `\n\treturn this.match${kind}${rule[0].type}(${rule[0].data});\n`
	} else {
		body = "\n\tlet count = 0, attempt = 0;\n"
		for (const expression of rule) {
			body +=
				`\tattempt = this.match${kind}${expression.type}(${rule[0].data});\n` +
				`\tif (attempt == 0) return 0;\n` +
				`\tcount += attempt;\n`
		}
		body += "\treturn count;\n"
	}
	console.log("Generated:", body)
	return Function(body) as () => number
}
