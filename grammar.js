/*
 * SPDX-FileCopyrightText: 2023 Clément Delafargue <clement@delafargue.name>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = grammar({
  name: 'biscuit',

  conflicts: $ => [
    [ $.term, $.fact_term ],
    [ $.term, $.set_term ],
    [ $.set_term, $.fact_term ],
    [ $.unary_op_expression, $.binary_op_expression],
  ],

  rules: {
    source_file: $ => seq(
      optional($.comment),
      optional(seq($.origin_clause, ";")),
      repeat(prec(1, choice($.authorizer_element, $.comment)))
    ),
    
   authorizer_element: $ => seq(choice($.rule, $.fact, $.policy, $.check), ";"),
  rule: $ => seq(
      field('head', $.predicate),
      "<-",
      field('body', $.rule_body)
    ),
  check: $ => seq(
       choice("check if", "check all", "reject if"),
       $.rule_body,
       repeat(seq(
        "or",
        $.rule_body
      ))
    ),
  policy: $ => seq(
       choice("allow if", "deny if"),
       $.rule_body,
       repeat(seq(
        "or",
        $.rule_body
       ))
  ),
  rule_body: $ => seq(
      choice($.predicate, $.expression),
      repeat(seq(
        ",",
        choice($.predicate, $.expression)
      )),
      optional($.origin_clause)
    ),
  predicate: $ => seq(
                    $.nname,
                    "(",
                    $.term,
                    repeat(seq(",", $.term)),
                    ")"
                  ),
  fact: $ => seq(
               $.nname,
               "(",
               $.fact_term,
               repeat(seq(",", $.fact_term)),
               ")"
             ),
  method_argument: $ =>
    choice(
      $.closure,
      $.expression,
    ),
  closure: $ => 
      prec(11, seq($.variable, "->", $.expression)),
  expression: $ =>
    choice(
      $.parens,
      $.methods,
      $.unary_op_expression,
      $.binary_op_expression,
      $.term
    ),
  parens: $ =>
    prec(10, seq("(", $.expression, ")")),
  methods: $ =>
    prec(9, seq(
      $.expression,
      ".",
      $.nname,
      "(",
      optional($.method_argument),
      ")"
    )),
  unary_op_expression: $ =>
    prec(8, seq("!", $.expression)),
  binary_op_expression: $ => choice(
      prec.left(7, seq($.expression, "*", $.expression)),
      prec.left(7, seq($.expression, "/", $.expression)),
      prec.left(6, seq($.expression, "+", $.expression)),
      prec.left(6, seq($.expression, "-", $.expression)),
      prec.left(5, seq($.expression, "&", $.expression)),
      prec.left(4, seq($.expression, "|", $.expression)),
      prec.left(3, seq($.expression, "^", $.expression)),
      // todo comparison operators are NOT associative, but not marking them as such
      // generates an ambiguity
      // declaring -> as an operator instead of declaring a proper closure item
      // is a hack, but i have not found how to do it properly
      prec.left(2, seq($.expression, choice(">", "<", ">=", "<=", "==", "!=", "===", "!=="), $.expression)),
      prec.left(1, seq($.expression, "&&", $.expression)),
      prec.left(0, seq($.expression, "||", $.expression))
    ),
  term: $ => choice($.param, $.boolean, $.null, $.bytes, $.number, $.date, $.string, $.set, $.array, $.map, $.variable),
  fact_term: $ => choice($.param, $.boolean, $.null, $.bytes, $.number, $.date, $.string, $.set, $.array, $.map),
  set_term: $ => choice($.param, $.boolean, $.null, $.bytes, $.number, $.date, $.string),
  boolean: $ => choice("true", "false"),
  null: $ => "null",
  bytes: $ => token(seq("hex:", optional(repeat1(/[0-9a-f]{2}/)))),
  number: $ => token(seq(optional("-"), repeat1(/[0-9]/))),
  date: $ => token(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-5][0-9](Z|(\+|-)[0-9]{2}:[0-9]{2})/
  ),
  string: $ => token(seq(
    "\"",
    /(\\"|[^"])*/,
    "\""
  )),
  set: $ => seq("{",
                choice(
                  ",",
                  seq(
                    $.set_term,
                    repeat(seq(
                      ",",
                      optional($.set_term)
                    )),
                  ),
                ),
                "}"
            ),
  array: $ => seq("[",
                optional(seq(
                  $.fact_term,
                  repeat(seq(
                    ",",
                    optional($.fact_term)
                  )),
                )),
                "]"
            ),
  map_key: $ => choice($.number, $.string),
  map_entry: $ => seq($.map_key, ":", $.fact_term),
  map: $ => seq("{",
                optional(seq(
                  $.map_entry,
                  repeat(seq(
                    ",",
                    optional($.map_entry)
                  )),
                )),
                "}"
            ),
  nname: $ => seq(/[a-zA-Z]/, repeat(/[a-zA-Z0-9_:]/)),
  variable: $ => seq("$", repeat1(/[a-zA-Z0-9_:]/)),
  param: $ => seq("{", $.nname, "}"),
  origin_clause: $ =>
    seq("trusting", $.origin_element, repeat(seq(",", $.origin_element))),
  origin_element: $ =>
    choice("previous", "authority", seq($.sig_alg, repeat1(/[0-9a-f]{2}/))),
  sig_alg: $ => choice("ed25519/", "secp256r1/"),
  comment: $ => choice(
    $.line_comment,
    $.block_comment
  ),
  // copied from tree-sitter-dhall
  line_comment: $ =>
    seq("//", repeat($._not_end_of_line), "\n"),
  block_comment: $ =>
    seq("/*", $._block_comment_continue),
  _not_end_of_line: $ => /[\x20-\uD7FF]/,
  _block_comment_chunk: $ =>
    choice($.block_comment, /[\x20-\uD7FF]/),
  _block_comment_continue: $ =>
    choice("*/", seq($._block_comment_chunk, $._block_comment_continue)),  }
});

