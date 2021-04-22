import twitch
from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse
from chat_downloader import ChatDownloader 

app = Flask(__name__)
api = Api(app)

client_id = "ne4n4c0oenxn6zgq2ky3vtvvfowe1b"
client_secret = "1sl2kh3zcyag3k700u8q0wctlw9v0i"

parser = reqparse.RequestParser()

class getTwitchVodChat(Resource):
    def get(self):

        created = []
        msg = []

        url = 'https://www.youtube.com/watch?v=bDhC6JfS1q0'
        chat = ChatDownloader().get_chat(url)       # create a generator
        for message in chat:                        # iterate over messages
            print(chat.format(message))             # print the formatted message
        
        return ({
        })

    parser.add_argument('code')

    def post(self):
        args = parser.parse_args()
        return {"data": args['code']}


api.add_resource(getTwitchVodChat, "/twitch/vod/chat")

@app.route('/')
def home():
    return jsonify({
        "data": "Welcome Home" 
    })

@app.route('/test')
def home2():
    return "App Works test pogchamp!!!"

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="7104")
