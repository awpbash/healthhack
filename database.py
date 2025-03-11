import iris
import time
import os
import json
from flask import Flask, request, jsonify, Blueprint
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

# Create a Blueprint for API routes with prefix '/api'
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Load a pre-trained sentence transformer model.
# Note: The table for MedicalRecords expects a VECTOR of DOUBLE, size 768.
# Adjust the model or table definition if necessary.
model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')

def createDatabase():
    """Establish a connection to the IRIS database."""
    username = 'demo'
    password = 'demo'
    hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
    port = '1972' 
    namespace = 'USER'
    CONNECTION_STRING = f"{hostname}:{port}/{namespace}"
    conn = iris.connect(CONNECTION_STRING, username, password)
    global cursor
    cursor = conn.cursor()
    print("Database connection established")

createDatabase()

def createTables():
    """Attempt to create all four tables. Uncomment if needed."""
    table_defs = {
        "MedicalRecords": """
            (User_ID VARCHAR(50), 
             Symptom VARCHAR(50), 
             Diagnosis VARCHAR(1000), 
             Datetime VARCHAR(50), 
             Embedding VECTOR(DOUBLE, 768))
        """,
        "Vitals": """
            (User_ID VARCHAR(50), 
             Temperature FLOAT, 
             BloodPressure VARCHAR(50), 
             PulseRate FLOAT, 
             Datetime VARCHAR(50))
        """,
        "Activity": """
            (User_ID VARCHAR(50), 
             Activity VARCHAR(50), 
             Duration FLOAT, 
             Datetime VARCHAR(50))
        """,
        "PastPrompts": """
            (User_ID VARCHAR(50), 
             Summary VARCHAR(1000), 
             Datetime VARCHAR(50))
        """,
        "Diet": """
            (User_ID VARCHAR(50),
             Meal VARCHAR(50),
             Calories FLOAT,
             Datetime VARCHAR(50))
        """
    }
    for table, definition in table_defs.items():
        try:
            cursor.execute(f"CREATE TABLE {table} {definition}")
            print(f"Table {table} created successfully.")
        except Exception as e:
            print(f"Table {table} may already exist or encountered an error: {e}")

# Uncomment the following line to create tables on startup if needed.
# createTables()

def embed(text):
    """Embed text using the SentenceTransformer model and return a list."""
    return model.encode(text, normalize_embeddings=True).tolist()

###############################################################################
# Insertion Endpoints
###############################################################################

