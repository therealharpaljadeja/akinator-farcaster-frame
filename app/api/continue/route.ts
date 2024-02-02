import { NextRequest, NextResponse } from "next/server";
import { validateFrameRequest } from "@/utils";
import Akinator, { AkinatorConstructor } from "@/Akinator";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN as string,
});

const ErrorResponse = `
<!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.HOST}/assets/images/select-theme.png" />
            <meta property="og:image" content="${process.env.HOST}/assets/images/select-theme.png" />
            <meta property="fc:frame:button:1" content="Try Again" />
            <meta property="fc:frame:post_url" content="${process.env["HOST"]}/select-mode" />
        </head>
    </html>`;

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
    const { fid, username } = status?.action?.interactor;

    if (tappedButton === 1) {
        // Win

        return new NextResponse(`
        <!DOCTYPE html>
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.HOST}/assets/images/win.png" />
            <meta property="og:image" content="${process.env.HOST}/assets/images/win.png" />
            <meta property="fc:frame:button:1" content="Play Again" />
            <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/select-mode" />
        </head>
    </html>
        `);
    } else if (tappedButton === 2) {
        // Incorrect

        let akiFromRedis: AkinatorConstructor | null = await redis.get(fid);
        console.log("AkiFromRedis", akiFromRedis);

        if (!akiFromRedis) {
            console.error("Status", status);
            return new NextResponse(ErrorResponse);
        }

        const aki = new Akinator(akiFromRedis);
        let { question, answers: nextAnswers } = await aki.continue();

        return new NextResponse(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${process.env.HOST}/og?question=${question}" />
                <meta property="og:image" content="${process.env.HOST}/og?question=${question}" />
                <meta property="fc:frame:button:1" content="${nextAnswers[0]}" />
                <meta property="fc:frame:button:2" content="${nextAnswers[1]}" />
                <meta property="fc:frame:button:3" content="${nextAnswers[3]}" />
                <meta property="fc:frame:button:4" content="${nextAnswers[4]}" />
                <meta property="fc:frame:post_url" content="${process.env["HOST"]}/api/step" />
            </head>
        </html>
    `);
    } else {
        return new NextResponse(ErrorResponse);
    }
}
