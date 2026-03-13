---
name: jfy-carousel-creator
description: >
  Creates Instagram carousels for Rose's @jesusforeveryours brand page. Use this skill
  whenever Rose asks to create a new carousel, a new JFY carousel, a Jesus Forever Yours
  carousel, or a love letter carousel for the brand page. Handles the full workflow:
  writing the love letter content, generating all 14 slides as 1080x1440px PNG images
  using Playfair Display Bold Italic on a white background, writing the Instagram caption,
  updating the carousel log, and pushing everything to GitHub.
---

# JFY Carousel Creator

This skill generates complete Instagram carousels for the @jesusforeveryours brand page. Each carousel is a 14-slide love letter from God to "My Child," ending with a CTA slide that promotes Rose's book "Forever Yours: 24 Days With Jesus."

## Workflow (follow in order)

### Step 0 — Mandatory Anti-Repetition Review
Before starting any new content, run the Instagram analysis script to fetch the latest 20 posts from @jesusforeveryours. Review the topics and hooks used to ensure the new carousel is 100% unique.
```bash
python /home/ubuntu/skills/jfy-carousel-creator/scripts/analyze_instagram.py
```
Check the output at `/home/ubuntu/brand_assets/instagram_history.json`.

### Step 1 — Determine the next carousel number
Read `/home/ubuntu/brand_assets/carousel_log.txt` and find the highest carousel number. The new carousel is that number + 1.

### Step 2 — Choose topic, text color, BOOK accent color, and hooks
- **Topic:** Must be unique. Never repeat any topic from the Instagram history or the log.
- **Text color:** Elegant color on white background. Never repeat previously used text colors.
- **BOOK accent color:** Contrasting color for the word "BOOK" on the CTA slide. Never repeat previously used accent colors.
- **Hooks:** Two unique, scroll-stopping lines for slides 1 and 2.

### Step 3 — Write the love letter content
Write 9 body lines for slides 4–12. Each line is 1–2 sentences maximum. Follow the tone of a loving Father.

### Step 4 — Create the carousel config JSON
Save the config to `/home/ubuntu/carousel_output/carousel[N]/carousel_config.json` using the template at `templates/carousel_config_template.json`.

### Step 5 — Generate the slides
Run the carousel generation script:
```bash
python /home/ubuntu/skills/jfy-carousel-creator/scripts/create_carousel.py \
  --config /home/ubuntu/carousel_output/carousel[N]/carousel_config.json \
  --output /home/ubuntu/carousel_output/carousel[N]/slides/
```

### Step 6 — Write the caption
Write the Instagram caption (Topic, Body, CTA, Author Credit, Hashtags). Save to `/home/ubuntu/carousel_output/carousel[N]/caption.txt`.
**Rules:** No emojis. No dashes as bullet points.

### Step 7 — Update the carousel log
```bash
python /home/ubuntu/skills/jfy-carousel-creator/scripts/update_log.py \
  --config /home/ubuntu/carousel_output/carousel[N]/carousel_config.json \
  --files "$(ls /home/ubuntu/carousel_output/carousel[N]/slides/*.png | tr '\n' ' ')"
```

### Step 8 — Push to GitHub
```bash
python /home/ubuntu/skills/jfy-carousel-creator/scripts/push_to_github.py \
  --config /home/ubuntu/carousel_output/carousel[N]/carousel_config.json \
  --slides-dir /home/ubuntu/carousel_output/carousel[N]/slides/ \
  --caption-file /home/ubuntu/carousel_output/carousel[N]/caption.txt \
  --repo-dir /home/ubuntu/Jesus-Forever-Yours
```

### Step 9 — Deliver to Rose
Send Rose:
- All 14 slide PNG files as attachments
- The caption text (inline in the message)
- Confirmation of log and GitHub updates

## Design Rules
- **Dimensions:** 1080 × 1440 px
- **Font:** Playfair Display Bold Italic (`templates/PlayfairDisplay-BoldItalic.ttf`)
- **Text alignment:** Centered horizontally and vertically

## Slide Map
1. Hook 1
2. Hook 2
3. "My Child,"
4-12. Letter lines 1-9
13. "Forever Yours, Heavenly Father"
14. CTA Slide (Book Cover + CTA)

## Error Handling
- **Font missing:** Download using `curl` from Google Fonts.
- **Book cover missing:** Ask Rose to upload `book_cover.png` to `/home/ubuntu/brand_assets/`.
- **Instagram access error:** If the `instagram` MCP fails, manually check the @jesusforeveryours page via browser to ensure uniqueness.
