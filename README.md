# maestro

The maestro of ast generators : fast and concise grammar syntax to generate Typescript and Zig parsers.

## Development diary

### Alpha v1

The idea is to use another parser (Peggy, a javascript parser) to first parse a Maestro grammar into a ready-to-use compiler.

Then, we can use this new parser to replace Peggy. Meta!

Difficulties encountered:

- Hard to handle some cases with Peggy. Infinite left recursivity can happen very easily with this kind of language.
- It's very complicated to generate a parser from rules. It's better to have a working parser first, then invent a grammar language to avoid the boilerplate.

### Alpha v2

I dropped Peggy to create a custom parser using parser combinators. The idea is simple: define functions that can parse an input and output a node.

We try every combinator until we find the right one.

This method had some drawbacks:

- It's complicated to remember what matcher have been called to prevent infinite recursion. This add a lot of indexing calls, to find the cached values.
- We have a lot of function calls. For example, for a simple multiplicator with numbers and the four basic operators, we got: 14 function calls.
- The syntax errors are difficult to explain. If a user insert a token in a place where it should not be, we can't know there is an error until all nodes have been tried, and we can't know from where the error is.

I also realized the difference between an `in` and an `out` parser. That's how I called them, but maybe they have an official name.

1. Parser combinators are an `in` parser. It means we go from the nodes (outside) to the tokens (inside). We're saying: "I want a Number node. So let's try, do I have a number token?".
2. `out` parsers go from the tokens (inside) to the nodes (outside). With an `out` parser, we say: "Hey, I've found this number token. What nodes can I construct with it?"

I realized that `out` parsers are much more faster. That's because instead of trying every node until we find one that match, we try every token until we find one that match. And that's much more faster, because you can eliminate tokens from the first character 99% of the times. With nodes, you have to do many function calls, and find the right token anyway.

Starting from the tokens also has the advantage of being simpler. We don't have to remember which node we already tried, everything is as fast as it can.

So I dropped parser combinators to start v3.

### Alpha v3

This time, let's build an `out` parser. We parse tokens, then we find the right node.

-> I've got a minimal parser of 250 lines that handle addition, multiplication, priority between operators, right and left operators, and lists. That's very promising: the code is super clean. There is no heavy operation, only number manipulations. We use prototypes to separate a node's data from its medata.