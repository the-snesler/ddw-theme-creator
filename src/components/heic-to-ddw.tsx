import { useState } from "react"
import { useNavigate } from "react-router"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"
import JSZip from "jszip"
import heic2any from "heic2any"
import { ReactSortable, ItemInterface } from "react-sortablejs"
import HeicDropzone from "./heic-dropzone"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"

type SortableBlob = Blob & { preview: string } & ItemInterface

const ConvertHeicToDdw = () => {
    const navigate = useNavigate()

    const [imageData, setImageData] = useState<SortableBlob[]>([])
    const [extractedThumbnails, setExtractedThumbnails] = useState<SortableBlob[]>([])
    const [sunriseThumbnails, setSunriseThumbnails] = useState<SortableBlob[]>([])
    const [dayThumbnails, setDayThumbnails] = useState<SortableBlob[]>([])
    const [sunsetThumbnails, setSunsetThumbnails] = useState<SortableBlob[]>([])
    const [nightThumbnails, setNightThumbnails] = useState<SortableBlob[]>([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")
    const [hoverFlag, setHoverFlag] = useState(" hover-fade-no-pointer")
    const [heicErrorFlag, setHeicErrorFlag] = useState(" hidden")
    const [dragFlag, setDragFlag] = useState("")

    const extractImages = (file: File) => {
        AppStore.loadingMessage = "Extracting images..."
        AppStore.loading = true
        heic2any({ blob: file, toType: "image/jpeg", multiple: true }).then(result => {
            AppStore.loading = false
            setHeicErrorFlag(" hidden")
            const blobs = Array.isArray(result) ? result : [result]
            const files = blobs.map(blob => {
                const preview = URL.createObjectURL(blob)
                return Object.assign(blob, { preview, id: preview }) as SortableBlob
            })
            setImageData(prev => prev.concat(files))
            setExtractedThumbnails(prev => prev.concat(files))
        }).catch(() => {
            AppStore.loading = false
            setHeicErrorFlag(" visible")
        })
    }

    const createTheme = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const themeName = (event.currentTarget.elements.namedItem("theme-name") as HTMLInputElement).value
        if (dayThumbnails.length === 0 || nightThumbnails.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please assign at least one day and one night image.")
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
            const sunriseImageIndices: number[] = [], dayImageIndices: number[] = [], sunsetImageIndices: number[] = [], nightImageIndices: number[] = []
            const zip = new JSZip()
            if (sunriseThumbnails.length === 0) {
                sunriseImageIndices.push(count)
                const data = imageData.find(data => dayThumbnails[0].preview === data.preview)!
                zip.file(themeName + "_" + count++ + ".jpg", data)
            } else {
                sunriseThumbnails.forEach(thumbnail => {
                    sunriseImageIndices.push(count)
                    const data = imageData.find(data => thumbnail.preview === data.preview)!
                    zip.file(themeName + "_" + count++ + ".jpg", data)
                })
            }
            dayThumbnails.forEach(thumbnail => {
                dayImageIndices.push(count)
                const data = imageData.find(data => thumbnail.preview === data.preview)!
                zip.file(themeName + "_" + count++ + ".jpg", data)
            })
            if (sunsetThumbnails.length === 0) {
                sunsetImageIndices.push(count)
                const data = imageData.find(data => nightThumbnails[0].preview === data.preview)!
                zip.file(themeName + "_" + count++ + ".jpg", data)
            } else {
                sunsetThumbnails.forEach(thumbnail => {
                    sunsetImageIndices.push(count)
                    const data = imageData.find(data => thumbnail.preview === data.preview)!
                    zip.file(themeName + "_" + count++ + ".jpg", data)
                })
            }
            nightThumbnails.forEach(thumbnail => {
                nightImageIndices.push(count)
                const data = imageData.find(data => thumbnail.preview === data.preview)!
                zip.file(themeName + "_" + count++ + ".jpg", data)
            })
            const json = JSON.stringify({
                imageFilename: themeName + "_*.jpg",
                imageCredits: "Created by the .ddw Theme Creator",
                sunriseImageList: sunriseImageIndices,
                dayImageList: dayImageIndices,
                sunsetImageList: sunsetImageIndices,
                nightImageList: nightImageIndices,
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

    const sortableProps = {
        group: "images",
        onChoose: () => { setHoverFlag(""); setDragFlag(" dragging") },
        onUnchoose: () => { setHoverFlag(" hover-fade-no-pointer"); setDragFlag("") },
        ghostClass: "thumbnail-placeholder",
        forceFallback: true as const,
        emptyInsertThreshold: 75,
    }

    const renderThumbnails = (list: SortableBlob[]) =>
        list.map(file => (
            <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.preview}>
                <div className="thumbnail-inner">
                    <img src={file.preview} className="thumbnail-image" />
                </div>
            </div>
        ))

    return (
        <form name="form" className="content" onSubmit={createTheme}>
            <div className="content-block">
                Drag an .heic file into the dropzone, or click the "+" button. <br />
                Then drag the extracted images into their proper categories. <br />
                Not all images must be included, but there must be at least one day image and one night image.
            </div>
            {imageData.length > 0 ? null : <HeicDropzone onDrop={file => { if (file) extractImages(file) }} />}
            <div className={"content-block" + heicErrorFlag}>
                <span className="error-text">Error: There was a problem with the .heic file. Try again or select another file.</span>
            </div>
            <div className="thumbnail-container minimize">
                <ReactSortable list={extractedThumbnails} setList={setExtractedThumbnails} {...sortableProps}>
                    {renderThumbnails(extractedThumbnails)}
                </ReactSortable>
            </div>
            <div className="category-grid">
                <div className="category">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
                    <div className="thumbnail-container">
                        <ReactSortable list={sunriseThumbnails} setList={setSunriseThumbnails} {...sortableProps}>
                            {renderThumbnails(sunriseThumbnails)}
                        </ReactSortable>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
                    <div className="thumbnail-container">
                        <ReactSortable list={dayThumbnails} setList={setDayThumbnails} {...sortableProps}>
                            {renderThumbnails(dayThumbnails)}
                        </ReactSortable>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
                    <div className="thumbnail-container">
                        <ReactSortable list={sunsetThumbnails} setList={setSunsetThumbnails} {...sortableProps}>
                            {renderThumbnails(sunsetThumbnails)}
                        </ReactSortable>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
                    <div className="thumbnail-container">
                        <ReactSortable list={nightThumbnails} setList={setNightThumbnails} {...sortableProps}>
                            {renderThumbnails(nightThumbnails)}
                        </ReactSortable>
                    </div>
                </div>
            </div>
            <div className="content-block">
                <input type="text" id="theme-name" name="theme-name" className="content-text-field" placeholder="Name of theme" />
            </div>
            <div className="content-block row">
                <input type="submit" value="Create .ddw file" className="content-button" />
                <span className={"error-text" + errorFlag}>Error: {errorText}</span>
            </div>
            <div className="spacer" />
        </form>
    )
}

export default ConvertHeicToDdw
