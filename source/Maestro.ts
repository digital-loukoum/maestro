export namespace Maestro {
	export type Ast = Array<Declaration>

	export type Declaration = {
		identifier: string
		rules: Rules
	}

	export type Expression =
		| Number
		| Literal
		| Identifier
		| Property
		| Literal
		| Identifier
		| Function

	export type Rules = Array<Expression>

	export type FunctionArgument = {
		name?: string
		value: Expression
	}

	export type Number = {
		type: "Number"
		value: number
	}

	export type Literal = {
		type: "Literal"
		value: string
	}

	export type Identifier = {
		type: "Identifier"
		name: string
	}

	export type Function = {
		type: "Function"
		name: string
		arguments: Array<FunctionArgument>
	}

	export type Property = {
		type: "Property"
		name: string
		operator: ":" | "<<"
		rules: Rules
	}
}
