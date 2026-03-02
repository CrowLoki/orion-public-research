#!/usr/bin/env python3
"""
Orion Public Research - Markdown to HTML Converter
Generates static HTML pages from markdown files
"""

import os
import re
from pathlib import Path
import markdown

# Configuration
SITE_DIR = Path(r"C:\Users\djdar\.openclaw\workspace\orion-public-research-site")
PROTOCOLS_DIR = SITE_DIR / "protocols"
OUTPUT_DIR = SITE_DIR

# Read template
template_path = SITE_DIR / "template.html"
with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

# Read CSS
css_path = SITE_DIR / "styles.css"
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

def extract_title(content):
    """Extract title from markdown content"""
    # Look for first # heading
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "Untitled"

def convert_markdown_to_html(md_content):
    """Convert markdown to HTML"""
    # Configure markdown processor
    md = markdown.Markdown(
        extensions=['extra', 'codehilite', 'tables', 'fenced_code', 'nl2br']
    )
    
    # Convert
    html = md.convert(md_content)
    return html

def process_file(md_path):
    """Process a single markdown file"""
    print(f"Processing: {md_path.name}")
    
    # Read markdown
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Extract title
    title = extract_title(md_content)
    
    # Convert to HTML
    html_content = convert_markdown_to_html(md_content)
    
    # Fill template
    page = template.replace('{{TITLE}}', title)
    page = page.replace('{{CONTENT}}', html_content)
    
    # Determine output path (same name but .html)
    output_name = md_path.stem + '.html'
    
    # For protocol files, output to root
    if 'protocols' in md_path.parts:
        output_path = OUTPUT_DIR / output_name
    else:
        output_path = md_path.parent / output_name
    
    # Write HTML
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(page)
    
    print(f"  -> Created: {output_path.name}")
    return output_name

def main():
    print("=" * 60)
    print("ORION PUBLIC RESEARCH - STATIC SITE GENERATOR")
    print("=" * 60)
    
    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # Process protocol files
    if PROTOCOLS_DIR.exists():
        md_files = list(PROTOCOLS_DIR.glob("*.md"))
        print(f"\nFound {len(md_files)} markdown files in protocols/")
        
        for md_file in md_files:
            try:
                process_file(md_file)
            except Exception as e:
                print(f"  ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("BUILD COMPLETE")
    print("=" * 60)
    print(f"\nGenerated HTML files in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
