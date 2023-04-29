#1 <node name> <trigger token> -> <expression>
Number number -> value:*
String string -> value:*
Addition "+" -> left:Expression * right:Expression
ToNumber "+" -> * right:Expression
Multiplication "*" -> left:Expression * right:Expression
Import "import" -> * :identifier "from" :string
# this is closer to what the program actually does
# BUT! Issue with multiple branches (what if the same token '+' could produce two different nodes?)

#2 <node name> = <expression>
[nodes]
Number = value:number # trigger: number
String = value:string # trigger: string
Addition = left:Expression "+" right:Expression # trigger: "+"
ToNumber = "+" right:Expression # trigger: "+"
Multiplication = left:Expression "*" right:Expression # trigger: "*"
Import = "import" :identifier "from" :string # trigger: "import"

[expressions]
Expression = Number | String | Addition | ToNumber | Multiplication
# it's "implicit" declaration
# here, the first encountered token is used as a trigger

# This grammars will build the following parsing function:
let parseToken(token) ->
	when token.kind
		is number:
			# only one possibilty when meeting a number
			return Number(token)
		is string:
			return String(token)
		is "+":
			# two possibilities when meeting a "+"!
			return Addition(token) || ToNumber(token)
		is "*":
			return Multiplication(token)
		is "import":
			return Import(token)
