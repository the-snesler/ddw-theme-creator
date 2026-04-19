import { useEffect } from "react"
import { Link } from "react-router"
import { IoIosImage, IoIosImages } from "react-icons/io"
import { GoArrowRight } from "react-icons/go"
import AppStore from "../stores/app"

export default function Home() {
    useEffect(() => {
        AppStore.loading = false
    })

    const onOptionClick = () => {
        AppStore.loadingMessage = "Loading..."
        AppStore.loading = true
    }

    return (
        <div className="home fade-in">
            <div className="logo">
                <img className="logo-image" src={`${import.meta.env.BASE_URL}logo.png`} />
                <div className="logo-text">
                    WinDynamicDesktop <br />
                    .ddw Theme Creator
                </div>
            </div>
            <ul className="options">
                <li className="option hover-fade">
                    <Link to="/create?option=1" onClick={onOptionClick}>
                        <IoIosImages className="option-icon" />
                        <GoArrowRight className="option-icon" />
                        <img className="option-image-small" src={`${import.meta.env.BASE_URL}icon.png`} />
                        <div className="option-text">Create theme from set of images</div>
                    </Link>
                </li>
                <li className="option hover-fade">
                    <Link to="/create?option=2" onClick={onOptionClick}>
                        <IoIosImage className="option-icon" />
                        <GoArrowRight className="option-icon" />
                        <img className="option-image-small" src={`${import.meta.env.BASE_URL}icon.png`} />
                        <div className="option-text">Create theme from single image</div>
                    </Link>
                </li>
                <li className="option hover-fade">
                    <Link to="/create?option=3" onClick={onOptionClick}>
                        <img className="option-image-big" src={`${import.meta.env.BASE_URL}heicfile.png`} />
                        <GoArrowRight className="option-icon" />
                        <img className="option-image-small" src={`${import.meta.env.BASE_URL}icon.png`} />
                        <div className="option-text">Convert .heic file to .ddw file</div>
                    </Link>
                </li>
            </ul>
        </div>
    )
}
