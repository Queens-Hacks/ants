#!/usr/bin/perl
#
# This is my most hacked perl script ever, be warned
#

use warnings;
use strict;

open(IN, "./README.md");
`touch tmp.js`;
open(OUT, ">./tmp.js");

print OUT "var marked = require('marked');\n";
print OUT "marked.setOptions({gfm: true});\n";

print OUT "console.log(marked( [";

foreach(<IN>) {
    tr/"/'/;
    chomp;
    print OUT "\"$_\",\n";
}

print OUT '].join(\'\n\')));'."\n";

my @doc = `node tmp.js`;
`rm tmp.js`;

open(TMPL, "./target/index.tmpl.html");
`touch ./target/index.html`;
open(INDEX, ">./target/index.html");

my @html = <TMPL>;

foreach(@html){
    if(/{{{README}}}/){
        foreach my $v (@doc){
            print INDEX $v;
        }
    } else {
        print INDEX $_;
    }
}
