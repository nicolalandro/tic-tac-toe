from flask import Flask, render_template, jsonify, request
from sklearn.externals import joblib

# webapp
app = Flask(__name__)

decision_tree = joblib.load('DecisionTree/data/parsing_tree.pkl')


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/decision_tree_for_o', methods=['POST'])
def ai_game_for_O():
    sring_array = request.get_json()
    int_array = list(map(int, sring_array))
    return jsonify(results=str(decision_tree.predict([int_array])[0]))


@app.route('/api/add_feature', methods=['POST'])
def add_feature():
    sring_array = request.get_json()
    int_array = list(map(int, sring_array))
    return jsonify(int_array)


@app.route('/api/add_label', methods=['POST'])
def add_label():
    sring_array = request.get_json()
    int_array = int(sring_array)
    return jsonify(int_array)


if __name__ == '__main__':
    app.run()
