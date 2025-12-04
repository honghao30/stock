// src/utils/date.ts

/**
 * 오늘 날짜를 기준으로 하루 전 날짜를 'YYYYMMDD' 형식의 문자열로 계산합니다.
 * @param todayDate 오늘 날짜 (YYYYMMDD 형식 문자열, 선택 사항). 기본값은 실행 시점의 오늘 날짜입니다.
 * @returns 하루 전 날짜 (YYYYMMDD 형식 문자열)
 */
export function getPreviousDayDate(todayDate?: string): string {
    let date: Date;

    if (todayDate) {
        // YYYYMMDD 파싱 및 Date 객체 생성 (UTC 시간 오류 방지)
        const year = todayDate.substring(0, 4);
        const month = todayDate.substring(4, 6);
        const day = todayDate.substring(6, 8);
        date = new Date(`${year}-${month}-${day}T00:00:00`);
    } else {
        // 입력이 없으면 현재 시점의 날짜 사용
        date = new Date();
    }

    // 현재 날짜에서 하루(24시간)를 뺌
    date.setDate(date.getDate() - 1);

    // YYYYMMDD 형식으로 포맷
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}