# 📚 ReadTag — MZ세대를 위한 AI 해시태그 독서 자판기 & Proof of Reading 플랫폼

**ReadTag**는 MZ세대의 독서 트렌드에 맞춰 기획된 **AI 기반 해시태그 독서 자판기 및 독서 인증(Proof of Reading) 플랫폼**입니다.  
사용자가 자신의 기분이나 취향을 해시태그로 선택하면 자판기 인터랙션을 통해 맞춤형 도서 처방전 영수증을 추출하고, 한 줄 평과 스티커로 꾸며 자신만의 독서 아카이브에 기록할 수 있습니다.

---

## 📁 전체 프로젝트 구조 (Project Architecture)

본 프로젝트는 프론트엔드(`frontend/`)와 백엔드(`backend/`)가 깔끔하게 분리된 모듈형 구조로 설계되었습니다.

```text
ReadTag/
├── 📁 frontend/                         # 🎨 React + Vite 프론트엔드 애플리케이션
│   ├── 📁 public/                       # 파비콘 및 SVG 정적 자원
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── 📁 src/
│   │   ├── 📁 assets/                   # 이미지 자원 (hero.png 등)
│   │   ├── 📁 components/               # UI 컴포넌트 모음
│   │   │   ├── VendingMachine.jsx       # 1. AI 해시태그 독서 자판기 메인 UI
│   │   │   ├── ReceiptCard.jsx          # 2. 처방전 영수증 카드 및 카드 뒤집기 컨트롤러
│   │   │   ├── ReviewBackSide.jsx       # 3. 영수증 뒷면 한 줄 리뷰 및 스티커 꾸미기
│   │   │   ├── InfiniteLoopTags.jsx     # 4. 꼬리를 무는 연쇄 파생 태그 선택기
│   │   │   ├── MyArchive.jsx            # 5. 독서 기록 보관함 (Proof of Reading)
│   │   │   ├── AudioTeaserDesign.jsx    # 6. 도서 분위기 오디오 플레이어 UI
│   │   │   └── Navbar.jsx               # 7. 상단 네비게이션 바
│   │   ├── 📁 data/                     # 프론트엔드 목데이터
│   │   │   ├── booksData.js             # 추천 도서 DB (데미안, 아몬드, 사피엔스 등)
│   │   │   └── presetTags.js            # 프리셋 해시태그 태그군 정의
│   │   ├── 📁 utils/                    # 유틸리티 모듈
│   │   │   ├── aiBlendingEngine.js      # 해시태그 블렌딩 및 AI 도서 처방 로직
│   │   │   └── canvasExporter.js        # 영수증 카드 이미지 저장 유틸
│   │   ├── App.jsx                      # 메인 애플리케이션 상태 관리
│   │   ├── App.css                      # 컴포넌트 스타일
│   │   ├── index.css                    # 메인 디자인 시스템 & CSS 스타일
│   │   └── main.jsx                     # Vite 엔트리 포인트
│   ├── index.html                       # HTML 템플릿
│   ├── vite.config.js                   # Vite 개발 및 빌드 설정
│   └── package.json                     # 프론트엔드 의존성 및 스크립트
│
├── 📁 backend/                          # ⚙️ Java Spring Boot 백엔드 애플리케이션
│   ├── 📁 src/main/java/com/readtag/backend/
│   │   ├── 📁 config/                   # WebMvc & CORS 설정 (WebConfig.java)
│   │   ├── 📁 controller/               # REST API 컨트롤러
│   │   │   ├── BookRecommendController.java  # 도서 추천 API
│   │   │   ├── ReceiptController.java      # 처방전 영수증 CRUD API
│   │   │   └── TagController.java          # 해시태그 추천 API
│   │   ├── 📁 dto/                      # API 데이터 전송 객체
│   │   │   ├── BookDto.java
│   │   │   ├── ReceiptDto.java
│   │   │   └── TagDto.java
│   │   ├── 📁 entity/                   # JPA 데이터베이스 엔티티
│   │   │   ├── Book.java                # 도서 엔티티
│   │   │   ├── Hashtag.java             # 해시태그 엔티티
│   │   │   ├── Receipt.java             # 처방전 영수증 엔티티
│   │   │   └── Review.java              # 리뷰 및 스티커 엔티티
│   │   ├── 📁 repository/               # Spring Data JPA 리포지토리
│   │   │   ├── BookRepository.java
│   │   │   ├── HashtagRepository.java
│   │   │   ├── ReceiptRepository.java
│   │   │   └── ReviewRepository.java
│   │   ├── 📁 service/                  # 비즈니스 로직 서비스 Layer
│   │   │   ├── BookService.java
│   │   │   ├── ReceiptService.java
│   │   │   └── TagService.java
│   │   └── ReadTagApplication.java      # Spring Boot 메인 애플리케이션
│   ├── 📁 src/main/resources/
│   │   └── application.yml              # H2 DB & 서버 환경 설정
│   └── pom.xml                          # Maven 빌드 및 의존성 관리 설정
│
├── package.json                         # 루트 실행 편의 스크립트
└── README.md                            # 프로젝트 안내 문서
```

