# ORBIT 10:12 · Beach Graybox V1

第五幕海边拍照场景，已从餐厅的“走吧”按钮接入主游戏。也可通过 `beach/index.html` 独立预览。

## 已实现

- 纸张转场：复用长街风铃音效 → 停顿 → 海浪循环渐入。
- 背景淡入、人物近景探头、恢复正常大小后轻微晃动。
- 三套服装分别读取 Pose 1/2/3/Silly。
- 鼠标跟随取景器；移动端拖动取景框、松手拍摄。
- 实际按取景框裁切背景和人物，允许空镜、局部人物等结果。
- 普通姿势随机切换、低概率 Silly、连续随机触发冷却、第五次拍摄后的保底 Silly 锁定。
- 三档边框选择、重新拍摄、完成、再拍一张、出片音效、CSS 3D 拍立得样机与本地保存。
- 拍摄结果写入 `window.ORBIT_BEACH_RESULT`，并尝试保存到 `localStorage['orbit:beachPhoto']`。
- 中文、韩文、英文界面；海浪开关和返回按钮。

## 服装状态接入

正式整合时优先读取：

```js
localStorage.setItem('orbit:selectedOutfit', 'plaid')
```

支持 `cuteez`、`plaid`、`striped`。独立预览也可以使用：

```text
index.html?outfit=cuteez
index.html?outfit=plaid
index.html?outfit=striped
```

未读取到上一幕服装时默认使用 `plaid`。

独立灰盒保留了一个很轻的“点击进入”，用于绕过浏览器禁止自动播放声音的限制。整合进餐厅后，可在玩家点击“走吧”时调用 `window.ORBIT_START_BEACH_SCENE()`，不需要额外入口。

## 当前素材说明

- `polaroid-frame-01/02/03.png` 是三个不同的边框，预览、最终样机和导出文件使用同一个已选编号。
- 风铃音效复用 `../street/assets/audio/wind-chime.mp3`；快门仍使用 Web Audio 生成。
- 拍立得立体效果由 CSS 3D 完成，不依赖 Three.js。