@app.route('/api/insert/medical', methods=['POST'])
def insert_medical():
    """
    Inserts a record into the MedicalRecords table.
    Expects JSON with keys:
      - User_ID, Symptom, Diagnosis, Datetime
    The endpoint generates an embedding from the combined Symptom and Diagnosis.
    """
    data = request.get_json()
    required_fields = ["User_ID", "Symptom", "Diagnosis", "Datetime"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field {field}"}), 400

    try:
        user_id = data["User_ID"]
        symptom = data["Symptom"]
        diagnosis = data["Diagnosis"]
        datetime_val = data["Datetime"]
        
        # Create embedding from the combined text
        embedded_vector = embed(f"{symptom} {diagnosis}")
        embedding_json = json.dumps(embedded_vector)
        
        query = """
            INSERT INTO MedicalRecords (User_ID, Symptom, Diagnosis, Datetime, Embedding)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query, (user_id, symptom, diagnosis, datetime_val, embedding_json))
        print("Medical record inserted successfully.")
        return jsonify({"status": "success"}), 200

    except Exception as e:
        print(f"Error inserting into MedicalRecords: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/insert/vitals', methods=['POST'])
def insert_vitals():
    """
    Inserts a record into the Vitals table.
    Expects JSON with keys:
      - User_ID, Temperature, BloodPressure, PulseRate, Datetime
    """
    data = request.get_json()
    required_fields = ["User_ID", "Temperature", "BloodPressure", "PulseRate", "Datetime"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field {field}"}), 400

    try:
        query = """
            INSERT INTO Vitals (User_ID, Temperature, BloodPressure, PulseRate, Datetime)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query, (
            data["User_ID"],
            data["Temperature"],
            data["BloodPressure"],
            data["PulseRate"],
            data["Datetime"]
        ))
        print("Vitals record inserted successfully.")
        return jsonify({"status": "success"}), 200

    except Exception as e:
        print(f"Error inserting into Vitals: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/insert/activity', methods=['POST'])
def insert_activity():
    """
    Inserts a record into the Activity table.
    Expects JSON with keys:
      - User_ID, Activity, Duration, Datetime
    """
    data = request.get_json()
    required_fields = ["User_ID", "Activity", "Duration", "Datetime"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field {field}"}), 400

    try:
        query = """
            INSERT INTO Activity (User_ID, Activity, Duration, Datetime)
            VALUES (?, ?, ?, ?)
        """
        cursor.execute(query, (
            data["User_ID"],
            data["Activity"],
            data["Duration"],
            data["Datetime"]
        ))
        print("Activity record inserted successfully.")
        return jsonify({"status": "success"}), 200

    except Exception as e:
        print(f"Error inserting into Activity: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/insert/prompt', methods=['POST'])
def insert_prompt():
    """
    Inserts a prompt summary into the PastPrompts table.
    Expects JSON with keys:
      - User_ID, Summary
    Datetime is added automatically.
    """
    data = request.get_json()
    required_fields = ["User_ID", "Summary"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field {field}"}), 400

    try:
        query = """
            INSERT INTO PastPrompts (User_ID, Summary, Datetime)
            VALUES (?, ?, ?)
        """
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(query, (data["User_ID"], data["Summary"], current_time))
        print("Prompt inserted successfully.")
        return jsonify({"status": "success"}), 200

    except Exception as e:
        print(f"Error inserting into PastPrompts: {e}")
        return jsonify({"error": str(e)}), 500

###############################################################################
# Query Endpoints
###############################################################################

@app.route('/api/medical', methods=['GET'])
def query_medical_records():
    """
    Query MedicalRecords by User_ID and a text prompt.
    Expects query parameters:
      - user: the user ID
      - prompt: the prompt text to embed and compare
    Returns top 3 records ordered by similarity.
    """
    user = request.args.get('user')
    prompt = request.args.get('prompt')
    
    if not user or not prompt:
        return jsonify({"error": "Missing query parameters 'user' and/or 'prompt'."}), 400

    try:
        prompt_embedding = model.encode(prompt, normalize_embeddings=True).tolist()
        sql = """
            SELECT TOP ? Symptom, Diagnosis, Datetime
            FROM MedicalRecords
            WHERE User_ID = ?
            ORDER BY VECTOR_DOT_PRODUCT(Embedding, TO_VECTOR(?)) DESC
        """
        cursor.execute(sql, (3, user, json.dumps(prompt_embedding)))
        rows = cursor.fetchall()
        results = [{"Symptom": row[0], "Diagnosis": row[1], "Datetime": row[2]} for row in rows]
        return jsonify(results), 200

    except Exception as e:
        print(f"Error querying MedicalRecords: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/vitals', methods=['GET'])
def query_vitals():
    """
    Query Vitals by User_ID.
    Expects query parameter:
      - user: the user ID
    Returns all matching rows from the Vitals table.
    """
    user = request.args.get('user')
    if not user:
        return jsonify({"error": "Missing query parameter 'user'."}), 400

    try:
        sql = "SELECT * FROM Vitals WHERE User_ID = ?"
        cursor.execute(sql, (user,))
        rows = cursor.fetchall()
        results = [
            {
                "User_ID": row[0],
                "Temperature": row[1],
                "BloodPressure": row[2],
                "PulseRate": row[3],
                "Datetime": row[4]
            } for row in rows
        ]
        return jsonify(results), 200

    except Exception as e:
        print(f"Error querying Vitals: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/activity', methods=['GET'])
def query_activity():
    """
    Query Activity by User_ID.
    Expects query parameter:
      - user: the user ID
    Returns all matching rows from the Activity table.
    """
    user = request.args.get('user')
    if not user:
        return jsonify({"error": "Missing query parameter 'user'."}), 400

    try:
        sql = "SELECT * FROM Activity WHERE User_ID = ?"
        cursor.execute(sql, (user,))
        rows = cursor.fetchall()
        results = [
            {
                "User_ID": row[0],
                "Activity": row[1],
                "Duration": row[2],
                "Datetime": row[3]
            } for row in rows
        ]
        return jsonify(results), 200

    except Exception as e:
        print(f"Error querying Activity: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/prompts', methods=['GET'])
def query_prompts():
    """
    Query PastPrompts by User_ID.
    Expects query parameter:
      - user: the user ID
    Returns all matching rows from the PastPrompts table.
    """
    user = request.args.get('user')
    if not user:
        return jsonify({"error": "Missing query parameter 'user'."}), 400

    try:
        sql = "SELECT * FROM PastPrompts WHERE User_ID = ?"
        cursor.execute(sql, (user,))
        rows = cursor.fetchall()
        results = [
            {
                "User_ID": row[0],
                "Summary": row[1],
                "Datetime": row[2]
            } for row in rows
        ]
        return jsonify(results), 200

    except Exception as e:
        print(f"Error querying PastPrompts: {e}")
        return jsonify({"error": str(e)}), 500

###############################################################################
# Run the Flask App
###############################################################################

# Register the blueprint so that all routes are under the '/api' prefix.
app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
