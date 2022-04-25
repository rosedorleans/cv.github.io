$(document).ready(function(){
  $(".home-body").onepage_scroll({
  sectionContainer: "section",
  responsiveFallback: 600,
  loop: false
  });
});
 
$(".arrow-down").hide(); 
setTimeout(function(){ 
	$(".arrow-down").show(); 
},3000); 


$("#contact-btn").on( "click", function() {
  $("html").css("overflow", 'hidden')
  $('#contact-modal').css('opacity', '1')
  setTimeout(function(){ 
    $("#contact-modal").css('opacity', '0')
  },5000); 
});

$("#autobonplan-btn").on( "click", function() {
  modalId = '#autobonplan-modal'
  openModal(modalId)
  var abp_video = $('#abp_video')
  if (window.matchMedia('(max-width: 825px)').matches) {
    abp_video.attr('src', 'videos/pres-abp-mobile.mp4').addClass('video-mobile')
    $('#pres-abp-text').html(
      'Présentation de la page d\'accueil et la page Admin du site interne Autobonplan en version mobile.<br>'+
      'Le modal permet de gérer la transaction du véhicule : changer sa catégorie, lui ajouter des fichiers...<br>'+
      '<span>(Les données privées sont coupées - Durée: 53s)</span><br>')
  } else {
    abp_video.attr('src', 'videos/pres-abp.mp4').addClass('video-desktop')
    $('#pres-abp-text').html(
      'Présentation de la page d\'accueil et la page Admin du site interne Autobonplan.<br>'+
      'Le modal permet de gérer la transaction du véhicule : changer sa catégorie, lui ajouter des fichiers...<br>'+
      '<span>(Les données privées sont floutées - Durée: 1min08)</span><br>')
  }
});
$("#autobonplan-close").on( "click", function() {
  modalId = '#autobonplan-modal'
  closeModal(modalId)
  $('#abp_video').attr('src', '').removeClass('video-desktop, video-mobile')
  $('#pres-abp-text').empty()
});
$("#irss-btn").on( "click", function() {
  modalId = '#irss-modal'
  openModal(modalId)
});
$(".irss-close").on( "click", function() {
  modalId = '#irss-modal'
  closeModal(modalId)
});

function openModal(modalId){
  $(modalId).css('display', 'flex')
  $('.demo-logo').css('display', 'none')
}

function closeModal(modalId){
  $(modalId).css('display', 'none')
  $('.demo-logo').css('display', 'block')
}

// === Vars ===

const elementsToObserve = document.querySelectorAll('.cv_section[id]'),
			visibleClass = 'visible',
      nav = document.querySelector('nav'),
      navPath = nav.querySelector('svg path'),
      navListItems = [...nav.querySelectorAll('li')],
      navItems = navListItems.map(listItem => {

          const anchor = listItem.querySelector('a'),
                targetID = anchor && anchor.getAttribute('href').slice(1),
                target = document.getElementById(targetID);

          return { listItem, anchor, target };

        })
        .filter(item => item.target);

// === Functions ===

function drawPath() {

    let path = [], 
        pathIndent;
  
    navItems.forEach((item, i) => {
      const x = item.anchor.offsetLeft - 5,
            y = item.anchor.offsetTop,
            height = item.anchor.offsetHeight;
  
      if(i === 0) {
        
        path.push('M', x, y, 'L', x, y + height);
        item.pathStart = 0;
  
      } else {
        
        if(pathIndent !== x)
          path.push('L', pathIndent, y);
        
        path.push('L', x, y);
        
        navPath.setAttribute('d', path.join(' '));
        item.pathStart = navPath.getTotalLength() || 0;
        path.push('L', x, y + height);  
      }
      
      pathIndent = x;
      navPath.setAttribute('d', path.join(' '));
      item.pathEnd = navPath.getTotalLength();
    });
}
  
function syncPath() {
    
    const someElsAreVisible = () => 
            nav.querySelectorAll(`.${visibleClass}`).length > 0,
          thisElIsVisible = el =>
            el.classList.contains(visibleClass),
          pathLength = navPath.getTotalLength();
  
    let pathStart = pathLength,
        pathEnd = 0,
        lastPathStart,
        lastPathEnd;
    
    navItems.forEach(item => {
      if(thisElIsVisible(item.listItem)) {
        pathStart = Math.min(item.pathStart, pathStart);
        pathEnd = Math.max(item.pathEnd, pathEnd);
      }
    });
  
    if(someElsAreVisible() && pathStart < pathEnd) {
      
      if(pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
        
        const dashArray = `1 ${pathStart} ${pathEnd - pathStart} ${pathLength}`;
        
        navPath.style.setProperty('stroke-dashoffset', '1');
        navPath.style.setProperty('stroke-dasharray', dashArray);
        navPath.style.setProperty('opacity', 1);
          }
          
    } else { 
      navPath.style.setProperty('opacity', 0);
    }
      
    lastPathStart = pathStart;
    lastPathEnd = pathEnd;
}
  
function markVisibleSection(observedEls) {
    
    observedEls.forEach(observedEl => {
      
      const id = observedEl.target.getAttribute('id'),
          anchor = document.querySelector(`nav li a[href="#${ id }"]`);
      
      if(!anchor)
        return false
      
      const listItem = anchor.parentElement
  
      if (observedEl.isIntersecting) {
        listItem.classList.add(visibleClass)
      } else {
        listItem.classList.remove(visibleClass)
      }
      syncPath()
    }); 
}
  
// === Draw path and observe ===
  
drawPath()
  
const observer = new IntersectionObserver(markVisibleSection);
elementsToObserve.forEach(thisEl => observer.observe(thisEl));
  

$('#dark-light').on('change', function() {

    if($('body').css('background-color') == 'rgb(255, 255, 255)'){
        $('body').css({
                    'background-color': '#000',
                    'transition': '0.8s',
                    'color': '#FFF'
                });
    } else {
        $('body').css({
                    'background-color': '#FFF',
                    'transition': '0.8s',
                    'color': '#000'
                });
    }
});



// Carte interactive

const map = document.querySelector('.map')
const paths = map.querySelectorAll('.map-image a')
const links = map.querySelectorAll('.map-text a')

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = function (callback) {
        [].forEach.call(this, callback)
    }
}

const activeArea = function (id) {
    map.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active')
    })
    if (id !== undefined) {
        document.querySelector('#btn-' + id).classList.add('is-active')
        document.querySelector('#list-' + id).classList.add('is-active')
    }
}

paths.forEach(function (path) {
    path.addEventListener('mouseenter', function () {
        const id = this.id.replace('btn-','' )
        activeArea(id)
    })
})

links.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
        const id = this.id.replace('list-','' )
        activeArea(id)
    })
})

map.addEventListener('mouseover', function () {
    activeArea()
})


