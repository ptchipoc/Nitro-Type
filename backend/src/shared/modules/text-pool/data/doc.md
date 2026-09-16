Generate JSON text pool files for a typing speed application similar to MonkeyType.

## Structure

Each file is a JSON array of 10 objects with this shape:
{
"id": "string", // format: {category}-{difficulty}-{index} e.g. "anime-easy-001"
"text": "string", // the typing text
"wordCount": number
}

## Rules for all texts

- Language: English only
- No markdown, no explanations — raw JSON only
- wordCount must match the actual number of words in the text
- IDs must follow the format: {category}-{difficulty}-{3 digit index}
  e.g. anime-easy-001, func-med-003, algo-hard-007, beginner-001

## Files to generate (13 total)

### 1. anime/easy.json

- Short simple sentences about anime characters and their goals
- 8 to 12 words per text
- No code, no special characters
- Examples of characters: Naruto, Goku, Luffy, Ichigo, Eren, Tanjiro, Light

### 2. anime/medium.json

- Longer sentences about anime lore, philosophy and world building
- 14 to 20 words per text
- No code, no special characters

### 3. anime/hard.json

- Dense paragraphs about deep anime themes, character arcs and storytelling
- 22 to 32 words per text
- No code, no special characters

### 4. anime/extreme.json

- TypeScript/JavaScript code snippets themed around anime
- Use anime character names, powers, or concepts as variable/type names
- Mix of interfaces, types, functions, const declarations
- 10 to 20 words per text (code tokens count as words)

### 5. functions/easy.json

- Simple 42 School / C utility functions
- One-liners or 2-line functions in C
- e.g. size_t ft_strlen(const char *s) { ... }

### 6. functions/medium.json

- Intermediate 42 School / C utility functions: ft_strdup, ft_strjoin, ft_lstnew, etc.
- Multi-line, real-world patterns in C

### 7. functions/hard.json

- Advanced 42 School / C patterns: ft_split, ft_itoa, ft_lstmap
- Complex memory management and list operations in C

### 8. functions/extreme.json

- Advanced C projects and logic: get_next_line, ft_printf logic snippets
- Use of static variables, va_list, and complex logic snippets

### 9. algorithms/easy.json

- Simple algorithms in C: linear search, bubble sort, factorial, fibonacci, palindrome check
- Clean readable C implementations

### 10. algorithms/medium.json

- Intermediate algorithms in C: binary search, merge sort, two sum, max subarray
- Standard interview-level problems implemented in C

### 11. algorithms/hard.json

- Hard algorithms in C: dijkstra, DFS, flood fill, serialize tree
- Optimized C implementations

### 12. algorithms/extreme.json

- Expert algorithms in C: segment tree, trie, AVL tree, union find, KMP search, bitwise N-Queens
- Full C implementations with structs and pointers

### 13. beginner/default.json

- ID format: beginner-001 to beginner-010 (no difficulty in the id)
- Very simple short sentences, common English words only
- 9 to 13 words per text
- No punctuation complexity, no code
- e.g. "the cat sat on the mat and looked at the sun"

## Output format

Output each file separately, clearly labeled with its path like:
// anime/easy.json
[...]

// anime/medium.json
[...]

(and so on for all 13 files)
