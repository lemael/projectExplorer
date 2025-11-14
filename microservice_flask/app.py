from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def scrape_images(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    images = soup.find_all('img')
    image_urls = []
    for img in images:
        src = img.get('src')
        if src and src.startswith('https://image.schuhe.de/image/upload/'):  # Pour éviter les URLs relatives
            image_urls.append(src)
    return image_urls

@app.route('/scrape-images', methods=['GET'])
def get_images():
    url = 'https://www.schuhe.de/lp/neuheiten-damen'  # Remplace par l'URL que tu veux scraper
    image_urls = scrape_images(url)
    return jsonify({'image_urls': image_urls})


def send_images_to_node(images):
    url = 'http://localhost:3001/images'
    response = requests.post(url, json={'images': images})
    if response.status_code == 200:
        print('Images envoyées avec succès !')
    else:
        print('Erreur lors de l\'envoi des images')

@app.route('/scrape-and-send', methods=['GET'])
def scrape_and_send():
    url = 'https://www.schuhe.de/lp/neuheiten-damen'
    image_urls = scrape_images(url)
    send_images_to_node(image_urls)
    return 'Images envoyées avec succès !'

if __name__ == '__main__':
    app.run(debug=True)