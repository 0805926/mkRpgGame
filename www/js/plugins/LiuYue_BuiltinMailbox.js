/*:
 * @plugindesc v1.05 LiuYue_BuiltinMailbox 内置邮箱
 * @author 流逝的岁月
 *
 * @help
 * ============================================================================
 * 介绍
 * ============================================================================
 *
 * 在游戏中添加一个邮箱功能 可以用来接收信息和奖励
 *
 *
 *
 *
 *
 *
 * 注意:编写的邮件是以1作为开始编号的,而不是0
 * 注意:这款插件部分功能需要LiuYue_DateTime(日期与时间v1.00或以上版本)的支持,使用到此功能时,请确保安装了这款插件
 * 注意:添加公共事件和脚本并不会在领取邮件完成后直接执行，而是会进行堆积，在回到游戏地图主界面时，在依次从堆积中执行
 *
 *
 *
 *-------------------------------------------------------------------
 *
 *使用条例：本插件完全免费，随意魔改
 * 
 *-------------------------------------------------------------------
 *
 *
 *
 *
 *
 *---------------------Plugin Command--------------------
 *以下是可能会用到的插件指令
 *
 * ZzyBMF EnableMenu x(true/false)                       //这会设置是否激活菜单上的邮箱菜单选项
 * ZzyBMF InsertMenu x(true/false)                       //这会设置是否插入菜单上的邮箱菜单选项
 * ZzyBMF MenuText x                                     //这会设置菜单上邮箱选项的文本内容
 * ZzyBMF BKPicture x                                    //这会设置打开邮箱背景的图片
 * ZzyBMF Open                                           //这会打开邮箱界面
 *
 * ZzyBMF Send x                                         //这会在游戏中向邮箱中发送编号为x的邮件,x为插件参数中编写的对应ID值,注意ID起始值为1,而不是0
 * ZzyBMF Send x,x,x...                                  //通过逗号可分隔开,进行多个邮件的发送
 *
 * ZzyBMF IsHavePrompt x(true/false)                     //这会修改是否有新邮件提示
 * ZzyBMF PromptPicture x                                //这会修改邮件提示图片名称
 * ZzyBMF NoPicPromptText x                              //这会修改无图片邮件提示文字
 * ZzyBMF PromptFadeFrame x                              //这会修改邮件提示出现速度
 * ZzyBMF PromptWaitFrame x                              //这会修改邮件提示等待速度
 * 
 *
 *-------------------------Script----------------------------
 *以下是可能会用到的脚本函数
 *              
 * 
 * Zzy.BMF.EnableMenu(enable)                     //这会修改是否激活菜单上的窗口皮肤菜单选项              
 * Zzy.BMF.EnableMenu(enable)                     //这会修改是否插入菜单上的窗口皮肤菜单选项
 * Zzy.BMF.MenuText(text)                         //这会修改菜单上窗口皮肤选项的文本字样
 * Zzy.BMF.BKPicture(picName)                     //这会修改打开邮箱背景的图片
 * Zzy.BMF.Open()                                 //这会打开邮箱界面
 * Zzy.BMF.Send(idArrStr)                         //这会在游戏中向邮箱中发送编号为x的邮件,x为插件参数中编写的对应ID值,注意ID起始值为1,而不是0
 * Zzy.BMF.IsHavePrompt(isEnable)                 //这会修改是否有新邮件提示
 * Zzy.BMF.PromptPicture(picStr)                  //这会修改邮件提示图片名称
 * Zzy.BMF.NoPicPromptText(str)                   //这会修改无图片邮件提示文字
 * Zzy.BMF.PromptFadeFrame(fFrame)                //这会修改邮件提示出现速度
 * Zzy.BMF.PromptWaitFrame(fFrame)                //这会修改邮件提示等待速度
 *
 *
 *-----------------------------------------------------

 我叫坂本：v1.05 拓展函数脚本,修复一些显示文本问题
 我叫坂本：v1.04 修复了自动显示奖励导致的显示错误问题,将奖励0金币依然显示的情况取消
 我叫坂本：v1.03 添加与旧存档兼容,添加自动打印奖励内容和相关参数
 我叫坂本：v1.02 修复读取插件参数设置空白时,导致读取异常的bug
 我叫坂本：v1.01 添加获取到邮件时的提示信息和音效
 我叫坂本：v1.00 完成插件
 
------------------------------------------------------------
 *
 *
 * @param ---菜单---
 * @default
 *
 *
 * @param EnableMenu
 * @text 激活菜单项
 * @parent ---菜单---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 在菜单栏中'邮箱'是否是激活状态
 * YES - true     NO - false
 * @default true
  
 * @param InsertMenu
 * @text 添加菜单项
 * @parent ---菜单---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 在菜单栏中是否添加'邮箱'
 * YES - true     NO - false
 * @default true 
 
 * @param MenuCommandName
 * @text 主菜单显示名称
 * @parent ---菜单---
 * @type text
 * @desc 在主菜单上显示选项的名称，默认名称'邮箱'
 * @default 邮箱
 *
 *
 *
 * @param ---画面---
 * @default
 *
 *
 * @param IsAutoShowReward
 * @text 是否自动显示奖励内容
 * @parent ---画面---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 设置为true后,将会将右键中的奖励内容自动打印到邮件中最下方
 * YES - true     NO - false
 * @default false
 *
 * @param CoinIcon
 * @text 金币图标
 * @parent ---画面---
 * @type number
 * @desc 需要填写显示自动奖励时金币的图标样式,需填写ID值,若为0则不会显示
 * @default 313
 *
 *
 * @param CoinFormalu
 * @text 金币格式
 * @parent ---画面---
 * @type text
 * @desc 显示金币的格式,其中%1会被替换为金币数
 * @default 金币:%1
 *
 *
 * @param ListNum
 * @text 奖励横向并列
 * @parent ---画面---
 * @type number
 * @min 1
 * @desc 显示奖励内容时横向所占用的数量,默认值为2,最小值为1
 * @default 2
 *
 * @param ExtraHeight
 * @text 预留高度
 * @parent ---画面---
 * @type number
 * @desc 打印奖励内容的额外多出高度
 * @default 30
 *
 *
 *
 * @param ---设置---
 * @default
 *
 *
 * @param IsSameOnly
 * @text 是否相同邮件只存在一封
 * @parent ---设置---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 设置为true后,获取到的相同邮件仅仅只能存在一封,调用指令将无法再次获取
 * YES - true     NO - false
 * @default false
 *
 * @param SameOnlyCommon
 * @text 无法获取时公共事件
 * @parent ---设置---
 * @type number
 * @desc 无法获取时会调用公共事件,需要输入公共事件的ID值,填0则不会调用
 * @default 0
 *
 * @param SameOnlyVar
 * @text 无法获取时变量
 * @parent ---设置---
 * @type number
 * @desc 无法获取时会将无法获取的邮件ID值存放在变量ID中,注意如果是多个邮件,则仅仅保存最后一个邮件ID值,填0则不会存储
 * @default 0
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @param ---邮件---
 * @default
 *
 *
 * @param MailboxInfos
 * @text 预设邮件信息
 * @parent ---邮件---
 * @type struct<Template>[]
 * @desc 提前预设邮件信息将会更方便获取邮件消息
 * @default ["{\"TitleName\":\"\\\\C[4]每日游戏礼\",\"TOfx\":\"3\",\"TOfy\":\"3\",\"ComId\":\"0\",\"Script\":\"\\\"\\\"\",\"ContainText\":\"[\\\"\\\\\\\"你来啦?\\\\\\\\n好耶!\\\\\\\\n\\\\\\\\\\\\\\\\C[14]这些礼物送给你哦!\\\\\\\\n\\\\\\\\n        \\\\\\\\\\\\\\\\{\\\\\\\\\\\\\\\\C[27]----狐狸\\\\\\\\\\\\\\\\}\\\\\\\\n\\\\\\\\n\\\\\\\\\\\\\\\\C[0]----------------------------------\\\\\\\"\\\"]\",\"DateTime\":\"auto\",\"DOfx\":\"3\",\"DOfy\":\"-3\",\"RewardArr\":\"[\\\"{\\\\\\\"Golds\\\\\\\":\\\\\\\"2000\\\\\\\",\\\\\\\"Items\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"{\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"ItemType\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"6\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"ItemNum\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"}\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"{\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"ItemType\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"5\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"ItemNum\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"10\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"}\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Weapons\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Armors\\\\\\\":\\\\\\\"\\\\\\\"}\\\"]\"}"]
 *
 *
 * @param ---显示---
 * @default
 *
 * @param IsHavePrompt
 * @text 是否有新邮件提示
 * @parent ---显示---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 收到新邮件时,在主界面中将会出现提示
 * YES - true     NO - false
 * @default true
 *
 * @param PromptPicture
 * @text 邮件提示图片
 * @parent ---显示---
 * @dir img/pictures
 * @type file
 * @desc 收到新邮件时,在地图界面显示的提示图片,填写图片名称,如果没有填写,则会显示默认文本,图片存放在img/pictures文件夹下
 * @default
 *
 *
 * @param PromptAnchorX
 * @text 邮件提示图片锚点X
 * @parent ---显示---
 * @type text
 * @desc 显示图片的X的锚点值,锚点既为图片的中心点,范围0~1之间,默认值0.5
 * @default 0.5
 *
 * @param PromptAnchorY
 * @text 邮件提示图片锚点Y
 * @parent ---显示---
 * @type text
 * @desc 显示图片的Y的锚点值,锚点既为图片的中心点,范围0~1之间,默认值0.5
 * @default 0.5
 *
 * @param PromptSpriteX
 * @text 邮件提示图片X
 * @parent ---显示---
 * @type text
 * @desc 显示图片的X位置,这可以是一个公式
 * @default Graphics.boxWidth/2
 *
 * @param PromptSpriteY
 * @text 邮件提示图片Y
 * @parent ---显示---
 * @type text
 * @desc 显示图片的Y位置,这可以是一个公式
 * @default 25
 *
 *
 *
 * @param NoPicPromptText
 * @text 无图片邮件提示文字
 * @parent ---显示---
 * @type text
 * @desc 提示的文本信息
 * @default 您有新的邮件
 *
 * @param PromptFadeFrame
 * @text 邮件提示出现速度
 * @parent ---显示---
 * @type number
 * @desc 从无透明度到满透明度所需要的帧数,这可以是一个正整数,默认值为30帧
 * @default 30
 *
 * @param PromptWaitFrame
 * @text 邮件提示等待速度
 * @parent ---显示---
 * @type number
 * @desc 从透明度等待消失所需要的帧数,这可以是一个正整数,默认值为120帧
 * @default 120
 *
 *
 * @param NewPromptSound
 * @text 新邮件提示音效
 * @parent ---显示---
 * @dir audio/se
 * @type file
 * @desc 新邮件提示产生的声音,请填写audio/se文件夹中的文件名,不包含m4a.ogg的后缀名,未填写则播放默认声
 * @default Coin
 *
 * @param NewPromptVolume
 * @text 新邮件提示音量
 * @parent ---显示---
 * @type number
 * @min 0
 * @desc 新邮件提示产生的音量,默认值100
 * @default 100
 *
 * @param NewPromptPitch
 * @text 新邮件提示音调
 * @parent ---显示---
 * @type number
 * @min 0
 * @desc 新邮件提示产生的音调,默认值100
 * @default 100
 *
 * @param NewPromptPan
 * @text 新邮件提示声道
 * @parent ---显示---
 * @type number
 * @desc 新邮件提示产生的声道,默认值0
 * @default 0
 *
 *
 *
 *
 *
 * @param ---设置---
 * @default
 *
 * @param BKPicture
 * @text 邮箱背景图片
 * @parent ---设置---
 * @dir img/pictures
 * @type file
 * @desc 打开邮箱界面时,显示的背景图片,填写图片名称,如果没有填写,则使用默认背景图片,图片存放在img/pictures文件夹下
 * @default
 *
 *
 * @param ---类型窗口设置---
 * @default
 *
 * @param Win1X
 * @text 类型窗口位置X
 * @parent ---类型窗口设置---
 * @type text
 * @desc x的位置,可以输入一段脚本信息
 * @default 0
 *
 * @param Win1Y
 * @text  类型窗口位置Y
 * @parent ---类型窗口设置---
 * @type text
 * @desc y的位置,可以输入一段脚本信息
 * @default 0
 *
 * @param Win1W
 * @text  类型窗口宽度
 * @parent ---类型窗口设置---
 * @type text
 * @desc 宽度,可以输入一段脚本信息
 * @default Graphics.boxWidth/4
 *
 * @param Win1H
 * @text  类型窗口高度
 * @parent ---类型窗口设置---
 * @type text
 * @desc 高度,可以输入一段脚本信息
 * @default Graphics.boxHeight
 *
 * @param Win1List
 * @text 类型窗口列数
 * @parent ---类型窗口设置---
 * @type number
 * @desc 屏幕里出现的选项卡的列数,默认值为5
 * @default 5
 *
 *
 *
 *
 * @param ---邮箱窗口设置---
 * @default
 *
 * @param Win2X
 * @text 邮箱合集窗口位置X
 * @parent ---邮箱窗口设置---
 * @type text
 * @desc x的位置,可以输入一段脚本信息
 * @default Graphics.boxWidth/4
 *
 * @param Win2Y
 * @text 邮箱合集窗口位置Y
 * @parent ---邮箱窗口设置---
 * @type text
 * @desc y的位置,可以输入一段脚本信息
 * @default 0
 *
 * @param Win2W
 * @text 邮箱合集窗口宽度
 * @parent ---邮箱窗口设置---
 * @type text
 * @desc 宽度,可以输入一段脚本信息
 * @default Graphics.boxWidth - Graphics.boxWidth/4
 *
 * @param Win2H
 * @text 邮箱合集窗口高度
 * @parent ---邮箱窗口设置---
 * @type text
 * @desc 高度,可以输入一段脚本信息
 * @default Graphics.boxHeight
 *
 * @param Win2List
 * @text 邮箱窗口列数
 * @parent ---邮箱窗口设置---
 * @type number
 * @desc 屏幕里出现的选项卡的列数,默认值为5
 * @default 5
 *
 *
 *
 * @param ---邮件窗口设置---
 * @default
 *
 * @param Win3X
 * @text 邮件信息窗口位置X
 * @parent ---邮件窗口设置---
 * @type text
 * @desc x的位置,可以输入一段脚本信息
 * @default 0
 *
 * @param Win3Y
 * @text 邮件信息窗口位置Y
 * @parent ---邮件窗口设置---
 * @type text
 * @desc y的位置,可以输入一段脚本信息
 * @default 0
 *
 * @param Win3W
 * @text 邮件信息窗口宽度
 * @parent ---邮件窗口设置---
 * @type text
 * @desc 宽度,可以输入一段脚本信息
 * @default Graphics.boxWidth
 *
 * @param Win3H
 * @text 邮件信息窗口高度
 * @parent ---邮件窗口设置---
 * @type text
 * @desc 高度,可以输入一段脚本信息
 * @default Graphics.boxHeight - this.fittingHeight(1)
 *
 * @param Win3Speed
 * @text 邮件信息窗口速度
 * @parent ---邮件窗口设置---
 * @type number
 * @desc 窗口打开的速度,这个值越大,打开速度越快,可以是一个正整数,默认值32
 * @default 32
 *
 *
 * @param Win3ScrollYDis
 * @text 邮件信息滚动距离
 * @parent ---邮件窗口设置---
 * @type number
 * @desc 如果信息超出窗口长度,按下键盘上下键时,信息每次滚动的距离,可以是一个正整数,默认值30
 * @default 30
 
 *
 * @param ---选择窗口设置---
 * @default
 *
 * @param Win4X
 * @text 邮件选择窗口位置X
 * @parent ---选择窗口设置---
 * @type text
 * @desc x的位置,可以输入一段脚本信息
 * @default 0
 *
 * @param Win4Y
 * @text 邮件选择窗口位置Y
 * @parent ---选择窗口设置---
 * @type text
 * @desc y的位置,可以输入一段脚本信息
 * @default Graphics.boxHeight - this.fittingHeight(1)
 *
 * @param Win4W
 * @text 邮件选择窗口宽度
 * @parent ---选择窗口设置---
 * @type text
 * @desc 宽度,可以输入一段脚本信息
 * @default Graphics.boxWidth
 *
 * @param Win4H
 * @text 邮件选择窗口高度
 * @parent ---选择窗口设置---
 * @type text
 * @desc 高度,可以输入一段脚本信息
 * @default this.fittingHeight(1)
 *
 * @param Win4Speed
 * @text 邮件信息窗口速度
 * @parent ---选择窗口设置---
 * @type number
 * @desc 窗口打开的速度,这个值越大,打开速度越快,可以是一个正整数,默认值32
 * @default 32
 *
 * @param Win4NOkText
 * @text 新邮件下确认文本
 * @parent ---选择窗口设置---
 * @type text
 * @desc 处于'新邮件'选择模式下,打开邮箱中的邮件后,出现的确认选项文本文字
 * @default 领取
 *
 * @param Win4NCancelText
 * @text 新邮件下取消文本
 * @parent ---选择窗口设置---
 * @type text
 * @desc 处于'新邮件'选择模式下,打开邮箱中的邮件后,出现的取消选项文本文字
 * @default 取消
 *
 * @param Win4OOkText
 * @text 旧邮件下确认文本
 * @parent ---选择窗口设置---
 * @type text
 * @desc 处于'旧邮件'选择模式下,打开邮箱中的邮件后,出现的确认选项文本文字
 * @default 完成
 *
 * @param Win4OCancelText
 * @text 旧邮件下取消文本
 * @parent ---选择窗口设置---
 * @type text
 * @desc 处于'旧邮件'选择模式下,打开邮箱中的邮件后,出现的取消选项文本文字
 * @default 取消
 *
 *
 *
 * @param ---窗口---
 * @default
 *
 * @param NewMessage
 * @text 新邮件名称
 * @parent ---窗口---
 * @type text
 * @desc 新邮件显示在菜单上时的文本名称
 * @default 新邮件
 *
 * @param IsShowNMCount
 * @text 是否显示新邮件数量
 * @parent ---窗口---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 在新邮件文本中,是否标记拥有的邮件数量
 * YES - true     NO - false
 * @default true
 *
 * @param NMCountFormat
 * @text 新邮件数量文本格式
 * @parent ---窗口---
 * @type text
 * @desc 新邮件显示在菜单上时的格式,%1代表对应的数量
 * @default (%1)
 *
 *
 * @param OldMessage
 * @text 已查看邮件名称
 * @parent ---窗口---
 * @type text
 * @desc 查看过的邮件显示在菜单上时的文本名称
 * @default 已查看
 *
 * @param IsShowOMCount
 * @text 是否显示已查看邮件数量
 * @parent ---窗口---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 在已查看邮件文本中,是否标记拥有的邮件数量
 * YES - true     NO - false
 * @default true
 *
 * @param OMCountFormat
 * @text 已查看邮件数量文本格式
 * @parent ---窗口---
 * @type text
 * @desc 已查看邮件显示在菜单上时的格式,%1代表对应的数量
 * @default (%1)
 *
 * @param IsRectFrame
 * @text 是否绘制底色框
 * @parent ---窗口---
 * @type boolean
 * @on YES
 * @off NO
 * @desc 显示的窗口中,绘制底色模板
 * YES - true     NO - false
 * @default true
 *
 * @param RectFrameDis
 * @text 底色框间距
 * @parent ---窗口---
 * @type number
 * @desc 绘制的间距距离,可以填写正整数,默认值为2
 * @default 2
 *
 * @param RectFrameColor
 * @text 底色框颜色
 * @parent ---窗口---
 * @type text
 * @desc 绘制的底色框的颜色,可以使用#xxxxxx或是rgba(x,x,x,x)两种格式,默认值为rgba(250,20,20,0.6)深蓝色
 * @default rgba(20,20,80,0.6)
 *
 *
 *
 * @param ---音效---
 * @default
 *
 * @param ReceiveSound
 * @text 领取奖励音效
 * @parent ---音效---
 * @dir audio/se
 * @type file
 * @desc 领取奖励产生的声音,请填写audio/se文件夹中的文件名,不包含m4a.ogg的后缀名,未填写则播放默认声
 * @default Item3
 *
 * @param ReceiveVolume
 * @text 领取奖励音量
 * @parent ---音效---
 * @type number
 * @min 0
 * @desc 领取奖励产生的音量,默认值100
 * @default 100
 *
 * @param ReceivePitch
 * @text 领取奖励音调
 * @parent ---音效---
 * @type number
 * @min 0
 * @desc 领取奖励产生的音调,默认值100
 * @default 100
 *
 * @param ReceivePan
 * @text 领取奖励声道
 * @parent ---音效---
 * @type number
 * @desc 领取奖励产生的声道,默认值0
 * @default 0
 *
 *
 * @param OpenMSound
 * @text 打开邮件音效
 * @parent ---音效---
 * @dir audio/se
 * @type file
 * @desc 打开邮件产生的声音,请填写audio/se文件夹中的文件名,不包含m4a.ogg的后缀名,未填写则播放默认声
 * @default Book1
 *
 * @param OpenMVolume
 * @text 打开邮件音量
 * @parent ---音效---
 * @type number
 * @min 0
 * @desc 打开邮件产生的音量,默认值100
 * @default 100
 *
 * @param OpenMPitch
 * @text 打开邮件音调
 * @parent ---音效---
 * @type number
 * @min 0
 * @desc 打开邮件产生的音调,默认值100
 * @default 100
 *
 * @param OpenMPan
 * @text 打开邮件声道
 * @parent ---音效---
 * @type number
 * @desc 打开邮件产生的声道,默认值0
 * @default 0
 
 * @param CloseMSound
 * @text 关闭邮件音效
 * @parent ---音效---
 * @dir audio/se
 * @type file
 * @desc 关闭邮件产生的声音,请填写audio/se文件夹中的文件名,不包含m4a.ogg的后缀名,未填写则播放默认声
 * @default Book2
 *
 * @param CloseMVolume
 * @text 关闭邮件音量
 * @parent ---音效---
 * @type number
 * @min 0
 * @desc 关闭邮件产生的音量,默认值100
 * @default 100
 *
 * @param CloseMPitch
 * @text 关闭邮件音调
 * @parent ---音效---
 * @type number
 * @min 0
 * @desc 关闭邮件产生的音调,默认值100
 * @default 100
 *
 * @param CloseMPan
 * @text 关闭邮件声道
 * @parent ---音效---
 * @type number
 * @desc 关闭邮件产生的声道,默认值0
 * @default 0
 *
 *
 *
*/
/* ----------------------------------------------------------------------------
 * Template Parameter Structure
 * ---------------------------------------------------------------------------
 */
 /*~struct~Template:
 *
 * @param TitleName
 * @text 标题名称
 * @type text
 * @desc 显示文件标题的名称
 * @default \C[4]新的邮件
 *
 * @param TOfx
 * @text 标题名称偏移X
 * @type text
 * @desc 显示的标题名称在窗口上的偏移微调值,这可以是一个正负整数值
 * @default 3
 *
 * @param TOfy
 * @text 标题名称偏移Y
 * @type text
 * @desc 显示的标题名称在窗口上的偏移微调值,这可以是一个正负整数值
 * @default 3
 *
 *
 * @param ComId
 * @text 领取调用公共事件
 * @type number
 * @desc 确认领取邮件后,会执行的公共事件,填写公共事件ID,填写0则不会调用公共事件
 * @default 0
 *
 * @param Script
 * @text 领取调用脚本
 * @type note
 * @desc 确认领取邮件后,会执行的脚本事件
 * @default ""
 *
 * @param ContainText
 * @text 邮件内文本
 * @type note[]
 * @desc 用于显示在邮件中的文本内容
 * @default ["\"Happy RPGMaker!\\n           -----流月\""]
 *
 *
 * @param DateTime
 * @text 日期名称
 * @type text
 * @desc 显示的日期文本内容,这个值如果不填写则不会显示,如果填写 'auto' 则会使用LiuYue_DataTime中的时间概念,请注意LiuYue_DataTime插件是否有安装
 * @default auto
 *
 *
 * @param DOfx
 * @text 日期名称偏移X
 * @type text
 * @desc 显示的日期名称在窗口上的偏移微调值,这可以是一个正负整数值
 * @default 3
 *
 * @param DOfy
 * @text 日期名称偏移Y
 * @type text
 * @desc 显示的日期名称在窗口上的偏移微调值,这可以是一个正负整数值
 * @default -3
 *
 *
 * @param RewardArr
 * @text 奖励内容
 * @type struct<Reward>[]
 * @desc 道具奖励
 * @default 
 * 
 */
 /* ----------------------------------------------------------------------------
 * Reward Parameter Structure
 * ---------------------------------------------------------------------------
 */
 /*~struct~Reward:
 *
 * @param Golds
 * @text 金币数
 * @type number
 * @desc 奖励的金币数,默认值为0
 * @default 0
 *
 * @param Items
 * @text 道具
 * @type struct<StructItem>[]
 * @desc 能获取的道具组
 * @default
 *
 * @param Weapons
 * @text 武器
 * @type struct<StructWeapon>[]
 * @desc 能获取的武器组
 * @default
 *
 * @param Armors
 * @text 护甲
 * @type struct<StructArmor>[]
 * @desc 能获取的护甲组
 * @default 
 *
 * 
 */ 
 /* ----------------------------------------------------------------------------
 * StructItem Parameter Structure
 * ---------------------------------------------------------------------------
 */ 
 /*~struct~StructItem:
 *
 * @param ItemType
 * @text 道具
 * @type item
 * @desc 奖励的道具类型
 * @default
 *
 * @param ItemNum
 * @text 道具数量
 * @type number
 * @desc 奖励的道具数量
 * @default 0
 *
 */
 /* ----------------------------------------------------------------------------
 * StructWeapon Parameter Structure
 * ---------------------------------------------------------------------------
 */  
 /*~struct~StructWeapon:
 *
 * @param WeaponType
 * @text 武器
 * @type weapon
 * @desc 奖励的武器类型
 * @default
 *
 * @param WeaponNum
 * @text 武器数量
 * @type number
 * @desc 奖励的武器数量
 * @default 0
 *
 */
 /* ----------------------------------------------------------------------------
 * StructArmor Parameter Structure
 * ---------------------------------------------------------------------------
 */ 
 /*~struct~StructArmor:
 *
 * @param ArmorType
 * @text 护甲
 * @type armor
 * @desc 奖励的护甲类型
 * @default
 *
 * @param ArmorNum
 * @text 护甲数量
 * @type number
 * @desc 奖励的护甲数量
 * @default 0
 *
 */
 

