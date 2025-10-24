import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// ✅ Initialize client (like Python genai.configure)
let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export async function generateAIResponse(
  userMessage: string,
  personalityPrompt: string
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash' // ✅ Use same model as Python
    });

    const prompt = `${personalityPrompt}

Người dùng: "${userMessage}"

Trả lời ngắn gọn 1-2 câu, giữ tính cách. Chỉ nội dung trả lời, không giải thích.`;

    console.log('🤖 Calling Gemini...');

    // ✅ Generate content (like Python self.model.generate_content)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Response:', text);
    return text.trim();

  } catch (error) {
    console.error('❌ Gemini error:', error);
    throw error;
  }
}
