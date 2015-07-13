# logstash-udp

Your log messages go to logstash UDP input (almost) without any overhead.

## Installation

```bash
npm i lsudp --save
```

## Usage

Somewhere in the app entry module:

```js
var logstash = require('lsudp');
logstash.init({
	appName: 'my-app-1',
	host: 'logstash.mycompany.com',
	port: 7777
});
```

In any module then:

```js
var logstash = require('lsudp')('my-folder/my-module');
logstash.error('oh no! json: %j, number: %d, string: %s', {everything: 'is broken'}, 1000, 'times');
```

Will cause logstash receive following over UDP:

```json
{
	"@timestamp": "Date as ISO string here",
	"type": "my-app-1",
	"source": "my-folder/my-module",
	"level": "ERROR",
	"message": "oh no! json: {\"everything\": \"is broken\"}, number: 1000, string: times"
}
```

## Notes

If `lsudp` encounters transport level error, it will output it to `stderr` in stringified form.

## License

MIT
