#!/usr/bin/env flusspferd

const fs = require( "fs-base" ),
      Stemmer = require( "stemmer" ).Stemmer;

var voc = fs.rawOpen( "voc.txt" ).readWhole().split( "\n" ).slice( 0, 15000 ),
    out = fs.rawOpen( "output.txt" ).readWhole().split( "\n" ).slice( 0, 15000 ),
    bad = 0,
    i;

for ( i = 0; i < voc.length; i++ ) {
  let word = voc[ i ],
      target = out[ i ],
      result = Stemmer.stem( word );
  if ( result !== target ) {
    ++bad;
    // print( word, " =>", result, "(expected " + target + ")" );
  }
}

print( bad, "failures (total of", i, "tests)" );