---

## ✨ 주요 기능 (Key Features)

1. 🎰 **AI 해시태그 독서 자판기 (`VendingMachine`)**
   - 감정/상태(`#도파민`, `#현타`, `#성장통`), 장르/취향(`#세계문학전집`, `#SF`), 목표/패턴(`#오답노트`, `#리프레시`) 태그 조합
   - 3개 태그를 조합하여 버튼을 누르면 레트로 영수증 스타일의 맞춤형 도서 처방전이 추출됩니다.

2. 🧾 **처방전 영수증 카드 & 카드 뒤집기 (`ReceiptCard`, `ReviewBackSide`)**
   - 메인 추천 도서, 연관 도서 2권, 도서 주요 문장, 파생 태그 정보 제공
   - **카드 뒤집기 애니메이션**: 영수증 카드를 클릭하여 3D 뒤집기로 독서 완료 한 줄 평 작성 및 스티커(`오독완`, `TextHip` 등) 꾸미기 지원
   - **이미지 다운로드**: `html2canvas` 기반으로 자신이 작성한 처방전 영수증 카드를 이미지로 저장 가능

3. ♾️ **무한 연쇄 파생 태그 (`InfiniteLoopTags`)**
   - 처방된 도서에서 꼬리를 무는 파생 해시태그를 클릭하면 즉시 새로운 태그 조합으로 재처방되어 탐색의 재미를 제공합니다.

4. 🗃️ **나의 독서 아카이브 (`MyArchive` / Proof of Reading)**
   - 내가 뽑은 처방전과 작성한 리뷰를 저장하고 관리하는 아카이빙 기능
   - 카드 형태 리스트 조회, 카드 재확인, 삭제 지원

5. 🎵 **도서 분위기 오디오 플레이어 (`AudioTeaserDesign`)**
   - 책의 감성과 어울리는 오디오 앰비언스 플레이어 UI 지원

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework & Tooling**: React 19, Vite
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism, 3D Transform, Modern Color Palettes)
- **Icons & Effects**: `lucide-react`, `canvas-confetti`, `html2canvas`

### Backend
- **Framework**: Java 17+, Spring Boot 3
- **Database**: H2 In-Memory Database (`/h2-console` 지원)
- **ORM & Tools**: Spring Data JPA, Lombok
- **Build Tool**: Maven (`pom.xml`)

---

## 🚀 실행 가이드 (Getting Started)

### 1. 프론트엔드 (Frontend) 실행
루트 디렉터리에서 다음 명령어를 실행하거나, `frontend` 디렉터리로 이동하여 실행합니다.

```bash
# 루트 디렉터리에서 바로 실행
npm run dev

# 또는 frontend 디렉터리로 이동 후 실행
cd frontend
npm run dev
```
- 브라우저 접속: `http://localhost:5173`

### 2. 백엔드 (Backend) 실행
`backend` 디렉터리로 이동 후 Spring Boot 애플리케이션을 실행합니다.

```bash
cd backend
./mvnw spring-boot:run   # Linux / macOS
mvnw.cmd spring-boot:run # Windows
```
- API Base URL: `http://localhost:8080`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:readtagdb`)
