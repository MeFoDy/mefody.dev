---
title: Easy video converting for the web
description: Using of Bash to make video converting more comfortable.
cover: images/cover.png
date: 2021-03-28
dateUpdated: Last Modified
tags:
    - bash
    - html
    - chunk
---

I want to keep my blog performant. So when there are some videos in an article, I need to convert videos to modern formats to make them smaller.

## HTML

Andrey Sitnik wrote a [great article](https://evilmartians.com/chronicles/better-web-video-with-av1-codec) about video codecs for the web. I customized the snippet from the article for my needs.

```html
<video width="600" height="400" controls muted playsinline preload="metadata">
    <source src="video.av1.mp4" type="video/mp4; codecs=av01.0.05M.08">
    <source src="video.h264.mp4" type="video/mp4">
</video>
```

This snippet works great in modern Chrome and Firefox [with AV1-codec supported](https://caniuse.com/av1), falling back to the bulletproof H264-codec for other browsers.

## ffmpeg

To convert source videos for the web you can use `ffmpeg`. For macOS, it's just `brew install ffmpeg`. This is a really great tool to work with videos. But its synopsis is not so easy to remember. And it's not copypastable because of the strict order of arguments. For example, here is a snippet for converting to H264.

```bash
ffmpeg -i input.mov -map_metadata -1 -an -c:v libx264 \
-crf 24 -preset veryslow -profile:v main -pix_fmt yuv420p \
-movflags +faststart -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
output.h264.mp4
```

I don't want to remember it!

## Bash aliases

Let's make aliases for Bash. Open your `~/.bashrc` (or `~/.zshrc` if you use ZSH instead of Bash). Add the next code to the end of the file.

```bash
function convert-to-h264 {
    if [[ $2 ]];
        then output=$2
        else output=${1%.*}.h264.mp4
    fi

    ffmpeg -i $1 -map_metadata -1 -an -c:v libx264 \
    -crf 24 -preset veryslow -profile:v main -pix_fmt yuv420p \
    -movflags +faststart -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    $output
}
```

Save the file, then apply it with `source ~/.bashrc` (or `source ~/.zshrc` for ZSH). Voila, you can use new alias to easily convert your videos.

```bash
convert-to-h264 input.mov # converts to input.h264.mp4 by default
# or
convert-to-h264 input.mov output.mp4
```

I also have other aliases for my blog videos.

```bash
function convert-to-av1 {
    if [[ $2 ]];
        then output=$2
        else output=${1%.*}.av1.mp4
    fi

    ffmpeg -i $1 -map_metadata -1 -an -c:v libaom-av1 -crf 50 -b:v 0 \
    -pix_fmt yuv420p -movflags +faststart -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -strict experimental -cpu-used 1 \
    $output
}

function resize-to-width {
    if [[ $3 ]];
        then output=$3
        else output=${1%.*}@$2.${1##*.}
    fi

    ffmpeg -i $1 -vf "scale="$2":trunc(ow/a/2)*2" $output
}
```

So my workflow with videos usually consists of three commands.

```bash
resize-to-width source.mov 1200 video.mov
convert-to-h264 video.mov
convert-to-av1 video.mov
```

## Sources
- [Better web video with AV1 codec](https://evilmartians.com/chronicles/better-web-video-with-av1-codec)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [HOWTO: Bash functions](https://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO-8.html)
