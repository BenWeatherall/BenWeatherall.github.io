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
    res += `<a href=${link['link']}>${link['title']}</a></br>`
  }); 
  return res;
}

function BuildProjectHighlights(path){
  $('#project-highlights').empty();
  $.getJSON(path, function(json) {
    json['projects'].forEach((project) => {
      if('highlight' in project){
        $('#project-highlights').append(
          `<div class="project-container project-card">
          <img
            src=${project['image']}
            alt=${project['alt-text']}
            loading="lazy"
            class="project-pic"
          />
          <h3 class="project-title">${project['title']}</h3>
          <p class="project-details">
          ${project['brief']}
          </p>
          <a href="projects.html#${project['section-title']}" target="_blank" class="project-link">Check it Out</a>
          </div>`
        );  
      }
    });
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

function BuildAboutMe(path){
  $('#about-me-brief').empty();
  $('#about-me').empty();
  
  $.getJSON(path, function(json) {
    $('#about-me-brief').append(`
    <p>${json['about-brief']}</p>`);

    $('#about-me').append(`
    <h2>More About Me</h2>
    <p>${json['about']}</p>`);
  });
}

function BuildSkillsBrief(path){
  $('#skills-brief').empty();
  $.getJSON(path, function(json) {

    iconsPerLine = 4;
    // Sections
    let lines = Math.ceil(json['skills-brief'].length / iconsPerLine);

    let skillsHTML = ``;
    let ordinal = '';
    for(let lineIDX = 0; lineIDX < lines; lineIDX++){
      switch(lineIDX){
        case 0:
          ordinal = 'first';
          break;
        case 1:
          ordinal = 'second';
          break;
        case 2:
          ordinal = 'third';
          break;
        case 3:
          ordinal = 'fourth';
          break;
        default:
          ordinal = "";
      }

      skillsHTML += `<div class="${ordinal}-set animate__animated animate__pulse">`;
      for(let iconIDX = 0; iconIDX < iconsPerLine; iconIDX++){
        skillIDX = lineIDX * iconsPerLine + iconIDX;
        if(skillIDX >= json['skills-brief'].length){
          break;
        }
        skillsHTML += `<img
          src="assets/icons/skills/${json['skills-brief'][skillIDX].toLowerCase()}-icon.svg"
          alt=""
          loading="lazy"
          class="icon icon-card"
        />`
      }
      skillsHTML += `</div>`;
    }

    $('#skills-brief').append(skillsHTML);
  });
}

function BuildMainPage(){
  BuildProjectHighlights('./assets/json/projects.json');
  BuildAboutMe('./assets/json/me.json');
  BuildSkillsBrief('./assets/json/me.json');
}