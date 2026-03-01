# BIX Payments 게시판

Next.js App Router 기반의 게시판 서비스입니다.

## 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Server State**: TanStack Query
- **Styling**: Tailwind CSS v4

## 주요 기능

- 회원가입 / 로그인 / 로그아웃
- 로그인한 사용자 정보 표시 (이름, 이메일)
- 게시글 목록 조회 (페이지네이션, 카테고리 필터)
- 게시글 등록 / 상세 조회 / 수정 / 삭제
- 이미지 첨부 및 라이트박스 뷰어
- 미인증 사용자 라우트 보호

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local`을 생성합니다.

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 빌드

```bash
npm run build
npm run start
```
