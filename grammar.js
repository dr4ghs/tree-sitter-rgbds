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
        $.section,
        $.stack,
      ),

    // Labels
    label: $ => 
      choice(
        seq($._global_label, choice(':', '::')),
        seq($._local_label, optional(choice(':', '::'))),
      ),

    _global_label: $ => /[a-zA-Z_][a-zA-Z0-9_$#]+/,
    _local_label: $ => seq(optional($._global_label), /\.[a-z0-9_]+/),

    // Sections
    section: $ => choice(
      $._section_start,
      $._section_end,
    ),
    _section_start: $ => seq(
      'SECTION',
      $.section_name,
      seq(',', $.section_type),
      optional(repeat(seq(',', $.section_option))),
    ),
    _section_end: $ => 'ENDSECTION',
    section_name: $ => /"[^"]*"/,
    section_type: $ => seq(
      choice(
        /ROM[0X]/,
        /WRAM[0X]/,
        /[VSH]RAM/,
        'OAM',
      ),
      optional($._section_address),
    ),
    _section_address: $ => seq('[', /\$[a-fA-F0-9]{1,4}/, ']'),
    section_option: $ => choice(
        $._section_bank_opt,
        $._section_align_opt,
      ),
    _section_bank_opt: $ => /BANK\[[0-9]+\]/,
    _section_align_opt: $ => /ALIGN\[[0-9]+(, ?[0-9]+)?\]/,

    // Stack
    stack: $ =>
      choice(
        seq(
          'PUSHS',
          /"[^"]*"/,
          $.section_type,
        ),
        'POPS'
      ),

    // Types
    string: $ => /"[^"]*"/,
    number: $ => choice(
      /[0-9][0-9_]*/,
      /(\$|0[Xx])[a-fA-F0-9][a-fA-F0-9_]*/,
      /(&|0[Oo])[0-7][0-7_]*/,
      /(%|0[Bb][01][01_]*)/,
      /[0-9][0-9_]*.[0-9][0-9_]*/,
      /[0-9][0-9_]*.[0-9][0-9_]*([qQ][0-9]+)?/,
      /./,
      /`[0-3][0-3_]{,7}*/, //`
    ),
    _addr: $ => /\$[0-9]{1,4}/,

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

