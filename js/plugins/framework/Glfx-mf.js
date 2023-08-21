/*:
 * @plugindesc Glfx 专业滤镜
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
        $system.addLoadNode(new LoadNode("glfx", "js/libs/glfx.js", "glfx", "script"));
    });

    $$$.addLoadListener(function () {
        $$$.fx = window.fx;
    });
})();