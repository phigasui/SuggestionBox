```sh
cd suggestion
npm install
cd ..
mongod --dbpath db/mongodb --logpath db/mongodb.log --fork
python server.py
```