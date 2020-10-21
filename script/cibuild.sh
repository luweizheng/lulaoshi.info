#!/usr/bin/env bash

set -e # halt script on error

bundle exec jekyll build
bundle exec htmlproofer ./_site --disable-external --empty_alt_ignore