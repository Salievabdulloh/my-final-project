import get, { api, editFunction, searchItems, selectStatusFunction, deleteItem, addFunc, checkUser } from "./api.js"

let main = document.querySelector('.main')
let selectStatus = document.querySelector('.custom-select')
let search = document.querySelector('.search')
let closeBtn = document.querySelector('.closeBtn')
let shoppingDialog = document.querySelector('.shopping-dialog')
let editForm = document.querySelector('.editForm')
let editDialog = document.querySelector('.editDialog')
let idx = null
let moon = document.querySelector('.moon')
let sun = document.querySelector('.sun')
let addProduct = document.querySelector('.addProduct')
let addDialog = document.querySelector('.addDialog')
let addForm = document.querySelector('.addForm')
let slider = document.querySelector('.inputCheckbox')
let body = document.body

addProduct.onclick = () => {
    addDialog.showModal()
}

addForm.onsubmit = (e) => {
    e.preventDefault()
    let newProduct = {
        productName: e.target['addProductname'].value,
        productImage: e.target['addProductimg'].value,
        productPrice: e.target['addProductprice'].value,
        productCategory: e.target['addProductmodel'].value,
        productColor: [e.target['addProductcolor'].value, e.target['addProductcolor2'].value],
        productStatus: e.target['addStatus'].value == 'true'
    }
    addFunc(newProduct)
}

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
        body.style.backgroundColor = '#212121'
        body.style.color = 'white'
    } else {
        body.style.backgroundColor = '#e8e8e8'
        body.style.color = 'black'
    }
}

let product = JSON.parse(localStorage.getItem('data')) || []

closeBtn.onclick = () => {
    shoppingDialog.close()
}

function getData(data) {
    main.innerHTML = ''
    data.forEach(e => {
        let div = document.createElement('div')
        div.classList.add('card')

        let name = document.createElement('p')
        name.innerHTML = e.productName
        name.classList.add('name')

        let price = document.createElement('p')
        price.innerHTML = `$${e.productPrice}`
        price.style.fontWeight = '700'

        let image = document.createElement('img')
        image.src = e.productImage
        image.style.width = '310px'
        image.style.height = '200px'

        let infoBtn = document.createElement('button')
        infoBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`
        infoBtn.classList.add('info')
        infoBtn.onclick = () => {
            localStorage.setItem('id', e.productId)
            window.location = 'http://127.0.0.1:5501/info/info.html'
        }

        let buttonsDiv = document.createElement('div')
        let overplay = document.createElement('div')
        overplay.classList.add('overplay')

        let deleteBtn = document.createElement('button')
        deleteBtn.innerHTML = `delete <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 svg">  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`
        deleteBtn.onclick = () => {
            deleteItem(e.id)
        }

        let editBtn = document.createElement('button')
        editBtn.innerHTML = `Edit<svg class="svg" viewBox="0 0 512 512">
        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>`
        editBtn.classList.add('Btn')
        deleteBtn.classList.add('Btn')
        deleteBtn.classList.add('del')
        editBtn.onclick = () => {
            editDialog.showModal()
            editForm.editProductname.value = e.productName
            editForm.editProductprice.value = e.productPrice
            editForm.editProductimg.value = e.productImage
            editForm.editProductmodel.value = e.productCategory
            editForm.editStatus.value = e.productStatus ? true : false
            editForm.editProductcolor.value = e.productColor[0]
            editForm.editProductcolor2.value = e.productColor[1]
            idx = e.id
        }

        let actionBtn = document.createElement('div')
        actionBtn.style.display = 'flex'
        actionBtn.style.gap = '20px'
        actionBtn.style.alignItems = 'center'
        let checkWrapper = document.createElement('div');
        checkWrapper.classList.add('checkbox-wrapper-12');

        let check = document.createElement('input');
        check.type = 'checkbox';
        check.id = 'cbx-12';
        check.checked = e.productStatus;
        check.onchange = () => {
            checkUser(e);
        };

        let cbx = document.createElement('div');
        cbx.classList.add('cbx');
        cbx.innerHTML = `
    <label for="cbx-12"></label>
    <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
      <path d="M2 8.36364L6.23077 12L13 2"></path>
    </svg>
`;

        cbx.prepend(check)
        checkWrapper.appendChild(cbx);

        let svgDefs = document.createElement('svg');
        svgDefs.setAttribute('version', '1.1');
        svgDefs.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgDefs.innerHTML = `
  <defs>
    <filter id="goo-12">
      <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
      <feColorMatrix result="goo-12" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
      <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
    </filter>
  </defs>
`;

        checkWrapper.appendChild(svgDefs);
        actionBtn.append(editBtn, deleteBtn, checkWrapper);
        buttonsDiv.append(infoBtn)
        div.append(image, buttonsDiv, name, price, overplay, actionBtn)
        main.append(div)
    })
}

editForm.onsubmit = (e) => {
    e.preventDefault()
    let updateItems = {
        productId: idx,
        productName: e.target['editProductname'].value,
        productPrice: e.target['editProductprice'].value,
        productImage: e.target['editProductimg'].value,
        productCategory: e.target['editProductmodel'].value,
        productColor: [e.target['editProductcolor'].value, e.target['editProductcolor2'].value],
        productStatus: e.target['editStatus'].value == 'true'
    }
    editFunction(updateItems, idx)
}

search.oninput = () => {
    searchItems(search.value)
}

selectStatus.onchange = () => {
    selectStatusFunction(selectStatus.value)
}

export { getData }