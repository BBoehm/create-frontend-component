'use strict'

const gulp = require('gulp')
const path = require('path')
const rename = require('gulp-rename')
const template = require('gulp-template')
const { toTitleCase, toFirstLetterLowerCase, toUpperCamelCase } = require('./utilities')

/**
 * @param {string} fullTemplatePath 
 * @param {string} componentPath 
 * @param {string} name 
 * @param {string} componentType 
 * @param {string} flavour
 * @param {Array<string>} availableFlavours
 * @return {any}
 */
function generateComponentFiles (fullTemplatePath, componentPath, name, componentType, flavour, availableFlavours) {
  if (name !== name.toLowerCase()) {
    throw new Error(`component name '${name}' is not allowed, please use kebab case names eg. foo-bar-toolbar`)
  }

  const effectiveFlavour = (flavour || 'default').trim()

  if (!availableFlavours.includes(effectiveFlavour)) {
    throw new Error(`flavour '${effectiveFlavour}' does not exist, choose one of: ${availableFlavours}`)
  }

  const upperCamelCaseName = toUpperCamelCase(name)
  const relativeDestinationPath = componentType ? path.join(componentType, upperCamelCaseName) : upperCamelCaseName
  const resolvedTemplatePath = path.join(
    fullTemplatePath,
    effectiveFlavour,
    'ComponentTemplate/**/*.**'
  )

  return gulp.src(resolvedTemplatePath)
    .pipe(template({
      name: name,
      componentType: componentType ? toTitleCase(componentType) : 'Component',
      upperCamelCaseName: upperCamelCaseName,
      lowerCamelCaseName: toFirstLetterLowerCase(toUpperCamelCase(name)),
      destinationPath: relativeDestinationPath,
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('ComponentTemplate', upperCamelCaseName)
    }))
    .pipe(gulp.dest(path.join(componentPath, relativeDestinationPath)))
}

exports.generateComponentFiles = generateComponentFiles
