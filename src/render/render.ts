import { EditorState } from "../editor/editor"

export function render(state: EditorState, root: HTMLElement) {
    root.innerHTML = ""

    const cursor = state.cursor

    // on boucle sur les blocs
    for (const [blockIndex, block] of state.document.blocks.entries()) {
        if (block.type === "paragraph") {
            const p = document.createElement("p")

            // on boucle sur les inlines du bloc
            for (const [inlineIndex, inline] of block.content.entries()) {
                if (inline.type === "text") {
                    const span = document.createElement("span")
                    let before = inline.value
                    let after = ""

                    // si c'est l'inline actif, on sépare avant et après le curseur
                    if (blockIndex === cursor.blockIndex && inlineIndex === cursor.inlineIndex) {
                        before = inline.value.slice(0, cursor.offset)
                        after = inline.value.slice(cursor.offset)

                        // création du curseur clignotant
                        const cursorEl = document.createElement("span")
                        cursorEl.textContent = "|" // symbole du curseur
                        cursorEl.style.color = "gray"
                        cursorEl.style.fontWeight = "bold"
                        cursorEl.style.fontSize = "1.2em"
                        cursorEl.style.display = "inline-block"
                        cursorEl.style.animation = "blink 2s step-start infinite"

                        // assemblage du texte + curseur
                        span.append(before)
                        span.append(cursorEl)
                        span.append(after)

                        p.append(span)
                        continue
                    }

                    // si pas de curseur ici
                    span.textContent = before
                    p.append(span)
                }
            }

            root.append(p)
        }
    }

    // animation clignotante directement en JS
    const styleEl = document.getElementById("editor-cursor-style") || document.createElement("style")
    styleEl.id = "editor-cursor-style"
    styleEl.innerHTML = `
        @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
        }
    `
    document.head.appendChild(styleEl)
}
