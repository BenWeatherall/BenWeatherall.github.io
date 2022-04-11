// scroll to top functionality
const scrollUp = document.querySelector("#scroll-up");

scrollUp.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});


// Nav hamburgerburger selections
const burger = document.querySelector("#burger-menu");
const ul = document.querySelector("nav ul");
const nav = document.querySelector("nav");

burger.addEventListener("click", () => {
    ul.classList.toggle("show");
  });

// Close hamburger menu when a link is clicked

// Select nav links
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((link) =>
  link.addEventListener("click", () => {
    ul.classList.remove("show");
  })
);

function BuildLinkElement(linksObject){
  let res = ""; 
  linksObject.forEach((link) => {
    res += `<a href="${link['link']}>${link['title']}</a></br>"`
  }); 
  return res;
}

function BuildProjectHighlights(path){
  $('#project-highlights').empty();
  $.getJSON(path, function(json) {
    json['projects'].forEach((project) => {
      if('highlight' in project){
        $('#projects-container').append(
        `<div class="all-project-container project-card">
        <div class="project-card-left">
        ${'image' in project ? `
          <img
            src=${project['image']}
            alt=${project['alt-text']}
            loading="lazy"
            class="all-project-pic"
          />` : ``}  
          <p>
            <strong>Year: </strong>${project['start-year']}${project['on-going']? '-' : ''}</br>
            <strong>Organisation: </strong>${project['organisation']}</br>
            ${'languages' in project ? `
            <strong>Languages: </strong> ${project['languages'].join(', ')}
            </br>` : ``}
            ${'technologies' in project ? `
            <strong>Technologies: </strong> ${project['technologies'].join(', ')}
            </br>` : ``}
            ${'links' in project ? `
            <strong>Links: </strong></br>
            ${BuildLinkElement(project['links'])}` : ``}
          </p>
        </div>
        <div class="project-card-right">
          <h3 class="all-project-title">${project['title']}</h3>
          <p class="all-project-details">
          ${project['details']} 
          </p>
        </div>
        </div>`);  
      }
    })
  });  
}

function BuildProjects(path){
  $('#projects-container').empty();
  $.getJSON(path, function(json) {
    json['projects'].forEach((project) => {
      $('#projects-container').append(
      `<div class="all-project-container project-card">
      <div class="project-card-left">
      ${'image' in project ? `
        <img
          src=${project['image']}
          alt=${project['alt-text']}
          loading="lazy"
          class="all-project-pic"
        />` : ``}  
        <p>
          <strong>Year: </strong>${project['start-year']}${project['on-going']? '-' : ''}</br>
          <strong>Organisation: </strong>${project['organisation']}</br>
          ${'languages' in project ? `
          <strong>Languages: </strong> ${project['languages'].join(', ')}
          </br>` : ``}
          ${'technologies' in project ? `
          <strong>Technologies: </strong> ${project['technologies'].join(', ')}
          </br>` : ``}
          ${'links' in project ? `
          <strong>Links: </strong></br>
          ${BuildLinkElement(project['links'])}` : ``}
        </p>
      </div>
      <div class="project-card-right">
        <h3 class="all-project-title">${project['title']}</h3>
        <p class="all-project-details">
        ${project['details']} 
        </p>
      </div>
      </div>`);  
    })
  });
}