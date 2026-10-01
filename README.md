# ORBIT 10:12｜菜单 + 卧室 + 换装

这是一个无需安装依赖的静态网页原型，已经把主菜单、卧室和换装小游戏连在一起。

## 启动方式

推荐在本目录打开终端运行：

```bash
python3 -m http.server 8080
```

然后在浏览器打开 `http://localhost:8080`。

## GitHub 与大素材

菜单背景 `assets/menu-bg.gif` 约 200 MB，使用 Git LFS 保存原文件，其他素材和目录保持原样。克隆前安装 Git LFS，克隆后执行 `git lfs pull`，确保本地得到真实 GIF 而非指针文件。

```bash
git lfs install
git clone https://github.com/okalenO/ORBIT-10-12.git
cd ORBIT-10-12
git lfs pull
```

日常修改通过 Git 提交、推送；只有替换菜单 GIF 时才需要上传新的 LFS 对象。GitHub 连接器用于读取和修改代码，本地 Git CLI 用于获取、推送完整素材。

GitHub Pages 不直接支持 Git LFS 文件；本次只建立源码仓库。后续发布网站时，需要由能拉取 LFS 实体文件的部署流程提供菜单 GIF，或另行安排素材托管。参见 [GitHub LFS 官方说明](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)。

## 当前完整流程

1. 菜单点击 `START`
2. 色块与按钮退场，暖白光覆盖画面
3. `10:12` 从占位页中央移动到左上角
4. 进入暗光卧室时不显示窗帘提示；进入卧室 8 秒后仍未点击窗帘，提示用 2.4 秒渐亮，并以 6 秒周期缓慢呼吸
5. 点击任意一侧窗帘，窗帘移动、挤压并拉开，房间转亮，光线淡入
6. 第一次点击人物：`再睡一会儿……`
7. 第二次点击人物：`我已经醒了……zzZ`
8. 第三次点击人物：`好亮……好啦，我起床啦……`，播放坐起动画（需要点击三次）
9. 起床后进入自由探索，可点击人物、物件、手机和衣柜
10. 点击关闭的门板打开衣柜；打开后点击左侧门板关闭，点击柜内挂着的衣服才推进镜头并进入换装（没有占位页）
11. 单击衣服试穿；当前衣服会离开衣架，衣架保留为空
12. 左右拖动任意衣服，另外两件会跟随并产生带惯性的摆动
13. 连续点击右下角箱子三次，隐藏玩偶服弹出；可以试穿，但不会成为正式选择
14. 普通服装试穿后点击「确定」，穿着该服装返回卧室；玩偶服不能确认
15. 换装返回按钮不提交试穿结果；再次进入会恢复上次普通服装选择
16. 从换装返回后衣柜门保持打开；点击打开的门板关门，点击柜内衣服可再次进入换装
17. 卧室返回按钮回到主菜单并清空本轮游戏进度，保留当前语言和音乐开关

## 已实现的互动

- 人物起床后随机说三句话之一，并避免连续重复同一句
- 玩偶 1、玩偶 2、海报：点击后抖动
- 足球、行李箱、加湿器、电脑：抖动并显示人物气泡
- 手机：打开聊天界面；可点击空白区域、右上角关闭按钮或按 `Esc` 返回
- 衣柜：门板点击只开关；热点随门板位置切换，柜内衣服热点仅在打开时可用，点击衣服后推进镜头进入换装
- 换装：CUTEEZ、格子衫、亨利衫三套服装可单击试穿
- 换装中的睡衣人物可点击，说「今天要穿什么呢~？」；试穿其他服装后禁用这一互动。
- 确认换装返回卧室后，人物缩小到床尾旁，点击后邀请出门吃午餐和散步。两段新对白同步提供自然的中、英、韩文。
- 衣架：服装选中后隐藏，空衣架继续留在横杆上
- 拖拽：三件服装有联动位移、惯性回弹与轻微摆动
- 隐藏服装：点击右下角箱子三次，玩偶服弹动出现；试穿后给出拒绝选取对白
- 人物：待机时轻微左右晃动；换装时有缩放、旋转和闪光切换
- 睡衣：GIF 每隔约 4.2～6.5 秒播放一轮，其余时间停在静态帧
- 英文、简体中文、韩文切换会同步影响卧室对白
- 英文、简体中文、韩文切换会同步影响换装对白
- 手机竖屏时提示旋转设备
- `prefers-reduced-motion` 动效降级

