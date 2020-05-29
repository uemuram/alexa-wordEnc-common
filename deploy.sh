echo "[deploy start]"
SCRIPT_DIR=$(cd $(dirname $0); pwd)

echo "[renew]"
cd ${SCRIPT_DIR}/layer
npm install

echo "[zip]"
rm ${SCRIPT_DIR}/.deploy/layer.zip
zip -r ${SCRIPT_DIR}/.deploy/layer.zip ./*

echo "[deploy]"
mkdir -p ${SCRIPT_DIR}/.deploy
cd ${SCRIPT_DIR}/.deploy
aws lambda publish-layer-version \
 --layer-name alexa-wordEnc-common \
 --zip-file fileb://layer.zip \
 --compatible-runtimes nodejs10.x

echo "[deploy finish]"
