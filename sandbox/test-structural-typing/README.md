## Structural programming speed tests

Fa is a structured programming language, which means you can do this:

```
let myObject = {
  x = 12
  userName = "world"
}

let greet({ userName: string }) => log("Hello {userName}")

greet(myObject)
```

Javascript is per default structural, so this seems natural.

But statically-typed languages like Rust, Go or Zig are not structural, and you have to either:
1. Do a type cast (if you can)
2. Recreate a object with the fields

Solution #1 is faster in Javascript, so I  expected it to be the same with Zgig. It makes sense: we create a new object with solution 2! But after tested both solutions with Zig, 2 does not seem faster.

So basically, the code `greet(myObject)` will be transpiled in Zig to:

```zig
greet(.{ .userName: myObject.userName })
```
