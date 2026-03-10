"use client";

import { useState } from 'react';
import styles from './booking.module.css';

interface BookingFormProps {
    onClose: () => void;
    programTitle?: string;
}

export default function BookingForm({ onClose, programTitle }: BookingFormProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <h2 className={styles.title}>예약 / 상담 신청</h2>
                {programTitle && <p className={styles.program}>신청 프로그램: <strong>{programTitle}</strong></p>}

                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert('신청이 완료되었습니다. 곧 연락드리겠습니다!'); onClose(); }}>
                    <div className={styles.field}>
                        <label>성함</label>
                        <input type="text" placeholder="성함을 입력하세요" required />
                    </div>
                    <div className={styles.field}>
                        <label>연락처</label>
                        <input type="tel" placeholder="010-0000-0000" required />
                    </div>
                    <div className={styles.field}>
                        <label>희망 날짜</label>
                        <input type="date" required />
                    </div>
                    <div className={styles.field}>
                        <label>인원수</label>
                        <input type="number" min="1" placeholder="인원수를 입력하세요" required />
                    </div>
                    <div className={styles.field}>
                        <label>문의 사항</label>
                        <textarea placeholder="추가 문의사항을 적어주세요"></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>신청하기</button>
                </form>
            </div>
        </div>
    );
}
