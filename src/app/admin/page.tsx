"use client";

import { useState, useEffect, useCallback } from 'react';
import {
    ScheduleEvent,
    CATEGORY_COLORS,
    CATEGORY_LABELS,
    Category,
    ContactFormPayload,
} from '@/lib/types';
import { fetchEvents, apiAddEvent, apiUpdateEvent, apiDeleteEvent, generateId, fetchSubmissions } from '@/lib/api';
import styles from './admin.module.css';

// ─── 비밀번호 상수 ───────────────────────────────────────────
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
const SESSION_KEY = 'koteul_admin_auth';

// ─── 비밀번호 잠금 화면 ──────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (input === ADMIN_PASSWORD) {
            sessionStorage.setItem(SESSION_KEY, '1');
            onAuth();
        } else {
            setError(true);
            setInput('');
        }
    }

    return (
        <div className={styles.gatePage}>
            <div className={styles.gateCard}>
                <div className={styles.gateLogo}>🌿</div>
                <h1 className={styles.gateTitle}>꽃뜰 어드민</h1>
                <p className={styles.gateDesc}>관리자 전용 페이지입니다</p>
                <form onSubmit={handleSubmit} className={styles.gateForm}>
                    <input
                        type="password"
                        className={`${styles.gateInput} ${error ? styles.gateInputError : ''}`}
                        placeholder="비밀번호를 입력하세요"
                        value={input}
                        onChange={e => { setInput(e.target.value); setError(false); }}
                        autoFocus
                    />
                    {error && <p className={styles.gateError}>비밀번호가 올바르지 않습니다.</p>}
                    <button type="submit" className={styles.gateBtn}>입장하기</button>
                </form>
            </div>
        </div>
    );
}

// ─── 폼 타입 ────────────────────────────────────────────────
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

// ─── KST 요일 계산 ──────────────────────────────────────────
function getKSTDay(dateStr: string): number | undefined {
    if (!dateStr) return undefined;
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).getDay();
}

// ─── 메인 어드민 페이지 ──────────────────────────────────────
export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    // 세션 확인
    useEffect(() => {
        setAuthed(sessionStorage.getItem(SESSION_KEY) === '1');
        setLoading(false);
    }, []);

    if (loading) return null; // 깜빡임 방지
    if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
    return <AdminDashboard />;
}

