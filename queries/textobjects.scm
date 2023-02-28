(rule
  head: (predicate) @parameter.around
  body: (rule_body) @function.inside
) @function.around

(check
  (rule_body) @test.inside
) @test.around

(policy
  (rule_body) @test.inside
) @test.around

[
  (block_comment)
  (line_comment)
] @comment.around
