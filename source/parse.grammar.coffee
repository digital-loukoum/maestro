start
  = declarations

declarations "declarations"
  = (_ "\n")* head:declaration? tail:((_ "\n")+ @declaration)* { return (head ? [head] : []).concat(tail) }

_ "space"
  = [ \t]*

identifier "identifier"
  = value:[_a-zA-Z]+ { return value.join('') }

number "number"
  = value:[0-9]+ { return value.join('') }

Number "Number"
  = value:number { return { type: "Number", value } }

Identifier "Identifier"
  = name:identifier { return { type: "Identifier", name } }

declaration "declaration"
  = identifier:identifier _ "=" _ rules:rules { return { identifier, rules } }

rules "rules"
  = _ head:expression tail:(_ @expression)* { return [head, ...tail] }

expression "expression"
  = Function
  / Number
  / Property
  / Literal
  / Identifier

argument "argument"
  = name:identifier _ ":" _ value:expression { return { name, value } }
  / value:expression { return { value, name: undefined } }

Property "Property"
  = "{" _ name:identifier _ operator:(":" / "<<") _ rules:rules _ "}" { return { type: "Property", name, operator, rules } }

Function "Function"
  = name:identifier _ "(" _ head:argument? _ tail:(_ "," _ @argument)* ")" { return { type: "Function", name, arguments: (head ? [head] : []).concat(tail) } }

Literal "Literal"
  = '"' value:[^"]* '"' { return { type: "Literal", value: value.join('')} }
  / "'" value:[^']* "'" { return { type: "Literal", value: value.join('')} }
  / "`" value:[^`]* "`" { return { type: "Literal", value: value.join('')} }
