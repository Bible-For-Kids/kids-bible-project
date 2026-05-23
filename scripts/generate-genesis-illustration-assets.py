from PIL import Image, ImageDraw, ImageFilter
import math
import os
import random

W, H = 1600, 900
SCALE = 2
OUT_ROOT = os.path.join("public", "illustrations", "genesis")
random.seed(7)

PALETTE = {
    "deep": (12, 20, 36),
    "gold": (248, 197, 91),
    "wood": (111, 75, 48),
}

ASSETS = [
    (1, "creation-begins", "creation_begins"),
    (1, "light-over-darkness", "light_over_darkness"),
    (1, "day-and-night", "day_and_night"),
    (1, "great-lights", "great_lights"),
    (1, "very-good-creation", "very_good_creation"),
    (2, "sabbath-rest", "sabbath_rest"),
    (2, "breath-of-life", "breath_of_life"),
    (2, "garden-rivers", "garden_rivers"),
    (2, "right-helper", "right_helper"),
    (3, "serpent-question", "serpent_question"),
    (3, "fruit-choice", "fruit_choice"),
    (3, "hiding-among-trees", "hiding_among_trees"),
    (3, "promise-over-serpent", "promise_over_serpent"),
    (3, "guarded-eden", "guarded_eden"),
    (4, "offerings", "offerings"),
    (4, "sin-at-the-door", "sin_at_the_door"),
    (4, "field-before-violence", "field_before_violence"),
    (4, "seth-family-prayer", "seth_family_prayer"),
    (5, "family-line", "family_line"),
    (5, "enoch-walks", "enoch_walks"),
    (5, "noah-named", "noah_named"),
    (6, "noah-faithful", "noah_faithful"),
    (6, "ark-building", "ark_building"),
    (6, "creatures-gather", "creatures_gather"),
    (7, "family-enters-ark", "family_enters_ark"),
    (7, "animals-enter-pairs", "animals_enter_pairs"),
    (7, "ark-door-closed", "ark_door_closed"),
    (7, "waters-lift-ark", "waters_lift_ark"),
    (8, "ark-on-ararat", "ark_on_ararat"),
    (8, "dove-olive-leaf", "dove_olive_leaf"),
    (8, "leaving-ark", "leaving_ark"),
    (8, "altar-after-rescue", "altar_after_rescue"),
    (9, "life-is-precious", "life_is_precious"),
    (9, "rainbow-covenant", "rainbow_covenant"),
    (9, "respectful-covering", "respectful_covering"),
    (10, "coastlands-spread", "coastlands_spread"),
    (10, "early-cities", "early_cities"),
    (10, "families-map", "families_map"),
]


def sc(value):
    return int(value * SCALE)


def c(rgb, alpha=255):
    return tuple(rgb) + (alpha,)


def new_canvas(top=(112, 193, 222), bottom=(255, 230, 178)):
    image = Image.new("RGBA", (W * SCALE, H * SCALE), (0, 0, 0, 0))
    pixels = image.load()

    for y in range(H * SCALE):
        t = y / (H * SCALE - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        for x in range(W * SCALE):
            pixels[x, y] = color + (255,)

    return image


def overlay_texture(image, amount=17):
    texture = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(texture, "RGBA")
    width, height = image.size

    for _ in range(4200):
        x = random.randrange(width)
        y = random.randrange(height)
        alpha = random.randrange(3, amount)
        shade = random.choice([(255, 255, 255, alpha), (0, 0, 0, alpha)])
        draw.point((x, y), fill=shade)

    for _ in range(110):
        x = random.randrange(width)
        y = random.randrange(height)
        radius = random.randrange(sc(2), sc(8))
        draw.ellipse(
            (x - radius, y - radius, x + radius, y + radius),
            fill=(255, 255, 255, random.randrange(4, 12)),
        )

    return Image.alpha_composite(image, texture)


def radial_glow(image, center, radius, color, alpha=180):
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")
    cx, cy = sc(center[0]), sc(center[1])

    for i in range(42, 0, -1):
        r = sc(radius) * i / 42
        a = int(alpha * (i / 42) ** 2)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=c(color, a))

    return Image.alpha_composite(image, layer)


def poly(draw, points, fill):
    draw.polygon([(sc(x), sc(y)) for x, y in points], fill=fill)


def ellipse(draw, box, fill, outline=None, width=1):
    draw.ellipse(tuple(sc(v) for v in box), fill=fill, outline=outline, width=sc(width))


def rect(draw, box, fill, outline=None, width=1):
    draw.rectangle(tuple(sc(v) for v in box), fill=fill, outline=outline, width=sc(width))


def line(draw, points, fill, width=3):
    draw.line([(sc(x), sc(y)) for x, y in points], fill=fill, width=sc(width), joint="curve")


def land(draw, y=640, color=(88, 151, 87), far=(122, 178, 120)):
    poly(
        draw,
        [(0, y), (150, y - 45), (310, y - 25), (455, y - 62), (660, y - 20),
         (900, y - 72), (1120, y - 32), (1600, y - 64), (1600, 900), (0, 900)],
        c(far, 255),
    )
    poly(
        draw,
        [(0, y + 70), (250, y + 35), (445, y + 62), (655, y + 10), (860, y + 55),
         (1140, y + 12), (1600, y + 62), (1600, 900), (0, 900)],
        c(color, 255),
    )


def water(draw, y=600, color=(56, 137, 174), dark=(31, 92, 137)):
    poly(
        draw,
        [(0, y), (180, y - 26), (360, y), (550, y - 30), (760, y + 2),
         (970, y - 22), (1180, y + 8), (1400, y - 22), (1600, y + 8), (1600, 900), (0, 900)],
        c(color, 220),
    )
    for yy in [y + 45, y + 93, y + 145]:
        for x in range(-80, 1600, 240):
            line(draw, [(x, yy), (x + 60, yy - 12), (x + 125, yy + 3), (x + 200, yy - 8)], c((230, 247, 255), 75), 4)
    poly(
        draw,
        [(0, y + 210), (250, y + 175), (490, y + 220), (700, y + 180),
         (960, y + 225), (1240, y + 190), (1600, y + 230), (1600, 900), (0, 900)],
        c(dark, 120),
    )


