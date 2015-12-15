#!/bin/bash

if [ "$ENV_ROOT" == "" ]; then
	ENV_ROOT=$(cd "$(dirname "$0")/"; pwd);
fi;

if [ "$ENV_PORT" == "" ]; then
	ENV_PORT=1337;
fi;

if [ "$ENV_HOST" == "" ]; then
	ENV_HOST="null";
fi;


NODE=`which node`;

if [ "$NODE" != "" ]; then
	$NODE ./sorbet.js $ENV_ROOT $ENV_PORT $ENV_HOST;	
else
	echo "Sorry, your computer is not supported. (Maybe forgot to install node?)";
fi;

