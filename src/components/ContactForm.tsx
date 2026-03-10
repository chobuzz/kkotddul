"use client";

import { useState } from 'react';
import styles from './contact-form.module.css';
import { CATEGORY_LABELS } from '@/lib/types';
import { apiSubmitForm, generateId } from '@/lib/api';

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
});

interface Props {
    programTitle?: string;
    categoryColor?: string;
}

export default function ContactForm({ programTitle, categoryColor = '#B2AC88' }: Props) {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitting) return;

        const formData = new FormData(e.currentTarget);
        const payload = {
            id: generateId(),
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            category: formData.get('category') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            participants: Number(formData.get('participants')),
            note: formData.get('note') as string,
        };

        setIsSubmitting(true);
        const success = await apiSubmitForm(payload);
        setIsSubmitting(false);

        if (success) {
            setSubmitted(true);
        } else {
            alert('상담 신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
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
                    <input type="text" name="name" placeholder="홍길동" required />
                </div>
                <div className={styles.field}>
                    <label>연락처 <span className={styles.required}>*</span></label>
                    <input type="tel" name="phone" placeholder="010-0000-0000" required />
                </div>
            </div>

            <div className={styles.field}>
                <label>이메일 <span className={styles.required}>*</span></label>
                <input type="email" name="email" placeholder="example@email.com" required />
            </div>

            <div className={styles.field}>
                <label>카테고리 <span className={styles.required}>*</span></label>
                <select name="category" defaultValue={programTitle ?? ''} required>
                    <option value="" disabled>프로그램을 선택하세요</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={label}>{label}</option>
                    ))}
                </select>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label>희망 날짜 <span className={styles.required}>*</span></label>
                    <input type="date" name="date" required />
                </div>
                <div className={styles.field}>
                    <label>희망 시간 <span className={styles.required}>*</span></label>
                    <select name="time" required defaultValue="">
                        <option value="" disabled>시간 선택</option>
                        {TIME_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                <label>인원수 <span className={styles.required}>*</span></label>
                <input type="number" name="participants" min="1" max="200" placeholder="인원수를 입력하세요" required />
            </div>

            <div className={styles.field}>
                <label>문의 사항</label>
                <textarea name="note" placeholder="추가로 문의하실 내용을 적어주세요."></textarea>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                style={{ '--accent': categoryColor } as React.CSSProperties}
                disabled={isSubmitting}
            >
                {isSubmitting ? '처리 중...' : '상담 신청하기'}
            </button>
        </form>
    );
}
