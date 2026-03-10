"use client";

import { useState } from 'react';
import styles from './booking.module.css';
import { apiSubmitForm, generateId } from '@/lib/api';

interface BookingFormProps {
    onClose: () => void;
    programTitle?: string;
}

export default function BookingForm({ onClose, programTitle }: BookingFormProps) {
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
            category: programTitle || '일반 상담',
            date: formData.get('date') as string,
            participants: Number(formData.get('participants')),
            note: formData.get('note') as string,
        };

        setIsSubmitting(true);
        const success = await apiSubmitForm(payload);
        setIsSubmitting(false);

        if (success) {
            alert('신청이 완료되었습니다. 확인 메일이 발송되었으며, 곧 연락드리겠습니다!');
            onClose();
        } else {
            alert('상담 신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2 className={styles.title}>예약 / 상담 신청</h2>
                {programTitle && <p className={styles.program}>신청 프로그램: <strong>{programTitle}</strong></p>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label>성함 <span className={styles.required}>*</span></label>
                        <input type="text" name="name" placeholder="성함을 입력하세요" required />
                    </div>
                    <div className={styles.field}>
                        <label>연락처 <span className={styles.required}>*</span></label>
                        <input type="tel" name="phone" placeholder="010-0000-0000" required />
                    </div>
                    <div className={styles.field}>
                        <label>이메일 <span className={styles.required}>*</span></label>
                        <input type="email" name="email" placeholder="example@email.com" required />
                    </div>
                    <div className={styles.field}>
                        <label>희망 날짜 <span className={styles.required}>*</span></label>
                        <input type="date" name="date" required />
                    </div>
                    <div className={styles.field}>
                        <label>희망 시간 (선택)</label>
                        <select name="time" defaultValue="">
                            <option value="" disabled>시간 선택</option>
                            {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>인원수 <span className={styles.required}>*</span></label>
                        <input type="number" name="participants" min="1" placeholder="인원수를 입력하세요" required />
                    </div>
                    <div className={styles.field}>
                        <label>문의 사항</label>
                        <textarea name="note" placeholder="추가 문의사항을 적어주세요"></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={isSubmitting}>
                        {isSubmitting ? '처리 중...' : '신청하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
