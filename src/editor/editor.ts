// editor/editor.ts

import { baseDocument, DocumentNode, InlineNode } from "../model/document"
import { Cursor } from "../model/cursor"

// ---- utils ----
export function getNodeAtPath(
  root: DocumentNode,
  path: (string | number)[]
): DocumentNode | InlineNode | undefined {
  let node: any = root
  for (let i = 0; i < path.length; i += 2) {
    const key = path[i] as string
    const index = path[i + 1] as number
    if (!node[key] || !Array.isArray(node[key])) return undefined
    node = node[key][index]
  }
  return node
}

// ---- editor state ----
export type EditorState = {
  document: DocumentNode
  cursor: Cursor
}

// ---- initial state ----
export function createInitialState(): EditorState {
  return {
    document: baseDocument,
    cursor: {
      path: ["children", 0,"children", 1, "content", 0], // start at the first text node
      offset: 0
    }
  }
}

// ---- insert char at cursor ----
export function insertChar(state: EditorState, char: string) {
  const node = getNodeAtPath(state.document, state.cursor.path)
  if (!node || node.type !== "text") return

  const before = node.value.slice(0, state.cursor.offset)
  const after = node.value.slice(state.cursor.offset)
  node.value = before + char + after
  state.cursor.offset += 1
}

// ---- delete char before cursor ----
export function supChar(state: EditorState) {
  const node = getNodeAtPath(state.document, state.cursor.path)
  if (!node || node.type !== "text") return

  if (state.cursor.offset === 0) return

  const before = node.value.slice(0, state.cursor.offset - 1)
  const after = node.value.slice(state.cursor.offset)
  node.value = before + after
  state.cursor.offset -= 1
}

// ---- move cursor left/right ----
export function moveCursor(state: EditorState, dir: -1 | 1) {
  const node = getNodeAtPath(state.document, state.cursor.path)
  if (!node || node.type !== "text") return

  if (dir === -1 && state.cursor.offset > 0) {
    state.cursor.offset--
  }

  if (dir === 1 && state.cursor.offset < node.value.length) {
    state.cursor.offset++
  }
}

// ---- move cursor up/down ----
type TextEntry = {
  node: InlineNode & { type: "text" }
  path: (string | number)[]
}

function collectTextNodes(
  node: DocumentNode,
  basePath: (string | number)[] = []
): TextEntry[] {
  const result: TextEntry[] = []

  if ("content" in node && node.content) {
    node.content.forEach((inline, i) => {
      if (inline.type === "text") {
        result.push({
          node: inline,
          path: [...basePath, "content", i]
        })
      }
    })
  }

  if (node.children) {
    node.children.forEach((child, i) => {
      result.push(
        ...collectTextNodes(child, [...basePath, "children", i])
      )
    })
  }

  return result
}
function pathsEqual(a: (string | number)[], b: (string | number)[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}
export function moveCursorVertical(state: EditorState, dir: -1 | 1) {
  const texts = collectTextNodes(state.document)
  if (texts.length === 0) return

  const currentIndex = texts.findIndex(t =>
    pathsEqual(t.path, state.cursor.path)
  )

  if (currentIndex === -1) return

  const nextIndex = currentIndex + dir
  if (nextIndex < 0 || nextIndex >= texts.length) return

  state.cursor.path = [...texts[nextIndex].path]
  state.cursor.offset = 0
}

