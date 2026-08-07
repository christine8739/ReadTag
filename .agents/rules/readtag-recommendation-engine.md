# ReadTag AI Hashtag Recommendation & Search Rules

1. **Multi-Tag Relevance Scoring**:
   - For any user-entered hashtag combination (e.g., `#사랑 #우울 #혐오`, `#공포 #흡혈귀`, `#바다 #용기`), calculate exact relevance scores across all candidate books in `MINUMSA_WORLD_LITERATURE_COLLECTION` and Aladin OpenAPI live items.
   - Never pick a single tag to search while ignoring the remaining tags. Evaluate all input tags together to determine the primary and secondary prescribed books.

2. **Zero Generic Fallbacks**:
   - Never generate placeholder strings like `"사랑 추천 도서"` or `"알라딘 실시간 추천"`.
   - Always return actual published books with real titles, authors, cover images, summaries, and quotes.

3. **Instant Search Resolution**:
   - When searching via the search bar, search across Titles, Authors, Publishers, Categories, Tags, and Summaries simultaneously using `searchBooksFromApi`.
   - Never return default fallback books when a specific keyword query yields no results.

4. **Dynamic Random Shuffling**:
   - On page refresh (`F5`), shuffle the book collection so the user discovers fresh world literature masterpieces on every visit.
