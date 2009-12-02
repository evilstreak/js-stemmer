#!/usr/bin/env flusspferd

const fs = require( "fs-base" ),
      Stemmer = require( "stemmer" ).Stemmer;

var voc = fs.rawOpen( "voc.txt" ).readWhole().split( "\n" ).slice( 0, 15000 ),
    out = fs.rawOpen( "output.txt" ).readWhole().split( "\n" ).slice( 0, 15000 ),
    bad = [],
    i;

for ( i = 0; i < voc.length; i++ ) {
  let word = voc[ i ],
      target = out[ i ],
      result = Stemmer.stem( word );
  if ( result !== target ) {
    bad.push( {
      word : word,
      target : target
    } );
  }
}

print( bad.length, "failures (total of", i, "tests)\n" );

// make it verbose and rerun the failures
Stemmer.log = function() { print.apply( this, arguments ); }

for ( var b = 0; b < bad.length; b++ ) {
  var result = Stemmer.stem( bad[ b ].word );
  print( "Got " + result + ", expected " + bad[ b ].target, "\n" );
}
