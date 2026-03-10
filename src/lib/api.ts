/**
 * Google Apps Script Web App과 통신하는 API 레이어 (GET 전용 - CORS 안전)
 * NEXT_PUBLIC_APPS_SCRIPT_URL 환경 변수에 Apps Script 웹 앱 URL을 설정해야 합니다.
 */
import { ScheduleEvent } from './types';

const SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

function isConfigured(): boolean {
    return SCRIPT_URL.startsWith('https://');
}

/** GET 요청 헬퍼 - 쿼리 파라미터 방식 */
async function apiFetch(params: Record<string, string>): Promise<{ success: boolean; data?: ScheduleEvent[]; error?: string }> {
    const url = new URL(SCRIPT_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { cache: 'no-store' });
    return res.json();
}

/**
 * 전체 일정 조회 (GET ?action=get)
 */
export async function fetchEvents(): Promise<ScheduleEvent[]> {
    if (!isConfigured()) {
        console.warn('[API] NEXT_PUBLIC_APPS_SCRIPT_URL 미설정. 빈 배열 반환.');
        return [];
    }
    try {
        const json = await apiFetch({ action: 'get' });
        if (!json.success) throw new Error(json.error);
        return (json.data ?? []) as ScheduleEvent[];
    } catch (e) {
        console.error('[API] fetchEvents 실패:', e);
        return [];
    }
}

/**
 * 일정 추가 (GET ?action=add&data=JSON)
 */
export async function apiAddEvent(event: ScheduleEvent): Promise<boolean> {
    if (!isConfigured()) return false;
    try {
        const json = await apiFetch({ action: 'add', data: JSON.stringify(event) });
        return json.success === true;
    } catch (e) {
        console.error('[API] apiAddEvent 실패:', e);
        return false;
    }
}

/**
 * 일정 수정 (GET ?action=update&data=JSON)
 */
export async function apiUpdateEvent(event: ScheduleEvent): Promise<boolean> {
    if (!isConfigured()) return false;
    try {
        const json = await apiFetch({ action: 'update', data: JSON.stringify(event) });
        return json.success === true;
    } catch (e) {
        console.error('[API] apiUpdateEvent 실패:', e);
        return false;
    }
}

/**
 * 일정 삭제 (GET ?action=delete&id=ID)
 */
export async function apiDeleteEvent(id: string): Promise<boolean> {
    if (!isConfigured()) return false;
    try {
        const json = await apiFetch({ action: 'delete', id });
        return json.success === true;
    } catch (e) {
        console.error('[API] apiDeleteEvent 실패:', e);
        return false;
    }
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * 폼 상담 신청 (GET ?action=submit&data=JSON)
 */
export async function apiSubmitForm(form: import('./types').ContactFormPayload): Promise<boolean> {
    if (!isConfigured()) return false;
    try {
        const json = await apiFetch({ action: 'submit', data: JSON.stringify(form) });
        return json.success === true;
    } catch (e) {
        console.error('[API] apiSubmitForm 실패:', e);
        return false;
    }
}

/**
 * 상담 내역 조회 (GET ?action=getSubmissions)
 */
export async function fetchSubmissions(): Promise<import('./types').ContactFormPayload[]> {
    if (!isConfigured()) return [];
    try {
        const json = await apiFetch({ action: 'getSubmissions' });
        if (!json.success) throw new Error(json.error);
        return (json.data ?? []) as unknown as import('./types').ContactFormPayload[];
    } catch (e) {
        console.error('[API] fetchSubmissions 실패:', e);
        return [];
    }
}
/**
 * 방문 기록 (GET ?action=trackVisit&path=PATH)
 */
export async function apiTrackVisit(path: string): Promise<boolean> {
    if (!isConfigured()) return false;
    try {
        // 내부 호출용이므로 실패해도 사용자에게 알림은 주지 않음
        apiFetch({ action: 'trackVisit', path });
        return true;
    } catch (e) {
        return false;
    }
}
