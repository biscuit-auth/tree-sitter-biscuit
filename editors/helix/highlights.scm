;; Literals
(number) @constant.numeric.integer
(boolean) @constant.builtin.boolean
(string) @string
(bytes) @string
(date) @constant.numeric.integer

;; Comments
(block_comment) @comment.block
(line_comment) @comment.line

;; Variables
(variable) @variable
(param) @variable.parameter

(predicate
  (nname) @function
)

(fact
  (nname) @function
)

;; Keywords
[
  "trusting"
  "check if"
  "check all"
  "allow if"
  "deny if"
] @keyword

[
  "authority"
  "previous"
] @constant.builtin

[
  "<-"
] @keyword.operator

;; Punctuation
[ "," ] @punctuation.delimiter

[ "("
  ")"
  "["
  "]"
] @punctuation.bracket

[
  "/"
  "*"
  "+"
  "-"
  "&"
  "|"
  "^"
  ">" "<" "<=" ">=" "==" "!="
  "&&"
  "||"
] @operator
