# HealthHack: Pocket Missy

<img src="krr/assets/images/app_logo.png"  width="300" />

Welcome to **Pocket Missy**, our innovative one-stop shop app designed to transform healthcare delivery for Singapore’s ageing population. By consolidating all essential healthcare services into a single platform, our solution leverages cutting-edge digital tools—such as IRIS database vector search and Retrieval-Augmented Generation (RAG) for prompt engineering—to empower seniors and healthcare providers with real-time health data, personalized insights, and AI-driven advice.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement & Context](#2-problem-statement--context)
3. [Our Approach](#3-our-approach)
4. [Key Features](#4-key-features)
5. [Architecture & Workflow](#5-architecture--workflow)
6. [Setup & Installation](#6-setup--installation)

---

## 1. Overview

With ageing populations on the rise and a growing need for proactive, value-based healthcare, Singapore’s healthcare landscape is rapidly evolving. **Pocket Missy** is our pioneering solution that integrates all essential health services into one unified platform. By harnessing advanced digital technologies—including IRIS vector search for efficient data retrieval and RAG for prompt engineering—our app delivers real-time insights and personalized advice, bridging gaps in care continuity while reducing costs and improving patient outcomes.

---

## 2. Problem Statement & Context

### Challenges Addressed:

1. **Fragmentation of Healthcare Apps:**  
   Too many disjointed healthcare apps make it challenging for users to manage their health effectively.

2. **Underreporting Among the Elderly:**  
   Seniors often underreport critical health events due to forgetfulness or complex app navigation, leading to gaps in care.

## 3. Our Approach

Our solution directly tackles these challenges through:

- **Unified Platform:**  
  A one-stop shop app where users log vitals, activities, and diet in a single interface—eliminating the need for multiple apps.

- **Personalized Multi-Language Chatbot ("Ask Missy"):**  
  A medical-tuned, AI-powered chatbot that accesses personal health records to deliver tailored advice. For instance, it can flag critical events like a persistent cough in patients with a history of lung cancer or log falls automatically for clinician review.

- **Data-Driven Insights & AI Analytics:**  
  Leveraging advanced AI, our platform processes sensor data and user inputs to monitor consumption and fitness patterns, providing personalized recommendations and enabling proactive care.

- **Advanced Data Retrieval Using IRIS & RAG:**  
  We use vector search in our IRIS database combined with Retrieval-Augmented Generation (RAG) to prompt engineer our requests to Azure OpenAI—ensuring that responses are contextually relevant and data-driven.

---

## 4. Key Features

- **Comprehensive Health Dashboard:**  
  View real-time vitals, activity logs, diet information, and medical records in one place.

- **"Ask Missy" Chatbot:**  
  - **Symptom Checker:** Analyzes symptoms using historical health data.
  - **Medical Summary:** Retrieves and synthesizes vitals and activity data.
  - **Treatment Recommendations:** Offers tailored advice based on individual health profiles.
  - **General Health Queries:** Supports multi-language conversations for accessible health information.

- **AI-Driven Data Embedding:**  
  Utilizes the SentenceTransformer model (`pritamdeka/S-PubMedBert-MS-MARCO`) to generate embeddings for medical records, enhancing search and retrieval capabilities.

- **Proactive Health Monitoring:**  
  Automatically logs critical health events and integrates multiple data sources to reduce underreporting and ensure comprehensive data is available to healthcare providers.

---

## 5. Architecture & Workflow

### Architecture

<img src="krr/assets/images/Architecturev2.jpg"  width="100%" />

Powered by<br/>
<img src="krr/assets/images/tech stackv2.png"  width="300" />

- **Frontend (React Native - Typescript):** 

  Delivers the mobile interface for the health dashboard and chatbot.

- **Backend (Flask - Python):** 

  Provides RESTful API endpoints to interact with the IRIS database and Azure OpenAI.

- **Database (IRIS):**

  Stores user data across tables: MedicalRecords, Vitals, Activity, PastPrompts, and Diet.  
  Utilizes vector search to support efficient data retrieval and prompt engineering.

- **Embedding Service (pritamdeka/S-PubMedBert-MS-MARCO):**

  Generates semantic embeddings using SentenceTransformer for advanced natural language processing.

### Workflow

# TO ADD FULL VIDEO FOR FRONTEND HERE
# ADD VIDEO FOR LOGGER HERE
1. **Logger:**  
   Users save sensor data, logs and any information about their health they wish to store here. The saved data is sent to the backend for updating.

2. **Backend Vector Embeddings:**
   The backend embeds all unstructured data into vector embeddings before updating the IRIS Intersystems RAG Database.

# ADD VIDEO FOR MISSY CHAT HERE
3. **RAG and AI-Powered Insights using OpenAI:**
   When chatting with Missy, users will be sending prompts for any of the 4 prompt modes:
      - **Symptom Checker:** Retrieves past symptoms in logs using the vector search from IRIS Intersystems database that are most relevant to enrich the full fine-tuned prompt that generates in-depth analysis of their symptoms and possible diagnoses for users.
      - **Medical Summary:** Retrieves and synthesizes historical vitals and activity data from the IRIS Intersystems database to build a fine-tuned prompt outlining the users' current general health based on their previous logs.
      - **Treatment Recommendations:** Offers tailored advice on treatment options based on individual health profiles.
      - **General Health Queries:** Supports multi-language conversations for accessible health information.

---

## 6. Setup & Installation
### 1. Clone the Repository
```bash
git clone https://github.com/awpbash/healthhack.git
cd healthhack
```
### 2. Installing depandencies
```bash
pip install -r requriements.txt
```

### 3. Running backend
```bash
python database.py

# populating database
python populate.py
```

### 4. Running Frontend
```bash
cd krr
# Add Azure API key
npm run android or npm run ios
```