def clouds(draw, y=150, color=(255, 255, 255), alpha=115):
    for x in [140, 430, 1120, 1360]:
        ellipse(draw, (x, y, x + 180, y + 60), c(color, alpha))
        ellipse(draw, (x + 70, y - 25, x + 235, y + 55), c(color, alpha))
        ellipse(draw, (x + 155, y, x + 310, y + 65), c(color, alpha))


def tree(draw, x, y, scale=1.0, trunk=(92, 69, 43), leaves=(54, 124, 68), fruit=False):
    w = 26 * scale
    h = 170 * scale
    poly(draw, [(x - w / 2, y), (x + w / 2, y), (x + w / 3, y - h), (x - w / 3, y - h)], c(trunk, 255))
    blobs = [(-55, -160, 75, 62), (25, -185, 92, 72), (95, -140, 72, 58), (-5, -105, 105, 70), (-100, -105, 64, 50)]
    for dx, dy, rx, ry in blobs:
        ellipse(
            draw,
            (x + dx * scale - rx * scale, y + dy * scale - ry * scale,
             x + dx * scale + rx * scale, y + dy * scale + ry * scale),
            c(leaves, 235),
        )
    if fruit:
        for dx, dy in [(-34, -144), (42, -158), (72, -110), (-82, -98), (8, -205)]:
            ellipse(
                draw,
                (x + dx * scale - 9 * scale, y + dy * scale - 9 * scale,
                 x + dx * scale + 9 * scale, y + dy * scale + 9 * scale),
                c((199, 75, 70), 245),
            )


def person(draw, x, y, scale=1.0, fill=(43, 48, 54), alpha=225, pose="stand"):
    color = c(fill, alpha)
    ellipse(draw, (x - 16 * scale, y - 82 * scale, x + 16 * scale, y - 50 * scale), color)
    poly(draw, [(x - 20 * scale, y - 48 * scale), (x + 20 * scale, y - 48 * scale),
                (x + 36 * scale, y + 28 * scale), (x - 36 * scale, y + 28 * scale)], color)
    if pose == "walk":
        line(draw, [(x - 10 * scale, y + 24 * scale), (x - 31 * scale, y + 75 * scale)], color, 8 * scale)
        line(draw, [(x + 11 * scale, y + 24 * scale), (x + 36 * scale, y + 72 * scale)], color, 8 * scale)
    else:
        line(draw, [(x - 12 * scale, y + 24 * scale), (x - 25 * scale, y + 72 * scale)], color, 8 * scale)
        line(draw, [(x + 12 * scale, y + 24 * scale), (x + 25 * scale, y + 72 * scale)], color, 8 * scale)
    line(draw, [(x - 22 * scale, y - 28 * scale), (x - 56 * scale, y + 5 * scale)], color, 7 * scale)
    line(draw, [(x + 22 * scale, y - 28 * scale), (x + 56 * scale, y + 5 * scale)], color, 7 * scale)


def family_group(draw, x, y, n=5, scale=0.75, fill=(43, 48, 54), alpha=210):
    offsets = [-80, -38, 0, 42, 84, 120, 158, 198]
    for i in range(n):
        s = scale * (0.78 if i % 3 == 2 else 1.0)
        person(draw, x + offsets[i], y + (8 if i % 2 else 0), s, fill, alpha, "stand")


def sheep(draw, x, y, scale=1.0, fill=(246, 239, 217)):
    ellipse(draw, (x - 44 * scale, y - 28 * scale, x + 42 * scale, y + 24 * scale), c(fill, 245))
    ellipse(draw, (x + 29 * scale, y - 14 * scale, x + 66 * scale, y + 17 * scale), c((62, 58, 52), 230))
    for lx in [-28, -2, 24, 46]:
        line(draw, [(x + lx * scale, y + 15 * scale), (x + (lx - 5) * scale, y + 48 * scale)], c((57, 52, 47), 230), 5 * scale)


def deer(draw, x, y, scale=1.0):
    ellipse(draw, (x - 52 * scale, y - 25 * scale, x + 50 * scale, y + 20 * scale), c((128, 85, 54), 235))
    ellipse(draw, (x + 35 * scale, y - 48 * scale, x + 78 * scale, y - 14 * scale), c((128, 85, 54), 235))
    for lx in [-28, 10, 42]:
        line(draw, [(x + lx * scale, y + 13 * scale), (x + (lx - 10) * scale, y + 62 * scale)], c((81, 58, 43), 235), 6 * scale)
    line(draw, [(x + 68 * scale, y - 44 * scale), (x + 87 * scale, y - 75 * scale)], c((81, 58, 43), 210), 3 * scale)
    line(draw, [(x + 68 * scale, y - 44 * scale), (x + 55 * scale, y - 74 * scale)], c((81, 58, 43), 210), 3 * scale)


def bird(draw, x, y, scale=1.0, fill=(247, 247, 237)):
    line(draw, [(x - 40 * scale, y), (x - 10 * scale, y - 18 * scale), (x + 12 * scale, y)], c(fill, 230), 5 * scale)
    line(draw, [(x + 10 * scale, y), (x + 40 * scale, y - 18 * scale), (x + 70 * scale, y)], c(fill, 230), 5 * scale)


def dove(draw, x, y, scale=1.0):
    ellipse(draw, (x - 38 * scale, y - 18 * scale, x + 34 * scale, y + 22 * scale), c((251, 250, 239), 255))
    ellipse(draw, (x + 20 * scale, y - 36 * scale, x + 54 * scale, y - 4 * scale), c((251, 250, 239), 255))
    poly(draw, [(x - 20 * scale, y - 7 * scale), (x - 120 * scale, y - 58 * scale), (x - 38 * scale, y + 22 * scale)], c((251, 250, 239), 240))
    poly(draw, [(x + 10 * scale, y - 5 * scale), (x + 110 * scale, y - 60 * scale), (x + 35 * scale, y + 20 * scale)], c((251, 250, 239), 240))
    poly(draw, [(x + 54 * scale, y - 20 * scale), (x + 76 * scale, y - 14 * scale), (x + 54 * scale, y - 7 * scale)], c((232, 175, 78), 255))
    line(draw, [(x + 75 * scale, y - 14 * scale), (x + 120 * scale, y - 42 * scale)], c((68, 124, 72), 255), 5 * scale)
    ellipse(draw, (x + 108 * scale, y - 58 * scale, x + 145 * scale, y - 35 * scale), c((84, 152, 84), 230))


