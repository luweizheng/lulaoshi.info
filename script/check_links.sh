#!/usr/bin/env bash

target=${1:-"http://localhost:4000"}

# Crawl the docs, ignoring robots.txt, storing nothing locally
wget --spider -r -nd -nv -e robots=off -p -o log/spider.log "$target"

# Abort for anything other than 0 and 4 ("Network failure")
status=$?
if [ $status -ne 0 ] && [ $status -ne 4 ]; then
    exit $status
fi

# Fail the build if any broken links are found
broken_links_str=$(grep -e 'Found [[:digit:]]\+ broken links' log/spider.log)
if [ -n "$broken_links_str" ]; then
    grep -B 1 "Remote file does not exist -- broken link!!!" log/spider.log
    echo "---------------------------------------------------------------------------"
    echo -e "$broken_links_str"
    echo "Search for page containing broken link using 'grep -R BROKEN_PATH DOCS_DIR'"
    exit 1
fi