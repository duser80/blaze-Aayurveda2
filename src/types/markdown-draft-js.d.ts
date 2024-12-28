declare module 'markdown-draft-js' {
    export interface MarkdownToDraftOptions {
      preserveNewlines?: boolean;
      blockTypes?: Record<string, string>;
      entityTypes?: Record<string, string>;
    }
  
    export interface DraftToMarkdownOptions {
      preserveNewlines?: boolean;
      blockStyles?: Record<string, string>;
      entityItems?: Record<string, string>;
    }
  
    export function markdownToDraft(
      markdown: string,
      options?: MarkdownToDraftOptions
    ): any;
  
    export function draftToMarkdown(
      draft: any,
      options?: DraftToMarkdownOptions
    ): string;
  
    export default {
      markdownToDraft,
      draftToMarkdown,
    };
  }
  