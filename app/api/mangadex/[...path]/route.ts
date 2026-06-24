import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];
    const targetPath = pathSegments.join("/");

    // Construct target URL to MangaDex
    const targetUrl = new URL(targetPath, "https://api.mangadex.org");

    // Copy query parameters from local request
    const { searchParams } = new URL(request.url);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    // Fetch from MangaDex with custom User-Agent
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "KidexReader/1.0.0 (contact@kidex.io)",
        "Accept": "application/json",
      },
      next: { revalidate: 30 }, // cache responses for 30s to help stay within rate-limits
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `MangaDex responded with ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error proxying to MangaDex", details: error.message },
      { status: 500 }
    );
  }
}