def serpent(draw, x, y, scale=1.0, fill=(51, 116, 78), eye=False):
    points = []
    for i in range(80):
        t = i / 79
        points.append((x + (t * 260 - 130) * scale, y + math.sin(t * math.pi * 3) * 32 * scale))
    line(draw, points, c(fill, 235), 18 * scale)
    ellipse(draw, (x + 126 * scale, y - 24 * scale, x + 177 * scale, y + 23 * scale), c(fill, 245))
    if eye:
        ellipse(draw, (x + 154 * scale, y - 6 * scale, x + 160 * scale, y), c((255, 236, 165), 255))


def ark(draw, x, y, scale=1.0, door=True, frame=False):
    if frame:
        for i in range(8):
            xx = x + i * 58 * scale
            line(draw, [(xx, y), (xx + 30 * scale, y - 190 * scale)], c(PALETTE["wood"], 245), 9 * scale)
        line(draw, [(x - 20 * scale, y), (x + 520 * scale, y)], c(PALETTE["wood"], 245), 13 * scale)
        line(draw, [(x + 35 * scale, y - 105 * scale), (x + 470 * scale, y - 105 * scale)], c(PALETTE["wood"], 220), 8 * scale)
        line(draw, [(x + 60 * scale, y - 190 * scale), (x + 410 * scale, y - 190 * scale)], c(PALETTE["wood"], 220), 8 * scale)
        return
    hull = [(x - 360 * scale, y), (x + 360 * scale, y), (x + 300 * scale, y + 90 * scale), (x - 290 * scale, y + 100 * scale)]
    draw.polygon([(int(a), int(b)) for a, b in hull], fill=c(PALETTE["wood"], 250))
    rect(draw, (x - 260 * scale, y - 90 * scale, x + 235 * scale, y + 4 * scale), c((138, 91, 55), 250))
    poly(draw, [(x - 275 * scale, y - 90 * scale), (x + 250 * scale, y - 90 * scale), (x + 165 * scale, y - 165 * scale), (x - 200 * scale, y - 160 * scale)], c((95, 62, 45), 255))
    if door:
        rect(draw, (x - 45 * scale, y - 65 * scale, x + 45 * scale, y + 35 * scale), c((58, 42, 34), 245))
    for yy in [-55, -20, 18, 58]:
        line(draw, [(x - 300 * scale, y + yy * scale), (x + 310 * scale, y + (yy - 10) * scale)], c((82, 55, 42), 120), 3 * scale)


def altar(draw, x, y, scale=1.0, fire=True):
    for i in range(4):
        ellipse(draw, (x - 70 * scale + i * 38 * scale, y - i * 13 * scale, x - 20 * scale + i * 38 * scale, y + 28 * scale - i * 13 * scale), c((104, 91, 77), 250))
    rect(draw, (x - 85 * scale, y + 20 * scale, x + 90 * scale, y + 62 * scale), c((94, 82, 70), 255))
    if fire:
        poly(draw, [(x, y - 70 * scale), (x - 35 * scale, y + 20 * scale), (x + 32 * scale, y + 20 * scale)], c((248, 136, 59), 230))
        poly(draw, [(x + 4 * scale, y - 48 * scale), (x - 14 * scale, y + 16 * scale), (x + 25 * scale, y + 15 * scale)], c((255, 226, 111), 240))


def mountains(draw, y=470):
    poly(draw, [(0, y + 120), (210, y - 80), (420, y + 110), (600, y - 20), (810, y + 125), (1070, y - 150), (1330, y + 135), (1600, y - 40), (1600, 900), (0, 900)], c((112, 137, 139), 255))
    poly(draw, [(680, y + 95), (1070, y - 150), (1265, y + 105)], c((238, 243, 236), 155))
    poly(draw, [(0, y + 160), (230, y - 5), (520, y + 150), (790, y + 25), (1060, y + 160), (1300, y + 35), (1600, y + 150), (1600, 900), (0, 900)], c((92, 126, 113), 230))


def map_background(draw):
    rect(draw, (0, 0, W, H), c((222, 204, 161), 255))
    for _ in range(12):
        x = random.randint(0, W)
        y = random.randint(0, H)
        r = random.randint(80, 210)
        ellipse(draw, (x - r, y - r, x + r, y + r), c((238, 223, 183), 38))
    for x in [250, 620, 970, 1300]:
        line(draw, [(x, 75), (x + random.randint(-90, 90), 830)], c((157, 122, 83), 55), 3)
    for y in [180, 430, 690]:
        line(draw, [(70, y), (1530, y + random.randint(-35, 35))], c((157, 122, 83), 50), 3)


def route(draw, points, color, width=7):
    line(draw, points, c(color, 200), width)
    for x, y in points[1::2]:
        ellipse(draw, (x - 13, y - 13, x + 13, y + 13), c(color, 220))


def city(draw, x, y, scale=1.0):
    rect(draw, (x - 70 * scale, y - 65 * scale, x + 72 * scale, y + 48 * scale), c((160, 116, 75), 250))
    for i in range(4):
        rect(draw, (x - 64 * scale + i * 38 * scale, y - 100 * scale, x - 32 * scale + i * 38 * scale, y - 55 * scale), c((139, 94, 64), 250))
    rect(draw, (x - 20 * scale, y - 10 * scale, x + 20 * scale, y + 48 * scale), c((72, 54, 48), 230))


def scene_creation_begins():
    image = new_canvas((5, 10, 23), (22, 39, 70))
    draw = ImageDraw.Draw(image, "RGBA")
    image = radial_glow(image, (590, 320), 420, PALETTE["gold"], 155)
    draw = ImageDraw.Draw(image, "RGBA")
    water(draw, 570, (24, 61, 94), (7, 18, 33))
    poly(draw, [(0, 450), (250, 405), (520, 468), (790, 410), (1050, 462), (1600, 420), (1600, 560), (0, 560)], c((9, 17, 31), 120))
    line(draw, [(330, 375), (505, 295), (730, 312), (895, 370)], c((255, 229, 142), 135), 10)
    clouds(draw, 90, (255, 236, 180), 45)
    return overlay_texture(image)


