import get, { api, range, searchItems, selectStatusFunction } from "./api.js"

let main = document.querySelector('.main')
let selectStatus = document.querySelector('.custom-select')
let count = document.querySelector('.count')
let search = document.querySelector('.search')
let closeBtn = document.querySelector('.closeBtn')
let imgButton = document.querySelector('.img-button')
let sidebarDialog = document.querySelector('.sidebar-dialog')
let shoppingDialog = document.querySelector('.shopping-dialog')
let menuButton = document.querySelector('.menu-button')
let menuList = document.querySelector('.menu-list')
let closeMenu = document.querySelector('.closeMenu')
let sun = document.querySelector('.sun')
let slider = document.querySelector('.inputCheckbox')
let body = document.body
let moon = document.querySelector('.moon')
let bottomDiv = document.querySelector('.bottom-div')
let rangeInput = document.querySelector('.rangeInput')
let rangeValue = document.querySelector('.rangeValue')

rangeInput.oninput = () => {
    let value = rangeInput.value
    let price = parseInt(value)
    rangeValue.textContent = `Value: $${price}`
    range(price)
}

let darkMode = localStorage.getItem('theme') || 'light'
changeTheme(darkMode)

slider.checked = darkMode === 'dark'

slider.onchange = () => {
    const theme = slider.checked ? 'dark' : "light"
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
        menuButton.style.color = 'white'

    }
    else {
        body.style.backgroundColor = 'white'
        body.style.color = 'black'
        shoppingDialog.style.backgroundColor = 'white'
        shoppingDialog.style.color = 'black'
        bottomDiv.style.backgroundColor = 'hsla(206, 33%, 96%, 1)'
        bottomDiv.style.color = 'hsla(206, 54%, 30%, 1)'
        menuButton.style.color = 'black'
    }
}

menuButton.onclick = () => {
    menuList.showModal()
}

closeMenu.onclick = () => {
    menuList.close()
}

let product = JSON.parse(localStorage.getItem('data')) || []

imgButton.onclick = () => {
    shoppingDialog.showModal()
}

closeBtn.onclick = () => {
    shoppingDialog.close()
}

function getData(data) {
    main.innerHTML = ''
    data.forEach(e => {
        if (e.productStatus) {
            let div = document.createElement('div')
            div.classList.add('card')

            let name = document.createElement('p')
            name.innerHTML = e.productName
            name.classList.add('name')

            let price = document.createElement('p')
            price.innerHTML = '$' + e.productPrice
            price.style.fontWeight = '700'

            let image = document.createElement('img')
            image.src = e.productImage
            image.style.width = '310px'
            image.style.height = '200px'

            let add = document.createElement('button')
            add.innerHTML = `<span class="button__text">Add Item</span><span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>`
            add.classList.add('button')
            add.onclick = () => {
                addToCart(e)
            }

            let infoBtn = document.createElement('button')
            infoBtn.innerHTML = 'info'
            infoBtn.classList.add('info')
            infoBtn.onclick = () => {
                localStorage.setItem('id', e.productId)
                window.location = 'http://127.0.0.1:5501/info/info.html'
            }

            let buttonsDiv = document.createElement('div')
            let overplay = document.createElement('div')
            overplay.classList.add('overplay')

            let addBtnDiv = document.createElement('div')
            addBtnDiv.classList.add('add-btn-div')

            let ratingDiv = document.createElement('div')
            ratingDiv.innerHTML = `<input value="5" name="rate" id="star5" type="radio">
  <label title="text" for="star5"></label>
  <input value="4" name="rate" id="star4" type="radio">
  <label title="text" for="star4"></label>
  <input value="3" name="rate" id="star3" type="radio" checked="">
  <label title="text" for="star3"></label>
  <input value="2" name="rate" id="star2" type="radio">
  <label title="text" for="star2"></label>
  <input value="1" name="rate" id="star1" type="radio">
  <label title="text" for="star1"></label>`
            ratingDiv.classList.add("rating")

            addBtnDiv.append(add)
            buttonsDiv.append(infoBtn, addBtnDiv)
            div.append(image, buttonsDiv, name, price, overplay, ratingDiv)
            main.append(div)
        }
    })
}

function addToCart(e) {
    const isInCart = product.find(item => item.id === e.id)
    if (isInCart) {
        isInCart.quantity = (e.quantity || 1) + 1
    } else {
        e.quantity + 1
        product.push(e)
    }
    localStorage.setItem('data', JSON.stringify(product))
    renderSideBar()
}

function renderSideBar() {
    sidebarDialog.innerHTML = ''

    if (!product || product.length <= 0) {
        let h1 = document.createElement('h1')
        h1.innerHTML = 'The cart is empty'
        sidebarDialog.append(h1)
    }

    count.innerHTML = product.length

    product.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('cart')
        div.style.display = 'flex'
        div.style.gap = '16px'
        div.style.marginBottom = '20px'

        let name = document.createElement('p')
        name.innerHTML = e.productName
        name.style.margin = '0 0 16px 0'

        let img = document.createElement('img')
        img.classList.add('dialog-img')
        img.src = e.productImage

        let infoDiv = document.createElement('div')

        let remove = document.createElement("button")
        remove.innerHTML = 'X'
        remove.style.height = '20px'
        remove.onclick = () => {
            removeItem(e.id)
        }

        let counterDiv = document.createElement('div')

        let quantity = e.quantity || 1

        let myPrice = parseFloat(e.productPrice)

        let price = document.createElement('p')
        price.innerHTML = `Price: $${myPrice.toFixed(2) * quantity}`

        let counter = document.createElement('span')
        counter.innerHTML = quantity
        counter.style.margin = '0 10px'

        let addBtn = document.createElement('button')
        addBtn.innerHTML = '+'
        addBtn.onclick = () => {
            quantity++
            counter.innerHTML = quantity
            price.innerHTML = `Price: $${(myPrice * quantity).toFixed(2)}`
            e.quantity = quantity
            updateTotal()
            localStorage.setItem('data', JSON.stringify(product))
        }

        let minusBtn = document.createElement('button')
        minusBtn.innerHTML = '-'
        minusBtn.onclick = () => {
            quantity--
            counter.innerHTML = quantity
            price.innerHTML = `Price: $${(myPrice * quantity).toFixed(2)}`
            e.quantity = quantity
            updateTotal()
            localStorage.setItem('data', JSON.stringify(product))
            if (counter.innerHTML <= 0) {
                removeItem(e.id)
            }
        }

        counterDiv.append(addBtn, counter, minusBtn)
        infoDiv.append(name, price, counterDiv)
        div.append(img, infoDiv, remove)
        sidebarDialog.append(div)
        e.quantity = quantity
    })

    let totalPrice = document.createElement('p')
    totalPrice.innerHTML = `Total ${0}`
    sidebarDialog.append(totalPrice)

    function updateTotal() {
        let cnt = 0
        product.forEach(e => {
            cnt += parseFloat(e.productPrice) * e.quantity
        })
        totalPrice.innerHTML = `Total: $${cnt.toFixed(2)}`
    }
    updateTotal()
}

function removeItem(id) {
    product = product.filter(e => e.id != id)
    localStorage.setItem('data', JSON.stringify(product))
    renderSideBar(product)
}

search.oninput = () => {
    searchItems(search.value)
}

selectStatus.onchange = async () => {
    selectStatusFunction(selectStatus.value)
}

renderSideBar()

export { getData }