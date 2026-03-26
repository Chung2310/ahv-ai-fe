'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Reveal from '@/components/Reveal/Reveal';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

import '../blog.css';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/v1/posts/${id}`);
        if (response.data.success) {
          const postData = response.data.data?.post || response.data.data;
          if (postData && !Array.isArray(postData)) {
            setPost(postData);
          } else {
            setPost(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen pt-20">
        <Header />
        <div className="container py-100 text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-20 text-gray-400">Đang tải chi tiết bài viết...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen pt-20">
        <Header />
        <div className="container text-center py-100">
          <h1 className="section-title">Không tìm thấy bài viết</h1>
          <Link href="/blog" className="btn-primary mt-20 inline-block">Quay lại Blog</Link>
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
            <div className="back-nav">
              <Link href="/blog" className="back-link">
                <span>←</span> Quay lại Blog
              </Link>
            </div>
          </Reveal>

          <Reveal direction="down" delay={0.15} width="100%">
            <div className="blog-detail-header">
              <div className="blog-meta mb-24">
                <span className="blog-category" style={{ background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {post.categoryId?.name || post.categoryId || "AI Technology"}
                </span>
                <span className="blog-date" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : "March 20, 2026"}
                </span>
              </div>
              <h1 className="detail-title gradient-text">{post.title}</h1>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="detail-image-wrapper">
              <Image 
                src={post.thumbnail || post.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop"} 
                alt={post.title} 
                width={1200} 
                height={675} 
                className="object-cover"
                priority
              />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div className="detail-content glass" dangerouslySetInnerHTML={{ __html: post.content }} />
          </Reveal>
          
          <div className="detail-footer">
             <Link href="/blog" className="btn-secondary skew-btn" style={{ padding: '12px 32px' }}>
                <span>Xem thêm bài viết khác</span>
             </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

