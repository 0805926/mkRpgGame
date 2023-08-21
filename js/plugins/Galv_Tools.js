//-----------------------------------------------------------------------------
//  Galv's Tools
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  Galv_Tools.js
//-----------------------------------------------------------------------------
//  2016-11-20 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_Tools = true;

var Galv = Galv || {};                  // Galv's main object
Galv.TOOLS = Galv.TOOLS || {};          // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.0) Swap between and use tools when a button is pressed on the map.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param HUD Image
 * @desc Name of the image located in /img/system/ to use for the HUD
 * @default toolhud
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param HUD XY
 * @desc The x,y position of the tool hud.
 * @default 710,520
 *
 * @param HUD Icon XY
 * @desc The x,y position of the tool icon relative to the hud's x,y.
 * @default 50,50
 *
 * @param Switch Left
 * @desc Button to switch tool left
 * Default: pagedown (which is L on gamepad)
 * @default pagedown
 *
 * @param Switch Right
 * @desc Button to switch tool right
 * Default: pageup (which is R on gamepad)
 * @default pageup
 *
 * @param Use Tool
 * @desc Button to use the selected tool
 * Default: alt (no gamepad button)
 * @default alt
 *
 * @param Gamepad Dash Button
 * @desc Make the gamepad cancel button dash and the previous dash button becomes use tool. true or false
 * @default true
 *
 * @help
 *   Galv's Tools
 * ----------------------------------------------------------------------------
 * This plugin creates a tool system, where the player can cycle between items
 * that are designated as tools and press a button to use the tool that is
 * selected on the screen.
 * The basis behind this plugin is to allow players to event what happens when
 * a tool is used, giving the player script calls to use to assit them with
 * tool functionality. Each tool activates a common event to control this.
 *
 *
 * ----------------------------------------------------------------------------
 *  NOTE TAGS for ITEMS
 * ----------------------------------------------------------------------------
 *
 *    <tool:x>      // where x is the COMMON EVENT id that is run on tool use
 *
 * ----------------------------------------------------------------------------
 *  NOTE TAGS for EVENTS
 * ----------------------------------------------------------------------------
 *
 *    <label:x>     // events can have any tag in them which can be accessed
 *                  // by the tool's common event to determine functionality.
 *                  // the label can be anything and different for each event
 *
 * ----------------------------------------------------------------------------
 *  COMMENTS for EVENT PAGES
 * ----------------------------------------------------------------------------
 *
 *    <stopTool>  // disables tools on event with this comment on active page
 *                // eg. use if you change to an empty page to remove an event
 *
 * ----------------------------------------------------------------------------
 *  SCRIPT for CONDITIONAL BRANCH
 * ----------------------------------------------------------------------------
 *
 *    Galv.TOOLS.frontEvent('label')  // detects if an event has a <label> note
 *                                    // on the tile in front of the player
 *
 *    Galv.TOOLS.frontEvent('label',x) // detects if label's x value was set
 *                                     // eg <label:x>
 *
 *    Galv.TOOLS.underEvent('label')  // same as above but same tile as player
 *    Galv.TOOLS.underEvent('label',x)  // same as above but same tile again
 *
 * ----------------------------------------------------------------------------
 *  SCRIPT for event SCRIPT calls
 * ----------------------------------------------------------------------------
 *
 *    $gameSystem.toolBtnDisabled = status   // status can be true or false
 *                                           // to disable/enable tool hud
 *
 *    Galv.TOOLS.equipTool(id);    // manually equip tool item to player.
 *                                 // this won't do anything if the player
 *                                 // does not actually have the tool item
 *
 *    Galv.TOOLS.event   // AFTER one of the above conditional branch script
 *                       // is used, it stores the event object found in this
 *                       // object variable. This can be used with a little
 *                       // javascript knowledge (see demo for examples and
 *                       // also some below)
 *
 *    Galv.TOOLS.event._eventId   // the event Id of event tool is used on
 *                                // can be used in Control Variables script
 *
 *    Galv.TOOLS.event.erase()    // erase the event
 *
 *    Galv.TOOLS.event._animationId = x;  // play animation on tool event
 *
 * I recommend asking or searching forums for more scripts you can use on an
 * event object.
 *
 * ----------------------------------------------------------------------------  
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

var txt = PluginManager.parameters('Galv_Tools')["HUD XY"].split(',');
Galv.TOOLS.hudXY = [Number(txt[0]),Number(txt[1])];

txt = PluginManager.parameters('Galv_Tools')["HUD Icon XY"].split(',');
Galv.TOOLS.hudIconXY = [Number(txt[0]),Number(txt[1])];


Galv.TOOLS.hudImg = PluginManager.parameters('Galv_Tools')["HUD Image"];


