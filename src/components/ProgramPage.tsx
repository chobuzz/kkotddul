import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import styles from './program-page.module.css';

interface ProgramDetail {
    badge: string;
    title: string;
    subtitle: string;
    heroImage: string;
    categoryColor: string;
    overview: string;
    targets: string[];
    curriculum: { title: string; desc: string }[];
    features: { icon: string; title: string; desc: string }[];
    ctaText?: string; // optional
}

interface ProgramPageProps {
    data: ProgramDetail;
}

export default function ProgramPage({ data }: ProgramPageProps) {
    return (
        <main className={styles.main}>
            {/* 히어로 */}
            <section
                className={styles.hero}
                style={{ backgroundImage: `url(${data.heroImage})` }}
            >
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.badge} style={{ backgroundColor: data.categoryColor }}>{data.badge}</span>
                    <h1 className={styles.heroTitle}>{data.title}</h1>
                    <p className={styles.heroSubtitle}>{data.subtitle}</p>
                    <Link href="#contact" className={styles.ctaBtn}>상담 및 예약 문의 ↓</Link>
                </div>
            </section>

            {/* 프로그램 개요 */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.overview}>
                        <h2 className={styles.sectionTitle}>프로그램 소개</h2>
                        <p className={styles.overviewText}>{data.overview}</p>
                    </div>
                    <div className={styles.targetsWrap}>
                        <h3 className={styles.subTitle}>참여 대상</h3>
                        <div className={styles.targets}>
                            {data.targets.map((t, i) => (
                                <div key={i} className={styles.targetChip} style={{ borderColor: data.categoryColor, color: data.categoryColor }}>
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 커리큘럼 */}
            <section className={styles.sectionAlt}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>커리큘럼</h2>
                    <div className={styles.curriculum}>
                        {data.curriculum.map((item, i) => (
                            <div key={i} className={styles.curriculumItem}>
                                <div className={styles.curriculumStep} style={{ backgroundColor: data.categoryColor }}>Step {i + 1}</div>
                                <div>
                                    <h4 className={styles.curriculumTitle}>{item.title}</h4>
                                    <p className={styles.curriculumDesc}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 특장점 */}
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>왜 꽃뜰인가요?</h2>
                    <div className={styles.features}>
                        {data.features.map((f, i) => (
                            <div key={i} className={styles.featureCard}>
                                <span className={styles.featureIcon}>{f.icon}</span>
                                <h4 className={styles.featureTitle}>{f.title}</h4>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 문의/예약 폼 - 깔끔한 화이트 디자인 */}
            <section className={styles.contactSection} id="contact">
                <div className="container">
                    <div className={styles.contactInner}>
                        <div className={styles.contactLeft}>
                            <span className={styles.contactBadge} style={{ backgroundColor: `${data.categoryColor}20`, color: data.categoryColor }}>{data.badge}</span>
                            <h2 className={styles.contactTitle}>상담 및 예약 문의</h2>
                            <p className={styles.contactDesc}>
                                아래 양식을 작성해 주시면<br />
                                최대한 빠르게 안내드리겠습니다.
                            </p>
                            <div className={styles.contactInfo}>
                                <div className={styles.infoItem}>
                                    <span>📞</span>
                                    <span>010-1234-5678</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span>⏰</span>
                                    <span>평일 9:00 – 18:00</span>
                                </div>
                            </div>
                        </div>
                        <ContactForm programTitle={data.badge} categoryColor={data.categoryColor} />
                    </div>
                </div>
            </section>
        </main>
    );
}
