export type Category = 'healing' | 'oneday' | 'horticulture' | 'rental' | 'social';

export interface ScheduleEvent {
    id: string;
    title: string;
    category: Category;
    date: string;      // 'YYYY-MM-DD'
    startTime: string; // 'HH:MM'
    endTime: string;   // 'HH:MM'
    note?: string;
    isRecurring: boolean;
    recurrenceDay?: number; // 0=Sun, 1=Mon ... 6=Sat (반복 일정용)
}

export const CATEGORY_COLORS: Record<Category, string> = {
    healing: '#8EBC8E',
    oneday: '#CD853F',
    horticulture: '#9ACD32',
    rental: '#F4A460',
    social: '#6B8E23',
};

export const CATEGORY_LABELS: Record<Category, string> = {
    healing: '치유 농업',
    oneday: '원데이 클래스',
    horticulture: '원예 힐링',
    rental: '공간 대여',
    social: '사회적 농업',
};

// 예시 초기 데이터 (localStorage가 비어있을 때 사용)
export const INITIAL_EVENTS: ScheduleEvent[] = [
    {
        id: '1',
        title: '치유 농업 기초 교육',
        category: 'healing',
        date: '2026-03-09',
        startTime: '10:00',
        endTime: '12:00',
        isRecurring: true,
        recurrenceDay: 1,
    },
    {
        id: '2',
        title: '천연 비누 만들기 클래스',
        category: 'oneday',
        date: '2026-03-10',
        startTime: '14:00',
        endTime: '16:00',
        isRecurring: false,
    },
    {
        id: '3',
        title: '반려 식물 원예 테라피',
        category: 'horticulture',
        date: '2026-03-11',
        startTime: '10:00',
        endTime: '12:00',
        isRecurring: true,
        recurrenceDay: 3,
    },
    {
        id: '4',
        title: '프라이빗 가든 BBQ',
        category: 'rental',
        date: '2026-03-14',
        startTime: '17:00',
        endTime: '20:00',
        isRecurring: false,
    },
    {
        id: '5',
        title: '지역 공동체 농업 활동',
        category: 'social',
        date: '2026-03-13',
        startTime: '09:00',
        endTime: '11:00',
        isRecurring: true,
        recurrenceDay: 5,
    },
];
