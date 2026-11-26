import pymupdf as fitz
from typing import List, Dict, Any, Optional, Tuple
import os
import re

class PDFPageExtract:
    def __init__(self, page_number: int, width: float, height: float, text: str, blocks: List[Dict[str, Any]]):
        self.page_number = page_number
        self.width = width
        self.height = height
        self.text = text
        self.blocks = blocks

class PDFParserEngine:
    """
    High-precision PDF parsing engine built on PyMuPDF (fitz).
    Extracts text, block-level coordinates, and locates exact bounding boxes [x0, y0, x1, y1]
    for clinical evidence citations.
    """

    @staticmethod
    def extract_document(pdf_path_or_bytes: Any) -> List[PDFPageExtract]:
        """
        Parses a PDF file path or byte stream into structured page extracts.
        """
        if isinstance(pdf_path_or_bytes, (str, os.PathLike)):
            doc = fitz.open(pdf_path_or_bytes)
        elif isinstance(pdf_path_or_bytes, (bytes, bytearray)):
            doc = fitz.open(stream=pdf_path_or_bytes, filetype="pdf")
        else:
            raise ValueError("Unsupported input type for PDFParserEngine. Expected path or bytes.")

        pages: List[PDFPageExtract] = []
        try:
            for page_idx in range(len(doc)):
                page = doc[page_idx]
                width = page.rect.width
                height = page.rect.height
                text = page.get_text("text")

                # Block extraction: [x0, y0, x1, y1, text, block_no, block_type]
                raw_blocks = page.get_text("blocks")
                blocks = []
                for b in raw_blocks:
                    if len(b) >= 5 and b[4].strip():
                        blocks.append({
                            "bbox": [round(b[0], 2), round(b[1], 2), round(b[2], 2), round(b[3], 2)],
                            "text": b[4].strip(),
                            "block_no": b[5] if len(b) > 5 else 0
                        })

                pages.append(PDFPageExtract(
                    page_number=page_idx + 1,
                    width=round(width, 2),
                    height=round(height, 2),
                    text=text,
                    blocks=blocks
                ))
        finally:
            doc.close()

        return pages

    @staticmethod
    def get_full_text(pages: List[PDFPageExtract]) -> str:
        """
        Combines all page texts with clear page boundary markers.
        """
        return "\n\n".join([f"--- [Page {p.page_number}] ---\n{p.text}" for p in pages])

    @staticmethod
    def find_quote_coordinates(
        pdf_path_or_bytes: Any,
        quote: str
    ) -> Optional[Dict[str, Any]]:
        """
        Locates the exact page and bounding box [x0, y0, x1, y1] for a target quote.
        Uses exact substring search with fallback to sentence-level anchor matching.
        """
        if not quote or len(quote.strip()) == 0:
            return None

        clean_quote = " ".join(quote.strip().split())
        
        if isinstance(pdf_path_or_bytes, (str, os.PathLike)):
            doc = fitz.open(pdf_path_or_bytes)
        elif isinstance(pdf_path_or_bytes, (bytes, bytearray)):
            doc = fitz.open(stream=pdf_path_or_bytes, filetype="pdf")
        else:
            return None

        try:
            for page_idx in range(len(doc)):
                page = doc[page_idx]
                page_num = page_idx + 1

                # 1. Search full quote directly
                rects = page.search_for(clean_quote)
                if rects:
                    r = rects[0]
                    # If multiple rectangles (multi-line quote), encompass them
                    x0 = min(box.x0 for box in rects)
                    y0 = min(box.y0 for box in rects)
                    x1 = max(box.x1 for box in rects)
                    y1 = max(box.y1 for box in rects)
                    return {
                        "page": page_num,
                        "bounding_box": [round(x0, 2), round(y0, 2), round(x1, 2), round(y1, 2)],
                        "page_width": round(page.rect.width, 2),
                        "page_height": round(page.rect.height, 2),
                        "match_type": "exact"
                    }

                # 2. Fallback: Search anchor key phrase (first 8-12 words of quote)
                words = clean_quote.split()
                if len(words) > 6:
                    anchor = " ".join(words[:6])
                    rects = page.search_for(anchor)
                    if rects:
                        r = rects[0]
                        return {
                            "page": page_num,
                            "bounding_box": [round(r.x0, 2), round(r.y0, 2), round(r.x1, 2), round(r.y1, 2)],
                            "page_width": round(page.rect.width, 2),
                            "page_height": round(page.rect.height, 2),
                            "match_type": "anchor"
                        }
        finally:
            doc.close()

        return None
