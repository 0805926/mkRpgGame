/*:
 * @plugindesc Crypto 加解密库
 *
 * @param file suffix
 * @desc 文件后缀
 * @default .mf.js
 * @author 玉米
 */
(function () {
    if (!$$$) {
        throw new Error("请调整插件执行顺序，ui主库js未能找到！")
        return;
    }

    let LoadNode = $$$.LoadNode;
    let $system = $$$.$system;

    $$$.addModelListener(function () {
        $system.addLoadNode(new LoadNode("crypto-js", "js/libs/crypto-js/core.js", "crypto-js", "script"));

        $$$.cryptos = [];
        $$$.cryptos.push("x64-core");
        $$$.cryptos.push("aes");
        $$$.cryptos.push("blowfish");
        $$$.cryptos.push("cipher-core");
        $$$.cryptos.push("blowfish");
        $$$.cryptos.push("enc-base64");
        $$$.cryptos.push("enc-base64url");
        $$$.cryptos.push("enc-utf16");
        $$$.cryptos.push("evpkdf");
        $$$.cryptos.push("format-hex");
        $$$.cryptos.push("hmac");
        $$$.cryptos.push("lib-typedarrays");
        $$$.cryptos.push("md5");
        $$$.cryptos.push("mode-cfb");
        $$$.cryptos.push("mode-ctr");
        $$$.cryptos.push("mode-ctr-gladman");
        $$$.cryptos.push("mode-ecb");
        $$$.cryptos.push("mode-ofb");
        $$$.cryptos.push("pad-ansix923");
        $$$.cryptos.push("pad-iso10126");
        $$$.cryptos.push("pad-iso97971");
        $$$.cryptos.push("pad-nopadding");
        $$$.cryptos.push("pad-zeropadding");
        $$$.cryptos.push("pbkdf2");
        $$$.cryptos.push("rabbit");
        $$$.cryptos.push("rabbit-legacy");
        $$$.cryptos.push("rc4");
        $$$.cryptos.push("ripemd160");
        $$$.cryptos.push("sha1");
        $$$.cryptos.push("sha3");
        $$$.cryptos.push("sha224");
        $$$.cryptos.push("sha256");
        $$$.cryptos.push("sha384");
        $$$.cryptos.push("sha512");
        $$$.cryptos.push("tripledes");

        $$$.$utils.loadJson("data/cryptos/CryptoConfig.json", function (jsonResult) {
            for (let key in jsonResult) {
                let config = jsonResult[key];
                if (!config) {
                    continue;
                }
                $system.addLoadNode(new LoadNode("crypto-js", "js/libs/crypto-js/" + config[key].name + ".js", "crypto-js", "script"));
            }
        });

        $$$.addLoadListener(function () {
            $$$.CryptoJS = window.CryptoJS;
        });
    });
})();