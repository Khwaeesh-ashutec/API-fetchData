const second = document.querySelector('.second');
const prevBtn = document.querySelector('.prev-user')
const nextBtn = document.querySelector('.next-user')
const display = document.querySelector('.display')

const API_LINK_PAGE = 'https://reqres.in/api/users?page=';
const API_LINK_USER = 'https://reqres.in/api/users/'

let n = 1;
let user, clickMe;
let isPage = false;

const myFunAJAX = async function (x) {
    const pageInfoII = await fetch(`${API_LINK_PAGE} ${x}`);
    const userInfoII = await fetch(`${API_LINK_USER}${x}`);
    const resultsy = await Promise.allSettled([pageInfoII.json(), userInfoII.json()])

    const [newValPage, newUserVal] = [resultsy[0].value.data, resultsy[1].value.data];

    if (isPage === true) {
        return newValPage;
    } else {
        return newUserVal;
    }
}

var stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

const markUpBuild = async function () {
    isPage = true;
    const userData = await myFunAJAX(n)

    second.innerHTML = '';
    const markUpFun = function (e) {
        return ` <a href="#" class="link">
        <div class="view"></div>
            <div class="container" data-id="${userData[e].id}"><img src="${userData[e].avatar}" class="image" style="height: 140px; width: 140px; position: relative;"></img>
             <h4 class="nameTag">${userData[e].first_name}</h4>
             <h5 class="emailTag">${userData[e].email}</h5>
            </div>
            </a>`
    }
    for (let e = 0; e < userData.length; e++) {
        second.appendChild(stringToHTML(markUpFun(e)))
    }
}

const getUserInfo = () => setTimeout(async () => {
    clickMe = second.childNodes;
    clickMe.forEach(e => {
        e.addEventListener('click', async function (e) {

            const p = e.target.closest('.container');
            const id = p.dataset.id;
            const getData = await myFunAJAX(id)
            const singleUser = async function () {
                const res = await fetch(`${API_LINK_USER}${id}`);
                const data = await res.json();
                const userData = data.data;
                return userData;
            }
            const getDatabyId = await singleUser();
            const showMarkup = function () {
                display.innerHTML = '';
                return `
                <div>
                    <h1> ${getDatabyId.first_name}</h1>
                    <p>${getDatabyId.last_name}</p>
                    <p>${getDatabyId.email}</p>
                </div>
                `
            }
            display.insertAdjacentHTML('afterbegin', showMarkup())
        })
    })
}, 300);

const pageInfo = async function () {
    markUpBuild();
    getUserInfo();
}

const changeUser = async function () {
    pageInfo();
}
changeUser()
prevBtn.addEventListener('click', function () {
    if (n < 2) return;
    n -= 1;
    display.innerHTML = '';
    pageInfo();
})
nextBtn.addEventListener('click', async function () {
    if (n >= 2) return;
    n += 1;
    display.innerHTML = '';
    pageInfo();
})

