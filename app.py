from flask import Flask, request, jsonify, session
import psycopg2
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
import random
import os

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
Session(app)

db_host = "localhost"
db_port = "5434"
db_name = "user_db"
db_user = "postgres"
db_password = "Maqsat07112005."

def get_db_connection():
    return psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )

def generate_unique_username():
    adjectives = ["Brave", "Swift", "Clever", "Mighty", "Sharp", "Bold", "Witty"]
    nouns = ["Falcon", "Tiger", "Phoenix", "Wolf", "Eagle", "Panda", "Hawk"]
    return f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(1000, 9999)}"

def create_table():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

create_table()

def is_user_logged_in():
    return "user_id" in session

@app.route("/register", methods=["POST"])
def register():
    if is_user_logged_in():
        return jsonify({"error": "You are already logged in. Please log out before registering a new account."}), 403
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    try:
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password are required!"}), 400
        cur.execute("SELECT * FROM users WHERE email = %s;", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already registered!"}), 400
        username = generate_unique_username()
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING id;",
            (username, email, hashed_password),
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        session["user_id"] = user_id
        session["username"] = username
        return jsonify({"message": "Registration successful!", "username": username, "user_id": user_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/login", methods=["POST"])
def login():
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    try:
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password are required!"}), 400
        cur.execute("SELECT id, username, password FROM users WHERE email = %s;", (email,))
        user = cur.fetchone()
        if not user:
            return jsonify({"error": "Invalid email or password!"}), 401
        user_id, username, hashed_password = user
        if bcrypt.check_password_hash(hashed_password, password):
            session["user_id"] = user_id
            session["username"] = username
            return jsonify({"message": "Login successful!", "username": username, "user_id": user_id}), 200
        else:
            return jsonify({"error": "Invalid email or password!"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    session.pop("username", None)
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/user_status", methods=["GET"])
def user_status():
    if "user_id" in session:
        return jsonify({"logged_in": True, "user_id": session["user_id"], "username": session["username"]}), 200
    else:
        return jsonify({"logged_in": False}), 200

if __name__ == "__main__":
    app.run(debug=True)
