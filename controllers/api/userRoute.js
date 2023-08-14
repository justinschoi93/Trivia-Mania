const router = require('express').Router();
const { User } = require('../../models');

router.post("/newplayer", async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.username,
            password: req.body.password,
        });
        
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.username = newUser.name;
            req.session.logged_in = true;
        });

        console.log('New user created:', newUser);

        res.status(200).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(400).json({ error: "User creation failed." });
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { name: req.body.name } });

        if (!userData) {
            console.log('Incorrect username or password:', req.body.name);
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            console.log('Incorrect password for user:', req.body.name);
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }
        console.log(userData.id)
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
        });

        console.log('User logged in:', userData);

        res.json({ user: userData, message: 'Ready to test your trivia knowledge?!' });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(400).json(err);
    }
});

router.get('/user', async (req, res) => {
    try {
        const userData = await User.findAll();
        res.status(200).json(userData) 
    } catch (err) {
        res.status(500).json(err);
    }
});
// router.post('/logout', (req, res) => {
//     if (req.session.logged_in) {
//         req.session.destroy(() => {
//         res.status(204).end();
//       });
//     } else {
//         res.status(404).end();
//     }
//   });


module.exports = router;