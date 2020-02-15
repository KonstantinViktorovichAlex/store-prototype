(function () {
    const container = document.querySelector('.container')
    const paginationItems = document.querySelector('.paginationItems')
    const trashPage = document.querySelector('.trash-page')
    const containerTrash = document.querySelector('.container-trash')
    const countTrash = document.querySelector('.counter')
    const buttonTrash = document.querySelector('.trash')
    const buttonCloseTrash = document.querySelector('.button-close')
    const checkboxes = document.querySelectorAll('#myCheck')
    const buttonAll = document.querySelector('.all')
    const buttonMin = document.querySelector('.min')
    const buttonMax = document.querySelector('.max')
    const sum = document.querySelector('.sum')

    console.log(sum)

    const _URL = './catalog.json'

    const newData = []

    const getData = async () => {
        const res = await fetch(_URL)
            .then(res => {
                if(res.ok){ 
                    return  res.json()
                }else {
                    throw new Error('data error')
                }
            })
            .then((data) => {
                data.forEach(item => {
                    newData.push(item)
                })
            })
            .catch(err => {
                container.innerHTML = 'Ошибка данных'
                console.log(err)
            })
        paginationsRender(newData, 5)   
        createElements(newData, 5)
    
    }
    getData()

    function paginationsRender (newData, itemPage) {
        paginationItems.innerHTML = `<ul class="pagination paginationItems">
                                    </ul>`
        let countOfPage = newData.length / itemPage
        for(let i = 1; i <= countOfPage; i++) {
            const li = document.createElement('li')
            li.innerHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
            paginationItems.append(li)
        }
        document.querySelectorAll('.page-link').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault()
                let pageNum = +this.innerHTML
                let start = (pageNum - 1) * itemPage
                let end = start + itemPage
                let notes = newData.slice(start, end)
                createElements(notes)
            })
        })
    }

    function createElements (items , elements) {
        container.innerHTML = ''
        items.forEach((item, index) => {
            if(index >= elements) return
            const {id, title, image, descr, price, available} = item
            const bodyCard = document.createElement('div')
            bodyCard.setAttribute('data-price', price)
            bodyCard.classList.add('bodyCard')
            bodyCard.innerHTML += `<div class="card" style="width: 18rem; data-price = ${price}">
                                        <img src="${image}" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <h4 class="card-title title">${title}</h4>
                                            <p class="card-text descr">${descr}</p>
                                            <h5 class="card-title price">цена: ${price}</h5>
                                        </div>
                                        <button type="button" class="btn btn-primary add">В корзину</button>
                                        <div class="card-footer">
                                            <small class="text-muted warehouse">${available ? 'есть в наличии' : 'на данный момент товар отсутствует'}</small>
                                        </div>
                                    </div>`
            container.append(bodyCard)
        })
        addTrash()
    }
    
    function toLocal(){
        let list = containerTrash.innerHTML
        let counter = +countTrash.innerHTML
        localStorage.setItem('trash', list)
        localStorage.setItem('counter', counter)

    }

   let mysum = 0

    function addTrash () {
        const bodyCard = document.querySelectorAll('.bodyCard')
        bodyCard.forEach((card) => {
            card.addEventListener('click', function(e) {
                if(e.target.className === 'btn btn-primary add'){

                    let price = +card.getAttribute('data-price')
                    mysum = mysum + price
                    sum.innerHTML = `итого: ${parseInt(mysum)}`
                    console.log(parseInt(mysum))

                    let count = localStorage.getItem('counter')
                    count++
                    countTrash.innerHTML = count

                    const cloneCard = this.cloneNode(true)
                    
                    cloneCard.classList.remove('bodyCard')
                    cloneCard.classList.add('trashCard')
                    cloneCard.querySelectorAll('.add').forEach(btn => {
                        btn.classList = 'btn btn-primary delete'
                        btn.innerHTML = 'delete'
                    })
                    containerTrash.append(cloneCard)
                    toLocal()
                }
            })
        })   
    }
    
    function removeCardTrash() {
        const trashCard = document.querySelectorAll('.trashCard')

        let count = localStorage.getItem('counter')
    
        trashCard.forEach(item => {
            item.addEventListener('click', function(e){
                if(e.target.className === 'btn btn-primary delete'){

                    let price = +item.getAttribute('data-price')
                    mysum = mysum - price
                    sum.innerHTML = `итого: ${parseInt(mysum)}`

                    count--
                    countTrash.innerHTML = count
                    this.remove()
                    toLocal()
                   
                }
            })
        })
    }

    function removeAllTrash() {
        const btnRemoveAll = document.querySelector('.removeAll').addEventListener('click', () => {
            localStorage.clear()
            containerTrash.innerHTML = ''
            countTrash.innerHTML = localStorage.getItem('counter')
            toLocal()
        })
    }

    function filtredItem (newData, value) {
        let res = []
        if(value === 'warehouse'){
            res = newData.filter(item => {
                if(item.available === true) return true
            })
        }else{
            res = newData.filter((item) => {
                if(item.title === value){
                    return true
                } 
            })
        }
        createElements(res, res.length)
    }

    function filterPriceMin(newData) {
        const res = newData.sort((a, b) => {
            return a.price - b.price
        })
        createElements(res, res.length)
    }
    function filterPriceMax(newData) {
        const res = newData.sort((a, b) => {
            return b.price - a.price
        })
        createElements(res, res.length)
    }

    buttonTrash.addEventListener('click', function () {
        trashPage.classList.add('active-trash')
        removeCardTrash()
    })

    removeAllTrash()

    buttonCloseTrash.addEventListener('click', () => {
        trashPage.classList.remove('active-trash')
    })
    buttonAll.addEventListener('click', () => {
        createElements(newData, 5)
    })
    buttonMin.addEventListener('click', () => {
        filterPriceMin(newData)
    })
    buttonMax.addEventListener('click', () => {
        filterPriceMax(newData)
    })
    checkboxes.forEach(item => {
        item.addEventListener('click', function(){
            if((this.value  && this.checked)){
                filtredItem(newData, this.value)
            }else if(this.value === this.value && this.checked === false) {
                paginationsRender(newData, 5)
                createElements(newData, 5)
            }
        })
    })

    if(localStorage.getItem('trash')){
        containerTrash.innerHTML = localStorage.getItem('trash')  
        removeCardTrash()
    }
    if(localStorage.getItem('counter')){
        countTrash.innerHTML = localStorage.getItem('counter')
    }
    
    



}());