/**
 * 다양한 형태의 데이터를 불리언(True/False)으로 변환하는 유틸리티
 */
export function parseIsRecurring(val: any): boolean {
    if (val === true || val === 'true' || val === 'TRUE') return true;
    if (val === 1 || val === '1') return true;
    return false;
}
