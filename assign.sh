## assign latest layer to lanmbda functions 

echo "[assign start]"

LAYER_NAME=alexa-wordEnc-common
FUNCTIONS=()
FUNCTIONS=("${FUNCTIONS[@]}" 'arn:aws:lambda:ap-northeast-1:704229799072:function:ask-wordEnc-encrypt-default-ski-AlexaSkillFunction-1DUB9LRL5LVI1') 
FUNCTIONS=("${FUNCTIONS[@]}" 'arn:aws:lambda:ap-northeast-1:704229799072:function:ask-wordEnc-decrypt-default-ski-AlexaSkillFunction-13XPGDAGIP47H') 

SCRIPT_DIR=$(cd $(dirname $0); pwd)


echo "[get latest]"
latest=`aws lambda list-layer-versions --layer-name ${LAYER_NAME} --query 'LayerVersions[*].{Version:Version}' --output text|sort -gr|head -1`
layer=`aws lambda get-layer-version --layer-name ${LAYER_NAME} --version-number ${latest} --query 'LayerVersionArn' --output text`
echo ${latest}
echo ${layer}

echo "[update function]"
for function in "${FUNCTIONS[@]}"
do
  arn=`aws lambda update-function-configuration --function-name ${function} --layers ${layer} --output text --query FunctionArn`
  echo "update ${arn}"
done


echo "[assign finish]"