def scene_light_over_darkness():
    image = new_canvas((8, 12, 30), (30, 55, 84))
    draw = ImageDraw.Draw(image, "RGBA")
    poly(draw, [(0, 0), (880, 0), (1600, 225), (1600, 450), (1075, 420), (610, 280), (0, 168)], c((255, 225, 129), 115))
    image = radial_glow(image, (250, 210), 360, (255, 243, 174), 230)
    draw = ImageDraw.Draw(image, "RGBA")
    water(draw, 590, (47, 117, 153), (17, 49, 80))
    for i in range(8):
        line(draw, [(120 + i * 135, 475 + i % 2 * 12), (205 + i * 135, 455), (305 + i * 135, 470)], c((255, 242, 175), 72), 5)
    return overlay_texture(image)


def scene_day_and_night():
    image = new_canvas((107, 190, 219), (251, 219, 158))
    draw = ImageDraw.Draw(image, "RGBA")
    rect(draw, (795, 0, 1600, 900), c((30, 37, 80), 255))
    for i in range(0, 900, 80):
        ellipse(draw, (735 - i * 0.06, i - 130, 860 + i * 0.06, i + 130), c((255, 239, 180), 28))
    land(draw, 610, (80, 143, 88), (143, 185, 115))
    rect(draw, (0, 690, 1600, 900), c((74, 126, 85), 230))
    poly(draw, [(725, 0), (865, 0), (810, 900), (690, 900)], c((255, 244, 194), 92))
    tree(draw, 320, 650, 0.9, (87, 68, 49), (66, 142, 82), False)
    tree(draw, 1125, 660, 0.9, (45, 48, 55), (44, 84, 78), False)
    for x, y in [(1040, 165), (1195, 110), (1390, 225), (1298, 320)]:
        ellipse(draw, (x - 4, y - 4, x + 4, y + 4), c((251, 249, 223), 210))
    return overlay_texture(image)


def scene_great_lights():
    image = new_canvas((48, 72, 119), (13, 25, 55))
    draw = ImageDraw.Draw(image, "RGBA")
    image = radial_glow(image, (425, 245), 270, (255, 222, 97), 190)
    draw = ImageDraw.Draw(image, "RGBA")
    ellipse(draw, (330, 155, 520, 345), c((255, 222, 89), 255))
    ellipse(draw, (1060, 135, 1200, 275), c((243, 240, 213), 225))
    ellipse(draw, (1033, 119, 1160, 246), c((48, 72, 119), 255))
    for x, y, r in [(820, 160, 5), (930, 240, 4), (1335, 170, 6), (1240, 330, 4), (700, 330, 3), (1480, 290, 5)]:
        ellipse(draw, (x - r, y - r, x + r, y + r), c((250, 250, 226), 225))
    for x in [0, 150, 1380, 1520]:
        tree(draw, x, 900, 2.1, (42, 51, 54), (38, 96, 74), False)
    line(draw, [(0, 680), (350, 645), (720, 680), (1090, 642), (1600, 675)], c((89, 129, 96), 190), 8)
    return overlay_texture(image)


def scene_very_good_creation():
    image = new_canvas((123, 204, 235), (255, 232, 177))
    draw = ImageDraw.Draw(image, "RGBA")
    mountains(draw, 450)
    water(draw, 585, (83, 169, 186), (50, 119, 141))
    land(draw, 665, (92, 158, 92), (145, 191, 107))
    tree(draw, 175, 720, 1.1, (84, 67, 45), (58, 139, 79), True)
    tree(draw, 1360, 725, 1.15, (84, 67, 45), (53, 129, 84), False)
    sheep(draw, 1030, 710, 0.8)
    deer(draw, 1215, 700, 0.75)
    bird(draw, 1000, 250, 1.0)
    bird(draw, 1080, 300, 0.7)
    person(draw, 720, 700, 0.75, (41, 48, 54), 210)
    person(draw, 800, 700, 0.72, (41, 48, 54), 210)
    image = radial_glow(image, (760, 570), 290, (255, 226, 145), 70)
    return overlay_texture(image)


def scene_sabbath_rest():
    image = new_canvas((145, 205, 222), (255, 238, 188))
    draw = ImageDraw.Draw(image, "RGBA")
    image = radial_glow(image, (800, 385), 460, (255, 240, 180), 115)
    draw = ImageDraw.Draw(image, "RGBA")
    mountains(draw, 500)
    water(draw, 615, (94, 171, 190), (52, 112, 145))
    land(draw, 680, (91, 154, 88), (153, 191, 123))
    for x in [260, 1320]:
        tree(draw, x, 725, 1.05, (92, 70, 48), (58, 137, 83), False)
    for x in [520, 600, 680, 760, 840, 920, 1000]:
        ellipse(draw, (x - 20, 705, x + 20, 730), c((238, 218, 165), 180))
    return overlay_texture(image)


def scene_breath_of_life():
    image = new_canvas((72, 125, 151), (231, 202, 151))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 650, (135, 102, 72), (170, 132, 88))
    image = radial_glow(image, (730, 420), 330, (255, 232, 170), 165)
    draw = ImageDraw.Draw(image, "RGBA")
    ellipse(draw, (660, 405, 790, 535), c((71, 60, 49), 125))
    poly(draw, [(650, 535), (805, 535), (860, 745), (602, 745)], c((65, 55, 48), 150))
    for _ in range(260):
        x = random.gauss(735, 145)
        y = random.gauss(560, 105)
        r = random.uniform(2, 8)
        ellipse(draw, (x - r, y - r, x + r, y + r), c((156, 118, 79), random.randint(55, 130)))
    line(draw, [(1095, 255), (1000, 310), (930, 390), (838, 468)], c((255, 244, 197), 160), 13)
    line(draw, [(1115, 330), (1000, 390), (910, 452), (825, 520)], c((255, 226, 145), 100), 7)
    return overlay_texture(image)


