// app/api/stocks/list/route.ts
// 목적: 기준일자별 전체 종목 목록 (페이지네이션 포함) 조회

import { NextRequest, NextResponse } from 'next/server';
// 💡 중요: 'types/stock' 경로는 실제 프로젝트 구조에 맞게 수정하세요.
import { StockResponse, ApiResponse, StockItem } from '../../types/stock';

const BASE_URL = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';

export async function GET(request: NextRequest): Promise<NextResponse<StockResponse>> {
    const serviceKey = process.env.STOCK_API_KEY;
    if (!serviceKey) {
        return NextResponse.json({ 
            success: false, 
            message: '서버 설정 오류: API 키가 누락되었습니다.',
            data: []
        }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    
    // 1. 쿼리 파라미터 추출 및 기본값 설정
    const basDt = searchParams.get('basDt') || '20231201'; // 기준일자 (필수 아닐 경우 기본값 설정)
    const numOfRows = searchParams.get('numOfRows') || '100'; // 한 페이지 결과 수
    const pageNo = searchParams.get('pageNo') || '1'; // 페이지 번호
    
    // 2. 외부 API 요청 URL 구성
    const queryParams = new URLSearchParams({
        serviceKey: serviceKey,
        basDt: basDt,
        numOfRows: numOfRows,
        pageNo: pageNo,
        resultType: 'json',
    });

    const apiUrl = `${BASE_URL}?${queryParams.toString()}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`External API HTTP Error: ${response.status}`);
            return NextResponse.json({ success: false, message: `외부 API 호출 실패: ${response.status}`, data: [] }, { status: response.status });
        }

        const data: ApiResponse = await response.json();
        
        const header = data.response.header;
        if (header.resultCode !== '00') {
            const msg = `공공데이터포털 오류: ${header.resultMsg} (${header.resultCode})`;
            console.error(msg);
            return NextResponse.json({ success: false, message: msg, data: [] }, { status: 500 });
        }

        const body = data.response.body;
        const items: StockItem[] = Array.isArray(body.items.item) 
            ? body.items.item 
            : (body.items.item ? [body.items.item] : []);

        return NextResponse.json({
            success: true,
            message: '주식 시세 목록을 성공적으로 가져왔습니다.',
            data: items,
            meta: {
                totalCount: body.totalCount,
                pageNo: body.pageNo,
                numOfRows: body.numOfRows,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('API Call Unexpected Error:', error);
        return NextResponse.json({ 
            success: false, 
            message: '예기치 않은 서버 오류가 발생했습니다.',
            data: []
        }, { status: 500 });
    }
}