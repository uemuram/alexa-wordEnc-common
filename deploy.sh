echo "[deploy start]"

LAYER_NAME=alexa-wordEnc-common
FUNCTIONS=()
FUNCTIONS=("${FUNCTIONS[@]}" 'arn:aws:lambda:ap-northeast-1:704229799072:function:ask-wordEnc-encrypt-default-ski-AlexaSkillFunction-1DUB9LRL5LVI1') 
FUNCTIONS=("${FUNCTIONS[@]}" 'arn:aws:lambda:ap-northeast-1:704229799072:function:ask-wordEnc-decrypt-default-ski-AlexaSkillFunction-13XPGDAGIP47H') 

SCRIPT_DIR=$(cd $(dirname $0); pwd)


echo "[build]"
cd ${SCRIPT_DIR}/layer
npm install
rm ${SCRIPT_DIR}/.deploy/layer.zip
zip -rq ${SCRIPT_DIR}/.deploy/layer.zip ./*


echo "[deploy]"
mkdir -p ${SCRIPT_DIR}/.deploy
cd ${SCRIPT_DIR}/.deploy
layer=`aws lambda publish-layer-version --layer-name ${LAYER_NAME} --zip-file fileb://layer.zip --compatible-runtimes nodejs10.x --output text --query LayerVersionArn`
echo "deploy ${layer}"


echo "[update function]"
for function in "${FUNCTIONS[@]}"
do
  arn=`aws lambda update-function-configuration --function-name ${function} --layers ${layer} --output text --query FunctionArn`
  echo "update ${arn}"
done


echo "[deploy finish]"
