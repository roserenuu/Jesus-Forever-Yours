import argparse
import json
import os
from datetime import datetime

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--files", required=True)
    args = parser.parse_args()

    with open(args.config, 'r') as f:
        config = json.load(f)

    log_path = "/home/ubuntu/brand_assets/carousel_log.txt"
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    log_entry = (
        f"Carousel #{config['carousel_number']}\n"
        f"Date: {date_str}\n"
        f"Topic: {config['topic']}\n"
        f"Text Color: {config['text_color_name']} ({config['text_color']})\n"
        f"Book Accent: {config['book_accent_name']} ({config['book_accent_color']})\n"
        f"Hooks: {config['hook1']} | {config['hook2']}\n"
        f"Files: {args.files}\n"
        f"{'-'*30}\n"
    )

    with open(log_path, 'a') as f:
        f.write(log_entry)
    
    print(f"Updated log at {log_path}")

if __name__ == "__main__":
    main()