// ─── 어드민 대시보드 (인증 후) ───────────────────────────────
function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'schedules' | 'submissions'>('schedules');
    // 스케줄 상태
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
    // 상담 내역 상태
    const [submissions, setSubmissions] = useState<ContactFormPayload[]>([]);
    const [apiLoading, setApiLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    const loadData = useCallback(async () => {
        setApiLoading(true);
        try {
            if (activeTab === 'schedules') {
                const data = await fetchEvents();
                setEvents(data);
            } else {
                const data = await fetchSubmissions();
                setSubmissions(data);
            }
        } finally {
            setApiLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { loadData(); }, [loadData]);

    function notify(msg: string) {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    }

    function openNew() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(true);
    }

    function openEdit(ev: ScheduleEvent) {
        setForm({
            title: ev.title,
            category: ev.category,
            items: [{ date: ev.date, startTime: ev.startTime, endTime: ev.endTime }],
            note: ev.note || '',
            isRecurring: ev.isRecurring,
        });
        setEditingId(ev.id);
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
        setForm(prev => ({ ...prev, items: [...prev.items, { date: '', startTime: '09:00', endTime: '10:00' }] }));
    }

    function removeItem(index: number) {
        if (form.items.length <= 1) return;
        setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setApiLoading(true);

        const baseEvent = {
            title: form.title,
            category: form.category,
            note: form.note,
            isRecurring: form.isRecurring,
        };

        if (editingId) {
            const item = form.items[0];
            const updated: ScheduleEvent = {
                id: editingId,
                ...baseEvent,
                date: item.date,
                startTime: item.startTime,
                endTime: item.endTime,
                recurrenceDay: form.isRecurring ? getKSTDay(item.date) : undefined,
            };
            const ok = await apiUpdateEvent(updated);
            if (ok) {
                setEvents(prev => prev.map(ev => ev.id === editingId ? updated : ev));
                notify('✅ 일정이 수정되었습니다.');
            } else {
                notify('❌ 수정 실패. 다시 시도해 주세요.');
            }
        } else {
            const newItems = form.items.filter(item => item.date);
            const results = await Promise.all(newItems.map(item => {
                const ev: ScheduleEvent = {
                    id: generateId(),
                    ...baseEvent,
                    date: item.date,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    recurrenceDay: form.isRecurring ? getKSTDay(item.date) : undefined,
                };
                return apiAddEvent(ev).then(ok => ok ? ev : null);
            }));
            const added = results.filter(Boolean) as ScheduleEvent[];
            setEvents(prev => [...prev, ...added]);
            notify(`✅ ${added.length}개 일정이 등록되었습니다.`);
        }

        setApiLoading(false);
        setShowForm(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('이 일정을 삭제하시겠습니까?')) return;
        setApiLoading(true);
        const ok = await apiDeleteEvent(id);
        if (ok) {
            setEvents(prev => prev.filter(ev => ev.id !== id));
            notify('🗑️ 일정이 삭제되었습니다.');
        } else {
            notify('❌ 삭제 실패. 다시 시도해 주세요.');
        }
        setApiLoading(false);
    }

    const filtered = filterCategory === 'all' ? events : events.filter(e => e.category === filterCategory);
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

    return (
        <div className={styles.page}>
            {/* 어드민 헤더 */}
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.pageTitle}>꽃뜰 어드민</h1>
                    <p className={styles.pageDesc}>스케줄 등록 및 상담 문의 내역 관리</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {apiLoading && <span className={styles.loadingBadge}>처리 중…</span>}
                    {statusMsg && <span className={styles.statusMsg}>{statusMsg}</span>}
                    {activeTab === 'schedules' && (
                        <button className={styles.addBtn} onClick={openNew} disabled={apiLoading}>+ 새 일정 추가</button>
                    )}
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className={styles.tabsMenu}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'schedules' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('schedules')}
                >스케줄 관리</button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'submissions' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('submissions')}
                >상담 신청 내역 <span className={styles.badgeCount}>{submissions.length || ''}</span></button>
            </div>

            {activeTab === 'schedules' ? (
                <>
                    {/* 필터 */}
                    <div className={styles.filterBar}>
                        <button
                            className={`${styles.filterChip} ${filterCategory === 'all' ? styles.filterActive : ''}`}
                            onClick={() => setFilterCategory('all')}
                        >전체</button>
                        {(Object.keys(CATEGORY_LABELS) as Category[]).map(k => (
                            <button
                                key={k}
                                className={`${styles.filterChip} ${filterCategory === k ? styles.filterActive : ''}`}
                                style={filterCategory === k ? { backgroundColor: CATEGORY_COLORS[k], borderColor: CATEGORY_COLORS[k], color: 'white' } : {}}
                                onClick={() => setFilterCategory(k)}
                            >{CATEGORY_LABELS[k]}</button>
                        ))}
                    </div>

                    {/* 일정 목록 */}
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>날짜</span><span>시간</span><span>제목</span>
                            <span>카테고리</span><span>반복</span><span>관리</span>
                        </div>
                        {sorted.length === 0 && (
                            <div className={styles.emptyRow}>
                                {apiLoading ? '일정을 불러오는 중…' : '등록된 일정이 없습니다.'}
                            </div>
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
                                    >{CATEGORY_LABELS[ev.category] || ev.category}</span>
                                </span>
                                <span className={styles.recurCell}>{ev.isRecurring ? '🔁 반복' : '—'}</span>
                                <span className={styles.actions}>
                                    <button className={styles.editBtn} onClick={() => openEdit(ev)} disabled={apiLoading}>수정</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(ev.id)} disabled={apiLoading}>삭제</button>
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* 상담 내역 목록 */}
                    <div className={styles.table}>
                        <div className={styles.subHeader}>
                            <span>접수일시</span><span>신청자</span><span>연락처/메일</span>
                            <span>카테고리</span><span>인원/희망일정</span>
                        </div>
                        {submissions.length === 0 && (
                            <div className={styles.emptyRow}>
                                {apiLoading ? '상담 내역을 불러오는 중…' : '접수된 상담 신청 내역이 없습니다.'}
                            </div>
                        )}
                        {submissions.map(sub => (
                            <div key={sub.id} className={styles.subRow}>
                                <span className={styles.dateCell}>{sub.submittedAt || '기록없음'}</span>
                                <span className={styles.titleCell}>{sub.name}</span>
                                <div className={styles.contactCell}>
                                    <div>{sub.phone}</div>
                                    <div className={styles.emailText}>{sub.email || '-'}</div>
                                </div>
                                <span>
                                    <span className={styles.catBadge} style={{ backgroundColor: '#F0F0F0', color: '#555' }}>
                                        {sub.category}
                                    </span>
                                </span>
                                <div className={styles.infoCell}>
                                    <div>{sub.participants}명</div>
                                    <div className={styles.wantedDate}>{sub.date} {sub.time || ''}</div>
                                </div>
                                {sub.note && (
                                    <div className={styles.noteRow}>
                                        <strong>문의사항:</strong> {sub.note}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

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
                                            <input type="date" value={item.date} onChange={e => handleItemChange(index, 'date', e.target.value)} required />
                                        </div>
                                        <div className={styles.formField}>
                                            <input type="time" value={item.startTime} onChange={e => handleItemChange(index, 'startTime', e.target.value)} required />
                                        </div>
                                        <span className={styles.slotSep}>–</span>
                                        <div className={styles.formField}>
                                            <input type="time" value={item.endTime} onChange={e => handleItemChange(index, 'endTime', e.target.value)} required />
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
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)} disabled={apiLoading}>취소</button>
                                <button type="submit" className={styles.saveBtn} disabled={apiLoading}>
                                    {apiLoading ? '처리 중…' : (editingId ? '수정 완료' : '등록하기')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
