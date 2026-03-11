"use client";

import { useState, useEffect } from 'react';
import { ScheduleEvent, CATEGORY_COLORS, CATEGORY_LABELS, INITIAL_EVENTS } from '@/lib/types';
import { fetchEvents } from '@/lib/api';
import { parseIsRecurring } from '@/lib/utils';
import styles from './scheduler.module.css';

// 오늘 날짜 문자열 반환 (YYYY-MM-DD, 한국 시간 기준)
function toDateStr(d: Date) {
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(d);
}

// 이번 주의 월~일 날짜 배열 반환
function getWeekDates(baseDate: Date): Date[] {
    // KST 기준으로 해당 날짜의 요일을 가져옴
    const formatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', weekday: 'narrow' });
    const dayName = formatter.format(baseDate);
    const dayMap: Record<string, number> = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
    const day = dayMap[dayName];
    const monday = new Date(baseDate);
    const diffToMon = (day === 0 ? -6 : 1 - day);
    monday.setDate(baseDate.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

// 특정 날짜의 KST 기준 요일(0~6) 반환
function getKSTDayFromDate(d: Date): number {
    const formatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', weekday: 'narrow' });
    const dayName = formatter.format(d);
    const dayMap: Record<string, number> = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
    return dayMap[dayName];
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function Scheduler() {
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const [baseDate, setBaseDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    const today = toDateStr(new Date());
    const weekDates = getWeekDates(baseDate);

    useEffect(() => {
        // 모바일이면 기본 리스트 뷰
        if (window.innerWidth < 768) setView('list');

        setIsLoading(true);
        fetchEvents()
            .then(data => {
                setEvents(data);
            })
            .catch(() => {
                setEvents(INITIAL_EVENTS);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    function getEventsForDate(d: Date) {
        const ds = toDateStr(d);
        const kstDay = getKSTDayFromDate(d);

        return events.filter(e => {
            const isRecur = parseIsRecurring(e.isRecurring);

            // 1. 정확히 날짜가 일치하는 경우
            if (e.date === ds) return true;

            // 2. 반복 일정인 경우
            if (isRecur) {
                // 시작일(e.date) 이후이면서 요일이 일치하는 경우
                let eventRecurDay = e.recurrenceDay;
                
                // recurrenceDay가 없는 경우 시작 날짜 문자열로부터 KST 요일 추출
                if (!eventRecurDay && eventRecurDay !== 0) {
                    const [y, m, day] = e.date.split('-').map(Number);
                    const startDate = new Date(Date.UTC(y, m - 1, day, 0, 0, 0));
                    eventRecurDay = getKSTDayFromDate(startDate);
                } else {
                    eventRecurDay = Number(eventRecurDay);
                }
                
                return e.date <= ds && kstDay === eventRecurDay;
            }

            return false;
        }).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    // 이번 주 모든 이벤트 (리스트 뷰용)
    const weekEvents = weekDates
        .flatMap(d => getEventsForDate(d).map(e => ({ ...e, _date: d })))
        .sort((a, b) => toDateStr(a._date).localeCompare(toDateStr(b._date)) || a.startTime.localeCompare(b.startTime));

    const currentMonth = `${baseDate.getFullYear()}년 ${baseDate.getMonth() + 1}월`;

    function prevWeek() {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - 7);
        setBaseDate(d);
    }

    function nextWeek() {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + 7);
        setBaseDate(d);
    }

    return (
        <div className={styles.wrapper}>
            {/* 헤더 */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.title}>운영 일정 현황</h2>
                    <span className={styles.monthLabel}>{currentMonth}</span>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.navBtn} onClick={prevWeek}>‹</button>
                    <button className={styles.todayBtn} onClick={() => setBaseDate(new Date())}>오늘</button>
                    <button className={styles.navBtn} onClick={nextWeek}>›</button>
                    <div className={styles.toggle}>
                        <button className={view === 'calendar' ? styles.active : ''} onClick={() => setView('calendar')}>달력</button>
                        <button className={view === 'list' ? styles.active : ''} onClick={() => setView('list')}>리스트</button>
                    </div>
                </div>
            </div>

            {/* 달력 뷰 */}
            {view === 'calendar' && (
                <div className={styles.calendarContainer}>
                    {weekDates.map((d, i) => {
                        const ds = toDateStr(d);
                        const isToday = ds === today;
                        const dayEvents = getEventsForDate(d);
                        return (
                            <div key={i} className={`${styles.dayCol} ${isToday ? styles.todayCol : ''}`}>
                                <div className={styles.dayHeader}>
                                    <span className={styles.dayName} style={{ color: i >= 5 ? '#E05555' : undefined }}>{DAY_LABELS[i]}</span>
                                    <span className={`${styles.dayNum} ${isToday ? styles.todayNum : ''}`}>{d.getDate()}</span>
                                    {isToday && <span className={styles.todayDot} />}
                                </div>
                                <div className={styles.eventList}>
                                    {dayEvents.map(ev => (
                                        <div
                                            key={ev.id}
                                            className={styles.eventChip}
                                            style={{ borderLeft: `3px solid ${CATEGORY_COLORS[ev.category]}`, background: `${CATEGORY_COLORS[ev.category]}12` }}
                                        >
                                            <span className={styles.chipTime}>{ev.startTime} – {ev.endTime}</span>
                                            <p className={styles.chipTitle}>{ev.title}</p>
                                        </div>
                                    ))}
                                    {dayEvents.length === 0 && <p className={styles.noEvent}>일정 없음</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 리스트 뷰 */}
            {view === 'list' && (
                <div className={styles.listView}>
                    {weekEvents.length === 0 && <p className={styles.emptyMsg}>이번 주 등록된 일정이 없습니다.</p>}
                    {weekEvents.map(ev => {
                        const evDateStr = toDateStr(ev._date);
                        const isToday = evDateStr === today;
                        return (
                            <div key={`${ev.id}-${evDateStr}`} className={`${styles.listItem} ${isToday ? styles.listItemToday : ''}`}>
                                <div className={styles.listLeft}>
                                    <span className={styles.listDayLabel}>{isToday ? '오늘' : DAY_LABELS[getKSTDayFromDate(ev._date) === 0 ? 6 : getKSTDayFromDate(ev._date) - 1]}</span>
                                    <span className={styles.listDayNum}>{ev._date.getDate()}</span>
                                </div>
                                <div className={styles.listBar} style={{ backgroundColor: CATEGORY_COLORS[ev.category] }} />
                                <div className={styles.listInfo}>
                                    <span className={styles.listCategory} style={{ color: CATEGORY_COLORS[ev.category] }}>
                                        {CATEGORY_LABELS[ev.category]}
                                    </span>
                                    <p className={styles.listTitle}>{ev.title}</p>
                                    <p className={styles.listTime}>{ev.startTime} – {ev.endTime}{ev.isRecurring ? ' · 매주 반복' : ''}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 범례 */}
            <div className={styles.legend}>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <div key={key} className={styles.legendItem}>
                        <span className={styles.dot} style={{ backgroundColor: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] }} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
