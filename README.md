# Tree Sitter grammar for biscuit

This is a work in progress, but it is already used by the [biscuit online tooling](https://www.biscuitsec.org/docs/tooling/datalog-playground/)

## Current support

Tree-sitter biscuit supports [biscuit datalog v3.3](https://www.biscuitsec.org/blog/biscuit-3-3/).

The following helix features are supported:

- syntax highlighting
- separator matching (aka rainbow brackets)
- tags listing
- text objects

## Known issues

Comparison / equality binary operators that are *not* associative are still parsed as left-associative to avoid an ambiguity in the grammar.

## How to use

### Helix

Add the following to `languages.toml` (make sure the commit id is up-to date)

```toml
[[language]]
name = "biscuit"
scope = "source.biscuit"
injection-regex = "(biscuit|authorizer|block|query)"
file-types = ["bcdl", "biscuit-datalog"]
comment-token = "//"
indent = { tab-width = 4, unit = "...."}
roots = []
language-servers = []

[language.auto-pairs]
'(' = ')'
'{' = '}'
'[' = ']'
'"' = '"'

[[grammar]]
name = "biscuit"
source = { git = "https://github.com/biscuit-auth/tree-sitter-biscuit", rev = "1b49f74064438e324485c272568b01ebfbe56b21" }
```

Then, copy `editors/helix/*.scm` in `queries/biscuit/` within a helix runtime directory.
