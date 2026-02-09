// model/document.ts
export type DocumentNode = {
  type: "doc" | "paragraph" | "title" | "subtitle" | "subsubtitle"
  content?: InlineNode[]          // only for blocks that have text
  children?: DocumentNode[]       // all nodes can have children for nesting
}

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "math"; value: string }

export const baseDocument: DocumentNode = {
  type: "doc",
  children: [
    {
      type: "title",
      content: [{ type: "text", value: "Mon Document" }],
      children: [
        {
          type: "subtitle",
          content: [{ type: "text", value: "Un éditeur de texte simple" }],
          children: [
            {
              type: "paragraph",
              content: [{ type: "text", value: "Hello world" }]
            },
            {
              type: "paragraph",
              content: [{ type: "text", value: "Ceci est un éditeur de texte." }]
            }
          ]
        },
        {
          type: "subtitle",
          content: [{ type: "text", value: "Un éditeur de texte simple" }],
          children: [
            {
              type: "paragraph",
              content: [{ type: "text", value: "Hello world" }]
            },
            {
              type: "paragraph",
              content: [{ type: "text", value: "Ceci est un éditeur de texte." }]
            }
          ]
        }

      ]
    }
  ]
}
