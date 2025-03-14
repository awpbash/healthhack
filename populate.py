import os
import time
import json
import iris  # Make sure you have the appropriate IRIS driver/package installed
from sentence_transformers import SentenceTransformer

# ---------------------------
# 1. Establish Database Connection
# ---------------------------
username = 'demo'
password = 'demo'
hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
port = '1972'
namespace = 'USER'
CONNECTION_STRING = f"{hostname}:{port}/{namespace}"
conn = iris.connect(CONNECTION_STRING, username, password)
cursor = conn.cursor()
print("Database connection established.")

# ---------------------------
# 2. Load Sentence Transformer Model for Embedding
# ---------------------------
model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')
print("Sentence Transformer model loaded.")

# ---------------------------
# 3. Insert Sample Data into Tables
# ---------------------------

user_id = '129'

# ---- MedicalRecords ----
# Note: The embedding is generated using the model; here we simulate multiple entries.
medical_data = [
    {
        "Symptom": "Diabetes",
        "Diagnosis": "Patient diagnosed with diabetes. Recommend lifestyle modifications and medication management. Recognise hypoglycemic symptoms and high blood sugar levels.",
        "Datetime": "2025-04-01 10:00:00"
    }
]

sql_medical = """
INSERT INTO MedicalRecords (User_ID, Symptom, Diagnosis, Datetime, Embedding)
VALUES (?, ?, ?, ?, ?)
"""

for record in medical_data:
    # Combine symptom and diagnosis text for embedding generation.
    text_to_embed = f"{record['Symptom']} {record['Diagnosis']}"
    # Generate normalized embedding vector and convert to JSON string.
    embedding_vector = model.encode(text_to_embed, normalize_embeddings=True).tolist()
    embedding_json = json.dumps(embedding_vector)
    
    data_medical = (user_id, record["Symptom"], record["Diagnosis"], record["Datetime"], embedding_json)
    cursor.execute(sql_medical, data_medical)
conn.commit()
print("Inserted MedicalRecords data.")

# # ---- Vitals ----
# vitals_data = [
#     ("37.2", "120/80", 72, "2025-03-01 10:05:00"),
#     ("37.1", "120/80", 70, "2025-03-03 09:20:00"),
#     ("37.0", "119/78", 74, "2025-03-05 10:50:00"),
#     ("36.9", "117/75", 68, "2025-03-07 08:00:00"),
#     ("37.2", "121/81", 75, "2025-03-09 09:00:00")
# ]

# sql_vitals = """
# INSERT INTO Vitals (User_ID, Temperature, BloodPressure, PulseRate, Datetime)
# VALUES (?, ?, ?, ?, ?)
# """

# for t, bp, pr, dt in vitals_data:
#     data_vitals = (user_id, float(t), bp, float(pr), dt)
#     cursor.execute(sql_vitals, data_vitals)
# conn.commit()
# print("Inserted Vitals data.")

# # ---- Activity ----
# activity_data = [
#     ("Walking", 45, "2025-03-01 07:00:00"),
#     ("Cycling", 30, "2025-03-02 17:00:00"),
#     ("Yoga", 60, "2025-03-04 06:30:00"),
#     ("Running", 25, "2025-03-06 07:15:00"),
#     ("Swimming", 40, "2025-03-08 08:00:00")
# ]

# sql_activity = """
# INSERT INTO Activity (User_ID, Activity, Duration, Datetime)
# VALUES (?, ?, ?, ?)
# """

# for activity, duration, dt in activity_data:
#     data_activity = (user_id, activity, float(duration), dt)
#     cursor.execute(sql_activity, data_activity)
# conn.commit()
# print("Inserted Activity data.")

# # ---- PastPrompts ----
# past_prompts_data = [
#     ("Asked about common cold symptoms and remedies.", "2025-03-01 08:40:00"),
#     ("Inquired about headache management strategies.", "2025-03-03 09:25:00"),
#     ("Sought advice on sore throat care.", "2025-03-05 10:55:00"),
#     ("Asked about fatigue causes and energy-boosting tips.", "2025-03-07 11:05:00")
# ]

# sql_pastprompts = """
# INSERT INTO PastPrompts (User_ID, Summary, Datetime)
# VALUES (?, ?, ?)
# """

# for summary, dt in past_prompts_data:
#     data_prompt = (user_id, summary, dt)
#     cursor.execute(sql_pastprompts, data_prompt)
# conn.commit()
# print("Inserted PastPrompts data.")

# # ---- Diet ----
# diet_data = [
#     ("Breakfast", 400, "2025-03-01 07:30:00"),
#     ("Lunch", 600, "2025-03-01 12:30:00"),
#     ("Dinner", 800, "2025-03-01 19:00:00"),
#     ("Snack", 200, "2025-03-01 16:00:00"),
#     ("Breakfast", 450, "2025-03-03 07:45:00"),
#     ("Lunch", 650, "2025-03-03 12:45:00"),
#     ("Dinner", 750, "2025-03-03 18:45:00"),
#     ("Snack", 220, "2025-03-03 15:30:00")
# ]

# sql_diet = """
# INSERT INTO Diet (User_ID, Meal, Calories, Datetime)
# VALUES (?, ?, ?, ?)
# """

# for meal, calories, dt in diet_data:
#     data_diet = (user_id, meal, float(calories), dt)
#     cursor.execute(sql_diet, data_diet)
# conn.commit()
# print("Inserted Diet data.")

# ---------------------------
# 4. Close the Database Connection
# ---------------------------
cursor.close()
conn.close()
print("Database connection closed. Initial data inserted successfully.")
