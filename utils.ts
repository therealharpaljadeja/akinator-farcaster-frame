const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function validateFrameRequest(data: string | undefined) {
    if (!NEYNAR_API_KEY) throw new Error("NEYNAR_API_KEY is not set");
    if (!data) throw new Error("No data provided");

    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            api_key: NEYNAR_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            message_bytes_in_hex: data,
            cast_reaction_context: true,
            follow_context: true,
        }),
    };

    return await fetch(
        `${process.env.NEYNAR_HTTP_URL}/v2/farcaster/frame/validate`,
        options
    )
        .then((response) => response.json())
        .catch((err) => console.error(err));
}

export async function getUserInformation(viewerFid: number) {
    if (!NEYNAR_API_KEY) throw new Error("NEYNAR_API_KEY is not set");
    if (!viewerFid) throw new Error("No ViewerFid provided");

    const myFid = 17979;

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            api_key: NEYNAR_API_KEY,
            "content-type": "application/json",
        },
    };

    return await fetch(
        `${
            process.env.NEYNAR_HTTP_URL
        }/v1/farcaster/user?fid=${myFid.toString()}&viewerFid=${viewerFid.toString()}`,
        options
    )
        .then((response) => response.json())
        .catch((err) => console.error(err));
}
