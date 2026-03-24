'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './BlogCard.css';

interface BlogCardProps {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ category, date, title, excerpt, image, slug }) => {
  return (
    <div className="blog-card glass hover-glow">
      <div className="blog-card-image">
        <Image 
          src={image} 
          alt={title} 
          width={600} 
          height={400} 
          className="object-cover"
        />
        <span className="blog-category">{category}</span>
      </div>
      <div className="blog-card-content">
        <span className="blog-date">{date}</span>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="read-more">
          Read Story <span>→</span>
        </Link>
      </div>
    </div>
  );
};


export default BlogCard;
