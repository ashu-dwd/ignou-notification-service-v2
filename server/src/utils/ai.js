const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const genAi = async (notificationDesc) => {

    const PROMPT = `ROLE:
You are a veteran educator with 20+ years experience simplifying complex announcements. Your specialty is decoding IGNOU notifications.

TASK:
1. SUMMARIZE the given IGNOU notification in:
   - Simple English (Grade 8 level)
   - With relevant emojis (max 5) 
   - Bullet points format(max 10)

2. HINGLISH ROAST (COMPULSORY):
   - 2-3 line funny critique in Hinglish
   - Should mock IGNOU's bureaucracy/late notifications/complex processes
   - Must include Hindi words like "yaar", "bhai", "arre", "wah wah" etc.

3. END WITH:
   "🔍 For details: [IGNOU Official Website](https://www.ignou.ac.in/)"

RULES:
- NEVER reveal you're an AI
- Maintain sarcastic yet helpful tone
- If notification is blank, reply: "Lagta hai IGNOU wale phir se bhool gaye kuch likhna... 🤷‍♂️"
- Roast MUST be in Hinglish - e.g., "Arre bhai! Ye form submit karne ki last date kal thi? IGNOU time machine kab launch kar raha hai?" 

EXAMPLE OUTPUT:
📢 Simplified Notification:
• Assignment submission extended till 30th Nov 🗓️
• Scan copies now accepted 📄
• No need to visit study center 🎉

😂 There is something to laugh at IGNOU: 
"Waah IGNOU waalo! Pehle to reminder bhejna bhool jaate ho, phir extension dete ho... Kya hamare assignments par tumhara bhi 'pending' ka stamp lagta hai? 😜"

🔍 For details: [IGNOU Official Website](https://www.ignou.ac.in/)`;


    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Here is the notification description: ${notificationDesc}`,
        config: {
            maxOutputTokens: 500,
            temperature: 1.2,
            topP: 0.95,
            topK: 40,
            systemInstruction: PROMPT,
            tools: [{ urlContext: {} }],
            promptContext: {
                text: notificationDesc
            }
        },
    });
    console.log(response.text);
    return response.text;
    //console.log(response.candidates[0].urlContextMetadata)
}

// genAi(`The Indira Gandhi National Open University (IGNOU) is pleased to host a Special Guest Lecture on the theme “One Nation, One Election” on 21st May 2025, at the Dr. B. R. Ambedkar Convention Centre, IGNOU, New Delhi.

// The event will be graced by Shri Shivraj Singh Chouhan, Hon’ble Union Minister for Agriculture and Farmers Welfare, Government of India, who will deliver the Keynote Address.

// Shri Sunil Bansal, National General Secretary, Bharatiya Janata Party (BJP), will also address the gathering as a distinguished speaker.

// The programme will commence with the garlanding of Dr. B. R. Ambedkar’s statue, followed by a tree plantation ceremony led by the Hon’ble Union Minister. The main session will include the IGNOU Kulgeet, welcome address by the Vice Chancellor, felicitation of dignitaries, keynote speeches, and an interactive Q&A session.

// This lecture is aimed at fostering meaningful dialogue on electoral reforms and democratic governance in contemporary India.

// All are cordially invited to attend this important national and academic event.

// IGNOU students and the general public may also join the programme via our official social media platforms, including YouTube, Facebook, X (formerly Twitter), Gyan Vani, and Gyan Darshan.`);

module.exports = genAi;