var LiuYue = LiuYue || {};
LiuYue.LiuYue_BuiltinMailbox = true;//插件启动

var Zzy = Zzy || {};
Zzy.BMF = Zzy.BMF || {};
Zzy.BMF.version = 1.05;  
Zzy.Parameters = PluginManager.parameters('LiuYue_BuiltinMailbox');
Zzy.Param = Zzy.Param || {};

//插件检测
setTimeout(function(){
if(!LiuYue.LiuYue_DateTime || Zzy.DTF.version < 1.00)
{
	console.log("提示:(来自LiuYue_BuiltinMailbox):未检测到相关功能插件(LiuYue_DateTime(日期与时间)),如果使用显示时间功能请确保插件安装");
}	
},1000)



Zzy.Param.BMFEnableMenu = eval(String(Zzy.Parameters['EnableMenu']));
Zzy.Param.BMFInsertMenu = eval(String(Zzy.Parameters['InsertMenu']));
Zzy.Param.BMFMenuCommandName = String(Zzy.Parameters['MenuCommandName']);

Zzy.Param.BMFBKPicture = String(Zzy.Parameters['BKPicture']);


Zzy.Param.BMFWin1X = String(Zzy.Parameters['Win1X']);
Zzy.Param.BMFWin1Y = String(Zzy.Parameters['Win1Y']);
Zzy.Param.BMFWin1W = String(Zzy.Parameters['Win1W']);
Zzy.Param.BMFWin1H = String(Zzy.Parameters['Win1H']);
Zzy.Param.BMFWin1List = parseInt(Zzy.Parameters['Win1List']);


