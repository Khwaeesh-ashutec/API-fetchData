const second = document.querySelector('.second');
const prevBtn = document.querySelector('.prev-user')
const nextBtn = document.querySelector('.next-user')
const display = document.querySelector('.display')

const API_LINK = 'https://reqres.in/api/users?page='

let n = 1;
let user, clickMe;

const AJAX = async function () {
    const res = await fetch(`${API_LINK}${n}`);
    const data = await res.json()
    const userData = data.data;
    return userData;
}

var stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

const markUpBuild = async function () {
    const userData = await AJAX()

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

const getUserInfo = () => setTimeout(() => {
    clickMe = second.childNodes;

    const getData = async function () {
        const data = await AJAX();
        return data;
    }

    clickMe.forEach(e => {
        e.addEventListener('click', async function (e) {
            getData()
            const p = e.target.closest('.container');
            const id = p.dataset.id;
            console.log(p.dataset.id)
            const singleUser = async function () {
                const res = await fetch(`https://reqres.in/api/users/${id}`);
                const data = await res.json();
                console.log(data.data);
                const userData = data.data;
                return userData;
            }
            // `${userData.id / n}, ${userData.first_name}, ${userData.email}`
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
}, 600);

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
