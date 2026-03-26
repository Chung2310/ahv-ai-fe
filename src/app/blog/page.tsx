'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BlogCard from '@/components/Blog/BlogCard';
import Reveal from '@/components/Reveal/Reveal';
import api from '@/lib/api';
import './blog.css';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          api.get('/api/v1/posts'),
          api.get('/api/v1/categories')
        ]);

        if (postsRes.data.success) {
          const data = postsRes.data.data?.posts || postsRes.data.data || [];
          setPosts(Array.isArray(data) ? data : []);
        }
        if (catsRes.data.success) {
          const data = catsRes.data.data?.categories || catsRes.data.data || [];
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch blog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => {
        const catName = post.categoryId?.name || post.categoryId || '';
        return catName === selectedCategory;
      });

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <Header />
        <div className="container py-100 text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-20 text-gray-400">Loading insights...</p>
        </div>
        <Footer />
      </main>
    );
  }

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

          {/* Category Filter */}
          <Reveal width="100%" direction="up" delay={0.1}>
            <div className="category-filters mb-40 flex flex-wrap justify-center gap-4">
              <button 
                className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All Posts
              </button>
              {categories.map((cat: any) => (
                <button 
                  key={cat.id || cat._id}
                  className={`filter-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Featured Post */}
          {featuredPost ? (
            <Reveal width="100%" direction="up" delay={0.2} distance={40}>
              <div className="featured-post glass">
                <Link href={`/blog/${featuredPost._id || featuredPost.id}`} className="featured-image">
                  <Image 
                    src={featuredPost.thumbnail || featuredPost.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop"} 
                    alt={featuredPost.title} 
                    width={1200} 
                    height={600} 
                    priority
                    className="object-cover"
                  />
                </Link>
                <div className="featured-content">
                  <span className="blog-category">{featuredPost.categoryId?.name || "AI Technology"}</span>
                  <span className="blog-date">
                    {featuredPost.createdAt ? new Date(featuredPost.createdAt).toLocaleDateString('vi-VN') : featuredPost.date || "March 20, 2026"}
                  </span>
                  <h2 className="featured-title">
                    <Link href={`/blog/${featuredPost._id || featuredPost.id}`}>{featuredPost.title}</Link>
                  </h2>
                  <p className="featured-excerpt">{featuredPost.excerpt || featuredPost.description || "Explore how the next generation of AI agents will seamlessly navigate between data processing."}</p>
                  <Link href={`/blog/${featuredPost._id || featuredPost.id}`} className="btn-primary skew-btn">
                    <span>Read Featured Post</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="text-center py-40">
              <p className="text-gray-400">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="blog-grid-section mb-100">
        <div className="container">
          <div className="blog-grid">
            {remainingPosts.map((post, index) => (
              <Reveal key={post._id || post.id} delay={index * 0.1} direction="up" distance={30}>
                <BlogCard 
                  category={post.categoryId?.name || "AI Technology"}
                  date={post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : post.date || "March 20, 2026"}
                  title={post.title}
                  excerpt={post.excerpt || post.description || ""}
                  image={post.thumbnail || post.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1632&auto=format&fit=crop"}
                  id={post._id || post.id}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


