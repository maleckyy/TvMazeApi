window.onload =function(){

showsApp.init()

}
let showsApp = {

    data: null,
    searchInput: null,
    showsDataSection:null,

    init: function(){
        this.searchInput = document.getElementById('search-input')
        this.searchInput.addEventListener('keyup',(e)=>{
            //add event do przycisku 13 czyli enter, powoduje uruchomienie loadData, które wyszukuje a api wpisaną fraze
            if(e.keyCode == '13'){
                this.loadData(this.searchInput.value);
            }
        });
        this.showsDataSection = document.querySelector('.shows-data-section')
    },

    //fetch do api plus wpisana fraza z usunieciem spacji
    loadData: function(str){
        fetch('https://api.tvmaze.com/search/shows?q='+str.trim())
        .then(response => response.json())
        .then( data => this.dataReady(data) )
    },

    dataReady: function(showData){
        this.data = showData;

        let allBoxesHtml = "";

        if(showData.length == 0){

            //if który wyswietla taśme i napis o braku seriali z wpisaną frazą
            allBoxesHtml = `       
            <div class="empty-section">
                <img id="emptyImg" src="https://cdn.pixabay.com/photo/2016/02/01/18/59/filmstrip-1174228_960_720.png" alt="">
                <p class="emptyInfo">I cant find anything... sorry ;(</p>
            </div>
            `
        }

        for(let i = 0; i < showData.length; i++){

            let show = showData[i];
            show = show.show;
            let genres = show.genres.join(', ')//połączenie wszystkich gatunków z dodaniem przecinka
            let imgSrc = null;
            let imgSrcOriginal = null;
            if (show.image){
                imgSrc = show.image.medium;
                imgSrcOriginal = show.image.original;
            }else{
                //ustawienie domyślnego zdjęcia na wypadek braku w api
                imgSrc = 'https://cdn.pixabay.com/photo/2016/06/02/16/14/cassette-1431397_960_720.png'
                imgSrcOriginal ='https://cdn.pixabay.com/photo/2016/06/02/16/14/cassette-1431397_960_720.png'
            }
            let showTitle = null;
            if(!show.name){
                continue;
            }
            showTitle = show.name

            let network = '-'
            if(show.network){
                network = show.network.name
            }

            let oficialSite = '-'
            if(show.oficialSite){
                oficialSite - show.oficialSite
            }

            let premiered = '-'
            if(show.premiered){
                premiered = show.premiered
            }
            
            //zbiór informacji o danym serialu
            let summary = show.summary;
            summary = `
            <p>Show: ${showTitle} </p>
            <p>Date: ${premiered} </p>
            <p>Network: ${network} </p>
            <br>
            `+ summary;

            allBoxesHtml += this.getShowBoxByTemplate(imgSrc,showTitle,genres,summary)

        }
        this.showsDataSection.innerHTML = allBoxesHtml;
    },
    //generowanie kafelkow dla znalezionego serialu
    getShowBoxByTemplate: function(imgSrc, title , genres, overview){

        return `
        <div class="show-box">
            <img src="${imgSrc}" alt="">
            <div class="show-title">${title}</div>
            <div class="show-gens">${genres}</div>
            <div class="show-overview">${overview}</div>

        </div>
        `;
    }
}