def scene_garden_rivers():
    image = new_canvas((139, 205, 212), (235, 219, 162))
    draw = ImageDraw.Draw(image, "RGBA")
    rect(draw, (0, 0, 1600, 900), c((105, 169, 100), 255))
    image = radial_glow(image, (780, 405), 390, (255, 235, 162), 95)
    draw = ImageDraw.Draw(image, "RGBA")
    ellipse(draw, (720, 330, 880, 490), c((79, 168, 194), 240))
    rivers = [
        [(800, 410), (610, 350), (380, 250), (90, 165)],
        [(800, 410), (590, 475), (350, 590), (80, 745)],
        [(800, 410), (1005, 365), (1270, 260), (1540, 185)],
        [(800, 410), (1015, 505), (1230, 660), (1510, 785)],
    ]
    for pts in rivers:
        line(draw, pts, c((67, 154, 191), 240), 38)
        line(draw, pts, c((221, 246, 247), 70), 10)
    for x, y in [(300, 370), (475, 690), (1040, 650), (1190, 350), (710, 220), (915, 250), (615, 525)]:
        tree(draw, x, y, 0.55, (92, 70, 48), (47, 124, 72), True)
    return overlay_texture(image)


def scene_right_helper():
    image = new_canvas((115, 198, 218), (253, 226, 176))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 665, (93, 154, 90), (143, 189, 111))
    tree(draw, 260, 735, 1.25, (86, 67, 45), (61, 137, 84), True)
    tree(draw, 1315, 735, 1.15, (86, 67, 45), (55, 126, 83), False)
    image = radial_glow(image, (820, 500), 310, (255, 230, 158), 130)
    draw = ImageDraw.Draw(image, "RGBA")
    person(draw, 735, 690, 0.82, (42, 49, 54), 215)
    person(draw, 845, 690, 0.82, (42, 49, 54), 215)
    line(draw, [(775, 645), (805, 645)], c((42, 49, 54), 210), 7)
    return overlay_texture(image)


def scene_serpent_question():
    image = new_canvas((105, 186, 184), (231, 207, 141))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 690, (76, 142, 78), (132, 183, 102))
    tree(draw, 795, 745, 1.6, (88, 64, 43), (45, 123, 70), True)
    serpent(draw, 760, 438, 0.72, (43, 111, 74), True)
    person(draw, 505, 690, 0.78, (42, 49, 54), 210)
    image = radial_glow(image, (690, 450), 270, (255, 232, 145), 70)
    return overlay_texture(image)


def scene_fruit_choice():
    image = new_canvas((87, 161, 158), (218, 190, 135))
    draw = ImageDraw.Draw(image, "RGBA")
    tree(draw, 1000, 825, 2.0, (84, 60, 42), (46, 116, 67), True)
    land(draw, 720, (67, 125, 73), (112, 166, 97))
    ellipse(draw, (790, 365, 900, 475), c((198, 73, 68), 255))
    ellipse(draw, (818, 392, 858, 432), c((255, 224, 163), 72))
    person(draw, 420, 705, 0.55, (41, 48, 54), 180)
    person(draw, 505, 705, 0.55, (41, 48, 54), 180)
    serpent(draw, 1120, 610, 0.45, (42, 101, 70), False)
    image = radial_glow(image, (845, 420), 190, (255, 218, 142), 90)
    return overlay_texture(image)


def scene_hiding_among_trees():
    image = new_canvas((64, 116, 137), (148, 130, 104))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 700, (52, 101, 70), (86, 137, 85))
    for x in [120, 340, 570, 880, 1120, 1390]:
        tree(draw, x, 805, 1.35, (59, 54, 45), (37, 94, 65), False)
    person(draw, 665, 715, 0.55, (34, 39, 44), 190)
    person(draw, 755, 718, 0.55, (34, 39, 44), 190)
    image = radial_glow(image, (230, 220), 320, (255, 220, 146), 70)
    return overlay_texture(image)


def scene_promise_over_serpent():
    image = new_canvas((109, 153, 150), (218, 195, 145))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 650, (91, 130, 83), (134, 166, 107))
    serpent(draw, 785, 690, 1.05, (48, 90, 66), False)
    person(draw, 520, 625, 0.65, (43, 48, 54), 180)
    person(draw, 1040, 625, 0.65, (43, 48, 54), 180)
    line(draw, [(390, 345), (620, 265), (850, 300), (1100, 230), (1360, 260)], c((255, 228, 136), 145), 12)
    image = radial_glow(image, (850, 310), 320, (255, 232, 151), 85)
    return overlay_texture(image)


def scene_guarded_eden():
    image = new_canvas((70, 117, 144), (232, 191, 130))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 685, (78, 121, 78), (127, 163, 93))
    rect(draw, (590, 230, 1010, 720), c((44, 87, 73), 210))
    for x in [585, 1015]:
        tree(draw, x, 760, 1.8, (72, 55, 41), (42, 107, 67), False)
    for side in [-1, 1]:
        poly(draw, [(800, 330), (800 + side * 210, 245), (800 + side * 150, 395)], c((255, 220, 112), 145))
        poly(draw, [(800, 410), (800 + side * 240, 345), (800 + side * 170, 500)], c((255, 235, 166), 110))
    line(draw, [(800, 260), (800, 620)], c((255, 158, 74), 220), 18)
    line(draw, [(735, 330), (870, 545)], c((255, 225, 107), 130), 9)
    person(draw, 505, 735, 0.55, (43, 48, 54), 190)
    person(draw, 1095, 735, 0.55, (43, 48, 54), 190)
    return overlay_texture(image)


def scene_offerings():
    image = new_canvas((125, 182, 190), (231, 198, 146))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 650, (106, 136, 83), (154, 173, 107))
    tree(draw, 1250, 715, 0.9, (91, 68, 45), (63, 132, 77), False)
    person(draw, 500, 660, 0.65, (43, 48, 54), 210)
    person(draw, 1020, 660, 0.65, (43, 48, 54), 210)
    rect(draw, (360, 665, 520, 720), c((125, 82, 49), 220))
    for x in [385, 420, 456, 490]:
        line(draw, [(x, 660), (x - 12, 610)], c((220, 181, 80), 235), 5)
    sheep(draw, 1085, 680, 0.72)
    sheep(draw, 1160, 696, 0.55)
    image = radial_glow(image, (805, 430), 280, (255, 230, 151), 75)
    return overlay_texture(image)


