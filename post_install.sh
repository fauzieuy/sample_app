#!/bin/bash
if [ -d "node_modules/@polymer" ];
then
  echo "Polymer Components";
  rsync -av node_modules/@polymer app/javascript/;
  rm -rf node_modules/@polymer;
fi

if [ -d "node_modules/@vaadin" ];
then
  echo "Vaadin Components";
  rsync -av node_modules/@vaadin app/javascript/;
  rm -rf node_modules/@vaadin;
fi

if [ -d "node_modules/@webcomponents" ];
then
  echo "Webcomponents";
  rsync -av node_modules/@webcomponents app/javascript/;
  rm -rf node_modules/@webcomponents;
fi

if [ -d "node_modules/multiselect-combo-box" ];
then
  echo "multiselect combo box";
  rsync -av node_modules/multiselect-combo-box app/javascript/;
  rm -rf node_modules/multiselect-combo-box;
fi