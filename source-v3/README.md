The **v3** version is an \[OUT\] parser, which means we go from the tokens to the nodes.

Every token knows which nodes it can create. For example, the '+' token can only create an `Addition` node.

If a token failed every possible node associated, then there is a syntax error. For exemple `3 + ` would create an error, because the node `Addition` expect an expression to the right.

## Algorithm

1. We read the next token by matching every token
2. If a token return true, we got our token
3. Every token is associated with a set of node matchers. For example, `+` is associated to AdditionNode, `{` is associated to ObjectNode or BlockNode. We try every node until we have a match.
4. If we have no match, we raise an error.
5. If we have a match:
  i. if the AST is empty, we add the node to the AST,
  ii. if the rightmost AST value must take a right node:
    a. if the current node must take a left node, we raise an error
    b. if the current node has lower priority, the left node takes it ("adopt" operation),
    c. if the current node has higher priority, it replaces left node's last child and takes it ("kidnap" operation),
  iii. if the rightmost AST value 

## Todo

[x] Handle primitives
[x] Handle right operations
[x] Handle left operations
[x] Handle precedence rules
[ ] Allow to give grammars as argument to the parser
[ ] Allow to give grammars as argument to the parser
[ ] Handle sub-grammars
    For example, in the sentence `import X from Y`, we might want `X` and `Y` to follow different rules. 
