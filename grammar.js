
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
      $.predicate,
      "<-",
      $.rule_body
    ),
  check: $ => seq(
       choice("check if", "check all"),
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
  expression: $ =>
    choice(
      $.parens,
      $.methods,
      $.unary_op_expression,
      $.binary_op_expression,
      $.term
      // todo methods
    ),
  parens: $ =>
    prec(10, seq("(", $.expression, ")")),
  methods: $ =>
    prec(9, seq(
      $.expression,
      ".",
      $.nname,
      "(",
      repeat($.expression),
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
      prec.left(2, seq($.expression, choice(">", "<", ">=", "<=", "==", "!="), $.expression)),
      prec.left(1, seq($.expression, "&&", $.expression)),
      prec.left(0, seq($.expression, "||", $.expression))
    ),
  term: $ => choice($.param, $.boolean, $.bytes, $.number, $.date, $.string, $.variable, $.set),
  fact_term: $ => choice($.param, $.boolean, $.bytes, $.number, $.date, $.string, $.set),
  set_term: $ => choice($.param, $.boolean, $.bytes, $.number, $.date, $.string),
  boolean: $ => choice("true", "false"),
  bytes: $ => token(seq("hex:", optional(repeat1(/[0-9a-f]{2}/)))),
  number: $ => token(seq(optional("-"), repeat1(/[0-9]/))),
  date: $ => token(
    /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-2]{2}(Z|(\+|-)[0-9]{2}:[0-9]{2})/
  ),
  string: $ => token(seq(
    "\"",
    /(\\"|[^"])*/,
    "\""
  )),
  set: $ => seq("[",
                optional(seq(
                  $.set_term,
                  repeat(seq(
                    ",",
                    optional($.set_term)
                  )),
                )),
                "]"
            ),
  nname: $ => seq(/[a-zA-Z]/, repeat(/[a-zA-Z0-9_:]/)),
  variable: $ => seq("$", repeat1(/[a-zA-Z0-9_:]/)),
  param: $ => seq("{", $.nname, "}"),
  origin_clause: $ =>
    seq("trusting", $.origin_element, repeat(seq(",", $.origin_element))),
  origin_element: $ =>
    choice("previous", "authority", seq("ed25519/", repeat1(/[0-9a-f]{2}/))),
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

