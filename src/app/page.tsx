"use client";

import Link from 'next/link';
import styles from "./page.module.css";
import Scheduler from "@/components/scheduler/Scheduler";

const programs = [
  {
    title: "치유 농업 프로그램",
    description: "기관, 기업 복지 및 맞춤형 정서 치유 프로그램",
    category: "category-1",
    href: "/programs/healing",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "원데이 클래스",
    description: "비누, 양초, 자격증반 단체 클래스 운영",
    category: "category-2",
    href: "/programs/oneday",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "원예 힐링 프로그램",
    description: "식물을 통한 심리적 안정과 치유의 시간",
    category: "category-3",
    href: "/programs/horticulture",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "공간 대여",
    description: "450평 규모의 프라이빗 정원 및 부대시설 이용",
    category: "category-4",
    href: "/programs/rental",
    image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "사회적 농업",
    description: "지역사회와 상생하며 농업의 가치를 나누는 활동",
    category: "category-5",
    href: "/programs/social",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroTextTop}>자연이 주는 온전한 쉼</span>
          <h1 className={styles.heroTitle}>천연쟁이 꽃뜰</h1>
          <p className={styles.heroSubtitle}>
            치유 농업과 원예 힐링을 통해 <br />
            일상에 활기를 불어넣는 프리미엄 힐링 공간입니다.
          </p>
          <div className={styles.heroCta}>
            <Link href="#calendar" className="btn-primary">일정 확인하기</Link>
            <Link href="/programs/healing#contact" className="btn-secondary">상담 문의하기</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>우리의 프로그램</h2>
            <p className={styles.sectionDesc}>다양한 프로그램을 통해 자연의 가치를 직접 체험해보세요.</p>
          </div>

          <div className={styles.grid}>
            {programs.map((program, idx) => (
              <div key={idx} className={styles.card}>
                <div
                  className={styles.cardCover}
                  style={{ backgroundImage: `url(${program.image})` }}
                >
                  <span className={`${styles.badge} ${styles[program.category]}`}>
                    {program.title.split(' ')[0]}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{program.title}</h3>
                  <p className={styles.cardDesc}>{program.description}</p>
                  <Link href={program.href} className={styles.cardBtn}>자세히 보기 ➔</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scheduler Section */}
      <section className={styles.section} id="calendar">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>스마트 스케줄러</h2>
            <p className={styles.sectionDesc}>현재 운영 중인 모든 일정을 한눈에 확인하세요.</p>
          </div>
          <Scheduler />
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className={styles.booking}>
        <div className="container">
          <div className={styles.bookingInner}>
            <div className={styles.bookingText}>
              <h2>프라이빗 가든에서 특별한 하루를 계획하세요</h2>
              <p>450평 규모의 아름다운 정원이 당신을 기다립니다.</p>
            </div>
            <Link href="/programs/rental#contact" className="btn-primary">실시간 예약하기</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
