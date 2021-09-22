#!/bin/bash

echo 'copying compiled files to static-app destination...'
cp ./dist/* ../client-static-build
cp ./staticwebapp.config.json ../client-static-build
