[tokens]
string = between('"', '"', `\`)
number = createNumberToken()
boolean = either("true", "false")

[nodes]
String = { value: string }
Number = { value: number }
Boolean = { value: boolean }
Null = { value:  "null" }
Undefined = { value: "undefined" }

Property = { key: string } ":" { value: expression }
Object = "{" list({ properties <- Property }) "}"
Array = "[" list({ items <- expression }) "]"

[expressions]
expression = either(String, Number, Boolean, Null, Undefined, Object, Array)
