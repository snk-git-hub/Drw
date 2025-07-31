from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import google.generativeai as genai

genai.configure(api_key="AIzaSyDknpmFwmNDEnPixxayAs8VVcr0T_DP9rU")
model = genai.GenerativeModel("gemini-2.0-flash")

app = Flask(__name__)
CORS(app)

@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        data = request.get_json()
        image_data = data.get("imageData")
        user_specific_prompt = data.get("prompt", "")

        if not image_data:
            return jsonify({"error": "No imageData provided"}), 400

        base_instructions = """
        You are an expert in vision, math, science, handwriting, code, and analysis. Carefully examine the visual content provided and respond based on what it shows:

        - If it contains written text: summarize or interpret it.
        - If it includes a math problem: provide only the final answer. If something is unclear, ask a precise question.
        - If it's a chart or graph: explain the key trends or data insights.
        - If it shows a diagram: describe the components and what they represent.
        - If it contains handwriting: transcribe it clearly.
        - If it's code: explain what it does or debug it.
        - If it's a visual scene: describe it clearly.
        - If it includes a question (e.g., ending with '?' or '='), provide only the answer.

        Be concise and accurate. Provide direct results where possible. Ask for clarification only if absolutely necessary.
        """

        prompt = f"{base_instructions}\n\nUser's specific request: {user_specific_prompt}" if user_specific_prompt else base_instructions

        header, encoded = image_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes))

        contents = [image, prompt]
        response = model.generate_content(contents)

        return jsonify({"response": response.text})

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
