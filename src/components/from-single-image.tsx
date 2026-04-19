import { useState } from "react"
import { useNavigate } from "react-router"
import JSZip from "jszip"
import ImageDropzone from "./image-dropzone"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"

type PreviewFile = File & { preview: string }

const CreateThemeFromSingleImage = () => {
    const navigate = useNavigate()

    const [modifiedImages, setModifiedImages] = useState<PreviewFile[]>([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")

    const createImages = (file: File & { preview: string }) => {
        let brightness = 100
        for (let i = 1; i <= 8; i++) {
            const image = document.createElement("img")
            image.src = file.preview
            const index = i
            const brightnessValue = brightness
            image.onload = () => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")
                if (!ctx) return
                ctx.canvas.width = image.naturalWidth
                ctx.canvas.height = image.naturalHeight
                ctx.filter = "brightness(" + brightnessValue + "%)"
                ctx.drawImage(image, 0, 0)
                canvas.toBlob(blob => {
                    if (!blob) return
                    const modifiedImage = Object.assign(
                        new File([blob], "placeholder_" + index + ".jpg", { type: "image/jpeg" }),
                        { preview: URL.createObjectURL(blob) }
                    ) as PreviewFile
                    setModifiedImages(prev => prev.concat(modifiedImage))
                }, "image/jpeg")
            }
            brightness -= 8
        }
    }

    const createTheme = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const themeName = (event.currentTarget.elements.namedItem("theme-name") as HTMLInputElement).value
        if (modifiedImages.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please upload an image.")
        } else if (themeName.length < 1) {
            setErrorFlag(" visible")
            setErrorText("Please enter a theme name.")
        } else if (!themeName.match("^[a-zA-Z0-9_]*$")) {
            setErrorFlag(" visible")
            setErrorText("Please enter letters, numbers, or underscores only.")
        } else {
            setErrorFlag(" hidden")
            setErrorText("")
            let count = 1
            const zip = new JSZip()
            modifiedImages.forEach(image => {
                const file = new File([image], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            const json = JSON.stringify({
                imageFilename: themeName + "_*.jpg",
                imageCredits: "Created by the .ddw Theme Creator",
                sunriseImageList: [5, 4],
                dayImageList: [3, 2, 1, 1, 1, 2, 3],
                sunsetImageList: [4, 5],
                nightImageList: [6, 7, 8, 8, 8, 7, 6],
            })
            zip.file(themeName + ".json", json)
            AppStore.loadingMessage = "Creating theme..."
            AppStore.loading = true
            zip.generateAsync({ type: "blob" }).then(result => {
                ThemeStore.themeData = result
                ThemeStore.themeName = themeName
                navigate("/result")
            })
        }
    }

    return (
        <form name="form" className="content" onSubmit={createTheme}>
            <div className="content-block">
                Drag your image in or click the "+" button to upload an image. <br />
                A theme will be created for you by modifying the brightness of the image. <br />
                Idea originally implemented by <a className="content-link-text hover-fade" href={"https://github.com/pchalamet"} target="_blank" rel="noopener noreferrer">@pchalamet</a>.
            </div>
            {modifiedImages.length > 0 ? null : (
                <ImageDropzone onDrop={files => { if (files[0]) createImages(Object.assign(files[0], { preview: URL.createObjectURL(files[0]) })) }} />
            )}
            <div className="thumbnail-container minimize">
                {modifiedImages.map(file => (
                    <div className="thumbnail" key={file.preview}>
                        <div className="thumbnail-inner">
                            <img src={file.preview} className="thumbnail-image" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="content-block">
                <input type="text" id="theme-name" name="theme-name" className="content-text-field" placeholder="Name of theme" />
            </div>
            <div className="content-block row">
                <input type="submit" value="Create .ddw file" className="content-button" />
                <span className={"error-text" + errorFlag}>{errorText}</span>
            </div>
            <div className="spacer" />
        </form>
    )
}

export default CreateThemeFromSingleImage
