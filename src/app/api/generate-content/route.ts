import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, categories, tags } = await request.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY tidak ditemukan');
      return NextResponse.json(
        { error: 'API key tidak ditemukan' },
        { status: 500 }
      );
    }

    const prompt = `Buat artikel blog dengan judul "${title}". 
    Artikel harus mencakup:
    1. Ringkasan (excerpt) dalam 2-3 kalimat yang menarik dan informatif
    2. Konten artikel yang lengkap dengan beberapa paragraf
    3. 3-5 kategori yang relevan dengan topik (pilih dari: Teknologi, Bisnis, Pemasaran, Desain, Pengembangan Web, UI/UX, SEO, Analitik, E-commerce, Keamanan, Performa, Mobile, Cloud, AI/ML, Blockchain)
    4. 5-8 tags yang relevan dengan topik (pilih dari: Web Development, Frontend, Backend, JavaScript, TypeScript, React, Next.js, Node.js, Python, PHP, WordPress, UI Design, UX Design, Mobile App, API, Database, Security, Performance, SEO, Analytics, Cloud, DevOps, AI, Machine Learning, Blockchain, E-commerce, Marketing, Business, Startup, Technology)

    Berikan output dalam format JSON yang valid dengan struktur berikut:
    {
      "excerpt": "ringkasan artikel",
      "content": "konten artikel lengkap",
      "categories": ["kategori1", "kategori2", "kategori3"],
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
    }

    Pastikan:
    1. Output adalah JSON yang valid
    2. Kategori dan tags yang dipilih sesuai dengan daftar yang tersedia
    3. Tidak ada karakter khusus atau escape character yang tidak perlu
    4. Setiap string menggunakan tanda kutip ganda (")`;

    console.log('Mengirim request ke DeepSeek API...');
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
            content: 'Anda adalah seorang penulis blog profesional yang ahli dalam membuat konten yang informatif dan menarik. Selalu berikan output dalam format JSON yang valid dan bersih.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response dari DeepSeek API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Response dari DeepSeek API:', data);

    try {
      // Bersihkan response content dari karakter yang tidak diinginkan
      const cleanContent = data.choices[0].message.content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const generatedContent = JSON.parse(cleanContent);
      console.log('Parsed content:', generatedContent);

      // Validasi struktur data
      if (!generatedContent.excerpt || !generatedContent.content || !Array.isArray(generatedContent.categories) || !Array.isArray(generatedContent.tags)) {
        throw new Error('Format data tidak lengkap');
      }

      return NextResponse.json({
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        categories: generatedContent.categories,
        tags: generatedContent.tags,
      });
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      return NextResponse.json(
        { error: 'Format response tidak valid. Silakan coba lagi.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error dalam generate-content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal generate konten' },
      { status: 500 }
    );
  }
} 