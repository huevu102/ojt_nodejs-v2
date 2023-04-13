require('./config/mongodb');
const express = require('express');
const viewEngine = require('./config/view-engine');
const router = require('./routes/router');
const session = require('express-session');

const agenda = require('./config/agenda');
const Agendash = require('agendash');

const app = express();
const port = 3000;

viewEngine(app);
app.use(express.json());                                // for parsing application/json
app.use(express.urlencoded({ extended: true }));        // for parsing application/x-www-form-urlencoded

app.use(session({
    secret: 'Arbitrage-Dev-Training',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24*3600*1000 },
    name: 'Arbitrage-Dev-Training-' + port
}));

router(app);
app.use('/dash', Agendash(agenda));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
