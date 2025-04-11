/**
 * @file Lupin Tree Sitter
 * @author Iris Junckes <me@junckes.dev>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lupin",

  conflicts: ($) => [[$.qualified_name, $.function_call]],

  extras: ($) => [/\s|\r?\n/, $.comment],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) =>
      seq(
        $.module_declaration,
        repeat($.use_declaration),
        repeat($.function_definition),
      ),
    module_declaration: ($) => seq("module", $.qualified_name, ";"),
    use_declaration: ($) => seq("use", $.qualified_name, ";"),
    qualified_name: ($) => seq($.identifier, repeat(seq("::", $.identifier))),
    function_definition: ($) =>
      seq(
        optional("pub"),
        "fn",
        $.identifier,
        $.parameter_list,
        $.return_type,
        $.block,
      ),
    parameter_list: ($) =>
      seq(
        "(",
        optional(
          seq($.parameter, repeat(seq(",", $.parameter)), optional(",")),
        ),
        ")",
      ),
    parameter: ($) => seq($.identifier, ":", $.type),
    return_type: ($) => choice($.type, seq("!", $.type)),
    type: ($) =>
      choice(
        "void",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "f32",
        "f64",
        "bool",
        "char",
        "string",
        "cstring",
        $.qualified_name,
      ),
    block: ($) => seq("{", repeat($.statement), "}"),
    statement: ($) =>
      choice(
        $.variable_declaration,
        $.expression_statement,
        $.return_statement,
      ),
    variable_declaration: ($) =>
      seq(
        "let",
        optional("mut"),
        $.identifier,
        optional(seq(":", $.type)),
        "=",
        $.expression,
        ";",
      ),
    expression_statement: ($) => seq($.expression, ";"),
    return_statement: ($) => seq("return", optional($.expression), ";"),
    expression: ($) =>
      choice(
        $.binary_expression,
        $.function_call,
        $.identifier,
        $.number_literal,
        $.string_literal,
      ),
    binary_expression: ($) =>
      prec.left(
        1,
        seq($.expression, choice("+", "-", "*", "/", "%"), $.expression),
      ),
    function_call: ($) =>
      seq(choice($.identifier, $.qualified_name), $.argument_list),
    argument_list: ($) =>
      seq(
        "(",
        optional(
          seq($.expression, repeat(seq(",", $.expression)), optional(",")),
        ),
        ")",
      ),
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number_literal: ($) =>
      choice(/\d+/, /\d+\.\d+/, /\d+[ui]\d+/, /\d+\.\d+[f]\d+/),
    string_literal: ($) =>
      seq(
        '"',
        repeat(choice(token.immediate(prec(1, /[^"\\]+/)), $.escape_sequence)),
        '"',
      ),
    escape_sequence: ($) =>
      token.immediate(seq("\\", choice("n", "r", "t", '"', "\\", "0"))),
    comment: ($) =>
      choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
});
