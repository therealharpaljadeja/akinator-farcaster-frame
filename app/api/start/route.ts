import { NextRequest, NextResponse } from "next/server";
import { validateFrameRequest } from "@/utils";
import Akinator from "@/Akinator";
import { regions } from "@/constants/Client";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN as string,
});

export async function POST(req: NextRequest): Promise<Response> {
    // Request from Warpcast
    const body: { trustedData?: { messageBytes?: string } } = await req.json();

    // Check if frame request is valid
    const status = await validateFrameRequest(body.trustedData?.messageBytes);

    if (!status?.valid) {
        console.error(status);
        throw new Error("Invalid frame request");
    }

    const tappedButton = status?.action?.tapped_button.index;

    const aki = new Akinator({ region: regions[tappedButton - 1] });

    let { question, answers } = await aki.start();

    const { fid, username } = status?.action?.interactor;

    await redis.set(fid, aki);

    return new NextResponse(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.HOST}/og?question=${question}" />
            <meta property="og:image" content="${process.env.HOST}/og?question=${question}" />
            <meta property="fc:frame:button:1" content="${answers[0]}" />
            <meta property="fc:frame:button:2" content="${answers[1]}" />
            <meta property="fc:frame:button:3" content="${answers[3]}" />
            <meta property="fc:frame:button:4" content="${answers[4]}" />
            <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/step" />
        </head>
    </html>
`);
}
