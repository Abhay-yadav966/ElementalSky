
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const grantAccessButton = document.querySelector("[data-grantAccess]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const searchInput = document.querySelector("[data-searchInput]");


// imp variables

let oldTab = userTab;
oldTab.classList.add('current-tab');
const API_KEY = "2a22fa94c132bc99a2ce5fe6dc8b3fd1";


// default action when the page start at very first tym
grantAccessContainer.classList.add("active");

                            // when we start and we click on grant access button
grantAccessButton.addEventListener('click', getLocation);

async function getLocation(){
    if( navigator.geolocation ){
        navigator.geolocation.getCurrentPosition( showPosition , positionNotGet );
    }
    else{
        alert("navigator geolocation not get true value ");
    }
}

function showPosition( position ){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem( "user-coordinates", JSON.stringify(userCoordinates) );
    fetchUserWeatherInfo(userCoordinates);

}


function positionNotGet(){
    alert("unavailable to get position");
}

// usertab will come initially at starting at page
// and also when we click on usertab after coming from searchtab 
userTab.addEventListener( 'click' , () => {
    switchTab(userTab);
} );

// when we click on searchTab
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

function switchTab( newTab ){

    // checking for the condition
    if( oldTab != newTab ){

        // remove bg from old tab
        oldTab.classList.remove('current-tab');
        // moving to new tab
        oldTab = newTab;
        // adding bg to new tab
        oldTab.classList.add('current-tab');


        if( !searchForm.classList.contains("active") ){
            //kya search form wala container is invisible, if yes then make it visible
            searchForm.classList.add("active");
            grantAccessContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
        }
        else{
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }

    }



}

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coOrdinates = JSON.parse( localCoordinates );
        fetchUserWeatherInfo(coOrdinates);
    }
}

async function fetchUserWeatherInfo( coOrdinates ){
    const {lat, lon} = coOrdinates;

    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    // API call
    try{
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` );
        const data = await response.json();
        
        // stoping loading screen
        loadingScreen.classList.remove("active");

        // making user info screen visible
        userInfoContainer.classList.add("active");
        
        // rendring data on ui
        renderWeatherInfo(data);
    }
    catch(err){
        alert(err);
    }
}


function renderWeatherInfo( data ){

    //fistly, we have to fethc the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp}°C`;
    windspeed.innerText = `${data?.wind?.speed}m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.wind?.all}%`;

    
}


                                    // searching by city name

                                    // clicking on search button


searchForm.addEventListener('submit' , (e) => {
    // default behaviour at every clicked
    e.preventDefault();
    // taking input from the input field
    let cityNameInput = searchInput.value;


    if( cityNameInput == "" ){
        // if user has not entered any city name
        return;
    }
    else{
        // fatching data by city name
        fatchCityWeather( cityNameInput );
    }
});

async function fatchCityWeather(cityNameInput){

    // calling loading 
    loadingScreen.classList.add("active");


    try{
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${API_KEY}&units=metric` );
        const data = await response.json();
        
        //stoping loading screen
        loadingScreen.classList.remove("active");
        // calling user info screen
        userInfoContainer.classList.add("active");
        // rendering
        renderWeatherInfo(data);
    }
    catch(err){
        alert( err);
    }
}