Zzy.Param.BMFWin2X = String(Zzy.Parameters['Win2X']);
Zzy.Param.BMFWin2Y = String(Zzy.Parameters['Win2Y']);
Zzy.Param.BMFWin2W = String(Zzy.Parameters['Win2W']);
Zzy.Param.BMFWin2H = String(Zzy.Parameters['Win2H']);
Zzy.Param.BMFWin2List = parseInt(Zzy.Parameters['Win2List']);


Zzy.Param.BMFWin3X = String(Zzy.Parameters['Win3X']);
Zzy.Param.BMFWin3Y = String(Zzy.Parameters['Win3Y']);
Zzy.Param.BMFWin3W = String(Zzy.Parameters['Win3W']);
Zzy.Param.BMFWin3H = String(Zzy.Parameters['Win3H']);
Zzy.Param.BMFWin3Speed = parseInt(Zzy.Parameters['Win3Speed']);
Zzy.Param.BMFWin3ScrollYDis = parseInt(Zzy.Parameters['Win3ScrollYDis']);


Zzy.Param.BMFWin4X = String(Zzy.Parameters['Win4X']);
Zzy.Param.BMFWin4Y = String(Zzy.Parameters['Win4Y']);
Zzy.Param.BMFWin4W = String(Zzy.Parameters['Win4W']);
Zzy.Param.BMFWin4H = String(Zzy.Parameters['Win4H']);
Zzy.Param.BMFWin4Speed = parseInt(Zzy.Parameters['Win4Speed']);
Zzy.Param.BMFWin4NOkText = String(Zzy.Parameters['Win4NOkText']);
Zzy.Param.BMFWin4NCancelText = String(Zzy.Parameters['Win4NCancelText']);
Zzy.Param.BMFWin4OOkText = String(Zzy.Parameters['Win4OOkText']);
Zzy.Param.BMFWin4OCancelText = String(Zzy.Parameters['Win4OCancelText']);

Zzy.Param.BMFIsHavePrompt = eval(String(Zzy.Parameters['IsHavePrompt']));//是否有新邮件提示
Zzy.Param.BMFPromptPicture = String(Zzy.Parameters['PromptPicture']);//邮件提示图片
Zzy.Param.BMFNoPicPromptText = String(Zzy.Parameters['NoPicPromptText']);//无图片邮件提示文字
Zzy.Param.BMFPromptFadeFrame = parseInt(Zzy.Parameters['PromptFadeFrame']);//邮件提示出现速度
Zzy.Param.BMFPromptWaitFrame = parseInt(Zzy.Parameters['PromptWaitFrame']);//邮件提示等待速度
Zzy.Param.BMFPromptAnchorX = Number(Zzy.Parameters['PromptAnchorX'])
Zzy.Param.BMFPromptAnchorY = Number(Zzy.Parameters['PromptAnchorY'])
Zzy.Param.BMFPromptSpriteX = String(Zzy.Parameters['PromptSpriteX']);
Zzy.Param.BMFPromptSpriteY = String(Zzy.Parameters['PromptSpriteY']);

Zzy.Param.BMFNewMessage = String(Zzy.Parameters['NewMessage']);
Zzy.Param.BMFOldMessage = String(Zzy.Parameters['OldMessage']);

Zzy.Param.BMFIsShowNMCount = eval(String(Zzy.Parameters['IsShowNMCount']));
Zzy.Param.BMFIsShowOMCount = eval(String(Zzy.Parameters['IsShowOMCount']))

Zzy.Param.BMFNMCountFormat = String(Zzy.Parameters['NMCountFormat']);
Zzy.Param.BMFOMCountFormat = String(Zzy.Parameters['OMCountFormat']);

Zzy.Param.BMFIsRectFrame = eval(String(Zzy.Parameters['IsRectFrame']));
Zzy.Param.BMFRectFrameDis = parseInt(Zzy.Parameters['RectFrameDis']);
Zzy.Param.BMFRectFrameColor = String(Zzy.Parameters['RectFrameColor']);

Zzy.Param.BMFIsAutoShowReward = eval(String(Zzy.Parameters['IsAutoShowReward']));//自动打印
Zzy.Param.BMFCoinIcon = parseInt(Zzy.Parameters['CoinIcon']);//金币图标
Zzy.Param.BMFListNum = parseInt(Zzy.Parameters['ListNum']);//奖励横向并列
Zzy.Param.BMFCoinFormalu = String(Zzy.Parameters['CoinFormalu']);//金币格式
Zzy.Param.BMFExtraHeight = parseInt(Zzy.Parameters['ExtraHeight']);//预留高度




Zzy.Param.BMFIsSameOnly = eval(String(Zzy.Parameters['IsSameOnly']));//是否相同邮件只存在一封
Zzy.Param.BMFSameOnlyCommon = parseInt(Zzy.Parameters['SameOnlyCommon']);//无法获取时公共事件
Zzy.Param.BMFSameOnlyVar = parseInt(Zzy.Parameters['SameOnlyVar']);//无法获取时变量


//获取静态道具信息

Zzy.Param.BMFMailboxInfos = JSON.parse(Zzy.Parameters['MailboxInfos']);


Zzy.BMF.ClearComments = function(str) //清理特殊符号
{
  return str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1').trim();
};


Zzy.BMF.TranslateMailboxInfos = function()//解析
{
	var infos = [];
	var length = Zzy.Param.BMFMailboxInfos.length;
	for(var i=0;i<length;i++)
	{
		var info = {};//信息
		
		var data = JSON.parse(Zzy.Param.BMFMailboxInfos[i]);
		var name = data.TitleName;
		var comId = parseInt(data.ComId);//获取公共事件值
		var script = new Function(JSON.parse(data.Script));//获取脚本
		var dateTime = data.DateTime;	
		var textStr = JSON.parse(data.ContainText);
		var textArr = [];
		for(var j=0;j<textStr.length;j++)
		{textArr[j] = Zzy.BMF.ClearComments(JSON.parse(textStr[j]));}
		
		info.ID = i;//标记ID
		info.title = name;//题目
		info.comId = comId;//事件
		info.script = script;//脚本
		info.dateTime = dateTime;//日期
		
		info.textArr = textArr;//文本
		info.golds = [];//金币
		info.items = [];//道具
		info.weapons = [];//武器
		info.armors = [];//护甲
		
		info.tofx = parseInt(data.TOfx);//微调
		info.tofy = parseInt(data.TOfy);//
		info.dofx = parseInt(data.DOfx);//微调
		info.dofy = parseInt(data.DOfy);//
		
		var rewardStr = data.RewardArr ? JSON.parse(data.RewardArr) : [];
		var rLen = rewardStr.length;
		for(var j=0;j<rLen;j++)
		{
			var rData = JSON.parse(rewardStr[j]);
			var gold = parseInt(rData.Golds);//获取金币
			
			
			var itemStr = undefined;
			if(rData.Items === ''){itemStr = [];}
			else{itemStr = JSON.parse(rData.Items);}
			var iLen = itemStr.length;
			
			var weaponStr = undefined;
			if(rData.Weapons === ''){weaponStr = [];}
			else{weaponStr = JSON.parse(rData.Weapons);}
			var wLen = weaponStr.length;
			
			
			var armorStr = undefined;
			if(rData.Armors === ''){armorStr = [];}
			else{armorStr = JSON.parse(rData.Armors);}
			var aLen = armorStr.length;
			
			//获取道具信息
			for(var a=0;a<iLen;a++)
			{
				var iData = JSON.parse(itemStr[a]);
				var id = parseInt(iData.ItemType);
				var num = parseInt(iData.ItemNum);
				info.items.push({id:id,num:num});
			}
			
			for(var a=0;a<wLen;a++)
			{
				var wData = JSON.parse(weaponStr[a]);
				var id = parseInt(wData.WeaponType);
				var num = parseInt(wData.WeaponNum);
				info.weapons.push({id:id,num:num});
			}			
			
			for(var a=0;a<aLen;a++)
			{
				var aData = JSON.parse(armorStr[a]);
				var id = parseInt(aData.ArmorType);
				var num = parseInt(aData.ArmorNum);
				info.armors.push({id:id,num:num});
			}			
			info.golds.push(gold);//压入金币
		}
		infos.push(info);
	}
	return infos;
}
Zzy.Param.BMFMailboxInfos = Zzy.BMF.TranslateMailboxInfos();


//----------------------------------------------------声音----------------------------------------------------------

Zzy.BMF.MakeSE = function(seName,seVolume,sePitch,sePan)
{
	if(!seName)return undefined;
	var se = {
		name:seName,
		volume:(seVolume ? seVolume : 100),
		pitch:(sePitch ? sePitch : 100),
		pan:(sePan ? sePan : 0)
	};
	return se;
}


Zzy.Param.BMFReceiveSound = String(Zzy.Parameters['ReceiveSound']);//BMF音效
Zzy.Param.BMFReceiveVolume = parseInt(Zzy.Parameters['ReceiveVolume']);//BMF音量
Zzy.Param.BMFReceivePitch = parseInt(Zzy.Parameters['ReceivePitch']);//BMF音调
Zzy.Param.BMFReceivePan = parseInt(Zzy.Parameters['ReceivePan']);//BMF声道
Zzy.Param.BMFReceiveSE = Zzy.BMF.MakeSE(Zzy.Param.BMFReceiveSound,Zzy.Param.BMFReceiveVolume,Zzy.Param.BMFReceivePitch,Zzy.Param.BMFReceivePan);

