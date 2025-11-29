
const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")

imageForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const file = imageInput.files[0]
    if (!file) return

    try {
        // 1. Get signed URL
        const res = await fetch("/s3Url")
        console.log("GET /s3Url status:", res.status)
        if (!res.ok) {
            const text = await res.text()
            console.error("Backend error body:", text)
            return
        }

        const { url } = await res.json()
        console.log("Signed URL:", url)




        // 2. Upload file to S3
        const uploadResponse = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
        })
        console.log("PUT to S3 status:", uploadResponse.status)
        if (!uploadResponse.ok) {
            console.error("Upload failed")
            return
        }



        // 3. Show uploaded image
        const imageUrl = url.split("?")[0]
        console.log("Image URL:", imageUrl)

        const img = document.createElement("img")
        img.src = imageUrl
        document.body.appendChild(img)
    } catch (err) {
        console.error("JS error:", err)
    }
})