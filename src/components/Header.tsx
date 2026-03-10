"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './header.module.css';

const NAV_ITEMS = [
    { label: '치유 농업', href: '/programs/healing' },
    { label: '원데이 클래스', href: '/programs/oneday' },
    { label: '원예 힐링', href: '/programs/horticulture' },
    { label: '공간 대여', href: '/programs/rental' },
    { label: '사회적 농업', href: '/programs/social' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {isMenuOpen && (
                <div className={styles.backdrop} onClick={() => setIsMenuOpen(false)} />
            )}
            <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={`container ${styles.inner}`}>
                    <Link href="/" className={styles.logo}>
                        천연쟁이 꽃뜰
                    </Link>

                    <nav className={`${styles.nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                        <Link href="#contact" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }} onClick={() => setIsMenuOpen(false)}>
                            상담하기
                        </Link>
                    </nav>

                    <button
                        className={styles.hamburger}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`${styles.bar} ${isMenuOpen ? styles.open1 : ''}`}></div>
                        <div className={`${styles.bar} ${isMenuOpen ? styles.open2 : ''}`}></div>
                        <div className={`${styles.bar} ${isMenuOpen ? styles.open3 : ''}`}></div>
                    </button>
                </div>
            </header>
        </>
    );
}
