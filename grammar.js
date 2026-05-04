/**
 * @file Rednex GameBoy Development System (RGBDS) grammar for Tree Sitter
 * @author dr4ghs <alvise.gorinati@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "rgbds",
  rules: {
    source_file: $ => "hello"
  }
});
