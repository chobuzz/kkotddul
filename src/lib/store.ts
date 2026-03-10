'use client';

import { ScheduleEvent, INITIAL_EVENTS } from './types';

const STORAGE_KEY = 'koteul_schedule';

export function getEvents(): ScheduleEvent[] {
    if (typeof window === 'undefined') return INITIAL_EVENTS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
            return INITIAL_EVENTS;
        }
        return JSON.parse(raw) as ScheduleEvent[];
    } catch {
        return INITIAL_EVENTS;
    }
}

export function saveEvents(events: ScheduleEvent[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(event: ScheduleEvent): ScheduleEvent[] {
    const events = getEvents();
    const updated = [...events, event];
    saveEvents(updated);
    return updated;
}

export function updateEvent(updated: ScheduleEvent): ScheduleEvent[] {
    const events = getEvents().map(e => e.id === updated.id ? updated : e);
    saveEvents(events);
    return events;
}

export function deleteEvent(id: string): ScheduleEvent[] {
    const events = getEvents().filter(e => e.id !== id);
    saveEvents(events);
    return events;
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
