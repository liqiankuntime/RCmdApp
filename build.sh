#!/usr/bin/env bash

if [ -z "${PLATFORM}" ] || [ -z "${APP_NAME}" ]; then
    echo "Please run platform command: ./build.ios.sh or ./build.android.sh";
    exit 0;
fi

COMMAND=$1
NAME="Debug"
DEV="true"
VERSION=""
DES=${VERSION}
FORCE="false"
shift

function usage()
{
    echo "Usage: $0 COMMAND [-v version] [-n name] [-d dev] [-D description] [-m mandatory]";
    echo "COMMAND: build | release | history";
    echo "Options:";
    echo "-v    mobile app version";
    echo "-n    Debug | Staging | Production";
    echo "-d    If false, warnings are disabled and the bundle is minified [bool] [默认值: true]";
    echo "-D    Description of the changes made to the app in this release  [string] [默认值: version]";
    echo "-m    Specifies whether this release should be considered mandatory  [boolean] [默认值: false]";
    echo;
    echo "example:";
    echo;
    echo "编译测试版:          ./build.${PLATFORM}.sh build";
    echo "编译正式版:          ./build.${PLATFORM}.sh build -d false";
    echo "编译&发布正式版:     ./build.${PLATFORM}.sh release -v 2.6.0 -n Production -d false -D v1.0.0";
    echo "编译&发布测试版:     ./build.${PLATFORM}.sh release -v 2.6.0 -D v0.0.1";
}

function build()
{
    react-native bundle \
    --platform ${PLATFORM} \
    --entry-file index.${PLATFORM}.js \
    --bundle-output ./build/${PLATFORM}/${APP_NAME}.jsbundle \
    --assets-dest ./build/${PLATFORM}/ \
    --dev ${DEV}
}

function release()
{
    code-push release ${APP_NAME}.${PLATFORM} ./build/${PLATFORM}/ ${VERSION} \
    --deploymentName ${NAME} \
    --description ${DES} \
    --mandatory ${FORCE}
}

function _history()
{
    echo "List the ${APP_NAME}.${PLATFORM} deployments:";
    code-push deployment ls ${APP_NAME}.${PLATFORM} -k

    echo "List ${NAME} deployment history:";
    code-push deployment history ${APP_NAME}.${PLATFORM} ${NAME}
}

while getopts n:d:D:m:v: opts
do
    case "$opts" in
        n)
            NAME="$OPTARG";;
        d)
            DEV="$OPTARG";;
        D)
            DES="$OPTARG";;
        m)
            FORCE="$OPTARG";;
        v)
            VERSION="$OPTARG";;
        \?)
            usage;
            exit 1;;
    esac
done

case "$COMMAND" in
    release)
        if [ -n "${VERSION}" ]; then
            build;
            release;
        else
            echo "$0 release: [version] required!";
        fi;;
      build)
        build;;
    history)
        _history;;
          *)
        usage;;
esac

exit 0