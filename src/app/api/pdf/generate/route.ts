import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log("[PDF Service] Generating itinerary PDF report...");
    return NextResponse.json({ 
      success: true, 
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      size: "245 KB"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
