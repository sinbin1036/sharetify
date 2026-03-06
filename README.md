
# 🎵 Sharetify

**Sharetify**는 사용자가 선택한 **분위기(Mood)** 에 맞는 노래를 추천해주는 간단한 웹 서비스입니다.
분위기 기반 추천 방식을 통해 상황이나 감정에 맞는 음악을 쉽게 찾을 수 있도록 설계되었습니다.

이 프로젝트는 **BDAD 학습공동체 활동**을 통해 기획 및 개발된 **MVP(Prototype) 웹 서비스**입니다.

---

# 📌 Project Overview

많은 음악 서비스는 개인의 청취 기록을 기반으로 추천을 제공하지만,
사용자는 때때로 **현재 분위기나 감정에 맞는 음악**을 찾고 싶어합니다.

Sharetify는 이러한 상황을 고려하여
**"분위기 기반 노래 추천"** 이라는 간단한 접근 방식으로 음악을 추천합니다.

사용자는 특정 분위기를 선택하면 해당 분위기에 어울리는 노래 목록을 추천받고
각 곡을 **YouTube 링크를 통해 바로 감상**할 수 있습니다.

---

# 🚀 Features

### 1️⃣ Mood Based Recommendation

사용자는 아래와 같은 **분위기 카테고리** 중 하나를 선택할 수 있습니다.

* 잔잔
* 감성
* 신남
* 운동
* 드라이브
* 집중
* 새벽
* 힐링

선택된 분위기에 맞는 노래를 **추천 리스트 형태로 제공**합니다.

---

### 2️⃣ Recommendation Result UI

추천 결과는 **카드형 UI**로 표시됩니다.

각 카드에는 다음 정보가 포함됩니다.

* 노래 제목
* 아티스트
* 분위기 태그
* YouTube 감상 버튼

---

### 3️⃣ YouTube Playback Link

노래를 직접 재생하는 대신
**YouTube 검색 링크를 통해 음악을 감상할 수 있도록 구현**했습니다.

예시

```
https://www.youtube.com/results?search_query=Artist+Song
```

이 방식은 별도의 API 사용 없이도 안정적인 음악 탐색 경험을 제공합니다.

---

# 🧠 Recommendation Logic

Sharetify의 추천 방식은 **분위기 기반 필터링 방식**을 사용합니다.

```
사용자 선택 Mood
        ↓
해당 Mood 태그를 가진 노래 필터링
        ↓
랜덤 셔플
        ↓
15곡 추천
```

추천 알고리즘은 **단순하지만 직관적인 구조**로 설계되어
MVP 서비스에 적합하도록 구현되었습니다.

---

# 🏗️ Tech Stack

Frontend

* Next.js
* React
* CSS

Data

* JSON Dataset (Song List)

Deployment

* Vercel

---

# 📂 Project Structure

```
sharetify
 ├─ app
 │   ├─ page.tsx
 │   ├─ recommend
 │   │   └─ page.tsx
 │
 ├─ components
 │   ├─ MoodCard.tsx
 │   ├─ SongCard.tsx
 │
 ├─ data
 │   └─ songs.json
 │
 └─ utils
     └─ recommend.ts
```

---

# 🎯 Learning Objectives

본 프로젝트는 BDAD 학습공동체 활동을 통해 다음과 같은 목표를 가지고 진행되었습니다.

* 분위기 기반 음악 추천 서비스 기획
* 간단한 추천 로직 설계 및 구현
* 웹 인터페이스(UI) 설계
* 웹 서비스 개발 및 배포 경험

---

# 🌐 Deployment

Sharetify는 웹 서비스 형태로 배포되었습니다.

배포 환경

* Vercel

---

# 📊 Future Improvements

향후 다음과 같은 기능 확장이 가능합니다.

* Spotify API 기반 음악 데이터 연동
* Audio Feature 기반 추천 알고리즘
* 사용자 플레이리스트 기능
* 사용자 맞춤 추천 시스템

---

# 👨‍💻 Author

BDAD 학습공동체 프로젝트
2026
