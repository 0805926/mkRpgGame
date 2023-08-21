/*:
 * @plugindesc MQTT 网络插件
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
        $system.addLoadNode(new LoadNode("mqtt", "js/libs/mqtt.min.js", "mqtt", "script"));
    });

    $$$.addLoadListener(function () {
        $$$.mqtt = window.mqtt;
    });
})();