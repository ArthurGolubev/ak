#!/bin/bash
start=$SECONDS

cd frontend && \
npx webpack build --mode=development

# cd ../

cd ../ && \
docker buildx build \
--push \
--platform linux/amd64 \
--tag arthurgo/ak:0.1 .


deploy="../kubernetes/ak/ak-web"
microk8s.kubectl delete -f "$deploy/03_dev_deployment_ak.yml"
microk8s.kubectl apply -f "$deploy/03_dev_deployment_ak.yml"

end=$SECONDS
runtime=$((end - start))
today=`date +"%d-%m-%Y %T"`
echo -e "\n\n\U1F5FF Development version"
echo -e "\n\U1F4C5 $today"
echo -e "\U231B Завершено за $runtime сек."