import { EditorState } from "../editor/editor"

export function render(state: EditorState, root: HTMLElement) {
  root.innerHTML = ""

  for (const block of state.document.blocks) {
    if (block.type === "paragraph") {
      const p = document.createElement("p")

      for (const inline of block.content) {
        if (inline.type === "text") {
          p.append(inline.value)
        }
      }

      root.append(p)
    }
  }
}
