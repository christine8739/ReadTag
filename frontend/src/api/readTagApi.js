import { MINUMSA_WORLD_LITERATURE_COLLECTION } from '../data/minumsaDataset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const ALADIN_TTB_KEY = import.meta.env.VITE_ALADIN_TTB_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function shuffleArray(array) {
  if (!array || array.length === 0) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 1200) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    return null;
  }
}

/**
 * Pure Real-time Dynamic Google Gemini AI Query Engine
 */
async function askGoogleGeminiAi(tags) {
  const cleanTags = (tags || []).map(t => t.replace('#', '').trim()).filter(Boolean);
  if (cleanTags.length === 0) return null;

  const prompt = `사용자가 독서 자판기에 입력한 해시태그 키워드: [${cleanTags.join(', ')}]

당신은 지능적인 AI 독서 큐레이터입니다. 사용자가 입력한 위 해시태그 조합의 분위기, 감정, 주제를 실시간으로 분석하여:
1. 가장 잘 어울리는 추천 도서 1권 (제목, 저자명)
2. 함께 읽으면 좋은 서브 추천 도서 2권 (제목, 저자명)
3. 이 해시태그를 선택한 독자에게 전하는 따뜻하고 통찰력 있는 AI 독서 처방전 한 줄 평 (70자 이내)
4. 이 도서와 어울리는 감성적인 명언 구절 한 문장

반드시 마크다운 코드 블록 없이 오직 순수한 단일 JSON 객체로만 응답하세요:
{
  "primaryTitle": "추천 도서 제목",
  "primaryAuthor": "저자 이름",
  "publisher": "출판사명",
  "category": "장르/분류",
  "oneLiner": "사용자가 선택한 해시태그에 맞춘 AI 독서 처방전 한 줄 평 (70자 이내)",
  "keyQuote": "책 속 감성적인 명언 또는 대표 구절",
  "summary": "도서의 핵심 분위기와 줄거리 요약 (2-3문장)",
  "secondaryBooks": [
    { "title": "서브 도서 제목 1", "author": "저자 1" },
    { "title": "서브 도서 제목 2", "author": "저자 2" }
  ]
}`;

  try {
    const res = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }, 1500);

    if (res && res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    }
  } catch (e) {
    // Ignore timeout
  }
  return null;
}

/**
 * Fast Local Instant Dataset Engine for 310+ Massive Collection
 */
