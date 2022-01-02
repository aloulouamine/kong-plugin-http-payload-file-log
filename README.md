# kong-plugin-http-payload-file-log

TODO

## Plugin in action

### Requirements 

- Docker & Docker compose
- curl

### Description

Example will start a kong instance and an example api called [foggy](https://github.com/aloulouamine/foggy).

This this example is used as developer environment. 

When js plugin change kong should be restarted.

### Configuration

- [kong configuration](example/config/kong/kong.conf) enables js plugin server.
- [kong declarative configuration](example/config/kong/kong.yml) declare `foggy` service and route with `/foggy` context path then enables http-payload-file-log plugin on it.

### Run

```bash
docker-compose up -d
```

### Example

```bash
curl --request GET \
  --url http://localhost:9000/foggy/api/user
```

Response should be something like:

```json
{
	"name": "Thomas Sanchez",
	"birthday": "Tue Mar 26 00:24:39 UTC 1974",
	"email": "ipue32@gmail.com",
	"mobile": "0692800513",
	"iban": "MT31QWDG66590wxenqcL5u5dtlUrF74",
	"bic": "LQVXVWY6"
}
```

## TODO

- [ ] implement http payload file logging
- [x] create an integration example (use it as dev env)
- [ ] write readme documentation
- [ ] define response and request paylaod log size limit
- [ ] support http payload log anonymization
- [ ] benchmarking request time
- [ ] support content encodings