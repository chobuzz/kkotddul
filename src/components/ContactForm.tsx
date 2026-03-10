"use client";

import { useState } from 'react';
import styles from './contact-form.module.css';
import { CATEGORY_LABELS } from '@/lib/types';

const TIME_OPTIONS = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00',
];

interface Props {
    programTitle?: string;
    categoryColor?: string;
}

export default function ContactForm({ programTitle, categoryColor = '#B2AC88' }: Props) {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className={styles.success}>
                <span className={styles.successIcon}>✓</span>
                <h3>신청이 완료되었습니다!</h3>
                <p>빠른 시간 안에 담당자가 연락드리겠습니다.</p>
                <button className={styles.resetBtn} onClick={() => setSubmitted(false)}>다시 신청하기</button>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <label>성함 <span className={styles.required}>*</span></label>
                    <input type="text" placeholder="홍길동" required />
                </div>
                <div className={styles.field}>
                    <label>연락처 <span className={styles.required}>*</span></label>
                    <input type="tel" placeholder="010-0000-0000" required />
                </div>
            </div>

            <div className={styles.field}>
                <label>카테고리 <span className={styles.required}>*</span></label>
                <select defaultValue={programTitle ?? ''} required>
                    <option value="" disabled>프로그램을 선택하세요</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={label}>{label}</option>
                    ))}
                </select>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label>희망 날짜 <span className={styles.required}>*</span></label>
                    <input type="date" required />
                </div>
                <div className={styles.field}>
                    <label>희망 시간 <span className={styles.required}>*</span></label>
                    <select required defaultValue="">
                        <option value="" disabled>시간 선택</option>
                        {TIME_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                <label>인원수 <span className={styles.required}>*</span></label>
                <input type="number" min="1" max="200" placeholder="인원수를 입력하세요" required />
            </div>

            <div className={styles.field}>
                <label>문의 사항</label>
                <textarea placeholder="추가로 문의하실 내용을 적어주세요."></textarea>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                style={{ '--accent': categoryColor } as React.CSSProperties}
            >
                상담 신청하기
            </button>
        </form>
    );
}
