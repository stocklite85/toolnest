# ToolNest — AI Handoff Document

## 프로젝트 개요

무료 온라인 유틸리티 웹사이트. 수익화 목적(Google AdSense 예정).
한국어/영어 2개 언어 지원. 서버 비용 0원 목표.

**배포 목표:** Vercel 무료 플랜 (`toolnest.vercel.app`)
**GitHub:** 아직 push 안 됨 — 로컬에만 존재

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
| 배포 | Vercel (미배포 상태) |

---

## 완성된 파일 목록

```
toolnest/
├── app/
│   ├── globals.css                      ✅ 완성
│   ├── layout.tsx                       ✅ 완성 (루트 레이아웃, SEO 메타)
│   ├── page.tsx                         ✅ 완성 (홈 — 툴 카드 3개)
│   ├── password-generator/
│   │   ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│   │   └── page.tsx                     ✅ 완성
│   ├── id-generator/
│   │   ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│   │   └── page.tsx                     ✅ 완성
│   └── subnet-calculator/
│       ├── layout.tsx                   ✅ 완성 (SEO 메타데이터)
│       └── page.tsx                     ✅ 완성
├── components/
│   ├── Header.tsx                       ✅ 완성 (네비 + 언어 토글 버튼)
│   ├── Footer.tsx                       ✅ 완성
│   └── CopyButton.tsx                   ✅ 완성 (복사 후 2초 피드백)
├── contexts/
│   └── LangContext.tsx                  ✅ 완성 (en/ko 전환 Context)
├── lib/
│   ├── translations.ts                  ✅ 완성 (한/영 전체 번역 텍스트)
│   ├── password.ts                      ✅ 완성 (생성 로직 + 강도 측정)
│   ├── idGenerator.ts                   ✅ 완성 (wordcombo/alphanumeric/uuid)
│   └── subnet.ts                        ✅ 완성 (CIDR 파싱 + 전체 계산)
├── next.config.ts                       ✅ 기본값 유지
├── package.json                         ✅ 스캐폴드 그대로
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
- 각 선택 타입에서 최소 1자 보장 후 셔플

### 2. 아이디 생성기 (`/id-generator`)
- 타입: Word Combo (형용사+명사) / Alphanumeric / UUID v4
- 구분자: `-` / `_` / `.`
- 숫자 포함 토글 (UUID 타입에선 비활성화)
- 개수 선택 (1 / 3 / 5 / 10)
- 각 항목 개별 복사 + 전체 복사
- UUID: RFC 4122 v4 스펙 준수

### 3. 서브넷 계산기 (`/subnet-calculator`)
- 입력: `192.168.1.0/24` 형식 (CIDR 표기)
- 빠른 예시 버튼 4개
- 엔터키로 계산 가능
- 출력 항목: 네트워크 주소, 브로드캐스트, 서브넷 마스크, 와일드카드 마스크, 첫/마지막 호스트, 전체/사용가능 호스트 수, IP 클래스, 사설IP 여부, 바이너리 마스크
- 각 값 복사 버튼 (단순 텍스트 값에만 표시)
- `/31`, `/32` 엣지 케이스 처리됨

---

## 언어 시스템

`contexts/LangContext.tsx`에서 `lang` 상태 (`'en' | 'ko'`) 관리.
`lib/translations.ts`의 `t(lang, 'key.subkey')` 함수로 모든 텍스트 출력.
Header의 국기 버튼으로 토글. 페이지 이동해도 언어 유지됨 (Context 유지되는 동안).

---

## 아직 안 된 것 (다음 AI가 할 일)

### 즉시 필요
- [ ] **GitHub push** — `git init` → `git add .` → `git commit` → GitHub 새 저장소 연결 → push
- [ ] **Vercel 배포** — vercel.com에서 GitHub 저장소 import

### 수익화 (배포 후)
- [ ] **Google AdSense 신청** — 툴 페이지 상단/하단에 광고 슬롯 추가
- [ ] 광고 컴포넌트 (`components/AdSlot.tsx`) 작성
- [ ] `next/script`로 AdSense 스크립트 로드 (`app/layout.tsx`에 추가)

### 기능 추가 (선택)
- [ ] 언어 설정 `localStorage` 저장 (새로고침해도 유지)
- [ ] 모바일 하단 네비게이션 메뉴
- [ ] 툴 추가: Base64 인코더, JSON 포매터, URL 인코더 등
- [ ] OG Image 설정 (`app/opengraph-image.tsx`)

---

## 주의사항

- Tailwind v4 사용 중 → `tailwind.config.ts` 파일 없음, `@import "tailwindcss"` 방식
- 모든 인터랙티브 페이지는 `'use client'` 선언됨
- `crypto.getRandomValues()` 는 브라우저 API — 서버 컴포넌트에서 호출 불가
- `output: 'standalone'` 은 Vercel에 불필요 — `next.config.ts`에 넣지 말 것
- 로컬 dev 서버 실행 금지 (사용자 요청) — Vercel 배포 후 확인할 것

---

## GitHub → Vercel 배포 명령어

```bash
# 프로젝트 폴더에서
cd d:\code\1_pro\toolnest

git init
git add .
git commit -m "init: ToolNest utility site"

# GitHub에서 새 저장소(toolnest) 만든 후
git remote add origin https://github.com/<USERNAME>/toolnest.git
git branch -M main
git push -u origin main

# 이후 vercel.com 에서 Import → Deploy
```
