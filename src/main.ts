import { createInitialState } from "./editor/editor"
import { render } from "./render/render"
import { insertChar } from "./editor/editor"
import { supChar } from "./editor/editor"
import { moveCursor } from "./editor/editor"

const state = createInitialState()
const root = document.getElementById("editor")!



window.addEventListener("keydown", (e) => {
  console.log(e.key)
  if (e.key.length === 1) {
    
    insertChar(state, e.key)
    render(state, root)
  }
  else if (e.key === "Backspace") {
    supChar(state)
    render(state, root)
  }
  else if(e.key === "ArrowLeft") {
    moveCursor(state,-1)
    render(state, root)
  }
  else if(e.key === "ArrowRight") {
    moveCursor(state, 1)
    render(state, root)
  }
})


render(state, root)
