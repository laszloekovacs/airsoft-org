import { s3, write, S3Client } from "bun"

export const loader = async () => {

    const s3file = new S3Client({
        accessKeyId: "some_access_key1",
        secretAccessKey: "some_secret_key1",
        bucket: "my-bucket",
        // Make sure to use the correct endpoint URL
        // It might not be localhost in production!
        endpoint: "http://airsoft-seaweedfs-ltepq7-632862-188-36-71-179.traefik.me",
        virtualHostedStyle: true,
    });


    await s3file.write("test.txt", Buffer.from("hello world"))

    return { status: "ok" }
}

export default function S3Page() {

    return (
        <div>
            <p>seems to work </p>
        </div>
    )
}