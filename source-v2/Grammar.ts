import { MaestroParser } from "./MaestroParser.js"

export type Grammar<Input extends ArrayLike<unknown>> = {
	tokens: Array<TokenMatcher<Input>>
	nodes: Array<NodeMatcher<Input>>
	expressions: Array<ExpressionMatcher<Input>>
}

export type Token = {
	name: string
	start: number
	stop: number
}

export type TokenMatcher<Input> = {
	name: string
	match: (input: Input, at: number) => number
}

export type NodeMatcher<Input extends ArrayLike<unknown>> = {
	// type: "node"
	name: string
	match: (parser: MaestroParser<Input>) => null | BaseNode
}

export type ExpressionMatcher<Input extends ArrayLike<unknown>> = {
	// type: "expression"
	name: string
	match: (context: MaestroParser<Input>) => null | BaseNode
}

export type BaseNode = {
	name: string
	start: number
	stop: number
}

// export type GetNodes<MyGrammar extends Grammar<any>> = ReturnType<
// 	MyGrammar["nodes"][number]["match"]
// >
