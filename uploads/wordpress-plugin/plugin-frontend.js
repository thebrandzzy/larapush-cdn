img = document.createElement('img')
img.src = "https://raw.githubusercontent.com/larapush/larapush/main/ads/timeToCleanupYourPanel.gif"
img.style.width='100%'
img.style.maxWidth='800px'
img.style.marginBottom = "10px"

div = document.createElement('div')
div.style.display = "flex"
div.style.justifyContent = "center"
div.append(img)

document.querySelector('main').prepend(div)