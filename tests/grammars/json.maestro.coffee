string = between('"', '"', `\`)
number = createNumberExpression()
boolean = either("true", "false")

String = { value: string }
Number = { value: number }
Boolean = { value: boolean }
Null = { value: "null" }
Undefined = { value: "undefined" }

Property = { key: string } ":" { value: expression }
Object = "{" list({ properties << Property }) "}"
Array = "[" list({ items << expression }) "]"

expression = either(String, Number, Boolean, Null, Undefined, Object, Array)
