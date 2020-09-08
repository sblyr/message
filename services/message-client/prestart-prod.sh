#!/bin/bash

# Create env-config.js
./env.sh

# Create index.html based of index.template.html
cp ./index.html ./index.template.html

envsubst < ./index.template.html > ./index.html