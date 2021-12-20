#!/usr/bin/env bash

window=false
if [ "$OSTYPE" = "msys" ] ; then
  window=true;
elif [[ "$OSTYPE" == "cygwin" ]]; then
  window=true;
elif [[ "$OSTYPE" == "win32" ]]; then
  window=true;
elif [[ "$OSTYPE" == "darwin20.0" ]]; then
  window=true;
fi

ROOT_DIR=`cd "$bin"; pwd`

if $window; then
  ROOT_DIR=`cygpath --absolute --windows "$ROOT_DIR"`
fi

function has_opt() {
  OPT_NAME=$1
  shift
  #Par the parameters
  for i in "$@"; do
    if [[ $i == $OPT_NAME ]] ; then
      echo "true"
      return
    fi
  done
  echo "false"
}

function git_pull() {
  DIR=$1
  echo -e "#git pull in directory $DIR#"
  cd $DIR && git pull origin develop
  echo -e "\n"
}

function gradle_build() {
  DIR=$1
  echo -e "#gradle build in directory $DIR#"
  cd $DIR && gradle clean build -x test eclipse
  echo -e "\n"
}

function gradle_test() {
  DIR=$1
  echo -e "#gradle build in directory $DIR#"
  cd $DIR && gradle clean build eclipse
  echo -e "\n"
}

function git_update() {
  DIR=$1
  echo -e "#git  update in directory $DIR#"
  cd $DIR && git add . && git commit -m "update" && git push origin develop
  echo -e "\n"
}

function git_bug() {
  DIR=$1
  echo -e "#git  fix bug in directory $DIR#"
  cd $DIR && git add . && git commit -m "fix bug" && git push origin develop
  echo -e "\n"
}

function git_clean() {
  DIR=$1
  echo -e "#git clean code in directory $DIR#"
  cd $DIR && git add . && git commit -m "clean code" && git push origin develop
  echo -e "\n"
}


COMMAND=$1
shift


if [ "$COMMAND" = "pull" ] ; then
  git_pull $ROOT_DIR
elif [ "$COMMAND" = "build" ] ; then
  gradle_build $ROOT_DIR
elif [ "$COMMAND" = "test" ] ; then
  gradle_test $ROOT_DIR
elif [ "$COMMAND" = "update" ] ; then
  git_update $ROOT_DIR
elif [ "$COMMAND" = "bug" ] ; then
  git_bug $ROOT_DIR
elif [ "$COMMAND" = "clean" ] ; then
  git_clean $ROOT_DIR
else
  echo 'Usage: '
  echo 'pull: pull to develop branch'
  echo 'build: build project with gradle'
  echo 'test: build project with gradle with unitTest'
  echo 'update, bug, clean : git push origin dev branch'
fi
