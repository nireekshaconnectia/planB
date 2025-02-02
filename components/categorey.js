// components/Header.js
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link'
import { useEffect, useRef } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";

const Categorey = () => {
  return (
    <div className="categorey-grid" id="categorey-box">
      <div className="categorey-item">
      <Link href="/dashboard">
        <div className="C-breakfast featured-image">
        </div>
        <div>
        <h2>Breakfast</h2>
        </div></Link>
      </div>
      <div className="categorey-item">
      <Link href="/#hot-drinks">
        <div className="featured-image c-hotdrinks">

        </div>
        <div>
          <h2>Hot Drinks</h2>
        </div></Link>
      </div>
      <div className="categorey-item ">
      <Link href="/dashboard">
        <div className="featured-image c-colddrinks">

        </div>
        <div>
          <h2>Cold Drinks</h2>
        </div></Link>
      </div>
      <div className="categorey-item ">
      <Link href="/dashboard">
        <div className="featured-image c-alldaydishes"></div>
        <div>
          <h2>All Day Dishes</h2>
        </div></Link>
      </div>
      <div className="categorey-item">
      <Link href="/dashboard">
        <div className="featured-image c-salads"></div>
        <div>
          <h2>Salads</h2>
        </div></Link>
      </div>
      <div className="categorey-item">
      <Link href="/dashboard">
        <div className="featured-image c-desserts"></div>
        <div>
          <h2>Desserts</h2>
        </div></Link>
      </div>
      <div className="categorey-item">
      <Link href="/dashboard">
        <div className="featured-image c-icecream"></div>
        <div>
          <h2>Ice Cream</h2>
          {/* <img
            src="https://planb.weblexia.in/wp-content/uploads/2024/01/ArrowElbowDownRight.svg"
            alt="Arrow Elbow Down Right"
            width={30}
            height={30}
            className="custom-arrow"
          /> */}
        </div></Link>
      </div>
      
    </div>
  );
};

export default Categorey;
