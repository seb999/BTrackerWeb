#!/bin/bash

cd $(dirname ${0})

sudo rm -rf publish.tmp
sudo rm -rf publish.old
sudo mkdir publish.tmp
sudo tar xf publish_aws.tar -C publish.tmp

sudo mv publish publish.old
sudo mv publish.tmp publish
#cp secrets/appsettings.json publish/appsettings.json

sudo killall dotnet

sudo supervisord -n

