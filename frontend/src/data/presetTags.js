export const PRESET_CATEGORIES = [
  {
    category: "🔥 감성 & 트렌드",
    tags: ["#도파민", "#텍스트힙", "#오독완", "#고독한밤", "#위로가필요해", "#몰입의즐거움"]
  },
  {
    category: "📚 장르 & 스타일",
    tags: ["#세계문학전집", "#현대에세이", "#철학한스푼", "#SF판타지", "#시집추천", "#심리학탐구"]
  },
  {
    category: "💡 삶 & 생존",
    tags: ["#퇴사욕구", "#번아웃극복", "#갓생살기", "#인간관계론", "#자아찾기", "#오답노트"]
  },
  {
    category: "✨ 엉뚱 & 믹스매치",
    tags: ["#우주와사랑", "#커피와고전", "#새벽3시", "#탐정소설", "#괴짜천재", "#미니멀라이프"]
  }
];

export const ALL_PRESET_TAGS = PRESET_CATEGORIES.flatMap(c => c.tags);
