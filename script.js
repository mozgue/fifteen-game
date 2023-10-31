const app = document.getElementById('app')

const size = 4

app.setAttribute('size',size)

const createSquares = () => {
    
    const arr = createPositions(size)

    for (let i = 0; i < size ** 2; i++) {
    
        const square = document.createElement('div')
        square.style.position = 'absolute';

        square.style.top = `${Math.floor(i/size)*100}px`;

        if (i < size) { 
            square.style.left = `${ i * 100 }px` 
        } else if (i < 2 * size) {
            square.style.left = `${( i - size ) * 100 }px` 
        } else if (i < 3 * size) {
            square.style.left = `${( i - 2 * size ) * 100 }px`
        } else if (i < 4 * size) {
            square.style.left = `${( i - 3 * size ) * 100 }px`
        } else if (i < 5 * size) {
            square.style.left = `${( i - 4 * size ) * 100}px`
        } else if (i < 6 * size) {
            square.style.left = `${( i - 5 * size ) * 100}px`
        } else if (i < 7 * size) {
            square.style.left = `${( i - 6 * size ) * 100}px`
        }


        square.classList.add( arr[i] !== size ** 2 - 1 ? 'square' : 'empty-square' )
        square.textContent = arr[i] !== size ** 2 - 1 ? arr[i]+ 1 : null

        square.setAttribute('data-pos',i)
        app.appendChild(square)

    }
}


createSquares()

const squares = document.querySelectorAll('.square')
const graySquare = document.querySelector('.empty-square')


app.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.target.classList.contains('app')) return
    
    
    const grayIndex = +graySquare.attributes['data-pos'].value
    const clickedIndex = +e.target.attributes['data-pos'].value

    if(isMovable(clickedIndex, grayIndex)) {
        moveSquare(clickedIndex)
        checkGameStatus();
    } else {
        console.log('unable to move')
    }

})

document.addEventListener('keydown', (e) => {
    // console.log(e.keyCode)

    let clickedIndex        
    const grayIndex = +graySquare.attributes['data-pos'].value

    switch(e.keyCode) {
        case 37:
            // console.log('left')
            grayIndex % size !== 0 ? clickedIndex = grayIndex - 1 : null 
            break;
        case 38:
            // console.log('top')
            grayIndex > size - 1 ? clickedIndex = grayIndex - size : null
            break;            
        case 39:
            // console.log('right')
            if ((grayIndex + 1) % size !== 0) {
                clickedIndex = grayIndex + 1
            }
            break;                      
        case 40:
            // console.log('bottom')
            grayIndex < size ** 2 - size ? clickedIndex = grayIndex + size : null
            break;                        
    }

    // return

    if(isMovable(clickedIndex, grayIndex)) {
        moveSquare(clickedIndex)
        checkGameStatus();
    } else {
        console.log('unable to move')
    }

})



function isMovable(clickedIndex, grayIndex) {

    if (
        clickedIndex === grayIndex - 1 ||
        clickedIndex === grayIndex + 1 ||
        clickedIndex === grayIndex + size ||
        clickedIndex === grayIndex - size
    ) {
        return true
    }

    return false
}

function moveSquare(clickedIndex) {
    clickedElem = document.querySelector(`.square[data-pos="${clickedIndex}"]`)
    // console.log('clickedElem',clickedElem)

    const newGrayCoords = {
        left: clickedElem.style.left, 
        top: clickedElem.style.top,
        index: +clickedElem.attributes['data-pos'].value
    }
    const newCoords = {
        left: graySquare.style.left, 
        top: graySquare.style.top,       
        index: +graySquare.attributes['data-pos'].value
    }
    

    graySquare.style.top = newGrayCoords.top
    graySquare.style.left = newGrayCoords.left
    graySquare.attributes['data-pos'].value = newGrayCoords.index

    clickedElem.style.top = newCoords.top
    clickedElem.style.left = newCoords.left
    clickedElem.attributes['data-pos'].value = newCoords.index
        
    
    // console.log("moveSquare", newGrayCoords, newCoords)
}

function checkGameStatus() {
    if(isWinGame()) {
        console.log('win!')
        for(let i = 0; i < squares.length; i++) {
            setInterval(() => {squares[i].style.opacity = 0}, 100*i)
        }
        // squares.forEach(square => square.style.opacity = 0)
        setTimeout(showWinMessage, 100*squares.length) 
    }
}

function isWinGame() {

    let isWin = true
    
    squares.forEach((square) => {
        if (+square.attributes['data-pos'].value + 1 !== +square.textContent) {
            console.log('continue game')
            isWin = false
            return
        }
    })
    
    return isWin    
}

function randomInteger(min, max) {
    let rand = Math.random() * (max + 1 - min) + min
    return Math.floor(rand)
}

function createPositions(size = 4) {
    const arr = [], positions = []
    
    for (let i = 0; i < size * size; i++) {
        arr.push(i)
    }
    // return arr
    while (arr.length > 0) { 

        let randomIndex = randomInteger(0, arr.length - 1)

        positions.push(arr[randomIndex])

        arr.splice(randomIndex, 1)

    }
    console.dir(positions)
    return positions

}

const showWinMessage = () => {
    let message = document.createElement('div')
    message.classList.add('win-message')
    
    message.innerHTML = `
        <div class="win-message__title">Вы выиграли!</div>
        <div class="win-message__body">
            <div class="win-message__more">Хотите сыграть еще?</div>
            <button onclick="restartGame()">Да</button> <button disabled>Нет</button>
        </div>
        </div>
    `

    app.appendChild(message)
}

const restartGame = () => {
    window.location = window.location

    // app.innerHTML = ''
    // createSquares()

    // app.removeChild(app.querySelector('.win-message'));

}