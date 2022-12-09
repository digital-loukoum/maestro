start
  = additive

_ = " "*

additive
  = left:multiplicative _ "+" _ right:additive { return { type: "Add", left, right }; }
  / multiplicative

multiplicative
  = left:primary _ "*" _ right:multiplicative { return { type: "Multiply", left, right }; }
  / primary

primary
  = integer
  / "(" _ additive:additive _ ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return { type: "Integer", value: parseInt(digits.join(""), 10) }; }
