// !Polifilling async functions
import "regenerator-runtime/runtime";
import "core-js/stable";
import spinner from "./spinner.js";

(function () {
  let inputAyat = document.querySelector(`.kepala`);
  let dataTittle = document.querySelector(`select`);
  let pasalsss = document.querySelector("select.pasal");

  let repet = false;
  class MainApp {
    dataKtab;
    hasilKitab;
    kitab;
    html;
    chapter;
    dataaja;
    KitabJoin;

    constructor(dataTitle, pasals) {
      this.dataTitle = dataTitle;
      this.pasals = pasals;

      window.addEventListener(`load`, this._apiAlkitab(this.dataTitle, 1));
      dataTittle.addEventListener(`change`, this._dataValue.bind(this));
      pasalsss.addEventListener(`change`, this._pasals.bind(this));
    }
    #judul(data) {
      let tittle = `<p class="judul">${data.title}</p>`;
      inputAyat.insertAdjacentHTML(`beforeend`, tittle);
    }

    #kitab(datanya) {
      this.kitab = `
      <option value="${datanya.abbreviation}">${datanya.book_name}</option>
      `;
      dataTittle.insertAdjacentHTML(`beforeend`, this.kitab);
    }

    #pasall(pasal) {
      this.chapter = `
      <option value="${pasal}">${pasal}</option> 
      `;
      pasalsss.insertAdjacentHTML(`beforeend`, this.chapter);
    }
    #_htmlInput(datanya) {
      this.html = `<section class="ayat">
      <table>
        <tbody>
          <tr> 
            <td class="nomor">${datanya.verse}.</td>
            <td class="jarak">&nbsp</td>
            <td class="teks">${datanya.content}</td>
          </tr>
        </tbody>  
      </table> 
    </section>`;
      inputAyat.insertAdjacentHTML("beforeend", this.html);
    }

    async _getJson(url, pesanError = `Sever Tidak Konek`) {
      let data = await fetch(url);

      if (!data.ok)
        throw new Error(`${pesanError} ${data.status} coba lagi nanti`);
      return await data.json();
    }

    _clear() {
      inputAyat.innerHTML = ``;
    }
    _spinner() {
      let datas = this.spinnerRender();
      this._clear();
      inputAyat.insertAdjacentHTML("afterbegin", datas);
    }

    spinnerRender() {
      return ` 
            <div class="spinner"> 
            <svg>
            <path d="M11 2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 18v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4.223 5.637l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM15.533 16.947l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM2 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM18 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.637 19.777l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM16.947 8.467l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
            </svg>
          </div> `;
    }

    async _apiAlkitab(kitap, pasal) {
      try {
        this._spinner();
        this.dataaja = await Promise.all([
          this._getJson(
            `https://api-alkitab.herokuapp.com/v2/passage/${kitap}/${pasal}?ver=tb`
          ),
          this._getJson(`https://api-alkitab.herokuapp.com/v2/passage/list`),
        ]);
        this._clear();
        if (!repet) {
          for (let coba of this.dataaja[1].passage_list) {
            this.#kitab(coba);
            repet = true;
          }

          for (let i = 0; i < 50; i++) this.#pasall(i + 1);
        }
        this.#judul(this.dataaja[0]);
        for (let ayat of this.dataaja[0].verses) this.#_htmlInput(ayat);
      } catch (err) {
        alert(`Tidak Bisa Konek ${err}`);
        throw err;
      }
    }

    _dataValue() {
      inputAyat.innerHTML = "";
      pasalsss.innerHTML = "";
      this.dataKtab = dataTittle.value;
      this.hasilKitab = this.dataKtab.split(" ");
      this.KitabJoin = this.hasilKitab.join("");
      for (let x of this.dataaja[1].passage_list)
        if (x.abbreviation === this.dataKtab)
          for (let i = 0; i < x.total_chapter; i++) this.#pasall(i + 1);

      return this._apiAlkitab(this.KitabJoin, 1);
    }

    _pasals() {
      inputAyat.innerHTML = "";
      let hasil = document.querySelector(`.pasal`);
      this.dataFitur();
      return this._apiAlkitab(this.KitabJoin, +hasil.value);
    }
  }

  new MainApp(`kej`, 1);
})();
