import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { imageDataUrl } = await request.json();

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    console.log('Attempting OpenAI API call...');

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Generate a haiku very specifically based on this image capturing the little details. Make it cute and fun. Return exactly 3 lines separated by newlines, following the 5-7-5 syllable pattern:" 
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 60
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('OpenAI API response received');

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Failed to generate haiku:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate haiku' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; // Optional: Use edge runtime for better performance