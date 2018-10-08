let projects = [];
let palettes = [];

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
  let projectId;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    });
    projectId = await response.json();
  } catch (error) {
    console.log(error)
  }
  const newProject = Object.assign(project, projectId)
  populateProjectOptions(newProject, palettes)
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
    postPalette(projectId, newPalette);
    $('.palette-error-msg').text('');
  } else {
    $('.palette-error-msg').text('Select a project.')
  }
  for (let i = 0; i < 5; i++) {
    resetLock(i);
  }
};

const postPalette = async (projectId, palette) => {
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
    const updatedPalette = Object.assign({}, palette, paletteId);
    displayPalette(projectId, updatedPalette)
  } catch (error) {
    console.log(error);
  }
};

const populateProjectOptions = (project, palettes) => {
    const { id, name } = project;
    $('#project-dir').append(`<option value='${id}'>${name}</option>`);
    displayProjects(id, name, palettes);
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
    projects.forEach(project => {
      populateProjectOptions(project, palettes);
    })
  } catch (error) {
    console.log(error.message);
  }
};

const getProjectsAndPalletes = async () => {
  palettes = await getPalettes();
  await getProjects(palettes);
};

const displayProjects = (id, name, palettes) => {
  $('.projects-cont').append(`
    <div class="project">
      <h4 class="display-project-name">${name}</h4>
      <div class="display-palettes" id="${id}"></div>
    </div>
  `)
  palettes.forEach(palette => {
    displayPalette(id, palette)
  })
};

const displayPalette = (id, palette) => {
  if (id === palette.project_id) {
    $(`#${id}`).append(`
      <div class="display-palette-cont" id="${palette.id}">
        <div class="palette-select-wrapper">
          <h5>${palette.name}</h5>
          <div class="list-color" style="background-color:${palette.color_1}" value="${palette.color_1}"></div>  
          <div class="list-color" style="background-color:${palette.color_2}" value="${palette.color_2}"></div>  
          <div class="list-color" style="background-color:${palette.color_3}" value="${palette.color_3}"></div>  
          <div class="list-color" style="background-color:${palette.color_4}" value="${palette.color_4}"></div>  
          <div class="list-color" style="background-color:${palette.color_5}" value="${palette.color_5}"></div> 
        </div>
        <img class="del-image" src="../images/delete.svg">
      </div>
    `)
  }
};

const deletePalette = (event) => {
  const id = $(event.target).closest('.display-palette-cont').attr('id');
  const url = `/api/v1/palettes/${id}`;

  try {
    fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
  } catch (error) {
    console.log(error);
  }

  $(event.target).closest('.display-palette-cont').remove();
};

function displaySavedPalette() {
  let colors = []
  $(this).children('.list-color').each(function(){
    colors.push($(this).attr('value'))
  });

  for (let i = 0; i < 5; i++) {
    resetLock(i);
    $(`.color_${i + 1}`).css('background-color', colors[`${i}`]);
    $(`.color_${i + 1}`).children('h3').text(colors[`${i}`]);
  }
};

function resetLock(i) {
  $(`.color_${i + 1}`).children('img').removeClass('saved');
  $(`.color_${i + 1}`).children('img').attr('src', './images/unlocked.svg');
}

$(window).on('load', getProjectsAndPalletes);
$('.generate-btn').on('click', generateRandomPalette);
$('.unsaved').on('click', toggleLockColor);
$('.save-project-btn').on('click', saveProject);
$('.save-palette-btn').on('click', savePalette);
$('.projects-cont').on('click', '.del-image', deletePalette);
$('.projects-cont').on('click', '.palette-select-wrapper', displaySavedPalette);