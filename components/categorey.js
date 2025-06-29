"use client";
// components/Category.js
// import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link, animateScroll as scroll } from "react-scroll"; // Import from react-scroll
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";

const Category = () => {
  const t = useTranslations();
  const { categories, loading } = useSelector((state) => state.apiData);
  const lang = useSelector((state) => state.language.lang);
  
  // Memoize the formatImageUrl function to prevent recreation on every render
  const formatImageUrl = useCallback((url) => {
    if (!url) return '';
    if (url.startsWith('http')) {
      return url;
    }
    // Replace backslashes with forward slashes
    const formattedUrl = url.replace(/\\/g, '/');
    // Remove any leading slashes to avoid double slashes
    const cleanUrl = formattedUrl.replace(/^\/+/, '');
    const finalUrl = `${process.env.NEXT_PUBLIC_API_UPLOADS}/${cleanUrl}`;
    return finalUrl;
  }, []);

  // Memoize formatted categories to prevent unnecessary re-renders
  const formattedCategories = useMemo(() => {
    if (!categories) return [];
    return categories.map(category => ({
      ...category,
      formattedImage: formatImageUrl(category.image)
    }));
  }, [categories, formatImageUrl]);

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <div className="categorey-grid" id="categorey-box">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="categorey-item">
            <div className="featured-image skeleton-image"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="categorey-grid" id="categorey-box">
      {formattedCategories.map((category) => (
        <div key={category._id} className="categorey-item">
          <Link 
            key={`/#{category.slug}`}
            to={category.slug}
            smooth={true}
            offset={-150} // Adjust for your navbar height
            duration={500} // Duration of the scroll animation (500ms)
          >
            <div className="featured-image-container">
              {category.formattedImage ? (
                <Image
                  src={category.formattedImage}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="featured-image"
                  priority={true}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              ) : (
                <div className="featured-image-placeholder"></div>
              )}
            </div>
            <div>
              <h2>{category.name}</h2>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Category;