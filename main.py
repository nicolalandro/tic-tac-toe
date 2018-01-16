from flask import Flask, render_template, jsonify
from sklearn.externals import joblib

# webapp
app = Flask(__name__)

decision_tree = joblib.load('DecisionTree/data/parsing_tree.pkl')


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/decision_tree_for_o')
def ai_game_for_O():
    return jsonify(results=str(decision_tree.predict([[0, 0, 0, 0, 1, 0, 0, 0, 0]])[0]))


if __name__ == '__main__':
    app.run()
