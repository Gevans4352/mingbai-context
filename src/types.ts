export interface DecodeResult {
  input: string;
  pinyin: string;
  literal: string;
  natural: string;
  tags: string[];
  example: {
    scenario: string;
    usage: string;
    meaning_here: string;
  };
  cultural_context: string;
}