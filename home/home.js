let api = 'http://localhost:3001/product'

let addToCardDialog = document.querySelector('.addToCardDialog')
let closeBtn = document.querySelector('.closeBtn')
let main = document.querySelector('.main')
let sidebar = document.querySelector('.sidebar')
let mainDiv = document.querySelector('.main-div')
let shoppingCart = document.querySelector('.shopping-cart')
let count = document.querySelector('.count')
let menuButton = document.querySelector('.menu-button')
let menuList = document.querySelector('.menu-list')
let closeMenu = document.querySelector('.closeMenu')
let sun = document.querySelector('.sun')
let moon = document.querySelector('.moon')
let slider = document.querySelector('.input')
let body = document.body
let nextBtn = document.querySelector('.nextBtn')
let prevBtn = document.querySelector('.prevBtn')

let darkMode = localStorage.getItem('theme') || 'light'
applyTheme(darkMode)

slider.checked = darkMode === 'dark'

slider.onchange = () => {
    const theme = slider.checked ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
    applyTheme(theme)
}

sun.onclick = () => {
    applyTheme('dark')
    localStorage.setItem('theme', 'dark')
}

moon.onclick = () => {
    applyTheme('light')
    localStorage.setItem('theme', 'light')
}


function applyTheme(theme) {
    if (theme === 'dark') {
        body.style.backgroundColor = 'black'
        body.style.color = 'white'
        addToCardDialog.style.backgroundColor = 'black'
        addToCardDialog.style.color = 'white'
    } else {
        body.style.backgroundColor = 'white'
        body.style.color = 'black'
        addToCardDialog.style.backgroundColor = 'white'
        addToCardDialog.style.color = 'black'
    }
}

menuButton.onclick = () => {
    menuList.showModal()
}

closeMenu.onclick = () => {
    menuList.close()
}

shoppingCart.onclick = () => {
    addToCardDialog.showModal()
}

closeBtn.onclick = () => {
    addToCardDialog.close()
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

let products = JSON.parse(localStorage.getItem("data")) || []

function addToCart(e) {
    const isInCart = products.find(item => item.id === e.id)
    if (isInCart) {
        isInCart.quantity = (isInCart.quantity || 1) + 1
    } else {
        e.quantity + 1
        products.push(e)
    }
    localStorage.setItem('data', JSON.stringify(products))
    render()
}

let cardWidth = 320

nextBtn.onclick = () => {
    mainDiv.scrollBy({
        left: cardWidth * 1,
        behavior: 'smooth'
    })
}
prevBtn.onclick = () => {
    mainDiv.scrollBy({
        left: -cardWidth * 1,
        behavior: 'smooth'
    })
}

function getData(data) {
    mainDiv.innerHTML = ''
    data.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('card-div')

        let img = document.createElement('img')
        img.src = e.productImage
        img.classList.add('image')

        let infoBtn = document.createElement('button')
        infoBtn.innerHTML = 'info'
        infoBtn.classList.add('info')
        infoBtn.onclick = () => {
            localStorage.setItem('id', e.productId)
            window.location = 'http://127.0.0.1:5501/info/info.html'
        }
        let overplay = document.createElement('div')
        overplay.classList.add('overplay')

        let add = document.createElement('button')
        add.innerHTML = 'add'
        add.classList.add('add')
        add.onclick = () => {
            addToCart(e)
        }

        let name = document.createElement('p')
        name.innerHTML = e.productName
        name.classList.add('name')

        let price = document.createElement('p')
        price.innerHTML = '$' + e.productPrice
        price.classList.add('price')

        let buttonsDiv = document.createElement('div')
        buttonsDiv.append(infoBtn, add)

        div.append(img, buttonsDiv, name, price, overplay)
        mainDiv.append(div)
    })
}

function deleteItem(id) {
    products = products.filter(e => e.id !== id)
    localStorage.setItem('data', JSON.stringify(products))
    render(products)
}

function render() {
    sidebar.innerHTML = ''
    count.innerHTML = products.length

    if (!products || products.length == 0) {
        let h1 = document.createElement('h2')
        h1.innerHTML = 'The cart is empty'
        sidebar.append(h1)
    }

    products.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('dialog-div')

        let img = document.createElement('img')
        img.src = e.productImage
        img.style.width = '128px'

        let removeItem = document.createElement('button')
        removeItem.innerHTML = 'X'
        removeItem.style.height = '24px'
        removeItem.onclick = () => {
            deleteItem(e.id)
        }

        let name = document.createElement('p')
        name.innerHTML = e.productName

        let counterDiv = document.createElement('div')
        let infoDiv = document.createElement('div')

        let quantity = e.quantity || 1

        let myPrice = parseFloat(e.productPrice)

        let price = document.createElement('p')
        price.classList.add('price')
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
            e.quantity = quantity
            updateQuantity()
            localStorage.setItem('data', JSON.stringify(products))
        }

        let minusBtn = document.createElement('button')
        minusBtn.innerHTML = '-'
        minusBtn.onclick = () => {
            quantity--
            counter.innerHTML = quantity
            price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`
            e.quantity = quantity
            updateQuantity()
            localStorage.setItem('data', JSON.stringify(products))
            if (counter.innerHTML <= 0) {
                deleteItem(e.id)
            }
        }

        counterDiv.append(addBtn, counter, minusBtn)
        infoDiv.append(name, price, counterDiv)
        div.append(img, infoDiv, removeItem)
        sidebar.append(div)

        e.quantity = quantity
    })

    let totalPrice = document.createElement('div')
    totalPrice.innerHTML = `Total: $0`
    sidebar.append(totalPrice)

    function updateQuantity() {
        let cnt = 0
        products.forEach(el => {
            cnt += parseFloat(el.productPrice) * el.quantity
        })
        totalPrice.innerHTML = `Total: $${cnt.toFixed(2)}`
    }
    updateQuantity()
}

render()

get()