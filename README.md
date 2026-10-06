# 📚 ReadTag — MZ세대를 위한 AI 해시태그 독서 자판기 & Proof of Reading 플랫폼

**ReadTag**는 MZ세대의 독서 트렌드에 맞춰 기획된 **AI 기반 해시태그 독서 자판기 및 독서 인증(Proof of Reading) 플랫폼**입니다.  
사용자가 자신의 기분이나 취향을 해시태그로 선택하면 자판기 인터랙션을 통해 맞춤형 도서 처방전 영수증을 추출하고, 한 줄 평과 스티커로 꾸며 자신만의 독서 아카이브에 기록할 수 있습니다.

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
