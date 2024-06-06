import { BaseDocumentLoader } from 'langchain/document_loaders/base';
import { createWorker } from 'tesseract.js';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import { Document as LangchainDocument } from 'langchain/document';
import * as pdfjsLib from 'pdfjs-dist'; // Importing the entire library to access GlobalWorkerOptions

class CustomPDFLoader extends BaseDocumentLoader {
    async load(): Promise<LangchainDocument<Record<string, any>>[]> {
        throw new Error('Method not implemented.');
    }

    async loadFromFile(filePath: string): Promise<LangchainDocument<Record<string, any>>[]> {
        const pdfBuffer = fs.readFileSync(filePath);
        return this.parse(pdfBuffer, filePath);
    }

    async parse(pdfBuffer: Buffer, filePath: string): Promise<LangchainDocument<Record<string, any>>[]> {
        // Ensure GlobalWorkerOptions is set correctly
       pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.mjs`;

        // const loadingTask = pdfjsLib.getDocument();
        // const pdfDoc = await loadingTask.promise;
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const documents:any = [];

        await loadingTask.promise.then(async pdfDocument => {
            const worker = await createWorker();
    
            const numPages = pdfDocument.numPages;
            for (let i = 0; i < numPages; i++) {
                const page = await pdfDocument.getPage(i + 1);
                const viewport = page.getViewport({ scale: 1.0 });
    
                const canvas = createCanvas(viewport.width, viewport.height);
                const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    
                await page.render({ canvasContext: context as any, viewport }).promise;
    
                const imageBuffer = canvas.toBuffer('image/png');
                const { data: { text } } = await worker.recognize(imageBuffer);
    
                const doc = new LangchainDocument({
                    pageContent: text,
                    metadata: {
                        source: filePath,
                        page: i + 1,
                    }
                });
    
                documents.push(doc);
                await worker.terminate();

        }});
       
        


        return documents;
    }
}

export { CustomPDFLoader };


