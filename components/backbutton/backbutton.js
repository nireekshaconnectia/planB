'use client';

import { useRouter } from 'next/navigation';
import { IoMdArrowBack } from "react-icons/io";
import styles from './BackButton.module.css';

const BackButton = () => {
    const router = useRouter();

    return (
        <button className={styles.backButton} onClick={() => router.back()}>
            <IoMdArrowBack />
        </button>
    );
};

export default BackButton;
