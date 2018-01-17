import ast

from sklearn.externals import joblib
from sklearn import tree


def read_features_from_file():
    lines = [ast.literal_eval(line.rstrip('\n')) for line in open("training_data/features.ls")]
    return lines


def read_labels_from_file():
    lines = [ast.literal_eval(line.rstrip('\n')) for line in open("training_data/labels.ls")]
    return lines


# X=1 O=2
# features = [[0, 0, 0, 0, 1, 0, 0, 0, 0], [2, 1, 0, 0, 1, 0, 0, 0, 0]]
# label = [0, 7]
features = read_features_from_file()
labels = read_labels_from_file()

clf = tree.DecisionTreeClassifier()
clf.fit(features, labels)

print("Data Value:", 0, 7)
print("Predict Value", clf.predict([[0, 0, 0, 0, 1, 0, 0, 0, 0], [2, 1, 0, 0, 1, 0, 0, 0, 0]]))

joblib.dump(clf, 'data/parsing_tree.pkl')

decision_tree = joblib.load('data/parsing_tree.pkl')
print("Data Value:", 0)
print("Predict Value", decision_tree.predict([[0, 0, 0, 0, 1, 0, 0, 0, 0]]))
