const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT;
const hbs = exphbs.create();

const sesh = {
    secret: 'secret string',
    store: new SequelizeStore({
        db: sequelize
    }),
};

app.use(session(sesh));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers/index'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now Listening'));
})
