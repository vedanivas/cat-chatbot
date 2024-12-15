import requests
import json

from dotenv import load_dotenv
import os

load_dotenv()

CAT_API_KEY = os.getenv("CAT_API_KEY")

with open('cat_data.json', 'r') as f:
    cat_data = json.load(f)


def get_cat_images(breed, count):
    if breed.lower() not in cat_data:
        return f"Couldn't find breed {breed}"
    
    breed_id = cat_data[breed.lower()]

    url = f"https://api.thecatapi.com/v1/images/search?limit={count}&breed_ids={breed_id}&api_key={CAT_API_KEY}"
    response = requests.get(url=url)

    if response.status_code == 200:
        data = response.json()
        image_urls = [d["url"] for d in data]
        if count == 1:
            return f"Here is the URL of the image of a {breed} cat: {image_urls[0]}"
        else:
            return f"Here are the URLs of the images of {count} {breed} cats: {', '.join(image_urls)}"
    else:
        return f"Failed to retrieve images for breed {breed}"

def get_output(tool_call):
    args = json.loads(tool_call.function.arguments)
    breed, count = args['breed'], args['count']
    url = get_cat_images(breed, count)

    return {
        'tool_call_id': tool_call.id,
        'output': url
    }