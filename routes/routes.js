const url = require('url');
let fs = require('fs');
var path = require('path');
const User = require('../model/user')
const bcrypt = require('bcryptjs')
var cookie = require('cookie');
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

 requestHandler=(req, res)=>{
    const url = req.url;
    const method = req.method;
    console.log(url,'url')
    var cssPath = path.join(__dirname, '../public', url)


 if (url === '/')
   {
     var cookies = parseCookies(req);
 
if(!cookies.isAuth)
{
      console.log(cookies.isAuth, 'isauth')
       res.statusCode = 302;
   res.setHeader('Location', '/home');
  
       res.end();

}else{
  res.statusCode = 302;
     res.setHeader('Location', '/resturants');
  
       res.end();


}
   }

    else if(url === '/home')
   {
var cookies = parseCookies(req);
 console.log(cookies.isAuth)
 if(!cookies.isAuth)
 {   fs.readFile('./view/register.html', (err,data)=>{

             if(err){
                 console.log(err)
                res.writeHead(404, {'Content-type':'text/plain'});
                res.write('Whoops! File not found!');
             }
             else{
               console.log('read index ')
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                
                res.write(data);
             }
             res.end();
    })
  

 }



    }
   
    else if(url==='/reg' && method==='POST') {
      const body = [];
   
   
      req.on('data', chunk => {
        
        body.push(chunk);
      });
     
      
       req.on('end', () => {
        const  parsedBody = Buffer.concat(body).toString().split('&');

        const name = parsedBody[0].split('=')[1];
        const email = parsedBody[1].split('=')[1];
        const password = parsedBody[2].split('=')[1];
     console.log(parsedBody)
         User.findByEmail(email).then(([user]) =>{
           if(user[0])
           {
             console.log(user[0])
             
                  bcrypt
        .compare(password, user[0].password)
        .then(doMatch=>{
          if(doMatch)
          {  

       res.setHeader('set-cookie', cookie.serialize('isAuth', 'true', {
        expires: new Date(Date.now() + 1000*60*60*24*90)
    }));   res.statusCode = 302;
 

            res.setHeader('Location', '/resturants');
  
            res.end();

          }
          else{
            
            throw new Error('Incorrect Password')
          }
          
        }).catch(err => console.log(err));
           }

           else
           {
  
     bcrypt
    .hash(password, 12)
    .then(hashedPassword=>{
      console.log(hashedPassword)
      const user = new User(name,email,hashedPassword);
      return  user.save()
      
    })
    .then(([rows, fieldData]) => {
      console.log(rows,fieldData)
       res.statusCode = 302;
     res.setHeader('set-cookie', cookie.serialize('isAuth', 'true', {
        expires: new Date(Date.now() + 1000*60*60)
    })); 
     res.setHeader('Location', '/resturants');
  
       res.end();
     })
  
           }
         }).catch(err => {
           console.log(err)
           
           
           });
         
   
      });
      
    }

  
    else if(url === '/resturants'){
 
 var cookies = parseCookies(req);
 console.log(cookie.isAuth)
 if(cookies.isAuth)
 {
     fs.readFile('./view/map.html', (err,data)=>{
          if(err){
                 console.log(err)
                res.writeHead(404, {'Content-type':'text/plain'});
                res.write('Whoops! File not found!');
             }
             else{
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                
                res.write(data);
              
             }
             res.end();
     })

 }
 else{
         res.statusCode = 302;
   res.setHeader('Location', '/home');
  
       res.end();
 }
      
   
  
    }  
      else if(url === '/logout'){
       
    res.setHeader('Set-Cookie', [
    cookie.serialize('isAuth', 'false', {
      maxAge: -1,
      path: '/',
    }),
  ]);
         res.statusCode = 302;
   res.setHeader('Location', '/home');
  
       res.end();
 
    }
    
      else if(req.url.match("\.js$")){
      
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/js"});
        fileStream.pipe(res);
    }
     else if(req.url.match("\.css$")){
      
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    }
   
    else 
    {
        res.writeHead(404, {'Content-type':'text/plain'});
         res.write('Could not found this route!');
        res.end();
    };



}

module.exports = requestHandler;