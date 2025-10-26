import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// ⚠️ Dán API Key của mày vào đây (key OpenAI, bắt đầu bằng sk-)
const OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Chatwoot sẽ gọi webhook này khi có tin nhắn mới
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body?.content;
    if (!message) return res.sendStatus(200);

    // Gửi nội dung tin nhắn tới ChatGPT
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that always replies in English." },
          { role: "user", content: message }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Gửi lại phản hồi về Chatwoot (ở bản này chỉ log ra console)
    console.log("GPT Reply:", reply);

    // Trả phản hồi cho Chatwoot (hoặc client)
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Error:", err.message);
    return res.sendStatus(500);
  }
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Bot server is running on port ${PORT}`));
