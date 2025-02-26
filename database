import iris
import time
import os
import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np
import json

# Load a pre-trained sentence transformer model. Output vector size is 384
model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')

def createDatabase():
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
print(cursor)

def createTable():
    MedicalRecords = "MedicalRecords"
    MRtableDefinition = """
    (User_ID VARCHAR(50), 
     Symptom VARCHAR(50), 
     Diagnosis VARCHAR(1000), 
     Datetime VARCHAR(50), 
     Embedding VECTOR(DOUBLE, 768))
    """
    
    Vitals = "Vitals"
    VitalsTableDefinition = """
    (User_ID VARCHAR(50), 
     Temperature FLOAT, 
     BloodPressure VARCHAR(50), 
     PulseRate FLOAT, 
     Datetime VARCHAR(50))
    """
    
    Activity = "Activity"
    ActivityTableDefinition = """
    (User_ID VARCHAR(50), 
     Activity VARCHAR(50), 
     Duration FLOAT, 
     Datetime VARCHAR(50))
    """
    
    PastPrompts = "PastPrompts"
    PastPromptsTableDefinition = """
    (User_ID VARCHAR(50), 
     Summary VARCHAR(1000), 
     Datetime VARCHAR(50))
    """
    #cursor.execute(f"DROP TABLE {MedicalRecords}")
    #cursor.execute(f"DROP TABLE {Vitals}")
    #cursor.execute(f"DROP TABLE {Activity}")
    #cursor.execute(f"DROP TABLE {PastPrompts}")
    # Check if table exists and create if needed
    try:
        cursor.execute(f"CREATE TABLE {MedicalRecords} {MRtableDefinition}")
        cursor.execute(f"CREATE TABLE {Vitals} {VitalsTableDefinition}")
        cursor.execute(f"CREATE TABLE {Activity} {ActivityTableDefinition}")
        cursor.execute(f"CREATE TABLE {PastPrompts} {PastPromptsTableDefinition}")
        print("Tables created successfully.")
    except Exception as e:
        print("Tables already exist or encountered an error:", e)
#createTable()
# Function to embed text
def embed(text):
    return model.encode(text, normalize_embeddings=True) # Convert NumPy array to list for storage

def insertData(table, data):
    """
    Inserts data into the specified table.
    For MedicalRecords, it embeds the Symptom and Diagnosis before inserting.
    """
    try:
        if table == "MedicalRecords" :
            if len(data) < 4:
                raise ValueError("Insufficient fields for MedicalRecords. Requires at least (User_ID, Symptom, Diagnosis, Datetime).")

            user_id, symptom, diagnosis, datetime = data

            # ✅ Create embedding for symptom and diagnosis
            embedded_vector = embed(f"{symptom} {diagnosis}").tolist()  # Convert NumPy array to list
            
            # ✅ Convert to JSON string for storage in SQL
            embedding_json = json.dumps(embedded_vector)  

            # ✅ Prepare SQL insert
            query = f"INSERT INTO {table} (User_ID, Symptom, Diagnosis, Datetime, Embedding) VALUES (?, ?, ?, ?, ?)"
            
            cursor.execute(query, (user_id, symptom, diagnosis, datetime, embedding_json))
        
        else:
            query = f"INSERT INTO {table} VALUES ({', '.join(['?' for _ in data])})"
            cursor.execute(query, data)
        
        print(f"✅ Data inserted into {table} successfully.")
    
    except Exception as e:
        print(f"❌ Error inserting into {table}: {e}")

def queryMedicalRecords(user, prompt):
    """Fetches and prints top 3 rows from the MedicalRecords table based on RAG."""
    #embed the prompt
    prompt_embedding = model.encode(prompt, normalize_embeddings=True).tolist() 
    sql = f"""
    SELECT TOP ? Symptom, Diagnosis, Datetime
    FROM MedicalRecords
    WHERE User_ID = {user}
    ORDER BY VECTOR_DOT_PRODUCT(Embedding, TO_VECTOR(?)) DESC
    """
    cursor.execute(sql, [3, str(prompt_embedding)])
    rows = cursor.fetchall()
    return rows
        
def queryData(table, user):
    """Fetches and prints all rows from a table."""
    sql = f"""
    SELECT * FROM {table}
    WHERE User_ID = {user}
    """
    cursor.execute(sql)
    rows = cursor.fetchall()
    return rows

def insertPrompts(summary, user):
    #embed the summary then insert into PastPrompts
    summary_embedding = model.encode(summary, normalize_embeddings=True).tolist()
    query = f"INSERT INTO PastPrompts (User_ID, Summary, Datetime) VALUES (?, ?, ?)"
    cursor.execute(query, (user, summary, time.strftime('%Y-%m-%d %H:%M:%S')))

# Example insert
data = ('129', 'Cancer', 'Running nose', '2023-09-01')
insertData("MedicalRecords", data)

print(queryMedicalRecords('129', 'Fever'))
insertData("Vitals", ('129', 98.6, '120/80', 72, '2023-09-01'))
insertData("Vitals", ('129', 91.2, '140/70', 92, '2023-09-02'))

print(queryData("Vitals", '129'))