Galv.TOOLS.btnLeft = PluginManager.parameters('Galv_Tools')["Switch Left"];
Galv.TOOLS.btnRight = PluginManager.parameters('Galv_Tools')["Switch Right"];
Galv.TOOLS.btnTool = PluginManager.parameters('Galv_Tools')["Use Tool"];

Galv.TOOLS.overwriteDash = PluginManager.parameters('Galv_Tools')["Gamepad Dash Button"].toLowerCase() === 'true' ? true : false;

Galv.TOOLS.event = null;

Galv.TOOLS.updateToolList = function() {
	this.makeToolList();
	if (!$gameSystem._tools.list.contains($gameSystem._tools.selected)) {
		$gameSystem._tools.selected = -1; // unselect tool if player loses tool
	}
};

Galv.TOOLS.makeToolList = function() {
	$gameSystem._tools.list = [];
    var list = $gameParty.items();
	for (var id in list) {
		if (this.includes(list[id])) {
			$gameSystem._tools.list.push(list[id].id);
		}
	}
};

Galv.TOOLS.index = function() {
	return $gameSystem._tools.list.indexOf($gameSystem._tools.selected);
};

Galv.TOOLS.includes = function(item) {
	return DataManager.isItem(item) && item.meta.tool;
	return false;
};

Galv.TOOLS.shiftTool = function(dir) {
	if ($gameSystem._tools.list.length === 0) return;

	var index = Galv.TOOLS.index();
	var count = $gameSystem._tools.list.length;
	if (dir > 0) {
		// left
		index = index <= 0 ? count - 1 : index - 1;
	} else if (dir < 0) {
		// right
		index = index >= count - 1 ? 0 : index + 1;
	}
	$gameSystem._tools.selected = $gameSystem._tools.list[index];
};

Galv.TOOLS.equipTool = function(iId) {
	if ($gameSystem._tools.list.contains(iId)) $gameSystem._tools.selected = iId;
};

Galv.TOOLS.frontEvent = function(tag,value) {
	var direction = $gamePlayer.direction();
	var x1 = $gamePlayer.x;
	var y1 = $gamePlayer.y;
	var x2 = $gameMap.roundXWithDirection(x1, direction);
	var y2 = $gameMap.roundYWithDirection(y1, direction);
	return Galv.TOOLS.getEvent(x2,y2,tag,value);
};

Galv.TOOLS.underEvent = function(tag,value) {
	var direction = $gamePlayer.direction();
	var x1 = $gamePlayer.x;
	var y1 = $gamePlayer.y;
	return Galv.TOOLS.getEvent(x1,y1,tag,value);
};

Galv.TOOLS.getEvent = function(x,y,tag,value) {
	Galv.TOOLS.event = null;
	var tagId = 0;
	$gameMap.eventsXy(x, y).forEach(function(event) {
		var tId = event.event().meta[tag];
		if (!event._erased && !Galv.TOOLS.isToolBlocked(event) && (tId || !tag)) {
			if (!value || (value && value == tId)) {
				tagId = Number(tId);
				Galv.TOOLS.event = event;
			}
		}
	});
	return tagId;
};

Galv.TOOLS.isToolBlocked = function(event) {
	var blocked = false;
	if (event.page()) {
		var listCount = event.page().list.length;
		
		for (var i = 0; i < listCount; i++) {
			if (event.page().list[i].code === 108) {
				var tag = event.page().list[i].parameters[0].match(/<stopTool>/i);
				if (tag) {
					blocked = true;
					break;
				}
			}
		}
	}
	return blocked;
};


//-----------------------------------------------------------------------------
//  INPUT
//-----------------------------------------------------------------------------

// Make alt key work
Input.keyMapper[18] = 'alt';

if (Galv.TOOLS.overwriteDash) {
	Input.gamepadMapper[2] = Galv.TOOLS.btnTool; // change X button to use tools
	
	// Overwrite so cancel button is also dash button
	Game_Player.prototype.isDashButtonPressed = function() {
		var shift = Input.isPressed('shift') || Input.isPressed('cancel');
		if (ConfigManager.alwaysDash) {
			return !shift;
		} else {
			return shift;
		}
	};
};


//-----------------------------------------------------------------------------
//  SCENE BOOT
//-----------------------------------------------------------------------------

Galv.TOOLS.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
	Galv.TOOLS.Scene_Boot_loadSystemImages.call(this);
	ImageManager.loadSystem(Galv.TOOLS.hudImg);
};


//-----------------------------------------------------------------------------
//  GAME PLAYER
//-----------------------------------------------------------------------------

Galv.TOOLS.Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function() {
	if (this.canUseTool()) {
		if (Input.isTriggered(Galv.TOOLS.btnTool)) this.useTool();
		if (Input.isTriggered(Galv.TOOLS.btnLeft)) Galv.TOOLS.shiftTool(-1);
		if (Input.isTriggered(Galv.TOOLS.btnRight)) Galv.TOOLS.shiftTool(1);
	}
	Galv.TOOLS.Game_Player_moveByInput.call(this);
};

