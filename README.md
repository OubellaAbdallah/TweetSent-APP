
<!-- <img width="917" height="613" alt="image" src="https://github.com/user-attachments/assets/f9ff877b-5492-4440-b771-7be96070e16d" /> -->
```mermaid
graph TD
    subgraph "Flux Utilisateur"
        U[Utilisateur]
        App[Application Web]
    end

    subgraph "Système Central"
        S[Serveur]
    end

    subgraph "Analyse & Modèle"
        T[Traitement des tweets]
        M(Modèle DistilBERT)
    end

    subgraph "Source de Données Externe"
        API(Twikit API)
        X[La plateforme X]
    end

    %% --- Définition des connexions ---

    %% Flux 1: Utilisateur <-> App
    U -- Requête --> App
    App -- Résultats --> U

    %% Flux 2: App <-> Serveur
    App <--> S

    %% Flux 3: Serveur <-> API (Récupération)
    S <-->|"Tweets [JSON]"| API
    API <-->|"Tweets [JSON]"| X

    %% Flux 4: Serveur <-> Traitement (Prétraitement)
    S -- "Tweets [JSON]" --> T
    T -- "tokens [CLS]" --> S

    %% Flux 5: Serveur <-> Modèle (Prédiction)
    S -- "tokens [CLS]" --> M
    M -- Prédictions --> S
```
<h1>TweetSent-APP</h1>

![93917cf8a7e64d319a822fd21e68d1c7](https://github.com/user-attachments/assets/6a6a6f9b-678e-4df3-958a-017a07fa2695)
![d981a3f628e34f7794c36d75c3135c28](https://github.com/user-attachments/assets/0999ff68-5838-467e-b93e-d00bf014cb81)
<img width="776" height="648" alt="app9" src="https://github.com/user-attachments/assets/d869e58b-c916-475a-b4c5-2c6dcc1fea15" />
<img width="1241" height="646" alt="app7" src="https://github.com/user-attachments/assets/0a074bfc-5544-468b-9b23-25ce2d921a60" />
<img width="784" height="534" alt="app8" src="https://github.com/user-attachments/assets/c89555a3-0952-4f58-86d1-da7e6f4fab01" />


<p align="center">

<img width="100" height="50" alt="logo2" src="https://github.com/user-attachments/assets/0d37becf-9704-464d-99a6-3c01104496ef" />

</p>

A web application for real-time sentiment analysis of tweets and text using a high-performance DistilBERT model.

TweetSent-APP is an end-to-end solution designed to interpret online conversations. It leverages a fine-tuned an AI model (DistilBERT) to analyze the sentiment of tweets and user-provided text, achieving 98% accuracy.

🚀 Features

Free Text Analysis: Analyze any text pasted into the application to get a detailed sentiment breakdown.

Twitter Hashtag Analysis: Enter a hashtag to pull and analyze recent tweets in real-time.

Detailed Results:

Overall Sentiment: Clear classification (Positive, Negative, Neutral) with a confidence score.

Sentiment Distribution: Visual breakdown of sentiment percentages.

Word Cloud: A dynamic word cloud showing the most frequent terms.

Key Sentiment Drivers: Highlights the specific words that influenced the sentiment score.

Individual Tweet List: See the text and score for each analyzed tweet.

🛠️ Tech Stack

Frontend: HTML5, CSS3, JavaScript, JQuery, AJAX

Backend: Python (Flask)

Sentiment Analysis Model: Fine-tuned DistilBERT (from Hugging Face Transformers) with 98% accuracy.

Model Training: TensorFlow / Keras

Twitter Data: Twikit (to access Twitter/X data without the official paid API)

Data Visualization: Matplotlib (for word clouds) & Chart.js (or similar, for distribution bars)

⚙️ Installation & Setup

Clone the repository:

git clone [https://github.com/OubellaAbdallah/TweetSent-APP.git](https://github.com/OubellaAbdallah/TweetSent-APP.git)
cd TweetSent-APP


Set up the Backend (Python Environment):

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies from your requirements file
pip install -r requirements.txt


(Note: requirements.txt should include tensorflow, transformers, flask, twikit, langdetect, nltk, matplotlib, wordcloud, etc., as per Annexe B).

Environment Setup (Twikit Authentication):
This project uses Twikit which requires an authenticated cookie file to function.

Log in to X (Twitter) in a browser.

Export your browser cookies into a file named cookies.json.

Place the cookies.json file in the root of your backend directory (where the script will load it).

Run the application:

Run the backend Flask server:

flask run
# or
python app.py


Open the index.html (or equivalent) frontend file in your browser, or navigate to the URL provided by Flask (e.g., http://127.0.0.1:5000).

Usage

After starting the application:

For Text Analysis:

Go to the "Text Analysis" tab.

Paste your text into the text area.

Click "Analyze Sentiment".

View the results (overall sentiment, key drivers, distribution).

For Twitter Analysis:

Go to the "Twitter Hashtag Analysis" tab.

Enter a hashtag (e.g., #AI).

Click "Search".

View the aggregated results (word cloud, sentiment counts) and the individual tweet breakdown.

🤝 Contributing

Contributions are welcome! If you'd like to help improve this project, please feel free to fork the repository and submit a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.

(Note: If you haven't added a LICENSE file, you should! You can easily add one on GitHub.)
