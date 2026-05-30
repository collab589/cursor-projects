"""
耶稣受洗 - 程序化视频渲染
使用 Python + MoviePy + NumPy 逐帧绘制，输出 MP4

马太福音 3:16-17
"""

import numpy as np
from moviepy import VideoClip
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os
import sys

# ============================================================
# 配置
# ============================================================
WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION = 10  # seconds
TOTAL_FRAMES = DURATION * FPS

OUTPUT_PATH = r"D:\cursor\jesus-baptism.mp4"

# 尝试找一个中文字体
FONT_PATHS = [
    r"C:\Windows\Fonts\simkai.ttf",
    r"C:\Windows\Fonts\SimHei.ttf",
    r"C:\Windows\Fonts\STKAITI.TTF",
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\simsun.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    "/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf",
]

FONT_PATH = None
for fp in FONT_PATHS:
    if os.path.exists(fp):
        FONT_PATH = fp
        break

if FONT_PATH is None:
    print("[WARN] No Chinese font found, subtitles may not render correctly!")
    FONT_PATH = "arial"
else:
    print(f"[OK] Using font: {FONT_PATH}")

# ============================================================
# 工具函数
# ============================================================

def lerp(a, b, t):
    """线性插值"""
    return a + (b - a) * t

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

def ease_in_out(t):
    """缓入缓出"""
    t = clamp(t, 0, 1)
    if t < 0.5:
        return 2 * t * t
    else:
        return -1 + (4 - 2 * t) * t

def ease_out(t):
    """缓出"""
    t = clamp(t, 0, 1)
    return 1 - (1 - t) * (1 - t)

def ease_in(t):
    """缓入"""
    t = clamp(t, 0, 1)
    return t * t

def smoothstep(t):
    """平滑阶跃"""
    t = clamp(t, 0, 1)
    return t * t * (3 - 2 * t)

# ============================================================
# 绘制函数 —— 在 PIL Image 上绘制场景
# ============================================================

def draw_gradient_sky(img, t):
    """绘制暖金色天空渐变"""
    draw = ImageDraw.Draw(img)
    h = HEIGHT
    w = WIDTH

    # 多层天空渐变
    for y in range(h):
        ratio = y / h
        # 从深蓝到金色到暖橙
        if ratio < 0.2:
            r = int(lerp(30, 120, ratio / 0.2))
            g = int(lerp(40, 130, ratio / 0.2))
            b = int(lerp(80, 170, ratio / 0.2))
        elif ratio < 0.45:
            s = (ratio - 0.2) / 0.25
            r = int(lerp(120, 220, s))
            g = int(lerp(130, 180, s))
            b = int(lerp(170, 100, s))
        elif ratio < 0.7:
            s = (ratio - 0.45) / 0.25
            r = int(lerp(220, 180, s))
            g = int(lerp(180, 160, s))
            b = int(lerp(100, 90, s))
        else:
            s = (ratio - 0.7) / 0.3
            r = int(lerp(180, 70, s))
            g = int(lerp(160, 110, s))
            b = int(lerp(90, 70, s))
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def draw_sun_glow(img, t, cx=960, cy=180):
    """绘制太阳光晕"""
    draw = ImageDraw.Draw(img)

    # 大光晕
    for r in range(200, 30, -2):
        alpha = (200 - r) / 200 * 0.3
        rr, gg, bb = 255, 240, 180
        # 轻微闪烁
        flicker = 1 + 0.05 * math.sin(t * 3.0) * math.sin(t * 5.0)
        alpha *= flicker
        draw.ellipse(
            [cx - r, cy - r * 0.7, cx + r, cy + r * 0.7],
            fill=(int(rr), int(gg), int(bb)),
        )

    return img


