export type TokenDeclaration<Input extends Parsable> = {
	match: (input: Input, offset: number) => Token | null
	nodes: Array<NodeMatcher>
}

export type Token = Node<undefined> // a token object is a raw node without additional values

export type Node<Values> = {
	name: string
	start: number
	end: number
	raw: string
} & (Values extends undefined ? {} : { values: Values })

export type NodeMatcher = () => Node<unknown> | null
export type Parsable = ArrayLike<unknown>
