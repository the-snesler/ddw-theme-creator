import { useState } from "react"
import { FiSunrise, FiSun, FiSunset, FiMoon, FiX } from "react-icons/fi"
import JSZip from "jszip"
import { useNavigate } from "react-router"
import { ReactSortable, ItemInterface } from "react-sortablejs"
import ImageDropzone from "./image-dropzone"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"

type SortableFile = File & { preview: string } & ItemInterface

const CreateThemeFromImageSet = () => {
    const navigate = useNavigate()

    const [imageData, setImageData] = useState<SortableFile[]>([])
    const [sunriseThumbnails, setSunriseThumbnails] = useState<SortableFile[]>([])
    const [dayThumbnails, setDayThumbnails] = useState<SortableFile[]>([])
    const [sunsetThumbnails, setSunsetThumbnails] = useState<SortableFile[]>([])
    const [nightThumbnails, setNightThumbnails] = useState<SortableFile[]>([])
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")
    const [hoverFlag, setHoverFlag] = useState(" hover-fade-no-pointer")
    const [dragFlag, setDragFlag] = useState("")

    const makeFiles = (files: File[]): SortableFile[] =>
        files.map(file => {
            const preview = URL.createObjectURL(file)
            return Object.assign(file, { preview, id: preview }) as SortableFile
        })

    const createTheme = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const themeName = (event.currentTarget.elements.namedItem("theme-name") as HTMLInputElement).value
        if (sunriseThumbnails.length === 0 || dayThumbnails.length === 0 || sunsetThumbnails.length === 0 || nightThumbnails.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please provide at least one image for each category.")
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
            sunriseThumbnails.forEach(thumbnail => {
                sunriseImageIndices.push(count)
                const data = imageData.find(data => thumbnail.preview === data.preview)!
                const file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            dayThumbnails.forEach(thumbnail => {
                dayImageIndices.push(count)
                const data = imageData.find(data => thumbnail.preview === data.preview)!
                const file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            sunsetThumbnails.forEach(thumbnail => {
                sunsetImageIndices.push(count)
                const data = imageData.find(data => thumbnail.preview === data.preview)!
                const file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
            })
            nightThumbnails.forEach(thumbnail => {
                nightImageIndices.push(count)
                const data = imageData.find(data => thumbnail.preview === data.preview)!
                const file = new File([data], themeName + "_" + count++ + ".jpg", { type: "image/jpeg" })
                zip.file(file.name, file)
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
        forceFallback: true,
    }

    const renderThumbnails = (list: SortableFile[], onDelete: (preview: string) => void) =>
        list.map(file => (
            <div className={"thumbnail draggable" + hoverFlag + dragFlag} key={file.preview}>
                <button className="thumbnail-delete" onClick={(e) => { e.preventDefault(); onDelete(file.preview) }}>
                    <FiX />
                </button>
                <div className="thumbnail-inner">
                    <img src={file.preview} className="thumbnail-image" />
                </div>
            </div>
        ))

    return (
        <form name="form" className="content" onSubmit={createTheme}>
            <div className="content-block">
                Drag your images into each category or click the "+" button. <br />
                The order of images determines when they will appear. <br />
                A minimum of one image is required for each category.
            </div>
            <div className="category-grid">
                <div className="category">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            const f = makeFiles(files)
                            setImageData(prev => prev.concat(f))
                            setSunriseThumbnails(prev => prev.concat(f))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable list={sunriseThumbnails} setList={setSunriseThumbnails} {...sortableProps}>
                                {renderThumbnails(sunriseThumbnails, (p) => setSunriseThumbnails(prev => prev.filter(f => f.preview !== p)))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            const f = makeFiles(files)
                            setImageData(prev => prev.concat(f))
                            setDayThumbnails(prev => prev.concat(f))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable list={dayThumbnails} setList={setDayThumbnails} {...sortableProps}>
                                {renderThumbnails(dayThumbnails, (p) => setDayThumbnails(prev => prev.filter(f => f.preview !== p)))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            const f = makeFiles(files)
                            setImageData(prev => prev.concat(f))
                            setSunsetThumbnails(prev => prev.concat(f))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable list={sunsetThumbnails} setList={setSunsetThumbnails} {...sortableProps}>
                                {renderThumbnails(sunsetThumbnails, (p) => setSunsetThumbnails(prev => prev.filter(f => f.preview !== p)))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple onDrop={(files) => {
                            const f = makeFiles(files)
                            setImageData(prev => prev.concat(f))
                            setNightThumbnails(prev => prev.concat(f))
                        }} />
                        <div className="thumbnail-container">
                            <ReactSortable list={nightThumbnails} setList={setNightThumbnails} {...sortableProps}>
                                {renderThumbnails(nightThumbnails, (p) => setNightThumbnails(prev => prev.filter(f => f.preview !== p)))}
                            </ReactSortable>
                        </div>
                    </div>
                </div>
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

export default CreateThemeFromImageSet