def draw_clouds(img, t):
    """绘制云层（带裂隙——天开了）"""
    draw = ImageDraw.Draw(img)

    # 左侧云
    for i in range(5):
        x = 200 + i * 180
        y = 60 + 30 * math.sin(i * 1.5)
        rx = 120 + i * 15
        ry = 40 + i * 5
        alpha = 0.8 if i % 3 != 0 else 0.5
        color = (255, 252, 245)
        draw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=color)

    # 右侧云
    for i in range(5):
        x = 1200 + i * 160
        y = 50 + 25 * math.sin(i * 2.0)
        rx = 130 + i * 10
        ry = 45 + i * 3
        color = (255, 252, 245)
        draw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=color)

    # 中间裂隙（天开了）——云的中间留空
    # 裂隙微微扩大缩小
    gap_width = 100 + 15 * math.sin(t * 1.5)
    gap_center = 960
    # 用天空色填充缝隙
    gap_color = (135, 150, 185)
    draw.rectangle(
        [gap_center - gap_width // 2 - 20, 0, gap_center + gap_width // 2 + 20, 160],
        fill=None  # 实际是云层未覆盖，由天空色自然透出
    )

    return img


def draw_rays(img, t):
    """绘制天堂光束"""
    draw = ImageDraw.Draw(img)

    cx, cy = 960, 100  # 光源点（天空裂隙处）
    num_rays = 9
    base_angle = -80  # 度
    spread = 140  # 度

    for i in range(num_rays):
        fraction = i / (num_rays - 1)
        angle_deg = base_angle + fraction * spread
        angle = math.radians(angle_deg)

        length = 700 + 100 * math.sin(i * 2.5 + t * 0.5) * math.cos(t * 0.7)

        x1 = cx
        y1 = cy
        x2 = cx + math.cos(angle) * length
        y2 = cy + math.sin(angle) * length

        # 光束粗细变化
        width = 8 + 4 * math.sin(i * 1.7)
        alpha = 0.08 + 0.06 * math.sin(t * 0.8 + i)
        alpha *= smoothstep(fraction)  # 两侧更暗

        # 绘制光束（多条线叠加模拟宽度）
        for w_offset in range(-int(width) // 2, int(width) // 2 + 1, 3):
            ox = w_offset * math.cos(angle + math.pi / 2) * 0.3
            oy = w_offset * math.sin(angle + math.pi / 2) * 0.3
            r = int(255 * alpha)
            g = int(240 * alpha)
            b = int(190 * alpha)
            draw.line(
                [(int(x1 + ox), int(y1 + oy)), (int(x2 + ox), int(y2 + oy))],
                fill=(r, g, b),
                width=1,
            )
    return img


def draw_light_particles(img, t, frame):
    """绘制光粒子"""
    draw = ImageDraw.Draw(img)

    np.random.seed(42)  # 固定种子保证一致性
    num_particles = 60
    cx, cy = 960, 100

    for i in range(num_particles):
        # 粒子从光源随机扩散
        seed_x = np.random.random()
        seed_y = np.random.random()
        speed = 0.3 + np.random.random() * 0.5
        wobble_amp = np.random.random() * 30

        base_x = cx + (seed_x - 0.3) * 600
        base_y = cy + seed_y * 650

        # 粒子位置随时间变化
        px = base_x + wobble_amp * math.sin(t * 1.5 + i * 0.7)
        py = base_y + (frame * speed * 0.5) % 700

        # 粒子生命周期
        life = ((frame * 0.3 + i * 37) % 150) / 150
        alpha = math.sin(life * math.pi) * 0.7

        if alpha > 0:
            size = 2 + 2 * alpha
            r = int(255 * alpha)
            g = int(250 * alpha)
            b_val = int(220 * alpha)
            draw.ellipse(
                [px - size, py - size, px + size, py + size],
                fill=(r, g, b_val),
            )
    return img


def draw_hills(img, t):
    """绘制远山"""
    draw = ImageDraw.Draw(img)
    h = HEIGHT

    # 左侧山
    hill_points_left = [
        (-50, h),
        (0, h - 130),
        (200, h - 200),
        (400, h - 250),
        (600, h - 190),
        (750, h - 130),
        (850, h),
    ]
    draw.polygon(hill_points_left, fill=(100, 130, 70))

    # 右侧山
    hill_points_right = [
        (750, h),
        (850, h - 120),
        (1000, h - 220),
        (1200, h - 260),
        (1400, h - 200),
        (1600, h - 140),
        (1950, h),
    ]
    draw.polygon(hill_points_right, fill=(85, 115, 60))

    # 山上的植被纹理
    for i in range(20):
        x = 200 + i * 80
        yy = h - 150 - 40 * math.sin(i * 0.8)
        tree_r = 25 + 15 * math.sin(i * 2.0)
        draw.ellipse(
            [x - tree_r, yy - tree_r * 1.2, x + tree_r, yy + tree_r * 0.8],
            fill=(90, 120, 65),
        )

    return img


def draw_river(img, t, frame):
    """绘制约旦河水面"""
    draw = ImageDraw.Draw(img)
    w = WIDTH
    h = HEIGHT

    # 水面区域
    river_top = h - 350
    for y in range(river_top, h):
        ratio = (y - river_top) / (h - river_top)
        # 深蓝绿色水
        r = int(lerp(60, 25, ratio))
        g = int(lerp(115, 55, ratio))
        b = int(lerp(150, 85, ratio))
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # 水波纹理
    for i in range(30):
        y_base = river_top + 20 + i * 10
        wave_speed = 0.5 + 0.3 * math.sin(i * 1.5)
        phase = frame * 0.05 * wave_speed + i * 2.0
        for x in range(0, w, 4):
            dy = 3 * math.sin(x * 0.02 + phase) * (1 - (y_base - river_top) / 350)
            yy = int(y_base + dy)
            if river_top < yy < h:
                alpha = 0.05 + 0.03 * abs(math.sin(x * 0.02 + phase))
                r = int(160 * alpha)
                g = int(210 * alpha)
                b_val = int(235 * alpha)
                # Plot a single pixel (roughly)
                draw.point((x, yy), fill=(r, g, b_val))

    # 水面反光
    for i in range(15):
        rx = 300 + i * 100 + 30 * math.sin(t + i)
        ry = river_top + 40 + i * 15 + 10 * math.cos(t * 0.7 + i)
        glow_r = 40 + 20 * math.sin(t + i)
        alpha = 0.1 + 0.05 * math.sin(t * 1.2 + i)
        r = int(200 * alpha)
        g = int(220 * alpha)
        b_val = int(240 * alpha)
        draw.ellipse(
            [rx - glow_r, ry - glow_r * 0.4, rx + glow_r, ry + glow_r * 0.4],
            fill=(r, g, b_val),
        )

    return img


def draw_jesus(img, t, frame):
    """绘制耶稣（半身在水中的白袍人物）"""
    draw = ImageDraw.Draw(img)

    # 位置在水中，微微晃动
    base_x = 920
    base_y = 580
    sway_x = 2 * math.sin(t * 1.2)
    sway_y = 1 * math.sin(t * 0.9)

    x = int(base_x + sway_x)
    y = int(base_y + sway_y)

    # --- 光环 ---
    halo_r = 38
    halo_alpha = 0.35 + 0.1 * math.sin(t * 2.0)
    for r in range(halo_r, halo_r - 8, -2):
        a = int(255 * halo_alpha * (r / halo_r))
        draw.ellipse(
            [x - r, y - 130 - r, x + r, y - 130 + r],
            outline=(255, 220, 130, a),
            width=1,
        )

    # --- 身体（白袍） ---
    robe_w = 50
    robe_h = 130
    robe_points = [
        (x - robe_w // 2, y - 60),
        (x + robe_w // 2, y - 60),
        (x + robe_w // 2 + 5, y + robe_h),
        (x - robe_w // 2 - 5, y + robe_h),
    ]
    # 白袍颜色
    robe_color = (245, 240, 230)
    draw.polygon(robe_points, fill=robe_color)
    # 袍子阴影
    shade_color = (220, 215, 205)
    draw.polygon(
        [
            (x + robe_w // 4, y - 60),
            (x + robe_w // 2, y - 60),
            (x + robe_w // 2 + 5, y + robe_h),
            (x + robe_w // 4 + 5, y + robe_h),
        ],
        fill=shade_color,
    )

    # --- 头部 ---
    head_x, head_y = x, y - 92
    head_rx, head_ry = 20, 24
    skin_color = (220, 180, 140)
    draw.ellipse(
        [head_x - head_rx, head_y - head_ry, head_x + head_rx, head_y + head_ry],
        fill=skin_color,
    )

    # --- 长发 ---
    hair_color = (50, 30, 15)
    draw.ellipse(
        [head_x - head_rx - 3, head_y - head_ry, head_x + head_rx + 3, head_y + 5],
        fill=hair_color,
    )
    # 头顶
    draw.ellipse(
        [head_x - 14, head_y - head_ry - 3, head_x + 14, head_y - 5],
        fill=hair_color,
    )

    # --- 面部特征 ---
    # 眼睛
    eye_y = head_y - 4
    draw.ellipse([head_x - 8, eye_y - 2, head_x - 4, eye_y + 1], fill=(40, 20, 5))
    draw.ellipse([head_x + 4, eye_y - 2, head_x + 8, eye_y + 1], fill=(40, 20, 5))

    # 鼻子
    draw.line([(head_x, eye_y + 2), (head_x, eye_y + 10)], fill=(190, 150, 115), width=1)

    # 胡须
    beard_color = (60, 35, 15)
    draw.ellipse(
        [head_x - 10, eye_y + 6, head_x + 10, eye_y + 18],
        fill=beard_color,
    )

    return img


def draw_john(img, t, frame):
    """绘制施洗约翰"""
    draw = ImageDraw.Draw(img)

    base_x = 720
    base_y = 590
    x = int(base_x)
    y = int(base_y)

    # --- 身体（骆驼毛色袍） ---
    robe_w = 48
    robe_h = 125
    robe_color = (175, 140, 100)
    draw.polygon(
        [
            (x - robe_w // 2, y - 50),
            (x + robe_w // 2, y - 50),
            (x + robe_w // 2 + 4, y + robe_h),
            (x - robe_w // 2 - 4, y + robe_h),
        ],
        fill=robe_color,
    )
    shade = (155, 120, 85)
    draw.polygon(
        [
            (x + robe_w // 4, y - 50),
            (x + robe_w // 2, y - 50),
            (x + robe_w // 2 + 4, y + robe_h),
            (x + robe_w // 4 + 3, y + robe_h),
        ],
        fill=shade,
    )

    # --- 头部 ---
    head_x, head_y = x, y - 82
    head_rx, head_ry = 19, 23
    skin_color = (200, 165, 130)
    draw.ellipse(
        [head_x - head_rx, head_y - head_ry, head_x + head_rx, head_y + head_ry],
        fill=skin_color,
    )

    # 深色头发
    hair_color = (35, 20, 5)
    draw.ellipse(
        [head_x - head_rx - 2, head_y - head_ry, head_x + head_rx + 2, head_y + 3],
        fill=hair_color,
    )
    draw.ellipse(
        [head_x - 13, head_y - head_ry - 2, head_x + 13, head_y - 4],
        fill=hair_color,
    )

    # --- 右臂（伸向耶稣） ---
    arm_y = y - 55
    arm_start_x = x + 15
    arm_end_x = x + 115
    arm_sway = 2 * math.sin(t * 1.5)
    arm_points = [
        (arm_start_x, arm_y - 8),
        (arm_start_x, arm_y + 8),
        (arm_end_x, arm_y + arm_sway - 6 + 50),
        (arm_end_x, arm_y + arm_sway + 6 + 50),
    ]
    arm_color = (190, 155, 120)
    draw.polygon(arm_points, fill=arm_color)

    # 手掌（在耶稣头顶上方）
    hand_x = arm_end_x
    hand_y = arm_y + arm_sway + 50
    draw.ellipse(
        [hand_x - 8, hand_y - 6, hand_x + 8, hand_y + 6],
        fill=(200, 165, 130),
    )

    # --- 水流 ---
    stream_alpha = 0.7 + 0.2 * math.sin(frame * 0.3)
    for drop_i in range(3):
        drop_x = hand_x + (drop_i - 1) * 6
        drop_y = hand_y + 3 + drop_i * 4
        drop_offset = (frame * 2 + drop_i * 20) % 40
        dy = drop_y + drop_offset
        if dy < y - 40:
            r = int(140 * stream_alpha)
            g = int(200 * stream_alpha)
            b = int(230 * stream_alpha)
            draw.ellipse(
                [drop_x - 1.5, dy - 3, drop_x + 1.5, dy + 3],
                fill=(r, g, b),
            )

    return img


def draw_dove(img, t, frame):
    """绘制鸽子"""
    draw = ImageDraw.Draw(img)

    # 鸽子从天空裂隙降下
    base_x = 960
    base_y = 100

    # 下降动画
    dove_duration = 300  # frames
    dove_progress = ((frame - 60) % (dove_duration + 100)) / dove_duration
    dove_progress = clamp(dove_progress, 0, 1)

    # 使用缓动，先快后慢
    y_offset = ease_in_out(dove_progress) * 400
    # 横向微摆
    x_offset = 20 * math.sin(dove_progress * 4.0)
    # 缩放效果
    scale = lerp(0.3, 1.0, smoothstep(dove_progress * 2)) if dove_progress < 0.5 else 1.0

    if dove_progress <= 0 or dove_progress >= 0.95:
        return img

    cx = int(base_x + x_offset)
    cy = int(base_y + y_offset)

    # 翅膀扇动
    wing_angle = 30 * math.sin(frame * 0.8) * (1 - dove_progress * 0.5)

    s = int(18 * scale)
    if s < 3:
        return img

    # 身体
    body_color = (252, 252, 250)
    draw.ellipse([cx - s, cy - s // 2, cx + s, cy + s // 2], fill=body_color)

    # 翅膀
    wing_tip_x = cx + int(s * 1.5 * math.cos(math.radians(wing_angle)))
    wing_tip_y = cy - int(s * 1.5 * abs(math.sin(math.radians(wing_angle))))
    wing_color = (240, 240, 235)
    draw.polygon(
        [(cx + s // 2, cy), (wing_tip_x, wing_tip_y), (cx + s // 2, cy + s // 2)],
        fill=wing_color,
    )

    # 头部
    draw.ellipse([cx + s - 3, cy - 4, cx + s + 5, cy + 4], fill=(255, 255, 250))
    # 喙
    draw.line([(cx + s + 5, cy), (cx + s + 8, cy)], fill=(230, 170, 50), width=1)

    # 微小的光环（圣灵标记）
    halo_r = s + 4
    draw.ellipse(
        [cx - halo_r, cy - halo_r, cx + halo_r, cy + halo_r],
        outline=(255, 220, 130),
        width=1,
    )

    return img


def draw_ripples(img, t, frame, cx=940, cy=610):
    """绘制水涟漪"""
    draw = ImageDraw.Draw(img)

    for i in range(4):
        ripple_phase = (frame * 1.5 + i * 70) % 180
        ripple_progress = ripple_phase / 180
        r = ripple_progress * 120
        alpha = (1 - ripple_progress) * 0.35

        if alpha > 0:
            draw.ellipse(
                [cx - r, cy - r * 0.3, cx + r, cy + r * 0.3],
                outline=(180, 220, 240),
                width=int(1 + 1.5 * alpha),
            )

    return img


def draw_text(img, text, y, alpha=1.0, font_size=36, color=(255, 255, 240)):
    """绘制文字"""
    if FONT_PATH == "arial":
        return img

    try:
        font = ImageFont.truetype(FONT_PATH, font_size)
    except:
        return img

    draw = ImageDraw.Draw(img)

    # 测量文字大小用于居中
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (WIDTH - tw) // 2

    # 多层阴影
    for s_offset in range(3, 0, -1):
        sc = int(alpha * 0.3 * (1 - s_offset / 4))
        draw.text((x + s_offset, y + s_offset), text, font=font, fill=(0, 0, 0, sc))

    # 主体
    r = int(color[0])
    g = int(color[1])
    b = int(color[2])
    a = int(255 * alpha)

    # 发光效果
    glow_color = (255, 220, 130, int(a * 0.3))
    for ox, oy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        draw.text((x + ox, y + oy), text, font=font, fill=glow_color)

    draw.text((x, y), text, font=font, fill=(r, g, b, a))
    return img


# ============================================================
# 生成单帧
# ============================================================

def make_frame(t):
    """生成一帧"""
    frame = int(t * FPS)

    # 创建画布
    img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    img = draw_gradient_sky(img, t)

    # 初始场景 —— 风景
    img = draw_hills(img, t)
    img = draw_river(img, t, frame)

    # 太阳光晕
    glow_alpha = smoothstep(clamp(t / 1.5, 0, 1)) * 0.6
    if glow_alpha > 0:
        img = draw_sun_glow(img, t)

    # 云层 —— 逐渐裂开
    clouds_t = t
    img = draw_clouds(img, clouds_t)

    # 光束 —— 逐渐增强
    rays_alpha = smoothstep(clamp((t - 1) / 3, 0, 1))
    if rays_alpha > 0:
        img = draw_rays(img, t)
        img = draw_light_particles(img, t, frame)

    # 施洗约翰
    if t > 0.5:
        img = draw_john(img, t, frame)

    # 耶稣
    if t > 0.8:
        img = draw_jesus(img, t, frame)
        # 涟漪
        img = draw_ripples(img, t, frame)

    # 鸽子 —— 在 2.5 秒后出现
    if t > 2.5:
        img = draw_dove(img, t, frame)

    # --- 标题 ---
    title_alpha = smoothstep(clamp(t / 1.5, 0, 1)) * smoothstep(clamp((DURATION - t) / 0.5, 0, 1))
    if title_alpha > 0.01:
        img = draw_text(img, "耶 稣 受 洗", 55, title_alpha, color=(255, 255, 240), font_size=50)

    # --- 经文引用 ---
    ref_alpha = smoothstep(clamp((t - 0.5) / 1, 0, 1)) * smoothstep(clamp((DURATION - t) / 0.5, 0, 1))
    if ref_alpha > 0.01:
        img = draw_text(
            img,
            "马太福音 3:16-17",
            HEIGHT - 120,
            ref_alpha * 0.7,
            color=(255, 255, 240),
            font_size=24,
        )

    # --- 天上有声音说: 这是我的爱子, 我所喜悦的 ---
    voice_start = 7.0
    voice_duration = 3.0
    voice_t = clamp((t - voice_start) / 1.0, 0, 1)
    voice_fade_out = clamp((voice_start + voice_duration - t) / 0.5, 0, 1)
    voice_alpha = smoothstep(voice_t) * voice_fade_out

    if voice_alpha > 0.01 and t > voice_start:
        # 中央大字幕
        img = draw_text(
            img,
            "这是我的爱子，我所喜悦的。",
            HEIGHT // 2 - 30,
            voice_alpha,
            color=(255, 235, 170),
            font_size=42,
        )

    # --- 底部字幕 ---
    subtitle_lines = [
        (0, 2.0, "耶稣受了洗，随即从水里上来。"),
        (2.0, 4.0, "天忽然为他开了，"),
        (4.0, 5.5, "他就看见神的灵仿佛鸽子降下，"),
        (5.5, 7.0, "落在他身上。"),
        (7.0, 10.0, "从天上有声音说：「这是我的爱子，我所喜悦的。」"),
    ]

    for start_t, end_t, text in subtitle_lines:
        in_alpha = smoothstep(clamp((t - start_t) / 0.3, 0, 1))
        out_alpha = smoothstep(clamp((end_t - t) / 0.3, 0, 1))
        sub_alpha = in_alpha * out_alpha
        if sub_alpha > 0.01:
            img = draw_text(
                img,
                text,
                HEIGHT - 60,
                sub_alpha * 0.85,
                color=(255, 255, 255),
                font_size=22,
            )

    # 转回 RGB
    bg = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
    bg.paste(img, (0, 0), img)
    return np.array(bg)


# ============================================================
# 渲染
# ============================================================

def main():
    print(f"Rendering Jesus Baptism video...")
    print(f"   Resolution: {WIDTH}x{HEIGHT}")
    print(f"   FPS: {FPS}")
    print(f"   Duration: {DURATION}s")
    print(f"   Total frames: {TOTAL_FRAMES}")
    print()

    clip = VideoClip(make_frame, duration=DURATION)

    # 使用多个线程并行渲染
    import multiprocessing
    threads = min(4, multiprocessing.cpu_count())
    print(f"   Using {threads} threads...")

    clip.write_videofile(
        OUTPUT_PATH,
        fps=FPS,
        codec="libx264",
        preset="medium",
        bitrate="4000k",
        threads=threads,
        logger="bar",
    )

    print(f"\nDone! Video saved to: {OUTPUT_PATH}")
    print(f"   File size: {os.path.getsize(OUTPUT_PATH) / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
