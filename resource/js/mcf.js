var BASEURL = "http://localhost:9888";
var FEE = 0.00001;//手续费
var objStorage = window.localStorage;

function getLocalStorage(i){
	// console.log(objStorage[i])
	if(!objStorage[i]){
		return false;
	}else{
		if(isJSON(objStorage[i])){
			return JSON.parse(objStorage[i]);
		}else{
			return objStorage[i];
		}
		
	}
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            // console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
}

function setLocalStorage(i,data){
	objStorage[i] = data;
}







//获取账号信息
function getAddressInfo(addr) {
	return axios.get(BASEURL + '/addresses/' + addr);
}

//获取可连接节点
function getPeersKnown() {
	return axios.get(BASEURL + '/peers/known');
}
//获取已连接节点
function getPeers() {
	return axios.get(BASEURL + '/peers');
}
//获取正在挖矿列表
function getAdminForgingAccounts() {
	return axios.get(BASEURL + '/admin/forgingaccounts');
}
//获取账号出块信息
function getBlocksForgers(account) {
	return axios.get(BASEURL + '/blocks/forgers?address='+account+'&limit=0');
}

function getProxyingProxiedBy(account) {
	return axios.get(BASEURL + '/addresses/proxying?proxiedBy=' + account + '&limit=0');
}

function getProxyingProxiedFor(account) {
	return axios.get(BASEURL + '/addresses/proxying?proxiedFor=' + account + '&limit=0');
}

//获取当前区块高度
function getBlocksHeight(){
	return axios.get(BASEURL + '/blocks/height');
}

function hexStringToArray(str) {
    var arrayLen = str.length / 2;
    var array = [];
    for (var i = 0; i < arrayLen; i++) {
        var valueStr = str.substring(0, 2);
        var value = parseInt(valueStr, 16);
        array.push(value);
        str = str.slice(2);
    }
    return array;
}

















function getAccountAddressFromPublicKey(publicKey) {
	var ADDRESS_VERSION = 58;
	if (typeof(publicKey) == "string") {
		publicKey = Base58.decode(publicKey);
	}
	var publicKeyHashSHA256 = SHA256.digest(publicKey);
	var publicKeyHashHex = uint8ToHex(publicKeyHashSHA256);
	var publicKeyHashWordArray = CryptoJS.enc.Hex.parse(publicKeyHashHex);
	CryptoJS.RIPEMD160(publicKeyHashSHA256).toString();
	var publicKeyHash = CryptoJS.RIPEMD160(publicKeyHashWordArray).toString();
	var addressArray = new Uint8Array();
	addressArray = appendBuffer(addressArray, [ADDRESS_VERSION]);
	addressArray = appendBuffer(addressArray, hexToUint8(publicKeyHash));
	var checkSum = SHA256.digest(SHA256.digest(addressArray));
	addressArray = appendBuffer(addressArray, checkSum.subarray(0, 4));
	return Base58.encode(addressArray);
}

function appendBuffer(buffer1, buffer2) {
	buffer1 = new Uint8Array(buffer1);
	buffer2 = new Uint8Array(buffer2);
	var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(buffer1, 0);
	tmp.set(buffer2, buffer1.byteLength);
	return tmp;
}

function hexToUint8(hexString) {
	return new Uint8Array(hexString.match(/.{1,2}/g).map(byte =>
		parseInt(byte, 16)));
}

function uint8ToHex(ary) {
	return Array.prototype.map.call(ary, x => ('00' +
		x.toString(16)).slice(-2)).join('');
}

function strAddZero(str, length) {
	var len = str.length;
	for (var i = 0; i < length - len; i++) {
		str = '0' + str;
	}
	return str;
}

//去字符串首尾空格
function trimStr(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
