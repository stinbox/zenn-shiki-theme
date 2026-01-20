---
title: "Markdown Sample Document"
author: "Developer"
date: 2024-01-15
tags: [markdown, documentation, sample]
draft: false
---

# Markdown Sample Code

This document demonstrates various **Markdown** syntax features and token types.

## Table of Contents

- [Headers](#headers)
- [Text Formatting](#text-formatting)
- [Lists](#lists)
- [Links and Images](#links-and-images)
- [Code](#code)
- [Tables](#tables)
- [Blockquotes](#blockquotes)

---

## Headers

# H1 - Main Title
## H2 - Section Header
### H3 - Subsection
#### H4 - Sub-subsection
##### H5 - Minor Section
###### H6 - Smallest Header

Alternative H1
==============

Alternative H2
--------------

---

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and ***bold italic text***.

You can also use __underscores__ for _emphasis_ or ___both___.

Here's some `inline code` within a sentence.

~~Strikethrough text~~ is also supported.

This is a paragraph with a
soft line break (two spaces at the end).

This is a new paragraph after a hard break.

---

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deep nested item
- Item 3

* Alternative bullet style
* Another item

+ Plus sign also works
+ As a bullet marker

### Ordered Lists

1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
      1. Deep nested
3. Third item

### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Yet another incomplete task
  - [x] Nested completed subtask
  - [ ] Nested incomplete subtask

### Definition Lists

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

---

## Links and Images

### Links

[Basic link](https://example.com)

[Link with title](https://example.com "Example Website")

[Reference-style link][ref1]

[ref1]: https://example.com/reference "Reference Link"

<https://example.com/auto-link>

<email@example.com>

### Images

![Alt text for image](https://example.com/image.png)

![Image with title](https://example.com/image.png "Image Title")

[![Linked Image](https://example.com/image.png)](https://example.com)

Reference-style image: ![Alt text][img1]

[img1]: https://example.com/reference-image.png "Reference Image"

---

## Code

### Inline Code

Use `const x = 42;` for inline code.

### Fenced Code Blocks

```javascript
// JavaScript code with syntax highlighting
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

const users = ['Alice', 'Bob', 'Charlie'];
users.forEach(greet);
```

```python
# Python code example
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []

    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])

    return sequence[:n]

print(fibonacci(10))
```

```bash
#!/bin/bash
# Shell script example
for i in {1..5}; do
    echo "Iteration $i"
done
```

### Indented Code Block

    function indentedCode() {
        // Four spaces of indentation
        return true;
    }

---

## Tables

### Basic Table

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
| Cell 7   | Cell 8   | Cell 9   |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
| Text         | Text           | Text          |
| 123          | 456            | 789           |

### Complex Table

| Feature       | Status    | Notes                          |
|--------------|-----------|--------------------------------|
| **Bold**     | ✅ Done    | Supports `inline code` too    |
| *Italic*     | ✅ Done    | [With links](https://example.com) |
| ~~Strike~~   | ⚠️ Partial | Some limitations apply         |

---

## Blockquotes

> This is a simple blockquote.

> This is a multi-line blockquote.
> It continues on the next line.
>
> And can have multiple paragraphs.

> Nested blockquotes:
>
> > This is nested.
> >
> > > And this is deeply nested.

> ### Blockquote with Other Elements
>
> - List item in blockquote
> - Another item
>
> `code in blockquote`
>
> **Bold** and *italic* work too.

---

## Horizontal Rules

Three or more dashes:

---

Three or more asterisks:

***

Three or more underscores:

___

---

## Extended Syntax

### Footnotes

Here's a sentence with a footnote[^1].

Here's another one with a named footnote[^note].

[^1]: This is the first footnote.

[^note]: This is a named footnote with multiple paragraphs.

    Indent paragraphs to include them in the footnote.

### Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium

### Emoji

:smile: :heart: :thumbsup: :rocket: :warning:

### Subscript and Superscript

H~2~O is water.

X^2^ is X squared.

### Highlight

==Highlighted text== stands out.

### Math (LaTeX)

Inline math: $E = mc^2$

Block math:

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

---

## HTML in Markdown

<div align="center">
  <strong>Centered content using HTML</strong>
</div>

<details>
<summary>Click to expand</summary>

This content is hidden by default and revealed when clicked.

- Hidden item 1
- Hidden item 2

</details>

<kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

---

## Comments

[//]: # (This is a comment that won't be rendered)

[comment]: <> (Another comment style)

<!-- HTML-style comment -->

---

*Document last updated: January 2024*
