import { Maestro } from "Maestro.js"
import type { SourceBuildOptions, SourceOutputs } from "peggy"
import { parse as untypedParse } from "./parse.js"

export type { Maestro }

export function parse(
	input: string,
	options?: SourceBuildOptions<SourceOutputs>
): Maestro.Ast {
	return untypedParse(input.endsWith("\n") ? input : input + "\n", options)
}
