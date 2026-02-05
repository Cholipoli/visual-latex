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
