import { useEffect } from "react"
import { Link } from "react-router"
import { IoIosHome, IoIosCheckmarkCircle } from "react-icons/io"
import FileSaver from "file-saver"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"

export default function Result() {
    useEffect(() => {
        AppStore.loading = false
    })

    const handleDownloadLink = () => {
        if (ThemeStore.themeData) {
            FileSaver.saveAs(ThemeStore.themeData, ThemeStore.themeName + ".ddw")
        }
    }

    return (
        <div className="result fade-in">
            <IoIosCheckmarkCircle className="result-success-icon" />
            <div className="result-title">{"'" + ThemeStore.themeName + "' theme created!"}</div>
            <div className="result-download-link-text hover-fade" onClick={handleDownloadLink}>Click to download .ddw file</div>
            <Link to="/">
                <div className="result-home-link hover-fade"><IoIosHome className="result-home-button" />Back to home</div>
            </Link>
        </div>
    )
}
