export const CATEGORIES = [
  "Vision AI",
  "Upscaling",
  "Face Swap",
  "Remove Background",
  "Color Correction",
  "Object Detection",
  "Segmentation",
  "Face Anonymization"
];

export const MODELS = [
  {
    id: "flux-1-pro",
    title: "Flux.1 Pro",
    category: "Vision AI",
    description: "Intelligent upscaling that reconstructs details for 4k resolution.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    tags: ["Model: ESRGAN-based", "Feature: Upscaling"],
    speed: "Turbo"
  },
  {
    id: "bg-remover-pro",
    title: "Background Remover Pro",
    category: "Remove Background",
    description: "Highly accurate background extraction even for complex hair and edges.",
    image: "https://images.unsplash.com/photo-1596495573105-d14651336423?auto=format&fit=crop&q=80&w=800",
    tags: ["Model: Custom AI", "Feature: Segmentation"],
    speed: "Instant"
  },
  {
    id: "color-correct-ai",
    title: "AI Color Restoration",
    category: "Image Color Correction",
    description: "Automatically fix exposure, white balance, and saturation in low-quality photos.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    tags: ["Model: Vision Transformer", "Feature: Color Correction"],
    speed: "Standard"
  }
];
