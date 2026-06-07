# 🎵 Sharetify

**Sharetify**는 사용자가 입력한 현재 상황이나 기분을 바탕으로
YouTube에서 음악을 찾기 좋은 **플레이리스트 검색 키워드**를 생성해주는 웹 서비스입니다.

사용자는 복잡한 조건을 선택하지 않아도
“차 타고 드라이브 가는데 비가 오네”,
“기분 좋을 때 듣는 노래”,
“새벽에 집 가는 길인데 좀 우울함”
처럼 자연스럽게 문장을 입력할 수 있습니다.

Sharetify는 입력된 문장에서 **상황, 감정, 분위기, 환경**을 추출하고,
이에 맞는 YouTube 음악 검색어를 생성하여 사용자가 원하는 분위기의 음악을 쉽게 찾을 수 있도록 돕습니다.

이 프로젝트는 **BDAD 학습공동체 활동**을 통해 기획 및 개발된
**MVP(Prototype) 웹 서비스**입니다.

---

# 📌 Project Overview

많은 음악 서비스는 사용자의 청취 기록이나 좋아요 데이터를 기반으로 음악을 추천합니다.
하지만 사용자는 때때로 복잡한 추천 시스템보다
**지금 자신의 상황이나 감정에 어울리는 음악**을 빠르게 찾고 싶어합니다.

예를 들어 사용자는 다음과 같이 입력할 수 있습니다.

```text
차타고 드라이브 가는데 비가오네
```

Sharetify는 이 문장에서 다음 정보를 해석합니다.

```text
상황: 드라이브
환경: 비 오는 날
분위기: 차분함 / 감성적
목적: 음악 검색
```

그리고 YouTube에서 검색하기 좋은 문장으로 변환합니다.

```text
비 오는 날 드라이브할 때 듣기 좋은 노래
```

즉, Sharetify는 AI를 이용해 사용자의 자연어 입력을
**음악 탐색에 적합한 검색 키워드로 변환하는 서비스**입니다.

---

# 🚀 Features

## 1️⃣ Natural Language Based Music Search

사용자는 정해진 카테고리를 선택하는 대신
현재 상황이나 기분을 자연어로 입력할 수 있습니다.

입력 예시:

```text
기분 좋을 때 듣는 노래
차타고 드라이브 가는데 비가오네
새벽에 혼자 집 가는 길
시험 끝나고 친구들이랑 놀러감
공부할 때 집중 잘 되는 음악
```

Sharetify는 입력 문장을 분석하여
음악 검색에 필요한 핵심 요소를 추출합니다.

추출 요소:

* 상황
* 감정
* 분위기
* 날씨
* 시간대
* 활동
* 음악 검색 의도

---

## 2️⃣ AI Keyword Extraction

Sharetify는 사용자의 문장을 AI를 통해 분석합니다.

예시:

```text
입력: 차타고 드라이브 가는데 비가오네
```

분석 결과:

```json
{
  "situation": "드라이브",
  "weather": "비",
  "mood": "차분한 감성",
  "youtubeQuery": "비 오는 날 드라이브할 때 듣기 좋은 노래"
}
```

이 기능을 통해 사용자는 정확한 검색어를 직접 고민하지 않아도
상황에 맞는 음악을 쉽게 찾을 수 있습니다.

---

## 3️⃣ YouTube Search Query Generation

Sharetify는 AI가 추출한 정보를 바탕으로
YouTube 검색에 적합한 키워드를 생성합니다.

예시:

```text
비 오는 날 드라이브할 때 듣기 좋은 노래
새벽에 집 갈 때 듣기 좋은 감성 플레이리스트
기분 좋아지는 신나는 노래 모음
공부할 때 듣기 좋은 집중 음악
운동할 때 듣기 좋은 신나는 플레이리스트
```

생성된 검색어는 YouTube 검색 링크로 연결됩니다.

예시:

```text
https://www.youtube.com/results?search_query=비+오는+날+드라이브할+때+듣기+좋은+노래
```

---

## 4️⃣ Recommendation Result UI

분석 결과는 사용자가 이해하기 쉬운 형태로 표시됩니다.

결과 화면에는 다음 정보가 포함됩니다.

* 사용자가 입력한 문장
* 추출된 상황
* 추출된 감정 / 분위기
* 생성된 YouTube 검색 키워드
* YouTube 검색 버튼

---

# 🧠 Recommendation Logic

Sharetify의 추천 방식은
AI 기반 자연어 분석과 검색어 생성 방식을 사용합니다.

```text
사용자 자연어 입력
        ↓
AI가 상황 / 감정 / 분위기 / 환경 추출
        ↓
YouTube 검색에 적합한 키워드 생성
        ↓
YouTube 검색 링크 제공
```

이 방식은 직접 노래 데이터를 보유하거나 복잡한 추천 알고리즘을 구현하지 않아도
사용자의 현재 상황에 맞는 음악 탐색 경험을 제공할 수 있습니다.

---

# 🏗️ Tech Stack

## Frontend

* Next.js
* React
* CSS

## AI

* OpenAI API
* Natural Language Processing
* Keyword Extraction

## Music Search

* YouTube Search Link

## Deployment

* Vercel

---

# 🔐 Environment Variables

Create `.env.local` and set the server-side API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
YOUTUBE_API_KEY=your_youtube_api_key_here
```

`.env.local` is ignored by Git. Never expose `YOUTUBE_API_KEY` in client-side code.

---

# 📂 Project Structure

```text
sharetify
 ├─ app
 │   ├─ page.tsx
 │   ├─ recommend
 │   │   └─ page.tsx
 │
 ├─ components
 │   ├─ SearchInput.tsx
 │   ├─ ResultCard.tsx
 │   ├─ KeywordTag.tsx
 │
 ├─ lib
 │   ├─ openai.ts
 │   └─ youtube.ts
 │
 ├─ utils
 │   └─ buildYoutubeQuery.ts
 │
 └─ types
     └─ recommendation.ts
```

---

# 🎯 Learning Objectives

본 프로젝트는 BDAD 학습공동체 활동을 통해 다음과 같은 목표를 가지고 진행되었습니다.

* 자연어 기반 서비스 기획
* 사용자의 상황과 감정을 해석하는 AI 기능 설계
* OpenAI API를 활용한 키워드 추출 기능 구현
* YouTube 검색 링크 생성 로직 구현
* 웹 인터페이스 UI 설계
* Next.js 기반 웹 서비스 개발 및 배포 경험

---

# 🌐 Deployment

Sharetify는 웹 서비스 형태로 배포되었습니다.

배포 환경:

* Vercel

---

# 📊 Future Improvements

향후 다음과 같은 기능 확장이 가능합니다.

* YouTube Data API 연동
* Spotify API 기반 음악 데이터 연동
* 실제 플레이리스트 추천 기능
* 사용자 검색 기록 기반 개인화
* 기분 / 상황별 추천 히스토리 저장
* 한국어뿐만 아니라 영어 입력 지원
* 사용자가 원하는 음악 장르 반영
* AI 추천 결과에 대한 피드백 기능

---

# 👨‍💻 Author

BDAD 학습공동체 프로젝트
2026