Zzy.Param.BMFOpenMSound = String(Zzy.Parameters['OpenMSound']);//BMF音效
Zzy.Param.BMFOpenMVolume = parseInt(Zzy.Parameters['OpenMVolume']);//BMF音量
Zzy.Param.BMFOpenMPitch = parseInt(Zzy.Parameters['OpenMPitch']);//BMF音调
Zzy.Param.BMFOpenMPan = parseInt(Zzy.Parameters['OpenMPan']);//BMF声道
Zzy.Param.BMFOpenMSE = Zzy.BMF.MakeSE(Zzy.Param.BMFOpenMSound,Zzy.Param.BMFOpenMVolume,Zzy.Param.BMFOpenMPitch,Zzy.Param.BMFOpenMPan);

Zzy.Param.BMFCloseMSound = String(Zzy.Parameters['CloseMSound']);//BMF音效
Zzy.Param.BMFCloseMVolume = parseInt(Zzy.Parameters['CloseMVolume']);//BMF音量
Zzy.Param.BMFCloseMPitch = parseInt(Zzy.Parameters['CloseMPitch']);//BMF音调
Zzy.Param.BMFCloseMPan = parseInt(Zzy.Parameters['CloseMPan']);//BMF声道
Zzy.Param.BMFCloseMSE = Zzy.BMF.MakeSE(Zzy.Param.BMFCloseMSound,Zzy.Param.BMFCloseMVolume,Zzy.Param.BMFCloseMPitch,Zzy.Param.BMFCloseMPan);

Zzy.Param.BMFNewPromptSound = String(Zzy.Parameters['NewPromptSound']);//BMF音效
Zzy.Param.BMFNewPromptVolume = parseInt(Zzy.Parameters['NewPromptVolume']);//BMF音量
Zzy.Param.BMFNewPromptPitch = parseInt(Zzy.Parameters['NewPromptPitch']);//BMF音调
Zzy.Param.BMFNewPromptPan = parseInt(Zzy.Parameters['NewPromptPan']);//BMF声道
Zzy.Param.BMFNewPromptSE = Zzy.BMF.MakeSE(Zzy.Param.BMFNewPromptSound,Zzy.Param.BMFNewPromptVolume,Zzy.Param.BMFNewPromptPitch,Zzy.Param.BMFNewPromptPan);

 
 
Zzy.Param.BMFAllSE = [];
Zzy.Param.BMFAllSE = [undefined,
Zzy.Param.BMFReceiveSE,//领取音效
Zzy.Param.BMFOpenMSE,//打开邮件
Zzy.Param.BMFCloseMSE,//关闭邮件
Zzy.Param.BMFNewPromptSE//新邮件提示
];





//==================================================================
//Game_System
//==================================================================

Zzy.BMF.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() 
{
    Zzy.BMF.Game_System_initialize.call(this);
	this.ZzyBMFInitData();//初始化数据
};

Game_System.prototype.ZzyBMFInitData = function()
{
	this._ZzyBMFEnableMenu = Zzy.Param.BMFEnableMenu;
	this._ZzyBMFInsertMenu = Zzy.Param.BMFInsertMenu;
	this._ZzyBMFMenuText = Zzy.Param.BMFMenuCommandName;
	
	this._ZzyBMFBKPicture = Zzy.Param.BMFBKPicture;

	this._ZzyBMFIsHavePrompt = Zzy.Param.BMFIsHavePrompt;
	this._ZzyBMFPromptPicture = Zzy.Param.BMFPromptPicture;
	this._ZzyBMFNoPicPromptText = Zzy.Param.BMFNoPicPromptText;
	this._ZzyBMFPromptFadeFrame = Zzy.Param.BMFPromptFadeFrame;
	this._ZzyBMFPromptWaitFrame = Zzy.Param.BMFPromptWaitFrame;


	this._ZzyBMFRecordArr = [];
	this._ZzyBMFNewIDArr = [];//记录新邮件
	this._ZzyBMFOldIDArr = [];//记录旧邮件
	this._ZzyBMFNewDTArr = [];
	this._ZzyBMFOldDTArr = [];
	
	//事件堆积和脚本
	this._ZzyBMFComList = [];//执行队列
	this._ZzyBMFComListIndex = 0;//执行下标	
	this._ZzyBMFScriptList = [];//脚本队列

	//控制图片的变化
	this._ZzyBMFPPIsOpen = false;
	this._ZzyBMFPPIsWait = false;
	this._ZzyBMFPPIsClose = false;
	this._ZzyBMFPPCFrame = 0;//标记
	this._ZzyBMFPWCFrame = 0;
	
}

Game_System.prototype.GetZzyBMFEnableMenu = function()
{
	if(this._ZzyBMFEnableMenu === undefined)
	{this._ZzyBMFEnableMenu = Zzy.Param.BMFEnableMenu;}
	return this._ZzyBMFEnableMenu;
}

Game_System.prototype.SetZzyBMFEnableMenu = function(value)
{
	this._ZzyBMFEnableMenu = value;
}

Game_System.prototype.GetZzyBMFInsertMenu = function()
{
	if(this._ZzyBMFInsertMenu === undefined)
	{this._ZzyBMFInsertMenu = Zzy.Param.BMFInsertMenu;}
	return this._ZzyBMFInsertMenu;
}

Game_System.prototype.SetZzyBMFInsertMenu = function(value)
{
	this._ZzyBMFInsertMenu = value;
}


Game_System.prototype.GetZzyBMFMenuText = function()
{
	if(this._ZzyBMFMenuText === undefined)
	{this._ZzyBMFMenuText = Zzy.Param.BMFMenuCommandName;}
	return this._ZzyBMFMenuText;
}



Game_System.prototype.SetZzyBMFMenuText = function(value)
{
	this._ZzyBMFMenuText = value;
}

Game_System.prototype.GetZzyBMFBKPicture = function()
{
	if(this._ZzyBMFBKPicture === undefined)
	{this._ZzyBMFBKPicture = Zzy.Param.BMFBKPicture;}
	return this._ZzyBMFBKPicture;
}

Game_System.prototype.SetZzyBMFBKPicture = function(value)
{
	this._ZzyBMFBKPicture = value;
}


Game_System.prototype.GetZzyBMFIsHavePrompt = function()
{
	if(this._ZzyBMFIsHavePrompt === undefined)
	{this._ZzyBMFIsHavePrompt = Zzy.Param.BMFIsHavePrompt;}
	return this._ZzyBMFIsHavePrompt;
}

Game_System.prototype.SetZzyBMFIsHavePrompt = function(value)
{
	this._ZzyBMFIsHavePrompt = value;
}


Game_System.prototype.GetZzyBMFPromptPicture = function()
{
	if(this._ZzyBMFPromptPicture === undefined)
	{this._ZzyBMFPromptPicture = Zzy.Param.BMFPromptPicture;}
	return this._ZzyBMFPromptPicture;
}

Game_System.prototype.SetZzyBMFPromptPicture = function(value)
{
	this._ZzyBMFPromptPicture = value;
}

Game_System.prototype.GetZzyBMFNoPicPromptText = function()
{
	if(this._ZzyBMFNoPicPromptText === undefined)
	{this._ZzyBMFNoPicPromptText = Zzy.Param.BMFNoPicPromptText;}
	return this._ZzyBMFNoPicPromptText;
}

Game_System.prototype.SetZzyBMFNoPicPromptText = function(value)
{
	this._ZzyBMFNoPicPromptText = value;
}

Game_System.prototype.GetZzyBMFPromptFadeFrame = function()
{
	if(this._ZzyBMFPromptFadeFrame === undefined)
	{this._ZzyBMFPromptFadeFrame = Zzy.Param.BMFPromptFadeFrame;}
	return this._ZzyBMFPromptFadeFrame;
}

Game_System.prototype.SetZzyBMFPromptFadeFrame = function(value)
{
	this._ZzyBMFPromptFadeFrame = value;
}


Game_System.prototype.GetZzyBMFPromptWaitFrame = function()
{
	if(this._ZzyBMFPromptWaitFrame === undefined)
	{this._ZzyBMFPromptWaitFrame = Zzy.Param.BMFPromptWaitFrame;}
	return this._ZzyBMFPromptWaitFrame;
}

Game_System.prototype.SetZzyBMFPromptWaitFrame = function(value)
{
	this._ZzyBMFPromptWaitFrame = value;
}


Game_System.prototype.GetZzyBMFRecordArr = function()
{
	if(this._ZzyBMFRecordArr === undefined)
	{this._ZzyBMFRecordArr = [];}
	return this._ZzyBMFRecordArr;
}


Game_System.prototype.GetZzyBMFNewIDArr = function()
{
	if(this._ZzyBMFNewIDArr === undefined)
	{this._ZzyBMFNewIDArr = [];}
	return this._ZzyBMFNewIDArr;
}

Game_System.prototype.GetZzyBMFOldIDArr = function()
{
	if(this._ZzyBMFOldIDArr === undefined)
	{this._ZzyBMFOldIDArr = [];}
	return this._ZzyBMFOldIDArr;
}


Game_System.prototype.GetZzyBMFNewDTArr = function()
{
	if(this._ZzyBMFNewDTArr === undefined)
	{this._ZzyBMFNewDTArr = [];}
	return this._ZzyBMFNewDTArr;
}

Game_System.prototype.GetZzyBMFOldDTArr = function()
{
	if(this._ZzyBMFOldDTArr === undefined)
	{this._ZzyBMFOldDTArr = [];}
	return this._ZzyBMFOldDTArr;
}

Game_System.prototype.GetZzyBMFComList = function()
{
	if(this._ZzyBMFComList === undefined)
	{this._ZzyBMFComList = [];}
	return this._ZzyBMFComList;
}

Game_System.prototype.GetZzyBMFComListIndex = function()
{
	if(this._ZzyBMFComListIndex === undefined)
	{this._ZzyBMFComListIndex = 0;}
	return this._ZzyBMFComListIndex;
}


Game_System.prototype.SetZzyBMFComListIndex = function(value)
{
	this._ZzyBMFComListIndex = value;
}

Game_System.prototype.GetZzyBMFScriptList = function()
{
	if(this._ZzyBMFScriptList === undefined)
	{this._ZzyBMFScriptList = 0;}
	return this._ZzyBMFScriptList;
}

Game_System.prototype.GetZzyBMFPPIsOpen = function()
{
	if(this._ZzyBMFPPIsOpen === undefined)
	{this._ZzyBMFPPIsOpen = false;}
	return this._ZzyBMFPPIsOpen;
}

Game_System.prototype.SetZzyBMFPPIsOpen = function(enable)
{
	this._ZzyBMFPPIsOpen = enable;
}


Game_System.prototype.GetZzyBMFPPIsWait = function()
{
	if(this._ZzyBMFPPIsWait === undefined)
	{this._ZzyBMFPPIsWait = false;}
	return this._ZzyBMFPPIsWait;
}

Game_System.prototype.SetZzyBMFPPIsWait = function(enable)
{
	this._ZzyBMFPPIsWait = enable;
}

Game_System.prototype.GetZzyBMFPPIsClose = function()
{
	if(this._ZzyBMFPPIsClose === undefined)
	{this._ZzyBMFPPIsClose = false;}
	return this._ZzyBMFPPIsClose;
}

Game_System.prototype.SetZzyBMFPPIsClose = function(enable)
{
	this._ZzyBMFPPIsClose = enable;
}

Game_System.prototype.GetZzyBMFPPCFrame = function()
{
	if(this._ZzyBMFPPCFrame === undefined)
	{this._ZzyBMFPPCFrame = 0;}
	return this._ZzyBMFPPCFrame;
}

Game_System.prototype.SetZzyBMFPPCFrame = function(value)
{
	this._ZzyBMFPPCFrame = value;
}


Game_System.prototype.GetZzyBMFPWCFrame = function()
{
	if(this._ZzyBMFPWCFrame === undefined)
	{this._ZzyBMFPWCFrame = 0;}
	return this._ZzyBMFPWCFrame;
}

Game_System.prototype.SetZzyBMFPWCFrame = function(value)
{
	this._ZzyBMFPWCFrame = value;
}








Game_System.prototype.PushZzyBMFComList = function(comId)
{
	this.GetZzyBMFComList().push(comId);
}

Game_System.prototype.PushZzyBMFScriptList = function(script)
{
	this.GetZzyBMFScriptList().push(script);
}

Game_System.prototype.EarnZzyBMFComListIndex = function()
{
	var tList = this.GetZzyBMFComList();
	var tIndex = this.GetZzyBMFComListIndex();
	
	if(tList.length === 0)return undefined;
	
	var ID = tList[tIndex];
	this._ZzyBMFComListIndex++;
	
	if(this._ZzyBMFComListIndex >= tList.length)
	{
		this._ZzyBMFComList = [];//执行队列
		this._ZzyBMFComListIndex = 0;//执行下标		
	}
	return ID;
}