def scene_sin_at_the_door():
    image = new_canvas((83, 132, 147), (198, 164, 120))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 700, (103, 112, 76), (146, 141, 92))
    rect(draw, (675, 250, 1080, 735), c((139, 93, 59), 250))
    rect(draw, (780, 405, 980, 735), c((58, 45, 42), 245))
    ellipse(draw, (790, 642, 980, 735), c((28, 31, 35), 185))
    ellipse(draw, (910, 610, 1000, 685), c((28, 31, 35), 185))
    person(draw, 520, 695, 0.74, (43, 48, 54), 210)
    image = radial_glow(image, (450, 410), 250, (255, 222, 130), 80)
    return overlay_texture(image)


def scene_field_before_violence():
    image = new_canvas((129, 181, 193), (229, 184, 136))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 650, (129, 128, 78), (169, 159, 93))
    for x in range(0, 1600, 90):
        line(draw, [(x, 710), (x + 95, 890)], c((105, 94, 60), 55), 2)
    person(draw, 690, 665, 0.65, (44, 49, 53), 205, "walk")
    person(draw, 810, 667, 0.65, (44, 49, 53), 205, "walk")
    line(draw, [(682, 725), (585, 805)], c((44, 49, 53), 75), 10)
    line(draw, [(805, 728), (930, 812)], c((44, 49, 53), 75), 10)
    return overlay_texture(image)


def scene_seth_family_prayer():
    image = new_canvas((91, 146, 160), (224, 187, 130))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 700, (91, 126, 84), (139, 158, 106))
    rect(draw, (250, 525, 560, 735), c((126, 83, 56), 210))
    poly(draw, [(215, 525), (600, 525), (500, 410), (310, 410)], c((91, 67, 51), 245))
    family_group(draw, 895, 705, 6, 0.58, (42, 48, 54), 205)
    altar(draw, 745, 675, 0.55, True)
    image = radial_glow(image, (760, 545), 260, (255, 215, 127), 110)
    return overlay_texture(image)


def scene_family_line():
    image = new_canvas((227, 206, 160), (195, 165, 118))
    draw = ImageDraw.Draw(image, "RGBA")
    rect(draw, (145, 105, 1455, 790), c((236, 218, 172), 230))
    rect(draw, (185, 145, 1415, 750), c((246, 230, 184), 235))
    nodes = [(800, 235), (600, 355), (1000, 355), (455, 495), (705, 495), (900, 495), (1145, 495), (360, 635), (550, 635), (745, 635), (940, 635), (1125, 635), (1280, 635)]
    for a, b in [(0, 1), (0, 2), (1, 3), (1, 4), (1, 5), (2, 6), (3, 7), (3, 8), (4, 9), (5, 10), (6, 11), (6, 12)]:
        line(draw, [nodes[a], nodes[b]], c((121, 88, 61), 120), 5)
    for x, y in nodes:
        ellipse(draw, (x - 28, y - 28, x + 28, y + 28), c((110, 90, 69), 210))
        ellipse(draw, (x - 10, y - 15, x + 10, y + 5), c((246, 230, 184), 160))
    return overlay_texture(image)


def scene_enoch_walks():
    image = new_canvas((91, 153, 178), (226, 201, 151))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 705, (91, 137, 89), (143, 174, 110))
    line(draw, [(260, 900), (520, 740), (790, 615), (1060, 500), (1360, 375)], c((226, 200, 143), 220), 62)
    person(draw, 760, 625, 0.85, (43, 48, 54), 215, "walk")
    image = radial_glow(image, (925, 350), 360, (255, 235, 172), 130)
    draw = ImageDraw.Draw(image, "RGBA")
    line(draw, [(910, 160), (860, 300), (815, 435), (780, 555)], c((255, 245, 199), 150), 10)
    return overlay_texture(image)


def scene_noah_named():
    image = new_canvas((80, 108, 126), (213, 173, 126))
    draw = ImageDraw.Draw(image, "RGBA")
    rect(draw, (0, 520, 1600, 900), c((108, 81, 59), 255))
    poly(draw, [(0, 520), (1600, 520), (1370, 335), (250, 335)], c((90, 66, 52), 245))
    image = radial_glow(image, (805, 565), 310, (255, 214, 134), 145)
    draw = ImageDraw.Draw(image, "RGBA")
    family_group(draw, 620, 705, 3, 0.65, (43, 48, 54), 205)
    ellipse(draw, (820, 628, 1020, 725), c((235, 207, 157), 235))
    ellipse(draw, (887, 625, 955, 685), c((72, 64, 59), 185))
    return overlay_texture(image)


def scene_noah_faithful():
    image = new_canvas((70, 108, 130), (202, 168, 126))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 705, (97, 113, 78), (139, 141, 96))
    for x in [230, 1240, 1420]:
        rect(draw, (x, 525, x + 170, 720), c((90, 72, 58), 170))
        poly(draw, [(x - 25, 525), (x + 195, 525), (x + 125, 430), (x + 45, 430)], c((70, 58, 52), 190))
    person(draw, 745, 695, 0.8, (43, 48, 54), 220, "walk")
    family_group(draw, 870, 705, 3, 0.5, (43, 48, 54), 195)
    image = radial_glow(image, (760, 425), 270, (255, 231, 160), 100)
    return overlay_texture(image)


def scene_ark_building():
    image = new_canvas((125, 177, 187), (225, 190, 137))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 705, (124, 128, 82), (163, 160, 96))
    ark(draw, 535, 665, 1.0, frame=True)
    for x in [360, 760, 1035]:
        person(draw, x, 715, 0.48, (43, 48, 54), 205, "walk")
    for x in [980, 1060, 1140, 1220]:
        rect(draw, (x, 720, x + 110, 738), c(PALETTE["wood"], 230))
    image = radial_glow(image, (705, 395), 310, (255, 222, 145), 70)
    return overlay_texture(image)


def scene_creatures_gather():
    image = new_canvas((118, 176, 188), (227, 194, 142))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 700, (104, 143, 83), (158, 174, 100))
    ark(draw, 965, 590, 0.72, door=True)
    sheep(draw, 365, 730, 0.55)
    sheep(draw, 430, 745, 0.5)
    deer(draw, 555, 725, 0.55)
    deer(draw, 635, 732, 0.48)
    bird(draw, 480, 300, 0.8)
    bird(draw, 580, 340, 0.65)
    person(draw, 820, 700, 0.5, (43, 48, 54), 200)
    return overlay_texture(image)


