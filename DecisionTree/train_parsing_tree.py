from sklearn.externals import joblib
from sklearn import tree

# X=1 O=2
features = [[0, 0, 0, 0, 1, 0, 0, 0, 0], [2, 1, 0, 0, 1, 0, 0, 0, 0]]
label = [0, 7]

clf = tree.DecisionTreeClassifier()
clf.fit(features, label)

print("Data Value:", 0, 7)
print("Predict Value", clf.predict([[0, 0, 0, 0, 1, 0, 0, 0, 0], [2, 1, 0, 0, 1, 0, 0, 0, 0]]))

joblib.dump(clf, 'data/parsing_tree.pkl')
