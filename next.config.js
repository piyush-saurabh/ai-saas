/** @type {import('next').NextConfig} */
const nextConfig = {

    // To resolve the "Invalid src prop" error during image generation
    images: {
        domains: [
            "oaidalleapiprodscus.blob.core.windows.net"
        ]
    }
}

module.exports = nextConfig
