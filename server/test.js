import bcrypt from 'bcryptjs';

bcrypt.hash('Pabbu@123', 12, (err, passwordHash) => {
    if (err) {
        return res.status(500).json({message: "couldnt hash the password"}); 
    } else if (passwordHash) {
        console.log(passwordHash)
    };
});

$2a$12$TDgtPuMvcbikyvu3X/tg6.Qpp.dBGon0Nhnta5GhIKo7omBd4O9Oe

