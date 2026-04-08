const ServerUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!ServerUrl) {
    throw new Error("Missing env: NEXT_PUBLIC_API_BASE_URL is not defined.");
}

export const API_CONFIG = {
    base_url: `${ServerUrl}/api/v1`,
};