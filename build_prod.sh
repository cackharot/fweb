#!/bin/bash
set -e
set -x

rm -rf dist/ && ng build --env=prod
