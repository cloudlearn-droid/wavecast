from flask import Flask

app = Flask(__name__)


@app.route("/")
def health():
    return {"status": "WaveCast backend running"}


if __name__ == "__main__":
    app.run(debug=True)
