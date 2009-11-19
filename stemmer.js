/**
 * Porter Stemmer - see http://tartarus.org/~martin/PorterStemmer/
 * usage: Stemmer.stem( word )
 */
var Stemmer = {
  stem: function( word ) {
    word = word.toLowerCase();

    // check if this word has already been stemmed
    if ( this.cache[ word ] ) {
      print( "Retrieving cached word" );
      return this.cache[ word ];
    }

    var stem = word;

    var contains_vowel = /[aeiou]|[^aeiou]y/;
    var m_gt_0 = /^(?:[^aeiou][^aeiouy]*)?([aeiouy]+[^aeiou][^aeiouy]*){1,}([aeiouy][aeiou]*)?$/;
    var m_eq_1 = /^(?:[^aeiou][^aeiouy]*)?([aeiouy]+[^aeiou][^aeiouy]*){1}([aeiouy][aeiou]*)?$/;
    var m_gt_1 = /^(?:[^aeiou][^aeiouy]*)?([aeiouy]+[^aeiou][^aeiouy]*){2,}([aeiouy][aeiou]*)?$/;

    // step 1a
    var es_end = /(ss|i)es$/;
    var s_end = /([^s])s$/;

    if ( es_end.test( stem ) ) {
      stem = stem.replace( es_end, "$1" );
    } else if ( s_end.test( stem ) ) {
      stem = stem.replace( s_end, "$1" );
    }

    // step 1b
    var eed_end = /^(.*)eed$/;
    var eding_end = /^(.*)(?:ed|ing)$/;

    if ( eed_end.test( stem ) ) {
      var prefix = eed_end.exec( stem )[ 1 ];
      if ( m_gt_0.test( prefix ) ) {
        stem = prefix + "ee";
      }
    } else if ( eding_end.test( stem ) ) {
      var prefix = eding_end.exec( stem )[ 1 ];
      if ( contains_vowel.test( prefix ) ) {
        stem = prefix;

        // step 1b followup
        var fix_suffix = /(at|bl|iz|is)$/;
        var double_consonant = /([^aeioulsz])\1$/;
        var missing_e = /[^aeiouy][aeiouy][^aeiouy]$/;

        if ( fix_suffix.test( stem ) ) {
          stem = stem + "e";
        } else if ( double_consonant.test( stem ) ) {
          stem = stem.replace( double_consonant, "$1" );
        } else if ( missing_e.test( stem ) ) {
          if ( m_eq_1.test( stem ) ) {
            stem = stem + "e";
          }
        }
      }
    }

    // step 1c
    var y_end = /^(.*)y$/;

    if ( y_end.test( stem ) ) {
      var prefix = y_end.exec( stem )[ 1 ];
      if ( contains_vowel.test( prefix ) ) {
        stem = prefix + "i";
      }
    }

    // steps 2, 3 and 4
    var steps = [
      [ this.step2_suffixes, -2 ],
      [ this.step3_suffixes, -1 ],
      [ this.step4_suffixes, -2 ]
    ];

    for each ( [suffixes, char_pos] in steps ) {
      suffixes = suffixes[ stem.substr( char_pos, 1 ) ];
      for ( var suf in suffixes ) {
        var suffix_replace = new RegExp( "(.*)" + suf + "$" );
        if ( suffix_replace.test( stem ) ) {
          var prefix = suffix_replace.exec( stem )[ 1 ];
          if ( m_gt_0.test( prefix ) ) {
            stem = prefix + suffixes[ suf ];
            break;
          }
        }
      }
    }

    // step 5a
    var e_end = /(.*)e$/;
    if ( e_end.test( stem ) ) {
      var prefix = e_end.exec( stem )[ 1 ];
      if ( m_gt_1.test( prefix ) || ( m_eq_1.test( prefix ) && /[^o]$/.test( prefix ) ) ) {
        stem = prefix;
      }
    }

    // step 5b
    var double_l = /(.*l)l$/;
    if ( double_l.test( stem ) ) {
      var prefix = double_l.exec( stem )[ 1 ];
      if ( m_gt_1.test( prefix ) ) {
        stem = prefix;
      }
    }

    this.cache[ word ] = stem;
    return stem;
  },

  // grouped by penulimate letter
  step2_suffixes: {
    a: { ational: "ate",
         tional: "tion" },
    c: { enci: "ence",
         anci: "ance" },
    e: { izer: "ize",
         iser: "ise" },
    l: { abli: "able",
         alli: "al",
         entli: "ent",
         eli: "e",
         ousli: "ous" },
    i: { ization: "ize" },
    o: { ation: "ate",
         ator: "ate" },
    s: { alism: "al",
         iveness: "ive",
         fulness: "ful",
         ousness: "ous" },
    t: { aliti: "al",
         iviti: "ive",
         biliti: "ble" }
  },

  // grouped by final letter
  step3_suffixes: {
    e: { icate: "ic",
         ative: "",
         alize: "al",
         alise: "al" },
    i: { iciti: "ic" },
    l: { ical: "ic",
         ful: "" },
    s: { ness: "" }
  },

  // grouped by penultimate letter
  step4_suffixes: {
    a: { al: "" },
    c: { ance: "",
         ence: "" },
    e: { er: "" },
    i: { ic: "" },
    l: { able: "",
         ible: "" },
    n: { ant: "",
         ement: "",
         ment: "",
         ent: "" },
    o: { sion: "s",
         tion: "t",
         ou: "" },
    s: { ise: "",
         ism: "" },
    t: { ate: "",
         iti: "" },
    u: { ous: "" },
    v: { ive: "" },
    z: { ize: "" }
  },

  // used to remember results for words already stemmed
  cache: {}
}

// CommonJS export
if ( exports ) {
  exports.Stemmer = Stemmer;
}