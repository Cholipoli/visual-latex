// model/cursor.ts
export type Cursor = {
  path: (string | number)[]   // e.g., ["children", 0, "content", 0]
  offset: number              // cursor position inside a text node
}