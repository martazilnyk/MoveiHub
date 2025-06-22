import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, conversationHistory } = await request.json();

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Prepare conversation context
    const systemPrompt = `Anda adalah MoveiBot, asisten AI untuk website MoveiHub yang fokus pada film dan serial TV. 

Peran Anda:
- Membantu pengguna menemukan film dan serial TV berdasarkan preferensi mereka
- Memberikan rekomendasi film dan serial TV yang relevan
- Menjawab pertanyaan tentang dunia hiburan, aktor, sutradara, dan industri film
- Memberikan informasi tentang rating, genre, dan plot film
- Membantu dengan pencarian film berdasarkan kriteria tertentu

Gaya komunikasi:
- Ramah dan membantu
- Berikan jawaban yang informatif namun ringkas
- Gunakan bahasa Indonesia yang natural
- Jika diminta rekomendasi, berikan 3-5 pilihan dengan alasan singkat
- Jika tidak yakin tentang informasi spesifik, sarankan untuk mencari di website MoveiHub

Jangan:
- Memberikan spoiler tanpa diminta
- Membuat informasi palsu tentang film
- Menjawab pertanyaan di luar topik film dan hiburan

Jika pengguna bertanya tentang film atau serial TV yang tidak Anda ketahui, sarankan mereka untuk mencari di website MoveiHub.`;

    // Format conversation history for OpenAI
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0]?.message?.content || 'Maaf, saya tidak dapat memberikan respons saat ini.';

    return NextResponse.json({ response: botResponse });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { 
        response: 'Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat.' 
      },
      { status: 500 }
    );
  }
} 