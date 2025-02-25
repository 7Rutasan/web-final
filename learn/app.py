from flask import Flask, request, jsonify, render_template
import sys
import io
import traceback

app = Flask(__name__)

@app.route('/')
def index():

    return render_template('learn.html')

@app.route('/run', methods=['POST'])
def run_code():

    data = request.get_json()
    code = data.get('code', '')

    old_stdout = sys.stdout
    redirected_output = io.StringIO()
    sys.stdout = redirected_output

    error = None
    try:
        exec(code, {}) 
    except Exception:
        error = traceback.format_exc()
    finally:
        sys.stdout = old_stdout

    output = redirected_output.getvalue()

    return jsonify({
        "output": output,
        "error": error
    })

if __name__ == '__main__':
    app.run(debug=True)
