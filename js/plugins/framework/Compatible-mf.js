/*:
 * @plugindesc ES语法插件
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
        if (typeof globalThis === "undefined") {
            $system.addLoadNode(new LoadNode("compatible", "js/libs/global-this.js", "compatible", "script"));
            console.log("加入兼容类库，global-this")
        }
        if (typeof Element.prototype.init === "undefined") {
            $system.addLoadNode(new LoadNode("compatible", "js/libs/es.js", "compatible", "script"));
            $system.addLoadNode(new LoadNode("compatible", "js/libs/custom-elements.js", "compatible", "script"));
            console.log("加入兼容类库，es,custom-elements")
        }
    });
})();
