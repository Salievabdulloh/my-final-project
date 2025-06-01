import { getData } from "./dom.js"

export let api = 'http://localhost:3001/product'

export default async function get() {
    try {
        let res = await fetch(api)
        let data = await res.json()
        getData(data)
    } catch (error) {
        console.error(error)
    }
}

async function searchItems(product) {
    try {
        let res = await fetch(`${api}?productName=${product}`)
        let data = await res.json()
        getData(data)
    } catch (error) {
        console.error(error)
        return []
    }
}

async function selectStatusFunction(value) {
    if (value !== 'All') {
        try {
            let res = await fetch(`${api}?productCategory=${value}`)
            let data = await res.json()
            getData(data)
        } catch (error) {
            console.error(error)
        }
    } else {
        get()
    }
}


export { searchItems, selectStatusFunction }