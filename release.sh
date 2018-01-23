#!/usr/bin/env bash

DEBUG="true"
FORCE="false"
VERSION=$1
DESC=$2
shift 2

function usage()
{
    echo "Usage: $0 <AppVersion> <Description> [-p production] [-m mandatory]";
    echo;
    echo "Example:";
    echo "Debug      - $0 2.6.0 v0.0.1";
    echo "Production - $0 2.6.0 v0.0.1 -p";
}

while getopts pm opts
do
    case "$opts" in
        p)
            DEBUG="false";;
        m)
            FORCE="true";;
        \?)
            usage;
            exit 1;;
    esac
done

if [ -z "${VERSION}" ] || [ -z "${DESC}" ]; then
    usage;
    exit 1;
fi;

if [ "$DEBUG" == "true" ]; then
    echo "############ Release to DEBUG environment ############";
    ./build.ios.sh release -v ${VERSION} -m ${FORCE} -D ${DESC} \
    && ./build.android.sh release -v ${VERSION} -m ${FORCE} -D ${DESC}
else
    echo "############ Release to PRODUCTION environment ############";
    ./build.ios.sh release -v ${VERSION} -n Production -d false -m ${FORCE} -D ${DESC} \
    && ./build.android.sh release -v ${VERSION} -n Production -d false -m ${FORCE} -D ${DESC}
fi;