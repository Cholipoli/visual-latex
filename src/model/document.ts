export type Document = {
  blocks: Block[]
}

export type Block =
  | Paragraph

export type Paragraph = {
  type: "paragraph"
  content: Inline[]
}

export type Inline =
  | Text

export type Text = {
  type: "text"
  value: string
}
