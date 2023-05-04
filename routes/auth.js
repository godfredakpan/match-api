
const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  moderatorRegister,
  getAllModerators,
  deleteAll,
  favoriteRegister,
  getAllFavorites,
  getAllGeneralUsers,
  moderatorLogin,
  updateCredit,
  minusCredits,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/login/moderator", moderatorLogin);
router.post("/register", register);
router.post("/createModerator", moderatorRegister);
router.post("/createFavorite", favoriteRegister);
router.get("/allusers/:id", getAllUsers);
router.get("/getAllUsers", getAllGeneralUsers);
router.get("/allFavorite/:id", getAllFavorites);
router.get("/around/:id", getAllModerators);
router.delete("/delete/moderators", deleteAll);
router.post("/setavatar/:id", setAvatar);
router.post("/updateCredit", updateCredit);
router.post("/minusCredit", minusCredits);
router.get("/logout/:id", logOut);

module.exports = router;
