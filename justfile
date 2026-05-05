# https://just.systems

generate:
  @tree-sitter generate

test: generate
  @tree-sitter test

