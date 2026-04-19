import { makeObservable, observable } from "mobx"

class Theme {
    themeData: Blob | undefined = undefined
    themeName: string | undefined = undefined

    constructor() {
        makeObservable(this, {
            themeData: observable,
            themeName: observable,
        })
    }
}

export default new Theme()
