import { observer } from "mobx-react-lite"
import Footer from "./footer"
import LoadingOverlay from "./loading-overlay"
import AppStore from "../stores/app"

interface LayoutProps {
    children: React.ReactNode
}

const Layout = observer(({ children }: LayoutProps) => (
    <div className="layout">
        {AppStore.loading ? <LoadingOverlay /> : null}
        {children}
        <Footer />
    </div>
))

export default Layout
