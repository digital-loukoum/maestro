The **v3** version is an \[OUT\] parser, which means we go from the tokens to the nodes.

Every token knows which nodes it can create. For example, the '+' token can only create an `Addition` node.

If a token failed every possible node associated, then there is a syntax error. For exemple `3 + ` would create an error, because the node `Addition` expect an expression to the right.
