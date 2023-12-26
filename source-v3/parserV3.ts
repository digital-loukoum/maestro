export type Parsable = ArrayLike<unknown>

export type Grammar<Input extends Parsable> = Array<Rule<Input>>

export type Rule<Input extends Parsable> = () => undefined | Node

abstract class Node {
	constructor(
		public name: string,
		public start: number,
		public end: number,
		public parent?: Node
	) {}

	left() {
		return 0
	}
	right() {
		return 0
	}
	list() {
		return false
	}
	takeLeft(node: Node) {}
	takeRight(node: Node) {}

	replaceLastChildWith(node: Node): Node {
		throw new Error(`Cannot replace child of node with no children`)
	}

	isPrimitive() {
		return this.left() == 0 && this.right() == 0
	}
}

function toPOJO(value: any): any {
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

abstract class ListNode extends Node {
	children = new Array<Node>()

	abstract left(): number
	abstract right(): number

	takeLeft(node: Node) {
		this.children.push(node)
	}

	takeRight(node: Node) {
		this.children.push(node)
	}

	list() {
		return true
	}

	replaceLastChildWith(node: Node) {
		const lastChild = this.children[this.children.length - 1]
		this.children[this.children.length - 1] = node
		return lastChild
	}
}

class NumberNode extends Node {
	constructor(start: number, end: number, public value: number) {
		super("Number", start, end)
	}
}

class AdditionNode extends ListNode {
	constructor(start: number, end: number) {
		super("Addition", start, end)
	}
	left() {
		return 20
	}
	right() {
		return 20
	}
}

class MultiplicationNode extends ListNode {
	constructor(start: number, end: number) {
		super("Multiplication", start, end)
	}
	left() {
		return 30
	}
	right() {
		return 30
	}
}

class PositiveValueNode extends Node {
	child: Node | undefined = undefined

	constructor(start: number, end: number) {
		super("PositiveValue", start, end)
	}

	right() {
		return this.child ? 0 : 20
	}
	takeRight(node: Node) {
		this.child = node
	}
	replaceLastChildWith(node: Node): Node {
		const lastChild = this.child
		if (!lastChild) {
			throw new Error(`Cannot replace child of node with no children`)
		}
		this.child = node
		return lastChild
	}
}

export function parserV3<Input extends Parsable>() {
	return (input: string): Node | undefined => {
		/**
		 * The root node is the ancestor of all other nodes
		 */
		let rootNode!: Node

		/**
		 * Rightmost node is the current node
		 */
		let currentNode: Node | undefined = undefined
		let start = 0
		let end = 0

		do {
			start = end
			skipWhitespaces()

			if (start >= input.length) {
				break
			}

			// --> NumberToken <-- //
			while (input[end] >= "0" && input[end] <= "9") {
				// console.log(input[end])
				end++
			}
			if (end > start) {
				if (addNode(new NumberNode(start, end, Number(input.slice(start, end))))) {
					continue
				}
				throw new Error(`Error with number token`)
			}

			// --> AdditionToken <-- //
			if (input[start] == "+") {
				end++
				if (
					addNode(new AdditionNode(start, end)) ||
					addNode(new PositiveValueNode(start, end))
				) {
					continue
				}
				throw new Error(`Error with '+' token`)
			}

			if (input[start] == "*") {
				end++
				if (addNode(new MultiplicationNode(start, end))) {
					continue
				}
				throw new Error(`Error with '*' token`)
			}
		} while (true)

		console.log("AST", toPOJO(rootNode))
		return rootNode

		// -- UTILITY FUNCTIONS -- //
		function skipWhitespaces() {
			while (input[start] == " ") {
				start++
			}
			end = start
		}

		function addNode(node: Node): boolean {
			if (!currentNode || !rootNode) {
				rootNode = node
				currentNode = node
				return true
			}

			const right = currentNode.right()
			const left = node.left()

			if (right == 0 && left == 0) {
				// conflict: no node can take each other
				return false
			} else if (right > 0 && left > 0) {
				// conflict: both nodes want to take each other
				return false
			} else if (left > 0) {
				const weakerParent = findFirstWeakerParent(left)
				if (!weakerParent) {
					// 1 * 2 + 3
					// *(1, 2)       --       rootNode: *, currentNode: 2
					// +(*(1, 2), ?) --       rootNode: +, currentNode: +
					node.takeLeft(rootNode)
					rootNode.parent = node
					rootNode = node
					currentNode = node // rightmost node, since its right is empty
				} else if (weakerParent.name == node.name && node.list()) {
					// we can add the node to the list
					currentNode = weakerParent
				} else {
					// 1 + 2 * 3
					// +(1, 2)       --       rootNode: +, currentNode: 2
					// +(1, *(2, ?)) --       rootNode: +, currentNode: *

					// 1 + 2 ** 3 * 4
					// +(1, 2)       --       rootNode: +, currentNode: 2
					// +(1, **(2, ?)) --       rootNode: +, currentNode: **
					// +(1, **(2, 3)) --       rootNode: +, currentNode: 3
					// +(1, *(**(2, 3), ?)) --       rootNode: +, currentNode: *

					const child = weakerParent.replaceLastChildWith(node)
					node.takeLeft(child)
					child.parent = node
					node.parent = weakerParent
					currentNode = node
				}
			} else {
				currentNode.takeRight(node)
				node.parent = currentNode
				currentNode = node
			}
			return true
		}

		function findFirstWeakerParent(left: number): Node | undefined {
			let parent = currentNode?.parent
			while (parent) {
				const right = parent.right()
				if (right && right <= left) {
					return parent
				}
				parent = parent.parent
			}
			return undefined
		}
	}
}
