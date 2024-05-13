import  nlp  from 'compromise';

import { TextSplitter, CharacterTextSplitterParams } from "langchain/text_splitter";


export class CustomTextSplitter
  extends TextSplitter
{
  


  constructor(fields?: Partial<CharacterTextSplitterParams>) {
    super(fields);
  }

  async splitText(text: string): Promise<string[]> {
    // First we naively split the large input into a bunch of smaller ones.
    const doc = nlp(text);
    const sentences = doc.sentences().out('array');
    return sentences;


  }
}