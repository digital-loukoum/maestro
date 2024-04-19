import { toPOJO } from "./utilities/toPOJO"

export type Parsable = ArrayLike<unknown>

export type Grammar<Input extends Parsable> = Array<Rule<Input>>

export type Rule<Input extends Parsable> = () => undefined | Node

export abstract class Node {
	public abstract readonly name: string

	constructor(public start: number, public end: number, public parent?: Node) {}

	left = () => 0
	right = () => 0
	list = () => false

	takeLeft = (node: Node) => {}
	takeRight = (node: Node) => {}

	replaceLastChildWith = (node: Node): Node => {
		throw new Error(`Cannot replace child of node with no children`)
	}

	isPrimitive = () => {
		return this.left() == 0 && this.right() == 0
	}
}

abstract class ListNode extends Node {
	children = new Array<Node>()

	list = () => true

	takeLeft = node => this.children.push(node)
	takeRight = (node: Node) => this.children.push(node)

	replaceLastChildWith = (node: Node) => {
		const lastChild = this.children[this.children.length - 1]
		this.children[this.children.length - 1] = node
		return lastChild
	}
}

class NumberNode extends Node {
	name = "Number"
	constructor(start: number, end: number, public value: number) {
		super(start, end)
	}
}

class AdditionNode extends ListNode {
	name = "Addition"
	left = () => 20
	right = () => 20
}

class MultiplicationNode extends ListNode {
	name = "Multiplication"
	left = () => 30
	right = () => 30
}

class PositiveValueNode extends Node {
	name = "PositiveValue"
	child: Node | undefined = undefined

	right = () => (this.child ? 0 : 20)

	takeRight = (node: Node) => (this.child = node)

	replaceLastChildWith = (node: Node): Node => {
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

		// Find the next token, and create the node for it
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
				// only one node possible: NumberNode
				if (addNode(new NumberNode(start, end, Number(input.slice(start, end))))) {
					continue
				}
				throw new Error(`Error with number token`)
			}

			// --> AdditionToken <-- //
			if (input[start] == "+") {
				end++
				// two nodes possible: AdditionNode, PositiveValueNode
				if (
					addNode(new AdditionNode(start, end)) ||
					addNode(new PositiveValueNode(start, end))
				) {
					continue
				}
				throw new Error(`Error with '+' token`)
			}

			// --> MultiplicationToken <-- //
			if (input[start] == "*") {
				end++
				// one node possible: MultiplicationNode
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
