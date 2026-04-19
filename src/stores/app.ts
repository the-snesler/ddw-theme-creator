import { makeObservable, observable } from "mobx"

class App {
    loading: boolean = false
    loadingMessage: string = ""

    constructor() {
        makeObservable(this, {
            loading: observable,
            loadingMessage: observable,
        })
    }
}

export default new App()
