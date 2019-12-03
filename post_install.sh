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