/**
 * !!EXPERIMENTAL!!
 *
 * The functional approach is more complex than the class-based approach, because we need, for each node, to create:
 * 1. the type definition (ex: Node)
 * 2. the prototype object (ex: nodePrototype)
 * 3. the factory function (ex: createNode)
 *
 * With the class-based approach, we only need to create the class definition and we automatically get:
 * 1. the type definition (ex: Node)
 * 2. the prototype object, i.e. the default values (ex: Node.prototype)
 * 3. the factory function (ex: new Node())
 *
 * So, in this case, class-based approach is more efficient.
 */
export namespace ParserV3Functional {
	// ** NODE ** //
	export type Node = {
		name: string
		start: number
		end: number
		left: () => number
		right: () => number
		list: () => boolean
		takeLeft: (node: Node) => void
		takeRight: (node: Node) => void
		replaceLastChildWith: (node: Node) => Node
		isPrimitive: () => boolean
	}

	export const nodePrototype = {
		left: () => 0,
		right: () => 0,
		isPrimitive() {
			return this.left() == 0 && this.right() == 0
		},
		list: () => false,
		takeLeft(node: Node) {},
		takeRight(node: Node) {},
	}

	export const createNode = (name: string, start: number, end: number): Node =>
		Object.assign(Object.create(nodePrototype), { name, start, end })

	// ** NUMBER NODE ** //
	export const numberNodePrototype = {
		...nodePrototype,
		name: "Number",
	}

	export type NumberNode = Node & {
		name: "Number"
		value: number
	}

	export const createNumberNode = (
		start: number,
		end: number,
		value: number
	): NumberNode =>
		Object.assign(Object.create(numberNodePrototype), { start, end, value })
}
