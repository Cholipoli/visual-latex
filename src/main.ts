import { createInitialState } from "./editor/editor"
import { render } from "./render/render"

const state = createInitialState()
const root = document.getElementById("editor")!

render(state, root)
