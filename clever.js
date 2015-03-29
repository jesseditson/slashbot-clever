var Cleverbot = require('cleverbot-node')
var cleverbot = new Cleverbot()
var debug = require('debug')('slashbot-clever')

/**
 * clever listener
 * this is a function that will be called whenever a message is sent to a channel our slashbot is in.
 *
 * A listener will be called with the following scope:
 * this.slack - an instance of `node-slack-client`.
 * this.channel - an instance of a channel object. (the channel the message was sent to)
 * this.user - an instance of a user object. (the user that sent the message)
 * this.name - our bot name.
 * this.respond - a method to send a more customized response back to slack. Check out the slashbot docs for more on the respond method.
 *
 * @param {string} message - the message received
 * @param {callback} [callback] - a callback to call with a response.
 */
var clever = function(message,callback) {
  var botName = this.name
  var pattern = new RegExp('^(.*)@?' + botName + ':?(.*)$','i')
  var matches = message.match(pattern)
  // skip if we didn't mention the bot
  if(!matches || !matches.length) return

  // assemble the string we sent, minus the bot name.
  var string = matches.slice(1).join(' ').trim()

  // send it to cleverbot and send the response back to the user.
  cleverbot.write(string, function(response){
    debug('got response from cleverbot: %s',JSON.stringify(response))
    callback(null,response.message)
  })

  /**
   * If we return false, this will stop other listeners from being executed after this one.
   * In our case, we want to allow listening to continue, so we'll return true.
   * Skipping the return statement (or returning undefined) would have the same effect.
   */
  return true
}

/**
 * match - we can specify a match property on the exported function to limit matches to this object.
 * In this case however, we want to dynamically generate a match regex, so we're doing it in the listener
 * instead of on the function.
 *
 * If we wanted to specify something more simple, we can do it here:
 *
 * clever.match = <regex>
 */

/**
 * export our listener function
 */
module.exports = clever
