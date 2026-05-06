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

    // Symbols
    label: $ => choice(
      /[a-zA-Z_][a-zA-Z0-9_#\$@]*:{1,2}/,                                       // Global
      /([a-zA-Z_][a-zA-Z0-9_#\$@]*)?\.[a-zA-Z0-9_#\$@]+:{0,2}/,                 // Local
      ':',                                                                      // Anonymous
    ),

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

    // Literals
    int: $ => /-?[0-9][0-9]*|(\$|0[Xx])[a-fA-F0-9][a-fA-F0-9_]*|(&|0[Oo])[0-7][0-7_]*|(%|0[Bb])[01][01_]*/,
    float: $ => /-?[0-9][0-9_]*\.[0-9][0-9_]*(q[0-9][0-9_]*)?/,
    string: $ => /"[^"]*"/,
    char: $ => /'[^']'/,
    gbgfx: $ => /`[0-3]{1,8}/, // `

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

