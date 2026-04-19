import { TailSpin } from "react-loader-spinner"
import AppStore from "../stores/app"

const LoadingOverlay = () => (
    <div className="loading-overlay">
        <TailSpin color="#FFF" height={100} width={100} />
        <div className="loading-text">{AppStore.loadingMessage}</div>
    </div>
)

export default LoadingOverlay
