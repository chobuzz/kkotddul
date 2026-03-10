import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.top}>
                    <div className={styles.info}>
                        <h3 className={styles.logo}>천연쟁이 꽃뜰</h3>
                        <p className={styles.desc}>자연의 치유와 원예의 힐링이 함께하는 공간</p>
                        <div className={styles.contact}>
                            <p>주소: 경기도 어딘가 450평 정원</p>
                            <p>전화: 010-1234-5678</p>
                            <p>이메일: koteul@example.com</p>
                        </div>
                    </div>
                    <div className={styles.links}>
                        <h4>퀵 링크</h4>
                        <ul>
                            <li><a href="#">브랜드 스토리</a></li>
                            <li><a href="#calendar">교육 일정</a></li>
                            <li><a href="#">공간 대여 문의</a></li>
                            <li><a href="#">사회적 농업 활동</a></li>
                        </ul>
                    </div>
                    <div className={styles.sns}>
                        <h4>SNS</h4>
                        <div className={styles.snsIcons}>
                            {/* 여기에 SNS 아이콘들을 배치할 수 있습니다 */}
                            <a href="#" className={styles.snsLink}>Instagram</a>
                            <a href="#" className={styles.snsLink}>Blog</a>
                            <a href="#" className={styles.snsLink}>YouTube</a>
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p>© 2026 천연쟁이 꽃뜰. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
