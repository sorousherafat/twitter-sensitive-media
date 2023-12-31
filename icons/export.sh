#!/usr/bin/env bash

for x in 16 32 48 128; do
    inkscape --export-type=png --export-filename=icon-${x}.png -w ${x} icon.svg
done
