#!/bin/bash
export PATH=$PATH:/root/jdk1.7.0_17/bin/
export CLASSPATH=".:dist/*" 

java -Dwzpath=wz/ -Xmx512m net.server.Server
