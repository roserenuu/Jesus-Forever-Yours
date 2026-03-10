import argparse
import json
import os
import subprocess
import shutil

def run_command(command, cwd=None):
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=cwd)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}\n{e.stderr}")
        return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--slides-dir", required=True)
    parser.add_argument("--caption-file", required=True)
    parser.add_argument("--repo-dir", required=True)
    args = parser.parse_args()

    with open(args.config, 'r') as f:
        config = json.load(f)

    n = config['carousel_number']
    topic_slug = config['topic'].lower().replace(" ", "-").replace("'", "").replace(",", "")
    
    target_dir = os.path.join(args.repo_dir, "carousels", f"{n}-{topic_slug}")
    os.makedirs(target_dir, exist_ok=True)

    # Copy slides
    for f in os.listdir(args.slides_dir):
        if f.endswith(".png"):
            shutil.copy(os.path.join(args.slides_dir, f), os.path.join(target_dir, f))
    
    # Copy caption
    shutil.copy(args.caption_file, os.path.join(target_dir, "caption.txt"))
    
    # Git operations
    run_command("git add .", cwd=args.repo_dir)
    run_command(f'git commit -m "Add carousel {n}: {config["topic"]}"', cwd=args.repo_dir)
    run_command("git push", cwd=args.repo_dir)
    
    print(f"Pushed carousel {n} to GitHub repository at {target_dir}")

if __name__ == "__main__":
    main()
