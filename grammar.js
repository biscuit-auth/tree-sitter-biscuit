
module.exports = grammar({
  name: 'biscuit',

  conflicts: $ => [
    [ $.term, $.fact_term ],
    [ $.term, $.set_term ],
    [ $.set_term, $.fact_term ],
  ],

  rules: {

   source_file: $ => repeat(choice($.authorizer_element)),
   authorizer_element: $ => seq(
                             choice($.rule, $.fact, $.policy, $.check),
                             optional($.sp),
                             ";",
                             optional($.sp)
                           ),
  rule: $ => seq(
      $.predicate,
      optional($.sp),
      "<-",
      optional($.sp),
      $.rule_body
    ),
  check: $ => seq(
       choice("check if", "check all"),
       optional($.sp),
       $.rule_body,
       repeat(seq(
        "or", $.sp,
        $.rule_body
      ))
    ),
  policy: $ => seq(
       choice("allow if", "deny if"),
       optional($.sp),
       $.rule_body,
       repeat(seq(
        "or", $.sp,
        $.rule_body
       ))
  ),
  rule_body: $ => seq(
      $.predicate,
      repeat(seq(
        ",",
        optional($.sp),
        choice($.predicate, $.expression)
      ))
    ),
  predicate: $ => seq(
                    $.nname,
                    "(",
                    optional($.sp),
                    $.term,
                    repeat(seq(",", optional($.sp), $.term)),
                    optional($.sp),
                    ")"
                  ),
  fact: $ => seq(
               $.nname,
               "(",
               optional($.sp),
               $.fact_term,
               repeat(seq(",", optional($.sp), $.fact_term)),
               optional($.sp),
               ")"
             ),
  expression: $ =>
      $.term,
  term: $ => choice($.boolean, $.bytes, $.number, $.date, $.string, $.variable, $.set),
  fact_term: $ => choice($.boolean, $.bytes, $.number, $.date, $.string, $.set),
  set_term: $ => choice($.boolean, $.bytes, $.number, $.date, $.string),
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
                optional($.sp),
                optional(seq(
                  $.set_term,
                  optional($.sp),
                  repeat(seq(
                    ",",
                    optional($.sp),
                    optional($.set_term)
                  )),
                )),
                "]"
            ),
  sp: $ => repeat1(choice(" ", "\t", "\n")),
  nname: $ => seq(/[a-zA-Z]/, repeat(/[a-zA-Z0-9_:]/)),
  variable: $ => seq("$", repeat1(/[a-zA-Z0-9_:]/)),
  }
});

