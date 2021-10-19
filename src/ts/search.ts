import KWE, { IConfig } from '..'
import searchSvg from '../static/img/search.svg'
import Utils from '../common/utils'

interface ITemplete {
    input: HTMLInputElement
    btn: HTMLButtonElement
    list: HTMLUListElement
}
export default class Search {
    private container: HTMLElement
    private templete!: ITemplete

    constructor(private config: Required<IConfig>) {
        this.container = config.container
        this.container.classList.add(KWE.prefix)
        this.init()
        this.events()
    }

    private init() {
        this.container.insertAdjacentHTML('beforeend', this.tpl())
        this.templete = {
            input: <HTMLInputElement>this.container.querySelector(`.${KWE.prefix}-text`),
            btn: <HTMLButtonElement>this.container.querySelector(`.${KWE.prefix}-btn`),
            list: <HTMLUListElement>this.container.querySelector(`.${KWE.prefix}-list`),
        }
    }

    private events() {
        this.templete.btn.addEventListener('click', () => {
            this.appendList()
        })

        this.templete.input.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.keyCode === 13) {
                this.appendList()
            }
        })
    }

    appendList(str = this.templete.input.value) {
        const li = `<li>${Utils.htmlEscape(str)}</li>`
        this.templete.list.insertAdjacentHTML('beforeend', li)
        this.templete.input.value = ''
    }

    private tpl() {
        return `<h1 class="${KWE.prefix}-header">TYPESCRIPT DEMO</h1>
            <div class="${KWE.prefix}-search">
                <input type="text" class="${KWE.prefix}-text" placeholder="search">
                <span class="${KWE.prefix}-btn">${searchSvg}</span>
            </div>
            <ul class="${KWE.prefix}-list"></ul>`
    }
}
