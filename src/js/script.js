"use strict";
window.addEventListener("DOMContentLoaded", function() {
  class Cards{
    constructor({productsSelector, subspeciesSelector}) {
      this.products = document.querySelector(productsSelector);
      this.subspecies = document.querySelector(subspeciesSelector);
    }

    async request(url) {
      const res = await fetch(url);

      if(!res.ok){
        throw Error(`there was a problem with url ${url}`);
      }else{
        return await res.json()
      }
    }

    async render() {
      this.request("bd/goods.json")
      .then(info => {
        try{
          this.subspecies.innerHTML = "";
          this.products.innerHTML = "";

          info.goods.forEach(({name, isUnderSpecies, items}) => {
            if(isUnderSpecies){
              this.subspecies.innerHTML += `
              <div class="goods__item">
                <h2 class="title title_goods">${name}</h2>
                <ul class="goods__list"></ul>
              </div>`;

              const lastListElement = this.subspecies.children[this.subspecies.children.length-1].querySelector(".goods__list");
              items.forEach(({logoSrc, name}, i ,array) => {
                //не враховуючи останій елемент
                if(array.length - 1 != i){
                  lastListElement.innerHTML += `
                  <li class="goods__card-kind">
                    <div class="img_290">
                      <img src="${logoSrc}" alt="photo">
                    </div>
                    <h3 class="title title__card">${name}</h3>
                  </li>`;
                }
              });
            }else{
              this.products.innerHTML += `
              <div class="goods__item">
                <h2 class="title title_goods">${name}</h2>
                <div class="goods__list"></div>
              </div>`;

              const lastListElement = this.products.children[this.products.children.length-1].querySelector(".goods__list");
              items.forEach(({logoSrc, logoFirmSrc, mark, name, price, lastPrice, discountPercentage}) => {
                let lastCost = lastPrice || "",
                    classCard = "";

                (lastCost !== "")? lastCost = lastCost + " р": "";
                (discountPercentage)? classCard = "discount": "";

                // favorite
                lastListElement.innerHTML += `
                <a href="#" class="goods__card ${classCard}">
                  <div class="goods__hearts">
                    <div class="img_20 heart">
                      <img src="icons/heart/heart-black.svg" alt="">
                    </div>
                    <div class="img_20 painted">
                      <img src="icons/heart/heart-painted-black.svg" alt="">
                    </div>
                  </div>
                  <div class="goods__firm img_30">
                    <img src="${logoFirmSrc}" alt="">
                  </div>
                  <div class="goods__header">
                    <img src="${logoSrc}" alt="">
                  </div>
                  <div class="goods__body">
                    <div class="goods__info">
                      <h3 class="title title_card">${name}</h3>
                      <div class="goods__star">
                        <div class="img_20">
                          <img src="icons/star.svg" alt="star">
                        </div>
                        <div class="goods__number">${mark}</div>
                      </div>
                    </div>
                    <div class="goods__price">
                      <div class="goods__cost">${price} р</div>
                      <div class="goods__last-price">${lastCost}</div>
                    </div>
                    <div class="goods__discount">-20%</div>
                  </div>
                </a>`;
              });
            }
          });
        }catch(e){}
      });
    }
  }

  new Cards({
    productsSelector: ".goods__products",
    subspeciesSelector: ".goods__subspecies"
  }).render()
});