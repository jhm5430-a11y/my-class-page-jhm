# 📊 기술 교과 성적 분석 대시보드 (Tech Education Score Analytics)

기술 교과 성적 데이터를 한눈에 파악하고 분석할 수 있는 웹 기반 인터페이스입니다. **Chart.js**와 **Glassmorphism** 디자인을 적용하여 직관적이고 현대적인 대시보드를 제공합니다.

## 🌐 바로가기 (Live Demo)
아래 링크를 통해 배포된 대시보드에 접속하실 수 있습니다:
👉 **[성적 분석 대시보드 바로가기](https://jhm5430-a11y.github.io/my-class-page-jhm/)**

---

## ✨ 주요 기능
- **📊 통계 요약**: 전체 학생 수, 평균 점수, 최고/최저 점수를 실시간 계산하여 표시
- **📉 데이터 시각화**: 
  - 학급별 평균 성적 비교 (Bar Chart)
  - 전체 성적 분포 곡선 (Line Chart)
  - 평가 항목별 기여 분석 (Radar Chart)
- **🔎 데이터 조회**: 학급별 필터링 기능이 포함된 상세 성적 테이블
- **📱 반응형 디자인**: 다양한 기기(모바일, 태블릿, PC)에 최적화된 레이아웃

---

## 📂 파일 구조
- `index.html`: 대시보드의 기본 구조 및 메타데이터
- `style.css`: 글래스모피즘 기반의 세련된 UI 디자인
- `app.js`: CSV 데이터 파싱 및 동적 차트 렌더링 로직
- `tech_scores.csv`: 성적 원본 데이터 파일 (학급, 번호, 지필, 수행평가 점수 포함)
- `generate_scores.py`: 테스트를 위한 더미 성적 데이터를 생성하는 파이썬 스크립트

---

## 🛠 사용된 기술 (Tech Stack)
- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+)
- **Libraries**: 
  - [Chart.js](https://www.chartjs.org/) (데이터 시각화)
  - [PapaParse](https://www.papaparse.com/) (CSV 파싱)
- **Fonts**: Google Fonts (Outfit, Noto Sans KR)
- **Deployment**: GitHub Pages

---

## 🚀 로컬에서 실행하기
1. 리포지토리를 클론합니다.
   ```bash
   git clone https://github.com/jhm5430-a11y/my-class-page-jhm.git
   ```
2. 로컬 서버(예: VS Code Live Server)를 통해 실행합니다.
   - *보안 상의 이유로 브라우저에서 `index.html`을 직접 열면 CSV 파일을 읽어올 수 없으니 반드시 서버를 통해 실행해 주세요.*