## 素材与性能

- 原始 `bedroom-dark.gif` 约 86MB，原型中已转换为内容一致的 H.264 MP4，约 1.6MB。
- 浏览器用 `<video muted loop playsinline>` 播放暗房动画，手机加载压力明显更小。
- 所有卧室图层集中在 `assets/bedroom/`。
- 卧室人物 GIF 一轮为 5.4 秒，播放后显示 `character-awake.png`，静止约 6 秒再重播。首次起床仍在 5 秒时开放互动。
- 动画时长集中在 `bedroom.js` 的 `bedroomCharacterTiming`。进入衣柜、返回菜单或确认换装时停止循环，未换装返回卧室时重新开始等待。
- 醒来后的 GIF/静态帧切换不对人物透明度做交叉淡入淡出；GIF 加载并解码前保留静态帧，避免透出背景。
- 衣柜关闭与打开使用同样的移动和水平挤压过渡，反向恢复到关闭位置。

## 下一场景衔接

确认服装后点击卧室人物，显示午餐邀请对白 6.5 秒，然后发出 `orbit-next-scene-request` 事件，`detail` 为 `{ from: "bedroom", next: "lunch", outfit: confirmedOutfit }`。下一场景尚未实现，所以目前保留卧室画面；后续场景可监听该事件接入转场。

连续点击人物会重新计时，只触发一次请求；其他对白、衣柜操作或退出卧室会取消待处理请求。三语文案分别位于 `bedroomCopy.lunchInvite` 和 `dressupCopy.pajamaQuestion`。

## 菜单素材替换

当前背景路径为：

```text
assets/menu-bg.gif
```

直接用你本地已经确认的动图覆盖这个同名文件即可，不需要修改代码。

标题漂浮已恢复为上一版的克制幅度，绿色粒子已经取消。

## 换装对白修改位置

换装三语文案位于 `dressup.js` 顶部的 `dressupCopy`。服装素材与人物素材位于 `assets/dressup/`。

## 暂未接入

- BGM 音频文件尚未放入，目前只有开关状态

## 主要文件

- `index.html`：页面与素材图层
- `game-state.js`：共享游戏状态初始化，在三个场景脚本之前加载
- `styles.css`：菜单视觉、按钮与主转场
- `script.js`：菜单、语言和 BGM 状态
- `bedroom.css`：卧室图层、热点与动画
- `bedroom.js`：卧室状态机、对白和互动逻辑
- `dressup.css`：换装场景、衣物联动和人物切换动画
- `dressup.js`：换装状态、拖拽物理、隐藏服装与三语对白

## 状态与场景边界

保留现有目录结构，使用原生脚本；菜单、卧室和换装各自维护 DOM、对白、动画和计时器。共享数据统一位于 `window.orbitGameState`：

| 字段 | 含义 | 主要写入位置 |
| --- | --- | --- |
| `currentScene` | `menu` / `bedroom` / `dressup`，不表示过渡动画已完成 | 三个场景的进入与返回函数 |
| `bedroomState` | 卧室详细互动阶段 | `bedroom.js` 的 `setBedroomState()` |
| `wardrobeState` | `closed` / `open`，返回卧室时保留开门状态 | 卧室衣柜逻辑 |
| `characterState` | `sleeping` / `wakeQueued` / `waking` / `awake` / `dressed` | 卧室人物逻辑 |
| `selectedOutfit` | 最近试穿的普通服装，返回后保留 | 换装选择逻辑 |
| `confirmedOutfit` | 已确认并应用到卧室的服装 | 换装确认逻辑 |
| `previewOutfit` | 临时熊服预览，不允许确认 | 换装预览逻辑 |
| `bearUnlocked` | 隐藏服装是否解锁 | 换装箱子逻辑 |

`getDressupConfirmedOutfit()` 返回共享状态中的 `confirmedOutfit`。服装 ID 为 `cuteez`、`plaid`、`henley`；现有素材映射保留，`plaid` 使用 `character-striped.png`，`henley` 使用 `character-plaid.png`。

语言与 BGM 由 `orbitMenu` 管理，通过 `orbit-language-change` 和 `orbit-bgm-change` 同步。状态仅保存在内存中，刷新页面会重置。

后续新增场景应复用共享状态，并由场景退出函数清理自己的异步任务。布局、热点与动画类名继续由对应场景管理。
