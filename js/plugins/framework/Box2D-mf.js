/*:
 * @plugindesc 物理引擎Box2d 插件
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
        $system.addLoadNode(new LoadNode("box2d", "js/libs/Box2D_v2.2.1_min.js", "box2d", "script"));
    });

    $$$.addLoadListener(function() {
        $$$.Box2D = window.Box2D;
    });
})();