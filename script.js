
const apiUrl = 'https://api.strem.io/addonscollection.json?cacheBreak=' + Date.now()

let addonNames = ''
const addonUrls = {}

fetch(apiUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(response => {
  if (Array.isArray(response) && response.length) {
    response.forEach(el => {
      if (((el || {}).manifest || {}).name)
        addonUrls[el.manifest.name] = el.transportUrl
    })
    addonNames = ':' + Object.keys(addonUrls).join('::') + ':'
  }
}).catch(err => {
  addonNames = '::'
  console.error(err)
  alert((err || {}).message || 'Could not get response from API, please try again later')
})

function search(src) {
  const searchResults = []
  const rx = new RegExp(':([^:]*'+src+'[^:]*):','gi')
  let i = 0
  while (result = rx.exec(addonNames)) {
      searchResults.push(result[1])
      i += 1
      if (i >= 10)
          break;
  }
  if (searchResults.length)
    $('#search-results').html(searchResults.map((el, ij) => { return '<div class="addon-result' + (!ij ? ' addon-result-first' : '') + '" onclick="copyLink(event, \''+addonUrls[el]+'\')"><b>'+el+'</b><br/>'+addonUrls[el]+'</div>' }).join(''))
  else 
    $('#search-results').html('')
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#publishForm').addEventListener('submit', function(e) {
    e.preventDefault()
    search(document.getElementById('searchString').value)
    return false
  })
})

function copyLink(ev, link) {
  ev.preventDefault()
  window.prompt("Copy Addon URL Clipboard: Ctrl+C, Enter", link)
}
