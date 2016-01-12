FROM node:5.3.0
MAINTAINER treelite <c.xinle@gmail.com>

ENV CI true

WORKDIR /lib/node_modules/gnm

ADD node_modules node_modules

ADD output output
ADD test/jasmine.json test/

ENTRYPOINT ["./node_modules/.bin/jasmine", "JASMINE_CONFIG_PATH=test/jasmine.json"]
