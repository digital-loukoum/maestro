In this v2, I tried to define my own parser combinators. It is an \[IN\] parser, which means, we go from the nodes to the tokens (we search for nodes that will search for tokens.)

However, we face two major issues, and one minor issue:

1. It's complicated to remember what matcher have been called to prevent infinite recursion. This add a lot of indexing calls, to find the cached values.
2. We have a lot of function calls. For example, for a simple multiplicator with numbers and the four basic operators, we got: 14 function calls.
3. The syntax errors are difficult to explain. If a user insert a token in a place where it should not be, we can't know there is an error until all nodes have been tried, and we can't know from where the error is.

-> I will go for a \[OUT\] parser, ie from the tokens to the nodes.
