"""
将 Remotion 渲染的无声视频与旁白 WAV 音频合并

旁白时间线 (在 Remotion 中使用 Sequence from=startFrame):
  line1.wav: 0s  (frame 0)
  line2.wav: 3s  (frame 90)
  line3.wav: 4.66s (frame 140)
  line4.wav: 7.5s (frame 225)
"""
import numpy as np
from moviepy import VideoFileClip, AudioFileClip, CompositeAudioClip, afx
import os

# Paths
VIDEO_PATH = r"D:\cursor\jesus-baptism-silent.mp4"
AUDIO_DIR = r"D:\cursor\jesus-baptism-remotion\public\audio"
OUTPUT_PATH = r"D:\cursor\jesus-baptism.mp4"
FPS = 30

# Audio timeline (start_seconds, filename)
AUDIO_TIMELINE = [
    (0 / FPS, "line1.wav"),       # frame 0 = 0s
    (90 / FPS, "line2.wav"),      # frame 90 = 3s
    (140 / FPS, "line3.wav"),     # frame 140 ≈ 4.67s
    (225 / FPS, "line4.wav"),     # frame 225 = 7.5s
]

def main():
    print("Loading video...")
    video = VideoFileClip(VIDEO_PATH)
    video_duration = video.duration
    print(f"  Video duration: {video_duration:.2f}s")

    # Collect all audio clips at their correct timestamps
    audio_clips_with_timing = []

    for start_time, filename in AUDIO_TIMELINE:
        path = os.path.join(AUDIO_DIR, filename)
        if not os.path.exists(path):
            print(f"  WARNING: {path} not found, skipping")
            continue

        audio = AudioFileClip(path)
        dur = audio.duration
        print(f"  {filename}: starts at {start_time:.2f}s, duration={dur:.2f}s")

        # Set the start time
        audio = audio.with_start(start_time)
        audio_clips_with_timing.append(audio)

    if not audio_clips_with_timing:
        print("No audio clips found! Exiting.")
        video.write_videofile(OUTPUT_PATH, codec="libx264", audio_codec="aac", fps=FPS)
        return

    # Composite all audio clips
    composite_audio = CompositeAudioClip(audio_clips_with_timing)

    # Set the composite audio on the video
    video_with_audio = video.with_audio(composite_audio)

    print(f"\nRendering final video with audio...")
    video_with_audio.write_videofile(
        OUTPUT_PATH,
        codec="libx264",
        audio_codec="aac",
        fps=FPS,
        bitrate="4000k",
        audio_bitrate="192k",
        preset="medium",
        threads=4,
        logger="bar",
    )

    size_mb = os.path.getsize(OUTPUT_PATH) / 1024 / 1024
    print(f"\nDone! Output: {OUTPUT_PATH} ({size_mb:.1f} MB)")

if __name__ == "__main__":
    main()
