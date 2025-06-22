from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'DataBase.db')
app.config['SQLACHEMY_TRACK_MODIFICTAIONS'] = False
db = SQLAlchemy(app)

class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    src = db.Column(db.String, nullable=False)
    likes = db.Column(db.Integer)
    description = db.Column(db.String)
    effect = db.Column(db.String)

    def __init__(self, src:str, description:str, effect:str, likes:int=0) -> None:
        self.src = src
        self.description = description
        self.likes = likes
        self.effect = effect

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment_text = db.Column(db.String)
    photo_id = db.Column(db.Integer, db.ForeignKey('photo.id'))

    def __init__(self, comment_text:str, photo_id:int) -> None:
        self.comment_text = comment_text
        self.photo_id = photo_id


@app.route('/')
def index():  # put application's code here
    return render_template('index.html')

@app.route('/api/photos/all')
def getPhotos():
    allPhotos = db.session.query(Photo).all()
    photos_dict = []
    for photo in allPhotos:
        photos_dict.append({
            'src': photo.src,
            'description': photo.description,
            'likes': photo.likes,
            'effect': photo.effect,
            'commentsNumber': db.session.query(Comment).filter_by(photo_id=photo.id).count(),
        })
    return jsonify(photos_dict)

@app.route('/api/photo', methods=['POST'])
def getPhoto():
    src = request.form.get('src').split('/')[-1]
    print(src)
    onephoto = db.session.query(Photo).filter_by(src=src).first()
    print(onephoto)
    comments = db.session.query(Comment).filter_by(photo_id=onephoto.id).all()

    onephoto_dict = {
            'src': onephoto.src,
            'description': onephoto.description,
            'likes': onephoto.likes,
            'effect': onephoto.effect,
            'commentsNumber': db.session.query(Comment).filter_by(photo_id=onephoto.id).count(),
            'comments': [comment.comment_text for comment in comments]
        }
    return jsonify(onephoto_dict)

if __name__ == '__main__':
    app.run()