def scene_family_enters_ark():
    image = new_canvas((105, 158, 173), (218, 183, 132))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 705, (115, 128, 80), (157, 153, 96))
    ark(draw, 900, 600, 0.85, door=True)
    family_group(draw, 515, 720, 6, 0.52, (43, 48, 54), 210)
    line(draw, [(480, 745), (620, 710), (760, 670), (865, 628)], c((224, 197, 137), 210), 44)
    image = radial_glow(image, (870, 525), 180, (255, 222, 139), 100)
    return overlay_texture(image)


def scene_animals_enter_pairs():
    image = new_canvas((118, 176, 188), (226, 195, 145))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 705, (113, 142, 84), (155, 172, 99))
    ark(draw, 1110, 580, 0.78, door=True)
    for x, s in [(235, 0.55), (320, 0.55)]:
        sheep(draw, x, 735, s)
    for x, s in [(455, 0.55), (540, 0.55)]:
        deer(draw, x, 725, s)
    for x, s in [(705, 0.8), (835, 0.8)]:
        ellipse(draw, (x - 55, 690, x + 60, 745), c((115, 95, 73), 235))
        line(draw, [(x + 50, 700), (x + 85, 660)], c((115, 95, 73), 235), 12)
        line(draw, [(x - 20, 742), (x - 35, 785)], c((88, 70, 55), 235), 7)
        line(draw, [(x + 30, 742), (x + 44, 785)], c((88, 70, 55), 235), 7)
    bird(draw, 595, 310, 0.8)
    bird(draw, 685, 340, 0.72)
    return overlay_texture(image)


def scene_ark_door_closed():
    image = new_canvas((88, 118, 126), (177, 141, 105))
    draw = ImageDraw.Draw(image, "RGBA")
    rect(draw, (0, 0, 1600, 900), c((102, 70, 48), 255))
    for x in range(-30, 1660, 130):
        line(draw, [(x, 0), (x - 90, 900)], c((70, 48, 38), 75), 8)
    rect(draw, (520, 170, 1080, 810), c((77, 51, 40), 255), c((40, 31, 29), 255), 8)
    rect(draw, (610, 245, 990, 755), c((94, 62, 43), 245))
    line(draw, [(800, 255), (800, 748)], c((255, 210, 112), 180), 12)
    for y in [345, 475, 615]:
        line(draw, [(618, y), (982, y - 10)], c((64, 45, 37), 120), 5)
    return overlay_texture(image)


def scene_waters_lift_ark():
    image = new_canvas((48, 67, 104), (69, 101, 130))
    draw = ImageDraw.Draw(image, "RGBA")
    for _ in range(85):
        line(draw, [(random.randint(0, 1600), random.randint(0, 650)), (random.randint(-50, 1650), random.randint(120, 900))], c((215, 232, 240), 50), 2)
    water(draw, 575, (60, 128, 165), (30, 75, 117))
    ark(draw, 820, 500, 0.72, door=False)
    line(draw, [(60, 705), (280, 650), (510, 708), (760, 660), (1000, 710), (1240, 655), (1550, 715)], c((238, 250, 255), 90), 13)
    return overlay_texture(image)


def scene_ark_on_ararat():
    image = new_canvas((103, 159, 186), (219, 207, 174))
    draw = ImageDraw.Draw(image, "RGBA")
    mountains(draw, 500)
    water(draw, 665, (75, 150, 178), (52, 112, 143))
    ark(draw, 855, 500, 0.55, door=False)
    image = radial_glow(image, (1040, 190), 310, (255, 231, 157), 95)
    return overlay_texture(image)


def scene_dove_olive_leaf():
    image = new_canvas((83, 142, 170), (224, 196, 143))
    draw = ImageDraw.Draw(image, "RGBA")
    rect(draw, (0, 0, 1600, 900), c((109, 75, 51), 255))
    rect(draw, (140, 150, 1460, 780), c((60, 128, 160), 255))
    water(draw, 650, (76, 157, 181), (43, 104, 138))
    mountains(draw, 570)
    rect(draw, (100, 100, 1500, 170), c((83, 55, 42), 255))
    rect(draw, (100, 730, 1500, 810), c((83, 55, 42), 255))
    rect(draw, (100, 100, 170, 810), c((83, 55, 42), 255))
    rect(draw, (1430, 100, 1500, 810), c((83, 55, 42), 255))
    dove(draw, 840, 390, 1.75)
    line(draw, [(330, 680), (455, 585)], c((43, 48, 54), 155), 22)
    return overlay_texture(image)


def scene_leaving_ark():
    image = new_canvas((126, 190, 205), (238, 215, 164))
    draw = ImageDraw.Draw(image, "RGBA")
    mountains(draw, 515)
    land(draw, 670, (92, 153, 88), (145, 185, 110))
    ark(draw, 1035, 550, 0.76, door=True)
    family_group(draw, 635, 720, 6, 0.48, (43, 48, 54), 205)
    sheep(draw, 370, 735, 0.55)
    deer(draw, 465, 725, 0.52)
    bird(draw, 730, 350, 0.7)
    return overlay_texture(image)


def scene_altar_after_rescue():
    image = new_canvas((121, 179, 194), (231, 197, 142))
    draw = ImageDraw.Draw(image, "RGBA")
    mountains(draw, 525)
    land(draw, 680, (102, 140, 85), (151, 170, 105))
    ark(draw, 1190, 585, 0.55, door=False)
    altar(draw, 745, 665, 0.85, True)
    family_group(draw, 535, 720, 6, 0.5, (43, 48, 54), 205)
    line(draw, [(760, 590), (740, 505), (772, 430), (745, 360)], c((236, 231, 206), 95), 12)
    image = radial_glow(image, (750, 580), 250, (255, 214, 128), 85)
    return overlay_texture(image)


def scene_life_is_precious():
    image = new_canvas((128, 190, 203), (237, 215, 163))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 680, (91, 153, 89), (144, 184, 113))
    tree(draw, 1280, 735, 0.9, (87, 66, 45), (61, 133, 84), False)
    family_group(draw, 780, 705, 8, 0.55, (43, 48, 54), 205)
    ellipse(draw, (755, 735, 845, 795), c((86, 148, 83), 230))
    line(draw, [(800, 750), (800, 690)], c((55, 118, 69), 8), 10)
    image = radial_glow(image, (805, 430), 330, (255, 231, 160), 115)
    return overlay_texture(image)


