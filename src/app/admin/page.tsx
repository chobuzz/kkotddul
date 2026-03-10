"use client";

import { useState, useEffect } from 'react';
import {
    ScheduleEvent,
    CATEGORY_COLORS,
    CATEGORY_LABELS,
    Category,
} from '@/lib/types';
import { getEvents, saveEvents, deleteEvent, generateId } from '@/lib/store';
import styles from './admin.module.css';

interface ScheduleItem {
    date: string;
    startTime: string;
    endTime: string;
}

const EMPTY_FORM = {
    title: '',
    category: 'healing' as Category,
    items: [{ date: '', startTime: '09:00', endTime: '10:00' }] as ScheduleItem[],
    note: '',
    isRecurring: false,
};

type FormData = typeof EMPTY_FORM;

export default function AdminPage() {
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

    useEffect(() => {
        setEvents(getEvents());
    }, []);

    function openNew() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    }

    function openEdit(ev: ScheduleEvent) {
        const { id } = ev;
        setForm({
            title: ev.title,
            category: ev.category,
            items: [{ date: ev.date, startTime: ev.startTime, endTime: ev.endTime }],
            note: ev.note || '',
            isRecurring: ev.isRecurring,
        });
        setEditingId(id);
        setShowForm(true);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    }

    function handleItemChange(index: number, field: keyof ScheduleItem, value: string) {
        const newItems = [...form.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setForm(prev => ({ ...prev, items: newItems }));
    }

    function addItem() {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, { date: '', startTime: '09:00', endTime: '10:00' }]
        }));
    }

    function removeItem(index: number) {
        if (form.items.length <= 1) return;
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let updated: ScheduleEvent[];

        // KST 기준 요일 계산 함수 (0=Sun)
        function getKSTDay(dateStr: string) {
            if (!dateStr) return undefined;
            const parts = dateStr.split('-').map(Number);
            const date = new Date(parts[0], parts[1] - 1, parts[2]); // 로컬 타임존(KST환경)에서 생성
            return date.getDay();
        }

        const baseEvent = {
            title: form.title,
            category: form.category,
            note: form.note,
            isRecurring: form.isRecurring,
        };

        if (editingId) {
            // 수정 시에는 첫 번째 아이템 값으로 업데이트
            const item = form.items[0];
            updated = events.map(ev => ev.id === editingId ? {
                ...ev,
                ...baseEvent,
                date: item.date,
                startTime: item.startTime,
                endTime: item.endTime,
                recurrenceDay: form.isRecurring ? getKSTDay(item.date) : undefined
            } : ev);
        } else {
            // 새 등록 시에는 모든 아이템에 대해 개별 이벤트 생성
            const newEvents = form.items.filter(item => item.date).map(item => ({
                id: generateId(),
                ...baseEvent,
                date: item.date,
                startTime: item.startTime,
                endTime: item.endTime,
                recurrenceDay: form.isRecurring ? getKSTDay(item.date) : undefined
            }));
            updated = [...events, ...newEvents];
        }

        saveEvents(updated);
        setEvents(updated);
        setShowForm(false);
    }

    function handleDelete(id: string) {
        if (!confirm('이 일정을 삭제하시겠습니까?')) return;
        const updated = deleteEvent(id);
        setEvents(updated);
    }

    const filtered = filterCategory === 'all' ? events : events.filter(e => e.category === filterCategory);
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

    return (
        <div className={styles.page}>
            {/* 어드민 헤더 */}
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.pageTitle}>꽃뜰 어드민</h1>
                    <p className={styles.pageDesc}>스케줄 등록 및 관리</p>
                </div>
                <button className={styles.addBtn} onClick={openNew}>+ 새 일정 추가</button>
            </div>

            {/* 필터 */}
            <div className={styles.filterBar}>
                <button
                    className={`${styles.filterChip} ${filterCategory === 'all' ? styles.filterActive : ''}`}
                    onClick={() => setFilterCategory('all')}
                >
                    전체
                </button>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map(k => (
                    <button
                        key={k}
                        className={`${styles.filterChip} ${filterCategory === k ? styles.filterActive : ''}`}
                        style={filterCategory === k ? { backgroundColor: CATEGORY_COLORS[k], borderColor: CATEGORY_COLORS[k], color: 'white' } : {}}
                        onClick={() => setFilterCategory(k)}
                    >
                        {CATEGORY_LABELS[k]}
                    </button>
                ))}
            </div>

            {/* 일정 목록 */}
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <span>날짜</span>
                    <span>시간</span>
                    <span>제목</span>
                    <span>카테고리</span>
                    <span>반복</span>
                    <span>관리</span>
                </div>
                {sorted.length === 0 && (
                    <div className={styles.emptyRow}>등록된 일정이 없습니다.</div>
                )}
                {sorted.map(ev => (
                    <div key={ev.id} className={styles.tableRow}>
                        <span className={styles.dateCell}>{ev.date}</span>
                        <span className={styles.timeCell}>{ev.startTime} – {ev.endTime}</span>
                        <span className={styles.titleCell}>{ev.title}</span>
                        <span>
                            <span
                                className={styles.catBadge}
                                style={{ backgroundColor: `${CATEGORY_COLORS[ev.category]}20`, color: CATEGORY_COLORS[ev.category] }}
                            >
                                {CATEGORY_LABELS[ev.category]}
                            </span>
                        </span>
                        <span className={styles.recurCell}>{ev.isRecurring ? '🔁 반복' : '—'}</span>
                        <span className={styles.actions}>
                            <button className={styles.editBtn} onClick={() => openEdit(ev)}>수정</button>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(ev.id)}>삭제</button>
                        </span>
                    </div>
                ))}
            </div>

            {/* 폼 모달 */}
            {showForm && (
                <div className={styles.overlay} onClick={() => setShowForm(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingId ? '일정 수정' : '새 일정 추가'}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form className={styles.modalForm} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label>제목 *</label>
                                    <input name="title" value={form.title} onChange={handleChange} placeholder="예: 치유 농업 기초 교육" required />
                                </div>
                                <div className={styles.formField}>
                                    <label>카테고리 *</label>
                                    <select name="category" value={form.category} onChange={handleChange} required>
                                        {(Object.keys(CATEGORY_LABELS) as Category[]).map(k => (
                                            <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.slotsLabel}>
                                <label>일정 설정 * (날짜 및 시간)</label>
                                {!editingId && <button type="button" className={styles.addSlotBtn} onClick={addItem}>+ 일정 추가</button>}
                            </div>

                            <div className={styles.itemsList}>
                                {form.items.map((item, index) => (
                                    <div key={index} className={styles.itemRow}>
                                        <div className={styles.formField}>
                                            <input
                                                type="date"
                                                value={item.date}
                                                onChange={(e) => handleItemChange(index, 'date', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formField}>
                                            <input
                                                type="time"
                                                value={item.startTime}
                                                onChange={(e) => handleItemChange(index, 'startTime', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <span className={styles.slotSep}>–</span>
                                        <div className={styles.formField}>
                                            <input
                                                type="time"
                                                value={item.endTime}
                                                onChange={(e) => handleItemChange(index, 'endTime', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {!editingId && form.items.length > 1 && (
                                            <button type="button" className={styles.removeSlotBtn} onClick={() => removeItem(index)}>×</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.formField}>
                                <label>메모</label>
                                <textarea name="note" value={form.note} onChange={handleChange} placeholder="추가 내용 (선택)" />
                            </div>
                            <div className={styles.formCheckbox}>
                                <input type="checkbox" id="isRecurring" name="isRecurring" checked={form.isRecurring} onChange={handleChange} />
                                <label htmlFor="isRecurring">매주 반복 일정으로 설정</label>
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>취소</button>
                                <button type="submit" className={styles.saveBtn}>{editingId ? '수정 완료' : '등록하기'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
