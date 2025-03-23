from flask import send_file, jsonify
import os

def handler(request):
    csv_path = "/tmp/summary.csv"

    if not os.path.exists(csv_path):
        return jsonify({"error": "CSV not found. Please analyze a file first."}), 404

    try:
        return send_file(
            csv_path,
            as_attachment=True,
            download_name="punctuation_summary.csv",
            mimetype="text/csv"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
