'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Reveal from '@/components/Reveal/Reveal';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = {
  "future-of-multimodal-ai": {
    category: "AI Technology",
    date: "March 20, 2026",
    title: "The Future of Multimodal AI Agents",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
    content: `
      <p>The next generation of AI agents will not just be limited to text. They will be multimodal by nature, meaning they can process and generate text, images, video, and audio simultaneously.</p>
      <p>Imagine an AI assistant that can watch you cook a meal via a camera, realize you're about to overseason the dish, and tell you to stop in real-time. Or an engineering agent that can take a screenshot of a bug, write the code to fix it, and then generate a video walkthrough of the solution.</p>
      <h2>Why Multimodal Matters</h2>
      <p>Human intelligence is inherently multimodal. We don't just read about the world; we see it, hear it, and touch it. To reach truly useful artificial intelligence, machines must be able to do the same.</p>
      <p>At AHV AI, we are working on core architectures that allow for seamless switching between different data types without losing context. Our latest models are 40% faster at cross-modal inference compared to the previous generation.</p>
    `
  },
  "optimizing-api-performance": {
    category: "Development",
    date: "March 18, 2026",
    title: "Optimizing API Performance for Scale",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1632&auto=format&fit=crop",
    content: `
      <p>Scale is the ultimate test of any API. What works for 1,000 users will often break at 1,000,000. In this post, we explore the best practices for building resilient, high-speed API infrastructures.</p>
      <h2>Caching Strategies</h2>
      <p>Effective caching is the single most important factor in API performance. We use a multi-layer caching approach, starting from the edge with CDNs to internal Redis clusters for frequently accessed data.</p>
      <h2>Asynchronous Processing</h2>
      <p>Never make a user wait for a background task. If an API call triggers a long-running process, return a 202 Accepted immediately and push the work to a message queue like RabbitMQ or Kafka.</p>
    `
  },
  "generative-video-frontier": {
    category: "Creative AI",
    date: "March 15, 2026",
    title: "Generative Video: The New Content Frontier",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4628c9757?q=80&w=1632&auto=format&fit=crop",
    content: `
      <p>The transition from generative images to generative video is happening faster than anyone predicted. We are now at a point where simple text prompts can create high-fidelity cinematic experiences.</p>
      <p>Models like Luma and Kling are leading the way, but the underlying technology is evolving weekly. The key challenge remains temporal consistency—ensuring that an object looks the same from the first frame to the last.</p>
    `
  },
  "ahv-ai-v2-announcement": {
    category: "Company News",
    date: "March 10, 2026",
    title: "AHV AI v2.0: What's New in the Latest Update",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1632&auto=format&fit=crop",
    content: `
      <p>We're thrilled to officially launch AHV AI v2.0. This update is the result of six months of intensive research and development, focusing on inference speed and developer experience.</p>
      <h2>What's New?</h2>
      <ul>
        <li><strong>50% Lower Latency:</strong> New optimized kernels for GPU inference.</li>
        <li><strong>Enhanced Multimodal Support:</strong> Better alignment between vision and language models.</li>
        <li><strong>Enterprise Dashboard:</strong> A completely redesigned interface for managing large-scale deployments.</li>
      </ul>
    `
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <main className="min-h-screen pt-20">
        <Header />
        <div className="container text-center py-100">
          <h1 className="section-title">Post Not Found</h1>
          <Link href="/blog" className="btn-primary mt-20 inline-block">Back to Blog</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <article className="blog-detail-container">
        <div className="container-small">
          <Reveal direction="down" delay={0.1} width="100%">
            <div className="blog-detail-header text-center">
              <Link href="/blog" className="back-link">← Back to Blog</Link>
              <div className="blog-meta mb-24">
                <span className="blog-date">{post.category}</span>
                <span className="blog-date">{post.date}</span>
              </div>
              <h1 className="detail-title gradient-text">{post.title}</h1>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="detail-image-wrapper glass mb-40">
              <Image 
                src={post.image} 
                alt={post.title} 
                width={1200} 
                height={600} 
                className="object-cover rounded-32"
              />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div className="detail-content glass" dangerouslySetInnerHTML={{ __html: post.content }} />
          </Reveal>
        </div>
      </article>

      <Footer />
    </main>
  );
}
