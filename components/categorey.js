"use client";
// components/Category.js
// import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link, animateScroll as scroll } from "react-scroll"; // Import from react-scroll
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Category = () => {
  const t = useTranslations();
  const { categories } = useSelector((state) => state.apiData);
  const lang = useSelector((state) => state.language.lang);
  const [formattedCategories, setFormattedCategories] = useState([]);

  const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) {
      return url;
    }
    // Replace backslashes with forward slashes
    const formattedUrl = url.replace(/\\/g, '/');
    // Remove any leading slashes to avoid double slashes
    const cleanUrl = formattedUrl.replace(/^\/+/, '');
    const finalUrl = `${process.env.NEXT_PUBLIC_API_UPLOADS}/${cleanUrl}`;
    console.log('Image URL:', {
      original: url,
      formatted: formattedUrl,
      clean: cleanUrl,
      final: finalUrl
    });
    return finalUrl;
  };

  useEffect(() => {
    if (categories) {
      const formatted = categories.map(category => ({
        ...category,
        formattedImage: formatImageUrl(category.image)
      }));
      setFormattedCategories(formatted);
    }
  }, [categories]);

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
            <div
              className="featured-image"
              style={{
                backgroundImage: category.formattedImage ? `url(${category.formattedImage})` : 'none',
              }}
            />
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