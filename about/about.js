let api = 'http://localhost:3001/product'

let shoppingDialog = document.querySelector('.shopping-dialog')
let sidebar = document.querySelector('.sidebar')
let closeBtn = document.querySelector('.closeBtn')
let count = document.querySelector('.count')
let imgButton = document.querySelector('.img-button')
let menuButton = document.querySelector('.menu-button')
let menuList = document.querySelector('.menu-list')
let closeMenu = document.querySelector('.closeMenu')
let body = document.body
let sun = document.querySelector('.sun')
let moon = document.querySelector('.moon')
let slider = document.querySelector('.input')
let cartImg = document.querySelector('.cart-img')
let bottomDiv = document.querySelector('.bottom-div')

let darkMode = localStorage.getItem('theme') || 'light'
changeTheme(darkMode)

slider.checked = darkMode == 'dark'

slider.onchange = () => {
    const save = slider.checked ? 'dark' : 'light'
    localStorage.setItem('theme', save)
    changeTheme(save)
}

sun.onclick = () => {
    localStorage.setItem('theme', 'dark')
    changeTheme('dark')
}
moon.onclick = () => {
    localStorage.setItem('theme', 'light')
    changeTheme('light')
}

function changeTheme(theme) {
    if (theme === 'dark') {
        body.style.backgroundColor = 'black'
        body.style.color = 'white'
        shoppingDialog.style.backgroundColor = 'black'
        shoppingDialog.style.color = 'white'
        bottomDiv.style.backgroundColor = 'hsl(0deg 0% 5.94%)'
        bottomDiv.style.color = 'hsla(206, 54%, 90%, 1)'
    } else {
        body.style.backgroundColor = 'white'
        body.style.color = 'black'
        shoppingDialog.style.backgroundColor = 'white'
        shoppingDialog.style.color = 'black'
        bottomDiv.style.backgroundColor = 'hsla(206, 33%, 96%, 1)'
        bottomDiv.style.color = 'hsla(206, 54%, 30%, 1)'
    }
}

menuButton.onclick = () => {
    menuList.showModal()
}

closeMenu.onclick = () => {
    menuList.close()
}

let products = JSON.parse(localStorage.getItem('data')) || []

imgButton.onclick = () => {
    shoppingDialog.showModal()
}
closeBtn.onclick = () => {
    shoppingDialog.close()
}


async function get() {
    try {
        let res = await fetch(api)
        let data = await res.json()
        getData(data)
    } catch (error) {
        console.error(error)
    }
}

function render() {
    sidebar.innerHTML = ''

    if (products.length == 0 || !products) {
        let h1 = document.createElement('h1')
        h1.innerHTML = 'the cart is empty'
        sidebar.append(h1)
    }

    count.innerHTML = products.length

    products.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('cart')
        let name = document.createElement('p')
        name.innerHTML = e.productName
        name.style.margin = '0 0 16px 0'

        let img = document.createElement('img')
        img.style.width = '128px'
        img.src = e.productImage

        let infoDiv = document.createElement('div')

        let remove = document.createElement('button')
        remove.innerHTML = 'X'
        // remove.classList.add('remove')
        remove.style.height='20px'

        remove.onclick = () => {
            removeItem(e.id)
        }

        let price = document.createElement('p')
        price.style.fontWeight = '700'

        let counterDiv = document.createElement('div')

        let quantity = e.quantity || 1
        let myPrice = parseFloat(e.productPrice)
        price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`

        let counter = document.createElement('span')
        counter.innerHTML = quantity
        counter.style.margin = '0 10px'

        let addBtn = document.createElement('button')
        addBtn.innerHTML = '+'
        addBtn.onclick = () => {
            quantity++
            counter.innerHTML = quantity
            price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`
            localStorage.setItem('data', JSON.stringify(products))
            e.quantity = quantity
            updateTotal()
        }

        let minusBtn = document.createElement('button')
        minusBtn.innerHTML = '-'
        minusBtn.onclick = () => {
            quantity--
            counter.innerHTML = quantity
            price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`
            localStorage.setItem('data', JSON.stringify(products))
            e.quantity = quantity
            updateTotal()
            if (counter.innerHTML <= 0) {
                removeItem(e.id)
            }
        }

        counterDiv.append(addBtn, counter, minusBtn)
        infoDiv.append(name, price, counterDiv)
        div.append(img, infoDiv, remove)
        sidebar.append(div)

        e.quantity = quantity
    })

    let totalPrice = document.createElement('div')
    totalPrice.innerHTML = `$0`
    sidebar.append(totalPrice)

    function updateTotal() {
        let cnt = 0
        products.forEach(e => {
            cnt += parseFloat(e.productPrice) * e.quantity
        })
        totalPrice.innerHTML = `Total: $${cnt.toFixed(2)}`
    }
    updateTotal()
}

function removeItem(id) {
    products = products.filter(e => e.id !== id)
    localStorage.setItem('data', JSON.stringify(products))
    render(products)
}

render()