<!--
  指令说明。只写「这条是干什么的、什么时候用、有什么坑」。

  不要写进来的东西（脚本会报错）：
    · 指令语法与参数占位符 —— 在 src/lib/commands.ts 的 syntax
    · danger / admin / advancedOnly 等标记 —— 那是安全闸门，必须机器可校验

  二级标题必须与 COMMAND_CATALOG 的 cmd 完全一致，多了少了都会报错。
  跑 node scripts/gen-command-notes.mjs --check 校验。
-->

## /log attack clear

进攻日志闪退时清空进攻日志

## /log activity clear

活动日志闪退时清空活动日志

## /map deepsea reset

点潜水艇闪退时重置潜水艇

## /cleararts

神庙闪退时清除神像，需要管理员执行

## /clearshields

护盾闪退时清除护盾发生器，需要管理员执行

## /webcode

索取网页验证码。只能在游戏聊天框里打，网页上无法代劳

## /help

列出全部指令用法，或某一条指令的用法

## /me

查看当前账号信息

## /test

回一句 hello, world!，用来确认通道是否正常

## /olp

全服在线玩家列表

## /say

发一条全服聊天，等价于直接说话

## /msg

私聊指定玩家

## /findacc

账号找回流程

## /bebean

介绍本服机器人 Bebean

## /utc

介绍 UTC 时间

## /log activity

按类型查看活动日志

## /log notice

通知日志：清空或插入一条测试通知

## /log notice resource

插入一条资源变动通知

## /log warship clear

清空战斗母舰日志

## /attackplayer

进攻某玩家的岛屿，留空则打自己

## /visitplayer

侦察某玩家的岛屿，留空则看自己

## /attackwarship

进攻战斗母舰基地

## /visitwarship

侦察战斗母舰基地

## /atkpr

随机挑一个已缓存的玩家来打

## /replay

播放回放；填 count 可查全服回放数量

## /live

观看指定玩家的战斗直播，对方不在战斗中则失败

## /homege

用主基地生成器随机生成一个基地给你打

## /homege2

同 /homege，但改为侦察

## /attackbuilding

生成一个铺满同种建筑的基地给你打

## /basebuilder

进攻基地编辑器做的基地

## /basebuilder2

侦察基地编辑器做的基地

## /defend

读取服务端 defense_editor.xlsx，给你的基地布防

## /newdef

新版防御哈莫曼

## /sandbox

加载服务端 Gamefiles/level/sandbox.json 沙盒

## /attacklevel

进攻服务端指定 JSON 基地。路径是服务端本地路径，玩家基本用不上

## /visitlevel

同 /attacklevel，但改为侦察

## /resource

给予指定资源

## /resource fill

给予大部分常用资源

## /resource proto

给予原型模块

## /resource artifact

给予神庙物品

## /resource magic

给予魔法物品

## /resource clear

清空全部资源

## /experience

设置经验等级

## /research

把科技升到指定大本等级，不含英雄技能

## /rename

修改玩家名字

## /upgrade

把所有建筑升到满级，仅主基地可用

## /clearlevel

把兵种、战舰能力、陷阱全部降到 1 级

## /easy

把自己的基地设成全满基地

## /tsarbomba

清空自己的基地

## /startinghome

重置为初始基地

## /clearobstacles

移除岛上所有障碍物

## /unboost

让所有神像加成立即过期

## /setboat

设置登陆艇兵种，艇号 0-7，例如 /setboat 0 [Rifleman] 50

## /setboat fix_pos

修正部队存储位置异常

## /troopcount

修改每艘登陆艇的部队数量

## /cleartroops

清空所有登陆艇

## /bunker set

设置地堡部队

## /bunker clear

清空指定地堡

## /layout

修改自己岛屿的地图类型；不带参数则在游戏内列出全部可选值

## /blockingmask

螃蟹 / 母舰基地分区开关，17 位掩码，0 全开、131071 全关

## /place

放置建筑 / 陷阱 / 障碍物。历史上出现过引起闪退并污染存档的情况，谨慎使用

## /getstatue

给予神像。百分比超过 1000 服务端会额外提示「过强」；取值取自 CSV，见下拉

## /gbe

一键给出当前版本战舰能量最高的神像组合，省得自己一个个试。

## /mutate

变异自己的主基地，可传数组按顺序执行

## /revivecrab

重置超级螃蟹当前阶段的破坏进度