Game_System.prototype.getZzyBMFValidNIDArr = function()
{
	this._ZzyBMFNewIDArr = Zzy.BMF.ExcludeUndefine(this.GetZzyBMFNewIDArr());
	this._ZzyBMFNewDTArr = Zzy.BMF.ExcludeUndefine(this.GetZzyBMFNewDTArr());
	return this._ZzyBMFNewIDArr;
}

Game_System.prototype.getZzyBMFValidNew = function()
{
	var arr = this.getZzyBMFValidNIDArr();
	var arr2 = [];

	for(var i=0;i<arr.length;i++)
	{
		arr2.push(this.getZzyBMFNArrOfId(arr[i]));
	}
	return arr2;
}

Game_System.prototype.getZzyBMFValidOld = function()
{
	var arr = this.getZzyBMFValidOIDArr();
	var arr2 = [];
	for(var i=0;i<arr.length;i++)
	{
		arr2.push(this.getZzyBMFOArrOfId(arr[i]));
	}
	return arr2;
}

Game_System.prototype.getZzyBMFValidOIDArr = function()
{
	this._ZzyBMFOldIDArr = Zzy.BMF.ExcludeUndefine(this.GetZzyBMFOldIDArr());
	this._ZzyBMFOldDTArr = Zzy.BMF.ExcludeUndefine(this.GetZzyBMFOldDTArr());
	return this._ZzyBMFOldIDArr;
}

Game_System.prototype.SendZzyBMFMailbox = function(ID)
{
	//判断时间
	var dateTimeStr = this.GetZzyBMFDateTime(ID);

	this.GetZzyBMFNewDTArr().push(dateTimeStr);
	this.GetZzyBMFNewIDArr().push(ID);
	
	var rArr = this.GetZzyBMFRecordArr();
	Zzy.BMF.SinglePush(rArr,ID);//压入ID
	
}



Game_System.prototype.GetZzyBMFDateTime = function(ID)
{
	//检测是否具有
	if(LiuYue.LiuYue_DateTime)
	{
		if(Zzy.Param.BMFMailboxInfos[ID].dateTime === 'auto')
		{
			return $gameSystem.getZzyDTFDateText();
		}
		return Zzy.Param.BMFMailboxInfos[ID].dateTime;		
	}
	
	var time = this.playtimeText();
	return time;

}


Game_System.prototype.getZzyBMFNArrOfId = function(ID)
{
	return Zzy.Param.BMFMailboxInfos[ID] ? Zzy.Param.BMFMailboxInfos[ID] : undefined;
}

Game_System.prototype.getZzyBMFOArrOfId = function(ID)
{
	return Zzy.Param.BMFMailboxInfos[ID] ? Zzy.Param.BMFMailboxInfos[ID] : undefined;
}

Game_System.prototype.getZzyBMFNMCount = function()
{
	return this.getZzyBMFValidNIDArr().length;
}

Game_System.prototype.getZzyBMFOMCount = function()
{
	return this.getZzyBMFValidOIDArr().length;
}

Game_System.prototype.GainZzyBMFRwardOfID = function(rwardID)
{
	//奖励
	var rwardInfo = Zzy.Param.BMFMailboxInfos[rwardID];
	var goldArr = rwardInfo.golds;
	var itemArr = rwardInfo.items;
	var weaponArr = rwardInfo.weapons;
	var armorArr = rwardInfo.armors;
	
	//金币
	for(var i=0;i<goldArr.length;i++)
	{
		$gameParty.gainGold(goldArr[i]);
	}
	
	for(var i=0;i<itemArr.length;i++)
	{
		var tItem = $dataItems[itemArr[i].id];
		var tNum = itemArr[i].num;
		$gameParty.gainItem(tItem,tNum);
	}
	
	for(var i=0;i<weaponArr.length;i++)
	{
		var tItem = $dataWeapons[weaponArr[i].id];
		var tNum = weaponArr[i].num;
		$gameParty.gainItem(tItem,tNum);
	}

	for(var i=0;i<armorArr.length;i++)
	{
		var tItem = $dataArmors[armorArr[i].id];
		var tNum = armorArr[i].num;
		$gameParty.gainItem(tItem,tNum);
	}
	
	
	
	//压入脚本和公共事件
	
	if(rwardInfo.comId){this.PushZzyBMFComList(rwardInfo.comId);}//压入公共事件
	if(rwardInfo.script){this.PushZzyBMFScriptList(rwardInfo.script);}//压入脚本

	
} 		

Game_System.prototype.ChangeZzyBMFNewToOld = function(index)
{
	var nArr = this.GetZzyBMFNewIDArr();
	
	var ID = nArr[index];
	this.GetZzyBMFOldIDArr().push(ID);
	nArr[index] = undefined;
	//刷新
	
	var nArr = this.GetZzyBMFNewDTArr();
	var dateText = nArr[index];
	this.GetZzyBMFOldDTArr().push(dateText);
	nArr[index] = undefined;
	
	this.getZzyBMFValidNIDArr();
	this.getZzyBMFValidOIDArr();
}



//==================================================================
//Game_Interpreter
//==================================================================

Zzy.BMF.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args)//插件命令
{
	Zzy.BMF.Game_Interpreter_pluginCommand.call(this,command,args);

	if(command === 'ZzyBMF')
	{
		this.ZzyBMFCommand(args);
	}
	

}

Game_Interpreter.prototype.ZzyBMFCommand = function(args)
{
	var command = String(args[0]);
	
	switch(command)
	{
		case 'EnableMenu':
		var enable = eval(String(args[1]));
		Zzy.BMF.EnableMenu(enable);
		
		//$gameSystem.SetZzyBMFEnableMenu(enable);
		break;
		
		case 'InsertMenu':
		var enable = eval(String(args[1]));
		Zzy.BMF.EnableMenu(enable);
		
		//$gameSystem.SetZzyBMFInsertMenu(enable);
		break;	
		
		case 'MenuText':
		var text = eval(String(args[1]));
		Zzy.BMF.MenuText(text);
		
		//$gameSystem.SetZzyBMFMenuText(text);
		break;	

		case 'BKPicture':
		var picName = String(args[1]);
		Zzy.BMF.BKPicture(picName);
		
		//$gameSystem.SetZzyBMFBKPicture(picName);
		break;
		
		case 'Send':
		var idArrStr = String(args[1]);
		Zzy.BMF.Send(idArrStr);
		
		// var idArr = Zzy.BMF.StringToIntArr(String(args[1]));
		// for(var i=0;i<idArr.length;i++)
		// {
			// var ID = idArr[i];
			// Zzy.BMF.Send(ID);
		// }
		break;
		
		case 'Open':
		Zzy.BMF.Open();
		
		//Zzy.BMF.OpenMailbox();//打开邮箱
		break;
		
		case 'IsHavePrompt':
		var isEnable = eval(String(args[1]));
		Zzy.BMF.IsHavePrompt(isEnable);
		
		//$gameSystem.SetZzyBMFIsHavePrompt(isEnable);
		break;
		
		case 'PromptPicture':
		var picStr = String(args[1]);
		Zzy.BMF.PromptPicture(picStr);
		
		// $gameSystem.SetZzyBMFPromptPicture(picStr);		
		// if(SceneManager._scene instanceof Scene_Map)
		// {
			// if($gameSystem.GetZzyBMFIsHavePrompt())
			// {
				// var pointer = SceneManager._scene;
				// pointer._ZzyBMFSprite.ReLoadPic();//刷新
				
			// }
		// }		
		break;
		
		case 'NoPicPromptText':
		var str = String(args[1]);
		Zzy.BMF.NoPicPromptText(str);
		
		// $gameSystem.SetZzyBMFNoPicPromptText(str);		
		// if(SceneManager._scene instanceof Scene_Map)
		// {
			// if($gameSystem.GetZzyBMFIsHavePrompt())
			// {
				// var pointer = SceneManager._scene;
				// pointer._ZzyBMFSprite.ReLoadPic();//刷新
				
			// }
		// }		
		break;		
		
		case 'PromptFadeFrame':
		var fFrame = parseInt(args[1]);
		Zzy.BMF.PromptFadeFrame(fFrame);
		
		//$gameSystem.SetZzyBMFPromptFadeFrame(fFrame);
		break;
		
		case 'PromptWaitFrame':
		var fFrame = parseInt(args[1]);
		Zzy.BMF.PromptWaitFrame(fFrame);
		
		//$gameSystem.SetZzyBMFPromptWaitFrame(fFrame);
		break;
		
	}
}




//=================================================================
//Window_MenuCommand
//=================================================================
Zzy.BMF.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() 
{
	Zzy.BMF.Window_MenuCommand_addOriginalCommands.call(this);
	
	var isEnable = $gameSystem.GetZzyBMFEnableMenu();
	var isInsert = $gameSystem.GetZzyBMFInsertMenu();
	if(isInsert)
	{
	
		this.addCommand($gameSystem.GetZzyBMFMenuText(), 'ZzyBMFMB', isEnable);
	}
};



//=================================================================
//Scene_Menu
//=================================================================

Zzy.BMF.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function()
{
	Zzy.BMF.Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('ZzyBMFMB', this.OpenZzyBMFBM.bind(this));

};

Scene_Menu.prototype.OpenZzyBMFBM = function()//打开邮箱场景
{
	Zzy.BMF.OpenMailbox();//打开邮箱
}



//=================================================================
//Scene_Map
//=================================================================

Zzy.BMF.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() 
{
	Zzy.BMF.Scene_Map_start.call(this);
	this.CreateZzyBMFSprite();
};

Scene_Map.prototype.CreateZzyBMFSprite = function()
{
	this._ZzyBMFSprite = new Sprite_ZzyBMFPrompt();
	this.addChild(this._ZzyBMFSprite);
}





Zzy.BMF.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function()
{
	Zzy.BMF.Scene_Map_update.call(this);
	this.updateZzyBMFComList()//更新队列
	this.updateZzyBMFScrList();//更新脚本
}

Scene_Map.prototype.updateZzyBMFScrList = function()//更新脚本
{
	var tList = $gameSystem.GetZzyBMFScriptList();
	
	if(tList.length > 0)
	{
		for(var i=0;i<tList.length;i++)
		{
			tList[i]();//执行脚本
		}
		$gameSystem._ZzyBMFScriptList = [];
	}
}

Scene_Map.prototype.updateZzyBMFComList = function()
{
	if($gameTemp.isCommonEventReserved())return;
	var comId = $gameSystem.EarnZzyBMFComListIndex();//获取下标
	if(comId === undefined)return;
	$gameTemp.reserveCommonEvent(comId);//压入
}

//=================================================================
//Scene_ZzyBMF
//=================================================================

function Scene_ZzyBMF() {
    this.initialize.apply(this, arguments);
}

Scene_ZzyBMF.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ZzyBMF.prototype.constructor = Scene_ZzyBMF;

Scene_ZzyBMF.prototype.initialize = function() 
{
    Scene_MenuBase.prototype.initialize.call(this);
	this._selectIndex = -1;
	
	this._stage = 'type';
	
	this.collWindowIndex = 0;
};


Scene_ZzyBMF.prototype.create = function()
{
	Scene_MenuBase.prototype.create.call(this);
	this.CreatChildWindow();//创建窗口
	this.InitChildWindow();//初始化选择
	
}



Scene_ZzyBMF.prototype.InitChildWindow = function()
{
	this._mailboxTypeWidnow.select(0);
	this._mailboxTypeWidnow.activate();
}


Scene_ZzyBMF.prototype.update = function()
{
	Scene_MenuBase.prototype.update.call(this);
	
	this.updateSelectIndex();
}

Scene_ZzyBMF.prototype.updateSelectIndex = function()//更新选择下标
{
	if(this._mailboxTypeWidnow.index() < 0)return;
	if(this._selectIndex !== this._mailboxTypeWidnow.index())
	{
		this._selectIndex = this._mailboxTypeWidnow.index();
		//需要刷新界面
		this._mailboxCollWidnow.setTypeID(this._selectIndex+1);
		this.collWindowIndex = 0;//将临时下标记录清除
	}
}

Scene_ZzyBMF.prototype.MailboxTypeIndex = function()
{return this._mailboxTypeWidnow.index();}

Scene_ZzyBMF.prototype.MailboxCollIndex = function()
{return this._mailboxCollWidnow.index();}

Scene_ZzyBMF.prototype.MailboxPieceIndex = function()
{return this._mailboxPieceWindow.index();}

Scene_ZzyBMF.prototype.MailboxConfIndex = function()
{return this._mailboxConfWidnow.index();}



