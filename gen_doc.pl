#!/usr/bin/perl

use warnings;
use strict;

open(IN, "./README.md");
`touch tmp.js`;
open(OUT, ">./tmp.js");

print OUT "var ghm = require('github-flavored-markdown');\n";

print OUT "console.log(ghm.parse( [";

foreach(<IN>) {
    tr/"/'/;
    chomp;
    print OUT "\"$_\",\n";
}

print OUT '].join(\'\n\')));'."\n";

`node tmp.js > target/readme.html`;
`rm tmp.js`;
