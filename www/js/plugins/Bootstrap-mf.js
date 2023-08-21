/*:
 * @plugindesc 启动类 插件
 *
 * @param Compatible
 * @desc 兼容库
 * @default on
 *
 * @param Axios
 * @desc Axios 库
 * @default off
 *
 * @param JQuery
 * @desc JQuery 库
 * @default off
 *
 * @param Box2D
 * @desc Box2D 物理引擎库
 * @default off
 *
 * @param FairyGUI
 * @desc FairyGUI GUI库
 * @default off
 *
 * @param QRCode
 * @desc QRCode 二维码插件
 * @default off
 *
 * @param Html2Canvas
 * @desc Html2Canvas html截屏转画布文件
 * @default off
 *
 * @param Mqtt
 * @desc Mqtt 网络插件
 * @default off
 *
 * @param Anime
 * @desc Anime 一个强大的动画库
 * @default off
 *
 * @param ImageLib
 * @desc ImageLib 图形处理库
 * @default off
 *
 * @param Crypto
 * @desc Crypto 加密解密库
 * @default off
 *
 * @param Howler
 * @desc Howler 音乐核心库
 * @default off
 * @author 玉米
 */
(function () {
    let isNotBlank = function (value) {
        if (typeof value === "undefined") {
            return false;
        }

        if (value == null || value.trim().length == 0) {
            return false;
        }

        return true;
    };

    let parameters = PluginManager.parameters('Bootstrap-mf');

    let isEnable = function (name) {
        let enable = (isNotBlank(parameters[name]) && parameters[name] === 'on');
        return enable;
    };

    if (typeof PluginManager === "undefined") {
        return;
    }

    if (typeof PluginManager.loadScript === "undefined") {
        return;
    }

    PluginManager.loadFrameworkScript = function (name, enabled) {
        if (!enabled) {
            return;
        }
        let url = this._path + "framework/" + name;
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script._url = url;
        document.body.appendChild(script);
    };

    PluginManager.loadFrameworkScript("Framework-mf", true);
    PluginManager.loadFrameworkScript("Compatible-mf", isEnable("Compatible"));
    PluginManager.loadFrameworkScript("Utils-mf", isEnable("Utils"));
    PluginManager.loadFrameworkScript("Axios-mf", isEnable("Axios"));
    PluginManager.loadFrameworkScript("JQuery-mf", isEnable("JQuery"));
    PluginManager.loadFrameworkScript("Box2D-mf", isEnable("Box2D"));
    PluginManager.loadFrameworkScript("FairyGUI-mf", isEnable("FairyGUI"));
    PluginManager.loadFrameworkScript("QRCode-mf", isEnable("QRCode"));
    PluginManager.loadFrameworkScript("Html2Canvas-mf", isEnable("Html2Canvas"));
    PluginManager.loadFrameworkScript("Mqtt-mf", isEnable("Mqtt"));
    PluginManager.loadFrameworkScript("Anime-mf", isEnable("Anime"));
    PluginManager.loadFrameworkScript("ImageLib-mf", isEnable("ImageLib"));
    PluginManager.loadFrameworkScript("Crypto-mf", isEnable("Crypto"));
    PluginManager.loadFrameworkScript("Howler-mf", isEnable("Howler"));
    PluginManager.loadFrameworkScript("Glfx-mf", isEnable("Glfx"));
    PluginManager.loadFrameworkScript("Application-mv-mf", true);
    if (!$$$) {
        throw new Error("请调整插件执行顺序，ui主库js未能找到！")
        return;
    }

    $$$(function () {
        console.log("加载成功！")
    });
})();