/*:
 * @plugindesc 框架核心代码
 *
 * @param file suffix
 * @desc 文件后缀
 * @default .mf.js
 * @author 玉米
 */
(function () {

    window.$Framework = function () {
        $Framework.initialize.apply(this, arguments);
    };

    window.$$$ = $Framework;
    /**
     * 工具集
     * @type {Object}
     */
    $$$.$utils = {};
    /**
     * 系统信息
     * @type {Object}
     */
    $$$.$system = {};
    /**
     * 全局变量
     * @type {Object}
     */
    $$$.$global = {};
    /**
     * 音频核心
     * @type {Object}
     */
    $$$.$audio = {};
    /**
     * 媒体核心
     * @type {Object}
     */
    $$$.$media = {};
    /**
     * 事件核心
     * @type {Object}
     */
    $$$.$events = {};
    /**
     * 消息核心
     * @type {Object}
     */
    $$$.$message = {};
    /**
     * 界面核心
     * @type {Object}
     */
    $$$.$ui = {};
    /**
     * 通用业务核心
     * @type {Object}
     */
    $$$.$manager = {};

    /**
     * 逻辑业务核心
     * @type {Object}
     */
    $$$.$service = {};

    /**
     * 页面
     * @type {Object}
     */
    $$$.$page = {};


    /**
     *
     * @param {string} name
     * @param {string} src
     * @param {string} group
     * @param {string} type
     * @constructor
     */
    let LoadNode = function (name, src, group, type) {
        this.next = null;
        this.name = name;
        this.src = src;
        this.type = type;
        this.group = group;
    };

    LoadNode.prototype.script = function () {
        this.type = "script";
    };

    LoadNode.prototype.style = function () {
        this.type = "style";
    };

    /**
     *
     * @param {function} callback
     */
    LoadNode.prototype.load = function (callback) {
        if (this.type == "style") {
            $StyleManager.loadNameStyle(this.name, this.src, this.group, function () {
                if (this.next) {
                    this.next.load(callback);
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }.bind(this));
        } else {
            $ScriptManager.loadNameScript(this.name, this.src, this.group, function () {
                if (this.next) {
                    this.next.load(callback);
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }.bind(this));
        }
    };

    $$$.LoadNode = LoadNode;

    let restructure = function (callback) {
        callback();
    };

    $$$.restructure = restructure;

    let $system = $$$.$system;
    $system._id = 0;
    $system.idPrefix = "ui_";
    $system.nextId = function () {
        let nextId = $system._id + 1;
        $system._id = nextId;
        return $system.idPrefix + $system._id;
    }

    /**
     *
     * @param {LoadNode}  node
     */
    $system.addLoadNode = function (node) {
        if (!$system.rootNode) {
            $system.rootNode = node;
            return;
        }

        let lastNode = $system.rootNode;
        while (!!lastNode.next) {
            lastNode = lastNode.next;
        }
        lastNode.next = node;
    }

    /**
     *
     * @param {function} success
     */
    $system.load = function (success) {
        if (!success) {
            success = $system.loadHistory;
        } else {
            $system.loadHistory = success;
        }
        if ($system.rootNode) {
            $system.rootNode.load(success);
        }
    };

    let $utils = $$$.$utils;

    $utils.getImagePortion = function (imgObj, newWidth, newHeight, startX, startY, ratio) {
        /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
        //set up canvas for thumbnail
        let tnCanvas = document.createElement('canvas');
        let tnCanvasContext = tnCanvas.getContext('2d');
        tnCanvas.width = newWidth;
        tnCanvas.height = newHeight;

        /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
        let bufferCanvas = document.createElement('canvas');
        let bufferContext = bufferCanvas.getContext('2d');
        bufferCanvas.width = imgObj.width;
        bufferCanvas.height = imgObj.height;
        bufferContext.drawImage(imgObj, 0, 0);

        /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
        tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio, 0, 0, newWidth, newHeight);
        return tnCanvas.toDataURL();
    };

    /**
     * 加载脚本
     * @param {string} src 源
     * @param {function} successCallback 成功回调
     */
    $utils.loadScript = function (src, successCallback) {
        let script = document.createElement('script');
        let fn = successCallback || function () {
        };
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn(script);
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                fn(script);
            };
        }
        script.src = src;
        document.head.appendChild(script);
    };

    /**
     *  加载CSS
     *  @param {string} src 源
     *  @param {function} success 成功回调
     */
    $utils.loadCss = function (src, successCallback) {
        let fn = successCallback || function () {
        };
        let link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", src);
        document.head.appendChild(link);
        fn(link);
    };

    /**
     *
     * @param {string} src
     * @param {function} successCallback
     */
    $utils.loadData = function (src, successCallback) {
        let fn = successCallback || function () {
        };
        let xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (xhr.status < 400) {
                fn(xhr);
            }
        }.bind(this);
        xhr.onerror = function () {
            this._hasError = true;
        }.bind(this);
        xhr.send();
    };

    $utils.loadJson = function (src, successCallback, encoding) {
        if (!encoding) {
            encoding = "utf-8";
        }
        $utils.loadData(src, function (xhr) {
            let jsonResult = {};
            let response = xhr.response;
            if (!response) {
                successCallback(jsonResult).bind($utils)
                return;
            }
            let data = new Blob([response]);
            if (data) {
                let reader = new FileReader();
                reader.readAsText(data, encoding);
                reader.onload = function (e) {
                    jsonResult = JSON.parse(e.target.result);
                    successCallback(jsonResult);
                };
                return;
            }
        });
    };

    $utils.loadBase64 = function (src, successCallback, encoding) {
        if (!encoding) {
            encoding = "utf-8";
        }

        $utils.loadData(src, function (xhr) {
            let jsonResult = {};
            let response = xhr.response;
            if (!response) {
                successCallback(jsonResult).bind($utils)
                return;
            }
            let data = new Blob([response]);
            if (data) {
                let reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onload = function (e) {
                    successCallback(e.target.result);
                };
                return;
            }
        });
    };

    /**
     *
     * @param {string} string
     * @param {string} search
     * @param {string}replace
     * @returns {void | *}
     */
    $utils.replaceAll = function (string, search, replace) {
        let reg = new RegExp(search, "g");
        return string.replace(reg, replace);
    };

    /**
     *
     * @param {string}  string
     * @returns {boolean}
     */
    $utils.isEmptyString = function (string) {
        if (string) {
            if (string.trim().length() == 0) {
                return true;
            }
        }
        return true;
    };

    let $ui = $$$.$ui;
    $ui.classLoader = {};

    /**
     *
     * @param {Array} classNames
     * @param {function} callback
     */
    $ui.importClass = function (classNames, callback) {
        let clazzArray = [];
        classNames.forEach(function (className) {
            let clazz = $ui.classLoader[className];
            if (!clazz) {
                return;
            }
            clazzArray.push(clazz);
        });
        let fn = callback || function () {
        };
        fn.apply(this, clazzArray);
        return clazzArray;
    };

    /**
     *
     * @param {string} name
     * @param {function} callback
     */
    $ui.defineBase = function (name, callback) {
        let clazz = callback();
        $ui.classLoader[name] = clazz;
    };

    /**
     *
     * @param {string} name
     * @param {string} parent
     * @param {function} callback
     */
    $ui.define = function (name, parent, callback, importClazz) {
        let p;
        let fn = callback || function () {
        };
        let args = [];
        if (parent) {
            p = $ui.classLoader[parent];
        } else {
            p = Object;
        }
        args.push(p);
        if (importClazz && callback) {
            importClazz.forEach(function (className) {
                let clazz = $ui.classLoader[className];
                if (!clazz) {
                    return;
                }
                args.push(clazz);
            });
        }
        let clazz = callback.apply(this, args);
        $ui.classLoader[name] = clazz;
    };

    /**
     * 定义界面组件
     */
    $ui.defineBase("BasicInterface", function () {
        /**
         * 基础界面
         * @constructor 构造器
         */
        let BasicInterface = function () {
            this.initialize.apply(this, arguments);
        };

        BasicInterface.prototype.initialize = function () {
            // This is constructor init method
        };

        return BasicInterface;
    });

    $ui.eventPools = [];

    /**
     * 定义容器组件
     */
    $ui.define("Container", "BasicInterface", function (parentClass) {
        /**
         * 容器
         * @constructor 构造器
         */
        let Container = function () {
            this.initialize.apply(this, arguments);
        };

        Container.prototype = Object.create(parentClass.prototype);
        Container.prototype.constructor = Container;

        Container.prototype.initialize = function () {
            parentClass.prototype.initialize.call(this);
            this.styleManager = $StyleManager;
            this.scriptManager = $ScriptManager;
            this._loadNode = {
                load: function () {

                }
            };
            this.before.apply(this, arguments);
            this.invoke.apply(this, arguments);
            this.after.apply(this, arguments);
        };

        Container.prototype.after = function () {
            // this method is on invoke after;
        };

        Container.prototype.invoke = function () {
            this.setId($system.nextId());
            this.loadResource();
        };

        Container.prototype.before = function () {
            // this method is on invoke before;
        };

        /**
         * 加载CSS文件或者脚本文件
         */
        Container.prototype.loadResource = function () {
            if (!this.styleManager) {
                this.styleManager = $StyleManager;
            }
            if (!this.scriptManager) {
                this.scriptManager = $ScriptManager;
            }
            if (this._loadNode) {
                this._loadNode.load();
            }
        };

        /**
         *
         * @param {Object} node {"type":"style/script","name":"名称","src":"链接地址"};
         * @private
         */
        Container.prototype._addLoadNode = function (node) {
            if (!node) {
                return;
            }
            let finalNode = this._loadNode;
            if (!this._loadNode && !parentNode) {
                this._loadNode = node;
                return;
            }
            while (finalNode.next) {
                finalNode = finalNode.next;
            }
            finalNode.next = node;

            finalNode.next.load = function () {
                if (node.type === "style") {
                    this.styleManager.loadNameStyle(node.name, node.src, this.getId(), function () {
                        if (this.next) {
                            this.next.load();
                        }
                    }.bind(node));
                } else {
                    this.scriptManager.loadNameScript(node.name, node.src, this.getId(), function () {
                        if (this.next) {
                            this.next.load();
                        }
                    }.bind(node));
                }
            }.bind(this);
        };

        Container.prototype.getId = function () {
            return this.element.getAttribute("id");
        };

        Container.prototype.setId = function (id) {
            $ui.eventPools[this.getId()] = null;
            this.element.setAttribute("id", id);
            $ui.eventPools[this.getId()] = this;
        };

        Container.prototype.getStyle = function () {
            let clazz = this.element.getAttribute("class");
            return (!clazz) ? "" : clazz + "";
        };

        Container.prototype.setStyle = function (style) {
            this.element.setAttribute("class", style);
        };

        Container.prototype.addStyle = function (style) {
            if (this.hasStyle(style)) {
                return;
            }
            let currentStyle = this.getStyle();
            this.setStyle(currentStyle.concat(" ").concat(style.trim()));
        };

        Container.prototype.hasStyle = function (style) {
            let styleIndex = this.getStyle().indexOf(style);
            return styleIndex > -1;
        };

        Container.prototype.getElement = function () {
            return this.element;
        };

        Container.prototype.setElement = function (element) {
            this.element = element;
        };

        Container.prototype.hide = function () {
            this.addStyle("mofum-hide");
        };

        Container.prototype.show = function () {
            if (this.hasStyle("mofum-hide")) {
                let style = $utils.replaceAll(this.getStyle(), "mofum-hide", "");
                this.setStyle(style);
            }
        };

        Container.prototype.destroy = function () {
            if (this.element) {
                this.element.remove();
            }

            if (this.styleManager) {
                this.styleManager.deleteGroup(this.getId());
            }
            if (this.scriptManager) {
                this.scriptManager.deleteGroup(this.getId());
            }
        };

        Container.prototype.close = function () {
            this.destroy();
        };

        return Container;
    });

    /**
     * 定义面板组件
     */
    $ui.define("Panel", "Container", function (parentClass) {

        /**
         * 面板
         * @constructor 构造器
         */
        let Panel = function () {
            this.initialize.apply(this, arguments);
        };

        Panel.prototype = Object.create(parentClass.prototype);
        Panel.prototype.constructor = Panel;

        Panel.prototype.invoke = function () {
            this.element = document.createElement("div");
            parentClass.prototype.invoke.call(this);
        };
        return Panel;

    });

    /**
     * 定义层组件
     */
    $ui.define("Layer", "Container", function (parentClass, Panel) {
        /**
         * 层
         * @constructor 构造器
         */
        let Layer = function () {
            this.initialize.apply(this, arguments);
        };

        Layer.prototype = Object.create(parentClass.prototype);
        Layer.prototype.constructor = Layer;

        Layer.prototype.invoke = function () {
            this.element = document.createElement("div");
            parentClass.prototype.invoke.call(this);
            this.panels = [];
            this.setStyle("container");
        };

        Layer.prototype.addPanel = function (panel) {
            if (!(panel instanceof Panel)) {
                throw new Error("error in argument type verification! Please use 'Panel'.");
            }
            panel.appendStyle("mofum-container-layer");
            this.element.appendChild(panel.element);
            this.panels.push(panel);
        };

        Layer.prototype.addPanelByIndex = function (index, panel) {
            this.addPanel(panel);
            panel.element.style.zIndex = index;
        };

        return Layer;
    }, ["Panel"]);

    /**
     * 页面
     */
    $ui.define("Page", "Container", function (parentClass) {
        /**
         * 页面
         * @constructor 构造器
         */
        let Page = function () {
            this.initialize.apply(this, arguments);
        };
        Page.prototype = Object.create(parentClass.prototype);
        Page.prototype.constructor = Page;
        Page.prototype.invoke = function () {
            this.element = document.createElement("iframe");
            this.element.setAttribute("frameborder", "0");
            this.hide();
            parentClass.prototype.invoke.call(this);
        };
        return Page;
    });

    let $manager = $$$.$manager;

    $manager.$ScriptManager = {};

    let $ScriptManager = $manager.$ScriptManager;

    $ScriptManager.groups = {};

    $ScriptManager.groupMapping = {};

    /**
     * 加载脚本
     * @param src  src 源
     * @param group 组
     */
    $ScriptManager.loadNameScript = function (name, src, group, callback) {
        let mapping = $ScriptManager.groupMapping[group];
        if (!mapping) {
            mapping = {};
        }
        if (!mapping[name]) {
            mapping[name] = src;
            $ScriptManager.loadScript(src, group, callback);
        }
    };

    /**
     * 加载脚本
     * @param src  src 源
     * @param group 组
     * @param callback 回调
     */
    $ScriptManager.loadScript = function (src, group, callback) {
        let fn = callback || function () {
        };
        let _group = $ScriptManager.groups[group];
        if (!_group) {
            _group = new Array();
        }
        $utils.loadScript(src, function (e) {
            _group.push(e);
            fn();
        });
    };

    /**
     * 删除某个组所有脚本
     * @param group 组脚本
     */
    $ScriptManager.deleteGroup = function (group) {
        let _group = $ScriptManager.groups[group];
        if (!!_group) {
            _group.forEach(function (element) {
                element.remove();
            })
        }
    };

    /**
     * 删除某个组下的某个脚本
     * @param name 脚本名称或者SRC
     * @param group 组
     */
    $ScriptManager.deleteGroupScriptByName = function (name, group) {
        let _group = $ScriptManager.groups[group];
        if (!!_group) {
            let mapping = $ScriptManager.groupMapping[group];
            _group.forEach(function (element) {
                let groupSrc = mapping[name];
                if (!groupSrc) {
                    groupSrc = name;
                }
                if (groupSrc == element.src) {
                    element.remove();
                }
            });
        }
    };

    $manager.$StyleManager = {};

    let $StyleManager = $manager.$StyleManager;

    $StyleManager.groups = {};

    $StyleManager.groupMapping = {};

    /**
     * 加载样式CSS文件
     * @param src  src 源
     * @param group 组
     * @param callback 回调
     */
    $StyleManager.loadNameStyle = function (name, src, group, callback) {
        let mapping = $StyleManager.groupMapping[group];
        if (!mapping) {
            mapping = {};
        }
        if (!mapping[name]) {
            mapping[name] = src;
            $StyleManager.loadStyle(src, group, callback);
        }
    };

    /**
     * 加载样式CSS文件
     * @param src  src 源
     * @param group 组
     * @param callback 回调
     */
    $StyleManager.loadStyle = function (src, group, callback) {
        let fn = callback || function () {
        };
        let _group = $StyleManager.groups[group];
        if (!_group) {
            _group = new Array();
        }
        $utils.loadCss(src, function (e) {
            _group.push(e);
            fn();
        });
    };

    /**
     * 删除某个组所有样式CSS文件
     * @param group 组
     */
    $StyleManager.deleteGroup = function (group) {
        let _group = $StyleManager.groups[group];
        if (!!_group) {
            _group.forEach(function (element) {
                element.remove();
            })
        }
    };

    /**
     * 删除某个组下的某个样式CSS文件
     * @param name 脚本名称或者SRC
     * @param group 组
     */
    $StyleManager.deleteGroupStyleByName = function (name, group) {
        let _group = $StyleManager.groups[group];
        if (_group) {
            let mapping = $StyleManager.groupMapping[group];
            _group.forEach(function (element) {
                let groupSrc = mapping[name];
                if (!groupSrc) {
                    groupSrc = name;
                }
                if (groupSrc == element.href) {
                    element.remove();
                }
            });
        }
    };


    $$$.page = function (name, folder, callback) {
        let src = (!!folder) ? folder + "/" + name + ".html" : "pages/" + name + ".html";
        let Page = $ui.classLoader["Page"];
        let __page = $$$.$page[name];
        if (!__page) {
            $$$.$page[name] = new Page();
            __page = $$$.$page[name];
            __page.element.setAttribute("src", src);
        }
        let fn = callback || function () {

        };
        fn(__page);
    };

    $$$.pageHistory = {};
    $$$.pageCurrent = {};
    $$$.pageRootContainer = document.createElement("div");
    $$$.pageRootContainer.setAttribute("id", "pageRootContainer");

    $$$.oncontextmenu = function (e) {
        e.preventDefault();
        return false;
    }
    $$$.pageGo = function (name) {
        if ($$$.$page[name]) {
            $$$.pageHistory = $$$.pageCurrent;
            $$$.pageCurrent = $$$.$page[name];
        }
        if ($$$.pageHistory.hide) {
            $$$.pageHistory.destroy();
        }

        if ($$$.pageCurrent.show) {
            $$$.pageCurrent.show();
            $$$.pageRootContainer.appendChild($$$.pageCurrent.element);
            $$$.pageCurrent.element.contentWindow.$$$ = $$$;
            $$$.pageCurrent.element.contentWindow.onload = function () {
                $$$.pageCurrent.element.contentDocument.oncontextmenu = $$$.oncontextmenu;
            }
        }
    };

    $$$.loadListeners = [];
    $$$.addLoadListener = function (callback) {
        $$$.loadListeners.push(callback);
    };

    $$$.loadModelListeners = [];
    $$$.addModelListener = function (callback) {
        $$$.loadModelListeners.push(callback);
    };

    $$$.addModelListener(function () {
        $system.addLoadNode(new LoadNode("mofum-ui", "css/mofum-ui.css", "system", "style"));
    });

    $$$.componentDefines = {};
    $$$.components = {};
    $$$.component = function (name, callback) {
        $$$.componentDefines[name] = callback;
    };

    /**
     *
     * @param
     */
    $$$.initialize = function () {
        for (let listenerKey in $$$.loadModelListeners) {
            let listener = $$$.loadModelListeners[listenerKey];
            if (listener) {
                listener();
            }
        }
        //加载插件
        $ui.root = document.createElement("div");
        $ui.root.setAttribute("id", "uiRoot");
        $system.load(function () {
            let oldOnload = window.onload;
            window.onload = function () {
                if (oldOnload) {
                    oldOnload();
                }
                $ui.root.appendChild($$$.pageRootContainer);
                document.body.appendChild($ui.root);
                document.oncontextmenu = $$$.oncontextmenu;
                $utils.loadJson("data/pages/Page.json", function (jsonResult) {

                    for (let key in jsonResult) {
                        let pageData = jsonResult[key];
                        if (pageData) {
                            $$$.page(pageData.name, pageData.folder);
                        }
                    }
                    for (let listenerKey in $$$.loadListeners) {
                        let listener = $$$.loadListeners[listenerKey];
                        if (listener) {
                            listener();
                        }
                    }

                    for (let componentKey in $$$.componentDefines) {
                        let component = $$$.componentDefines[componentKey];
                        if (typeof component === "function") {
                            $$$.components[componentKey] = component();
                        } else {
                            $$$.components[componentKey] = component;
                        }
                    }
                }, "utf-8");
            };
        });
    };
})();