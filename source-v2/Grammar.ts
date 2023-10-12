import { MaestroParser } from "./MaestroParser.js"

export type Grammar<Input extends ArrayLike<unknown>> = {
	tokens: Record<string, TokenMatcher<Input>>
	nodes: Record<string, NodeMatcher<Input>>
	// expressions: Record<string, ExpressionMatcher<Input>>
}

export type Token = {
	name: string
	start: number
	stop: number
}

export type TokenMatcher<Input> = (input: Input, at: number) => number

export type NodeMatcher<Input extends ArrayLike<unknown>> = (
	parser: MaestroParser<Input>
) => null | BaseNode

export type ExpressionMatcher<Input extends ArrayLike<unknown>> = (
	context: MaestroParser<Input>
) => null | BaseNode

export type BaseNode = {
	name: string
	start: number
	stop: number
}

// export type GetNodes<MyGrammar extends Grammar<any>> = ReturnType<
// 	MyGrammar["nodes"][number]["match"]
// >
