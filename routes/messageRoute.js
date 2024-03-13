const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

//add

router.post("/", async (req, res) => {
   const newMessage = new Message(req.body);

   try {
      const savedMessage = await newMessage.save();
      const { message, createdAt, sender } = savedMessage;

      // Cập nhật conversation tương ứng
      await Conversation.findByIdAndUpdate(req.body.conversationId, {
         lastMessage: {
            message,
            createdAt,
            senderId: sender,
         },
      });
      res.status(200).send({ success: true, message: savedMessage });
   } catch (err) {
      res.status(500).send({ success: false, message: err.message });
   }
});

router.put("/:id", async (req, res) => {
   try {
      const message = await Message.findById(req.params.id);
      if (!message) {
         throw new Error("Không tìm thấy tin nhắn");
      }

      message.isRecalled = true;
      await message.save();
   } catch (error) {
      console.error("Lỗi khi thu hồi tin nhắn:", error);
   }
});

module.exports = router;
