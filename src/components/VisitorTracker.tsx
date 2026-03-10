"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { apiTrackVisit } from '@/lib/api';

export default function VisitorTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // 어드민 페이지 방문은 통계에서 제외하거나 별도 처리 가능
        // 여기서는 어드민을 제외하고 트래킹합니다.
        if (pathname.startsWith('/admin')) return;

        // 동일한 경로로의 연속적인 트래킹 방지 (StrictMode 등 대응)
        if (lastTrackedPath.current === pathname) return;

        const track = async () => {
            lastTrackedPath.current = pathname;
            try {
                // 약간의 지연을 두어 실제 체류 의사가 있는 경우만 카운트하거나 바로 호출
                await apiTrackVisit(pathname);
                console.log(`[Tracker] Visited: ${pathname}`);
            } catch (e) {
                // 에러 무시
            }
        };

        track();
    }, [pathname]);

    return null; // UI 없는 컴포넌트
}
