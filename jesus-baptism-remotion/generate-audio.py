"""
生成耶稣受洗视频的旁白音频 (中文)
使用 pyttsx3 (Windows SAPI5)
"""
import pyttsx3
import os

OUTPUT_DIR = r"D:\cursor\jesus-baptism-remotion\public\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

engine = pyttsx3.init()

# 列出可用语音
voices = engine.getProperty('voices')
print("Available voices:")
for i, v in enumerate(voices):
    print(f"  [{i}] {v.name} ({v.id})")

# 选中文语音
zh_voice = None
for v in voices:
    name_lower = v.name.lower()
    if any(kw in name_lower for kw in ['chinese', 'zh', 'hong', 'hui', 'kangkang', 'yaoyao', 'hanhan', 'tracy']):
        zh_voice = v
        break

if zh_voice:
    engine.setProperty('voice', zh_voice.id)
    print(f"\nUsing voice: {zh_voice.name}")
else:
    print("\nNo Chinese voice found, using default")

engine.setProperty('rate', 140)   # 语速
engine.setProperty('volume', 0.9)

# 经文台词
lines = [
    ("line1", "耶稣受了洗，随即从水里上来。"),
    ("line2", "天忽然为他开了，"),
    ("line3", "他就看见神的灵，仿佛鸽子降下，落在他身上。"),
    ("line4", "从天上有声音说，这是我的爱子，我所喜悦的。"),
]

for filename, text in lines:
    path = os.path.join(OUTPUT_DIR, f"{filename}.wav")
    print(f"Generating: {filename} -> {text}")
    engine.save_to_file(text, path)

engine.runAndWait()
print("\nAll audio files generated!")
for f in os.listdir(OUTPUT_DIR):
    size = os.path.getsize(os.path.join(OUTPUT_DIR, f))
    print(f"  {f} ({size/1024:.1f} KB)")
