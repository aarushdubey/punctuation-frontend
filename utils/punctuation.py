import re
import pandas as pd
from docx import Document
import matplotlib.pyplot as plt
from io import BytesIO

PUNCTUATION_KEYS = [
    "apostrophes", "colons", "commas", "curly_brackets", "double_inverted_commas",
    "ellipses", "em_dashes", "en_dashes", "exclamation_marks", "full_stops",
    "hyphens", "other_punctuation_marks", "question_marks", "round_brackets",
    "semicolons", "slashes", "square_brackets", "vertical_bars"
]

def extract_text(file_stream):
    doc = Document(file_stream)
    return " ".join([p.text for p in doc.paragraphs])

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

def count_punctuation(text):
    return {
        "apostrophes": len(re.findall(r"[\'’]", text)),
        "colons": len(re.findall(r":", text)),
        "commas": len(re.findall(r",", text)),
        "curly_brackets": len(re.findall(r"\{|\}", text)),
        "double_inverted_commas": len(re.findall(r"[“”\"]", text)),
        "ellipses": len(re.findall(r"…", text)) + text.count("..."),
        "em_dashes": len(re.findall(r"—", text)),
        "en_dashes": len(re.findall(r"–", text)),
        "exclamation_marks": len(re.findall(r"!", text)),
        "full_stops": len(re.findall(r"\.", text)) - text.count("..."),
        "hyphens": len(re.findall(r"-", text)),
        "other_punctuation_marks": len(re.findall(r"[*&%$@]", text)),
        "question_marks": len(re.findall(r"\?", text)),
        "round_brackets": len(re.findall(r"\(|\)", text)),
        "semicolons": len(re.findall(r";", text)),
        "slashes": len(re.findall(r"/", text)),
        "square_brackets": len(re.findall(r"\[|\]", text)),
        "vertical_bars": len(re.findall(r"\|", text)),
    }

def analyze_docx(file_stream, filename):
    text = extract_text(file_stream)
    punctuation = count_punctuation(text)
    word_count = count_words(text)
    return {
        "filename": filename,
        "word_count": word_count,
        **punctuation
    }
