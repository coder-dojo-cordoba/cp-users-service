'use strict';

require('newrelic');
var _ =require('lodash');

var config = require('./config/config.js')();
var ESOptions = require('./es-options.js');

var seneca = require('seneca')();

seneca.log.info('using config', JSON.stringify(config, null, 4));

seneca.options(config);

seneca.use('postgresql-store', config["postgresql-store"]);
seneca.use('elasticsearch', _.defaults(config["elasticsearch"], ESOptions));
seneca.use(require('./es.js'));
seneca.use('mail', config['mail']);
seneca.use(require('./email-notifications.js'));
seneca.use(require('./agreements.js'));
seneca.use(require('./profiles.js'));
seneca.use(require('./oauth2.js'), config.oauth2);
seneca.use(require('./users.js'));
seneca.use('user');


// test stuff - do not commit
var msg = { user: {id:'22da5bf6-859e-4e02-994f-8f9147b36bb0'},
  cmd: 'authorize',
  role: 'cd-oauth2',
  response_type: 'code',
  redirect_uri: 'http://localhost:4567/auth/coderdojo/callback',
  scope: '',
  client_id: 'coderdojoforums'
};
seneca.act(msg, function() {
  console.log(arguments);
});

seneca.listen()
  .client({type: 'web', host: process.env.TARGETIP || '127.0.0.1', port: 10301, pin: 'role:cd-dojos,cmd:*'});
