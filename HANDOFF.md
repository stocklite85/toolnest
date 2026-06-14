# ToolNest — AI Handoff Document

## 프로젝트 개요

무료 온라인 유틸리티 웹사이트. 수익화 목적(Google AdSense 예정).
한국어/영어 2개 언어 지원. 서버 비용 0원.

**GitHub:** https://github.com/stocklite85/toolnest
**배포 URL:** https://toolnest-inky.vercel.app
**배포 방식:** Vercel 무료 플랜 — `git push` 시 자동 재배포 (가끔 실패 시 `vercel --prod` 직접 실행)

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16.2.9 (App Router) |
| Runtime | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| 패키지 매니저 | npm 11.13.0 |
| Node.js | v24.16.0 |

---

## 완성된 파일 목록

```
toolnest/
├── app/
│   ├── globals.css                      ✅ 완성
│   ├── layout.tsx                       ✅ 완성 (루트 레이아웃, SEO 메타, Google/Naver 인증 태그)
│   ├── page.tsx                         ✅ 완성 (홈 — 툴 카드 3개)
│   ├── sitemap.ts                       ✅ 완성 (/sitemap.xml 자동 생성)
│   ├── robots.ts                        ✅ 완성 (/robots.txt 자동 생성)
│   ├── password-generator/
│   │   ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│   │   └── page.tsx                     ✅ 완성
│   ├── id-generator/
│   │   ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│   │   └── page.tsx                     ✅ 완성 (Spinxo 스타일)
│   ├── subnet-calculator/
│   │   ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│   │   └── page.tsx                     ✅ 완성
│   └── privacy/
│       ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│       └── page.tsx                     ✅ 완성 (개인정보 처리방침 전문, 한/영)
├── components/
│   ├── Header.tsx                       ✅ 완성 (네비 + 언어 토글 버튼)
│   ├── Footer.tsx                       ✅ 완성 (Privacy Policy 링크 포함)
│   ├── CopyButton.tsx                   ✅ 완성 (복사 후 2초 피드백)
│   └── PrivacyBadge.tsx                 ✅ 완성 (각 툴 페이지 상단 — 브라우저 처리 안내 배너)
├── contexts/
│   └── LangContext.tsx                  ✅ 완성 (브라우저 언어 자동 감지 + localStorage 저장)
├── lib/
│   ├── translations.ts                  ✅ 완성 (한/영 전체 번역 텍스트)
│   ├── password.ts                      ✅ 완성 (생성 로직 + 강도 측정)
│   ├── idGenerator.ts                   ✅ 완성 (스타일별 단어풀 + 길이 필터 + UUID)
│   └── subnet.ts                        ✅ 완성 (CIDR 파싱 + 전체 계산)
├── next.config.ts                       ✅ 기본값 유지 (standalone 넣지 말 것)
└── HANDOFF.md                           ← 이 파일
```

---

## 구현된 툴 상세

### 1. 비밀번호 생성기 (`/password-generator`)
- 길이 슬라이더 (4~64)
- 대문자 / 소문자 / 숫자 / 특수문자 체크박스 (최소 1개 강제)
- 개수 선택 (1 / 3 / 5 / 10)
- 강도 측정바 (weak / fair / good / strong)
- 각 비밀번호 개별 복사 + 전체 복사
- `crypto.getRandomValues()` 사용 (보안 난수)

### 2. 아이디 생성기 (`/id-generator`) — Spinxo 스타일
- **사용자 입력:** 이름/닉네임, 관심사/취미, 좋아하는 숫자
- **스타일:** Any / Cool / Cute / Funny / Tech
- **길이 필터:** 전체 / 짧게(≤8) / 보통(9~13) / 길게(14+)
  - Short 모드: 4자 이하 단어만 사용, 숫자 제외, 500개 후보 생성 후 필터
- **구분자 없음** (사용자 요청으로 제거)
- 30개 카드 그리드, 클릭하면 바로 복사
- UUID v4 탭 별도 제공
- `lib/idGenerator.ts`: `GenOptions { name, hobbies, numbers, style, shortOnly }` 인터페이스

### 3. 서브넷 계산기 (`/subnet-calculator`)
- 입력: `192.168.1.0/24` 형식 (CIDR 표기)
- 빠른 예시 버튼 4개, 엔터키로 계산 가능
- 출력: 네트워크 주소, 브로드캐스트, 서브넷/와일드카드 마스크, 첫/마지막 호스트, 전체/사용가능 호스트 수, IP 클래스, 사설IP 여부, 바이너리 마스크
- `/31`, `/32` 엣지 케이스 처리됨

---

## 언어 시스템

- `contexts/LangContext.tsx` 에서 `lang` 상태 (`'en' | 'ko'`) 관리
- **자동 감지 순서:** ① localStorage 저장값 → ② `navigator.language` (ko/ko-KR → 한국어) → ③ 기본값 한국어
- Header 국기 버튼으로 토글, 선택값은 `localStorage('toolnest-lang')`에 저장 (새로고침 유지)
- 번역 텍스트: `lib/translations.ts`의 `t(lang, 'key.subkey')` 함수로 호출

---

## SEO / 검색엔진 등록 현황

| 항목 | 상태 |
|------|------|
| sitemap.xml | ✅ `/app/sitemap.ts` 로 자동 생성 |
| robots.txt | ✅ `/app/robots.ts` 로 자동 생성 |
| Google Search Console | ✅ 소유권 인증 완료, 사이트맵 제출 완료 (색인 반영 대기 중) |
| 네이버 서치어드바이저 | ✅ 소유권 인증 완료, 사이트맵 제출 완료 (색인 반영 대기 중) |
| Google 인증 키 | `gFJC8pKAliNeLONrdUMXGG5PsKABSFIcGr6DLkmz6KY` |
| 네이버 인증 키 | `959ce7ee9fb420f2d0bc22eb3b69c56c44a4eaf9` |

---

## 다음 AI가 할 일

### 수익화 (가장 우선)
- [ ] **Google AdSense 신청** — 트래픽 어느 정도 쌓인 후 신청 유리
- [ ] 광고 컴포넌트 (`components/AdSlot.tsx`) 작성
- [ ] `next/script`로 AdSense 스크립트 로드 (`app/layout.tsx`에 추가)

### 기능 추가 (선택)
- [ ] 모바일 하단 네비게이션 메뉴
- [ ] 툴 추가: Base64 인코더, JSON 포매터, URL 인코더 등
- [ ] OG Image 설정 (`app/opengraph-image.tsx`)

---

## 주의사항

- Tailwind v4 — `tailwind.config.ts` 없음, `@import "tailwindcss"` 방식
- 모든 페이지 `'use client'` — `crypto.getRandomValues()` 는 브라우저 전용
- `next.config.ts` 에 `output: 'standalone'` 넣지 말 것 (Vercel과 충돌)
- 로컬 dev 서버 실행 금지 (사용자 요청) — git push 후 Vercel에서 확인
- **Vercel 자동배포가 가끔 미작동** → `vercel --prod` 명령어로 직접 배포 (Vercel CLI 설치됨)

---

## 코드 수정 후 배포 명령어

```powershell
cd d:\code\1_pro\toolnest
git add .
git commit -m "feat: 변경 내용"
git push
# 자동배포 안 될 경우:
vercel --prod
```
