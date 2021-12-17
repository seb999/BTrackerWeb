#!/bin/bash

cd $(dirname ${0})/..

rm -rf publish_aws publish_aws.tar
dotnet publish -o publish_aws --configuration release

tar cf publish_aws.tar -C publish_aws .

scp publish_aws.tar aws/deploy-in-aws.sh ec2-user@ec2-13-48-2-168.eu-north-1.compute.amazonaws.com:
ssh ec2-user@ec2-13-48-2-168.eu-north-1.compute.amazonaws.com "./deploy-in-aws.sh"

rm -rf publish_aws publish_aws.tar

#chmod u+x deploy-in-aws.sh I did that on the server the first time 