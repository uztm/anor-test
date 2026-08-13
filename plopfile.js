import path from 'path'

function createEntityTemplate(plop) {
  // ENTITIES
  plop.setHelper('apiVar', (name) => `${plop.getHelper('camelCase')(name)}Api`)
  plop.setHelper(
    'storeVar',
    (name) => `${plop.getHelper('camelCase')(name)}Store`,
  )
  plop.setHelper(
    'apiFile',
    (name) => `${plop.getHelper('kebabCase')(name)}-api`,
  )
  plop.setHelper(
    'storeFile',
    (name) => `${plop.getHelper('kebabCase')(name)}-store`,
  )
  plop.setHelper(
    'dtoName',
    (name) => `I${plop.getHelper('pascalCase')(name)}DTO`,
  )
  plop.setHelper('className', (name) => plop.getHelper('pascalCase')(name))

  plop.setGenerator('entity', {
    description:
      'Создать структуру сущности (entities) с api/, model/ и index.ts',
    prompts: [
      {
        type: 'input',
        name: 'group',
        message: 'Опциональная группа (например: catalog; можно пусто):',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Имя сущности (например: product):',
      },
    ],
    actions(data) {
      const basePath = path.join(
        'src',
        'entities',
        data.group ? plop.getHelper('kebabCase')(data.group) : '',
        plop.getHelper('kebabCase')(data.name),
      )

      return [
        // API
        {
          type: 'add',
          path: `${basePath}/api/{{apiFile name}}.ts`,
          templateFile: 'plop-templates/entity/api.ts.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/api/types.ts`,
          templateFile: 'plop-templates/entity/api.types.ts.hbs',
        },

        // MODEL
        {
          type: 'add',
          path: `${basePath}/model/{{className name}}.ts`,
          templateFile: 'plop-templates/entity/class.ts.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/model/{{storeFile name}}.ts`,
          templateFile: 'plop-templates/entity/store.ts.hbs',
        },
        { type: 'add', path: `${basePath}/model/types.ts`, template: '' },

        // Public API
        {
          type: 'add',
          path: `${basePath}/index.ts`,
          templateFile: 'plop-templates/entity/index.ts.hbs',
        },
      ]
    },
  })
}

function createComponentsTemplate(plop) {
  // WIDGETS, FEATURES, PAGES COMPONENTS
  plop.setHelper('combinedName', (group, name, layer) => {
    if (layer === 'pages') return `${name}-page`
    if (!group || String(group).trim() === '') return name
    return `${group}-${name}`
  })

  plop.setGenerator('component', {
    description: 'Создать компонент (feature/widget/page)',
    prompts: [
      {
        type: 'list',
        name: 'layer',
        message: 'Выберите уровень:',
        choices: ['features', 'widgets', 'pages'],
      },
      {
        type: 'input',
        name: 'group',
        message:
          'Опциональная группа (например, sale, user, или оставьте пустым):',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Имя компонента (короткое, например: table):',
      },
    ],
    actions: function (data) {
      const basePath = path.join(
        'src',
        data.layer,
        data.group ? data.group : '',
        plop.getHelper('kebabCase')(data.name),
      )

      const indexTemplate =
        data.layer === 'pages'
          ? 'plop-templates/component/index.page.ts.hbs'
          : 'plop-templates/component/index.ts.hbs'

      return [
        {
          type: 'add',
          path: `${basePath}/ui/{{kebabCase (combinedName group name layer)}}.tsx`,
          templateFile: 'plop-templates/component/ui/Component.tsx.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/ui/{{kebabCase (combinedName group name layer)}}.module.css`,
          templateFile: 'plop-templates/component/ui/Component.module.css.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/ui/{{kebabCase (combinedName group name layer)}}.test.tsx`,
          templateFile: 'plop-templates/component/tests/Component.test.tsx.hbs',
        },
        {
          type: 'add',
          path: `${basePath}/index.ts`,
          templateFile: indexTemplate,
        },
      ]
    },
  })
}

function createSharedComponentTemplate(plop) {
  plop.setGenerator('shared-ui', {
    description: 'Создать компонент в shared/ui',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Имя компонента (например: button, input, modal):',
      },
    ],
    actions(data) {
      const base = 'src/shared/ui/{{kebabCase name}}'
      return [
        {
          type: 'add',
          path: base + '/{{kebabCase name}}.tsx',
          templateFile: 'plop-templates/shared-ui/component.tsx.hbs',
        },
        {
          type: 'add',
          path: base + '/{{kebabCase name}}.test.tsx',
          templateFile: 'plop-templates/shared-ui/component.test.tsx.hbs',
        },
        {
          type: 'add',
          path: base + '/{{kebabCase name}}.module.css',
          templateFile: 'plop-templates/shared-ui/component.module.css.hbs',
        },
      ]
    },
  })
}

export default function (plop) {
  createEntityTemplate(plop)
  createComponentsTemplate(plop)
  createSharedComponentTemplate(plop)
}
