let mainMenuTrigger = document.querySelector('.menu-triger')
let mainMenuContainer = document.querySelector('.main-menu-container')
mainMenuTrigger.addEventListener('click', function(){
  mainMenuContainer.classList.toggle('main-menu-opened')
})
/*
let allComments = ['Цей кадр нереально крутий! :)',
        'Ти вмієш дивувати! Кожен кадр - поєднання життєлюбності і краси',
        'Спинися мить, прекрасна ти!',
        'Просто супер! Як тобі це вдається?',
        'Це прото шедевр мистецтва',
        'В цьому штучному світі так приємно знайти щось натуральне))',
        'Клас!!!))',
        'Нереально чудово!',
        'А ти вмієш дивувати ;)',
        'Це фото так і проситься в рамочку на стіну']
let allDescriptions = ['Коли радості немає меж',
            'Любов в кожному пікселі',
            'Фото заряджене позитивом',
            'Зловив дзен',
            'Як мало потрібно для щастя',
            'Знали б ви що в мене на умі! ;)',
            'Show must go on',
            'Good vibes only',
            'My inspiration',
            'On my way to paradise',
            'Що це, якщо не любов? Х)'
            ]

function getRandomElement(array){
  return array[Math.floor(Math.random() * (array.length - 1))]
}

function generatePictureDB(amount){
  let pictures=[]
  for(let i = 0; i < amount; i++){
    let comments = []
    for(let j = 0; j < Math.floor(Math.random() * 4); j++){
      comments.push(getRandomElement(allComments))
    }
    let pictureExample = {
      src: `../static/img/${i}.jpg`,
      likes: Math.floor(Math.random() * 100),
      comments: comments,
      commentsNumber: comments.length,
      effect: `none(0%)`,
      description: getRandomElement(allDescriptions),
    }
    pictures.push(pictureExample)
  }
  return pictures
}

let picturesDB = generatePictureDB(26)
*/
function setEffectLevel(effect){
	let effectLevel= document.querySelector('#effectLevel')
	let pin = document.querySelector('.effectLevelPin')
	let line = document.querySelector('.effectLevelLine')
	let progressLine = document.querySelector('.effectLevelProgressLine')
	let uploadImage = document.querySelector('.uploadImage')
	pin.style.left = 0
	progressLine.style.width = 0
	effectLevel.value = 0
	uploadImage.style.filter = `${effect}(0)`
	pin.addEventListener('mousedown',function(evt){
		evt.preventDefault()
		document.addEventListener('mouseup', onMouseUp)
		document.addEventListener('mousemove', onMouseMove)

		function onMouseMove(){
			if(effect == 'none'){
				pin.style.left = 0
				progressLine.style.width = 0
				effectLevel.value = 0
				uploadImage.style.filter = `${effect}(0)`
			}
			else{
				let newLeft = evt.clientX - line.getBoundingClientRect().left
				if(newLeft < 0){
					newLeft = 0
				}
				if(newLeft > line.offsetWidth){
					newLeft = line.offsetWidth
				}
				pin.style.left = newLeft + 'px'
				progressLine.style.width = newLeft + 'px'
				effectLevel.value = Math.floor(newLeft / line.offsetWidth * 100)
				uploadImage.style.filter = `${effect}(${effectLevel.value}%)`
			}
		}

		function onMouseUp(){
			document.removeEventListener('mouseup', onMouseUp)
			document.removeEventListener('mousemove', onMouseMove)
		}
	})
}

function getPhotos(){
	let xhr = new XMLHttpRequest()
	xhr.open('GET', '/api/photos/all')
	xhr.responseType = 'json'
	xhr.send()
	xhr.onload= function(){
		console.log = (xhr.response)
		showPictures(xhr.response)
	}
}
getPhotos()
/*
function showOnePhoto(){
	let xhr = new XMLHttpRequest()
	xhr.open('GET','/api/photos/one')
	xhr.responseType = 'json'
	xhr.send()
	xhr.onload = function(){
		console.log = (xhr.response)
		showCheckedPicture(xhr.response)
	}
}
showOnePhoto()*/

function showPictures(photosArray){
  let pictureTemplate = document.querySelector('#templatePictureExample')
  let pictureExample = pictureTemplate.content.querySelector('.pictureExample')
  let picturesContainer = document.querySelector('.picturesContainer')
  for(let i = 0; i < photosArray.length; i++){
    let photoBlock = pictureExample.cloneNode(true)
    photoBlock.querySelector('.pictureImg').src = photosArray[i].src 
    photoBlock.querySelector('.pictureComments').innerText = photosArray[i].commentsNumber 
    photoBlock.querySelector('.pictureLikes').innerText = photosArray[i].likes
    photoBlock.querySelector('.pictureImg').style.filter = photosArray[i].effect
    picturesContainer.append(photoBlock)
  }
}
//showPictures(picturesDB)

function showCheckedPicture(picture){
  let pictureContainer = document.querySelector('.openedPictureContainer')
  pictureContainer.querySelector('.openedPictureImg').src = picture.src 
  pictureContainer.querySelector('.openedPictureImg').style.filter = picture.effect 
  pictureContainer.querySelector('.openedPictureDescription').innerText = picture.description
  pictureContainer.querySelector('.pictureComments').innerText = picture.commentsNumber
  pictureContainer.querySelector('.pictureLikes').innerText = picture.likes
  let commentsTemplate = document.querySelector('#templateCommentBlock')
  let commentBlock = commentsTemplate.content.querySelector('.commentBlock')
  let pictureCommentsContainer = document.querySelector('.pictureCommentsContainer')
  for(let i = 0; i < picture.commentsNumber; i++){
    let comment = commentBlock.cloneNode(true)
    comment.querySelector('.commentText').innerText = picture.comments[i]
    pictureCommentsContainer.append(comment)
  }
  pictureContainer.classList.remove('hidden')
}


let picturesContainer = document.querySelector('.picturesContainer')
picturesContainer.addEventListener('click', function(evt){
	let checkedElement = evt.target
	if(checkedElement.classList.contains('pictureImg')){
		/*for(let i = 0; i < picturesDB.length; i++){
			if(picturesDB[i].src === checkedElement.getAttribute('src')){*/
		showCheckedPicture()



	}
})

let closeButton = document.querySelector('.closeButton')
closeButton.addEventListener('click', function(){
	document.querySelector('.openedPictureContainer').classList.add('hidden')
	document.querySelector('.pictureCommentsContainer').innerHTML = ""
})

let inputUploadFile = document.querySelector('#inputUploadFile')
inputUploadFile.addEventListener('change', function(){
	if(inputUploadFile.files[0].type.includes('image')){
		let reader = new FileReader()
		reader.readAsDataURL(inputUploadFile.files[0])
		reader.addEventListener('load', function(){
			let uploadImage = document.querySelector('.uploadImage')
			uploadImage.src = reader.result
			let uploadEffectPreviews = document.querySelectorAll('.uploadEffectPreview')
			for(let i=0; i < uploadEffectPreviews.length; i++){
				uploadEffectPreviews[i].style.backgroundImage = `url(${reader.result})`
				}
			let uploadImageOverlay = document.querySelector('.uploadImageOverlay')
			uploadImageOverlay.classList.remove("hidden")
		})
	}
	else{
		alert("Оберіть зображення!")
	}
})



