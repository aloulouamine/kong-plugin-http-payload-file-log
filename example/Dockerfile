FROM kong
LABEL maintainer=amine.aloulou.tn@gmail.com
USER root
# Example for JavaScript:
RUN apk update && apk add nodejs npm && npm install -g kong-pdk
COPY index.js /usr/local/kong/js-plugins/http-payload-file-log.js

RUN  /usr/local/bin/kong-js-pluginserver --plugins-directory /usr/local/kong/js-plugins &
COPY example/config/kong/kong.conf /etc/kong/kong.conf
COPY example/config/kong/kong.yml /etc/kong/kong.yml

# reset back the defaults
USER kong
EXPOSE 8000 8443 8001 8444