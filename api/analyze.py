from flask import jsonify
from utils.punctuation import extract_text, count_punctuation, count_words
import pandas as pd
from io import BytesIO
import base64
import os

def handler(request):
    if request.method != "POST":
        return jsonify({"error": "Only POST method allowed"}), 405

    uploaded_file = request.files.get("file")
    if not uploaded_file:
        return jsonify({"error": "No file uploaded"}), 400

    content = extract_text(uploaded_file)
    punctuation = count_punctuation(content)
    word_count = count_words(content)

    result = {
        "filename": uploaded_file.filename,
        "word_count": word_count,
        **punctuation,
    }

    # Save DataFrame CSV in memory
    df = pd.DataFrame([result])
    csv_buffer = BytesIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    os.makedirs("/tmp", exist_ok=True)
    csv_path = "/tmp/punctuation_summary.csv"
    df.to_csv(csv_path, index=False)

    return jsonify(result)
