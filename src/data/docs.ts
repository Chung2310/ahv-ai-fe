export const DOCS_NAVIGATION = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "Authentication", slug: "authentication" },
      { title: "Recommended Workflow", slug: "quickstart" },
      { title: "Webhook Implementation", slug: "webhooks" }
    ]
  },
  {
    title: "API Reference",
    items: [
      { title: "Face Swap (Image)", slug: "face-swap" },
      { title: "Face Swap (Video)", slug: "video-face-swap" },
      { title: "Upscale & Beauty", slug: "upscale-beauty" },
      { title: "Virtual Try-On", slug: "virtual-try-on" },
      { title: "AHV Image Gen", slug: "ahv-image-gen" },
      { title: "AHV Video Gen", slug: "ahv-video-gen" },
      { title: "Object Removal", slug: "object-removal" },
      { title: "Background Removal", slug: "background-removal" },
      { title: "Scan Objects", slug: "scan-objects" }
    ]
  },
  {
    title: "Management & Ops",
    items: [
      { title: "System Management", slug: "system-management" },
      { title: "Job Status & Lifecycle", slug: "job-lifecycle" },
      { title: "Direct Blocking APIs", slug: "direct-apis" }
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
    content: "The AHV AI Orchestrator v2.3 is a high-performance system designed to manage resource-intensive AI tasks through an asynchronous queue architecture. Supporting everything from Multi-Face Swap to Cinematic Video Generation, it provides enterprise-grade reliability and speed.",
    next: "authentication"
  },
  "authentication": {
    title: "Authentication",
    content: "All requests to the AI Orchestrator require a secret API key. Include this key in the `X-API-Key` header for every request.",
    code: {
      language: "bash",
      snippet: "curl -H \"X-API-Key: YOUR_SECRET_KEY\" ..."
    },
    next: "quickstart"
  },
  "quickstart": {
    title: "Recommended Workflow",
    content: "To handle long-running AI tasks efficiently:\n1. **POST** to `/v1/jobs` with your desired `task` and `webhook_url`.\n2. Receive a **job_id** and status (`queued`).\n3. Continue client operations while the server processes the job.\n4. Handle the **POST Webhook** notification containing the final result URL.",
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"task\": \"faceswap_multi\",\n    \"webhook_url\": \"https://your-site.com/webhook\",\n    \"payload\": { ... }\n  }'"
    },
    next: "webhooks"
  },
  "webhooks": {
    title: "Webhook Implementation",
    content: "The AI Orchestrator uses POST webhooks to deliver terminal job results. Your endpoint must return a 200 OK status to acknowledge receipt. We recommend implementing idempotency logic using the `event_id` or `job_id` to handle potential retries.",
    parameters: [
      { param: "event", type: "string", desc: "Event name (typically 'job.finished')." },
      { param: "event_id", type: "uuid", desc: "Unique event identifier for idempotency." },
      { param: "job_id", type: "uuid", desc: "The ID of the primary job." },
      { param: "task", type: "string", desc: "Task type (e.g., 'upscale', 'faceswap')." },
      { param: "status", type: "string", desc: "Terminal state: succeeded, failed, or rejected." },
      { param: "progress", type: "int", desc: "Percentage (100 for terminal states)." },
      { param: "ok", type: "bool", desc: "Indicates if the job was technically successful." },
      { param: "ts", type: "string", desc: "Event timestamp (ISO 8601)." },
      { param: "created_at_ms", type: "long", desc: "Creation time in milliseconds." },
      { param: "queued_at", type: "string", desc: "Time the job entered the queue." },
      { param: "started_at", type: "string", desc: "Processing start time." },
      { param: "finished_at", type: "string", desc: "Processing completion time." },
      { param: "duration", type: "float", desc: "Total execution time in seconds." },
      { param: "predict_time", type: "int", desc: "Initial estimated complexity (sec)." },
      { param: "eta_utc", type: "string", desc: "Target completion deadline." },
      { param: "result.url", type: "string", desc: "Public URL to the generated file." },
      { param: "result.filename", type: "string", desc: "Original system filename." },
      { param: "result.meta", type: "object", desc: "Hardware and dimension metadata." },
      { param: "result.meta.backend", type: "string", desc: "Processing node ID (e.g., 'UPVN1-1')." },
      { param: "error", type: "object", desc: "Presence indicates failure (see Error Codes)." },
      { param: "error.code", type: "string", desc: "System code (e.g., 'EXCEPTION', 'NSFW')." },
      { param: "error.message", type: "string", desc: "Human-readable failure reason." }
    ],
    snippets: [
      {
        title: "Standard Success Payload",
        language: "json",
        snippet: `{
  "event": "job.finished",
  "event_id": "f03675fc03334822be22b98e...",
  "status": "succeeded",
  "ok": true,
  "duration": 5.198,
  "result": {
    "url": "http://15.235.200.66:2022/files/result.jpg",
    "meta": { "width": 507, "height": 678, "backend": "UPVN1-1" }
  },
  "created_at_ms": 1770228253773,
  "ts": "2026-02-04T18:04:19Z"
}`
      }
    ],
    error_codes: [
      { code: "EXCEPTION", desc: "General processing error. Usually indicates an inaccessible input URL or corrupted file." },
      { code: "NSFW_BLOCKED", desc: "Content violates safety policies. The job is rejected before processing." },
      { code: "TIMEOUT", desc: "Processing exceeded the maximum allowed duration for the task type." },
      { code: "INVALID_PAYLOAD", desc: "Required fields are missing or data types are incorrect." }
    ],
    next: "face-swap"
  },
  "face-swap": {
    title: "Face Swap (Image)",
    content: "Supports high-precision face replacement. \n\n**Mode 1: Single Face** (task: `faceswap`)\n**Mode 2: Multi-Face** (task: `faceswap_multi`)",
    parameters: [
      { param: "target_url", type: "string", desc: "Required. Target image URL." },
      { param: "source_url", type: "string", desc: "Source image for Single Face mode." },
      { param: "source_urls", type: "array", desc: "Array of sources for Multi-Face mode." },
      { param: "swap_faces_index", type: "array", desc: "Source face indices (Multi mode)." },
      { param: "target_faces_index", type: "array", desc: "Target face indices (Multi mode)." },
      { param: "max_side", type: "int", desc: "Max dimension (Default: 1280)." },
      { param: "upscale", type: "0/1", desc: "Enable resolution enhancement (Default: 1)." },
      { param: "sharpen", type: "float", desc: "Sharpness level (e.g., 0.5)." },
      { param: "max_faces", type: "int", desc: "Max faces to process." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"faceswap_multi\",\n    \"payload\": {\n       \"source_urls\": [\"f1.jpg\", \"f2.jpg\"],\n       \"target_url\": \"group.jpg\",\n       \"swap_faces_index\": [0, 1],\n       \"target_faces_index\": [2, 0]\n    }\n  }'"
    },
    next: "video-face-swap"
  },
  "video-face-swap": {
    title: "Face Swap (Video)",
    content: "Replace faces in video files while preserving high fidelity and audio syncing.",
    parameters: [
      { param: "target_url", type: "string", desc: "Required. Target video URL." },
      { param: "source_url", type: "string", desc: "Source face for single replacement." },
      { param: "source_urls", type: "array", desc: "Sources for multi-face replacement." },
      { param: "keep_audio", type: "0/1", desc: "Preserve original audio (Default: 1)." },
      { param: "fps", type: "int", desc: "Output frame rate control." },
      { param: "resolution", type: "string", desc: "Target resolution (e.g., 720p)." },
      { param: "crop_mode", type: "string", desc: "Facial cropping strategy." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"faceswap_video\",\n    \"payload\": {\n       \"source_url\": \"face.jpg\",\n       \"target_url\": \"clip.mp4\",\n       \"keep_audio\": 1\n    }\n  }'"
    },
    next: "upscale-beauty"
  },
  "upscale-beauty": {
    title: "Upscale & Beauty",
    content: "Enhance resolution and apply studio-grade facial aesthetics. Use the `beauty_full_face` object for fine-grained control.",
    parameters: [
      { param: "target_url", type: "string", desc: "Required. Image to enhance." },
      { param: "max_side", type: "int", desc: "Target max dimension (e.g., 2048)." },
      { param: "upscale", type: "0/1", desc: "Toggle SR enhancement (Default: 1)." },
      { param: "restore_face", type: "0/1", desc: "Face restoration (Default: 1)." },
      { param: "sharpen", type: "float", desc: "Detail sharpening (e.g., 0.2)." },
      { param: "beauty_full_face.enabled", type: "bool", desc: "Enable beauty suite." },
      { param: "beauty_full_face.skin_smoothing", type: "float", desc: "Skin texture smoothing." },
      { param: "beauty_full_face.face_slim", type: "float", desc: "Facial slimming strength." },
      { param: "beauty_full_face.preset", type: "string", desc: "Presets: natural, glamour, studio." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"upscale\",\n    \"payload\": {\n       \"target_url\": \"lowres.jpg\",\n       \"beauty_full_face\": { \"enabled\": 1, \"preset\": \"glamour\" }\n    }\n  }'"
    },
    next: "virtual-try-on"
  },
  "virtual-try-on": {
    title: "Virtual Try-On",
    content: "Seamlessly graft clothing items onto human subjects. Supports categories like upper, lower, and fullset.",
    parameters: [
      { param: "person_image_url", type: "string", desc: "Required. Photo of the person." },
      { param: "garment_image_url", type: "string", desc: "Required. Photo of the garment." },
      { param: "category", type: "string", desc: "Type: auto, upper, lower, full." },
      { param: "num_steps", type: "int", desc: "Diffusion steps (Default: 25)." },
      { param: "guidance_scale", type: "float", desc: "Prompt adherence (Default: 2.0)." },
      { param: "seed", type: "int", desc: "Random seed for reproducibility." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"try_on\",\n    \"payload\": {\n       \"person_image_url\": \"p.jpg\",\n       \"garment_image_url\": \"g.png\",\n       \"category\": \"auto\"\n    }\n  }'"
    },
    next: "ahv-image-gen"
  },
  "ahv-image-gen": {
    title: "AHV Image Gen",
    content: "Generate stunning AI images with identity preservation. Supports high-fidelity face injection.",
    parameters: [
      { param: "prompt", type: "string", desc: "Required. Visual description text." },
      { param: "neg_prompt", type: "string", desc: "Excluded elements (Default: blurry)." },
      { param: "image_url", type: "string", desc: "Reference image for face ID." },
      { param: "id_weight", type: "float", desc: "Identity strength (Default: 1.0)." },
      { param: "guidance", type: "float", desc: "CFG Scale (Default: 4.0)." },
      { param: "width/height", type: "int", desc: "Output dimensions." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"ahv_image\",\n    \"payload\": { \"prompt\": \"Cinematic photo\", \"id_weight\": 0.8 }\n  }'"
    },
    next: "ahv-video-gen"
  },
  "ahv-video-gen": {
    title: "AHV Video Gen",
    content: "Transform images into cinematic motion clips. Features high-speed `go_fast` mode.",
    parameters: [
      { param: "image_url", type: "string", desc: "Required. Static source image." },
      { param: "prompt", type: "string", desc: "Motion description (e.g., zooming)." },
      { param: "resolution", type: "string", desc: "Height (e.g., 480, 720)." },
      { param: "aspect_ratio", type: "string", desc: "Format (e.g., 16:9)." },
      { param: "go_fast", type: "0/1", desc: "Rapid generation mode (Default: 1)." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"ahv_video\",\n    \"payload\": { \"image_url\": \"...\", \"go_fast\": 1 }\n  }'"
    },
    next: "object-removal"
  },
  "object-removal": {
    title: "Object Removal",
    content: "Clean scenes by removing unwanted elements via text prompts or precise mask URLs.",
    parameters: [
      { param: "target_url", type: "string", desc: "Required. Source image URL." },
      { param: "mask_urls", type: "array", desc: "Reference mask images (PNG)." },
      { param: "prompt", type: "string", desc: "Entity to remove (e.g., 'car')." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{\n    \"task\": \"remove_object\",\n    \"payload\": { \"prompt\": \"power lines\", \"target_url\": \"...\" }\n  }'"
    },
    next: "background-removal"
  },
  "background-removal": {
    title: "Background Removal",
    content: "High-precision AI background separation for products and portraits.",
    parameters: [
      { param: "target_url", type: "string", desc: "Required. Image URL." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{ \"task\": \"remove_background\", \"payload\": { \"target_url\": \"...\" } }'"
    },
    next: "scan-objects"
  },
  "scan-objects": {
    title: "Scan Objects",
    content: "Real-time object detection returning classification labels and precise bounding boxes.",
    parameters: [
      { param: "target_url", type: "string", desc: "Required. Scene image." },
      { param: "threshold", type: "float", desc: "Confidence floor (Default: 0.35)." },
      { param: "max_items", type: "int", desc: "Limit results (Default: 15)." }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/v1/jobs\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{ \"task\": \"scan_objects\", \"payload\": { \"threshold\": 0.4 } }'"
    },
    next: "system-management"
  },
  "system-management": {
    title: "System Management",
    content: "Monitor and manage your orchestrator instance. Access live stats and backend health.",
    management_endpoints: [
      { method: "GET", endpoint: "/stats", desc: "List the most recent jobs." },
      { method: "GET", endpoint: "/v1/jobs/{id}", desc: "Poll job status (No Webhook)." },
      { method: "DELETE", endpoint: "/tasks/{id}", desc: "Delete job from system." },
      { method: "GET", endpoint: "/diag/backends", desc: "View GPU node load status." }
    ],
    code: {
      language: "bash",
      snippet: "curl -H \"X-API-Key: YOUR_KEY\" \"https://api.ahvai.ai/diag/backends\""
    },
    next: "job-lifecycle"
  },
  "job-lifecycle": {
    title: "Job Status & Lifecycle",
    content: "Jobs progress through specific states during their lifecycle. Click on a status badge below to view the expected JSON response.",
    statuses: [
      { 
        status: "QUEUED", 
        desc: "Waiting in the processing queue. Status is 'queued'.",
        payload: `{
  "event": "job.queued",
  "event_id": "3d68848418af45a4934734d44d2e411f",
  "ts": "2026-02-04T18:04:14.260888+00:00",
  "job_id": "d1142818265748d9914053dafc20dd98",
  "task": "upscale",
  "status": "queued",
  "progress": 0,
  "ok": false,
  "created_at": "2026-02-04T18:04:13.773524+00:00",
  "created_at_ms": 1770228253773,
  "queued_at": "2026-02-04T18:04:13.773524+00:00",
  "queued_at_ms": 1770228253773,
  "duration": null,
  "predict_time": 3,
  "eta_utc": "2026-02-04T18:04:16.773638+00:00",
  "queue": { "size": 1, "max": 1000 }
}`
      },
      { 
        status: "RUNNING", 
        desc: "Backend node is processing the task. Status is 'running'.",
        payload: `{
  "event": "job.started",
  "event_id": "254a0f244e2f475292bc8c3a1fdc2947",
  "ts": "2026-02-04T18:04:14.264934+00:00",
  "job_id": "d1142818265748d9914053dafc20dd98",
  "status": "running",
  "progress": 15,
  "ok": false,
  "started_at": "2026-02-04T18:04:14.264808+00:00",
  "started_at_ms": 1770228254264,
  "eta_utc": "2026-02-04T18:04:16.773638+00:00"
}`
      },
      { 
        status: "SUCCEEDED", 
        desc: "Completed successfully. Final result is in `result.url`.",
        payload: `{
  "event": "job.finished",
  "event_id": "f03675fc03334822be22b98ee9215c1d",
  "ts": "2026-02-04T18:04:19.463754+00:00",
  "job_id": "d1142818265748d9914053dafc20dd98",
  "task": "upscale",
  "status": "succeeded",
  "progress": 100,
  "ok": true,
  "created_at_ms": 1770228253773,
  "duration": 5.198,
  "result": {
    "ok": true,
    "status": "succeeded",
    "url": "https://api.ahvai.ai/files/result.jpg",
    "filename": "result.jpg",
    "meta": { "width": 507, "height": 678, "backend": "UPVN1-1" }
  }
}`
      },
      { 
        status: "FAILED", 
        desc: "Process failed due to technical error. Status is 'failed'.",
        payload: `{
  "event": "job.finished",
  "event_id": "0e466e41f5e84e899f994d6bbc2cd432",
  "job_id": "0b2f77e4c58b4279a8cfab101e4350eb",
  "status": "failed",
  "ok": false,
  "error": {
    "code": "EXCEPTION",
    "message": "Không đọc được ảnh target_url (<=20MB)"
  },
  "duration": 5.14
}`
      },
      { 
        status: "REJECTED", 
        desc: "Request rejected due to NSFW or policy violation. Status is 'rejected'.",
        payload: `{
  "event": "job.finished",
  "job_id": "45b1cf4c300042bf9ae020320fb5899b",
  "status": "rejected",
  "ok": false,
  "result": {
    "ok": false,
    "status": "rejected",
    "url": "https://api.ahvai.ai/img/block.jpg",
    "error": { "code": "NSFW_BLOCKED", "message": "Nội dung không phù hợp." }
  },
  "error": { "code": "NSFW_BLOCKED", "message": "Nội dung không phù hợp." }
}`
      }
    ],
    code: {
      language: "bash",
      snippet: "curl -H \"X-API-Key: YOUR_KEY\" \"https://api.ahvai.ai/v1/jobs/{id}\""
    },
    next: "direct-apis"
  },
  "direct-apis": {
    title: "Direct Blocking APIs",
    content: "Scale directly using blocking calls for synchronous response requirements.",
    direct_endpoints: [
      { method: "POST", endpoint: "/faceswap", desc: "Image Face Swap" },
      { method: "POST", endpoint: "/faceswap/video", desc: "Video Face Swap" },
      { method: "POST", endpoint: "/upscale", desc: "Upscale & Restore" },
      { method: "POST", endpoint: "/ahv/image", desc: "AI Image Generation" },
      { method: "POST", endpoint: "/ahv/video", desc: "AI Video Generation" },
      { method: "POST", endpoint: "/remove-object", desc: "Object Removal" },
      { method: "POST", endpoint: "/scan-objects", desc: "Object Detection" },
      { method: "POST", endpoint: "/remove-background", desc: "Background Removal" }
    ],
    code: {
      language: "bash",
      snippet: "curl -X POST \"https://api.ahvai.ai/upscale\" \\\n  -H \"X-API-Key: YOUR_KEY\" \\\n  -d '{ \"payload\": { ... } }'"
    }
  }
};
