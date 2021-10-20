import './static/index.less'

import metadata, { IData } from './metadata'
import Zero from './ts/zero'

export interface IConfig {
    container: HTMLElement
    name: string
}

export default class KWE {
    static metadata = metadata
    static prefix = 'hy'
    private config: Required<IConfig>
    zero!: Zero

    constructor(config: IConfig) {
        this.config = {
            ...config
        }
        this.init()
    }

    private init() {
        this.zero = new Zero(this.config)
    }
    add(str: string) {
        this.zero.add(str)
    }
    metadata(): IData {
        return metadata
    }
}
