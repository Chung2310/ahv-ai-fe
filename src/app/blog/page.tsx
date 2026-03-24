import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BlogCard from '@/components/Blog/BlogCard';
import Reveal from '@/components/Reveal/Reveal';

const blogPosts = [
  {
    category: "AI Technology",
    date: "March 20, 2026",
    title: "The Future of Multimodal AI Agents",
    excerpt: "Explore how the next generation of AI agents will seamlessly navigate between text, images, and video processing to solve complex tasks.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
    slug: "future-of-multimodal-ai"
  },
  {
    category: "Development",
    date: "March 18, 2026",
    title: "Optimizing API Performance for Scale",
    excerpt: "Best practices for building high-speed, resilient API infrastructure that can handle millions of concurrent requests without lag.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1632&auto=format&fit=crop",
    slug: "optimizing-api-performance"
  },
  {
    category: "Generative AI",
    date: "March 15, 2026",
    title: "Generative Video: The New Content Frontier",
    excerpt: "How models like Luma and Kling are revolutionizing how creators produce cinematic content using simple text prompts.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4628c9757?q=80&w=1632&auto=format&fit=crop",
    slug: "generative-video-frontier"
  },
  {
    category: "Company News",
    date: "March 10, 2026",
    title: "AHV AI v2.0: What's New in the Latest Update",
    excerpt: "We're thrilled to announce major improvements to our engine, including faster inference times and dedicated enterprise support channels.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1632&auto=format&fit=crop",
    slug: "ahv-ai-v2-announcement"
  }
];

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <main className="min-h-screen pt-20">
      <Header />

      <section className="blog-hero">
        <div className="container">
          <Reveal width="100%" direction="up">
            <div className="section-header text-center mb-60">
              <h1 className="section-title">Insights from the <span className="gradient-text">AI Frontier.</span></h1>
              <p className="section-subtitle">Stay updated with the latest trends, tutorials, and breakthroughs in artificial intelligence.</p>
            </div>
          </Reveal>

          {/* Featured Post */}
          <Reveal width="100%" direction="up" delay={0.2} distance={40}>
            <div className="featured-post glass">
              <Link href={`/blog/${featuredPost.slug}`} className="featured-image">
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  width={1200} 
                  height={600} 
                  priority
                  className="object-cover"
                />
              </Link>
              <div className="featured-content">
                <span className="blog-category">{featuredPost.category}</span>
                <span className="blog-date">{featuredPost.date}</span>
                <h2 className="featured-title">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p className="featured-excerpt">{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="btn-primary skew-btn">
                  <span>Read Featured Post</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="blog-grid-section mb-100">
        <div className="container">
          <div className="blog-grid">
            {remainingPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.1} direction="up" distance={30}>
                <BlogCard {...post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

