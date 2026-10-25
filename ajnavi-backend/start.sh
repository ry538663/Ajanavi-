#!/bin/bash
# Start backend from within backend directory or root
cd "$(dirname "$0")"/..
npm run dev