Game_Player.prototype.canUseTool = function() {
	return !$gameMap.isEventRunning() && !$gameSystem.toolBtnDisabled && this.isNormal() && this.canMove() && !this.isJumping();
};

Game_Player.prototype.useTool = function() {
	Galv.TOOLS.tempEvent = null;
	var toolId = $gameSystem._tools.selected;
	if (toolId <= 0) return;
	//Galv.TOOLS.eventFront(); // set front event
	//Galv.TOOLS.eventUnder(); // set under event
	var cId = $dataItems[toolId].meta.tool;
	if (cId) $gameTemp.reserveCommonEvent(cId);
};


//-----------------------------------------------------------------------------
//  GAME SYSTEM
//-----------------------------------------------------------------------------

Galv.TOOLS.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.TOOLS.Game_System_initialize.call(this);
	this._tools = {selected:0,list:[]};
};


//-----------------------------------------------------------------------------
//  SCENE MAP
//-----------------------------------------------------------------------------

Galv.TOOLS.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	Galv.TOOLS.Scene_Map_start.call(this);
	Galv.TOOLS.updateToolList();
};


//-----------------------------------------------------------------------------
//  GAME MAP
//-----------------------------------------------------------------------------

Galv.TOOLS.Game_Map_refresh = Game_Map.prototype.refresh;
Game_Map.prototype.refresh = function() {
	Galv.TOOLS.Game_Map_refresh.call(this);
	Galv.TOOLS.updateToolList();
};


//-----------------------------------------------------------------------------
//  SPRITESET MAP
//-----------------------------------------------------------------------------

Galv.TOOLS.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	Galv.TOOLS.Spriteset_Map_createLowerLayer.call(this);
	this.createToolHud();
};

Spriteset_Map.prototype.createToolHud = function() {
	this._toolHud = new Sprite_ToolHud();
	this.addChild(this._toolHud);
};


})();



//-----------------------------------------------------------------------------
//  SPRITE TOOL HUD
//-----------------------------------------------------------------------------

function Sprite_ToolHud() {
    this.initialize.apply(this, arguments);
}

Sprite_ToolHud.prototype = Object.create(Sprite_Base.prototype);
Sprite_ToolHud.prototype.constructor = Sprite_ToolHud;

Sprite_ToolHud.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.setBitmap();
	this.createIconSprite();
};

Sprite_ToolHud.prototype.setBitmap = function() {
	this.x = Galv.TOOLS.hudXY[0];
	this.y = Galv.TOOLS.hudXY[1];
	this.bitmap = ImageManager.loadSystem(Galv.TOOLS.hudImg);
};

Sprite_ToolHud.prototype.createIconSprite = function() {
	this._icon = new Sprite_ToolHudIcon();
	this.addChild(this._icon);
};

Sprite_ToolHud.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
	this.updateVisible();
};

Sprite_ToolHud.prototype.updateVisible = function() {
	this.opacity = $gameSystem.toolBtnDisabled ? 0 : 255;
};


//-----------------------------------------------------------------------------
// SpriteFishEquipIcon
//-----------------------------------------------------------------------------

function Sprite_ToolHudIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_ToolHudIcon.prototype = Object.create(Sprite.prototype);
Sprite_ToolHudIcon.prototype.constructor = Sprite_ToolHudIcon;

Sprite_ToolHudIcon.prototype.initialize = function(type) {
    Sprite.prototype.initialize.call(this);
	this._iconIndex = 0;
	this._toolId = null;
	this.anchor.y = 0.5;
	this.anchor.x = 0.5;
	this.updateGraphic();
};

Sprite_ToolHudIcon.prototype.updateGraphic = function() {
	if (this._toolId != $gameSystem._tools.selected) {
		
		var item = $dataItems[$gameSystem._tools.selected];
		this._iconIndex = item ? item.iconIndex : 0;	
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		
		if (this._iconIndex) {
			var sx = this._iconIndex % 16 * pw;
			var sy = Math.floor(this._iconIndex / 16) * ph;
			// only do it if change has happened.
			this.bitmap = new Bitmap(pw,ph);
			var bitmap = ImageManager.loadSystem('IconSet');
			this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
			this.x = Galv.TOOLS.hudIconXY[0];
			this.y = Galv.TOOLS.hudIconXY[1];
			this.scale.x = 2;
			this.scale.y = 2;
			this._toolId = $gameSystem._tools.selected;
		} else {
			this.bitmap = new Bitmap(pw,ph);
		}
	}
};

Sprite_ToolHudIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
	this.updateGraphic();
	this.updateScale();
};

Sprite_ToolHudIcon.prototype.updateScale = function() {
	if (this.scale.x > 1) {
		this.scale.x -= 0.1;
		this.scale.y -= 0.1;
	}
};