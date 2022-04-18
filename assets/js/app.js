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
          <a href="projects.html#${project['section-title']}" target="_self" class="project-link">Check it Out</a>
          </div>`
        );  
      }
    });

    $('#project-highlights').append(
      `<div class="project-container project-card">
      <img
        src="./assets/images/projects.png"
        alt="projects"
        loading="lazy"
        class="project-pic"
      />
      <h3 class="project-title">All Projects</h3>
      <p class="project-details">
      Listing of all my major profession projects. Please see my github for personal projects.
      </p>
      <a href="projects.html" target="_self" class="project-link">Check them out</a>
      </div>`
    );  
  });
}

function BuildProjects(path){
  $('#projects-container').empty();
  $.getJSON(path, function(json) {
    json['projects'].forEach((project) => {
      $('#projects-container').append(
      `<div class="all-project-container project-card" id=${project['section-title']}>
      <div class="project-card-left">
      ${'image' in project ? `
        <img
          src=${project['image']}
          alt=${project['alt-text']}
          loading="lazy"
          class="all-project-pic"
        />` : ``}
        ${'video' in project ? `
        <video autoplay="true" loop style="max-width: 65%; height: auto;">
          <source src="${project['video']['video']}" type="video/mp4">
        </video>` : ``}
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
      
      if(('#'+project['section-title']) == window.location.hash){
        ScrollToID(project['section-title']);
      }
    });
    
  });
}

function BuildAboutMe(path){
  $('#about-me-brief').empty();
  
  $.getJSON(path, function(json) {
    $('#about-me-brief').append(`
    <p>${json['about-brief']}</p>`);
  });
}

function BuildExtendedAbouMe(path){
  $('#about-me-personality').empty();
  $('#about-me-career').empty();

  $('#skills-languages').empty();
  $('#skills-technologies').empty();

  $('#education').empty();

  $.getJSON(path, function(json) {
    $('#about-me-personality').append(`${json['about']['personality']}`);

    json['about']['career'].forEach((paragraph) => {
      $('#about-me-career').append(paragraph);
    })

    let languages = `<ul>`;
    json['skills']['languages'].forEach((language) => {
      languages += `<li>${language}</li>`;
    })
    languages += `</ul>`;
    $('#skills-languages').append(languages);

    let technologies = `<ul>`;
    json['skills']['technologies'].forEach((technology) => {
      technologies += `<li>${technology}</li>`;
    })
    technologies += `</ul>`;
    $('#skills-technologies').append(technologies);

    json['education'].forEach((education) => {
      $('#education').append(`
      <div class="all-project-container project-card">
        <p>
          <strong>Year: </strong>${education['start-year']}${education['on-going']? ' - ' : ''}${education['end-year'] && education['end-year'] != education['start-year']? `-${education['end-year']}` : ''}</br>
          <strong>Program: </strong>${education['study-name']}</br>
          <strong>Provider: </strong>${education['provider']}</br>
          <strong>Objective: </strong>${education['description']}</br>          
        </p>
      </div>
      `);
    });
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

function ScrollToID(IDStr){
  el = document.getElementById(IDStr);
  if('scrollIntoView' in el){
    el.scrollIntoView(true);
  }
  
}

function BuildMainPage(){
  BuildProjectHighlights('./assets/json/projects.json');
  BuildAboutMe('./assets/json/me.json');
  BuildSkillsBrief('./assets/json/me.json');
}

function BuildProjectsPage(){
  BuildProjects('./assets/json/projects.json');
}

function BuildBioPage(){
  BuildExtendedAbouMe('./assets/json/me.json');
}