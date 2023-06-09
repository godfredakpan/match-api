const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const salt = Math.floor(Math.random() * 10);
const Moderators = require("../models/moderatorModel");
const ModeratorUsers = require("../models/moderatorUserModel");
const Favorites = require("../models/favoriteModel");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};



module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password: plainTextPassword  } = req.body;
    // if request body is empty
    let userData = [];

    if (!username || !email || !plainTextPassword )
      return res.json({ msg: "All fields are required", status: false });

      // const userExists = await Promise.all([
      //   await User.findOne({username: username})
      // ]);

      const userExists = [];
    
      for (const resp of userExists) {
        resp && userData.push(resp);
      }
    
      if (userData.length > 0){ 
        res.status(400).send({ message: "User already exist" });
        return;
      }
    
      const hashPassword = await bcrypt.hash(plainTextPassword, salt);
    
      // Create a User
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        about: req.body.about,
        username: req.body.username,
        pass: plainTextPassword,
        password: hashPassword,
      });
    
      // send mail to admin
      // const transporter = nodemailer.createTransport({
      //   host: config.smtp.host,
      //   port: config.smtp.port,
      //   secure: config.smtp.secure, // true for 465, false for other ports
      //   auth: {
      //     user: config.smtp.auth.user,
      //     pass: config.smtp.auth.pass
      //   }
      // });
    
      // const handlebarOptions = {
      //   viewEngine: {
      //     partialsDir: path.resolve('./views/'),
      //     defaultLayout: false,
      //   },
      //   viewPath: path.resolve('./views/'),
      // };
    
      // transporter.use('compile', hbs(handlebarOptions))
    
      // const message = `A new company has been created with the name ${req.body.name} and the admin email is ${req.body.email}. Please login to the admin panel to approve the company.`;
    
      // const mailOptions = {
      //   from: {
      //     name: smtp.default.name,
      //     address: smtp.default.from
      //   },
      //   to: smtp.default.adminMail,
      //   subject: 'New Company Onboarded !',
      //   template: 'mail',
      //   context: { name: 'Admin', message: message }
      // };
      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
    
      user
        .save(user)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(200).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
    } catch (ex) {
      next(ex);
    }
  };


