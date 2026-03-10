import argparse
import json
import os
from PIL import Image, ImageDraw, ImageFont

def create_slide(text, font_path, font_size, text_color, bg_color=(255, 255, 255), size=(1080, 1440), padding=90):
    img = Image.new('RGB', size, color=bg_color)
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype(font_path, font_size)
    except Exception as e:
        print(f"Error loading font: {e}")
        font = ImageFont.load_default()

    # Split text into lines if needed
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        w, h = draw.textbbox((0, 0), " ".join(current_line), font=font)[2:]
        if w > size[0] - 2 * padding:
            if len(current_line) > 1:
                lines.append(" ".join(current_line[:-1]))
                current_line = [word]
            else:
                lines.append(" ".join(current_line))
                current_line = []
    if current_line:
        lines.append(" ".join(current_line))
    
    full_text = "\n".join(lines)
    
    # Calculate total height to center vertically
    line_heights = [draw.textbbox((0, 0), line, font=font)[3] for line in lines]
    total_text_height = sum(line_heights) + (len(lines) - 1) * 10
    
    current_y = (size[1] - total_text_height) // 2
    
    for line in lines:
        w, h = draw.textbbox((0, 0), line, font=font)[2:]
        x = (size[0] - w) // 2
        draw.text((x, current_y), line, font=font, fill=text_color)
        current_y += h + 10
        
    return img

def create_cta_slide(top_text, bottom_text, book_path, font_path, text_color, book_accent_color, size=(1080, 1440)):
    img = Image.new('RGB', size, color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    try:
        font_main = ImageFont.truetype(font_path, 72)
        font_cta = ImageFont.truetype(font_path, 54)
    except:
        font_main = ImageFont.load_default()
        font_cta = ImageFont.load_default()

    # 1. Top Text
    w, h = draw.textbbox((0, 0), top_text, font=font_main)[2:]
    draw.text(((size[0]-w)//2, 150), top_text, font=font_main, fill=text_color)

    # 2. Book Cover
    if os.path.exists(book_path):
        book_img = Image.open(book_path)
        aspect = book_img.height / book_img.width
        new_w = 640
        new_h = int(new_w * aspect)
        book_img = book_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        img.paste(book_img, ((size[0]-new_w)//2, 350))
    else:
        print(f"Warning: Book cover not found at {book_path}")

    # 3. Bottom CTA
    # "Comment BOOK if you felt like this message was for you."
    # We need to highlight "BOOK"
    parts = bottom_text.split("BOOK")
    full_w = draw.textlength(bottom_text, font=font_cta)
    
    current_x = (size[0] - full_w) // 2
    y = 1150
    
    draw.text((current_x, y), parts[0], font=font_cta, fill=text_color)
    current_x += draw.textlength(parts[0], font=font_cta)
    
    draw.text((current_x, y), "BOOK", font=font_cta, fill=book_accent_color)
    current_x += draw.textlength("BOOK", font=font_cta)
    
    if len(parts) > 1:
        draw.text((current_x, y), parts[1], font=font_cta, fill=text_color)

    return img

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    with open(args.config, 'r') as f:
        config = json.load(f)

    os.makedirs(args.output, exist_ok=True)
    
    font_path = "/home/ubuntu/skills/jfy-carousel-creator/templates/PlayfairDisplay-BoldItalic.ttf"
    if not os.path.exists(font_path):
        # Fallback if not in skill templates
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf"

    text_color = config['text_color']
    n = config['carousel_number']

    slides = [
        config['hook1'],
        config['hook2'],
        "My Child,",
        *config['letter_lines'],
        "Forever Yours, Heavenly Father"
    ]

    for i, text in enumerate(slides):
        img = create_slide(text, font_path, 72, text_color)
        img.save(os.path.join(args.output, f"carousel{n}_slide_{i+1}.png"))

    # Slide 14: CTA
    cta_img = create_cta_slide(
        "Discover what God has been waiting to tell you.",
        "Comment BOOK if you felt like this message was for you.",
        config['book_cover_path'],
        font_path,
        text_color,
        config['book_accent_color']
    )
    cta_img.save(os.path.join(args.output, f"carousel{n}_slide_14.png"))
    print(f"Successfully generated 14 slides in {args.output}")

if __name__ == "__main__":
    main()
