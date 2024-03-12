const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

//add

router.post("/", async (req, res) => {
   const newMessage = new Message(req.body);

   try {
      const savedMessage = await newMessage.save();
      const { message, createdAt, senderId } = savedMessage;

      // Cập nhật conversation tương ứng
      await Conversation.findByIdAndUpdate(req.body.conversationId, {
         lastMessage: {
            message,
            createdAt,
            senderId,
         },
      });
      res.status(200).send({ success: true, message: savedMessage });
   } catch (err) {
      res.status(500).send({ success: false, message: err.message });
   }
});

module.exports = router;
