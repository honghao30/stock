// src/components/StockFetcher.tsx

'use client'; 
// App Router에서 클라이언트 컴포넌트임을 명시

import React, { useState, useEffect } from 'react';
import { StockItem, StockResponse } from '../type/stock'; // 정의한 타입을 불러옵니다.

interface StockFetcherProps {
    initialStockName: string;
}

export default function StockFetcher({ initialStockName }: StockFetcherProps) {
    const [stockData, setStockData] = useState<StockItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchStock = async (stockName: string) => {
        setLoading(true);
        setError(null);

        // 예시: 최근 거래일 데이터가 아닐 수 있으므로 임의의 날짜 '20231201'로 설정
        const apiUrl = `/api/stock?itmsNm=${stockName}&basDt=20231201`;

        try {
            const response = await fetch(apiUrl);
            // 응답 객체를 StockResponse 타입으로 정의하여 타입 추론에 도움을 줍니다.
            const result: StockResponse = await response.json(); 

            if (!response.ok || !result.success) {
            throw new Error(result.message || '데이터 호출에 실패했습니다.');
            }

            setStockData(result.data);

        } catch (err) {
            // 에러 객체가 Error 타입임을 보장
            setError(err instanceof Error ? err.message : '알 수 없는 오류');
        } finally {
            setLoading(false);
        }
    };

    fetchStock(initialStockName);
}, [initialStockName]);

    if (loading) return <div>주식 정보를 불러오는 중입니다...</div>;
    if (error) return <div style={{ color: 'red' }}>에러 발생: {error}</div>;
    if (!stockData || stockData.length === 0) return <div>검색된 종목 정보가 없습니다.</div>;

  // 성공적으로 데이터를 받아왔을 때, 첫 번째 항목을 표시
    const item = stockData[0];

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd' }}>
        <h2>✅ {item.itmsNm} ({item.srtnCd})</h2>
        <p>기준일자: **{item.basDt}**</p>
        <p>종가: **{Number(item.clpr).toLocaleString()}원**</p>
        <p>등락률: <span style={{ color: Number(item.fltRt) > 0 ? 'red' : 'blue' }}>{item.fltRt}%</span></p>
        <p>시가총액: {Number(item.mrktTotAmt).toLocaleString()}원</p>
        </div>
    );
}