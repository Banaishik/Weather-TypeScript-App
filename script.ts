interface IELEMENTS_HTML {
    mainForm : HTMLFormElement | null,
    mainInput : HTMLInputElement | null,
    city : HTMLSpanElement | null,
    temperature : HTMLSpanElement | null,
    speed : HTMLSpanElement | null,
    cloudiness : HTMLSpanElement | null,
    likeButton : HTMLImageElement | null,
    windowFavorite : HTMLDivElement | null,
    itemFavorite : HTMLDivElement | null
}

const ELEMENTS_HTML : IELEMENTS_HTML  = {
    mainForm : document.querySelector('.form_main_input'),
    mainInput : document.querySelector('.main_input'),
    city : document.querySelector('.city'),
    temperature : document.querySelector('.temperature'),
    speed : document.querySelector('.speed'),
    cloudiness : document.querySelector('.cloudiness'),
    likeButton : document.querySelector('.icon_add_favorite'),
    windowFavorite : document.querySelector('.wrapper_favorite_city'),
    itemFavorite : document.querySelector('.wrapper_favorite_city'),
}

let currentCity : string
let cities : string[] = []
let index : number

const getCities = () : void => {
    let citiesLocalStorage = localStorage.getItem('cities')

    if (citiesLocalStorage) {
        let verifiedCity = JSON.parse(citiesLocalStorage)
        cities.push(...verifiedCity)
    }
}

const RequestData = async (city : string) : Promise<void> => {
    try {
        let url : string = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=25f2c7227652f33189d4bd085538dc2a`
        
        const response = await fetch(url)
        const result = await response.json()

        if (ELEMENTS_HTML.temperature && ELEMENTS_HTML.city && ELEMENTS_HTML.speed  && ELEMENTS_HTML.cloudiness) {
            ELEMENTS_HTML.temperature.textContent = result.main.temp
            ELEMENTS_HTML.city.textContent = result.name
            ELEMENTS_HTML.speed.textContent = result.wind.speed      
            ELEMENTS_HTML.cloudiness.textContent = result.weather[0].description              
        }        
    } catch (error) {
        console.log(`Извините , вышла ошибка ${error}`);
    }
}

const sample = (item : string) : string => {
    return (
        `
            <div class="item_favorite_city">
                <span class='city_name'>${item}</span>
                <span class="delete_city">x</span>
            </div>        
        `
    )
}

const FavoriteList = () : void => {
    const favoriteCity = cities.map(item => sample(item)).join('')
    if (ELEMENTS_HTML.windowFavorite) {
        ELEMENTS_HTML.windowFavorite.innerHTML = favoriteCity
    }
}

const deleteFavoriteCity = (name : string) : void => {
    index = cities.indexOf(name)
    cities.splice(index,1)
    localStorage.setItem('cities', JSON.stringify(cities))
    FavoriteList()  
}

const addFavoriteCity = (name : string) : void => {
    cities.push(name)
    localStorage.setItem('cities' , JSON.stringify(cities))
    FavoriteList()            
}

if (ELEMENTS_HTML.mainForm) {
   ELEMENTS_HTML.mainForm?.addEventListener('submit', (e) => {
        e.preventDefault()
        if (ELEMENTS_HTML.mainInput) {
            RequestData(ELEMENTS_HTML.mainInput.value)
            currentCity = ELEMENTS_HTML.mainInput.value
            ELEMENTS_HTML.mainInput.value = ""
        }
    }) 
}

if (ELEMENTS_HTML.likeButton) {
    ELEMENTS_HTML.likeButton.addEventListener('click', (e) => {
        e.preventDefault()

        if (cities.indexOf(currentCity) === -1) {
            addFavoriteCity(currentCity)
        } else {
            alert('this city has already been added to favorites :)')
        }
    })
}

if (ELEMENTS_HTML.itemFavorite) {

    ELEMENTS_HTML.itemFavorite.addEventListener('click', (event) => {

        const targetElement = event.target as HTMLElement 
        
        if (targetElement.classList.contains('city_name')) {

            const nameCity = targetElement.textContent

            nameCity ? RequestData(nameCity) : alert("error");

        } else if (targetElement.classList.contains('delete_city')) {

            const parentElement = targetElement.closest('.item_favorite_city')

            if (parentElement) {

                const relativeCityName = parentElement.querySelector('.city_name') as HTMLElement

                const nameCity = relativeCityName.textContent

                if (nameCity) {
                    deleteFavoriteCity(nameCity)            
                }
            }
        }
    })
}

getCities()
FavoriteList()