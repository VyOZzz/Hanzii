# Hanzi Dictionary Search API - External Implementation References

**Project**: Hanzii SRS Dictionary  
**Stack**: Spring Boot 4.0.3 + JPA + MySQL + Swagger UI  
**Date**: 2026-04-09  
**Purpose**: Search + Filter + Pagination + Recommended Items + Detail Navigation

---

## REFERENCE #1: Spring Data JPA - Specifications with Pagination
### ✅ HIGHEST PRIORITY - CORE PATTERN

**Official Documentation**: https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html

**Why**: Provides the exact pattern needed for dynamic word search (hanzi, pinyin, meaning combinations without pre-defining every query method)

**Direct Application**:
1. Make `WordRepository` extend `JpaSpecificationExecutor<Word>`
2. Create static Specification methods in a `WordSpecifications` class
3. Compose specifications with `.where().and().and()` chains
4. Pass composed spec to `wordRepository.findAll(spec, pageable)`

**Code Pattern**:
```java
// Repository: add this interface
public interface WordRepository extends JpaRepository<Word, Long>,
                                        JpaSpecificationExecutor<Word> {}

// Specifications: reusable predicates
public class WordSpecifications {
    public static Specification<Word> hanziLike(String hanzi) {
        return (root, query, cb) -> hanzi == null ? null :
            cb.like(cb.lower(root.get("hanzi")), "%" + hanzi.toLowerCase() + "%");
    }
}

// Service: compose and execute
public Page<Word> search(String hanzi, String pinyin, int page, int size) {
    Specification<Word> spec = Specification
        .where(WordSpecifications.hanziLike(hanzi))
        .and(WordSpecifications.pinyinLike(pinyin));
    return wordRepository.findAll(spec, PageRequest.of(page, size));
}
```

---

## REFERENCE #2: Spring Data REST - Paging and Sorting
### ✅ RESPONSE FORMAT STANDARD

**Official Documentation**: https://docs.spring.io/spring-data/rest/reference/paging-and-sorting.html

**Why**: Defines REST API conventions for pagination responses (what your Swagger UI will generate)

**Direct Application**:
- Adopt HAL/JSON response format with pagination metadata
- Use `Page<T>` return type (Spring auto-serializes to JSON)
- Include metadata: `totalElements`, `totalPages`, `number`, `size`

**Expected API Response**:
```json
{
  "content": [
    {"id": 1, "hanzi": "中", "pinyin": "zhōng"},
    {"id": 2, "hanzi": "国", "pinyin": "guó"}
  ],
  "totalElements": 450,
  "totalPages": 45,
  "number": 0,
  "size": 10
}
```

**Example URL**: `GET /api/words/search?page=0&size=10&sort=hanzi,asc&hanzi=中`

---

## REFERENCE #3: OneUptime Blog - Production-Ready Pagination (Jan 2026)
### ✅ BEST PRACTICES

**URL**: https://oneuptime.com/blog/post/2026-01-25-pagination-spring-data-jpa-specifications/view

**Why**: Covers performance pitfalls and security considerations for real-world pagination

**Key Takeaways for Hanzii**:

1. **Safe Page Size Limits**:
   ```java
   int safeSize = Math.min(size, 100);  // Prevent clients requesting 10k rows
   Pageable pageable = PageRequest.of(page, safeSize, sort);
   ```

2. **MySQL Indexing** (critical for 10k+ words):
   ```sql
   CREATE INDEX idx_word_hanzi ON word(hanzi);
   CREATE INDEX idx_word_pinyin ON word(pinyin);
   CREATE INDEX idx_word_meaning ON word(meaning(50));  -- partial index for TEXT
   ```

3. **Use `Slice<T>` for expensive count queries**:
   ```java
   Slice<Word> results = wordRepository.findAll(spec, PageRequest.of(page, size));
   // Returns one extra row to check if more exists, skips COUNT(*) query
   ```

---

## REFERENCE #4: Medium - Specification DSL Pattern (Oct 2025)
### ✅ CLEAN ARCHITECTURE

**URL**: https://building.theatlantic.com/pagination-filtering-and-sorting-in-spring-boot-with-jpa-specifications-060423fd3405

**Why**: Shows how to implement DTOs + request validation cleanly with Specification composition

