#!/bin/sh
set -e

node migrate-startup.mjs
exec node server.js
