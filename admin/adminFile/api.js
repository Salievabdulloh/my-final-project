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

async function editFunction(update, idx) {
    try {
        await fetch(`${api}/${idx}`, {
            method: "PUT",
            headers: { "content-type": 'application/json' },
            body: JSON.stringify(update)
        })
        get()
    } catch (error) {
        console.error(error)
    }
}
async function addFunc(product) {
    try {
        await fetch(api, {
            method: "POST",
            headers: { "content-type": 'application/json' },
            body: JSON.stringify(product)
        })
        get()
    } catch (error) {
        console.error(error)
    }
}

async function deleteItem(id) {
    try {
        await fetch(`${api}/${id}`, {
            method: "DELETE"
        })
        get()
    } catch (error) {
        console.error(error)
    }
}


export { searchItems, addFunc, selectStatusFunction, editFunction, deleteItem }