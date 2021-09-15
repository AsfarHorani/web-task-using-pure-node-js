const db = require('../database')
module.exports = class User {
     
  constructor( name, email,password) {
    this.id;
    this.name = name;
    
    this.email = email;
    this.password= password

  
  }


   save(){
      return db.execute(    'INSERT INTO users (name, email,password) VALUES (?, ?, ?)',[this.name, this.email, this.password])

  };     

  static findByEmail(email)
  {
 return db.execute(    'SELECT * FROM users WHERE users.email=?',[email])

  }


  
  
}