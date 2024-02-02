import { ImageResponse } from "next/og";

export const runtime = "experimental-edge";

export async function GET(request: Request) {
    console.log(import.meta.url);

    const schoolBell = await fetch(
        new URL("./Schoolbell-regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const { searchParams } = new URL(request.url);

    const guess = searchParams.get("guess");
    const guessImage = searchParams.get("guessImage");

    if (guess)
        return new ImageResponse(
            (
                <div tw="flex h-[1000px] items-center justify-center w-[1900px]">
                    <img
                        src={"https://i.ibb.co/qCMPMK2/Start-Frame-2.png"}
                        tw="absolute left-0 top-0 h-[1000px]"
                    />
                    <div tw="flex flex-col w-[75%] h-full items-center text-center justify-center">
                        <h3 tw="text-[64px]">You are thinking about</h3>
                        {guessImage && (
                            <img
                                tw="w-[300px] h-[300px] mt-[40px]"
                                src={guessImage}
                            />
                        )}
                        <h2 tw="text-black text-[96px]">{guess}</h2>
                    </div>
                </div>
            ),
            {
                width: 1900,
                height: 1000,
                fonts: [
                    {
                        name: "SchoolBell",
                        data: schoolBell,
                        weight: 400,
                    },
                ],
            }
        );

    const question = searchParams.get("question");

    return new ImageResponse(
        (
            <div tw="flex h-[1000px] w-[1900px]">
                <img
                    src={"https://i.ibb.co/qCMPMK2/Start-Frame-2.png"}
                    tw="absolute left-0 top-0 h-[1000px]"
                />
                <div tw="flex flex-col w-full h-full items-center text-center justify-center">
                    <h2 tw="text-black text-[96px]">{question}</h2>
                </div>
            </div>
        ),
        {
            width: 1900,
            height: 1000,
            fonts: [
                {
                    name: "SchoolBell",
                    data: schoolBell,
                    weight: 400,
                },
            ],
        }
    );
}
