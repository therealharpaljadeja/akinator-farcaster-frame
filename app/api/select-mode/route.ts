import { NextRequest, NextResponse } from "next/server";
import { getUserInformation, validateFrameRequest } from "@/utils";

const ErrorResponse = `
<!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.HOST}/assets/images/select-theme.png" />
            <meta property="og:image" content="${process.env.HOST}/assets/images/select-theme.png" />
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

    console.log(status);

    let { fid, username } = status?.action?.interactor;

    console.log(fid);

    const userInformation = await getUserInformation(fid);

    console.log(userInformation);

    if (!userInformation) {
        console.error("userInformation", userInformation);
        return new NextResponse(ErrorResponse);
    }

    const hasUserFollowedMe =
        userInformation?.result?.user?.viewerContext?.following;

    console.log(fid, hasUserFollowedMe);

    if (!hasUserFollowedMe) {
        return new NextResponse(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${process.env.HOST}/assets/images/follow.png" />
                <meta property="og:image" content="${process.env.HOST}/assets/images/follow.png" />
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
            <meta property="fc:frame:image" content="${process.env.HOST}/assets/images/select-theme.png" />
            <meta property="og:image" content="${process.env.HOST}/assets/images/select-theme.png" />
            <meta property="fc:frame:button:1" content="🕴️ Characters" />
            <meta property="fc:frame:button:2" content="📺 Objects" />
            <meta property="fc:frame:button:3" content="🦁 Animals" />
            <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/start" />
        </head>
    </html>
`);
}
