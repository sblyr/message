#!/bin/bash

# Create env-config.js
./env.sh

# Copy env-config.js to public dir
cp env-config.js ./public/

# Create index.html based of index.template.html
envsubst < ./public/index.template.html > ./public/index.html