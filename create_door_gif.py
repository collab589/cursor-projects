"""
Generate an animated GIF of a door opening.
The door swings open to the right, revealing a bright outdoor scene behind it.
"""
from PIL import Image, ImageDraw
import math

# Settings
W, H = 600, 500
FRAMES = 40
DURATION = 40  # ms per frame

# Colors
WALL_COLOR = (210, 180, 140)
WALL_DARK = (180, 150, 110)
DOOR_COLOR = (139, 90, 43)
DOOR_FRAME = (101, 67, 33)
KNOB_COLOR = (218, 165, 32)
SKY_COLOR = (135, 206, 235)
GRASS_COLOR = (60, 179, 70)
SUN_COLOR = (255, 255, 100)
DOORWAY_BG = (60, 60, 60)


def draw_wall(draw, x1, y1, x2, y2):
    """Draw a brick wall section."""
    if x1 >= x2 or y1 >= y2:
        return
    draw.rectangle([x1, y1, x2, y2], fill=WALL_COLOR)
    # Brick pattern
    brick_h = 20
    for y in range(y1, y2, brick_h):
        offset = (y // brick_h) % 2 * 17
        for x in range(x1 - 20 + offset, x2 + 20, 34):
            bx1 = max(x1, x)
            bx2 = min(x2, x + 30)
            if bx1 >= bx2:
                continue
            brick_bottom = min(y2, y + brick_h - 2)
            if y >= brick_bottom:
                continue
            draw.rectangle([bx1, y, bx2, brick_bottom],
                           fill=(200, 170, 130), outline=(180, 150, 110))


def draw_outdoor_scene(draw, x, y, w, h):
    """Draw what's visible behind the opening door."""
    # Sky
    draw.rectangle([x, y, x + w, y + h * 0.6], fill=SKY_COLOR)
    # Sun
    sun_cx, sun_cy = x + w * 0.7, y + h * 0.25
    sun_r = 25
    draw.ellipse([sun_cx - sun_r, sun_cy - sun_r, sun_cx + sun_r, sun_cy + sun_r], fill=SUN_COLOR)
    # Grass
    draw.rectangle([x, y + h * 0.6, x + w, y + h], fill=GRASS_COLOR)
    # A simple tree
    trunk_x = x + w * 0.2
    draw.rectangle([trunk_x - 5, y + h * 0.35, trunk_x + 5, y + h * 0.6], fill=(101, 67, 33))
    draw.ellipse([trunk_x - 20, y + h * 0.1, trunk_x + 20, y + h * 0.45], fill=(34, 139, 34))
    # Flowers
    for fx in [x + w * 0.45, x + w * 0.55, x + w * 0.8, x + w * 0.85]:
        draw.ellipse([fx - 4, y + h * 0.65, fx + 4, y + h * 0.72], fill=(255, 100, 100))
        draw.ellipse([fx - 3, y + h * 0.67, fx + 3, y + h * 0.75], fill=(255, 255, 100))


def draw_door(draw, x, y, w, h, angle):
    """
    Draw a door. angle=0 means fully closed (full width),
    angle=1 means fully open (no width visible).
    """
    if w <= 0 or h <= 0:
        return

    # Door panel
    draw.rectangle([x, y, x + w, y + h], fill=DOOR_COLOR, outline=DOOR_FRAME, width=2)

    # Door panels (recessed rectangles)
    panel_margin = w * 0.08
    panel_top = y + h * 0.12
    panel_bottom = y + h * 0.72
    panel_mid = y + h * 0.44

    # Top panel
    draw.rectangle([x + panel_margin, panel_top, x + w - panel_margin, panel_mid],
                   fill=(129, 80, 33), outline=(101, 57, 23), width=1)
    # Bottom panel
    draw.rectangle([x + panel_margin, panel_mid + 4, x + w - panel_margin, panel_bottom],
                   fill=(129, 80, 33), outline=(101, 57, 23), width=1)

    # Door knob
    knob_x = x + w * 0.82
    knob_y = y + h * 0.55
    knob_r = max(3, w * 0.03)
    draw.ellipse([knob_x - knob_r, knob_y - knob_r, knob_x + knob_r, knob_y + knob_r],
                 fill=KNOB_COLOR, outline=(184, 134, 11))

    # Vertical line in panels
    vline_x = x + w * 0.4
    draw.line([(vline_x, panel_top), (vline_x, panel_mid)], fill=DOOR_FRAME, width=1)
    draw.line([(vline_x, panel_mid + 4), (vline_x, panel_bottom)], fill=DOOR_FRAME, width=1)


frames = []
doorway_left = 170
doorway_right = 430
doorway_top = 40
doorway_bottom = 470
doorway_w = doorway_right - doorway_left
doorway_h = doorway_bottom - doorway_top

for i in range(FRAMES):
    # Easing function: slow start, faster middle, slow end
    t = i / (FRAMES - 1)
    # Ease in-out
    angle = math.sin(t * math.pi / 2) ** 2  # smooth ease

    img = Image.new('RGB', (W, H), color=WALL_COLOR)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Draw wall
    draw_wall(draw, 0, 0, W, doorway_top)
    draw_wall(draw, 0, doorway_bottom, W, H)
    draw_wall(draw, 0, doorway_top, doorway_left, doorway_bottom)
    draw_wall(draw, doorway_right, doorway_top, W, doorway_bottom)

    # Doorway arch / frame
    draw.rectangle([doorway_left - 4, doorway_top - 4, doorway_right + 4, doorway_bottom + 4],
                   outline=DOOR_FRAME, width=4)

    # The opening width decreases as the door opens (revealing behind)
    # When angle=0 (closed), door covers the whole doorway
    # When angle=1 (open), door is almost gone
    door_width = int(doorway_w * (1 - angle))
    door_width = max(2, door_width)

    # Draw the outdoor scene behind the door
    # Scene becomes more visible as door opens
    draw_outdoor_scene(draw, doorway_left, doorway_top, doorway_w, doorway_h)

    # Draw the opening door (shrinking from right to left)
    if door_width > 0:
        door_x = doorway_right - door_width
        draw_door(draw, door_x, doorway_top, door_width, doorway_h, angle)

    # Door frame edges on the doorway
    draw.rectangle([doorway_left - 4, doorway_top - 4, doorway_right + 4, doorway_top + 4],
                   fill=DOOR_FRAME)
    draw.rectangle([doorway_left - 4, doorway_bottom, doorway_right + 4, doorway_bottom + 4],
                   fill=DOOR_FRAME)

    frames.append(img)

# Add a pause at the fully open state
for _ in range(20):
    frames.append(frames[-1].copy())

# Also add frames for closing
closing = list(reversed(frames[:FRAMES]))
frames.extend(closing)

# Save GIF
output_path = r"D:\cursor\door_opening.gif"
frames[0].save(
    output_path,
    save_all=True,
    append_images=frames[1:],
    duration=DURATION,
    loop=0,  # 0 = loop forever
    optimize=False,
)
print(f"GIF saved to: {output_path}")
print(f"Total frames: {len(frames)}")
