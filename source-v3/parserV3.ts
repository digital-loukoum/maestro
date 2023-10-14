import { Context, Grammar, Node, Parsable, Slot, Token } from "./types"

export function parserV3<Input extends Parsable>(grammar: Grammar<Input>) {
	return (input: Input): Node<unknown> | undefined => {
		const nodes: Array<Node<unknown>> = [] // should be a very small array, containing 2 elements max 99% of the time
		const rightestSlots: Array<Slot> = [] // this array can grow quite much
		// let token: Token | undefined = undefined
		let node: Node<unknown> | undefined = undefined
		// let slot: Node<unknown> | undefined = undefined
		// const scopes: Array<Scope> = []
		// let currentScope: Scope | undefined = undefined
		// let noAvailableSlot = true

		const context: Context<Input> = {
			input,
			start: 0,
			useLeftNode,
			useRightNode,
		}

		skipWhitespaces()

		while (context.start < input.length) {
			// console.log("scopes", scopes)
			// noAvailableSlot = currentScope == undefined

			// 1. we find the next token
			for (const rule of grammar) {
				node = rule(context)
				if (node) break
			}
			if (!node) {
				throw new Error(`Unexpected character at position ${context.start}`)
			}

			context.start = node.end
			const rightestSlot = rightestSlots[rightestSlots.length - 1]

			// 3. we add the node to the AST
			if (isSlotAvailable(rightestSlot)) {
				console.log("Slot available", nodes, rightestSlots)
				Object.assign(rightestSlot.node, node)
			} else {
				nodes.push(node)
				rightestSlots.push({ node, priority: 0 })
			}

			skipWhitespaces()
		}

		return nodes[0]

		// -- UTILITY FUNCTIONS -- //
		function skipWhitespaces() {
			while (input[context.start] == " ") {
				context.start++
			}
		}

		function useLeftNode(
			priority: number
		): Node<unknown> | undefined {
			if (rightestSlots.length == 0) {
				throw new Error("No left node to use")
			}

			for (let index = rightestSlots.length - 1; index >= 0; index--) {
				const rightestSlot = rightestSlots[index]
				if (isSlotAvailable(rightestSlot)) {
					throw new Error("TODO: isSlotAvailable(rightestSlot)")
				}
				if (priority > rightestSlot.priority) {
					// we found our left node
					const leftNode = { ...rightestSlot.node as Node<unknown> };
					(rightestSlot.node as any).name = undefined; // we make the slot available
					return leftNode
				}
			}

			console.log("Using left node. Rightest slot:", rightestSlot)

			if (isSlotAvailable(rightestSlot)) {
				throw new Error("TODO: isSlotAvailable(rightestSlot)")
			} else if (rightestSlot.priority < priority) {
				// replace the rightmost slot
				rightestSlots.push({ node, priority })
				return nodes.pop()
			} else {
				const leftNode = { ...(rightestSlot.node as Node<unknown>) }
				rightestSlot.node = node
				rightestSlot.priority = priority
				return leftNode
			}
		}

		function useRightNode(priority: number): Node<unknown> | undefined {
			const node = {}
			rightestSlots.push({ node, priority })
			return node as Node<unknown>
		}

		function isSlotAvailable(slot: Slot | undefined) {
			return slot && (slot.node as Node<unknown>).name === undefined
		}

		function emptySlot(slot: Slot) {
			for (const key in slot.node) {
				delete slot.node[key]
			}
		}
	}
}
