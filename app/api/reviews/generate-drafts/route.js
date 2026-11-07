import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { businessName = 'My Business', tags = [], lang = 'en' } = body;
    const tagStr = tags.length ? tags.join(' and ') : 'exceptional service and quality';

    let drafts = [];
    if (lang === 'hi' || lang === 'hinglish') {
      drafts = [
        `${businessName} me experience bohot hi shaandar tha! Special mention to their ${tagStr}. Staff ka behavior bohot polite tha. 10/10 recommend karunga!`,
        `Best visit at ${businessName}! Ambiance aur ${tagStr} ekdum lajawab tha. Sabhi ko zaroor aana chahiye.`,
        `Outstanding hospitality and great experience! Loved their ${tagStr}. Ekdum 5-star vibe!`
      ];
    } else {
      drafts = [
        `Had a memorable experience at ${businessName}! The ${tagStr} was prepared to absolute perfection. Attentive team and fast service. 5 stars!`,
        `Easily one of the top spots in the area! Everything from the ambiance to their ${tagStr} exceeded expectations. Highly recommend visiting.`,
        `Outstanding service and top-tier hospitality! Loved the ${tagStr}. The staff went out of their way to make us comfortable. Will be back soon!`
      ];
    }

    return NextResponse.json({
      success: true,
      businessName,
      tags,
      drafts
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
