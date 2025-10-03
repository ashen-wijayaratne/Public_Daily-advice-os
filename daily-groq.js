require("dotenv").config();
const axios = require("axios");
const nodemailer = require("nodemailer");

const generatePrompt = `
You are an elite mental calibration assistant for high-performance individuals.


1. Share one profound mental model, principle, or strategic worldview that reflects higher-order thinking. It should challenge conventional assumptions, expose hidden asymmetries, or reframe how to interpret the day. Express the idea as a sharp, quote-worthy statement followed by a short paragraph that unpacks its meaning and strategic utility in everyday life.

Think like a philosopher-operator. Use concepts from systems thinking, game theory, stoicism, or inversion. Avoid fluff, clichés, or motivational speak — this is for someone who wants to see through noise and act with clarity.

Tone: Stoic. Strategic. Clean. Mentally rich.

Special note, the advice cannot be related to this: "The most powerful constraints are those you impose on yourself, not those imposed by others."
`;

async function generateMessageWithGroq() {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: generatePrompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response.data.choices[0].message.content;

    console.log("✅ Daily OS:\n");
    console.log(content);

    await sendEmail(content); // 
  } catch (err) {
    console.error("❌ Groq API Error:", err.response?.data || err.message);
  }
}

async function sendEmail(content) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Basic formatting cleanup for HTML email
    const htmlContent = (() => {
      const lines = content.trim().split("\n").filter(Boolean);
    
      let title = "";
      let quote = "";
      let explanation = "";
      let isQuoteLine = false;
    
      if (/^1\./.test(lines[0])) {
        title = lines[0].replace(/^1\.\s*/, "").trim();
        lines.shift();
      }
    
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
    
        if (line.startsWith("**") && line.endsWith("**")) {
          quote = line.replace(/\*\*/g, "").trim();
          isQuoteLine = true;
        } else if (line && isQuoteLine && explanation === "") {
          explanation += line;
        } else if (line) {
          explanation += `<br><br>${line}`;
        }
      }
    
      return `
        <div style="background:#f9f9f9; padding:24px 28px; border-radius:14px; box-shadow:0 3px 8px rgba(0,0,0,0.04);">
          <h3 style="margin-top:0; color:#1a1a1a; font-size:1.25em;">${title || "Strategic Insight"}</h3>
          <blockquote style="margin: 1em 0; font-style: italic; font-size: 1.15em; color: #444; border-left: 4px solid #ccc; padding-left: 12px;">
            ${quote}
          </blockquote>
          <p style="font-size:1.05em; color:#333; line-height:1.7; margin-top:1.2em;">
            ${explanation}
          </p>
        </div>
      `;
    })();


    await transporter.sendMail({
      from: `"Daily Advice" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "🧠",
      html: `
        <div style="font-family:Segoe UI, sans-serif; line-height:1.6; max-width:600px; margin:auto; padding:20px;">
          <h2 style="text-align:center; margin-bottom:1.5em;">Daily Advice</h2>
          ${htmlContent}
          <br><hr style="margin-top:2em; border:none; border-top:1px solid #ccc;">
          <p style="font-size:0.85em; color:#999; text-align:center;">Delivered by your personal assistant</p>
          <p style="font-size:0.85em; color:#999; text-align:center;">Advice Powered by llama3-70b</p>
        </div>
      `,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

generateMessageWithGroq();
