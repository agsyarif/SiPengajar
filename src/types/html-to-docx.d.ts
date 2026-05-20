declare module "html-to-docx" {
  interface HTMLtoDOCXOptions {
    pageSize?: { width?: number; height?: number };
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      header?: number;
      footer?: number;
      gutter?: number;
    };
    font?: string;
    fontSize?: number;
    lineHeight?: number;
    table?: { row?: { cantSplit?: boolean } };
    header?: boolean;
    footer?: boolean;
    pageNumber?: boolean;
    skipFirstHeaderFooter?: boolean;
    headerType?: "default" | "first" | "even";
    footerType?: "default" | "first" | "even";
    [key: string]: unknown;
  }
  function HTMLtoDOCX(
    html: string,
    headerHTML: string | null,
    options?: HTMLtoDOCXOptions,
    footerHTML?: string | null
  ): Promise<ArrayBuffer | Blob>;
  export = HTMLtoDOCX;
}
