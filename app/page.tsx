import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Mind Reader Farcaster Frame",
        description: "Mind reading game on Farcaster, follow @harpaljadeja",
        openGraph: {
            title: "Mind Reader Farcaster Frame",
            images: ["https://i.ibb.co/hF6rjk0/Start-Frame.png"],
        },
        metadataBase: new URL(process.env["HOST"] as string),
        other: {
            "fc:frame": "vNext",
            "fc:frame:image": "https://i.ibb.co/hF6rjk0/Start-Frame.png",
            "fc:frame:post_url": `${process.env.HOST}/api/select-mode`,
            "fc:frame:button:1": "Start",
        },
    };
}

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center space-y-4 p-24">
            <h2>Farcaster Frame that can read your mind</h2>
        </main>
    );
}