Scene_ZzyBMF.prototype.CreatChildWindow = function()
{
	this._mailboxTypeWidnow = new Window_ZzyBMFMailboxType(this);
	this._mailboxCollWidnow = new Window_ZzyBMFMailboxColl(this);
	this._mailboxPieceWindow = new Window_ZzyBMFMailboxPiece(this);
	this._mailboxConfWidnow = new Window_ZzyBMFMailboxConf(this);
	
	
	this.addChild(this._mailboxTypeWidnow);
	this.addChild(this._mailboxCollWidnow);
	this.addChild(this._mailboxPieceWindow);
	this.addChild(this._mailboxConfWidnow);
	
	//绑定
	this._mailboxTypeWidnow.setHandler('ok', this.OnTypeWidnowOk.bind(this));
	this._mailboxTypeWidnow.setHandler('cancel',this.OnTypeWidnowCancel.bind(this));
	
	this._mailboxCollWidnow.setHandler('ok', this.OnTypeWidnowOk.bind(this));
	this._mailboxCollWidnow.setHandler('cancel',this.OnTypeWidnowCancel.bind(this));
	
	this._mailboxConfWidnow.setHandler('ok', this.OnTypeWidnowOk.bind(this));
	this._mailboxConfWidnow.setHandler('cancel',this.OnTypeWidnowCancel.bind(this));
}


Scene_ZzyBMF.prototype.OnTypeWidnowOk = function()
{
	//按下确定后
	switch(this._stage)
	{
		case 'type'://选择类型时
		this.WidnowOkOfType();
		break;
		
		case 'coll'://隐藏窗口
		this.WidnowOkOfColl();
		break;
		
		case 'conf':
		this.WidnowOkOfConf();
		break;
	}
}

Scene_ZzyBMF.prototype.WidnowOkOfConf = function()
{
	
	switch(this.MailboxConfIndex())
	{
		case 0:
		switch(this.MailboxTypeIndex())
		{
			case 0://领取内容 给予奖励
				var rwardID = this._mailboxCollWidnow.GetMailboxID();//获取到奖励ID值
				$gameSystem.GainZzyBMFRwardOfID(rwardID);//基于奖励
				$gameSystem.ChangeZzyBMFNewToOld(this.MailboxCollIndex());//添加到旧
				this.collWindowIndex = 0;
				this._mailboxCollWidnow.select(this.collWindowIndex);	
			case 1://直接返回
			break;
		}		
		break;
		
		case 1:
		
		break;
	}

	this.WidnowCancelOfConf();
	
}

Scene_ZzyBMF.prototype.WidnowOkOfType = function()//切换到邮箱选择
{
	this._stage = 'coll';
	this._mailboxCollWidnow.activate();
	this._mailboxCollWidnow.select(this.collWindowIndex);	
}


Scene_ZzyBMF.prototype.WidnowOkOfColl = function()//确认-进入邮件
{
	this._stage = 'conf';//切换模式

	//判断窗口是否有效
		this._mailboxTypeWidnow.hide();
		this._mailboxCollWidnow.hide();
		this._mailboxPieceWindow.reopen();
		this._mailboxConfWidnow.reopen();
		
		this._mailboxConfWidnow.refreshData();
		this._mailboxPieceWindow.refreshData();
		this._mailboxConfWidnow.activate();
		this._mailboxConfWidnow.select(0);		
}


Scene_ZzyBMF.prototype.OnTypeWidnowCancel = function()
{
	//按下确定后
	switch(this._stage)
	{
		case 'type'://选择类型时
		this.WidnowCancelOfType();
		break;
		
		case 'coll':
		this.WidnowCancelOfColl();
		break;
		
		case 'conf':
		this.WidnowCancelOfConf();
		break;
	}
}

Scene_ZzyBMF.prototype.WidnowCancelOfType = function()//退出场景
{
	this.popScene();
}

Scene_ZzyBMF.prototype.WidnowCancelOfColl = function()//从邮箱返回到选择
{
	this._stage = 'type';
	this.collWindowIndex = this._mailboxCollWidnow.index();
	this._mailboxTypeWidnow.activate();
	this._mailboxCollWidnow.deselect();	
}

Scene_ZzyBMF.prototype.WidnowCancelOfConf = function()
{
	//返回上一个界面
	this._stage = 'coll';//切换模式
	
	this._mailboxPieceWindow.close();
	this._mailboxConfWidnow.close();
	this._mailboxTypeWidnow.show();
	this._mailboxCollWidnow.show();	
	
	this._mailboxTypeWidnow.refreshData();
	this._mailboxCollWidnow.refreshData();	
	this._mailboxCollWidnow.activate();

}



Scene_ZzyBMF.prototype.createBackground = function() 
{
    this._backgroundSprite = new Sprite();
	
	var name = $gameSystem.GetZzyBMFBKPicture();
	
	if(!name || name === '')
	{this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();}
    else
	{this._backgroundSprite.bitmap = ImageManager.loadPicture(name);}

    this.addChild(this._backgroundSprite);
};

//==================================================================
//Window_ZzyBMFMailboxType
//==================================================================

function Window_ZzyBMFMailboxType() 
{
    this.initialize.apply(this, arguments);
}

Window_ZzyBMFMailboxType.prototype = Object.create(Window_Selectable.prototype);
Window_ZzyBMFMailboxType.prototype.constructor = Window_ZzyBMFMailboxType;

Window_ZzyBMFMailboxType.prototype.initialize = function(pointer)
{
	//初始化位置
	var x = eval(Zzy.Param.BMFWin1X);
	var y = eval(Zzy.Param.BMFWin1Y);
	var w = eval(Zzy.Param.BMFWin1W);
	var h = eval(Zzy.Param.BMFWin1H);
	
    Window_Selectable.prototype.initialize.call(this, x, y, w, h);
	this.pointer = pointer;
	this._list = [];//存放名称
	
	this.refreshData();
	
};

Window_ZzyBMFMailboxType.prototype.refresh = function()
{
	this.refresgContents();
}

Window_ZzyBMFMailboxType.prototype.refreshData = function()
{
	//组合文本
	this._list = [];
	this._list.push(this.MakeNMName());
	this._list.push(this.MakeOMName());	
	
	this.refresh();
}

Window_ZzyBMFMailboxType.prototype.refresgContents = function()
{
	if (this.contents) 
	{
        this.contents.clear();
        this.drawAllItems();
    }
}

Window_ZzyBMFMailboxType.prototype.MakeNMName = function()
{
	if(Zzy.Param.BMFIsShowNMCount)
	{
		var str = Zzy.Param.BMFNMCountFormat;
		return Zzy.Param.BMFNewMessage + str.format($gameSystem.getZzyBMFNMCount());	
	}
	else
	{
		return Zzy.Param.BMFNewMessage;
	}
}

Window_ZzyBMFMailboxType.prototype.MakeOMName = function()
{
	if(Zzy.Param.BMFIsShowOMCount)
	{
		var str = Zzy.Param.BMFOMCountFormat;
		return Zzy.Param.BMFOldMessage + str.format($gameSystem.getZzyBMFOMCount());	
	}
	else
	{
		return Zzy.Param.BMFOldMessage;
	}
}

Window_ZzyBMFMailboxType.prototype.drawAllItems = function() 
{
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) 
	{
        var index = topIndex + i;
        if (index < this.maxItems()) 
		{
            this.drawItem(index);
        }
    }
};

Window_ZzyBMFMailboxType.prototype.maxItems = function() 
{
    return this._list ? this._list.length : 0;
};

Window_ZzyBMFMailboxType.prototype.drawItem = function(index) 
{
	var rect = this.itemRectForText(index);
	var align = this.itemTextAlign();


	var centerY = this.GetCenterY(rect);//返回中心绘制

	//this.changeTextColor(this.getColor(index));
	this.drawRectFrame(rect);
	
	this.resetTextColor();
	this.drawText(this.itemName(index), rect.x, centerY, rect.width, align);
	
	//this.contents.fillRect(rect.x+3,rect.y+3,rect.width-6,rect.height-6,'#ff6666');

};

Window_ZzyBMFMailboxType.prototype.drawRectFrame = function(rect)
{
	if(!Zzy.Param.BMFIsRectFrame)return;
	var nRect = {
		x:rect.x + Zzy.Param.BMFRectFrameDis,
		y:rect.y + Zzy.Param.BMFRectFrameDis,
		width:rect.width - Zzy.Param.BMFRectFrameDis*2,
		height:rect.height - Zzy.Param.BMFRectFrameDis*2,
	};
	
	this.contents.fillRect(nRect.x,nRect.y,nRect.width,nRect.height,Zzy.Param.BMFRectFrameColor);
	
}


Window_ZzyBMFMailboxType.prototype.GetCenterY = function(rect)
{
	
	var tempY = rect.y + rect.height/2 - this.contents.fontSize/2;

	return tempY;
}

Window_ZzyBMFMailboxType.prototype.itemName = function(index)
{
	return this._list[index] ? this._list[index] : '';
}

Window_ZzyBMFMailboxType.prototype.itemTextAlign = function() 
{
    return 'center';
};

Window_ZzyBMFMailboxType.prototype.maxVisibleItems = function() //数量
{
    return Zzy.Param.BMFWin1List;
};

Window_ZzyBMFMailboxType.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};

Window_ZzyBMFMailboxType.prototype.isCurrentItemEnabled = function()
{
	return this._list[this.index()] ? true : false;
}



//==================================================================
//Window_ZzyBMFMailboxColl
//==================================================================

function Window_ZzyBMFMailboxColl() 
{
    this.initialize.apply(this, arguments);
}

Window_ZzyBMFMailboxColl.prototype = Object.create(Window_Selectable.prototype);
Window_ZzyBMFMailboxColl.prototype.constructor = Window_ZzyBMFMailboxColl;

Window_ZzyBMFMailboxColl.prototype.initialize = function(pointer)
{
	//初始化位置
	var x = eval(Zzy.Param.BMFWin2X);
	var y = eval(Zzy.Param.BMFWin2Y);
	var w = eval(Zzy.Param.BMFWin2W);
	var h = eval(Zzy.Param.BMFWin2H);
	
    Window_Selectable.prototype.initialize.call(this, x, y, w, h);
	this.pointer = pointer;
	this._TypeID = 0;//显示类型
	this._list = [];//数据信息
	
	this.refreshData();
}

Window_ZzyBMFMailboxColl.prototype.setTypeID = function(ID)
{
	this._TypeID = ID;
	this.refreshData();
}

Window_ZzyBMFMailboxColl.prototype.refresh = function()
{
	this.refresgContents();
}

Window_ZzyBMFMailboxColl.prototype.refreshData = function()//刷新信息列表
{
	this._list = [];

	//添加信息
	var mailArr = [];
	var timeArr = [];
	switch(this._TypeID)
	{
		case 1:
			mailArr = $gameSystem.getZzyBMFValidNew();
			timeArr = $gameSystem.GetZzyBMFNewDTArr();
		break;
		
		case 2:
			mailArr = $gameSystem.getZzyBMFValidOld();
			timeArr = $gameSystem.GetZzyBMFOldDTArr();
		break;
	}

	for(var i=0;i<mailArr.length;i++)
	{
		var info = {};
		
		info.ID = mailArr[i].ID;
		info.themeText = mailArr[i].title;
		//info.dateText = mailArr[i].dateTime === 'auto' ? $gameSystem.getZzyDTFDateText() : mailArr[i].dateTime;
		info.dateText = timeArr[i];
		info.tofx = mailArr[i].tofx;
		info.tofy = mailArr[i].tofy;
		info.dofx = mailArr[i].dofx;
		info.dofy = mailArr[i].dofy;
		this._list.push(info);
	}

	
	this.refresh();
}

Window_ZzyBMFMailboxColl.prototype.refresgContents = function()
{
	if (this.contents) 
	{
        this.contents.clear();
        this.drawAllItems();
    }	
}

Window_ZzyBMFMailboxColl.prototype.drawAllItems = function() 
{
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) 
	{
        var index = topIndex + i;
        if (index < this.maxItems()) 
		{
            this.drawItem(index);
        }
    }
};

Window_ZzyBMFMailboxColl.prototype.maxItems = function() 
{
    return this._list ? this._list.length : 0;
};


Window_ZzyBMFMailboxColl.prototype.drawItem = function(index) 
{
	var rect = this.itemRectForText(index);
	
	this.drawRectFrame(rect);
	this.resetTextColor();
	
	//this.contents.fillRect(rect.x+3,rect.y+3,rect.width-6,rect.height-6,'rgba(255,0,0,0.5)');
	this.drawInfomation(index,rect);//绘制日期
};

Window_ZzyBMFMailboxColl.prototype.drawRectFrame = function(rect)
{
	if(!Zzy.Param.BMFIsRectFrame)return;
	var nRect = {
		x:rect.x + Zzy.Param.BMFRectFrameDis,
		y:rect.y + Zzy.Param.BMFRectFrameDis,
		width:rect.width - Zzy.Param.BMFRectFrameDis*2,
		height:rect.height - Zzy.Param.BMFRectFrameDis*2,
	};
	
	
	this.contents.fillRect(nRect.x,nRect.y,nRect.width,nRect.height,Zzy.Param.BMFRectFrameColor);
	
}



