import { Node } from "../parserV3"

export function toPOJO(value: any): any {
	if (!value) {
		return value
	} else if (value instanceof Array) {
		return value.map(toPOJO)
	} else if (typeof value == "object") {
		const isNode = value instanceof Node
		const result: Record<string, any> = {}
		for (const key in value) {
			if (isNode && (key == "parent" || key == "start" || key == "end")) {
				continue
			}
			const property = value[key as keyof typeof value]
			if (typeof property == "function") {
				continue
			}
			result[key] = toPOJO(property)
		}
		return result
	}
	return value
}