module.exports.updateUser = async (req, res, next) => {
  try {

    const { name, email, age, about, username, password, dob, gender, relationship_status, body_type, hair_color, eye_color, city, avatarImage, height  } = req.body;

    const user = await User.findOne({ _id: req.body.user_id });
    if (!user) return res.json({ msg: "User not found", status: false });

    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;
    if (about) user.about = about;
    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, salt);
    if(password) user.pass = password;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (relationship_status) user.relationship_status = relationship_status;
    if (body_type) user.body_type = body_type;
    if (hair_color) user.hair_color = hair_color;
    if (eye_color) user.eye_color = eye_color;
    if (city) user.city = city;
    if (avatarImage) user.avatarImage = avatarImage;
    if (height) user.height = height;

    await user.save();

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


module.exports.updateCredit = async (req, res, next) => {
  try {
    const { credits, user_id, amount, transaction_id, description } = req.body;

    const user = await User.findOne({ _id: user_id });
    if (!user) return res.json({ msg: "User not found", status: false });

    user.credits = user.credits + credits;

    await user.save();

    const payment = new Payment({
      user: user.name,
      email: user.email,
      amount: amount,
      transaction_id: transaction_id,
      description: description,
      credits: user.credits,
    });

    await payment.save();

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


module.exports.usersPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().select([
      "user",
      "email",
      "amount",
      "transaction_id",
      "description",
      "credits",
      "status",
      "date",
      "_id",
    ]);
    return res.json(payments);
  } catch (ex) {
    next(ex);
  }
};

module.exports.minusCredits = async (req, res, next) => {
  try {
    const { credits, user_id } = req.body;

    const user = await User.findOne({ _id: user_id });

    if (!user) return res.json({ msg: "User not found", status: false });

    user.credits = credits;

    await user.save();

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "about",
      "name",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllGeneralUsers = async (req, res, next) => {
  try {
    const users = await User.find().select([
      "name",
      "email",
      "username",
      "avatarImage",
      "age",
      "about",
      "height",
      "gender",
      "relationship",
      "body_type",
      "pass",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


module.exports.updateModeratorImage = async (req, res, next) => {
  try {

    const body = {
      avatarImage: req.body.image
    }

    const id = req.body.user_id;

    Moderators.findByIdAndUpdate(id, body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Event with id=${id}. Maybe Event was not found!`
        });
      } else res.json({ status: true, msg: "Image updated successfully" });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Event with id=" + id
      });
    });

    // return res.json({ status: true, msg: "Image updated successfully" });

  } catch (ex) {
    next(ex);
  }
};


exports.deleteAll = (req, res) => {
  Moderators.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount}  were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all ."
      });
    });
};


module.exports.moderatorLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const moderator = await ModeratorUsers.findOne({ username });
    if (!moderator)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, moderator.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete moderator.password;
    return res.json({ status: true, moderator });
  } catch (ex) {
    next(ex);
  }
};

module.exports.moderatorCreateUser = async (req, res, next) => {
  try {
    const { username, email, password: plainTextPassword  } = req.body;

    if (!username || !email || !plainTextPassword )
      return res.json({ msg: "All fields are required", status: false });

      const userExists = [];
    
      for (const resp of userExists) {
        resp && userData.push(resp);
      }

      const hashPassword = await bcrypt.hash(plainTextPassword, salt);
    
      // Create a Moderator
      const user = new ModeratorUsers({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        about: req.body.about,
        age: req.body.age,
        avatarImage: req.body.avatarImage,
        height: req.body.height,
        username: req.body.username,
        region: req.body.region,
        appearance: req.body.appearance,
        relationship: req.body.relationship,
        body_type: req.body.body_type,
        gender: req.body.gender,
        password: hashPassword,
      });

    
      user
        .save(user)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllModeratorUsers = async (req, res, next) => {
    try {
      const moderators = await ModeratorUsers.find().select([
        "name",
        "email",
        "username",
        "avatarImage",
        "age",
        "about",
        "height",
        "relationship",
        "body_type",
        "region",
        "appearance",
        "gender",
        "_id",
      ]);
      // sort by date
      moderators.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
      return res.json(moderators);
    } catch (ex) {
      next(ex);
    }
  };

module.exports.moderatorRegister = async (req, res, next) => {
  try {
    const { username, email, password: plainTextPassword  } = req.body;
    // if request body is empty
    if (!username || !email || !plainTextPassword )
      return res.json({ msg: "All fields are required", status: false });

      const userExists = [];
    
      for (const resp of userExists) {
        resp && userData.push(resp);
      }
    
      // if (userData.length > 0){ 
      //   res.status(400).send({ message: "User already exist" });
      //   return;
      // }
    
      const hashPassword = await bcrypt.hash(plainTextPassword, salt);
    
      // Create a Moderator
      const user = new Moderators({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        about: req.body.about,
        age: req.body.age,
        avatarImage: req.body.avatarImage,
        height: req.body.height,
        username: req.body.username,
        region: req.body.region,
        appearance: req.body.appearance,
        relationship: req.body.relationship,
        body_type: req.body.body_type,
        gender: req.body.gender,
        password: hashPassword,
      });

    
      user
        .save(user)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
    } catch (ex) {
      next(ex);
    }
  };

module.exports.getAllModerators = async (req, res, next) => {
  try {
    const moderators = await Moderators.find().select([
      "name",
      "email",
      "username",
      "avatarImage",
      "age",
      "about",
      "height",
      "relationship",
      "body_type",
      "region",
      "appearance",
      "gender",
      "createdAt",
      "_id",
    ]);
    // sort by date
    moderators.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
    return res.json(moderators);
  } catch (ex) {
    next(ex);
  }
};

module.exports.favoriteRegister = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    // if request body is empty
    if (!username || !email )
      return res.json({ msg: "All fields are required", status: false });
      let userData = [];

      const userExists = await Promise.all([
        await Favorites.findOne({email: email, user_id: req.body.user_id}),
      ]);
    
      for (const resp of userExists) {
        resp && userData.push(resp);
      }

      if (userData.length > 0){ 
        res.status(202).send({ message: "User already added to your favorite", status: 202 });
        return;
      }

    
      // Create a favorite
      const user = new Favorites({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        about: req.body.about,
        age: req.body.age,
        id: req.body.id,
        user_id: req.body.user_id,
        avatarImage: req.body.avatarImage,
        height: req.body.height,
        username: req.body.username,
      });

    
      user
        .save(user)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          console.log('err', err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
    } catch (ex) {
      next(ex);
    }
  };

module.exports.getAllFavorites = async (req, res, next) => {
  try {
    
    const favorites = await Favorites.find(({ user_id: req.params.id })).select([
      "name",
      "email",
      "username",
      "avatarImage",
      "age",
      "about",
      "height",
      "relationship",
      "body_type",
      "id",
      "_id",
    ]);
    return res.json(favorites);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
