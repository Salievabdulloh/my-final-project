let shoppingDialog = document.querySelector('.shopping-dialog')
let imgButton = document.querySelector('.img-button')
let closeBtn = document.querySelector('.closeBtn')
let sidebar = document.querySelector('.sidebar')
let count = document.querySelector('.count')
let nameOfProduct = document.querySelector('.nameOfProduct')
let main = document.querySelector('.main')
let menuButton = document.querySelector('.menu-button')
let menuList = document.querySelector('.menu-list')
let closeMenu = document.querySelector('.closeMenu')
let sun = document.querySelector('.sun')
let moon = document.querySelector('.moon')
let bottomDiv = document.querySelector('.bottom-div')
let body = document.body
let slider = document.querySelector('.input')

let themeMode = localStorage.getItem('theme') || 'light'
changeTheme(themeMode)

slider.checked = themeMode === "dark"

slider.onchange = () => {
    const theme = slider.checked ? "dark" : 'light'
    localStorage.setItem('theme', theme)
    changeTheme(theme)
}

sun.onclick = () => {
    changeTheme('dark')
    localStorage.setItem('theme', 'dark')
}

moon.onclick = () => {
    changeTheme('light')
    localStorage.setItem('theme', 'light')
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

let id = localStorage.getItem('id')
let api = 'http://localhost:3001/product'

let products = JSON.parse(localStorage.getItem('data')) || []

imgButton.onclick = () => {
    shoppingDialog.showModal()
}

closeBtn.onclick = () => {
    shoppingDialog.close()
}

async function get() {
    try {
        let res = await fetch(`${api}?productId=${id}`)
        let data = await res.json()
        getData(data)
    } catch (error) {
        console.error(error)
    }
}

function addProduct(e) {
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
        div.classList.add("render-div")

        let name = document.createElement('p')
        name.innerHTML = e.productName


        let img = document.createElement('img')
        img.style.width = '128px'
        img.src = e.productImage

        let infoDiv = document.createElement('div')

        let remove = document.createElement('button')
        remove.innerHTML = 'x'
        remove.classList.add('remove')
        remove.onclick = () => {
            removeItem(e.id)
        }

        let counterDiv = document.createElement('div')

        let quantity = e.quantity || 1
        let myPrice = parseFloat(e.productPrice)

        let counter = document.createElement('span')
        counter.innerHTML = quantity
        counter.style.margin = '0 10px'

        let price = document.createElement('p')
        price.style.fontWeight = '700'
        price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`

        let addBtn = document.createElement('button')
        addBtn.innerHTML = '+'
        addBtn.onclick = () => {
            quantity++
            counter.innerHTML = quantity
            price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`
            e.quantity = quantity
            updateTotal()
            localStorage.setItem('data', JSON.stringify(products))
        }

        let minusBtn = document.createElement('button')
        minusBtn.innerHTML = '-'
        minusBtn.onclick = () => {
            quantity--
            counter.innerHTML = quantity
            price.innerHTML = `$${(myPrice * quantity).toFixed(2)}`
            e.quantity = quantity
            updateTotal()
            localStorage.setItem('data', JSON.stringify(products))
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

    let totalPrice = document.createElement('p')
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

render()

function removeItem(id) {
    products = products.filter(e => e.id !== id)
    localStorage.setItem('data', JSON.stringify(products))
    render()
}

function getData(data) {
    data.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('main-div')
        nameOfProduct.innerHTML = e.productName

        let image = document.createElement('img')
        image.src = e.productImage

        let name = document.createElement('h1')
        name.innerHTML = e.productName

        let price = document.createElement('p')
        price.innerHTML = '$' + e.productPrice
        price.classList.add('price')

        let model = document.createElement('h2')
        model.innerHTML = `By ${e.productCategory}`

        let par = document.createElement('p')
        par.classList.add('paragraph')
        par.innerHTML = 'Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic  chillwave  trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge '

        let infoDiv = document.createElement('div')

        let addToCart = document.createElement('button')
        addToCart.innerHTML = 'ADD TO CART'
        addToCart.classList.add('add')
        addToCart.onclick = () => {
            addProduct(e)
        }

        let conteiner = document.createElement('div')
        conteiner.classList.add('color-div')
        e.productColor.forEach(el => {
            let p = document.createElement('p')
            p.classList.add('p')
            p.style.backgroundColor = el
            conteiner.append(p)
        })

        let colorDiv = document.createElement('div')
        colorDiv.classList.add('all-color-div')

        colorDiv.append(price, conteiner)
        infoDiv.append(name, model, colorDiv, par, addToCart)
        div.append(image, infoDiv)
        main.append(div)
    })
}

get()