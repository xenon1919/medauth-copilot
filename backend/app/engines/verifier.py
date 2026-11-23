from typing import Tuple, Optional
import re

class QuoteVerifier:
    """
    Deterministic Zero-Hallucination Guardrail.
    Verifies that every extracted clinical citation exists verbatim in the source text.
    """
    @staticmethod
    def verify_quote(quote: str, source_text: str) -> Tuple[bool, float]:
        """
        Returns (is_exact_or_fuzzy_match, confidence_score)
        """
        if not quote or not source_text:
            return False, 0.0

        # Direct verbatim substring match
        if quote in source_text:
            return True, 1.0

        # Normalized whitespace match
        clean_quote = re.sub(r"\s+", " ", quote.strip().lower())
        clean_source = re.sub(r"\s+", " ", source_text.strip().lower())

        if clean_quote in clean_source:
            return True, 0.98

        return False, 0.0
