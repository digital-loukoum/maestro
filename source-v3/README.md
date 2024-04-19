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
[ ] Read sentences
[ ] Allow to give grammars as argument to the parser
[ ] Allow to give grammars as argument to the parser
[ ] Handle sub-grammars
    For example, in the sentence `import X from Y`, we might want `X` and `Y` to follow different rules. 

## Sentence expressions

The actual implementation can handle primitives, left, right, left-right and list operations.

But how to deal with sentences?

For example, the `let mut` in Rust:

`let mut x: number = 12`

Here, `mut` is part of the `let` expression. How to do this with a token-based model?

We would like the following grammar declaration:

```
Declarator = "let" "mut"? {Identifier} {TypeDeclaration?} {Assignment}
```

This differs greatly from classic operators:

```
Addition = (Expression) "+" (Expression)
```

For the former case, we need the ability to **define and read sentences**.

Can we define a function to do so?

## Types in grammar

We've got:
1. Tokens
2. Nodes
3. Expressions

### Tokens

- They are lowercased
- They represent a parsable entity
- No value is associated to a token
- They basically represent a slice of the input
- They can be inserted in node and expressions declarations with brackets `[]`

Examples:

```
[tokens]
let = "let"
mut = "mut"
number = [0-9]+
identifier = [a-zA-Z]+

[nodes]
Declaration = [let] [identifier]
```

For simple grammar, you can omit token declarations. They are implicitely defined in node declarations.

### Nodes

- Every node has a **trigger token** (ex: `+` for additions, `let` for declarations, `{` for object declarations)
- There is a `Token 1:N Node` relation between trigger tokens and nodes
- Most of the times, this is a `1:1` relation
- A node contains additional data and can have children nodes. That's why they are represented with curly brackets `{}`

### Expressions

- An expression is a **set of nodes or expressions**
- It is declared using the `|` operator, left and right elements of the operator being nodes or other expressions
- An expression cannot be recursive
- Expressions "vanish" in the final AST. That's why they can be inserted in declarations with parenthesis `()`
- The entry point of a grammar is an expression

Example:

```
[nodes]
Number = [0-9]+
Addition = (expression) "+" (expression)

[expressions]
expression = Number | Addition
```
