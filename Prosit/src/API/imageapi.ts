// getImage.ts
async function getImage(): Promise<Blob | void> {
    try {
        const response: Response = await fetch(
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"
        );
        console.log(response); // Logs the Response object
        const blob: Blob = await response.blob();
        return blob;
    } catch (error) {
        console.error("Error fetching image:", error);
    }
}

export default getImage;