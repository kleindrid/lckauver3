PROFILES FOLDER (ORGANIZED BY USER & APP)
==========================================

Structure:
  src/assets/profiles/<user>/<app>/posts.txt

Apps:
  - x/posts.txt
  - instagram/posts.txt

How to add or edit posts in any person's posts.txt:
1. Separate multiple posts with a line containing: ---
2. Drop any post image inside the SAME folder (e.g. src/assets/profiles/wangho/instagram/photo1.jpg)
   and set "Image: photo1.jpg" (or "Image: none" if there is no image).
3. Use "Chapter:" to set which chapter(s) the post appears in:
   - Chapter: 1          (only Chapter 1)
   - Chapter: 2          (only Chapter 2)
   - Chapter: 1, 2       (Chapters 1 and 2)
   - Chapter: all        (all chapters)

X (posts.txt) fields:
  Chapter: 1
  Time: 18m
  Likes: 120
  Reposts: 15
  Image: none
  Text: Post content goes here.

Instagram (posts.txt) fields:
  Chapter: 1
  Location: Gyeong-gwan
  Time: 1 HOUR AGO
  Likes: 240
  Saved: false
  Image: none
  Palette: #0f172a, #1e293b, #64748b
  Caption: Photo caption goes here.
