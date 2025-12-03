// app/api/stock/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { StockResponse, ApiResponse, StockItem } from '../../types/stock';

const BASE_URL = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo';

// GET 요청을 처리하는 함수
export async function GET(request: NextRequest): Promise<NextResponse<StockResponse>> {

  // 1. 환경 변수 및 파라미터 유효성 검사
    const serviceKey = process.env.STOCK_API_KEY;
    if (!serviceKey) {
    console.error("STOCK_API_KEY is not configured.");
    return NextResponse.json({ 
        success: false, 
        message: '서버 설정 오류: API 키가 누락되었습니다.',
        data: []
    }, { status: 500 });
}

  // URL에서 쿼리 파라미터를 추출
    const { searchParams } = new URL(request.url);
    const itmsNm = searchParams.get('itmsNm'); // 종목명 (필수 검색 조건으로 가정)
    const basDt = searchParams.get('basDt');   // 기준일자
    
    if (!itmsNm) {
        return NextResponse.json({ 
        success: false, 
        message: '필수 파라미터(itmsNm)가 누락되었습니다.',
        data: []
        }, { status: 400 });
    }

    // 2. 외부 API 요청 URL 구성
    const queryParams = new URLSearchParams({
        serviceKey: serviceKey,
        numOfRows: '10',
        pageNo: '1',
        resultType: 'json',
        // 요청 파라미터 추가
        itmsNm: itmsNm,
        ...(basDt && { basDt: basDt }), // basDt가 존재할 경우에만 추가
    });
 
    const apiUrl = `${BASE_URL}?${queryParams.toString()}`;

    try {
    // 3. 외부 API 호출 및 응답 처리
    const response = await fetch(apiUrl);

    if (!response.ok) {
        console.error(`External API HTTP Error: ${response.status}`);
        // 외부 API 통신 실패 시
        return NextResponse.json({
            success: false,
            message: `외부 API 호출 실패: ${response.status}`,
            data: []
        }, { status: response.status });
    }

    // JSON 응답을 **ApiResponse 타입으로 강제 변환**하여 타입 안정성 확보
    const data: ApiResponse = await response.json();
    
    // 4. API 응답 코드로 데이터 유효성 재확인
    const header = data.response.header;
    if (header.resultCode !== '00') {
        const msg = `공공데이터포털 오류: ${header.resultMsg} (${header.resultCode})`;
        console.error(msg);
        return NextResponse.json({
            success: false,
            message: msg,
            data: []
        }, { status: 500 });
    }

    // 5. 최종 데이터 추출 및 클라이언트에게 반환
    const body = data.response.body;
    // item이 단일 객체일 수도, 배열일 수도, 없을 수도 있기에 안전하게 처리
    const items: StockItem[] = Array.isArray(body.items.item) 
        ? body.items.item 
        : (body.items.item ? [body.items.item] : []);

        return NextResponse.json({
        success: true,
        message: '주식 시세 정보를 성공적으로 가져왔습니다.',
        data: items,
        meta: {
            totalCount: body.totalCount,
            pageNo: body.pageNo,
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