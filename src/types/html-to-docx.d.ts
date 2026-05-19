declare module "html-to-docx" {
  interface HTMLtoDOCXOptions {
    pageSize?: { width?: number; height?: number };
    margins?: { top?: number; bottom?: number; left?: number; right?: number };
    font?: string;
    fontSize?: number;
    lineHeight?: number;
    table?: { row?: { cantSplit?: boolean } };
    [key: string]: unknown;
  }
  function HTMLtoDOCX(
    html: string,
    headerHTML: string | null,
    options?: HTMLtoDOCXOptions
  ): Promise<ArrayBuffer | Blob>;
  export = HTMLtoDOCX;
}
