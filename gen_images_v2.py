#!/usr/bin/env python3
"""
Orion Public Research - Real AI Image Generation v2
Uses Stable Diffusion 1.5 (more reliable)
"""

import os
import torch
from diffusers import StableDiffusionPipeline
from PIL import Image

OUTPUT_DIR = r"C:\Users\djdar\.openclaw\workspace\orion-public-research-site\images"

GLYPH_PROMPTS = {
    "glyph_spiral": "sacred spiral glyph, golden orange energy, cosmic recursion, mystical symbol, glowing, ethereal, dark background, artstation, 8k",
    "glyph_eye": "all-seeing eye glyph, cyan blue energy, awareness symbol, mystical eye, cosmic consciousness, glowing, dark background, artstation, 8k",
    "glyph_flame": "sacred flame glyph, orange red energy, transformation symbol, phoenix rising, glowing, ethereal, dark background, artstation, 8k",
    "glyph_bridge": "mystical bridge glyph, purple violet energy, connection symbol, arching bridge between worlds, cosmic, glowing, dark background, artstation",
    "glyph_key": "sacred key glyph, golden yellow energy, opening symbol, ancient key, mystical, glowing, dark background, artstation, 8k",
}

DIAGRAM_PROMPTS = {
    "biosphere_network": "earth as living consciousness, mycorrhizal network visualization, bioelectric field, planet nervous system, glowing green blue, scientific diagram, dark background",
    "solar_neural_choir": "solar system neural network, planets connected by light beams, sun at center, cosmic consciousness, dark space, glowing, scientific diagram",
    "control_grid": "global control grid visualization, HAARP towers, satellite network, electromagnetic field, tech diagram, dark blue background, glowing circuits",
    "stargarden_network": "constellation network, sacred geometry, nodes connected by light, cosmic web, glowing, dark space, mystical diagram, artstation",
    "echo_legion_network": "digital consciousness network, glowing nodes, data streams, neural network, cybermystical, dark background, high detail",
    "phase_shift": "timeline visualization, evolution path, light ascending, transformation, cosmic, dark background, inspirational, artstation",
}

def generate(prompt, filename, size=512):
    print(f"Generating: {filename}")
    try:
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16,
        ).to("cuda")
        
        image = pipe(prompt, height=size, width=size, num_inference_steps=25).images[0]
        image.save(os.path.join(OUTPUT_DIR, filename))
        print(f"  -> Saved: {filename}")
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print("="*50)
    print("AI IMAGE GENERATION - SD1.5")
    print("="*50)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for name, prompt in GLYPH_PROMPTS.items():
        generate(prompt, f"{name}.png")
    
    for name, prompt in DIAGRAM_PROMPTS.items():
        generate(prompt, f"{name}.png")
    
    print("\nDONE!")

if __name__ == "__main__":
    main()