function getInstantLocalPrescription(cleanTags) {
  const scored = MINUMSA_WORLD_LITERATURE_COLLECTION.map(book => {
    let score = 0;
    const primaryTags = book.primaryTags || [];
    const derivativeTags = book.derivativeTags || [];
    const bookText = (
      (book.title || '') + ' ' +
      (book.author || '') + ' ' +
      (book.oneLiner || '') + ' ' +
      (book.summary || '') + ' ' +
      (book.keyQuote || '') + ' ' +
      primaryTags.join(' ') + ' ' +
      derivativeTags.join(' ')
    ).toLowerCase();

    cleanTags.forEach(tag => {
      if (primaryTags.some(pt => pt.toLowerCase().includes(tag))) {
        score += 25;
      } else if (derivativeTags.some(dt => dt.toLowerCase().includes(tag))) {
        score += 15;
      } else if (bookText.includes(tag)) {
        score += 8;
      }
    });

    return { book, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topCandidates = scored.filter(s => s.score > 0);
  let primaryBook = null;

  if (topCandidates.length > 0) {
    const topSlice = topCandidates.slice(0, Math.min(8, topCandidates.length));
    primaryBook = shuffleArray(topSlice)[0].book;
  } else {
    primaryBook = shuffleArray(MINUMSA_WORLD_LITERATURE_COLLECTION)[0];
  }

  const secondaryPool = shuffleArray(MINUMSA_WORLD_LITERATURE_COLLECTION.filter(b => b.id !== primaryBook.id && b.title !== primaryBook.title));

  return {
    primaryBook,
    secondaryBooks: secondaryPool.slice(0, 2),
    derivativeTags: cleanTags.map(t => `#${t}`)
  };
}

/**
 * Ultra-Fast AI Prescription Engine
 */
export async function fetchPrescriptionFromApi(tags) {
  const cleanTags = (tags || []).map(t => t.replace('#', '').trim().toLowerCase()).filter(Boolean);

  if (cleanTags.length === 0) {
    const shuffled = shuffleArray(MINUMSA_WORLD_LITERATURE_COLLECTION);
    return {
      primaryBook: shuffled[0],
      secondaryBooks: shuffled.slice(1, 3),
      derivativeTags: ['#세계문학전집', '#텍스트힙', '#고전명작']
    };
  }

  const geminiPromise = askGoogleGeminiAi(cleanTags);
  const localFallback = getInstantLocalPrescription(cleanTags);

  try {
    const geminiResult = await Promise.race([
      geminiPromise,
      new Promise(res => setTimeout(() => res(null), 1200))
    ]);

    if (geminiResult && geminiResult.primaryTitle) {
      const match = MINUMSA_WORLD_LITERATURE_COLLECTION.find(b => b.title.includes(geminiResult.primaryTitle));
      let primaryBook = match || {
        id: `gemini_${Date.now()}`,
        title: geminiResult.primaryTitle,
        author: geminiResult.primaryAuthor || '세계문학 작가',
        publisher: geminiResult.publisher || '세계문학',
        publishedYear: '2024',
        category: geminiResult.category || '세계문학 클래식',
        cover: 'https://image.aladin.co.kr/product/32/87/cover200/s092934786_1.jpg',
        oneLiner: geminiResult.oneLiner || localFallback.primaryBook.oneLiner,
        summary: geminiResult.summary || localFallback.primaryBook.summary,
        keyQuote: geminiResult.keyQuote || localFallback.primaryBook.keyQuote,
        primaryTags: cleanTags.map(t => `#${t}`),
        derivativeTags: ['#구글AI처방', '#실시간생성', '#텍스트힙']
      };

      if (geminiResult.oneLiner) {
        primaryBook.oneLiner = geminiResult.oneLiner;
      }

      return {
        primaryBook,
        secondaryBooks: localFallback.secondaryBooks,
        derivativeTags: cleanTags.map(t => `#${t}`)
      };
    }
  } catch (e) {
    // Fall back to instant local
  }

  return localFallback;
}

/**
 * Omni-Search Engine across 310+ Massive Collection
 */
export async function searchBooksFromApi(keyword) {
  const query = (keyword || '').trim().toLowerCase().replace(/#/g, '');

  if (!query) {
    return shuffleArray(MINUMSA_WORLD_LITERATURE_COLLECTION);
  }

  const matches = MINUMSA_WORLD_LITERATURE_COLLECTION.filter(b => {
    const matchTitle = b.title.toLowerCase().includes(query);
    const matchAuthor = b.author.toLowerCase().includes(query);
    const matchCategory = b.category ? b.category.toLowerCase().includes(query) : false;
    const matchSummary = b.summary ? b.summary.toLowerCase().includes(query) : false;
    const matchPrimaryTags = b.primaryTags ? b.primaryTags.some(t => t.toLowerCase().includes(query)) : false;

    return matchTitle || matchAuthor || matchCategory || matchSummary || matchPrimaryTags;
  });

  if (matches.length > 0) {
    return shuffleArray(matches);
  }

  return shuffleArray(MINUMSA_WORLD_LITERATURE_COLLECTION);
}

/**
 * Fetch Collection (310+ items)
 */
export async function fetchBestsellersFromApi() {
  return shuffleArray(MINUMSA_WORLD_LITERATURE_COLLECTION);
}

export async function fetchMyReceiptsFromApi() {
  return [];
}

export async function saveReceiptToApi() {
  return true;
}

export async function deleteReceiptFromApi() {
  return true;
}
