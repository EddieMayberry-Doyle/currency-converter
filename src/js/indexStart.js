class Currency
{
    constructor()
    {
        try {
            this.bookmarks = JSON.parse(localStorage["bookmarks"]);
        }
        catch{
            this.bookmarks = [
                {
                    currency1: "USD", 
                    currency2: "EUR",
                    amount1: 1,
                    amount2: 1.9, 
                    conversonRate: 1.9,
                    symbol1: "$",
                    symbol2: "€",
                },
            ]
        }


        this.fillBookmarksList();

        this.addBookmark = this.addBookmark.bind(this);
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.setCurrency = this.setCurrency.bind(this);

        this.dropDown = document.getElementsByClassName('dropdown-item');
        this.setCurrency(this.dropDown);

        document.getElementById("convert-button").onclick = this.addBookmark;

    }

    addBookmark(event){
        event.preventDefault();
        this.firstC = document.getElementById("firstCurrency").innerHTML;
        this.secondC = document.getElementById("secondCurrency").innerHTML;
        const refFirst = this.firstC;
        const refSecond = this.secondC;
        if (this.firstC != "Dropdown button" && this.secondC != "Dropdown button")
        {
            const amountConvert = document.getElementById("amount").value;
            fetch(`https://api.currencyapi.com/v3/currencies?apikey=cur_live_doGAwsZzpaR2bScpKRVS8BlRJorasS18YYUV9w9c&currencies=EUR%2CUSD%2CCAD%2CJPY%2CGBP%2CAUD%2CCAD%2CCHF%2CHKD%2CNZD`)
                .then (responce => responce.json())
                .then (data => {
                    console.log(this.firstC);
                    console.log(this.secondC);
                    console.log(data);
                    //const s1 = data.USD.symbol;
                    //const s2 = data[this.secondC][symbol];
                    // ^ This is another bug, whenever I tried to asign data to anthing in the first API call it would immidiately skip the second API call and log the console error for failing to retrieve data
                    fetch(`https://api.currencyapi.com/v3/latest?apikey=cur_live_doGAwsZzpaR2bScpKRVS8BlRJorasS18YYUV9w9c&currencies=${this.secondC}&base_currency=${this.firstC}`)
                        .then (responce => responce.json())
                        .then (data => {
                            console.log(data);
                            
                            /*
                            const rate = data[secondC][value];
                            const am2 = amountConvert * rate;
                            ^ This is where the bug I talked about in my email happened, without being able to reference the converson rate from the data (listed as value in the returned data)
                            I could not get the converson rate or the second amount.
                            */

                            const newBookmark = {
                                currency1: this.firstC, 
                                currency2: this.secondC,
                                amount1: amountConvert,
                                //amount2: am2, 
                                //conversonRate: rate,
                                //symbol1: s1,
                                //symbol2: s2,
                                amount2: "default",
                                conversonRate: "default",
                                symbol1: '$',
                                symbol2: '$',
                            };
                            console.log(newBookmark);
                            this.bookmarks.push(newBookmark);
                            this.fillBookmarksList();
                            //document.querySelector('.bookmark-form').reset();
                            // ^ This is apperently broken now too, it had been working perfectly fine untill right before I was about to turn this in.
                        })
                })
                .catch(error => {
                    console.log('There was a problem getting info!')
                });
        }
        else {
            alert("Please Choose a Currency");
        }
    }

    addEventHandlers(){
        const deleteBookmarks = document.getElementsByName("deleteBookmark");
        for (let i = 0; i < deleteBookmarks.length; i++) {
            deleteBookmarks[i].onclick = this.deleteBookmark.bind(this, i);
        }

    }

    fillBookmarksList(){
        localStorage["bookmarks"] = JSON.stringify(this.bookmarks);
        let bookmarksHtml = this.bookmarks.reduce(
            (html, bookmark) => html += this.generateBookmarkHtml(bookmark), ''
            )
        document.getElementById("bookmark-list").innerHTML = bookmarksHtml;
        this.addEventHandlers();
    }

    generateBookmarkHtml(bookmark){
        return `
        <div class="bookmarks-list" id="bookmark-list">
            <div class="bookmark">
                <div class="title">${bookmark.symbol1}${bookmark.amount1} ${bookmark.currency1} Converts to:<br>
                ${bookmark.symbol2}${bookmark.amount2} ${bookmark.currency2}. The converson rate is: ${bookmark.conversonRate}
                </div>
                <div><i name="deleteBookmark" class="bi-trash delete-icon"></i></div>
            </div>
        </div>
        `;
    }

    deleteBookmark(index, event){
        event.preventDefault();
        this.bookmarks.splice(index, 1);
        this.fillBookmarksList();
    }

    setCurrency(dropDown){
        for(let i = 0; i < dropDown.length; i++) {
            this.dropDownIndex = dropDown[i];
            this.dropDownIndex.onclick = function () {
                  this.btn = this.parentNode.parentNode.parentNode.getElementsByTagName('a')[0];
                  this.btn.innerHTML = this.innerHTML;
            }
        }
    }
}
let currency;
window.onload = () => { currency = new Currency();}

