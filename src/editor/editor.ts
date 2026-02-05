import { Document } from "../model/document"
import { Cursor } from "../model/cursor"

export type EditorState = {
  document: Document
  cursor: Cursor
}

export function createInitialState(): EditorState {
  return {
    document: {
      blocks: [
        {
          type: "paragraph",
          content: [{ type: "text", value: "" }]
        }
      ]
    },
    cursor: {
      blockIndex: 0,
      inlineIndex: 0,
      offset: 0
    }
  }
}

export function insertChar(state: EditorState, char: string) {
  const block = state.document.blocks[state.cursor.blockIndex]

  if (block.type !== "paragraph") return

  const inline = block.content[state.cursor.inlineIndex]

  if (inline.type !== "text") return

  const before = inline.value.slice(0, state.cursor.offset)
  const after = inline.value.slice(state.cursor.offset)

  inline.value = before + char + after
  state.cursor.offset += 1
  console.log(state.cursor)
}

export function supChar(state: EditorState) {
  const { blockIndex, inlineIndex, offset } = state.cursor

  // 1️⃣ rien à supprimer si curseur au début
  if (offset === 0) return

  const block = state.document.blocks[blockIndex]
  if (block.type !== "paragraph") return

  const inline = block.content[inlineIndex]
  if (inline.type !== "text") return

  const before = inline.value.slice(0, offset - 1)
  const after = inline.value.slice(offset)

  inline.value = before + after
  state.cursor.offset -= 1
}

export function moveCursor(state: EditorState, dir: -1 | 1) {
  const cursor = state.cursor
  const block = state.document.blocks[cursor.blockIndex]

  if (block.type !== "paragraph") return
  const inline = block.content[cursor.inlineIndex]
  if (inline.type !== "text") return

  if (dir === -1 && cursor.offset > 0) {
    cursor.offset--
  }

  if (dir === 1 && cursor.offset < inline.value.length) {
    cursor.offset++
  }
}
