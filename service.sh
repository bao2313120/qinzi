#!/bin/bash
export NODE_ENV='production'
path=`realpath $0`
path=`dirname $path`
cmd=$1
if [ "$cmd" == "" ]; then
	echo "Usage: $0 start|stop|restart"
	exit
fi
cpuCount=`cat /proc/cpuinfo | grep processor | wc -l`
if [ "$cmd" == "start" ]; then
    for((i=0;i<$cpuCount;i++))
    do
        forever $cmd -a --workingDir $path -l $path/log/forever.log -o $path/log/out.log -e $path/log/err.log $path/bin/www $[8090+$i]
    done
else
    forever $cmd $path/bin/www
fi