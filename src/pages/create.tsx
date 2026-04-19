import { useEffect } from "react"
import { Link, useSearchParams } from "react-router"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"
import { IoIosImage, IoIosImages } from "react-icons/io"
import CreateThemeFromImageSet from "../components/from-image-set"
import CreateThemeFromSingleImage from "../components/from-single-image"
import ConvertHeicToDdw from "../components/heic-to-ddw"
import AppStore from "../stores/app"

export default function Create() {
    const [searchParams] = useSearchParams()
    const option = searchParams.get("option")

    useEffect(() => {
        AppStore.loading = false
    })

    return (
        <div className="create fade-in">
            <div className="content-header">
                <Link to="/">
                    <GoArrowLeft className="content-header-back-button hover-fade" />
                </Link>
                {option === "1" && (
                    <div className="row">
                        <IoIosImages className="content-header-icon" />
                        <GoArrowRight className="content-header-icon" />
                        <img className="content-header-image-small" src={`${import.meta.env.BASE_URL}icon.png`} />
                        <div className="content-header-text">Create theme from set of images</div>
                    </div>
                )}
                {option === "2" && (
                    <div className="row">
                        <IoIosImage className="content-header-icon" />
                        <GoArrowRight className="content-header-icon" />
                        <img className="content-header-image-small" src={`${import.meta.env.BASE_URL}icon.png`} />
                        <div className="content-header-text">Create theme from single image</div>
                    </div>
                )}
                {option === "3" && (
                    <div className="row">
                        <img className="content-header-image-big" src={`${import.meta.env.BASE_URL}heicfile.png`} />
                        <GoArrowRight className="content-header-icon" />
                        <img className="content-header-image-small" src={`${import.meta.env.BASE_URL}icon.png`} />
                        <div className="content-header-text">Convert .heic file to .ddw file</div>
                    </div>
                )}
            </div>
            {option === "1" && <CreateThemeFromImageSet />}
            {option === "2" && <CreateThemeFromSingleImage />}
            {option === "3" && <ConvertHeicToDdw />}
        </div>
    )
}
