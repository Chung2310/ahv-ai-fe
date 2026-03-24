export const CATEGORIES = [
  "Face Swap",
  "Upscale & Enhance",
  "Virtual Try-On",
  "AI Content Generation",
  "Object & Background Removal",
  "Object Detection"
];

export const MODELS = [
  {
    id: "faceswap",
    title: "Face Swap",
    category: "Face Swap",
    description: "Swap faces for one or more people with high precision. Supports single and multi-face swapping with automatic result enhancement.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    tags: ["faceswap", "faceswap_multi"],
    speed: "Turbo"
  },
  {
    id: "faceswap_video",
    title: "Video Face Swap",
    category: "Face Swap",
    description: "Replace faces frame-by-frame in videos while preserving original audio and motion. Optimized for high-speed multi-GPU rendering.",
    image: "https://images.unsplash.com/photo-1492691523567-6170f0275df1?auto=format&fit=crop&q=80&w=800",
    tags: ["faceswap_video"],
    speed: "Turbo"
  },
  {
    id: "upscale",
    title: "Upscale & Enhance",
    category: "Upscale & Enhance",
    description: "Increase image resolution up to 4x while applying AI beauty filters (Natural, Glamour, Studio). Supports face restoration and sharpening.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800",
    tags: ["upscale"],
    speed: "Instant"
  },
  {
    id: "try_on",
    title: "Virtual Try-On",
    category: "Virtual Try-On",
    description: "Try on clothes virtually using AI. Simply upload a portrait and a garment photo to see the result instantly in HD.",
    image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800",
    tags: ["try_on"],
    speed: "Standard"
  },
  {
    id: "ahv_image",
    title: "AHV Image Gen",
    category: "AI Content Generation",
    description: "Create and transform images with AI featuring customizable styles, resolutions, and advanced control parameters like ID weight.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
    tags: ["ahv_image"],
    speed: "Standard"
  },
  {
    id: "ahv_video",
    title: "AHV Video Gen",
    category: "AI Content Generation",
    description: "Transform images to cinematic short videos using advanced neural rendering. Supports custom resolutions and go-fast mode.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    tags: ["ahv_video"],
    speed: "Standard"
  },
  {
    id: "remove_object",
    title: "Object Removal",
    category: "Object & Background Removal",
    description: "Precise object removal using AI with intelligent background inpainting. Powered by advanced mask and prompt detection.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    tags: ["remove_object"],
    speed: "Instant"
  },
  {
    id: "remove_background",
    title: "Background Removal",
    category: "Object & Background Removal",
    description: "Remove backgrounds with one click featuring sharp edge detection. Returns transparent PNG for professional compositing.",
    image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800",
    tags: ["remove_bg"],
    speed: "Instant"
  },
  {
    id: "scan_objects",
    title: "Object Detection",
    category: "Object Detection",
    description: "Detect multiple objects in images and retrieve precise bounding boxes and category labels with AI perception.",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=800",
    tags: ["scan"],
    speed: "Instant"
  }
];
