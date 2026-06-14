@AGENTS.md

# ToolNest 프로젝트 규칙

## HANDOFF.md 자동 업데이트 (필수)

**파일을 추가하거나 수정하는 작업을 할 때마다 반드시 HANDOFF.md를 업데이트해야 한다.**

업데이트 대상:
- 완성된 파일 목록 (새 파일 추가 시 체크리스트 반영)
- 구현된 툴 상세 (기능 변경 시 내용 수정)
- 다음 AI가 할 일 (완료된 항목 체크, 새 항목 추가)
- 주의사항 (새로 발견한 이슈 추가)

업데이트 타이밍: **코드 작업 완료 직후, git commit 전에** HANDOFF.md를 수정하고 함께 커밋한다.

## 배포 방법

```powershell
cd d:\code\1_pro\toolnest
git add .
git commit -m "feat: ..."
git push
# 자동배포 안 될 경우:
vercel --prod
```

## 주의사항

- 로컬 dev 서버 실행 금지 (사용자 요청)
- `next.config.ts` 에 `output: 'standalone'` 넣지 말 것
- Tailwind v4 사용 중 — `tailwind.config.ts` 없음
- 모든 페이지 `'use client'` 선언 필요
