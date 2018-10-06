let projects = [];

const generateRandomPalette = () => {
  const randomColor = () => "#" + (Math.random().toString(16) + "000000").slice(2, 8).toLocaleUpperCase();
  
  for (let i = 0; i < 5; i++) {
    const newColor = randomColor();

    if (!$(`.color_${i + 1}`).children('img').hasClass('saved')) {
      $(`.color_${i + 1}`).css('background-color', newColor);
      $(`.color_${i + 1}`).children('h3').text(newColor);
    }
  }
};

function toggleLockColor() {
  const unlocked = './images/unlocked.svg';
  const locked = './images/locked.svg';

  $(this).toggleClass('saved');
  $(this).attr('src', $(this).hasClass('saved') ? locked : unlocked);
};

function getColors() {
  let colors = [];

  $('h3').each(function() {
    colors.push($(this).text())
  });
  return colors;
};

const saveProject = (event) => {
  event.preventDefault();
  const projectName = $('#save-project-input').val();
  const newProject = { name: projectName };
  let duplicateProject;
  $('#save-project-input').val('')

  if (projects.length) {
    duplicateProject = projects.find(project => project.name === projectName);
  };

  if (projectName.length && !duplicateProject) {
    postProject(newProject);
    $('.project-error-msg').text('')
  } else {
    $('.project-error-msg').text(`${projectName} already exists, create a new project name.`);
  }
};

const postProject = async (project) => {
  const url = '/api/v1/projects';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    });
    const projectId = await response.json();
  } catch (error) {
    console.log(error)
  }
};

const savePalette = () => {
  const paletteName = $('#save-palette-input').val();
  const projectId = parseInt($('#project-dir').val());
  $('.save-palette-btn').val('');
  const colors = getColors();
  const newPalette = {
    name: paletteName,
    color_1: colors[0],
    color_2: colors[1],
    color_3: colors[2],
    color_4: colors[3],
    color_5: colors[4],
    project_id: projectId
  }
  if (paletteName && projectId) {
    postPalette(newPalette);
    $('.palette-error-msg').text('');
  } else {
    $('.palette-error-msg').text('Select a project.')
  }
};

const postPalette = async (palette) => {
  const url = '/api/v1/palettes';

  try {
    const response = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(palette) 
    });
    const paletteId = await response.json();
  } catch (error) {
    console.log(error);
  }
};

const populateProjectOptions = (projects, palettes) => {
  projects.forEach(project => {
    const { id, name } = project;
    $('#project-dir').append(`<option value='${id}'>${name}</option>`);
    displayProjects(id, name, palettes);
  });
};

const getPalettes = async () => {
  const url = '/api/v1/palettes';

  try {
    const response = await fetch(url);
    const palettes = await response.json();
    return palettes;
  } catch (error) {
    console.log(error.message);
  }
};

const getProjects = async (palettes) => {
  const url = 'api/v1/projects';

  try {
    const response = await fetch(url);
    projects = await response.json();
    populateProjectOptions(projects, palettes);
  } catch (error) {
    console.log(error.message);
  }
};

const getProjectsAndPalletes = async () => {
  const palettes = await getPalettes();
  await getProjects(palettes);
};

const displayProjects = (id, name, palettes) => {
  $('.projects-cont').append(`
    <div class="project">
      <h4>${name}<h4>
      <ul id="${id}"></ul>
    </div>
  `)
  displayPalettes(id, palettes)
};

const displayPalettes = (id, palettes) => {
  palettes.forEach(palette => {
    if (id === palette.project_id) {
      $(`#${id}`).append(`
        <h5>${palette.name}</h5>
        <li class="list-color" style="background-color:${palette.color_1}" value="${palette.color_1}"></li>  
        <li class="list-color" style="background-color:${palette.color_2}" value="${palette.color_2}"></li>  
        <li class="list-color" style="background-color:${palette.color_3}" value="${palette.color_3}"></li>  
        <li class="list-color" style="background-color:${palette.color_4}" value="${palette.color_4}"></li>  
        <li class="list-color" style="background-color:${palette.color_5}" value="${palette.color_5}"></li> 
        <button class="del-palette-btn">X</button> 
      `)
    }
  })
};

$(window).on('load', getProjectsAndPalletes);
$('.generate-btn').on('click', generateRandomPalette);
$('.unsaved').on('click', toggleLockColor);
$('.save-project-btn').on('click', saveProject);
$('.save-palette-btn').on('click', savePalette);