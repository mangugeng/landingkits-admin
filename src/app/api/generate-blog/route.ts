import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, categories, tags, prompt } = body;

    console.log('Generating blog content with DeepSeek...');
    console.log('Title:', title);
    console.log('Categories:', categories);
    console.log('Tags:', tags);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah seorang penulis blog profesional yang ahli dalam membuat konten yang informatif dan menarik.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('DeepSeek API Error:', error);
      throw new Error('Gagal mendapatkan respons dari DeepSeek API');
    }

    const data = await response.json();
    console.log('DeepSeek API Response:', data);

    // Parse the content from the response
    const content = data.choices[0].message.content;
    let parsedContent;

    try {
      // Coba ekstrak JSON dari blok kode markdown jika ada
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      
      // Parse JSON
      parsedContent = JSON.parse(jsonContent);
    } catch (error) {
      console.error('Error parsing content:', error);
      // Jika parsing gagal, buat objek JSON yang valid dari content mentah
      parsedContent = {
        excerpt: content.split('\n')[0] || 'Ringkasan artikel...',
        content: content,
        categories: categories || [],
        tags: tags || []
      };
    }

    // Validasi dan pastikan struktur JSON yang benar
    parsedContent = {
      excerpt: parsedContent.excerpt || content.split('\n')[0] || 'Ringkasan artikel...',
      content: parsedContent.content || content,
      categories: Array.isArray(parsedContent.categories) ? parsedContent.categories : categories || [],
      tags: Array.isArray(parsedContent.tags) ? parsedContent.tags : tags || []
    };

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error('Error in generate-blog route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal generate konten' },
      { status: 500 }
    );
  }
} 