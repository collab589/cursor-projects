# Cursor 项目

一个存放各种创意小项目的仓库，包含 CSS 动画、GIF 生成等实验性作品。

## 技术栈

- HTML/CSS/JavaScript（动画与交互）
- Python（GIF 生成等图像处理）
- 不依赖任何前端框架，纯原生实现

## 项目文件

| 文件 | 说明 |
|------|------|
| `moses-baby-crying.html` | 场景动画：房间里被布包裹的婴儿摩西在哭泣，包含 Web Audio 合成的啼哭声 |
| `create_door_gif.py` | 使用 Python 生成开门动画 GIF |
| `door_opening.gif` | 开门动图输出 |

## 编码约定

- 动画效果不使用像素图/像素风格，追求平滑自然的视觉效果
- 页面尽量自包含（单文件 HTML，不引入外部资源）
- 场景类动画中，只有角色/人物动，背景和景物保持静态
