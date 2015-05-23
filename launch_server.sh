#!/bin/sh

export CLASSPATH=".:dist/*" 

java -Dwzpath=wz/ \
-Xmx512m net.server.Server