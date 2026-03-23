import subprocess
import json
import os
import sys

def run_mcp_tool(server, tool, args):
    cmd = ["manus-mcp-cli", "tool", "call", tool, "--server", server, "--input", json.dumps(args)]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        return None
    
    output = result.stdout
    for line in output.split('\n'):
        if "result saved to:" in line:
            json_path = output.split('\n')[output.split('\n').index(line) + 1].strip()
            with open(json_path, 'r') as f:
                return json.load(f)
    return None

def main():
    print("Fetching latest posts from @jesusforeveryours...")
    posts_data = run_mcp_tool("instagram", "get_post_list", {"limit": 20})
    
    if not posts_data or not posts_data.get('success'):
        print("Error: Could not fetch Instagram posts. Please ensure the 'instagram' MCP server is connected.")
        return

    posts = posts_data['result']['posts']
    history = []
    
    for post in posts:
        # Extract topic from caption (usually the first line or title)
        caption = post.get('caption', '')
        lines = caption.split('\n')
        topic = lines[0] if lines else "Unknown Topic"
        
        history.append({
            "id": post['id'],
            "topic": topic,
            "caption_snippet": caption[:100],
            "timestamp": post.get('timestamp', '')
        })

    # Save to a temporary history file for the main skill to read
    history_path = "/home/ubuntu/brand_assets/instagram_history.json"
    os.makedirs(os.path.dirname(history_path), exist_ok=True)
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)
    
    print(f"Successfully analyzed {len(history)} recent posts and saved to {history_path}")

if __name__ == "__main__":
    main()
