export default grammar({
  name: "rgbds",

  extras: $ => [
    / |\t|\r/,
    $.comment,
  ],

  rules: {
    program: $ => sep(repeat1('\n'), $._item),
    _item: $ =>
      choice(
        $.label,
      ),
    _line_break: $ => '\n',

    // Labels
    label: $ => 
      choice(
        seq($._global_label, choice(':', '::')),
        seq($._local_label, optional(choice(':', '::'))),
      ),

    _global_label: $ => /[a-zA-Z_][a-zA-Z0-9_$#]+/,
    _local_label: $ => seq(optional($._global_label), /\.[a-z0-9_]+/),

    // Types
    string: $ => /"[^"]*"/,

    // Comments
    comment: $ =>
      choice(
        $._line_comment,
        $._block_comment,
      ),
    _line_comment: $ => /;.*/,
    _block_comment: $ =>
      token(seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      )),
  },
});

function sep(separator, rule) {
    return optional(seq(rule, repeat(seq(separator, rule)), optional(separator)))
}

