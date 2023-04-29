export namespace Maestro {
	export type Ast = Array<Section>

	export type Target = "ts" | "js" | "js-pure" | "zig" | "native" | "wasm"

	export type TokenMatcher = {
		name: string
		match: () => number // length of the token
		anonymous?: boolean
	}

	export type NodeMatcher = {
		name: string
		match: () => any
	}

	export type Grammar = {
		tokens: Array<TokenMatcher>
		nodes: Array<NodeMatcher>
	}

	export type Section = {
		type: "Section"
		name: string
		rules: Array<RuleDeclaration>
	}

	export type RuleDeclaration = {
		type: "RuleDeclaration"
		identifier: string
		rule: Rule
	}

	export type Expression = Expressions[keyof Expressions]

	export type Expressions = {
		Number: {
			type: "Number"
			value: number
		}

		Literal: {
			type: "Literal"
			value: string
		}

		Identifier: {
			type: "Identifier"
			name: string
		}

		Function: {
			type: "Function"
			name: string
			arguments: Array<FunctionArgument>
		}

		Property: {
			type: "Property"
			name: string
			operator: ":" | "<<"
			rules: Rule
		}
	}

	export type Rule = Array<Expression>

	export type FunctionArgument = {
		name?: string
		value: Expression
	}
}
