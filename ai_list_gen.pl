#!/usr/bin/perl

use warnings;
use strict;

my $input = open(INPUT, $ARGV[0]);

foreach(<INPUT>){
    chomp;
    print "\"".$_."\",\n" unless $_ eq "";
}

