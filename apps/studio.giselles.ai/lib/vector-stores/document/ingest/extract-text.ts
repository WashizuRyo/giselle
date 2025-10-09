import {
	extractPdfText,
	extractText,
} from "@giselle-sdk/document-preprocessor";
import { resolveSupportedDocumentFile } from "../utils";

interface ExtractTextOptions {
	signal?: AbortSignal;
}

interface ExtractTextResult {
	text: string;
	fileType: "txt" | "md" | "pdf";
}

const TEXT_EXTENSION_MAP = {
	".txt": "txt",
	".md": "md",
} as const;

const PDF_EXTENSION = ".pdf";

/**
 * Extract text content from supported document files
 * @param buffer - File content buffer
 * @param fileName - Original file name for type detection
 * @param options - Optional extraction settings
 * @returns Extracted text and file type
 * @throws Error if file type is unsupported
 */
export async function extractTextFromDocument(
	buffer: Buffer,
	fileName: string,
	options?: ExtractTextOptions,
): Promise<ExtractTextResult> {
	const { signal } = options ?? {};

	signal?.throwIfAborted();

	const fileTypeInfo = resolveSupportedDocumentFile({ name: fileName });

	if (!fileTypeInfo) {
		throw new Error(
			`Unsupported file type for text extraction: ${fileName}. Only PDF, TXT, and Markdown files are supported.`,
		);
	}

	const normalizedExtension = fileTypeInfo.extension.toLowerCase();

	if (normalizedExtension === PDF_EXTENSION) {
		const result = await extractPdfText(buffer, { signal });
		const text = result.pages.map((page) => page.text).join("\n\n");
		return {
			text,
			fileType: "pdf",
		};
	}

	const textExtension =
		TEXT_EXTENSION_MAP[normalizedExtension as keyof typeof TEXT_EXTENSION_MAP];

	if (!textExtension) {
		throw new Error(
			`Unsupported file type for text extraction: ${fileName}. Only PDF, TXT, and Markdown files are supported.`,
		);
	}

	const { text } = extractText(buffer, { signal });

	return { text, fileType: textExtension };
}
