start
  = sections

sections "sections"
  = (_ "\n")* head:Section? tail:((_ "\n")+ @Section)* { return (head ? [head] : []).concat(tail) }

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

Section "Section"
  = "[" _ name:identifier _ "]" _ "\n" rules:((_ "\n")* @RuleDeclaration _ "\n")* { return { type: "Section", name, rules } }

RuleDeclaration "RuleDeclaration"
  = identifier:identifier _ "=" _ rule:rule { return { type: "RuleDeclaration", identifier, rule } }

rule "rule"
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
  = "{" _ name:identifier _ operator:(":" / "<<") _ rule:rule _ "}" { return { type: "Property", name, operator, rule } }

Function "Function"
  = name:identifier _ "(" _ head:argument? _ tail:(_ "," _ @argument)* ")" { return { type: "Function", name, arguments: (head ? [head] : []).concat(tail) } }

Literal "Literal"
  = '"' value:[^"]* '"' { return { type: "Literal", value: value.join('')} }
  / "'" value:[^']* "'" { return { type: "Literal", value: value.join('')} }
  / "`" value:[^`]* "`" { return { type: "Literal", value: value.join('')} }