## /deco fill

给予全部装饰物

## /deco coc

给予部落冲突联动装饰物

## /deco clear

清空装饰物

## /skin fill

给予全部皮肤

## /skin clear

清空皮肤

## /officer fill

给予全部小队长

## /officer clear

清空小队长

## /prototroop fill

给予全部原型部队

## /prototroop clear

清空原型部队

## /material fill

给予全部建筑装置

## /material list

列出建筑装置

## /material add

添加指定建筑装置

## /material clear

清空建筑装置

## /engraving level

设置雕刻等级

## /engraving quality

设置雕刻品质

## /engraving select

选中指定雕刻

## /engraving fill

全部雕刻升至满级满品质

## /engraving clear

降级全部雕刻并清空品质

## /training clear

重置训练场记录

## /map clear

重置地图探索进度

## /map fill

填充地图

## /map npc

在指定格子放置 NPC

## /map player

在指定格子放置玩家岛屿

## /map free

解放指定格子的岛屿。别用于 boss 基地、自己的基地、超级螃蟹

## /map info

查看格子信息

## /map deepsea

潜水点调试

## /map deepsea fill

加满潜水点

## /coop intel

设置情报数量

## /coop list

列出当前特遣队任务序号

## /coop clear

结束当前特遣队任务

## /coop revive

复活任务基地

## /coop bb

把指定任务改为基地编辑器里的地图

## /coop rename

重命名任务基地

## /coop xp

设置任务基地等级

## /coop mutate

变异任务基地

## /warship item fill

补满战斗母舰物品

## /warship item clear

清空战斗母舰物品

## /warship tech clear

重置战斗母舰科技树

## /warship max_score

查询战斗母舰最高分

## /sector list

列出部族加成

## /sector reset_supplies

清空原始水晶兑换记录

## /rule list

列出当前自定义规则

## /rule spell

打 NPC 时附加额外战舰能力。只能生效一个，填多个取最后一个

## /rule bonus

打 NPC 时附加部族加成。同类只有第一个生效，单位为千分之一，可为负

## /rule remove

移除一条规则

## /rule clear

清空全部规则

## /supplychest reset

重置补给箱

## /trader reset

重置商人。商人不同步时可以试试

## /stats

查看玩家统计数据

## /getplayer

查询玩家

## /datatable

查看数据表

## /tag2id

玩家标签转 ID，标签需以 # 开头

## /id2tag

玩家 ID 转标签

## /time

查看服务器时间

## /maxid

查看最大玩家 ID

## /recalcexp

重算经验

## /calctime

计时统计

## /defvalue

查看防御数值

## /debugmap

地图调试信息

## /testbase

测试基地

## /testbase2

测试基地 2

## /loadtest

加载测试

## /debugrb

回放调试信息

## /gomgr

游戏对象管理器信息

## /goinfo

查看游戏对象信息

## /gotest

按谓词 JSON 查询游戏对象

## /value

求值 JSON 表达式

## /string

求值为字符串

## /outsy

强制服务端与客户端不同步。会把你的客户端搞坏，仅调试用

## /serr

强制让客户端收到服务端错误。会把你的客户端搞坏，仅调试用

## /disconnect

断开自己的连接

## /servermsg

触发服务端消息，会打断客户端

## /op

授予管理员权限

## /deop

撤销管理员权限

## /kick

踢下线

## /ban

封禁玩家

## /pardon

解封玩家

## /banip

封禁 IP

## /pardonip

解封 IP

## /playerinfo

查看玩家详细信息

## /acccache

列出当前的账号缓存

## /acccache save

把缓存里的账号全部落盘

## /acccache player

查看某个玩家的缓存账号

## /pp

直接修改玩家存档

## /adminmutate

变异指定玩家的基地

## /clearstream

清空全服聊天

## /role

设置聊天身份

## /reload

重载 JSON 配置与 NPC 基地

## /badword

敏感词表查询与测试

## /bd2chr

建筑数据转角色数据

## /tocsv

导出为 CSV

## /cocbd

部落冲突建筑数据

## /allbd

批量建筑数据

## /vp

设置奖杯数。写在家园代码里，但需要管理员权限

## /crab

设置超级螃蟹阶段。需要管理员权限

## /log copy

复制指定玩家的日志

## /maintenance

维护模式占位，当前只会回一句 Maintenance is WIP....
