from utils.punctuation import analyze_docx

def handler(request):
    try:
        file = request.files['file']
        result = analyze_docx(file.file, file.filename)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": result
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": { "error": str(e) }
        }
