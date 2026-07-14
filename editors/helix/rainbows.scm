; SPDX-FileCopyrightText: 2023 Clément Delafargue <clement@delafargue.name>
;
; SPDX-License-Identifier: Apache-2.0

; Parentheses - used in expressions and methods
[
  "("
  ")"
] @rainbow.bracket

; Square brackets - used in arrays
[
  "["
  "]"
] @rainbow.bracket

; Curly braces - used in maps
; sets and params cannot be nested
[
  "{"
  "}"
] @rainbow.bracket

; Scopes for rainbow bracket matching
; facts, predicates, params and sets cannot be nested and are left out
(parens) @rainbow.scope
(methods) @rainbow.scope
(array) @rainbow.scope
(map) @rainbow.scope
