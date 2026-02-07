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
      path: ["children", 0,"children", 0, "content", 0], // start at the first text node
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


export function moveCursorVertical(state: EditorState, dir: -1 | 1) {
  //TODO: implement me!
}
