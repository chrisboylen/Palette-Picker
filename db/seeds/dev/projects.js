let projectsData = [{
  name: 'Bingo',
  palettes: [
    {
      name: 'likey_1',
      color_1: '#8EA4D2',
      color_2: '#6279B8',
      color_3: '#49516F',
      color_4: '#2B3842',
      color_5: '#14242B'
    },
    {
      name: 'likey_2',
      color_1: '#8EA4D2',
      color_2: '#6279B8',
      color_3: '#49516F',
      color_4: '#2B3842',
      color_5: '#14242B'
    },
    {
      name: 'likey_3',
      color_1: '#8EA4D2',
      color_2: '#6279B8',
      color_3: '#49516F',
      color_4: '#2B3842',
      color_5: '#14242B'
    },
  ]
}];

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
  .then(projectId => {
    let palettesPromises = [];

    project.palettes.forEach(palette => {
      palettesPromises.push(
        createPalette(knex, {
          ...palette,
          project_id: projectId[0]
        })
      );
    });

    return Promise.all(palettesPromises);
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];
      
      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