Window_ZzyBMFMailboxColl.prototype.drawInfomation = function(index,rect)
{
	
	//主题
	this.drawTextEx(this.itemThemeText(index), rect.x+this._list[index].tofx, rect.y+this._list[index].tofy);
	
	//日期
	var sy = rect.y + rect.height - this.contents.fontSize;//获取绘制日期的位置
	this.drawTextEx(this.itemDateText(index), rect.x+this._list[index].dofx, sy+this._list[index].dofy);
	
}


Window_ZzyBMFMailboxColl.prototype.itemDateText = function(index)
{
	return this._list[index].dateText ? this._list[index].dateText : '';
}

Window_ZzyBMFMailboxColl.prototype.itemThemeText = function(index)
{
	return this._list[index].themeText ? this._list[index].themeText : '';
}

Window_ZzyBMFMailboxColl.prototype.maxVisibleItems = function() 
{
    return Zzy.Param.BMFWin2List;
};

Window_ZzyBMFMailboxColl.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};

Window_ZzyBMFMailboxColl.prototype.GetMailboxID = function()
{
	return this._list[this.index()] ? this._list[this.index()].ID : undefined;
	
}

Window_ZzyBMFMailboxColl.prototype.isCurrentItemEnabled = function()
{
	return this._list[this.index()] ? true : false;
}

Window_ZzyBMFMailboxColl.prototype.playOkSound = function() 
{
	if(!Zzy.BMF.PlaySE(2))
	{SoundManager.playOk();}	
};

// Window_ZzyBMFMailboxColl.prototype.playBuzzerSound = function() 
// {
	// if(!Zzy.BMF.PlaySE(3))
	// {SoundManager.playBuzzer();}	
// };

//==================================================================
//Window_ZzyBMFMailboxPiece
//==================================================================

//显示单一的窗口
function Window_ZzyBMFMailboxPiece() 
{
    this.initialize.apply(this, arguments);
}

Window_ZzyBMFMailboxPiece.prototype = Object.create(Window_Base.prototype);
Window_ZzyBMFMailboxPiece.prototype.constructor = Window_ZzyBMFMailboxPiece;

Window_ZzyBMFMailboxPiece.prototype.initialize = function(pointer)
{
	//初始化位置
	var x = eval(Zzy.Param.BMFWin3X);
	var y = eval(Zzy.Param.BMFWin3Y);
	var w = eval(Zzy.Param.BMFWin3W);
	var h = eval(Zzy.Param.BMFWin3H);
	
    Window_Base.prototype.initialize.call(this, x, y, w, h);
	this.textArr = [];
	this.infos = undefined;
	
	this.pointer = pointer;
	
	this._scrollYDis = 0;//滑动距离
	this._needRefresh = false;
	this._cDrawHeight = 0;//绘制长度
	
	this.InitWindow();
}

Window_ZzyBMFMailboxPiece.prototype.refreshData = function()
{
	//获取到对应的text信息
	var MID = this.pointer._mailboxCollWidnow.GetMailboxID();
	
	this.textArr = Zzy.Param.BMFMailboxInfos[MID].textArr;
	this.infos = Zzy.Param.BMFMailboxInfos[MID];//奖励信息
	this.rewardArr = this.ReturnRewardInfo();//获取奖励格式
	
	
	this.refresh();
}

Window_ZzyBMFMailboxPiece.prototype.ReturnRewardInfo = function()
{
	if(this.infos)
	{
		var rewardArr = [];
		
		var golds = this.infos.golds;
		var items = this.infos.items;
		var armors = this.infos.armors;
		var weapons = this.infos.weapons;
		
		for(var i=0;i<golds.length;i++)
		{
			var info = {};
			info.tid = 1;
			info.num = golds[i];
			if(info.num)//防止金币数量为0
			{rewardArr.push(info);}
		}
		
		for(var i=0;i<items.length;i++)
		{
			var info = {};
			info.tid = 2;
			info.id = items[i].id;
			info.num = items[i].num;
			rewardArr.push(info);
		}	
		
		for(var i=0;i<armors.length;i++)
		{
			var info = {};
			info.tid = 3;
			info.id = armors[i].id;
			info.num = armors[i].num;
			rewardArr.push(info);
		}		
		
		for(var i=0;i<weapons.length;i++)
		{
			var info = {};
			info.tid = 4;
			info.id = weapons[i].id;
			info.num = weapons[i].num;
			rewardArr.push(info);
		}		
		
		return rewardArr;
	}
	return undefined;
}



Window_ZzyBMFMailboxPiece.prototype.refresh = function()
{
	if (this.contents) 
	{
        this.contents.clear();
        this.drawMailboxTextArr();
    }
}


Window_ZzyBMFMailboxPiece.prototype.drawMailboxTextArr = function()//绘制内容
{
	var len = this.textArr.length;

	var drawInfo = undefined;
	for(var i=0;i<len;i++)
	{
		var sy = (i===0) ? -this._scrollYDis : drawInfo.y+this.standardFontSize();
		drawInfo = this.drawTextEx(this.textArr[i],0,sy);//显示信息
		
		
	}
	
	if(Zzy.Param.BMFIsAutoShowReward)//存在自动绘制奖励信息
	{
		this.drawRewardArr(drawInfo);
	}
	
	this._cDrawHeight = drawInfo.y+this.standardFontSize();
}



Window_ZzyBMFMailboxPiece.prototype.drawRewardArr = function(drawInfo)
{
	var count = this.rewardArr.length;

	var maxList = Zzy.Param.BMFListNum;
	var maxLine = Math.round(count / maxList);
	
	var hWidth = (this.width-this.standardPadding()*2)/2;
	var height = this.lineHeight();
	var numWidth = this.textWidth('000');//预留宽度

	drawInfo.y += Zzy.Param.BMFExtraHeight;
	for(var i=0;i<maxLine;i++)
	{
		drawInfo.y += height;
		for(var j=0;j<maxList;j++)
		{
			var index = j+i*maxList;
			if(index < count)
			{
				var item = this.rewardArr[index];
				this.drawItem(item,j*hWidth,drawInfo.y,hWidth,numWidth);
			}
		}
	}
	drawInfo.y += height;
}


Window_ZzyBMFMailboxPiece.prototype.drawItem = function(sItem, x, y, width,numWidth) 
{
	var item = undefined;
	if(sItem.tid === 1)
	{
		var formula = Zzy.Param.BMFCoinFormalu;
		item = {};
		item.iconIndex = Zzy.Param.BMFCoinIcon;
		item.name = formula.format(sItem.num);			
	}
	else if(sItem.tid === 2)
	{
		item = $dataItems[sItem.id]
	}
	else if(sItem.tid === 3)
	{
		item = $dataArmors[sItem.id]
	}
	else if(sItem.tid === 4)
	{
		item = $dataWeapons[sItem.id]
	}	

	
    if (item) 
	{
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        if(item.iconIndex)this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth-numWidth);
		
		
		
		if(sItem.tid !== 1)//绘制数量
		{this.drawText(sItem.num, x + width - numWidth, y, numWidth-this.textPadding(),'right');}
    }
};


Window_ZzyBMFMailboxPiece.prototype.standardFontSize = function() 
{
    return 28;
};

Window_ZzyBMFMailboxPiece.prototype.drawTextEx = function(text, x, y)
{
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState;
    } else {
        return 0;
    }
};

Window_ZzyBMFMailboxPiece.prototype.InitWindow = function()
{
	this.visible = false;
	this._scrollYDis = 0;
	this._needRefresh = false;
}

Window_ZzyBMFMailboxPiece.prototype.updateOpen = function() 
{
    if (this._opening) 
	{
        this.openness += Zzy.Param.BMFWin3Speed;
        if (this.isOpen()) 
		{
            this._opening = false;
        }
    }
};

Window_ZzyBMFMailboxPiece.prototype.updateClose = function() 
{
    if (this._closing) 
	{
        this.openness -= Zzy.Param.BMFWin3Speed;
        if (this.isClosed()) 
		{
            this._closing = false;
			this.visible = false;
        }
    }
};

Window_ZzyBMFMailboxPiece.prototype.open = function() 
{
	this.visible = true;
    if (!this.isOpen()) 
	{
        this._opening = true;
		
    }
    this._closing = false;
};

Window_ZzyBMFMailboxPiece.prototype.close = function() 
{
    if (!this.isClosed()) 
	{
        this._closing = true;
    }
    this._opening = false;
};

Window_ZzyBMFMailboxPiece.prototype.reopen = function()
{
	this.openness = 0;
	this.open();
}

Window_ZzyBMFMailboxPiece.prototype.update = function()
{
	Window_Base.prototype.update.call(this);
	
	if(!this.visible)return;
	this.processPage();
	
	if(this._needRefresh)
	{
		this._needRefresh = false;
		this.refresh();
	}
	
}

//翻页检测
Window_ZzyBMFMailboxPiece.prototype.processPage = function() 
{
        if (Input.isRepeated('down')) 
		{
			if(this._cDrawHeight+this.OnceScrollYDis() > this.height)
			{
				this._scrollYDis += this.OnceScrollYDis();
				this._needRefresh = true;
			}
        }
        if (Input.isRepeated('up')) 
		{
            this._scrollYDis -= this.OnceScrollYDis();
			if(this._scrollYDis < 0){this._scrollYDis = 0;}
			this._needRefresh = true;            
        }
        // if (Input.isTriggered('pagedown')) 
		// {
            
        // }
        // if (Input.isTriggered('pageup')) 
		// {
			
		// }
};

Window_ZzyBMFMailboxPiece.prototype.OnceScrollYDis = function()
{
	return Zzy.Param.BMFWin3ScrollYDis;
}



//==================================================================
//Window_ZzyBMFMailboxConf
//==================================================================
//按下确认窗口
function Window_ZzyBMFMailboxConf() 
{
    this.initialize.apply(this, arguments);
}

Window_ZzyBMFMailboxConf.prototype = Object.create(Window_Selectable.prototype);
Window_ZzyBMFMailboxConf.prototype.constructor = Window_ZzyBMFMailboxConf;

Window_ZzyBMFMailboxConf.prototype.initialize = function(pointer)
{
	//初始化位置
	var x = eval(Zzy.Param.BMFWin4X);
	var y = eval(Zzy.Param.BMFWin4Y);
	var w = eval(Zzy.Param.BMFWin4W);
	var h = eval(Zzy.Param.BMFWin4H);
	
    Window_Selectable.prototype.initialize.call(this, x, y, w, h);
	
	this.pointer = pointer;
	this._list = [];//数据信息
	
	this.InitWindow();
	
	this.refreshData();
	
}

Window_ZzyBMFMailboxConf.prototype.refreshData = function()//初始化信息
{
	this._list = [];//数据信息
	var okName = '';
	var cancelName = '';
	switch(this.pointer.MailboxTypeIndex())
	{
		case 0:
			okName = Zzy.Param.BMFWin4NOkText;
			cancelName = Zzy.Param.BMFWin4NCancelText;
		break;
		
		case 1:
			okName = Zzy.Param.BMFWin4OOkText;
			cancelName = Zzy.Param.BMFWin4OCancelText;			
		break;
	}
	
	this._list.push(okName);
	this._list.push(cancelName);
	
	
	this.refresh();//界面刷新
}


Window_ZzyBMFMailboxConf.prototype.InitWindow = function()
{
	this.visible = false;
}

Window_ZzyBMFMailboxConf.prototype.updateOpen = function() 
{
    if (this._opening) 
	{
        this.openness += Zzy.Param.BMFWin4Speed;
        if (this.isOpen()) 
		{
            this._opening = false;
        }
    }
};

Window_ZzyBMFMailboxConf.prototype.updateClose = function() 
{
    if (this._closing) 
	{
        this.openness -= Zzy.Param.BMFWin4Speed;
        if (this.isClosed()) 
		{
            this._closing = false;
			this.visible = false;
        }
    }
};

Window_ZzyBMFMailboxConf.prototype.open = function() 
{
	this.visible = true;
    if (!this.isOpen()) 
	{
        this._opening = true;
		
    }
    this._closing = false;
};

Window_ZzyBMFMailboxConf.prototype.close = function() 
{
    if (!this.isClosed()) 
	{
        this._closing = true;
    }
    this._opening = false;
};

Window_ZzyBMFMailboxConf.prototype.reopen = function()
{
	this.openness = 0;
	this.open();
}


Window_ZzyBMFMailboxConf.prototype.itemTextAlign = function() 
{
    return 'center';
};

