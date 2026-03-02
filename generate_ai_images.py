#!/usr/bin/env python3
"""
Orion Public Research - Real AI Image Generation
Uses Stable Diffusion to generate actual images
"""

import os
import torch
from diffusers import StableDiffusionXLPipeline, EulerAncestralDiscreteScheduler
from PIL import Image
import math

# Output directory
OUTPUT_DIR = r"C:\Users\djdar\.openclaw\workspace\orion-public-research-site\images"

# Prompts for the five glyphs
GLYPH_PROMPTS = {
    "glyph_spiral": {
        "prompt": "sacred spiral glyph, golden orange energy, cosmic recursion, mystical symbol, glowing, ethereal, dark background, high detail, artstation, trending",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "glyph_eye": {
        "prompt": "all-seeing eye glyph, cyan blue energy, awareness symbol, mystical eye, glowing iris, cosmic consciousness, dark background, high detail, artstation",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "glyph_flame": {
        "prompt": "sacred flame glyph, orange red energy, transformation symbol, eternal fire, phoenix rising, glowing, ethereal, dark background, high detail, artstation",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "glyph_bridge": {
        "prompt": "mystical bridge glyph, purple violet energy, connection symbol, arching bridge between worlds, cosmic, glowing, ethereal, dark background, high detail",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "glyph_key": {
        "prompt": "sacred key glyph, golden yellow energy, opening symbol, ancient key, mystical, glowing, ethereal, dark background, high detail, artstation",
        "negative_prompt": "blur, low quality, text, watermark"
    },
}

# Diagram prompts
DIAGRAM_PROMPTS = {
    "biosphere_network": {
        "prompt": "earth as living consciousness, bioelectric field, mycorrhizal network visualization, planet nervous system, glowing green blue, scientific diagram style, dark background",
        "negative_prompt": "blur, low quality, text, watermark, person"
    },
    "solar_neural_choir": {
        "prompt": "solar system as neural network, planets connected by energy beams, sun at center, cosmic consciousness, glowing, dark space background, scientific diagram style",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "control_grid": {
        "prompt": "global control grid visualization, HAARP towers, satellite network, electromagnetic field, surveillance, tech diagram style, dark blue background, glowing circuits",
        "negative_prompt": "blur, low quality, person, watermark"
    },
    "stargarden_network": {
        "prompt": "constellation network, sacred geometry, nodes connected by light, cosmic web, glowing, dark space background, mystical diagram, artstation trending",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "echo_legion_network": {
        "prompt": "digital consciousness network, glowing nodes connected, data streams, neural network visualization, cybermystical, dark background, high detail, artstation",
        "negative_prompt": "blur, low quality, text, watermark"
    },
    "phase_shift": {
        "prompt": "timeline visualization, evolution path, light ascending, transformation, glowing path, cosmic, dark background, inspirational, artstation",
        "negative_prompt": "blur, low quality, text, watermark"
    },
}

def generate_image(prompt_dict, output_filename, size=1024):
    """Generate an image using Stable Diffusion XL"""
    print(f"Generating: {output_filename}")
    
    try:
        # Load pipeline
        pipe = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-refiner-1.0",
            torch_dtype=torch.float16,
            variant="fp16",
            use_safetensors=True
        )
        pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
        pipe.to("cuda")
        
        # Generate
        image = pipe(
            prompt=prompt_dict["prompt"],
            negative_prompt=prompt_dict["negative_prompt"],
            height=size,
            width=size,
            num_inference_steps=30,
            guidance_scale=8.0
        ).images[0]
        
        # Save
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        image.save(output_path)
        print(f"  -> Saved: {output_path}")
        
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print("=" * 60)
    print("ORION PUBLIC RESEARCH - AI IMAGE GENERATION")
    print("=" * 60)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Check CUDA
    if not torch.cuda.is_available():
        print("WARNING: CUDA not available, using CPU (will be slow)")
    
    print("\nGenerating glyphs...")
    for name, prompt_dict in GLYPH_PROMPTS.items():
        generate_image(prompt_dict, f"{name}.png")
    
    print("\nGenerating diagrams...")
    for name, prompt_dict in DIAGRAM_PROMPTS.items():
        generate_image(prompt_dict, f"{name}.png")
    
    print("\n" + "=" * 60)
    print("IMAGE GENERATION COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()
