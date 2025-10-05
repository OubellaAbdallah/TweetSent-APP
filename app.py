from flask import Flask, render_template, request, jsonify
from model.sentiment import predict_sentiment,preprocess_text
import asyncio
from flask import request, jsonify
from twikit import Client
from wordcloud import WordCloud
import base64
from io import BytesIO
from langdetect import detect
import nltk



nltk.download('opinion_lexicon')
nltk.download('punkt')


from nltk.corpus import opinion_lexicon
from nltk.tokenize import word_tokenize

positive_words = set(opinion_lexicon.positive())
negative_words = set(opinion_lexicon.negative())



app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/main')
def main_page():
    return render_template('main.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        sentiment_class, probabilities = predict_sentiment(text)

        # Tokenize and lower text
        tokens = word_tokenize(text.lower())

        # Select keywords based on the predicted sentiment
        if sentiment_class == 0:  # Negative
            keywords = [w for w in tokens if w in negative_words]
        elif sentiment_class == 2:  # Positive
            keywords = [w for w in tokens if w in positive_words]
        else:  # Neutral
            keywords = []

        label_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
        response = {
            'sentiment': label_map[sentiment_class],
            'confidence': f"{probabilities[sentiment_class]*100:.2f}%",
            'probabilities': {
                'negative': float(probabilities[0]),
                'neutral': float(probabilities[1]),
                'positive': float(probabilities[2]),
            },
            'keywords': keywords if keywords else ["N/A"]
        }
        return jsonify(response)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500


# Async analyzer
async def analyze_hashtag_async(hashtag):
    client = Client('en-US')
    client.load_cookies('cookies.json')
    # await client.login(
    #     auth_info_1= os.getenv("TWITTER_USERNAME"),
    #     auth_info_2= os.getenv("TWITTER_EMAIL"),
    #     password= os.getenv("TWITTER_PASSWORD"),
    #     cookies_file='cookies.json'
    # )
    tweets = await client.search_tweet(hashtag, 'Latest', 20)
    english_tweets = [tweet for tweet in tweets if detect(tweet.full_text) == 'en']

    results = []
    sentiments = []
    words = ''

    for tweet in english_tweets:
        label, probs = predict_sentiment(tweet.full_text)
        sentiments.append(label)
        words += ' ' + preprocess_text(tweet.full_text)
        results.append({
            'text': tweet.full_text,
            'sentiment': ['Negative', 'Neutral', 'Positive'][label],
            'confidence': f"{max(probs) * 100:.2f}%"
        })

    # Word cloud
    wc = WordCloud(width=800, height=400, background_color='white').generate(words)
    buf = BytesIO()
    wc.to_image().save(buf, format='PNG')
    wordcloud_base64 = base64.b64encode(buf.getvalue()).decode()

    avg_sentiment = sum(sentiments) / len(sentiments)

    return results, wordcloud_base64, avg_sentiment

# Flask route
@app.route('/analyze_hashtag', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        print("Received data:", data)

        hashtag = data.get('hashtag', '')
        if not hashtag:
            return jsonify({'error': 'Hashtag missing'}), 400

        # Run async function
        results, wordcloud_base64, avg_sentiment = asyncio.run(analyze_hashtag_async(hashtag))

        return jsonify({
            'tweets': results,
            'wordcloud': wordcloud_base64,
            'avg_sentiment': avg_sentiment
        })
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
