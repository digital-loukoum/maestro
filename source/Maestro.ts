export namespace Maestro {
	export type Ast = Array<Section>

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

	export type Expression = keyof Expressions

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
