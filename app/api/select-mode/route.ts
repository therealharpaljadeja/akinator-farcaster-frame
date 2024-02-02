import { NextRequest, NextResponse } from "next/server";
import { getUserInformation, validateFrameRequest } from "@/utils";

const ErrorResponse = `
<!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://i.ibb.co/30kw1vW/Start-Frame-1.png" />
            <meta property="og:image" content="https://i.ibb.co/30kw1vW/Start-Frame-1.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/select-mode" />
        </head>
    </html>`;

export async function POST(req: NextRequest): Promise<Response> {
    // Request from Warpcast
    const body: { trustedData?: { messageBytes?: string } } = await req.json();

    // Check if frame request is valid
    const status = await validateFrameRequest(body.trustedData?.messageBytes);

    if (!status?.valid) {
        console.error("Status", status);
        return new NextResponse(ErrorResponse);
    }

    let { fid, username } = status?.action?.interactor;

    const userInformation = await getUserInformation(fid);

    if (!userInformation) {
        console.error("userInformation", userInformation);
        return new NextResponse(ErrorResponse);
    }

    const hasUserFollowedMe = userInformation?.viewerContext?.following;

    if (!hasUserFollowedMe) {
        return new NextResponse(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="https://i.ibb.co/dDHSDjN/Start-Frame-5.png" />
                <meta property="og:image" content="https://i.ibb.co/dDHSDjN/Start-Frame-5.png" />
                <meta property="fc:frame:button:1" content="Try Again" />
                <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/select-mode" />
            </head>
        </html>
        `);
    }

    return new NextResponse(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://i.ibb.co/30kw1vW/Start-Frame-1.png" />
            <meta property="og:image" content="https://i.ibb.co/30kw1vW/Start-Frame-1.png" />
            <meta property="fc:frame:button:1" content="🕴️ Characters" />
            <meta property="fc:frame:button:2" content="📺 Objects" />
            <meta property="fc:frame:button:3" content="🦁 Animals" />
            <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/start" />
        </head>
    </html>
`);
}
