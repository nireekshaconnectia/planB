"use client";
// components/Category.js
// import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link, animateScroll as scroll } from "react-scroll"; // Import from react-scroll
import { useSelector } from "react-redux";

const Category = () => {
  const t = useTranslations();
  const { categories } = useSelector((state) => state.apiData);
  const lang = useSelector((state) => state.language.lang);

  return (
    <div className="categorey-grid" id="categorey-box">
      {categories && categories.map((category) => (
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
                backgroundImage: `url(${category.image})`,
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