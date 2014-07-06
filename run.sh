#!/bin/sh

DIR=$(cd $(dirname $0) ; pwd);

echo ""
echo "Starting mower application..."
echo ""

node application.js $@
