const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        name: name,
        hash: hash,
        email: email,
        id: Date.now()

      })
      .into('users')
      .returning('email')
      // .then(loginEmail => {
      //   return trx('users')
      //     .returning('*')
      //     .insert({
      //       email: loginEmail[0],
      //       name: name
      //     })
      //     .then(user => {
      //       res.json(user[0]);
      //     })
      // })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