def scene_rainbow_covenant():
    image = new_canvas((117, 176, 205), (232, 217, 175))
    draw = ImageDraw.Draw(image, "RGBA")
    mountains(draw, 520)
    land(draw, 675, (94, 153, 89), (143, 184, 110))
    water(draw, 680, (80, 162, 186), (51, 120, 145))
    colors = [(210, 77, 77), (239, 151, 72), (245, 217, 91), (87, 169, 87), (76, 147, 211), (118, 98, 181)]
    for i, color in enumerate(colors):
        draw.arc((sc(120 + i * 28), sc(110 + i * 28), sc(1480 - i * 28), sc(1540 - i * 28)), 180, 360, fill=c(color, 190), width=sc(21))
    family_group(draw, 750, 735, 6, 0.45, (43, 48, 54), 205)
    sheep(draw, 1085, 740, 0.45)
    bird(draw, 565, 345, 0.7)
    return overlay_texture(image)


def scene_respectful_covering():
    image = new_canvas((94, 135, 145), (204, 169, 121))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 720, (116, 121, 78), (148, 146, 90))
    poly(draw, [(500, 730), (1100, 730), (995, 370), (605, 370)], c((119, 82, 57), 245))
    poly(draw, [(460, 370), (1140, 370), (985, 245), (615, 245)], c((83, 61, 50), 255))
    rect(draw, (650, 445, 950, 730), c((55, 42, 39), 240))
    poly(draw, [(660, 560), (940, 525), (990, 680), (610, 700)], c((225, 202, 157), 245))
    person(draw, 570, 710, 0.56, (43, 48, 54), 210)
    person(draw, 1040, 710, 0.56, (43, 48, 54), 210)
    person(draw, 1220, 720, 0.42, (43, 48, 54), 120)
    return overlay_texture(image)


def scene_coastlands_spread():
    image = new_canvas((221, 204, 162), (201, 176, 128))
    draw = ImageDraw.Draw(image, "RGBA")
    map_background(draw)
    poly(draw, [(0, 0), (380, 0), (310, 170), (430, 315), (250, 460), (370, 655), (180, 900), (0, 900)], c((83, 157, 177), 155))
    poly(draw, [(1190, 0), (1600, 0), (1600, 900), (1320, 900), (1410, 720), (1280, 520), (1390, 345), (1255, 175)], c((83, 157, 177), 145))
    route(draw, [(820, 485), (670, 420), (510, 340), (380, 245)], (169, 93, 71))
    route(draw, [(830, 500), (700, 590), (540, 700), (360, 805)], (91, 139, 92))
    route(draw, [(840, 475), (990, 390), (1170, 290), (1340, 205)], (96, 116, 176))
    for x, y in [(390, 245), (540, 700), (1170, 290), (700, 590), (990, 390)]:
        family_group(draw, x, y, 3, 0.16, (54, 55, 53), 210)
    return overlay_texture(image)


def scene_early_cities():
    image = new_canvas((132, 170, 181), (219, 179, 128))
    draw = ImageDraw.Draw(image, "RGBA")
    land(draw, 705, (143, 119, 78), (173, 142, 91))
    city(draw, 420, 640, 0.9)
    city(draw, 815, 590, 1.35)
    city(draw, 1220, 650, 0.95)
    for x in [550, 680, 960, 1110]:
        person(draw, x, 720, 0.28, (43, 48, 54), 180, "walk")
    line(draw, [(300, 760), (570, 720), (820, 682), (1090, 720), (1390, 760)], c((210, 180, 120), 180), 36)
    image = radial_glow(image, (770, 365), 300, (255, 221, 145), 58)
    return overlay_texture(image)


def scene_families_map():
    image = new_canvas((222, 205, 161), (202, 174, 126))
    draw = ImageDraw.Draw(image, "RGBA")
    map_background(draw)
    branches = [
        [(800, 310), (610, 420), (460, 545), (280, 690)],
        [(800, 310), (820, 460), (790, 620), (690, 790)],
        [(800, 310), (1010, 420), (1160, 560), (1360, 720)],
    ]
    colors = [(171, 91, 75), (89, 139, 92), (88, 111, 176)]
    for points, color in zip(branches, colors):
        route(draw, points, color, 10)
        for x, y in points[1:]:
            ellipse(draw, (x - 28, y - 28, x + 28, y + 28), c(color, 100))
            family_group(draw, x, y + 18, 3, 0.13, (54, 55, 53), 210)
    ellipse(draw, (760, 235, 840, 315), c((118, 88, 63), 180))
    return overlay_texture(image)


SCENES = {name: obj for name, obj in globals().items() if name.startswith("scene_")}


def main():
    for chapter, slug, scene_name in ASSETS:
        out_dir = os.path.join(OUT_ROOT, str(chapter))
        os.makedirs(out_dir, exist_ok=True)
        image = SCENES[f"scene_{scene_name}"]()
        image = image.resize((W, H), Image.Resampling.LANCZOS).convert("RGB")
        image = image.filter(ImageFilter.UnsharpMask(radius=1.1, percent=80, threshold=3))
        out_path = os.path.join(out_dir, f"{slug}.png")
        image.save(out_path, "PNG", optimize=True)
        print(out_path)

    for start, end, name in [(1, 5, "genesis-1-5-contact.png"), (6, 10, "genesis-6-10-contact.png")]:
        thumbs = []
        for chapter, slug, _scene in ASSETS:
            if start <= chapter <= end:
                thumb = Image.open(os.path.join(OUT_ROOT, str(chapter), f"{slug}.png")).resize((320, 180), Image.Resampling.LANCZOS)
                thumbs.append((chapter, slug, thumb))
        cols = 4
        rows = math.ceil(len(thumbs) / cols)
        sheet = Image.new("RGB", (cols * 320, rows * 210), (245, 239, 225))
        draw = ImageDraw.Draw(sheet)
        for index, (chapter, slug, thumb) in enumerate(thumbs):
            x = (index % cols) * 320
            y = (index // cols) * 210
            sheet.paste(thumb, (x, y))
            draw.text((x + 10, y + 184), f"Gen {chapter} - {slug}", fill=(50, 50, 50))
        sheet.save(os.path.join(OUT_ROOT, name), "PNG", optimize=True)


if __name__ == "__main__":
    main()