Window_ZzyBMFMailboxConf.prototype.drawAllItems = function() 
{
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) 
	{
        var index = topIndex + i;
        if (index < this.maxItems()) 
		{
            this.drawItem(index);
        }
    }
};

Window_ZzyBMFMailboxConf.prototype.maxItems = function() 
{
    return this._list ? this._list.length : 0;
};

Window_ZzyBMFMailboxConf.prototype.maxCols = function() {
    return 2;
};



Window_ZzyBMFMailboxConf.prototype.drawItem = function(index) 
{
	var rect = this.itemRectForText(index);
	var align = this.itemTextAlign();
	
	this.resetTextColor();
	this.drawText(this.itemName(index), rect.x, rect.y, rect.width, align);
};


Window_ZzyBMFMailboxConf.prototype.itemName = function(index)
{
	return this._list[index] ? this._list[index] : '';
}

Window_ZzyBMFMailboxConf.prototype.isCurrentItemEnabled = function()
{
	return this._list[this.index()] ? true : false;
}

Window_ZzyBMFMailboxConf.prototype.playOkSound = function() 
{
	var pID = undefined;
	switch(this.pointer.MailboxTypeIndex())
	{
		case 0:
			switch(this.index())
			{
				case 0:pID = 1;break;
				case 1:pID = 3;break;
			}
		break;
		case 1:pID = 2;break;
	}		

	if(!Zzy.BMF.PlaySE(pID))
	{SoundManager.playOk();}	
};

// Window_ZzyBMFMailboxConf.prototype.playBuzzerSound = function() 
// {
	// if(!Zzy.BMF.PlaySE(3))
	// {SoundManager.playBuzzer();}	
// };

Window_ZzyBMFMailboxConf.prototype.processCancel = function() 
{	
	if(!Zzy.BMF.PlaySE(3))
	{SoundManager.playCancel();}
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
};


//==================================================================
//Sprite_ZzyBMFPrompt
//==================================================================
//提示
function Sprite_ZzyBMFPrompt() {
    this.initialize.apply(this, arguments);
}

Sprite_ZzyBMFPrompt.prototype = Object.create(Sprite_Base.prototype);
Sprite_ZzyBMFPrompt.prototype.constructor = Sprite_ZzyBMFPrompt;

Sprite_ZzyBMFPrompt.prototype.initialize = function() 
{
    Sprite_Base.prototype.initialize.call(this);
	this.visible = false;

	this.InitPosition();//初始化位置
	this.ReLoadPic();//载入图片
	
	if(this.IsBusy())
	{
		this.visible = true;
	}
};

Sprite_ZzyBMFPrompt.prototype.InitPosition = function()
{
	this.anchor.x = Zzy.Param.BMFPromptAnchorX;
	this.anchor.y = Zzy.Param.BMFPromptAnchorY;
	this.x = eval(Zzy.Param.BMFPromptSpriteX);
	this.y = eval(Zzy.Param.BMFPromptSpriteY);
}

Sprite_ZzyBMFPrompt.prototype.ReLoadPic = function()
{
	var name = $gameSystem.GetZzyBMFPromptPicture();
	if(!name || name === '')
	{
		this.bitmap = new Bitmap(Graphics.boxWidth,this.DefaultHeight());
		
		//绘制文本渐变框
		var pText = $gameSystem.GetZzyBMFNoPicPromptText();
		
		var tWidth = this.bitmap.measureTextWidth(pText);
		var haPosX = Graphics.boxWidth/2;
		var haTWidthEx = tWidth/2+60;
		this.bitmap.gradientFillRect(haPosX-haTWidthEx, 0,haTWidthEx, this.DefaultHeight(), 'rgba(0,0,0,0.0)', 'rgba(0,0,0,8)');
		this.bitmap.gradientFillRect(haPosX, 0,haTWidthEx, this.DefaultHeight(), 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0)');
		this.bitmap.drawText(pText,0,0,Graphics.boxWidth,this.DefaultHeight(),'center');//载入文本
	}
	else
	{
		this.bitmap = ImageManager.loadPicture(name);//载入图片
	}
}

Sprite_ZzyBMFPrompt.prototype.DefaultHeight = function() 
{
    return 36;
};


Sprite_ZzyBMFPrompt.prototype.ExeShow = function()//进行重新显示
{
	if(!this.IsBusy()){this.ReShow();}
}


Sprite_ZzyBMFPrompt.prototype.ReShow = function()//进行重新显示
{
	$gameSystem._ZzyBMFPPCFrame = 0;
	$gameSystem._ZzyBMFPWCFrame = 0;
	$gameSystem._ZzyBMFPPIsOpen = true;
	$gameSystem._ZzyBMFPPIsClose = false;
	$gameSystem._ZzyBMFPPIsWait = false;
	this.visible = true;
}

Sprite_ZzyBMFPrompt.prototype.ReHide = function()//隐藏
{
	$gameSystem._ZzyBMFPPCFrame = $gameSystem.GetZzyBMFPromptFadeFrame();
	$gameSystem._ZzyBMFPWCFrame = 0;
	$gameSystem._ZzyBMFPPIsOpen = false;
	$gameSystem._ZzyBMFPPIsClose = true;
	$gameSystem._ZzyBMFPPIsWait = false;
}


Sprite_ZzyBMFPrompt.prototype.update = function()
{
	Sprite_Base.prototype.update.call(this);
	
	this.updateOpacity();//更新透明度的变化
	this.updateWait();//更新等待
}

Sprite_ZzyBMFPrompt.prototype.updateWait = function()
{
	var cframe = $gameSystem.GetZzyBMFPWCFrame();
	if($gameSystem.GetZzyBMFPPIsWait())
	{
		var pwf = $gameSystem.GetZzyBMFPromptWaitFrame();
		if($gameSystem._ZzyBMFPWCFrame < pwf)
		{
			$gameSystem._ZzyBMFPWCFrame++;
		}
		else
		{
			$gameSystem._ZzyBMFPWCFrame = pwf;
			this.ReHide();//进行消失
		}
	}
}

Sprite_ZzyBMFPrompt.prototype.updateOpacity = function()//更新透明度的变化
{
	var pff = $gameSystem.GetZzyBMFPromptFadeFrame();
	var cframe = $gameSystem.GetZzyBMFPPCFrame();
	if($gameSystem.GetZzyBMFPPIsOpen())
	{
		$gameSystem._ZzyBMFPPIsClose = false;
		$gameSystem._ZzyBMFPPIsWait = false;
		 
		
		if($gameSystem._ZzyBMFPPCFrame < pff)
		{
			$gameSystem._ZzyBMFPPCFrame++;
		}
		else
		{
			$gameSystem._ZzyBMFPPCFrame = pff;
			$gameSystem._ZzyBMFPPIsOpen = false;
			$gameSystem._ZzyBMFPPIsWait = true;
			$gameSystem._ZzyBMFPWCFrame = 0;
		}
	}
	else if($gameSystem.GetZzyBMFPPIsClose())
	{
		$gameSystem._ZzyBMFPPIsOpen = false;
		$gameSystem._ZzyBMFPPIsWait = false;
		if($gameSystem._ZzyBMFPPCFrame > 0)
		{
			$gameSystem._ZzyBMFPPCFrame--;
		}
		else
		{
			$gameSystem._ZzyBMFPPCFrame = 0;
			$gameSystem._ZzyBMFPPIsClose = false;
			$gameSystem._ZzyBMFPWCFrame = 0;
			this.visible = false;
		}		
	}

	this.opacity = 255 * $gameSystem._ZzyBMFPPCFrame / pff;

}

Sprite_ZzyBMFPrompt.prototype.IsBusy = function()//是否处于繁忙中
{
	if($gameSystem.GetZzyBMFPPIsOpen() || $gameSystem.GetZzyBMFPPIsClose() || $gameSystem.GetZzyBMFPPIsWait())
	{return true;}
	return false;
}


//---------------------------------------------Zzy.BMF.Function----------------------------------------

Zzy.BMF.OpenMailbox = function()//打开邮箱
{
	//进入到邮箱界面
	
	SceneManager.push(Scene_ZzyBMF);//邮箱场景
	
}

Zzy.BMF.SendOfID = function(ID)//发送邮件
{
	ID -= 1;//获取ID值
	
	if(Zzy.BMF.IsCanSend(ID))
	{
		$gameSystem.SendZzyBMFMailbox(ID);//发送邮件
		Zzy.BMF.CallMailboxPrompt();//新邮件提示		
	}
}

Zzy.BMF.IsCanSend = function(ID)
{
	if(!Zzy.Param.BMFIsSameOnly)return true;
	
	var rArr = $gameSystem.GetZzyBMFRecordArr();
	if(Zzy.BMF.IsSingle(rArr,ID)){return true;}
	
	var comId = Zzy.Param.BMFSameOnlyCommon;
	var varId = Zzy.Param.BMFSameOnlyVar;
	if(comId)$gameTemp.reserveCommonEvent(comId);
	if(varId)$gameVariables.setValue(varId,ID+1);//恢复标记的ID值
	
	return false;
}


Zzy.BMF.CallMailboxPrompt = function()
{
	if(SceneManager._scene instanceof Scene_Map)
	{
		if($gameSystem.GetZzyBMFIsHavePrompt())
		{
			var pointer = SceneManager._scene;
			Zzy.BMF.PlaySE(4);
			pointer._ZzyBMFSprite.ExeShow();//刷新
			
		}
	}
}


Zzy.BMF.ExcludeUndefine = function(arr)
{
	var arr2 = [];
	
	for(var i=0;i<arr.length;i++)
	{
		if(arr[i] === undefined)continue;
		arr2.push(arr[i]);
	}
	return arr2;
}

Zzy.BMF.StringToIntArr = function(str)
{
	var intArr = str.split(',');
	for(var i=0;i<intArr.length;i++)
	{
		intArr[i] = parseInt(intArr[i]);
	}
	return intArr;
}

Zzy.BMF.PlaySE = function(soundID)//播放声音
{
	var se = Zzy.Param.BMFAllSE[soundID];
	
	if(se && se.name)
	{
		AudioManager.playSe(se);
		return true;
	}
	else
	{return false;}
	
}

Zzy.BMF.SinglePush = function(Arr,ID)
{
	for(var i=0;i<Arr.length;i++)
	{
		if(Arr[i] === ID)return;
	}
	Arr.push(ID);
}

Zzy.BMF.IsSingle = function(Arr,ID)
{
	for(var i=0;i<Arr.length;i++)
	{
		if(Arr[i] === ID)return false;
	}
	return true;	
}




Zzy.BMF.EnableMenu = function(enable)
{
	$gameSystem.SetZzyBMFEnableMenu(enable);
}

Zzy.BMF.EnableMenu = function(enable)
{
	$gameSystem.SetZzyBMFInsertMenu(enable);
}

Zzy.BMF.MenuText = function(text)
{
	$gameSystem.SetZzyBMFMenuText(text);
}

Zzy.BMF.BKPicture = function(picName)
{
	$gameSystem.SetZzyBMFBKPicture(picName);
}

Zzy.BMF.Send = function(idArrStr)
{
	var idArr = Zzy.BMF.StringToIntArr(idArrStr);
	for(var i=0;i<idArr.length;i++)
	{
		var ID = idArr[i];
		Zzy.BMF.SendOfID(ID);
	}	
}

Zzy.BMF.Open = function()
{
	Zzy.BMF.OpenMailbox();//打开邮箱
}

Zzy.BMF.IsHavePrompt = function(isEnable)
{
	$gameSystem.SetZzyBMFIsHavePrompt(isEnable);
}

Zzy.BMF.PromptPicture = function(picStr)
{
	$gameSystem.SetZzyBMFPromptPicture(picStr);
	if(SceneManager._scene instanceof Scene_Map)
	{
		if($gameSystem.GetZzyBMFIsHavePrompt())
		{
			var pointer = SceneManager._scene;
			pointer._ZzyBMFSprite.ReLoadPic();//刷新
		}
	}	
}

Zzy.BMF.NoPicPromptText = function(str)
{
	$gameSystem.SetZzyBMFNoPicPromptText(str);
	if(SceneManager._scene instanceof Scene_Map)
	{
		if($gameSystem.GetZzyBMFIsHavePrompt())
		{
			var pointer = SceneManager._scene;
			pointer._ZzyBMFSprite.ReLoadPic();//刷新
		}
	}	
}

Zzy.BMF.PromptFadeFrame = function(fFrame)
{
	$gameSystem.SetZzyBMFPromptFadeFrame(fFrame);
}

Zzy.BMF.PromptWaitFrame = function(fFrame)
{
	$gameSystem.SetZzyBMFPromptWaitFrame(fFrame);
}