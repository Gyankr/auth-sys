const User = require('../models/user');

//render the sign up page
module.exports.signUp = function(req, res){
  if(req.isAuthenticated()){
    return res.redirect('home');
  }
  return res.render('user_sign_up', {
      title: "Auth-Sys | SignUp"
  });
}

//render the sign in page
module.exports.signIn = function(req, res){
  if(req.isAuthenticated()){
    return res.render('home', {
      title: "Auth-Sys | Home"
  });
  }
  return res.render('user_sign_in', {
      title: "Auth-Sys | SignIn"
  });
}

module.exports.createAccount = async function(req, res){
  try{
    if(req.body.password != req.body.confirm_password){
      return res.redirect('back');
    }  
    let user = await User.findOne({email: req.body.email});
    if(user){
      console.log("user already exists");
      return res.redirect('back');
    }
    else{
      user = new User();
      user.email = req.body.email;
      user.name = req.body.name;
      user.setPassword(req.body.password);
      await user.save();
      return res.render('user_sign_in', {
        title: "Auth-Sys | SignIn"
      }); 
    }
  }catch(err){
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.createSession = function(req, res){
  res.redirect('/');
  // try{
  //   let user = await User.findOne({email: req.body.email});
  //   if(user){
  //     if(user.validPassword(req.body.password)){
  //       console.log("Login successful");
  //       return res.redirect('back');
  //     }
  //     else{
  //       console.log("Incorrect Username/Password");
  //       return res.redirect('back');
  //     }
  //   }
  //   else{
  //     console.log("user doesn't exists");
  //     return res.redirect('back');      
  //   }
  // }catch(err){
  //   console.log(err);
  //   return res.redirect('back');
  // }
}

module.exports.destroySession = function(req, res){
  req.logout();
  return res.redirect('/users/sign-in');
}

module.exports.home = function(req, res){
  return res.render('home', {
    title: "Auth-Sys | Home"
  });
}

module.exports.updatePassword = async function(req, res){
  try{
    if(req.body.new_password != req.body.confirm_password){
      console.log("passwords dont match");
      return res.redirect('back');
    }  
    console.log(req.user.id);
    let user = await User.findById(req.user.id);
    if(user){
      if(user.validPassword(req.body.old_password)){
        user.setPassword(req.body.new_password);
        await user.save();
        console.log("password updated successfully")
      }
      else{
        console.log("incorrect password");
      }
    }
    else{
      console.log("user not found");
    }
    return res.redirect('back');
  }catch(err){
    console.log(err);
    return res.redirect('back');
  }
}
