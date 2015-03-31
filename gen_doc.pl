#!/usr/bin/perl
#
# This is my most hacked perl script ever, be warned
#

use warnings;
use strict;

open(IN, "./README.md") or die $!;
open(OUT, ">","./tmp.js") or die $!;
open(TMPL, "./target/index.tmpl.html") or die $!;
open(INDEX, ">", "./target/index.html") or die $!;


print OUT "var marked = require('marked');\n"
    ."marked.setOptions({gfm: true});\n"
    ."marked.setOptions({"
    ."  highlight: function (code) {"
    ."    return require('highlight.js').highlightAuto(code).value;"
    ."  }"
    ."});"
    ."console.log(marked( [";

foreach(<IN>) {
    tr/"/'/;
    chomp;
    print OUT "\"$_\",\n";
}

print OUT '].join(\'\n\')));'."\n";

close(IN);
close(OUT);

# unlink is delete in perl parlance
my @doc = `node tmp.js` or (unlink("tmp.js") and die $!);
unlink("tmp.js");

foreach(<TMPL>){
    if(/{{{README}}}/){
        foreach my $d (@doc){
            print INDEX $d;
        }
    } else {
        print INDEX $_;
    }
}

close(TMPL);
close(INDEX);
