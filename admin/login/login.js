let token = localStorage.getItem('name')
if (token == 'Abdulloh') {
    window.location == 'http://127.0.0.1:5501/admin/admin.html'
}
let inName = document.querySelector('.inName')
let inLastname = document.querySelector('.inLastname')
let inEmail = document.querySelector('.inEmail')
let inpassword = document.querySelector('.inpassword')
let form = document.querySelector('.form')
let api = 'http://localhost:3001/admin'
let admins = [];


async function get() {
    try {
        let res = await fetch(api)
        admins = await res.json()
    } catch (error) {
        console.error(error)
    }
}

get()

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let isAdmin = admins.some(admin =>
        admin.adminName === inName.value &&
        admin.adminLastname === inLastname.value &&
        admin.adminEmail === inEmail.value &&
        admin.adminPassword === inpassword.value
    );

    if (isAdmin) {
        localStorage.setItem('name', inName.value)
        window.location.href = 'http://127.0.0.1:5501/admin/admin.html';
    } else {
        alert('You are not admin');
    }
});