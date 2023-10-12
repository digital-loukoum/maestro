export const literalToken = <Input extends ArrayLike<unknown>>(value: Input) => ({
	[`'${value}'`]: (input: Input, offset: number) => {
		for (let i = 0; i < value.length; i++) {
			if (input[offset + i] != value[i]) return 0
		}
		return value.length
	},
})