**Pattern for Hanzii**:
```java
// Request DTO captures all possible filters
@Getter @Setter
public class WordSearchRequest {
    private String hanzi;
    private String pinyin;
    private String meaning;
    private String wordType;
    private Integer minFrequency;
}

// Response DTO abstracts entity details
@Getter @Setter
public class WordSearchResponse {
    private Long id;
    private String hanzi;
    private String pinyin;
    private String meaning;
    // omit internal fields like userId, createdAt, updatedAt
}

// Specification builder
public class WordSearchSpecification {
    public static Specification<Word> buildFrom(WordSearchRequest req) {
        return Specification
            .where(hanziLike(req.getHanzi()))
            .and(pinyinLike(req.getPinyin()))
            .and(meaningLike(req.getMeaning()))
            .and(wordTypeEquals(req.getWordType()));
    }
}

// Controller
@PostMapping("/search")
public ResponseEntity<PageResponse<WordSearchResponse>> search(
    @Valid @RequestBody WordSearchRequest req,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    
    Specification<Word> spec = WordSearchSpecification.buildFrom(req);
    Page<Word> page = wordService.search(spec, page, size);
    
    return ResponseEntity.ok(new PageResponse<>(page.map(this::toResponse)));
}
```

---

## REFERENCE #5: Baeldung - Spring Data JPA Pagination (2018)
### ✅ FOUNDATIONAL PATTERNS

**URL**: https://www.baeldung.com/spring-data-jpa-pagination-sorting

**Key Code Snippets**:

**Multiple field sorting**:
```java
Sort sort = Sort.by(Sort.Direction.ASC, "hanzi")
                .and(Sort.by(Sort.Direction.DESC, "frequency"));
Pageable pageable = PageRequest.of(0, 10, sort);
```

**Custom repository method**:
```java
public interface WordRepository extends PagingAndSortingRepository<Word, Long> {
    Page<Word> findByHanziContainingIgnoreCase(String hanzi, Pageable pageable);
}
```

---

## REFERENCE #6: GitHub - BezKoder Full Project (2020)
### ✅ COMPLETE WORKING EXAMPLE

**GitHub**: https://github.com/bezkoder/spring-boot-jpa-paging-sorting  
**Stars**: 107 | **Languages**: Java | **License**: MIT

**Why**: Full-stack example (Entity → Repository → Service → Controller) you can reference

**Architecture**:
```
Model/Entity
  ↓
Repository (with PagingAndSortingRepository)
  ↓
Service (business logic, pagination handling)
  ↓
Controller (REST endpoints)
  ↓
JSON Response (Page<T> auto-serialized)
```

**File Structure**:
- `TutorialRepository.java` - Repository with pagination support
- `TutorialService.java` - Service layer with search logic
- `TutorialController.java` - REST endpoints
- `Tutorial.java` - JPA Entity

**Integration Path for Hanzii**:
1. Study `TutorialRepository` → Apply to `WordRepository`
2. Study `TutorialService.search()` → Apply to `WordService.searchWords()`
3. Study `TutorialController.search()` → Apply to `WordController.searchWords()`

---

## REFERENCE #7: Datamuse API (2026)
### 📚 RECOMMENDED ITEMS PATTERN

**URL**: https://www.datamuse.com/api

**Why**: Reference for related/recommended words (next phase after core search)

**Concepts to Adopt**:
- `/words?ml=meaning_like` → similar meaning words
- `/words?sl=sounds_like` → phonetic neighbors
- Relevance scoring for recommendations
- Result ranking by popularity

**For Hanzii Future Enhancement**:
```
GET /api/words/1/related?type=similar_meaning
GET /api/words/1/related?type=similar_pronunciation
GET /api/words/1/related?type=stroke_variant
GET /api/words/1/related?type=radical_match
```

---

## REFERENCE #8: GitHub - Vuizur/ultimate-dictionary-api
### 📚 DICTIONARY ENTRY STRUCTURE

**GitHub**: https://github.com/Vuizur/ultimate-dictionary-api  
**Purpose**: Multi-language dictionary REST API

**Why**: Shows detailed entry structure for click-to-detail navigation

**Entry Format** (adapt for Chinese):
```json
{
  "word": "中",
  "pinyin": "zhōng",
  "definitions": [
    {
      "partOfSpeech": "noun",
      "meaning": "middle, center",
      "examples": ["中国 (China)", "中心 (center)"]
    },
    {
      "partOfSpeech": "adj",
      "meaning": "central, in the middle"
    }
  ],
  "frequency": 4850,
  "strokeCount": 4,
  "radicals": ["丨"],
  "traditional": "中",
  "sim
