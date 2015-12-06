#!/bin/bash

lowercase() {
	echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/";
}

OS=`lowercase \`uname\``;
ARCH=`lowercase \`uname -m\``;

LYCHEEJS_NODE="";
LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../"; pwd);
PROJECT_ROOT="$PWD";


if [ "$ARCH" == "x86_64" -o "$ARCH" == "amd64" ]; then
	ARCH="x86_64";
fi;

if [ "$ARCH" == "i386" -o "$ARCH" == "i686" -o "$ARCH" == "i686-64" ]; then
	ARCH="x86";
fi;

if [ "$ARCH" == "armv7l" -o "$ARCH" == "armv8" ]; then
	ARCH="arm";
fi;


if [ "$OS" == "darwin" ]; then

	OS="osx";
	LYCHEEJS_NODE="$LYCHEEJS_ROOT/bin/runtime/node/osx/$ARCH/node";

elif [ "$OS" == "linux" ]; then

	OS="linux";
	LYCHEEJS_NODE="$LYCHEEJS_ROOT/bin/runtime/node/linux/$ARCH/node";

fi;

if [ ! -f $LYCHEEJS_NODE ]; then
	echo "Sorry, your computer is not supported. ($OS / $ARCH)";
	exit 1;
fi;



case "$1" in

	configure)
		cd $LYCHEEJS_ROOT;
		$LYCHEEJS_NODE ./bin/breeder.js configure "$2" --project="$PROJECT_ROOT";
	;;

	inject)
		cd $LYCHEEJS_ROOT;
		$LYCHEEJS_NODE ./bin/breeder.js inject "$2" "$3" --project="$PROJECT_ROOT";
	;;

	fertilize)
		cd $LYCHEEJS_ROOT;
		$LYCHEEJS_NODE ./bin/breeder.js fertilize "$2" --project="$PROJECT_ROOT";
	;;

	*)
		cd $LYCHEEJS_ROOT;
		$LYCHEEJS_NODE ./bin/breeder.js help;
	;;

esac;

