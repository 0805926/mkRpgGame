/*:
 * @plugindesc  MV 应用初始化配置
 *
 * @param file suffix
 * @desc 文件后缀
 * @default .mv.mf.js
 * @author 玉米
 */
(function () {

    if (!$$$) {
        throw new Error("请调整插件执行顺序，ui主库js未能找到！")
        return;
    }

    /**
     * 重构RPG MAKER显示层次顺序
     *
     * CANVAS 1
     * VIDEO 2
     * UPPER CANVAS 3
     * ERROR PRINTER 99
     * BOX 9
     * UI ROOT 1000
     */
    $$$.restructure(function () {
        if (typeof Graphics === "undefined") {
            return;
        }
        Graphics._modifyExistingElements = function () {
            //删除原有代码实现
        };
    });

    $$$.restructure(function () {
        if (typeof Scene_Boot === "undefined") {
            return;
        }

        if (typeof Scene_Base === "undefined") {
            return;
        }

        if (typeof SoundManager === "undefined") {
            return;
        }

        if (typeof DataManager === "undefined") {
            return;
        }

        if (typeof SceneManager === "undefined") {
            return;
        }

        if (typeof Window_TitleCommand === "undefined") {
            return;
        }

        Scene_Boot.prototype.start = function () {
            Scene_Base.prototype.start.call(this);
            SoundManager.preloadImportantSounds();
            if (DataManager.isBattleTest()) {
                DataManager.setupBattleTest();
                SceneManager.goto(Scene_Battle);
            } else if (DataManager.isEventTest()) {
                DataManager.setupEventTest();
                SceneManager.goto(Scene_Map);
            } else {
                this.checkPlayerLocation();
                DataManager.setupNewGame();
                this.fadeOutAll();
                $$$.pageGo("index");
            }
            this.updateDocumentTitle();
        };

        $$$.startNewGame = function () {
            if (typeof DataManager === "undefined") {
                return;
            }

            if (typeof SceneManager === "undefined") {
                return;
            }
            DataManager.setupNewGame();
            SceneManager._scene.fadeOutAll();
            SceneManager.goto(Scene_Map);
        }

        $$$.snapshots = [];

        DataManager.loadAllSavefileImages = function () {
            let globalInfo = this.loadGlobalInfo();
            if (globalInfo) {
                for (let i = 1; i < globalInfo.length; i++) {
                    if (this.isThisGameFile(i)) {
                        let info = globalInfo[i];
                        $$$.snapshots.push(info);
                        this.loadSavefileImages(info);
                    }
                }
            }
        };

        $$$.loadGame = function (id) {
            if (DataManager.loadGame(id)) {
                this.onLoadSuccess();
            } else {
                this.onLoadFailure();
            }
        }

        $$$.onLoadSuccess = function () {
            SoundManager.playLoad();
            SceneManager._scene.fadeOutAll();
            this.reloadMapIfUpdated();
            SceneManager.goto(Scene_Map);
            this._loadSuccess = true;
        };

        $$$.reserveFace = function (filename, hue, reservationId) {
            return ImageManager.reserveFace(filename, hue, reservationId);
        }

        $$$.reserveCharacter = function (filename, hue, reservationId) {
            return ImageManager.reserveCharacter(filename, hue, reservationId);
        }

        $$$.reloadMapIfUpdated = function () {
            if ($gameSystem.versionId() !== $dataSystem.versionId) {
                $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
                $gamePlayer.requestMapReload();
            }
        };

        $$$.characterTemp = [];

        $$$.getCharacter = function (characterName, characterIndex, callback) {
            let bitmap = ImageManager.loadCharacter(characterName);
            let big = ImageManager.isBigCharacter(characterName);
            let fn = callback || function () {
            };

            bitmap.addLoadListener(function () {
                let pw = bitmap._image.width / (big ? 3 : 12);
                let ph = bitmap._image.height / (big ? 4 : 8);
                let n = characterIndex;
                let sx = (n % 4 * 3 + 1) * pw;
                let sy = (Math.floor(n / 4) * 4) * ph;
                let image = new Image();
                image.src = bitmap._image.src;
                image.width = bitmap._image.width;
                image.height = bitmap._image.height;

                image.onload = function () {
                    let imageSrc = this.$utils.getImagePortion(image, pw, ph, sx, sy, 1);
                    fn(imageSrc);
                }.bind(this);
            }.bind(this));
        }

        $$$.onLoadFailure = function () {
            SoundManager.playBuzzer();
        };


        $$$.loadSnapshots = function () {
            $$$.snapshots = [];
            DataManager.loadAllSavefileImages();
        }

        $$$.playTitleMusic = function () {
            AudioManager.playBgm($dataSystem.titleBgm);
            AudioManager.stopBgs();
            AudioManager.stopMe();
        };

        $$$.fadeOutMusic = function () {
            let time = this.slowFadeSpeed() / 60;
            AudioManager.fadeOutBgm(time);
            AudioManager.fadeOutBgs(time);
            AudioManager.fadeOutMe(time);
        }
        $$$.fadeSpeed = function () {
            return 24;
        }

        $$$.slowFadeSpeed = function () {
            return this.fadeSpeed() * 2;
        }


    });

    $$$.restructure(function () {
        if (typeof DataManager === "undefined") {
            return;
        }
        if (typeof Game_Temp === "undefined") {
            return;
        }
        if (typeof Game_System === "undefined") {
            return;
        }
        if (typeof Game_Screen === "undefined") {
            return;
        }
        if (typeof Game_Timer === "undefined") {
            return;
        }
        if (typeof Game_Message === "undefined") {
            return;
        }
        if (typeof Game_Switches === "undefined") {
            return;
        }
        if (typeof Game_Variables === "undefined") {
            return;
        }
        if (typeof Game_SelfSwitches === "undefined") {
            return;
        }
        if (typeof Game_Actors === "undefined") {
            return;
        }
        if (typeof Game_Party === "undefined") {
            return;
        }
        if (typeof Game_Troop === "undefined") {
            return;
        }
        if (typeof Game_Map === "undefined") {
            return;
        }
        if (typeof Game_Player === "undefined") {
            return;
        }
        DataManager.createGameObjects = function () {
            $gameTemp = new Game_Temp();
            $gameSystem = new Game_System();
            $gameScreen = new Game_Screen();
            $gameTimer = new Game_Timer();
            $gameMessage = new Game_Message();
            $gameSwitches = new Game_Switches();
            $gameVariables = new Game_Variables();
            $gameSelfSwitches = new Game_SelfSwitches();
            $gameActors = new Game_Actors();
            $gameParty = new Game_Party();
            $gameTroop = new Game_Troop();
            $gameMap = new Game_Map();
            $gamePlayer = new Game_Player();

            $$$.Game = {};

            $$$.Game.$temp = $gameTemp;
            $$$.Game.$system = $gameSystem;
            $$$.Game.$screen = $gameScreen;
            $$$.Game.$timer = $gameTimer;
            $$$.Game.$message = $gameMessage;
            $$$.Game.$switches = $gameSwitches;
            $$$.Game.$variables = $gameVariables;
            $$$.Game.$selfSwitches = $gameSelfSwitches;
            $$$.Game.$actors = $gameActors;
            $$$.Game.$party = $gameParty;
            $$$.Game.$troop = $gameTroop;
            $$$.Game.$map = $gameMap;
            $$$.Game.$player = $gamePlayer;

        };


    });

}());