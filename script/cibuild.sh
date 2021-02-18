#!/usr/bin/env bash

set -e # halt script on error

JEKYLL_ENV=production bundle exec jekyll build
bundle exec htmlproofer ./_site --disable-external --empty_alt_ignore --allow_hash_href