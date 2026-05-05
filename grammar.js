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

    // Sections
    section: $ => 
      choice(
        seq(
          'SECTION',
          // $.string,
          /"[^"]*"/,
          $._sec_type,
          optional($._sec_opts),
        ),
        'ENDSECTION'
      ),
    _sec_addr: $ => /\[\$[0-9]{1,4}\]/,
    _sec_type: $ =>
      seq(
        ',',
        choice(
          'ROM0',
          'ROMX',
          'VRAM',
          'SRAM',
          'WRAM0',
          'WRAMX',
          'OAM',
          'HRAM',
        ),
        optional($._sec_addr),
      ),
    _sec_opts: $ =>
      seq(
        ',',
        /BANK\[[0-9]+\]/,
        optional(/, ?ALIGN\[[0-9]+(, [0-9]+)?\]/),
      ),

    // Types
    string: $ => /"[^"]*"/,
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

