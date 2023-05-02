const db = {
  username: "mydevelopmenttest7",
  password: "Ze6kge9yN45ALZv",
  database: "wappy",
  cluster: "cluster0",
};

const uri = `mongodb+srv://${db.username}:${db.password}@${db.cluster}.syofxxg.mongodb.net/${db.database}?retryWrites=true&w=majority`;

module.exports = uri;
