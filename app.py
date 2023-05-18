from flask import Flask
from views import views

app = Flask(__name__, static_folder="assets")
app.register_blueprint(views)

if __name__ == "__main__":
    app.run(debug = True, port = 8000)