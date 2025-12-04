// components/StockList.tsx

'use client'; 

import React, { useState, useEffect } from 'react';
import { getPreviousDayDate } from '../../src/utils/date';
// import { StockItem } from '@/types/stock'; // 실제 타입 경로는 프로젝트에 맞게 수정하세요.

// 간단한 타입 정의 (임시)
interface StockItem {
    itmsNm: string; // 종목명
    srtnCd: string; // 단축코드
    clpr: string; // 종가
    fltRt: string; // 등락률
}


export default function StockList() {
    const [stockList, setStockList] = useState<StockItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const basDt = getPreviousDayDate(); 
    const displayBasDt = `${basDt.slice(0, 4)}년 ${basDt.slice(4, 6)}월 ${basDt.slice(6, 8)}일`;

    useEffect(() => {
        const fetchStockList = async () => {
            setLoading(true);
            setError(null);

            // 💡 중요: 내부 API Route 호출
            // 20231201 기준, 10개 종목을 가져오도록 요청
            const internalApiUrl = `/api/stock/list/?basDt=${basDt}&numOfRows=50`;

            try {
                const response = await fetch(internalApiUrl);
                const result = await response.json(); 

                if (!response.ok || !result.success) {
                    throw new Error(result.message || '데이터 호출에 실패했습니다.');
                }

                setStockList(result.data as StockItem[]); // 타입 캐스팅

            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류');
            } finally {
                setLoading(false);
            }
        };

        fetchStockList();
    }, []);

    // --- 렌더링 부분 ---
    if (loading) return <div className="p-4 text-blue-500">주식 목록을 불러오는 중입니다...</div>;
    if (error) return <div className="p-4 text-red-500">에러 발생: {error}</div>;
    if (!stockList || stockList.length === 0) return <div className="p-4 text-gray-500">조회된 종목 정보가 없습니다.</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">주식 목록  ({displayBasDt} 기준) </h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종목명</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">단축코드</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">종가</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">등락률</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {stockList.map((item) => (
                        <tr key={item.srtnCd}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itmsNm}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.srtnCd}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{Number(item.clpr).toLocaleString()}원</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold" style={{ color: Number(item.fltRt) > 0 ? 'red' : 'blue' }}>{item.fltRt}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="mt-4 text-sm text-gray-600">데이터는 공공데이터포털 API의 일별(전일 종가) 기준입니다.</p>
        </div>
    );
}