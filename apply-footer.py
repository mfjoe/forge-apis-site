#!/usr/bin/env python3
"""
Script to apply the footer system to all HTML files listed in sitemap.xml
Replaces existing footers with footer container and adds footer scripts
"""

import os
import re
from pathlib import Path

# Files from sitemap (excluding test files and node_modules)
HTML_FILES = [
    "index.html",
    "terms.html",
    "privacy.html",
    "cookies.html",
    "dpi-calculator/index.html",
    "dupecheck/index.html",
    "fps-calculator/index.html",
    "monitor-calculator/index.html",
    "gaming-calculators/index.html",
    "gaming-calculators/robux/index.html",
    "gaming-calculators/robux/guide.html",
    "gaming-calculators/robux/tax-calculator.html",
    "gaming-calculators/vbucks/index.html",
    "gaming-calculators/vbucks/guide.html",
    "gaming-calculators/minecoins/index.html",
    "gaming-calculators/minecoins/guide.html",
    "gaming-calculators/fifa-points/index.html",
    "gaming-calculators/fifa-points/guide.html",
    "gaming-calculators/cod-points/index.html",
    "gaming-calculators/cod-points/guide.html",
    "gaming-calculators/apex-coins/index.html",
    "gaming-calculators/apex-coins/guide.html",
    "gaming-calculators/guides/comparison.html",
    "gaming-calculators/guides/parents-guide.html",
    "tip-calculator/index.html",
    "gst-calculator/index.html",
    "gst-calculator/guide.html",
    "va-calculator/index.html",
    "va-calculator/guide.html",
    "riskscore/index.html",
]

BASE_DIR = Path(__file__).parent

def get_relative_path(file_path):
    """Calculate relative path to footer scripts from file location"""
    file_dir = Path(file_path).parent
    depth = len(file_dir.parts) if str(file_dir) != '.' else 0
    
    if depth == 0:
        return ""
    elif depth == 1:
        return "../"
    elif depth == 2:
        return "../../"
    else:
        return "../" * depth

def has_footer_container(content):
    """Check if file already has footer container"""
    return '<div id="footer-container"></div>' in content or 'id="footer-container"' in content

def has_footer_scripts(content):
    """Check if file already has footer scripts"""
    return 'footer-config.js' in content and 'footer.js' in content

def replace_footer(content):
    """Replace existing footer with footer container"""
    # Pattern to match footer tags and everything between them
    footer_pattern = r'<footer[^>]*>.*?</footer>'
    
    # Try to match and replace footer
    if re.search(footer_pattern, content, re.DOTALL):
        content = re.sub(footer_pattern, '    <!-- Footer Container - Populated by footer.js -->\n    <div id="footer-container"></div>', content, flags=re.DOTALL)
        return content, True
    return content, False

def add_footer_scripts(content, relative_path):
    """Add footer scripts before </body> tag"""
    footer_scripts = f'''    
    <!-- Footer System - Load config first, then generator -->
    <script src="{relative_path}footer-config.js"></script>
    <script src="{relative_path}footer.js"></script>'''
    
    # Find </body> tag and insert scripts before it
    if '</body>' in content:
        content = content.replace('</body>', footer_scripts + '\n  </body>')
        return content, True
    return content, False

def process_file(file_path):
    """Process a single HTML file"""
    full_path = BASE_DIR / file_path
    
    if not full_path.exists():
        print(f"⚠️  File not found: {file_path}")
        return False
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has footer container and scripts
        if has_footer_container(content) and has_footer_scripts(content):
            print(f"✓  Already updated: {file_path}")
            return True
        
        # Calculate relative path to footer scripts
        rel_path = get_relative_path(file_path)
        
        # Replace footer
        content, footer_replaced = replace_footer(content)
        
        # Add scripts
        content, scripts_added = add_footer_scripts(content, rel_path)
        
        if footer_replaced or scripts_added:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓  Updated: {file_path} (footer: {footer_replaced}, scripts: {scripts_added})")
            return True
        else:
            print(f"⚠️  No changes made: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Applying footer system to all HTML files...\n")
    
    success_count = 0
    total_count = len(HTML_FILES)
    
    for file_path in HTML_FILES:
        if process_file(file_path):
            success_count += 1
    
    print(f"\n✅ Complete! Updated {success_count}/{total_count} files")

if __name__ == "__main__":
    main()

