#!/bin/bash

# رابط m3u8
M3U8_URL="PUT_M3U8_LINK_HERE"

# Facebook Stream Key
FB_KEY="PUT_STREAM_KEY_HERE"

ffmpeg -re \
-i "$M3U8_URL" \
-vf "scale=1280:720" \
-c:v libx264 -preset veryfast \
-b:v 2000k -maxrate 2000k -bufsize 4000k \
-c:a aac -b:a 128k -ar 44100 \
-f flv \
"rtmps://live-api-s.facebook.com:443/rtmp/$FB_KEY"
