# 포트폴리오

3D 맥북이 열리고, 그 화면 속 macOS 에서 소개와 프로젝트를 둘러보는 포트폴리오.
폰에서는 맥북 대신 3D 아이폰이 켜지고 iOS 홈 화면이 뜬다.
화면 속 UI 는 [playground-macos](https://github.com/Renovamen/playground-macos)(MIT)의 구성을 참고했고,
재질과 치수는 [Apple 디자인 리소스](https://developer.apple.com/kr/design/resources/)의 macOS 26 · iOS 26 기준(Liquid Glass)에 맞췄다.

## 어떻게 움직이나

1. 닫힌 노트북을 정면에서 보여 준다. 비스듬히 돌지 않아서 가로선 · 세로선이 반듯하다.
2. 뚜껑이 저절로 열리고, 다 열리기 조금 전에 화면이 켜진다(부팅).
3. 바탕화면이 뜨면 카메라가 화면 쪽으로 다가가 화면이 뷰포트를 채운다. 그 뒤로는 고정이다.
4. 화면 속은 그림이 아니라 진짜 DOM 이다.
   - 메뉴 막대: `ㅎ` 표식 메뉴(잠자기 · 다시 시작), Wi-Fi, Spotlight, 제어 센터(다크 모드 · 밝기 · 전체 화면), 시계
   - 독: 메모 · LinkedIn · Instagram · Outlook · GitHub. 마우스를 가져가면 커진다.
   - 메모 창: 제목 막대로 끌고, 가장자리로 크기를 바꾸고, 노란 버튼은 독으로 빨려 들어가고, 초록 버튼은 전체 화면
   - 메모 앱: 애플 메모처럼 목록 · 본문 두 칸. 목록은 분류(소개 · 프로젝트)마다 제목을 달아 묶는다
5. 폰처럼 좁은 화면에서는 맥북 대신 아이폰(15 Pro 실측)을 정면에 세운다.
   전원이 켜지고 부팅한 뒤 화면 쪽으로 다가가, 그 자리에서 진짜 크기의 iOS 화면으로 바꿔 끼운다.
   - 홈 화면: 상태 바, 날짜 위젯, 검색, 독(맥과 같은 다섯 개)
   - 메모는 아이콘 자리에서 커지며 열리고, 아래 홈 막대를 누르면 그 자리로 줄어들며 닫힌다.

`ㅎ` 표식 메뉴의 **잠자기**를 누르면 뚜껑이 닫힌다. 아래로 스크롤하면 다시 열린다.
휠 · 트랙패드 · 손가락으로 쓸어 올리기 · `↓` · 스페이스 키 모두 된다.

## 내용 채우기

소개 · 프로젝트는 비워 뒀다. 아래 파일만 채우면 맥과 아이폰 양쪽에 나온다.

| 어디 | 무엇 |
| --- | --- |
| `src/content/about/*.md` | 메모 앱 **소개** 분류의 글 |
| `src/content/projects/*.md` | 메모 앱 **프로젝트** 분류의 글 |
| [`src/config/notes.ts`](src/config/notes.ts) | 메모 목록에서 글을 묶는 분류의 이름과 순서. 분류를 늘리면 `src/content/<id>/` 폴더도 만든다 |
| [`src/config/links.ts`](src/config/links.ts) | 독의 LinkedIn · Instagram · Outlook(`mailto:`) · GitHub 주소 |

`links.ts` 의 주소를 비워 두면 아이콘은 보이지만 눌러도 아무 일 없다. 채운 링크는 Spotlight 에서도 찾힌다.

### 메모 글 쓰는 법

마크다운 파일 하나가 메모 하나다.

```md
---
title: 캠퍼스 길찾기
excerpt: 목록에 두 줄로 보이는 요약
link: https://example.com
order: 1
---

# 캠퍼스 길찾기

본문은 GitHub 마크다운 그대로 쓴다. 표, 코드 블록, 인용 모두 된다.
```

- 머리말(`---`)은 전부 생략할 수 있다. 제목은 첫 `#` 제목, 요약은 첫 문단에서 뽑는다.
- `link` 를 적으면 목록에 링크 표시가 붙고, 본문 오른쪽 위에 **링크 열기** 버튼이 생긴다.
- `order` 가 작은 글이 위로 온다. 없으면 파일 이름 순서.
- 그림은 `public/` 에 두고 `![설명](/images/x.png)` 처럼 `/` 로 시작하는 경로로 쓴다.
- 노션 같은 색 칸 태그는 `{{전공동아리}}` 처럼 감싼다. 색을 정하려면 `{{SW중심사업단:red}}` 처럼 뒤에 붙인다
  (`default` · `gray` · `brown` · `orange` · `yellow` · `green` · `blue` · `purple` · `pink` · `red`).
  색을 안 적으면 이름마다 정해진 색이 붙는다. 표 칸 안에서도 된다([`activities.md`](src/content/about/activities.md) 참고).
- 글은 빌드할 때 번들에 같이 들어간다. 따로 서버가 필요 없다.

## 구조

```
src/three/            3D. 치수(dims) · 카메라 자리 계산(pose) · 맥북 · 아이폰 모델 · 카메라 연출
src/os/               화면 속 macOS. 메뉴 막대 · 독 · 창 · Spotlight · 메모 앱
src/os/dockItems.ts   독 항목. 맥 독과 아이폰 독이 같이 쓴다
src/os/notes.ts       src/content 의 마크다운을 읽어 메모로 만든다
src/ios/              화면 속 iOS. 상태 바 · 홈 화면 · 앱 화면 · 검색
src/config/           채워 넣을 설정
src/content/          채워 넣을 글
src/store/os.ts       기기 단계 · 창 · 제어 센터 · 메모 선택
src/styles/theme.css  두 운영체제의 라이트 · 다크 색과 유리 재질(--glass-*)
brand/                ㅎ 표식의 색 변형 SVG(프로필 사진 등에 쓰는 자료). 사이트에는 들어가지 않는다
```

화면 속 DOM 은 drei `Html` 이 따로 만든 React root 에 그려져서 context 가 닿지 않는다.
그래서 상태를 전부 zustand 스토어 하나에 둔다.

### 화면 속 글자가 선명한 이유

drei `Html transform` 은 CSS 1px 을 `distanceFactor / 400` 월드 단위로 옮긴다.
화면에 다가갔을 때 화면 폭이 몇 px 로 그려질지 먼저 계산하고([`pose.ts`](src/three/pose.ts)),
가상 해상도를 그 폭으로 잡아 1:1 로 그려지게 한다.

카메라는 처음부터 끝까지 화면과 수직으로 선다. 닫힌 기기를 볼 때도, 전체를 볼 때도
방향은 그대로 두고 거리와 위아래 위치만 바꾼다. 비스듬히 보면 DOM 이 사다리꼴로 찌그러져 흐려진다.
창을 끌 때는 포인터 이동량을 그 배율로 나눈다.

CSS 3D(`preserve-3d`) 안의 스크롤 영역은 크롬에서 휠로 움직이지 않는다.
그래서 화면 속 휠은 [`useWheelScroll`](src/hooks/useWheelScroll.ts) 이 대신 받아 가장 가까운 스크롤 영역을 옮긴다.

### 모델과 조명

외부 3D 파일 없이 three.js 도형으로 직접 만들었다. 맥북은 14인치 MacBook Pro(2021~),
아이폰은 iPhone 15 Pro 실측을 따른다. 키 80개는 한 geometry 로 합쳐 한 번에 그린다.
조명도 HDR 파일 없이 drei `Lightformer` 판 조명 몇 장으로 만든다.

`frameloop="demand"` 라 뚜껑과 카메라가 움직이는 동안만 다시 그린다. 가만히 두면 GPU 가 쉰다.

### 디자인 기준과 아이콘

Apple 디자인 리소스와 HIG 에 공개된 규격을 기준으로 삼았다.

- 재질: macOS 26 · iOS 26 의 Liquid Glass. 뒤를 흐리고 채도를 올린 뒤 위 가장자리에 빛,
  아래 가장자리에 반사를 얇게 긋는다. 메뉴 · 제어 센터 · 독 · Spotlight · 아이폰 독과 검색이 같은 재질을 쓴다.
  세기는 `src/styles/theme.css` 의 `--glass-*` 변수 몇 개로 한 번에 바꾼다.
- 메뉴 막대는 투명하고, 항목 강조는 캡슐 모양이다. 창 모서리는 14px.

리소스의 파일(UI 킷, 제품 베젤, SF Symbols, SF Pro)은 **Apple 플랫폼 앱 목업 용도로만** 쓰도록
라이선스가 걸려 있어 이 사이트에 넣지 않았다. 맥북 · 아이폰은 three.js 로 직접 모델링했고,
메뉴 막대 왼쪽 · 부팅 화면 · 파비콘은 애플 로고 대신 이름(홍제)의 첫 자음 `ㅎ` 을 본뜬 표식을 쓴다. 글꼴은 받지 않고 `-apple-system` 을 쓴다.

독 아이콘(메모 · LinkedIn · Instagram · Outlook · GitHub)은 받은 그림을 보고 SVG 로 다시 그렸다.
LinkedIn · Instagram · Outlook · GitHub 로고는 각 회사의 상표라, 본인 프로필로 이어지는 링크 아이콘으로만 쓴다.

## 실행

```bash
pnpm install
pnpm dev
```

| 스크립트 | 하는 일 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 타입 검사 후 프로덕션 빌드 |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |

## 배포

Vercel 에 정적 빌드로 올린다. 라우터가 없어 설정 파일은 필요 없다.

## 크레딧

- 화면 속 macOS 의 구성과 독 확대 곡선: [Renovamen/playground-macos](https://github.com/Renovamen/playground-macos) (MIT)
