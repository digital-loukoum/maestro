type InputStruct = {
	i1: number
	i2: number
	i3: number
	i4: number
	i5: number
	i6: number
	i7: number
	i8: number
}

function doStuffWithInputStruct(s: InputStruct) {
	s.i1 + s.i8
}

const p = {
	i1: 1,
	i2: 2,
	i3: 3,
	i4: 4,
	i5: 5,
	i6: 6,
	i7: 7,
	i8: 8,
}

{
	const start = Date.now()
	for (let i = 0; i < 1000000; i++) {
		doStuffWithInputStruct(p)
	}
	console.log("packed: {}\n", Date.now() - start)
}

{
	const start = Date.now()
	for (let i = 0; i < 1000000; i++) {
		doStuffWithInputStruct({
			i1: p.i1,
			i2: p.i2,
			i3: p.i3,
			i4: p.i4,
			i5: p.i5,
			i6: p.i6,
			i7: p.i7,
			i8: p.i8,
		})
	}
	console.log("unpacked: {}\n", Date.now() - start)
}
