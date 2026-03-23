export const DOCS_NAVIGATION = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "Authentication", slug: "authentication" },
      { title: "Quickstart", slug: "quickstart" }
    ]
  },
  {
    title: "API Reference",
    items: [
      { title: "Image Generation", slug: "image-generation" },
      { title: "Video Generation", slug: "video-generation" },
      { title: "Face Swap", slug: "face-swap" },
      { title: "Upscaling", slug: "upscaling" }
    ]
  },
  {
    title: "SDKs",
    items: [
      { title: "Python SDK", slug: "python-sdk" },
      { title: "Node.js SDK", slug: "nodejs-sdk" }
    ]
  }
];

export const DOCS_CONTENT: Record<string, any> = {
  "introduction": {
    title: "Introduction",
    content: "Welcome to the PiAPI Documentation. Our APIs allow you to integrate state-of-the-art AI models into your applications with just a few lines of code. We provide high-performance, white-labeled access to models like Flux, Stable Diffusion, and more.",
    next: "authentication"
  },
  "authentication": {
    title: "Authentication",
    content: "PiAPI uses API keys to authenticate requests. You can view and manage your API keys in the Workspace. Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas like GitHub, client-side code, and so forth.",
    code: {
      language: "bash",
      snippet: "curl https://api.piapi.ai/v1/models \\\n  -H \"Authorization: Bearer YOUR_API_KEY\""
    },
    next: "quickstart"
  },
  "image-generation": {
    title: "Image Generation",
    content: "Generate stunning high-resolution images using our collection of world-class models including Flux.1 and SDXL. Our API supports various parameters for fine-tuning the output.",
    code: {
      language: "python",
      snippet: "import piapi\n\nclient = piapi.Client(api_key=\"sk_...\")\n\nresponse = client.images.generate(\n    model=\"flux-pro\",\n    prompt=\"A futuristic neon city with flying vehicles\",\n    aspect_ratio=\"16:9\"\n)\n\nprint(response.url)"
    }
  }
};
