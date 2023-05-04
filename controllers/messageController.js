const Messages = require("../models/messageModel");


module.exports.getAllMessages = async (req, res, next) => {
  try {

    const messages = await Messages.find().sort({ updatedAt: 1 });

    const sortedData = messages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(sortedData);
  } catch (ex) {
    next(ex);
  }
};

exports.deleteAll = (req, res) => {
  Messages.deleteMany({})
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

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {

    const { from, to, message, sent_by_client } = req.body;

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      sentByClient: sent_by_client,
    });

    if (data) return res.json({ msg: "Message added successfully." });

    else return res.json({ msg: "Failed to add message to the database" });
    
  } catch (ex) {
    next(ex);
  }
};
