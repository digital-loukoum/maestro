export type Token = Node<{}> // a token object is a raw node without additional values

export type Node<Value> = {
	name: string
	start: number
	end: number
	// raw: string
} & Value

export type Parsable = ArrayLike<unknown>

export type Grammar<Input extends Parsable> = Array<Rule<Input>>

export type Rule<Input extends Parsable> = (
	context: Context<Input>
) => undefined | Node<unknown>

export type Context<Input extends Parsable> = {
	input: Input
	start: number
	useLeftNode(node: Node<unknown>, priority: number): Node<unknown> | undefined
	useRightNode(priority: number): Node<unknown> | undefined
}

export type Slot = {
	node: Node<unknown> | {}
	priority: number
}
