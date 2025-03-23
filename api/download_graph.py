from flask import send_file, request, jsonify
from utils.punctuation import generate_graph
import pandas as pd
from io import BytesIO
import json

def handler(request):
    if request.method != "POST":
        return jsonify({"error": "Only POST allowed"}), 405

    try:
        data = request.get_json()
        selected = data["selected_marks"]
        df = pd.DataFrame([{
            "filename": data["filename"],
            **data["punctuation_counts"]
        }])

        buf = generate_graph(df, selected)
        return send_file(buf, mimetype="image/png", download_name="graph.png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500
