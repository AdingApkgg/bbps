"""一次性转换脚本（已完成使命，留作将来重建调色板的参考）：
把 tokens.css 里的字面色值抽成 --hig-palette-* 层，语义令牌名与像素值不动。
用法：在仓库根跑 `python3 scripts/oneoff-palette.py`，看输出报告 assertion。
"""
import colorsys
import re
from pathlib import Path

PATH = Path("src/styles/tokens.css")
text = PATH.read_text()

HEAD_END = text.index("/* ── 亮色")
TAIL_START = text.index("/* ── 圆角")

head, body, tail = text[:HEAD_END], text[HEAD_END:TAIL_START], text[TAIL_START:]

VAR_RE = re.compile(r"^(\s*)--hig-color-([a-z0-9-]+):\s*([^;]+);(.*)$")
HEX_RE = re.compile(r"^#([0-9a-fA-F]{6})$")
RGBA_RE = re.compile(r"^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$")

used: dict[str, str] = {}


def family(r: int, g: int, b: int) -> str:
    h, lightness, sat = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    hue = h * 360
    del lightness, sat
    if max(r, g, b) - min(r, g, b) <= 12:
        return "neutral"
    if hue < 22 or hue >= 345:
        return "red"
    if hue < 58:
        return "amber"
    if hue < 150:
        return "green"
    if hue < 178:
        return "teal"
    if hue < 200:
        return "cyan"
    if hue < 262:
        return "blue"
    if hue < 300:
        return "purple"
    return "magenta"


def name_for(value: str) -> str:
    m = HEX_RE.match(value)
    if m:
        raw = m.group(1).lower()
        r, g, b = int(raw[0:2], 16), int(raw[2:4], 16), int(raw[4:6], 16)
        if (r, g, b) == (0, 0, 0):
            base = "black"
        elif (r, g, b) == (255, 255, 255):
            base = "white"
        else:
            step = round((255 - (r + g + b) / 3) / 255 * 1000)
            base = f"{family(r, g, b)}-{step:03d}"
    else:
        m = RGBA_RE.match(value)
        assert m, value
        r, g, b, a = int(m.group(1)), int(m.group(2)), int(m.group(3)), float(m.group(4))
        if (r, g, b) == (0, 0, 0):
            base = "scrim"
        else:
            base = family(r, g, b)
        base = f"{base}-a{round(a * 100):02d}"
    key = f"{base}|{value}"
    if key in used:
        return used[key]
    name = base
    n = 2
    while name in used and used[name][0] != value:
        name = f"{base}-{n}"
        n += 1
    used[name] = value
    used[key] = name
    return name


def rewrite(block: str) -> tuple[str, list[str]]:
    out, names = [], []
    for line in block.split("\n"):
        m = VAR_RE.match(line)
        if not m:
            out.append(line)
            continue
        indent, tok, value, rest = m.groups()
        if not (HEX_RE.match(value) or RGBA_RE.match(value)):
            out.append(line)
            continue
        name = name_for(value)
        names.append(name)
        out.append(f"{indent}--hig-color-{tok}: var(--hig-palette-{name});{rest}")
    return "\n".join(out), names


body, _ = rewrite(body)


def group(name: str) -> str:
    return name.split("-")[0]


buckets: dict[str, list[str]] = {}
for name in [n for n in used if "|" not in n]:
    buckets.setdefault(group(name), []).append(name)


def sort_key(name: str) -> tuple:
    if name in ("black", "white"):
        return (0, name)
    if name.startswith("scrim"):
        return (9, name)
    m = re.match(r"^([a-z]+)(?:-(\d+))?(?:-a(\d+))?(?:-(\d+))?$", name)
    if not m:
        return (8, name)
    fam, step, alpha, dup = m.groups()
    if fam == "neutral":
        return (1 if alpha else 0, -int(step or 0), int(alpha or 0), int(dup or 1))
    return (1, int(alpha is not None), fam, int(alpha or 0), -int(step or 0), int(dup or 1))


ORDER = ["black", "white", "neutral", "scrim", "red", "amber", "green", "teal", "cyan", "blue",
         "purple", "magenta"]

lines = []
for fam in ORDER:
    members = sorted(buckets.get(fam, []), key=sort_key)
    if not members:
        continue
    lines.append(f"\n  /* {fam} */")
    for name in members:
        lines.append(f"  --hig-palette-{name}: {used[name].replace('#', '#')};")

palette = (
    "/* ── 调色板：唯一定义像素值的地方 ──────────────────────────────────────\n"
    " * 语义令牌只许写 var(--hig-palette-…) —— 换主色、换灰阶只改这里，不动语义层。\n"
    " * 命名：色名 + 强度（000 最浅…1000 最深，取自平均亮度），中性阶与语义色分族；\n"
    " * 半透明色带 aNN（NN = alpha 百分比），scrim 专供遮罩；同族同档而基色不同的\n"
    " * 第二个值加 -2 后缀（如 a12 / a12-2 分别压在白与深灰上）。\n"
    " * 值全部是 HIG 系统色（iOS 系统蓝 / 系统绿 / 系统红 / 系统灰族）。\n"
    " * 新增色先进这里再进语义层；语义层出现第二个字面值即为事故。\n"
    " * ------------------------------------------------------------------- */\n"
    ":root {" + "\n".join(lines) + "\n}\n\n"
)

PATH.write_text(head + palette + body + tail)
print(f"palette entries: {len(lines)}")
rewritten = sum(1 for line in body.split(chr(10)) if 'var(--hig-palette-' in line)
print(f"literal lines rewritten: {rewritten}")
