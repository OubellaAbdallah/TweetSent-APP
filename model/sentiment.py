import re
import numpy as np
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from transformers import DistilBertTokenizer
import nltk
import tensorflow as tf
from transformers import TFDistilBertModel
import contractions


class BertLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(BertLayer, self).__init__(**kwargs)
        self.bert = TFDistilBertModel.from_pretrained("distilbert-base-uncased")
    
    def call(self, inputs):
        input_ids, attention_mask = inputs
        outputs = self.bert(input_ids, attention_mask=attention_mask)
        return outputs.last_hidden_state[:, 0, :] 



model = tf.keras.models.load_model(
    'model\\bert_best_sentiment_model.h5',
    custom_objects={'BertLayer': BertLayer} 
)



# Setup
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    text = contractions.fix(text)
    text = text.lower()
    text = re.sub(r'http\S+|www\.\S+', '', text)
    text = re.sub(r'@\w+', '', text)
    
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    words = [word for word in text.split()]
    lemmatized = [lemmatizer.lemmatize(word) for word in words]

    return ' '.join(lemmatized)

def bert_tokenize(texts, max_length=128):
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
 
    cleaned_texts = [preprocess_text(text) for text in texts]
  
    encodings = tokenizer(
        cleaned_texts,
        truncation=True,
        padding='max_length',
        max_length=max_length,
        return_tensors='tf'
    )
    return {
        'input_ids': encodings['input_ids'],
        'attention_mask': encodings['attention_mask']
    }


def predict_sentiment(text):
    print('************ text : ',text)
    
    inputs = bert_tokenize([text])  
    
   
    predictions = model.predict({
        'input_ids': inputs['input_ids'],
        'attention_mask': inputs['attention_mask']
    })
    
  
    predicted_class = np.argmax(predictions, axis=1)[0]
    probabilities = tf.nn.softmax(predictions).numpy()[0]
    
    return predicted_class, probabilities