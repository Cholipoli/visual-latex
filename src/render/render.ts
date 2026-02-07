// render/render.ts
import { EditorState } from "../editor/editor"
import { DocumentNode, InlineNode } from "../model/document"

export function render(state: EditorState, root: HTMLElement) {
  root.innerHTML = ""

  const { cursor } = state

  function renderNode(
    node: DocumentNode | InlineNode,
    path: (string | number)[] = []
  ): Node {
    // ===== BLOCK NODES =====
    if (
      "type" in node &&
      (node.type === "doc" ||
        node.type === "paragraph" ||
        node.type === "title" ||
        node.type === "subtitle")
    ) if (node.type === "doc") {
        const el = document.createElement("div")
        el.className = "doc"

        node.children?.forEach((child, i) => {
            el.appendChild(renderNode(child, ["children", i]))
        })

        return el
        }

        if (node.type === "title" || node.type === "subtitle") {
        const section = document.createElement("div")
        section.className = node.type

        // header
        const heading = document.createElement(
            node.type === "title" ? "h1" : "h2"
        )

        node.content?.forEach((inline, i) => {
            heading.appendChild(
            renderNode(inline, [...path, "content", i])
            )
        })

        section.appendChild(heading)

        // children (paragraphs, sub-sections, etc.)
        node.children?.forEach((child, i) => {
            section.appendChild(
            renderNode(child, [...path, "children", i])
            )
        })

        return section
    }

        if (node.type === "paragraph") {
        const p = document.createElement("p")

        node.content?.forEach((inline, i) => {
            p.appendChild(
            renderNode(inline, [...path, "content", i])
            )
        })

        return p
        }


    // ===== INLINE TEXT =====
    if ("type" in node && node.type === "text") {
      const span = document.createElement("span")

      const cursorHere =
        path.length === cursor.path.length &&
        path.every((p, i) => p === cursor.path[i])

      if (cursorHere) {
        const before = node.value.slice(0, cursor.offset)
        const after = node.value.slice(cursor.offset)

        span.append(before)

        const cursorEl = document.createElement("span")
        cursorEl.textContent = ""
        cursorEl.className = "editor-cursor"
        span.append(cursorEl)

        span.append(after)
      } else {
        span.textContent = node.value
      }

      return span
    }

    // ===== INLINE MATH =====
    if ("type" in node && node.type === "math") {
      const span = document.createElement("span")
      span.textContent = node.value
      span.className = "math"
      return span
    }

    return document.createTextNode("")
  }

  root.appendChild(renderNode(state.document))

  // ===== CURSOR STYLE =====
  const styleEl =
    document.getElementById("editor-cursor-style") ||
    document.createElement("style")

  styleEl.id = "editor-cursor-style"
  styleEl.innerHTML = `
    .editor-cursor {
      display: inline-block;
      width: 1px;
      background: black;
      animation: blink 1.2s step-start infinite;
      height: 1em;
      vertical-align: bottom;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }
  `

  document.head.appendChild(styleEl)
}
